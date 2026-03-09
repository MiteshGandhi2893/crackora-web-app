"use client";
import { studyPlannerService } from "@/services/StudyPlan.service";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useCallback, useRef } from "react";

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
interface SubSectionEntry {
  id: string;
  title: string;
  topics: TopicEntry[];
}
interface SectionEntry {
  id: string;
  title: string;
  subSections: SubSectionEntry[];
}
interface WeekEntry {
  week: number;
  startDate: string;
  endDate: string;
  totalHours: number;
  allocatedHours: number;
  unusedHours: number;
  isRevision: boolean;
  revisionNote?: string;
  sections: SectionEntry[];
}
interface UncoveredTopic {
  id: string;
  title: string;
  weightage: string;
  estimatedHours: number;
  sectionTitle?: string;
}
interface RescueSuggestions {
  shortByHours: number;
  pushExamByDays: number;
  addHoursPerDay: number;
  suggestedExamDate: string;
}
interface FeasibilityInfo {
  isShortOnTime: boolean;
  shortByHours: number;
  surplusHours: number;
  coveredTopicsCount: number;
  uncoveredTopicsCount: number;
  uncoveredTopics: UncoveredTopic[];
  rescueSuggestions?: RescueSuggestions | null;
}
interface FreeTimeInfo {
  freeWeeks: number;
  freeHours: number;
  contentWeeks: number;
  revisionWeeks: number;
}
interface StudyPlanData {
  id?: string | number; // plan DB id — needed for PATCH
  weekly_plan: WeekEntry[];
  timeCategory?: "tight" | "normal" | "relaxed";
  prepRequirement?: {
    minDays: number;
    recommendedDays: number;
    totalDays: number;
  };
  feasibility?: FeasibilityInfo;
  freeTime?: FreeTimeInfo;
}

// ─────────────────────────────── Helpers ─────────────────────────────────────
function calcProgress(weeks: WeekEntry[]) {
  let total = 0,
    done = 0;
  for (const w of weeks)
    for (const s of w.sections)
      for (const ss of s.subSections)
        for (const t of ss.topics) {
          total++;
          if (t.isCompleted) done++;
        }
  return {
    total,
    done,
    pct: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}
function calcWeekProgress(week: WeekEntry) {
  let total = 0,
    done = 0;
  for (const s of week.sections)
    for (const ss of s.subSections)
      for (const t of ss.topics) {
        total++;
        if (t.isCompleted) done++;
      }
  return {
    total,
    done,
    pct: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}
function fmtDate(str: string) {
  return new Date(str).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

// ── Weightage ─────────────────────────────────────────────────────────────────
const W_PILL: Record<string, string> = {
  HIGH: "bg-rose-100 text-rose-700 border border-rose-200",
  MEDIUM: "bg-amber-100 text-amber-700 border border-amber-200",
  LOW: "bg-sky-100 text-sky-600 border border-sky-200",
};
const W_LABEL: Record<string, string> = {
  HIGH: "High",
  MEDIUM: "Med",
  LOW: "Low",
};
const W_BAR: Record<string, string> = {
  HIGH: "bg-rose-400",
  MEDIUM: "bg-amber-500",
  LOW: "bg-sky-400",
};

// ── SVG ring ──────────────────────────────────────────────────────────────────
function Ring({ pct, size = 56 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2,
    circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={6}
        stroke="#e2e8f0"
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={6}
        stroke={pct === 100 ? "#16a34a" : "#d97706"}
        fill="none"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray .7s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
}

// ── Free-time chooser ─────────────────────────────────────────────────────────
const FREE_OPTS = [
  {
    id: "mock",
    icon: "📝",
    label: "Mock Tests",
    desc: "Simulate exam conditions",
  },
  {
    id: "revision",
    icon: "🔁",
    label: "Extra Revision",
    desc: "Deeper on weak areas",
  },
  {
    id: "rest",
    icon: "😴",
    label: "Rest & Recharge",
    desc: "You've earned it",
  },
  {
    id: "mixed",
    icon: "⚡",
    label: "Mixed Approach",
    desc: "A bit of everything",
  },
];
const FREE_TIPS: Record<string, string> = {
  mock: "Aim for 1 full mock every 2–3 days. Review every mistake the next morning.",
  revision: "Pick 3 weakest topics, give each a focused 2h deep-dive session.",
  rest: "Light reading, walks, early sleep — your brain consolidates during rest.",
  mixed:
    "Rotate: 2 study days → 1 mock → 1 rest day throughout the free period.",
};

function FreeTimeWidget({ freeTime }: { freeTime: FreeTimeInfo }) {
  const [chosen, setChosen] = useState<string | null>(null);
  if (freeTime.freeWeeks <= 0) return null;
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-lg shrink-0">
          🎉
        </div>
        <div>
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
            Free Time
          </p>
          <p className="text-sm font-bold text-cyan-900 mt-0.5">
            {freeTime.freeWeeks} free week{freeTime.freeWeeks > 1 ? "s" : ""} ·
            ~{freeTime.freeHours}h spare
          </p>
        </div>
      </div>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
        How do you want to use them?
      </p>
      <div className="grid grid-cols-2 gap-2">
        {FREE_OPTS.map((o) => (
          <button
            key={o.id}
            onClick={() => setChosen((c) => (c === o.id ? null : o.id))}
            className={[
              "flex flex-col text-left px-3 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer",
              chosen === o.id
                ? "bg-amber-600 border-amber-600"
                : "bg-white border-gray-200 hover:border-amber-400",
            ].join(" ")}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-sm">{o.icon}</span>
              <span
                className={[
                  "text-[11px] font-bold",
                  chosen === o.id ? "text-white" : "text-cyan-900",
                ].join(" ")}
              >
                {o.label}
              </span>
            </div>
            <span
              className={[
                "text-[10px]",
                chosen === o.id ? "text-amber-100" : "text-gray-400",
              ].join(" ")}
            >
              {o.desc}
            </span>
          </button>
        ))}
      </div>
      {chosen && (
        <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <span className="text-sm shrink-0 mt-0.5">💡</span>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            {FREE_TIPS[chosen]}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Tight banner ──────────────────────────────────────────────────────────────
function TightBanner({
  feasibility,
  prepReq,
}: {
  feasibility: FeasibilityInfo;
  prepReq?: { minDays: number; recommendedDays: number; totalDays: number };
}) {
  const [open, setOpen] = useState(false);
  const r = feasibility.rescueSuggestions;
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl overflow-hidden">
      <div className="p-4 sm:p-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-lg shrink-0">
          ⚡
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-cyan-900">
            Tight timeline — {feasibility.uncoveredTopicsCount} topic
            {feasibility.uncoveredTopicsCount !== 1 ? "s" : ""} could not fit
          </p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {prepReq && (
              <>
                {prepReq.totalDays}d available vs min {prepReq.minDays}d
                needed.{" "}
              </>
            )}
            Short by{" "}
            <span className="font-bold text-rose-600">
              {Math.round(feasibility.shortByHours)}h
            </span>
            . HIGH topics protected first.
          </p>
          {r && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-white border border-rose-100 rounded-xl px-3 py-2.5">
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                  Option A
                </p>
                <p className="text-sm font-bold text-cyan-900 mt-1">
                  Push by {r.pushExamByDays} days
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  New date:{" "}
                  {new Date(r.suggestedExamDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                  })}
                </p>
              </div>
              <div className="bg-white border border-rose-100 rounded-xl px-3 py-2.5">
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                  Option B
                </p>
                <p className="text-sm font-bold text-cyan-900 mt-1">
                  +{r.addHoursPerDay}h per day
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Keep the same exam date
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setOpen((p) => !p)}
            className="mt-3 text-[11px] font-semibold text-rose-600 underline underline-offset-2 cursor-pointer"
          >
            {open ? "Hide" : "Show"} {feasibility.uncoveredTopicsCount} skipped
            topics
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-rose-100 px-4 sm:px-5 py-3 flex flex-col gap-1.5">
          {feasibility.uncoveredTopics.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-2.5 bg-white border border-rose-100 rounded-xl px-3 py-2"
            >
              <span
                className={[
                  "w-2 h-2 rounded-full shrink-0",
                  W_BAR[t.weightage] ?? "bg-gray-300",
                ].join(" ")}
              />
              <span className="flex-1 min-w-0 text-xs font-medium text-gray-700 truncate">
                {t.title}
              </span>
              {t.sectionTitle && (
                <span className="text-[10px] text-gray-400 hidden sm:block shrink-0">
                  {t.sectionTitle}
                </span>
              )}
              <span className="text-xs font-bold text-rose-600 shrink-0">
                {t.estimatedHours}h
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Week tab ──────────────────────────────────────────────────────────────────
function WeekTab({
  w,
  idx,
  activeWeek,
  onClick,
}: {
  w: WeekEntry;
  idx: number;
  activeWeek: number;
  onClick: () => void;
}) {
  const wp = calcWeekProgress(w);
  const act = activeWeek === idx;
  return (
    <button
      onClick={onClick}
      className={[
        "flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border transition-all duration-150 shadow cursor-pointer shrink-0 min-w-[64px]",
        act
          ? "bg-amber-600/90 border-amber-600 shadow-md"
          : "bg-white border-gray-200 hover:border-amber-600",
      ].join(" ")}
    >
      <span
        className={[
          "text-[11px] font-bold uppercase tracking-widest leading-none w-20",
          act ? "text-white" : "text-cyan-900",
        ].join(" ")}
      >
        {w.isRevision ? "Rev" : "Week"} {w.week}
      </span>
      <span
        className={[
          "text-[10px] whitespace-nowrap leading-none mt-1",
          act ? "text-white/80" : "text-gray-500",
        ].join(" ")}
      >
        {fmtDate(w.startDate)}
      </span>
      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden mt-0.5">
        <div
          className={[
            "h-full rounded-full transition-all duration-500",
            wp.pct === 100 ? "bg-green-500" : "bg-green-600",
          ].join(" ")}
          style={{ width: `${wp.pct}%` }}
        />
      </div>
    </button>
  );
}

// ── Week rail ─────────────────────────────────────────────────────────────────
function WeekRail({
  label,
  labelClass,
  weeks,
  allWeeks,
  activeWeek,
  onSelect,
}: {
  label: string;
  labelClass: string;
  weeks: WeekEntry[];
  allWeeks: WeekEntry[];
  activeWeek: number;
  onSelect: (idx: number) => void;
}) {
  if (weeks.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white">
        <p
          className={[
            "text-[10px] font-bold uppercase tracking-widest",
            labelClass,
          ].join(" ")}
        >
          {label}
        </p>
        <span className="text-[10px] text-gray-400">
          {weeks.length} week{weeks.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="relative bg-amber-50/30">
        <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-2 px-4 py-3 min-w-max overflow-x-auto">
            {weeks.map((w) => {
              const idx = allWeeks.indexOf(w);
              return (
                <WeekTab
                  key={idx}
                  w={w}
                  idx={idx}
                  activeWeek={activeWeek}
                  onClick={() => onSelect(idx)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Topic row ─────────────────────────────────────────────────────────────────
function TopicRow({
  topic,
  onToggle,
}: {
  topic: TopicEntry;
  onToggle: () => void;
}) {
  const bar = topic.isCompleted
    ? "bg-green-500"
    : topic.isRevision
      ? "bg-violet-400"
      : (W_BAR[topic.weightage ?? ""] ?? "bg-gray-200");

  return (
    <button
      onClick={onToggle}
      title={topic.revisionReason || undefined}
      className={[
        "w-full flex items-stretch rounded-xl border transition-all duration-150 cursor-pointer overflow-hidden text-left group",
        topic.isCompleted
          ? "bg-green-50 border-green-200"
          : "bg-white border-gray-100 hover:border-cyan-300 hover:shadow-sm",
      ].join(" ")}
    >
      {/* Left accent bar */}
      <span className={["w-0.75 shrink-0", bar].join(" ")} />

      <div className="flex items-center gap-2.5 flex-1 px-3 py-2.5">
        {/* Checkbox */}
        <div
          className={[
            "w-4.25 h-4.25 rounded-md border-2 shrink-0 flex items-center justify-center transition-all",
            topic.isCompleted
              ? "bg-green-600 border-green-600"
              : "border-gray-300 group-hover:border-cyan-400",
          ].join(" ")}
        >
          {topic.isCompleted && (
            <svg
              className="w-2.5 h-2.5 text-white"
              viewBox="0 0 10 8"
              fill="none"
            >
              <path
                d="M1 4l3 3 5-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Title + weightage pill */}
        <div className="flex-1 min-w-0 flex items-center flex-wrap gap-x-2 gap-y-0.5">
          <span
            className={[
              "text-[13px] font-medium leading-snug",
              topic.isCompleted
                ? "line-through text-gray-400"
                : "text-gray-800",
            ].join(" ")}
          >
            {topic.title}
          </span>
          {topic.weightage && !topic.isCompleted && (
            <span
              className={[
                "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0",
                W_PILL[topic.weightage] ??
                  "bg-gray-100 text-gray-500 border border-gray-200",
              ].join(" ")}
            >
              {W_LABEL[topic.weightage]}
            </span>
          )}
        </div>

        {/* Status icon + hours */}
        <div className="flex items-center gap-1.5 shrink-0">
          {topic.isRevision ? (
            <span className="text-[11px]" title={topic.revisionReason}>
              🔁
            </span>
          ) : topic.isWeak ? (
            <span
              className="text-[11px]"
              title="Weak area — extra time allocated"
            >
              ⚠️
            </span>
          ) : topic.isContinued ? (
            <span className="text-[11px]" title="Continues from last week">
              ↩️
            </span>
          ) : null}
          <span
            className={[
              "text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums",
              topic.isCompleted
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500",
            ].join(" ")}
          >
            {topic.allocatedHours}h
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex items-center gap-3 flex-wrap pb-3 border-b border-gray-100">
      {(["HIGH", "MEDIUM", "LOW"] as const).map((w) => (
        <div key={w} className="flex items-center gap-1.5">
          <span
            className={[
              "text-[9px] font-bold px-4 py-0.5 rounded-full uppercase tracking-wide border",
              W_PILL[w],
            ].join(" ")}
          >
            {W_LABEL[w]}
          </span>
        </div>
      ))}
      <span className="text-[11px] text-gray-500 ml-1">· tap to mark done</span>
    </div>
  );
}

// ── Save indicator ────────────────────────────────────────────────────────────
function SaveIndicator({
  status,
}: {
  status: "idle" | "saving" | "saved" | "error";
}) {
  if (status === "idle") return null;
  return (
    <span
      className={[
        "text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all",
        status === "saving"
          ? "bg-amber-50 text-amber-600 border-amber-200"
          : status === "saved"
            ? "bg-green-50 text-green-600 border-green-200"
            : "bg-rose-50 text-rose-600 border-rose-200",
      ].join(" ")}
    >
      {status === "saving"
        ? "Saving…"
        : status === "saved"
          ? "✓ Saved"
          : "Save failed"}
    </span>
  );
}

// ─────────────────────────────── Main ────────────────────────────────────────
export function StudyCalendar({
  studyPlan,
}: {
  studyPlan: StudyPlanData | any;
}) {
  const [activeWeek, setActiveWeek] = useState(0);
  const [weeks, setWeeks] = useState<WeekEntry[]>([]);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // Debounce timer ref
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load weeks from prop
  useEffect(() => {
    const raw = studyPlan?.weekly_plan;
    if (Array.isArray(raw) && raw.length > 0) {
      setWeeks(raw as WeekEntry[]);
      setActiveWeek(0);
    }
  }, [studyPlan?.weekly_plan]);

  // ── Persist weekly_plan to DB via PATCH ──────────────────────────────────
  // Called with the latest weeks array after every toggle.
  // Debounced 800ms so rapid taps only send one request.
  const persistProgress = useCallback(
    (updatedWeeks: WeekEntry[]) => {
      const planId = studyPlan?.id;
      if (!planId) return; // no id → can't save (shouldn't happen in prod)

      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaveStatus("saving");

      saveTimer.current = setTimeout(async () => {
        try {
          const res = await studyPlannerService.saveProgress(planId,updatedWeeks)
          if (!res.ok && !res?.data?.ok) throw new Error("Server error");
          setSaveStatus("saved");
          // Reset to idle after 2 s
          setTimeout(() => setSaveStatus("idle"), 2000);
        } catch {
          setSaveStatus("error");
          setTimeout(() => setSaveStatus("idle"), 3000);
        }
      }, 800);
    },
    [studyPlan?.id],
  );

  // ── Toggle a topic ────────────────────────────────────────────────────────
  const toggleTopic = useCallback(
    (wi: number, sId: string, ssId: string, tId: string) => {
      setWeeks((prev) => {
        const updated = prev.map((w, i) =>
          i !== wi
            ? w
            : {
                ...w,
                sections: w.sections.map((s) =>
                  s.id !== sId
                    ? s
                    : {
                        ...s,
                        subSections: s.subSections.map((ss) =>
                          ss.id !== ssId
                            ? ss
                            : {
                                ...ss,
                                topics: ss.topics.map((t) =>
                                  t.id === tId
                                    ? { ...t, isCompleted: !t.isCompleted }
                                    : t,
                                ),
                              },
                        ),
                      },
                ),
              },
        );
        persistProgress(updated);
        return updated;
      });
    },
    [persistProgress],
  );

  if (!weeks.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 bg-white text-gray-300">
        <span className="text-5xl">📭</span>
        <p className="text-sm">No study plan available.</p>
      </div>
    );
  }

  const overall = calcProgress(weeks);
  const currWeek = weeks[activeWeek];
  const weekProg = calcWeekProgress(currWeek);
  const tc = studyPlan?.timeCategory as string | undefined;
  const feasib = studyPlan?.feasibility as FeasibilityInfo | undefined;
  const freeTime = studyPlan?.freeTime as FreeTimeInfo | undefined;
  const prepReq = studyPlan?.prepRequirement;

  const studyWks = weeks.filter((w) => !w.isRevision);
  const revisionWks = weeks.filter((w) => w.isRevision);

  return (
    <div className="h-[86vh] flex flex-col bg-white ">
      {/* ── Sticky header: progress ── */}
      <div className="shrink-0 bg-cyan-900 px-4 sm:px-6 py-4">
        <div className=" mx-auto flex items-center gap-4">
          {/* Ring */}
          <div className="relative shrink-0">
            <Ring pct={overall.pct} size={56} />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-white">
              {overall.pct}%
            </span>
          </div>

          {/* Text + bar */}
          <div className="flex-1 min-w-0">
            <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">
              Overall Progress
            </p>
            <p className="text-white font-extrabold text-xl leading-tight mt-0.5">
              {overall.done}
              <span className="text-white/50 text-sm font-normal">
                {" "}
                / {overall.total} topics
              </span>
            </p>
            <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${overall.pct}%` }}
              />
            </div>
          </div>

          {/* Save indicator */}
          <SaveIndicator status={saveStatus} />

          {/* Meta pills — hidden on very small screens */}
          <div className="hidden sm:flex flex-wrap gap-1.5 shrink-0">
            <span className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white/80 border border-white/10">
              {studyWks.length} study
            </span>
            {revisionWks.length > 0 && (
              <span className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-amber-600/40 text-amber-200 border border-violet-400/30">
                {revisionWks.length} revision
              </span>
            )}
            {freeTime && freeTime.freeWeeks > 0 && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {freeTime.freeWeeks} free
              </span>
            )}
            {tc && (
              <span
                className={[
                  "text-[10px] font-bold px-2.5 py-1 rounded-full border",
                  tc === "tight"
                    ? "bg-rose-500/20 text-rose-300 border-rose-400/30"
                    : tc === "normal"
                      ? "bg-amber-500/20 text-amber-300 border-amber-400/30"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
                ].join(" ")}
              >
                {tc === "tight"
                  ? "⚡ Tight"
                  : tc === "normal"
                    ? "📅 On Track"
                    : "✅ Relaxed"}
              </span>
            )}
          </div>

          {overall.pct === 100 && (
            <span className="text-2xl animate-bounce shrink-0">🏆</span>
          )}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto max-h-[70vh]">
        <div className=" mx-auto px-4 sm:px-6 py-5 flex flex-col gap-5">
          {/* Tight alert */}
          {tc === "tight" && feasib && (
            <TightBanner feasibility={feasib} prepReq={prepReq} />
          )}

          {/* Study weeks rail */}
          <WeekRail
            label="📚 Study Weeks"
            labelClass="text-cyan-900"
            weeks={studyWks}
            allWeeks={weeks}
            activeWeek={activeWeek}
            onSelect={setActiveWeek}
          />

          {/* Revision weeks rail */}
          <WeekRail
            label="🔁 Revision Weeks"
            labelClass="text-cyan-900"
            weeks={revisionWks}
            allWeeks={weeks}
            activeWeek={activeWeek}
            onSelect={setActiveWeek}
          />

          {/* Free time chooser */}
          {freeTime && freeTime.freeWeeks > 0 && (
            <FreeTimeWidget freeTime={freeTime} />
          )}

          {/* ── Active week card ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Week header */}
            <div
              className={[
                "px-4 sm:px-5 py-4 border-b border-gray-100 bg-cyan-900",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-lg font-extrabold text-amber-400  leading-none">
                      Week {currWeek.week}
                    </h2>
                    {currWeek.isRevision && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-violet-200 uppercase tracking-widest">
                        Revision
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-2">
                    {fmtDate(currWeek.startDate)} – {fmtDate(currWeek.endDate)}
                    {" · "}
                    <span className="text-amber-400 font-semibold">
                      {currWeek.allocatedHours}h
                    </span>{" "}
                    planned
                    {currWeek.unusedHours > 0.5 && (
                      <span className="text-gray-300">
                        {" "}
                        · {currWeek.unusedHours}h spare
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs font-bold text-gray-300 tabular-nums">
                    {weekProg.done}/{weekProg.total}
                  </span>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={[
                        "h-full rounded-full transition-all duration-500",
                        weekProg.pct === 100
                          ? "bg-green-500"
                          : currWeek.isRevision
                            ? "bg-violet-500"
                            : "bg-amber-500",
                      ].join(" ")}
                      style={{ width: `${weekProg.pct}%` }}
                    />
                  </div>
                  {weekProg.pct === 100 && (
                    <span className="text-[10px] font-bold text-green-600">
                      Complete ✓
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Revision note */}
            {currWeek.isRevision && currWeek.revisionNote && (
              <div className="flex items-center gap-2.5 mx-4 sm:mx-5 mt-4 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-base shrink-0 mt-0.5">🔁</span>
                <p className="text-[13px] text-amber-700 leading-relaxed">
                  {currWeek.revisionNote}
                </p>
              </div>
            )}

            {/* Legend + sections */}
            <div className="p-4 sm:p-5 flex flex-col gap-4">
              {/* <Legend /> */}

              {currWeek.sections.length > 0 ? (
                /*
                  CSS columns (masonry-like) instead of grid.
                  Cards flow into the shortest column naturally — no blank height gaps.
                  break-inside-avoid ensures a single card never splits across columns.
                */
                <div className="columns-1 lg:columns-2 gap-3">
                  {currWeek.sections.map((section, si) => {
                    const secTopics = section.subSections.flatMap(
                      (ss) => ss.topics,
                    );
                    const secDone = secTopics.filter(
                      (t) => t.isCompleted,
                    ).length;
                    const secPct =
                      secTopics.length === 0
                        ? 0
                        : Math.round((secDone / secTopics.length) * 100);

                    return (
                      <div
                        key={si}
                        className="break-inside-avoid mb-3 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden"
                      >
                        {/* Section header */}
                        <div className="px-4 py-3 border-b border-gray-100 bg-white">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <p className="text-sm font-bold text-amber-700 flex-1 min-w-0 leading-tight">
                              {section.title}
                            </p>
                            <span className="text-[11px] font-bold text-cyan-900 tabular-nums shrink-0">
                              {secDone}/{secTopics.length}
                            </span>
                          </div>
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={[
                                "h-full rounded-full transition-all duration-500",
                                secPct === 100
                                  ? "bg-green-500"
                                  : "bg-amber-500",
                              ].join(" ")}
                              style={{ width: `${secPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Topics grouped by subsection */}
                        <div className="p-3 flex flex-col gap-3">
                          {section.subSections.map((ss, ssi) => (
                            <div key={ssi}>
                              <p className="text-xs font-bold text-cyan-900/80 uppercase tracking-widest mb-2">
                                {ss.title}
                              </p>
                              <div className="flex flex-col gap-1.5">
                                {ss.topics.map((topic) => (
                                  <TopicRow
                                    key={`${currWeek.isRevision ? "revise" : "topic"}-${topic.id}`}
                                    topic={topic}
                                    onToggle={() =>
                                      toggleTopic(
                                        activeWeek,
                                        section.id,
                                        ss.id,
                                        topic.id,
                                      )
                                    }
                                  />
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
      </div>
    </div>
  );
}
