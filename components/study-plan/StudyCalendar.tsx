/* eslint-disable react-hooks/set-state-in-effect */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

/*
  StudyCalendar.tsx  — Student Coach Experience (authenticated)
  ─────────────────────────────────────────────────────────────
  Three tabs:
    1. TODAY   — coach-style daily todo list, mark done, syncs progress
    2. WEEKLY  — week-by-week topic breakdown with progress bars
    3. SYLLABUS — full section/subsection/topic tree with completion state

  Adapted for the new study_plans table:
    - getStudyplanById now returns flat scalar columns merged with live JSONB.
    - weekly_plan and syllabus are still the only two mutable JSONB blobs.
    - hoursPerWeekday / hoursPerWeekend come from the response directly.
*/

import { useEffect, useState, useCallback, useRef } from "react";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { studyPlannerService } from "@/services/StudyPlan.service";

// ─────────────────────────────── Types ───────────────────────────────────────

interface TopicEntry {
  id: string;
  title: string;
  weightage?: "HIGH" | "MEDIUM" | "LOW";
  allocatedHours: number;
  totalHours: number;
  isContinued?: boolean;
  isRevision?: boolean;
  revisionReason?: string;
  isWeak?: boolean;
  isCompleted: boolean;
}
interface SubSectionEntry { id: string; title: string; topics: TopicEntry[] }
interface SectionEntry    { id: string; title: string; subSections: SubSectionEntry[] }
interface WeekEntry {
  week: number; startDate: string; endDate: string;
  totalHours: number; allocatedHours: number; unusedHours: number;
  isRevision: boolean; revisionNote?: string; sections: SectionEntry[];
}
interface SyllabusTopicEntry {
  id: string; title: string; weightage?: string;
  estimatedHours: number; isWeak?: boolean; isCompleted: boolean;
}
interface SyllabusSubSection { id: string; title: string; topics: SyllabusTopicEntry[] }
interface SyllabusSection    { id: string; title: string; subSections: SyllabusSubSection[] }
interface TodayTopicEntry {
  topicId: string; title: string; weightage?: string;
  allocatedHours: number; isCompleted: boolean;
  isRevision?: boolean; isWeak?: boolean; revisionReason?: string;
  sectionId: string; sectionTitle: string;
  subSectionId: string; subSectionTitle: string;
  weekNumber: number;
}
interface CoachMessage { emoji: string; headline: string; body: string }
interface FreeTimeInfo { freeWeeks: number; freeHours: number; contentWeeks: number; revisionWeeks: number }
interface FeasibilityInfo {
  isShortOnTime: boolean; shortByHours: number; surplusHours: number;
  coveredTopicsCount: number; uncoveredTopicsCount: number;
  uncoveredTopics: { id:string; title:string; weightage:string; estimatedHours:number; sectionTitle?:string }[];
  rescueSuggestions?: { pushExamByDays:number; addHoursPerDay:number; suggestedExamDate:string } | null;
}

/**
 * Shape returned by getStudyplanById (post-migration).
 * Flat scalars + live JSONB blobs.
 */
interface StudyPlanData {
  id?:                 string | number;
  entrance?:           { id: string; title: string };
  exam?:               { id: string; title: string };
  totalHoursAvailable?: number;
  requiredHours?:       number;
  timeCategory?:        "tight" | "normal" | "relaxed";
  prepRequirement?:     { minDays:number; recommendedDays:number; totalDays:number };
  weakAreas?:           { subSectionCount:number; topicCount:number };
  freeTime?:            FreeTimeInfo;
  feasibility?:         FeasibilityInfo;
  weekly_plan:          WeekEntry[];
  syllabus?:            SyllabusSection[];
  // From plan_snapshot.inputs (returned directly by the new controller)
  hoursPerWeekday?:     number;
  hoursPerWeekend?:     number;
  prepLevel?:           string;
  prepStartDate?:       string;
  examDate?:            string;
  createdAt?:           string;
}

// ─────────────────────────────── Helpers ─────────────────────────────────────

function calcProgress(weeks: WeekEntry[]) {
  let total = 0, done = 0;
  for (const w of weeks) for (const s of w.sections) for (const ss of s.subSections)
    for (const t of ss.topics) { total++; if (t.isCompleted) done++; }
  return { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}
function calcWeekProgress(week: WeekEntry) {
  let total = 0, done = 0;
  for (const s of week.sections) for (const ss of s.subSections)
    for (const t of ss.topics) { total++; if (t.isCompleted) done++; }
  return { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}
function fmtDate(str: string) {
  return new Date(str).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
function todayStr() { return new Date().toISOString().split("T")[0]; }

// ── Weightage ─────────────────────────────────────────────────────────────────
const W_PILL: Record<string, string> = {
  HIGH:   "bg-rose-100   text-rose-700   border border-rose-200",
  MEDIUM: "bg-amber-100  text-amber-700  border border-amber-200",
  LOW:    "bg-sky-100    text-sky-600    border border-sky-200",
};
const W_LABEL: Record<string, string> = { HIGH: "High", MEDIUM: "Med", LOW: "Low" };
const W_BAR:   Record<string, string> = { HIGH: "bg-rose-400", MEDIUM: "bg-amber-500", LOW: "bg-sky-400" };

// ── SVG ring ──────────────────────────────────────────────────────────────────
function Ring({ pct, size = 56 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2, circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} strokeWidth={6} stroke="#e2e8f0" fill="none" />
      <circle cx={size/2} cy={size/2} r={r} strokeWidth={6}
        stroke={pct === 100 ? "#16a34a" : "#d97706"} fill="none"
        strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray .7s cubic-bezier(.4,0,.2,1)" }} />
    </svg>
  );
}

// ── Save indicator ────────────────────────────────────────────────────────────
function SaveIndicator({ status }: { status: "idle"|"saving"|"saved"|"error" }) {
  if (status === "idle") return null;
  return (
    <span className={[
      "text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all",
      status === "saving" ? "bg-amber-50 text-amber-600 border-amber-200"
      : status === "saved" ? "bg-green-50 text-green-600 border-green-200"
      : "bg-rose-50 text-rose-600 border-rose-200",
    ].join(" ")}>
      {status === "saving" ? "Saving…" : status === "saved" ? "✓ Saved" : "Save failed"}
    </span>
  );
}

// ── Free time widget ──────────────────────────────────────────────────────────
const FREE_OPTS = [
  { id:"mock",     icon:"📝", label:"Mock Tests",      desc:"Simulate exam conditions" },
  { id:"revision", icon:"🔁", label:"Extra Revision",  desc:"Deeper on weak areas"     },
  { id:"rest",     icon:"😴", label:"Rest & Recharge", desc:"You've earned it"         },
  { id:"mixed",    icon:"⚡", label:"Mixed Approach",  desc:"A bit of everything"      },
];
const FREE_TIPS: Record<string,string> = {
  mock:     "Aim for 1 full mock every 2–3 days. Review every mistake the next morning.",
  revision: "Pick 3 weakest topics, give each a focused 2h deep-dive session.",
  rest:     "Light reading, walks, early sleep — your brain consolidates during rest.",
  mixed:    "Rotate: 2 study days → 1 mock → 1 rest day throughout the free period.",
};
function FreeTimeWidget({ freeTime }: { freeTime: FreeTimeInfo }) {
  const [chosen, setChosen] = useState<string|null>(null);
  if (freeTime.freeWeeks <= 0) return null;
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-lg shrink-0">🎉</div>
        <div>
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Free Time</p>
          <p className="text-sm font-bold text-cyan-900 mt-0.5">
            {freeTime.freeWeeks} free week{freeTime.freeWeeks>1?"s":""} · ~{freeTime.freeHours}h spare
          </p>
        </div>
      </div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">How do you want to use them?</p>
      <div className="grid grid-cols-2 gap-2">
        {FREE_OPTS.map(o => (
          <button key={o.id} onClick={() => setChosen(c => c===o.id ? null : o.id)}
            className={["flex flex-col text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer",
              chosen===o.id ? "bg-amber-600 border-amber-600" : "bg-white border-gray-200 hover:border-amber-400"].join(" ")}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-sm">{o.icon}</span>
              <span className={["text-[11px] font-bold", chosen===o.id ? "text-white" : "text-cyan-900"].join(" ")}>{o.label}</span>
            </div>
            <span className={["text-[10px]", chosen===o.id ? "text-amber-100" : "text-gray-400"].join(" ")}>{o.desc}</span>
          </button>
        ))}
      </div>
      {chosen && (
        <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <span className="text-sm shrink-0 mt-0.5">💡</span>
          <p className="text-[11px] text-amber-800 leading-relaxed">{FREE_TIPS[chosen]}</p>
        </div>
      )}
    </div>
  );
}

// ── Tight banner ──────────────────────────────────────────────────────────────
function TightBanner({ feasibility, prepReq }: { feasibility: FeasibilityInfo; prepReq?: any }) {
  const [open, setOpen] = useState(false);
  const r = feasibility.rescueSuggestions;
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl overflow-hidden">
      <div className="p-4 sm:p-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-lg shrink-0">⚡</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-cyan-900">
            Tight timeline — {feasibility.uncoveredTopicsCount} topic{feasibility.uncoveredTopicsCount!==1?"s":""} could not fit
          </p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {prepReq && <>{prepReq.totalDays}d available vs min {prepReq.minDays}d needed. </>}
            Short by <span className="font-bold text-rose-600">{Math.round(feasibility.shortByHours)}h</span>. HIGH topics protected first.
          </p>
          {r && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-white border border-rose-100 rounded-xl px-3 py-2.5">
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Option A</p>
                <p className="text-sm font-bold text-cyan-900 mt-1">Push by {r.pushExamByDays} days</p>
                <p className="text-[10px] text-gray-400 mt-0.5">New date: {new Date(r.suggestedExamDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"2-digit"})}</p>
              </div>
              <div className="bg-white border border-rose-100 rounded-xl px-3 py-2.5">
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Option B</p>
                <p className="text-sm font-bold text-cyan-900 mt-1">+{r.addHoursPerDay}h per day</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Keep the same exam date</p>
              </div>
            </div>
          )}
          <button onClick={() => setOpen(p=>!p)}
            className="mt-3 text-[11px] font-semibold text-rose-600 underline underline-offset-2 cursor-pointer">
            {open?"Hide":"Show"} {feasibility.uncoveredTopicsCount} skipped topics
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-rose-100 px-4 sm:px-5 py-3 flex flex-col gap-1.5">
          {feasibility.uncoveredTopics.map(t => (
            <div key={t.id} className="flex items-center gap-2.5 bg-white border border-rose-100 rounded-xl px-3 py-2">
              <span className={["w-2 h-2 rounded-full shrink-0", W_BAR[t.weightage]??"bg-gray-300"].join(" ")} />
              <span className="flex-1 min-w-0 text-xs font-medium text-gray-700 truncate">{t.title}</span>
              {t.sectionTitle && <span className="text-[10px] text-gray-400 hidden sm:block shrink-0">{t.sectionTitle}</span>}
              <span className="text-xs font-bold text-rose-600 shrink-0">{t.estimatedHours}h</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Week tab ──────────────────────────────────────────────────────────────────
function WeekTab({ w, idx, activeWeek, onClick }: { w:WeekEntry; idx:number; activeWeek:number; onClick:()=>void }) {
  const wp  = calcWeekProgress(w);
  const act = activeWeek === idx;
  return (
    <button onClick={onClick}
      className={["flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border transition-all shadow cursor-pointer shrink-0 min-w-[64px]",
        act ? "bg-amber-600/90 border-amber-600 shadow-md" : "bg-white border-gray-200 hover:border-amber-600"].join(" ")}>
      <span className={["text-[11px] font-bold uppercase tracking-widest leading-none w-20", act?"text-white":"text-cyan-900"].join(" ")}>
        {w.isRevision?"Rev":"Week"} {w.week}
      </span>
      <span className={["text-[10px] whitespace-nowrap leading-none mt-1", act?"text-white/80":"text-gray-500"].join(" ")}>
        {fmtDate(w.startDate)}
      </span>
      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden mt-0.5">
        <div className={["h-full rounded-full transition-all duration-500", wp.pct===100?"bg-green-500":"bg-green-600"].join(" ")}
          style={{ width:`${wp.pct}%` }} />
      </div>
    </button>
  );
}

// ── Week rail ─────────────────────────────────────────────────────────────────
function WeekRail({ label, weeks, allWeeks, activeWeek, onSelect }:
  { label:string; weeks:WeekEntry[]; allWeeks:WeekEntry[]; activeWeek:number; onSelect:(i:number)=>void }) {
  if (!weeks.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200">
        <p className="text-[10px] font-bold text-cyan-900 uppercase tracking-widest">{label}</p>
        <span className="text-[10px] text-gray-400">{weeks.length} week{weeks.length!==1?"s":""}</span>
      </div>
      <div className="flex gap-2 px-4 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {weeks.map(w => {
          const idx = allWeeks.indexOf(w);
          return <WeekTab key={idx} w={w} idx={idx} activeWeek={activeWeek} onClick={()=>onSelect(idx)} />;
        })}
      </div>
    </div>
  );
}

// ── Topic row ─────────────────────────────────────────────────────────────────
function TopicRow({ topic, onToggle, disabled }: { topic:TopicEntry; onToggle:()=>void; disabled?:boolean }) {
  const bar = topic.isCompleted ? "bg-green-500"
    : topic.isRevision ? "bg-violet-400"
    : (W_BAR[topic.weightage??""]) ?? "bg-gray-200";
  return (
    <button onClick={() => { if (!disabled) onToggle(); }}
      className={["w-full flex items-stretch rounded-xl border transition-all overflow-hidden text-left group",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        topic.isCompleted ? "bg-green-50 border-green-200" : "bg-white border-gray-100 hover:border-cyan-300 hover:shadow-sm",
      ].join(" ")}>
      <span className={["w-0.75 shrink-0", bar].join(" ")} />
      <div className="flex items-center gap-2.5 flex-1 px-3 py-2.5">
        <div className={["w-4 h-4 rounded-md border-2 shrink-0 flex items-center justify-center transition-all",
          topic.isCompleted ? "bg-green-600 border-green-600" : "border-gray-300 group-hover:border-cyan-400"].join(" ")}>
          {topic.isCompleted && (
            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0 flex items-center flex-wrap gap-x-2 gap-y-0.5">
          <span className={["text-[13px] font-medium leading-snug",
            topic.isCompleted ? "line-through text-gray-400" : "text-gray-800"].join(" ")}>
            {topic.title}
          </span>
          {topic.weightage && !topic.isCompleted && (
            <span className={["text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0",
              W_PILL[topic.weightage]??"bg-gray-100 text-gray-500 border border-gray-200"].join(" ")}>
              {W_LABEL[topic.weightage]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {topic.isRevision ? <span className="text-[11px]" title={topic.revisionReason}>🔁</span>
          : topic.isWeak ? <span className="text-[11px]" title="Weak area">⚠️</span>
          : topic.isContinued ? <span className="text-[11px]" title="Continues from last week">↩️</span>
          : null}
          <span className={["text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums",
            topic.isCompleted ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"].join(" ")}>
            {topic.allocatedHours}h
          </span>
        </div>
      </div>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
//  TODAY TAB
// ══════════════════════════════════════════════════════════════
function TodayTab({
  planId, weeks, hoursPerWeekday, hoursPerWeekend, mode, onToggle,
}: {
  planId?:         string|number;
  weeks:           WeekEntry[];
  hoursPerWeekday: number;
  hoursPerWeekend: number;
  mode:            "normal"|"preview";
  onToggle:        (wi:number,sId:string,ssId:string,tId:string) => void;
}) {
  const today   = todayStr();
  const todayMom = new Date(today);
  const currentWeek = weeks.find(w => {
    const ws = new Date(w.startDate), we = new Date(w.endDate);
    return todayMom >= ws && todayMom <= we;
  }) ?? null;

  const lastWeek   = weeks[weeks.length - 1];
  const examEndStr = lastWeek?.endDate;
  const daysLeft   = examEndStr
    ? Math.ceil((new Date(examEndStr).getTime() - todayMom.getTime()) / 86400000)
    : 0;

  const todayDow   = todayMom.getDay();
  const todayHours = (todayDow === 0 || todayDow === 6) ? hoursPerWeekend : hoursPerWeekday;

  const WEIGHT_PRIORITY: Record<string,number> = { HIGH:1, MEDIUM:2, LOW:3 };
  const pending: TodayTopicEntry[] = [], completed: TodayTopicEntry[] = [];

  if (currentWeek) {
    for (const section of currentWeek.sections) {
      for (const ss of section.subSections) {
        for (const topic of ss.topics) {
          const entry: TodayTopicEntry = {
            topicId:         topic.id,
            title:           topic.title,
            weightage:       topic.weightage,
            allocatedHours:  topic.allocatedHours,
            isCompleted:     topic.isCompleted,
            isRevision:      topic.isRevision,
            isWeak:          topic.isWeak,
            revisionReason:  topic.revisionReason,
            sectionId:       section.id,
            sectionTitle:    section.title,
            subSectionId:    ss.id,
            subSectionTitle: ss.title,
            weekNumber:      currentWeek.week,
          };
          if (topic.isCompleted) completed.push(entry);
          else                   pending.push(entry);
        }
      }
    }
    pending.sort((a,b) => {
      if (!!a.isWeak !== !!b.isWeak) return a.isWeak ? -1 : 1;
      return (WEIGHT_PRIORITY[a.weightage ?? "MEDIUM"] ?? 2) - (WEIGHT_PRIORITY[b.weightage ?? "MEDIUM"] ?? 2);
    });
  }

  let coachMessage: CoachMessage;
  if (daysLeft <= 0)       coachMessage = { emoji:"🏁", headline:"Exam day is here!", body:"Take a deep breath. Trust yourself." };
  else if (daysLeft === 1) coachMessage = { emoji:"🌅", headline:"Last day before the exam!", body:"Light revision only. Relax early, sleep well." };
  else if (daysLeft <= 3)  coachMessage = { emoji:"⚡", headline:`${daysLeft} days to go — final sprint!`, body:"Quick-fire revision of HIGH-priority topics. Consolidate what you know." };
  else if (currentWeek?.isRevision) coachMessage = { emoji:"🔁", headline:"Revision week — strengthen the foundations.", body:"Re-visit topics you felt shaky on. Active recall beats re-reading." };
  else if (!currentWeek)   coachMessage = { emoji:"📅", headline:"You're outside the scheduled weeks.", body:"Check your plan dates or relax — you're ahead!" };
  else if (pending.length === 0) coachMessage = { emoji:"🏆", headline:"You're all caught up!", body:`${daysLeft} days to exam. Use spare time for practice questions.` };
  else {
    const highCount = pending.filter(t => t.weightage==="HIGH").length;
    coachMessage = highCount > 0
      ? { emoji:"🎯", headline:`${pending.length} topic${pending.length>1?"s":""} pending — ${highCount} are HIGH priority.`, body:"Tackle HIGH-priority topics while your mind is fresh." }
      : { emoji:"📖", headline:`${pending.length} topic${pending.length>1?"s":""} lined up.`, body:`Small consistent steps — ${daysLeft} days to exam. Keep going!` };
  }

  const weekIdx = currentWeek ? weeks.findIndex(w => w.week === currentWeek.week) : -1;
  const cm = coachMessage;

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5">
      {/* Coach card */}
      <div className="bg-gradient-to-br from-cyan-900 to-cyan-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="relative">
          <div className="flex items-start gap-3">
            <span className="text-3xl shrink-0">{cm.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-extrabold text-base leading-tight">{cm.headline}</p>
              <p className="text-white/60 text-xs mt-1.5 leading-relaxed">{cm.body}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
              <span className="text-amber-400 text-sm">📅</span>
              <span className="text-white text-[11px] font-bold">
                {new Date(today).toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}
              </span>
            </div>
            {currentWeek && (
              <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
                <span className="text-amber-400 text-sm">{currentWeek.isRevision?"🔁":"📚"}</span>
                <span className="text-white text-[11px] font-bold">
                  {currentWeek.isRevision?"Revision":"Week"} {currentWeek.week}
                </span>
              </div>
            )}
            {daysLeft > 0 && (
              <div className={["flex items-center gap-1.5 rounded-xl px-3 py-1.5",
                daysLeft <= 7 ? "bg-rose-500/30" : "bg-white/10"].join(" ")}>
                <span className="text-amber-400 text-sm">⏳</span>
                <span className={["text-[11px] font-bold", daysLeft<=7?"text-rose-300":"text-white"].join(" ")}>
                  {daysLeft}d to exam
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
              <span className="text-amber-400 text-sm">🕐</span>
              <span className="text-white text-[11px] font-bold">{todayHours}h today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's topics */}
      {pending.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Today&apos;s Focus</p>
              <p className="text-sm font-bold text-cyan-900 mt-0.5">
                {pending.filter(t=>t.isCompleted).length}/{pending.length} done
              </p>
            </div>
            <div className="flex items-center gap-2">
              {pending.every(t=>t.isCompleted) && (
                <span className="text-lg animate-bounce">🎉</span>
              )}
              <div className="w-12 h-12 relative shrink-0">
                <Ring
                  pct={pending.length===0?0:Math.round(pending.filter(t=>t.isCompleted).length/pending.length*100)}
                  size={48}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-cyan-900">
                  {pending.length===0?0:Math.round(pending.filter(t=>t.isCompleted).length/pending.length*100)}%
                </span>
              </div>
            </div>
          </div>
          <div className="p-3 flex flex-col gap-1.5">
            {pending.map(t => {
              const topicAsEntry: TopicEntry = {
                id: t.topicId, title: t.title, weightage: t.weightage as any,
                allocatedHours: t.allocatedHours, totalHours: t.allocatedHours,
                isRevision: t.isRevision, isWeak: t.isWeak,
                revisionReason: t.revisionReason, isCompleted: t.isCompleted,
              };
              return (
                <TopicRow key={t.topicId} topic={topicAsEntry}
                  disabled={mode==="preview"}
                  onToggle={() => weekIdx >= 0 && onToggle(weekIdx, t.sectionId, t.subSectionId, t.topicId)} />
              );
            })}
          </div>
          {pending.every(t=>t.isCompleted) && (
            <div className="mx-3 mb-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
              <p className="text-sm font-bold text-green-700">All done for today! 🌟</p>
              <p className="text-xs text-green-600 mt-0.5">Incredible work. Rest, review, or get ahead.</p>
            </div>
          )}
        </div>
      )}

      {pending.length === 0 && completed.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-3 text-center">
          <span className="text-4xl">😴</span>
          <p className="text-sm font-bold text-gray-700">Nothing scheduled today.</p>
          <p className="text-xs text-gray-400">Light reading or past papers if you&apos;re keen.</p>
        </div>
      )}

      {completed.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Completed This Week</p>
            <p className="text-sm font-bold text-cyan-900 mt-0.5">{completed.length} topic{completed.length>1?"s":""} ✓</p>
          </div>
          <div className="p-3 flex flex-col gap-1.5">
            {completed.map(t => {
              const topicAsEntry: TopicEntry = {
                id: t.topicId, title: t.title, weightage: t.weightage as any,
                allocatedHours: t.allocatedHours, totalHours: t.allocatedHours,
                isRevision: t.isRevision, isWeak: t.isWeak,
                revisionReason: t.revisionReason, isCompleted: t.isCompleted,
              };
              return (
                <TopicRow key={t.topicId} topic={topicAsEntry}
                  disabled={mode==="preview"}
                  onToggle={() => weekIdx >= 0 && onToggle(weekIdx, t.sectionId, t.subSectionId, t.topicId)} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  WEEKLY TAB
// ══════════════════════════════════════════════════════════════
function WeeklyTab({ weeks, mode, onToggle }: {
  weeks:    WeekEntry[];
  mode:     "normal"|"preview";
  onToggle: (wi:number,sId:string,ssId:string,tId:string)=>void;
}) {
  const [activeWeek, setActiveWeek] = useState(0);

  useEffect(() => {
    const now = new Date(todayStr());
    const idx = weeks.findIndex(w => {
      const ws = new Date(w.startDate), we = new Date(w.endDate);
      return now >= ws && now <= we;
    });
    if (idx >= 0) setActiveWeek(idx);
  }, [weeks]);

  const studyWks = weeks.filter(w => !w.isRevision);
  const revWks   = weeks.filter(w =>  w.isRevision);
  const currWeek = weeks[activeWeek];

  if (!currWeek) return null;
  const weekProg = calcWeekProgress(currWeek);

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5">
      <WeekRail label="📚 Study Weeks"    weeks={studyWks} allWeeks={weeks} activeWeek={activeWeek} onSelect={setActiveWeek} />
      <WeekRail label="🔁 Revision Weeks" weeks={revWks}   allWeeks={weeks} activeWeek={activeWeek} onSelect={setActiveWeek} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-gray-100 bg-cyan-900">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-extrabold text-amber-400 leading-none">Week {currWeek.week}</h2>
                {currWeek.isRevision && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 uppercase tracking-widest">Revision</span>
                )}
              </div>
              <p className="text-xs text-gray-300 mt-2">
                {fmtDate(currWeek.startDate)} – {fmtDate(currWeek.endDate)}
                {" · "}<span className="text-amber-400 font-semibold">{currWeek.allocatedHours}h</span> planned
                {currWeek.unusedHours > 0.5 && <span className="text-gray-400"> · {currWeek.unusedHours}h spare</span>}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-xs font-bold text-gray-300 tabular-nums">{weekProg.done}/{weekProg.total}</span>
              <div className="w-16 h-1.5 bg-gray-600 rounded-full overflow-hidden">
                <div className={["h-full rounded-full transition-all duration-500",
                  weekProg.pct===100?"bg-green-500":currWeek.isRevision?"bg-violet-500":"bg-amber-500"].join(" ")}
                  style={{ width:`${weekProg.pct}%` }} />
              </div>
              {weekProg.pct===100 && <span className="text-[10px] font-bold text-green-400">Complete ✓</span>}
            </div>
          </div>
        </div>

        {currWeek.isRevision && currWeek.revisionNote && (
          <div className="flex items-center gap-2.5 mx-4 mt-4 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-base shrink-0">🔁</span>
            <p className="text-[13px] text-amber-700 leading-relaxed">{currWeek.revisionNote}</p>
          </div>
        )}

        <div className="p-4 sm:p-5">
          {currWeek.sections.length > 0 ? (
            <div className="columns-1 lg:columns-2 gap-3">
              {currWeek.sections.map((section, si) => {
                const secTopics = section.subSections.flatMap(ss => ss.topics);
                const secDone   = secTopics.filter(t => t.isCompleted).length;
                const secPct    = secTopics.length===0?0:Math.round((secDone/secTopics.length)*100);
                return (
                  <div key={si} className="break-inside-avoid mb-3 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-white">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <p className="text-sm font-bold text-amber-700 flex-1 min-w-0 leading-tight">{section.title}</p>
                        <span className="text-[11px] font-bold text-cyan-900 tabular-nums shrink-0">{secDone}/{secTopics.length}</span>
                      </div>
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className={["h-full rounded-full transition-all duration-500", secPct===100?"bg-green-500":"bg-amber-500"].join(" ")}
                          style={{ width:`${secPct}%` }} />
                      </div>
                    </div>
                    <div className="p-3 flex flex-col gap-3">
                      {section.subSections.map((ss, ssi) => (
                        <div key={ssi}>
                          <p className="text-xs font-bold text-cyan-900/80 uppercase tracking-widest mb-2">{ss.title}</p>
                          <div className="flex flex-col gap-1.5">
                            {ss.topics.map(topic => (
                              <TopicRow key={topic.id} topic={topic}
                                disabled={mode==="preview"}
                                onToggle={() => onToggle(activeWeek, section.id, ss.id, topic.id)} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-12 text-gray-300">
              <span className="text-3xl">🎯</span>
              <p className="text-sm">Nothing scheduled this week.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  SYLLABUS TAB
// ══════════════════════════════════════════════════════════════
function SyllabusTab({ syllabus }: { syllabus: SyllabusSection[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggleSection = (id: string) =>
    setExpanded(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  let total = 0, done = 0;
  for (const sec of syllabus) for (const ss of sec.subSections) for (const t of ss.topics) { total++; if (t.isCompleted) done++; }
  const pct = total===0 ? 0 : Math.round((done/total)*100);

  if (!syllabus.length) return (
    <div className="flex flex-col items-center gap-3 py-16 text-gray-300 p-4">
      <span className="text-4xl">📚</span>
      <p className="text-sm">No syllabus data available.</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
        <div className="relative shrink-0">
          <Ring pct={pct} size={52} />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-cyan-900">{pct}%</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Syllabus Coverage</p>
          <p className="text-base font-extrabold text-cyan-900 mt-0.5">
            {done} <span className="text-gray-400 text-sm font-normal">/ {total} topics completed</span>
          </p>
          <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width:`${pct}%` }} />
          </div>
        </div>
        {pct===100 && <span className="text-2xl animate-bounce">🏆</span>}
      </div>

      {syllabus.map(section => {
        const secTotal = section.subSections.flatMap(ss => ss.topics).length;
        const secDone  = section.subSections.flatMap(ss => ss.topics).filter(t => t.isCompleted).length;
        const secPct   = secTotal===0?0:Math.round((secDone/secTotal)*100);
        const isOpen   = expanded.has(section.id);

        return (
          <div key={section.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => toggleSection(section.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="text-sm font-bold text-amber-700 leading-tight">{section.title}</p>
                  <span className="text-[11px] font-bold text-cyan-900 shrink-0 tabular-nums">{secDone}/{secTotal}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={["h-full rounded-full transition-all duration-500", secPct===100?"bg-green-500":"bg-amber-500"].join(" ")}
                    style={{ width:`${secPct}%` }} />
                </div>
              </div>
              <svg className={["w-4 h-4 text-gray-400 shrink-0 transition-transform", isOpen?"rotate-180":""].join(" ")}
                viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6l4 4 4-4"/>
              </svg>
            </button>

            {isOpen && (
              <div className="border-t border-gray-100 bg-gray-50 p-3 flex flex-col gap-3">
                {section.subSections.map(ss => {
                  const ssDone = ss.topics.filter(t => t.isCompleted).length;
                  return (
                    <div key={ss.id}>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-xs font-bold text-cyan-900/80 uppercase tracking-widest">{ss.title}</p>
                        <span className="text-[10px] text-gray-400 tabular-nums">{ssDone}/{ss.topics.length}</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {ss.topics.map(topic => (
                          <div key={topic.id}
                            className={["flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-all",
                              topic.isCompleted ? "bg-green-50 border-green-200" : "bg-white border-gray-100"].join(" ")}>
                            <div className={["w-4 h-4 rounded-md border-2 shrink-0 flex items-center justify-center",
                              topic.isCompleted ? "bg-green-600 border-green-600" : "border-gray-300"].join(" ")}>
                              {topic.isCompleted && (
                                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <span className={["flex-1 text-[12px] font-medium leading-snug",
                              topic.isCompleted ? "line-through text-gray-400" : "text-gray-800"].join(" ")}>
                              {topic.title}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {topic.weightage && (
                                <span className={["text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide",
                                  W_PILL[topic.weightage]??"bg-gray-100 text-gray-500 border border-gray-200"].join(" ")}>
                                  {W_LABEL[topic.weightage]}
                                </span>
                              )}
                              {topic.isWeak && <span className="text-[10px]" title="Weak area">⚠️</span>}
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400 tabular-nums">
                                {topic.estimatedHours}h
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN — StudyCalendar
// ══════════════════════════════════════════════════════════════

type TabId = "today" | "weekly" | "syllabus";

export function StudyCalendar({
  studyPlan,
  mode = "normal",
}: {
  studyPlan: StudyPlanData | any;
  mode?:     "normal" | "preview";
}) {
  const [weeks,      setWeeks]      = useState<WeekEntry[]>([]);
  const [syllabus,   setSyllabus]   = useState<SyllabusSection[]>([]);
  const [activeTab,  setActiveTab]  = useState<TabId>("today");
  const [saveStatus, setSaveStatus] = useState<"idle"|"saving"|"saved"|"error">("idle");

  const saveTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const { showMessage } = useSnackbar();

  // Derive hours from the new response shape (returned directly by getStudyplanById)
  const hoursPerWeekday = (studyPlan?.hoursPerWeekday as number) ?? 2;
  const hoursPerWeekend = (studyPlan?.hoursPerWeekend as number) ?? 1;

  useEffect(() => {
    const raw = studyPlan?.weekly_plan;
    if (Array.isArray(raw) && raw.length > 0) setWeeks(raw as WeekEntry[]);
    const syl = studyPlan?.syllabus;
    if (Array.isArray(syl) && syl.length > 0)  setSyllabus(syl as SyllabusSection[]);
  }, [studyPlan?.weekly_plan, studyPlan?.syllabus]);

  // ── Persist progress to DB (debounced) ───────────────────────────────────
  const persistProgress = useCallback((updatedWeeks: WeekEntry[]) => {
    if (mode === "preview") return;
    const planId = studyPlan?.id;
    if (!planId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await studyPlannerService.saveProgress(planId, updatedWeeks);
        if (!res?.data?.ok) throw new Error("Server error");
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    }, 800);
  }, [studyPlan?.id, mode]);

  // ── Toggle a topic ────────────────────────────────────────────────────────
  const toggleTopic = useCallback((wi: number, sId: string, ssId: string, tId: string) => {
    if (mode === "preview") { showMessage("Save plan to track progress", "info"); return; }
    setWeeks(prev => {
      const updated = prev.map((w, i) => i !== wi ? w : {
        ...w,
        sections: w.sections.map(s => s.id !== sId ? s : {
          ...s,
          subSections: s.subSections.map(ss => ss.id !== ssId ? ss : {
            ...ss,
            topics: ss.topics.map(t => t.id === tId ? { ...t, isCompleted: !t.isCompleted } : t),
          }),
        }),
      });
      persistProgress(updated);
      setSyllabus(prevSyl => syncSyllabus(prevSyl, tId, updated));
      return updated;
    });
  }, [persistProgress, mode]);

  // ── Sync syllabus locally ─────────────────────────────────────────────────
  function syncSyllabus(
    syl:          SyllabusSection[],
    toggledId:    string,
    updatedWeeks: WeekEntry[],
  ): SyllabusSection[] {
    const baseId = toggledId.replace(/_rev$/, "");
    let newCompleted: boolean | null = null;

    outer: for (const week of updatedWeeks) {
      for (const section of week.sections) {
        for (const ss of section.subSections) {
          for (const topic of ss.topics) {
            if (!topic.isRevision && topic.id === baseId) {
              newCompleted = topic.isCompleted;
              break outer;
            }
          }
        }
      }
    }
    if (newCompleted === null) {
      outer: for (const week of updatedWeeks) {
        for (const section of week.sections) {
          for (const ss of section.subSections) {
            for (const topic of ss.topics) {
              if (topic.id.replace(/_rev$/, "") === baseId) {
                newCompleted = topic.isCompleted;
                break outer;
              }
            }
          }
        }
      }
    }
    if (newCompleted === null) return syl;

    return syl.map(sec => ({
      ...sec,
      subSections: sec.subSections.map(ss => ({
        ...ss,
        topics: ss.topics.map(t =>
          t.id === baseId ? { ...t, isCompleted: newCompleted as boolean } : t
        ),
      })),
    }));
  }

  if (!weeks.length) return (
    <div className="h-full flex flex-col items-center justify-center gap-3 bg-white text-gray-300">
      <span className="text-5xl">📭</span>
      <p className="text-sm">No study plan available.</p>
    </div>
  );

  const overall  = mode==="preview" ? { total:0, done:0, pct:0 } : calcProgress(weeks);
  const tc       = studyPlan?.timeCategory as string|undefined;
  const feasib   = studyPlan?.feasibility  as FeasibilityInfo|undefined;
  const freeTime = studyPlan?.freeTime     as FreeTimeInfo|undefined;
  const prepReq  = studyPlan?.prepRequirement;

  const studyWks = weeks.filter(w => !w.isRevision);
  const revWks   = weeks.filter(w =>  w.isRevision);

  const TABS: { id: TabId; label: string; emoji: string }[] = [
    { id:"today",    label:"Today",    emoji:"🎯" },
    { id:"weekly",   label:"Weekly",   emoji:"📅" },
    { id:"syllabus", label:"Syllabus", emoji:"📚" },
  ];

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden h-full">

      {/* ── Sticky header ─────────────────────────────────────────── */}
      <div className="shrink-0 bg-cyan-900 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <Ring pct={overall.pct} size={56} />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-white">
              {overall.pct}%
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">Overall Progress</p>
            <p className="text-white font-extrabold text-xl leading-tight mt-0.5">
              {overall.done}<span className="text-white/50 text-sm font-normal"> / {overall.total} topics</span>
            </p>
            <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width:`${overall.pct}%` }} />
            </div>
          </div>
          {mode !== "preview" && <SaveIndicator status={saveStatus} />}
          <div className="hidden sm:flex flex-wrap gap-1.5 shrink-0">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white/80 border border-white/10">
              {studyWks.length} study
            </span>
            {revWks.length > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-600/40 text-amber-200 border border-amber-400/30">
                {revWks.length} revision
              </span>
            )}
            {freeTime && freeTime.freeWeeks > 0 && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {freeTime.freeWeeks} free
              </span>
            )}
            {tc && (
              <span className={["text-[10px] font-bold px-2.5 py-1 rounded-full border",
                tc==="tight"  ? "bg-rose-500/20    text-rose-300    border-rose-400/30"
                :tc==="normal"? "bg-amber-500/20   text-amber-300   border-amber-400/30"
                :               "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"].join(" ")}>
                {tc==="tight"?"⚡ Tight":tc==="normal"?"📅 On Track":"✅ Relaxed"}
              </span>
            )}
          </div>
          {overall.pct===100 && <span className="text-2xl animate-bounce shrink-0">🏆</span>}
        </div>

        {tc === "tight" && feasib && (
          <div className="mt-3">
            <TightBanner feasibility={feasib} prepReq={prepReq} />
          </div>
        )}
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────── */}
      <div className="shrink-0 bg-white border-b border-gray-100 px-4 sm:px-6">
        <div className="flex gap-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={["flex items-center gap-1.5 px-4 py-3 text-[12px] font-bold border-b-2 transition-all cursor-pointer",
                activeTab===tab.id
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300"].join(" ")}>
              <span className="text-sm">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable body ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-[#f8f7f4]">
        {freeTime && freeTime.freeWeeks > 0 && activeTab !== "syllabus" && (
          <div className="px-4 sm:px-5 pt-4">
            <FreeTimeWidget freeTime={freeTime} />
          </div>
        )}

        {activeTab === "today" && (
          <TodayTab
            planId={studyPlan?.id}
            weeks={weeks}
            hoursPerWeekday={hoursPerWeekday}
            hoursPerWeekend={hoursPerWeekend}
            mode={mode}
            onToggle={toggleTopic}
          />
        )}
        {activeTab === "weekly" && (
          <WeeklyTab weeks={weeks} mode={mode} onToggle={toggleTopic} />
        )}
        {activeTab === "syllabus" && (
          <SyllabusTab syllabus={syllabus} />
        )}
      </div>
    </div>
  );
}