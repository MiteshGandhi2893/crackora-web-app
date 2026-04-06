/* eslint-disable react-hooks/set-state-in-effect */
"use client";

/*
  StudyPlanReadOnly.tsx — Preview mode for both guests AND logged-in users
  ─────────────────────────────────────────────────────────────────────────
  Scenarios handled:
    1. Guest user  → sees preview → clicks "Save" → login prompt → after
       auth, doSave() fires automatically via postAuthAction.
    2. Logged-in user → sees preview → clicks "Save" → if existing plan
       for same exam exists, shows replace-warning modal → confirms → saves.
  Topics are locked (no checkboxes). Progress rings are hidden.
*/

import { useState, useEffect, useCallback } from "react";
import { useAuth }   from "@/providers/AuthProvider";
import { useLoader } from "@/providers/LoadingProvider";
import { useRouter } from "next/navigation";
import { studyPlannerService, StudyPlanPayload } from "@/services/StudyPlan.service";

// ─────────────────────────────── Types ───────────────────────────────────────
interface TopicEntry {
  id: string; title: string; weightage?: "HIGH"|"MEDIUM"|"LOW";
  allocatedHours: number; totalHours: number; isContinued?: boolean;
  isRevision?: boolean; revisionReason?: string; isWeak?: boolean; isCompleted: boolean;
}
interface SubSectionEntry { id:string; title:string; topics:TopicEntry[] }
interface SectionEntry    { id:string; title:string; subSections:SubSectionEntry[] }
interface WeekEntry {
  week:number; startDate:string; endDate:string;
  totalHours:number; allocatedHours:number; unusedHours:number;
  isRevision:boolean; revisionNote?:string; sections:SectionEntry[];
}
interface SyllabusTopicEntry {
  id:string; title:string; weightage?:string;
  estimatedHours:number; isWeak?:boolean; isCompleted:boolean;
}
interface SyllabusSubSection { id:string; title:string; topics:SyllabusTopicEntry[] }
interface SyllabusSection    { id:string; title:string; subSections:SyllabusSubSection[] }
interface FeasibilityInfo {
  isShortOnTime:boolean; shortByHours:number; surplusHours:number;
  coveredTopicsCount:number; uncoveredTopicsCount:number;
  uncoveredTopics:{id:string;title:string;weightage:string;estimatedHours:number;sectionTitle?:string}[];
  rescueSuggestions?:{pushExamByDays:number;addHoursPerDay:number;suggestedExamDate:string}|null;
}


// ─────────────────────────────── Helpers ─────────────────────────────────────
function fmtDate(str:string) {
  return new Date(str).toLocaleDateString("en-IN",{day:"numeric",month:"short"});
}
function countTopics(weeks:WeekEntry[]) {
  let n=0;
  for(const w of weeks) for(const s of w.sections) for(const ss of s.subSections) n+=ss.topics.length;
  return n;
}
function todayStr() { return new Date().toISOString().split("T")[0]; }

// ── Weightage ─────────────────────────────────────────────────────────────────
const W_PILL: Record<string,string> = {
  HIGH:   "bg-rose-100   text-rose-700   border border-rose-200",
  MEDIUM: "bg-amber-100  text-amber-700  border border-amber-200",
  LOW:    "bg-sky-100    text-sky-600    border border-sky-200",
};
const W_LABEL: Record<string,string> = { HIGH:"High", MEDIUM:"Med", LOW:"Low" };
const W_BAR:   Record<string,string> = { HIGH:"bg-rose-400", MEDIUM:"bg-amber-500", LOW:"bg-sky-400" };

// ── Replace-warning modal ─────────────────────────────────────────────────────
function ReplaceModal({
  examTitle,
  existingDate,
  onConfirm,
  onCancel,
}: {
  examTitle:    string;
  existingDate: string;
  onConfirm:    () => void;
  onCancel:     () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">⚠️</div>
          <div>
            <p className="font-bold text-sm text-gray-900">Replace existing plan?</p>
            <p className="text-xs text-amber-700 mt-0.5">You already have a plan for {examTitle}</p>
          </div>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Your existing plan (saved{" "}
            <span className="font-semibold text-gray-800">
              {new Date(existingDate).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </span>
            ) will be permanently replaced with the new plan, including all progress.
          </p>
          <p className="text-xs text-rose-600 font-semibold mt-2">This action cannot be undone.</p>
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Keep existing
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-colors cursor-pointer"
          >
            Replace plan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tight alert ───────────────────────────────────────────────────────────────
function TightAlert({ feasibility }: { feasibility:FeasibilityInfo }) {
  const [open, setOpen] = useState(false);
  const r = feasibility.rescueSuggestions;
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl overflow-hidden">
      <div className="p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-lg shrink-0">⚡</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900">
            Tight timeline — {feasibility.uncoveredTopicsCount} topic{feasibility.uncoveredTopicsCount!==1?"s":""} could not fit
          </p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Short by <span className="font-bold text-rose-600">{Math.round(feasibility.shortByHours)}h</span>.
            HIGH weightage topics were protected first.
          </p>
          {r && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-white border border-rose-100 rounded-xl px-3 py-2.5">
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Option A</p>
                <p className="text-sm font-bold text-gray-900 mt-1">Push by {r.pushExamByDays} days</p>
                <p className="text-[10px] text-gray-400 mt-0.5">New: {new Date(r.suggestedExamDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"2-digit"})}</p>
              </div>
              <div className="bg-white border border-rose-100 rounded-xl px-3 py-2.5">
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Option B</p>
                <p className="text-sm font-bold text-gray-900 mt-1">+{r.addHoursPerDay}h per day</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Same exam date</p>
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
        <div className="border-t border-rose-100 px-4 py-3 flex flex-col gap-1.5">
          {feasibility.uncoveredTopics.map(t => (
            <div key={t.id} className="flex items-center gap-2.5 bg-white border border-rose-100 rounded-xl px-3 py-2">
              <span className={["w-2 h-2 rounded-full shrink-0", W_BAR[t.weightage]??"bg-gray-300"].join(" ")} />
              <span className="flex-1 text-xs font-medium text-gray-700 truncate">{t.title}</span>
              {t.sectionTitle && <span className="text-[10px] text-gray-400 hidden sm:block shrink-0">{t.sectionTitle}</span>}
              <span className="text-xs font-bold text-rose-600 shrink-0">{t.estimatedHours}h</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Read-only topic row ───────────────────────────────────────────────────────
function TopicRowReadOnly({ topic }: { topic:TopicEntry }) {
  const bar = topic.isRevision ? "bg-violet-400" : (W_BAR[topic.weightage??""]) ?? "bg-gray-200";
  return (
    <div className="w-full flex items-stretch rounded-xl border border-gray-100 bg-white overflow-hidden">
      <span className={["w-0.75 shrink-0", bar].join(" ")} />
      <div className="flex items-center gap-2.5 flex-1 px-3 py-2.5">
        <div className="w-4 h-4 rounded-md border-2 border-gray-200 shrink-0 flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-gray-300" viewBox="0 0 12 14" fill="currentColor">
            <path d="M10 6V4.5a4 4 0 10-8 0V6H1a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 00-1-1h-1zM4 4.5a2 2 0 114 0V6H4V4.5z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0 flex items-center flex-wrap gap-x-2 gap-y-0.5">
          <span className="text-[13px] font-medium text-gray-800 leading-snug">{topic.title}</span>
          {topic.weightage && (
            <span className={["text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0",
              W_PILL[topic.weightage]??"bg-gray-100 text-gray-500 border border-gray-200"].join(" ")}>
              {W_LABEL[topic.weightage]}
            </span>
          )}
          {topic.isWeak    && <span className="text-[10px]" title="Weak area">⚠️</span>}
          {topic.isRevision && <span className="text-[10px]" title={topic.revisionReason}>🔁</span>}
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0 tabular-nums">
          {topic.allocatedHours}h
        </span>
      </div>
    </div>
  );
}

// ── Week tab ──────────────────────────────────────────────────────────────────
function WeekTabRO({ w, active, onClick }: { w:WeekEntry; active:boolean; onClick:()=>void }) {
  const total = w.sections.flatMap(s=>s.subSections).flatMap(ss=>ss.topics).length;
  return (
    <button onClick={onClick}
      className={["flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border transition-all cursor-pointer shrink-0 min-w-[64px]",
        active ? "bg-amber-600 border-amber-600 shadow-md" : "bg-white border-gray-200 hover:border-amber-400"].join(" ")}>
      <span className={["text-[11px] font-bold uppercase tracking-widest w-20", active?"text-white":"text-cyan-900"].join(" ")}>
        {w.isRevision?"Rev":"Week"} {w.week}
      </span>
      <span className={["text-[10px] whitespace-nowrap mt-1", active?"text-white/80":"text-gray-500"].join(" ")}>
        {fmtDate(w.startDate)}
      </span>
      <span className={["text-[10px] font-semibold mt-0.5", active?"text-amber-200":"text-gray-400"].join(" ")}>
        {total} topic{total!==1?"s":""}
      </span>
    </button>
  );
}

// ── Save CTA ──────────────────────────────────────────────────────────────────
function SaveCTA({ onSave, saving, isLoggedIn }: { onSave:()=>void; saving:boolean; isLoggedIn:boolean }) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 shadow-lg px-4 py-4 sm:px-6">
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 leading-tight">Like your plan?</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {isLoggedIn
              ? "Save it to tick topics daily, track your progress, and resume from any device."
              : "Create a free account to save your plan, tick topics daily, and track progress."}
          </p>
        </div>
        <button onClick={onSave} disabled={saving}
          className={["flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap",
            saving ? "bg-amber-100 text-amber-300 cursor-not-allowed"
            : "bg-amber-600 hover:bg-amber-500 text-white hover:scale-105 shadow-md shadow-amber-500/20"].join(" ")}>
          {saving ? "Saving…"
            : isLoggedIn ? "Save Plan →"
            : "Sign up & Save Plan →"}
        </button>
      </div>
    </div>
  );
}

// ── Plan summary header ───────────────────────────────────────────────────────
function PlanSummaryHeader({ weeks, planData }: { weeks:WeekEntry[]; planData:StudyPlanPayload }) {
  const total    = countTopics(weeks);
  const studyWks = weeks.filter(w=>!w.isRevision).length;
  const revWks   = weeks.filter(w=> w.isRevision).length;
  const tc       = planData.timeCategory;
  return (
    <div className="bg-cyan-900 px-4 sm:px-6 py-4 rounded-t-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1">
            Your Study Plan — Preview
          </p>
          <p className="text-white font-extrabold text-lg leading-tight">
            {total} topics across {weeks.length} week{weeks.length!==1?"s":""}
          </p>
          <p className="text-white/50 text-xs mt-1">
            {studyWks} study week{studyWks!==1?"s":""}
            {revWks>0?` · ${revWks} revision week${revWks!==1?"s":""}`:null}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {tc && (
            <span className={["text-[10px] font-bold px-2.5 py-1 rounded-full border",
              tc==="tight"  ? "bg-rose-500/20    text-rose-300    border-rose-400/30"
              :tc==="normal"? "bg-amber-500/20   text-amber-300   border-amber-400/30"
              :               "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"].join(" ")}>
              {tc==="tight"?"⚡ Tight":tc==="normal"?"📅 On Track":"✅ Relaxed"}
            </span>
          )}
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/10">
            Preview
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
        <span className="text-sm shrink-0">🔒</span>
        <p className="text-white/70 text-[11px] leading-relaxed">
          Topics are locked in preview — save your plan to tick them off daily and track progress.
        </p>
      </div>
    </div>
  );
}

// ── Today preview ─────────────────────────────────────────────────────────────
function TodayPreview({ weeks }: { weeks:WeekEntry[] }) {
  const today = todayStr();
  const todayMom = new Date(today);
  const currentWeek = weeks.find(w => {
    const ws = new Date(w.startDate), we = new Date(w.endDate);
    return todayMom >= ws && todayMom <= we;
  }) ?? null;

  const lastWeek = weeks[weeks.length-1];
  const daysLeft = lastWeek
    ? Math.ceil((new Date(lastWeek.endDate).getTime() - todayMom.getTime()) / 86400000)
    : 0;

  const WEIGHT_PRIORITY: Record<string,number> = { HIGH:1, MEDIUM:2, LOW:3 };
  const pending: TopicEntry[] = [];

  if (currentWeek) {
    for (const section of currentWeek.sections)
      for (const ss of section.subSections)
        for (const topic of ss.topics)
          if (!topic.isCompleted) pending.push(topic);
    pending.sort((a,b) => {
      if (!!a.isWeak !== !!b.isWeak) return a.isWeak?-1:1;
      return (WEIGHT_PRIORITY[a.weightage ?? "MEDIUM"] ?? 2) - (WEIGHT_PRIORITY[b.weightage ?? "MEDIUM"] ?? 2);
    });
  }

  const highCount = pending.filter(t=>t.weightage==="HIGH").length;

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5">
      <div className="bg-gradient-to-br from-cyan-900 to-cyan-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="relative">
          <div className="flex items-start gap-3">
            <span className="text-3xl shrink-0">{highCount>0?"🎯":"📖"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-extrabold text-base leading-tight">
                {currentWeek
                  ? pending.length>0
                    ? `${pending.length} topic${pending.length>1?"s":""} this week${highCount>0?` — ${highCount} HIGH priority`:""}.`
                    : "You're all caught up this week!"
                  : "No topics scheduled today."}
              </p>
              <p className="text-white/60 text-xs mt-1.5">
                Save your plan to get daily coaching and mark topics done.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
              <span className="text-amber-400 text-sm">📅</span>
              <span className="text-white text-[11px] font-bold">
                {new Date(today).toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}
              </span>
            </div>
            {daysLeft>0 && (
              <div className={["flex items-center gap-1.5 rounded-xl px-3 py-1.5", daysLeft<=7?"bg-rose-500/30":"bg-white/10"].join(" ")}>
                <span className="text-amber-400 text-sm">⏳</span>
                <span className={["text-[11px] font-bold", daysLeft<=7?"text-rose-300":"text-white"].join(" ")}>
                  {daysLeft}d to exam
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {pending.length>0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">This Week&apos;s Topics</p>
            <p className="text-xs text-gray-500 mt-0.5">Save your plan to mark topics done</p>
          </div>
          <div className="p-3 flex flex-col gap-1.5">
            {pending.slice(0,8).map(t => <TopicRowReadOnly key={t.id} topic={t} />)}
            {pending.length>8 && (
              <p className="text-center text-xs text-gray-400 py-1">+{pending.length-8} more topics…</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Weekly preview ────────────────────────────────────────────────────────────
function WeeklyPreview({ weeks }: { weeks:WeekEntry[] }) {
  const [activeWeek, setActiveWeek] = useState(0);
  const studyWks = weeks.filter(w=>!w.isRevision);
  const revWks   = weeks.filter(w=> w.isRevision);
  const currWeek = weeks[activeWeek];

  useEffect(() => {
    const now = new Date(todayStr());
    const idx = weeks.findIndex(w => {
      const ws = new Date(w.startDate), we = new Date(w.endDate);
      return now >= ws && now <= we;
    });
    if (idx >= 0) setActiveWeek(idx);
  }, [weeks]);

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5">
      {studyWks.length>0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
            <p className="text-[10px] font-bold text-cyan-900 uppercase tracking-widest">📚 Study Weeks</p>
            <span className="text-[10px] text-gray-400">{studyWks.length} week{studyWks.length!==1?"s":""}</span>
          </div>
          <div className="flex gap-2 px-4 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {studyWks.map(w => {
              const idx = weeks.indexOf(w);
              return <WeekTabRO key={idx} w={w} active={activeWeek===idx} onClick={()=>setActiveWeek(idx)} />;
            })}
          </div>
        </div>
      )}

      {revWks.length>0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
            <p className="text-[10px] font-bold text-cyan-900 uppercase tracking-widest">🔁 Revision Weeks</p>
            <span className="text-[10px] text-gray-400">{revWks.length} week{revWks.length!==1?"s":""}</span>
          </div>
          <div className="flex gap-2 px-4 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {revWks.map(w => {
              const idx = weeks.indexOf(w);
              return <WeekTabRO key={idx} w={w} active={activeWeek===idx} onClick={()=>setActiveWeek(idx)} />;
            })}
          </div>
        </div>
      )}

      {currWeek && (
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
                  {currWeek.unusedHours>0.5 && <span className="text-gray-400"> · {currWeek.unusedHours}h spare</span>}
                </p>
              </div>
              <p className="text-[11px] text-gray-400 tabular-nums shrink-0">
                {currWeek.sections.flatMap(s=>s.subSections).flatMap(ss=>ss.topics).length} topics
              </p>
            </div>
          </div>

          {currWeek.isRevision && currWeek.revisionNote && (
            <div className="flex items-center gap-2.5 mx-4 mt-4 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-base shrink-0">🔁</span>
              <p className="text-[13px] text-amber-700 leading-relaxed">{currWeek.revisionNote}</p>
            </div>
          )}

          <div className="p-4 sm:p-5">
            {currWeek.sections.length>0 ? (
              <div className="columns-1 lg:columns-2 gap-3">
                {currWeek.sections.map((section, si) => (
                  <div key={si} className="break-inside-avoid mb-3 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-white">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-amber-700 flex-1 min-w-0 leading-tight">{section.title}</p>
                        <span className="text-[11px] font-bold text-cyan-900 tabular-nums shrink-0">
                          {section.subSections.flatMap(ss=>ss.topics).length} topics
                        </span>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col gap-3">
                      {section.subSections.map((ss, ssi) => (
                        <div key={ssi}>
                          <p className="text-xs font-bold text-cyan-900/80 uppercase tracking-widest mb-2">{ss.title}</p>
                          <div className="flex flex-col gap-1.5">
                            {ss.topics.map(topic => <TopicRowReadOnly key={topic.id} topic={topic} />)}
                          </div>
                        </div>
                      ))}
                    </div>


                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-gray-300">
                <span className="text-2xl">🎯</span>
                <p className="text-sm">Nothing scheduled this week.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Syllabus preview ──────────────────────────────────────────────────────────
function SyllabusPreview({ syllabus }: { syllabus:SyllabusSection[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (id:string) => setExpanded(prev => { const s=new Set(prev); s.has(id)?s.delete(id):s.add(id); return s; });

  if(!syllabus.length) return (
    <div className="flex flex-col items-center gap-3 py-16 text-gray-300 p-4">
      <span className="text-4xl">📚</span>
      <p className="text-sm">No syllabus data available.</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
        <span className="text-sm shrink-0">🔒</span>
        <p className="text-[11px] text-amber-700 leading-relaxed">
          Save your plan to track which topics you&apos;ve completed across the syllabus.
        </p>
      </div>
      {syllabus.map(section => {
        const secTotal = section.subSections.flatMap(ss=>ss.topics).length;
        const isOpen = expanded.has(section.id);
        return (
          <div key={section.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button onClick={() => toggle(section.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-amber-700 leading-tight">{section.title}</p>
                  <span className="text-[11px] font-bold text-cyan-900 shrink-0 tabular-nums">{secTotal} topics</span>
                </div>
              </div>
              <svg className={["w-4 h-4 text-gray-400 shrink-0 transition-transform", isOpen?"rotate-180":""].join(" ")}
                viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6l4 4 4-4"/>
              </svg>
            </button>
            {isOpen && (
              <div className="border-t border-gray-100 bg-gray-50 p-3 flex flex-col gap-3">
                {section.subSections.map(ss => (
                  <div key={ss.id}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-xs font-bold text-cyan-900/80 uppercase tracking-widest">{ss.title}</p>
                      <span className="text-[10px] text-gray-400 tabular-nums">{ss.topics.length} topics</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {ss.topics.map(topic => (
                        <div key={topic.id}
                          className="flex items-center gap-2.5 bg-white rounded-xl border border-gray-100 px-3 py-2">
                          <div className="w-4 h-4 rounded-md border-2 border-gray-200 shrink-0 flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-gray-300" viewBox="0 0 12 14" fill="currentColor">
                              <path d="M10 6V4.5a4 4 0 10-8 0V6H1a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 00-1-1h-1zM4 4.5a2 2 0 114 0V6H4V4.5z"/>
                            </svg>
                          </div>
                          <span className="flex-1 text-[12px] font-medium text-gray-800 leading-snug">{topic.title}</span>
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
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN — StudyPlanReadOnly
// ══════════════════════════════════════════════════════════════

type TabId = "today"|"weekly"|"syllabus";

export function StudyPlanReadOnly({
  planData,
  onRegenerate,
}: {
  planData:      unknown;
  onRegenerate?: () => void;
}) {
  const data = planData as StudyPlanPayload;

  const [weeks,     setWeeks]    = useState<WeekEntry[]>([]);
  const [syllabus,  setSyllabus] = useState<SyllabusSection[]>([]);
  const [activeTab, setActiveTab]= useState<TabId>("today");
  const [saving,    setSaving]   = useState(false);

  // Replace-warning modal state
  const [replaceModal, setReplaceModal] = useState<{
    show:        boolean;
    existingDate: string;
  }>({ show: false, existingDate: "" });

  const { user, setPostAuthAction, openAuth } = useAuth();
  const { showLoader, hideLoader }            = useLoader();
  const router                               = useRouter();

  useEffect(() => {
    const raw = data?.weekly_plan;
    if (Array.isArray(raw) && raw.length>0) setWeeks(raw as WeekEntry[]);
    const syl = data?.syllabus;
    if (Array.isArray(syl) && syl.length>0)  setSyllabus(syl as SyllabusSection[]);
  }, [data]);

  // ── Core save action (called after auth + optional replace confirmation) ──
  const doSave = useCallback(async () => {
    showLoader();
    try {
      // Pass the complete generate response payload directly.
      // The backend accepts this shape and derives all flat columns from it.
      const result = await studyPlannerService.savePlan(data);
      if (result.error) throw new Error(result.error);
      router.push("/dashboard");
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      hideLoader();
      setSaving(false);
    }
  }, [data, router, showLoader, hideLoader]);

  // ── Check for existing plan then decide what to do ────────────────────────
  const handleSaveClick = useCallback(async () => {
    // Step 1 — guest user: gate on auth first
    if (!user?.username) {
      // After login, re-enter this flow automatically
      setPostAuthAction(() => handleSaveClick);
      openAuth();
      return;
    }
    setSaving(true);

    // Step 2 — logged-in: check if a plan already exists for this exam
    const examId = data?.inputs?.examId || data?.exam?.id;
    if (examId) {
      try {
        const check = await studyPlannerService.checkExisting(String(examId));
        if (check.data?.exists && check.data.createdAt) {
          // Show replace-warning modal; actual save is deferred to onConfirm
          setReplaceModal({ show: true, existingDate: check.data.createdAt });
          setSaving(false);
          return;
        }
      } catch {
        // If the check fails, proceed anyway — the backend will handle it
      }
    }

    // Step 3 — no existing plan (or exam id unknown): save immediately
    await doSave();
  }, [user, data, doSave, setPostAuthAction, openAuth]);

  const handleReplaceConfirm = useCallback(async () => {
    setReplaceModal({ show: false, existingDate: "" });
    setSaving(true);
    await doSave();
  }, [doSave]);

  const handleReplaceCancel = useCallback(() => {
    setReplaceModal({ show: false, existingDate: "" });
  }, []);

  if (!weeks.length) return (
    <div className="flex flex-col items-center gap-3 py-12 text-gray-300">
      <span className="text-4xl">📭</span>
      <p className="text-sm">No plan data available.</p>
      {onRegenerate && (
        <button onClick={onRegenerate} className="text-amber-600 text-sm underline cursor-pointer">
          Try again
        </button>
      )}
    </div>
  );

  const tc     = data.timeCategory;
  const feasib = data.feasibility;
  const examTitle = data.exam?.title || data.inputs?.examTitle || "this exam";

  const TABS: { id:TabId; label:string; emoji:string }[] = [
    { id:"today",    label:"Today",    emoji:"🎯" },
    { id:"weekly",   label:"Weekly",   emoji:"📅" },
    { id:"syllabus", label:"Syllabus", emoji:"📚" },
  ];

  return (
    <>
      {/* Replace-warning modal (portal-style, z-50) */}
      {replaceModal.show && (
        <ReplaceModal
          examTitle={examTitle}
          existingDate={replaceModal.existingDate}
          onConfirm={handleReplaceConfirm}
          onCancel={handleReplaceCancel}
        />
      )}

      <div className="flex flex-col rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Summary header */}
        <PlanSummaryHeader weeks={weeks} planData={data} />

        {/* Tight alert */}
        {tc==="tight" && feasib && (
          <div className="bg-[#f8f7f4] px-4 sm:px-5 pt-4">
            <TightAlert feasibility={feasib} />
          </div>
        )}

        {/* Tab bar */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6">
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

        {/* Tab content */}
        <div className="bg-[#f8f7f4]">
          {activeTab === "today"    && <TodayPreview   weeks={weeks} />}
          {activeTab === "weekly"   && <WeeklyPreview  weeks={weeks} />}
          {activeTab === "syllabus" && <SyllabusPreview syllabus={syllabus} />}
        </div>

        {/* Regenerate link */}
        {onRegenerate && (
          <div className="bg-[#f8f7f4] text-center pb-4">
            <button onClick={onRegenerate}
              className="text-xs text-gray-400 hover:text-amber-600 underline cursor-pointer transition-colors">
              ← Change exam or dates and regenerate
            </button>
          </div>
        )}

        {/* Sticky save CTA */}
        <SaveCTA
          onSave={handleSaveClick}
          saving={saving}
          isLoggedIn={!!user?.username}
        />
      </div>
    </>
  );
}