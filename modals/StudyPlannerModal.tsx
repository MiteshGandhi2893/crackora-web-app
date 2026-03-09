/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useExams } from "@/providers/ExamsProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useLoader } from "@/providers/LoadingProvider";
import { Entrance, Exam } from "@/interfaces/entrance-interface";
import Image from "next/image";
import { API_BASE_URL } from "@/services/api.service";
import { studyPlannerService } from "@/services/StudyPlan.service";
import {
  Step35TopicPreview,
  WeakSelection,
} from "@/components/study-plan/Step35TopicPreview";

const LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    sub: "Starting from scratch",
    icon: "🌱",
    desc: "Full study time on every topic. Perfect if you're new to this exam.",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    sub: "Know the basics",
    icon: "📘",
    desc: "Balanced plan — more time on hard topics, less on familiar ones.",
  },
  {
    id: "expert",
    label: "Expert",
    sub: "Need revision only",
    icon: "🎯",
    desc: "Focused revision plan. Covers high-yield topics at speed.",
  },
] as const;

type LevelId = (typeof LEVELS)[number]["id"];

const WEEKDAY_HOURS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6];
const WEEKEND_HOURS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8];

const STEPS = [
  "Entrance & Exam",
  "Exam Date",
  "Study Hours",
  "Your Level",
  "Topics",
  "Review",
] as const;

interface FormState {
  entrance: { id: string; title: string } | null;
  exam: { id: string; title: string } | null;
  prepStartDate: string;
  examDate: string;
  hoursPerWeekday: number | null;
  hoursPerWeekend: number | null;
  examPrepLevel: LevelId | null;
  weakSubSectionIds: string[];
  weakTopicIds: string[];
}

interface PrepRequirement {
  min_days: number;
  recommended_days: number;
  max_days: number;
  description?: string;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}
function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}
function diffDays(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}
function fmtDate(str: string) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function calcHours(start: string, end: string, wdH: number, weH: number) {
  let total = 0;
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    const d = cur.getDay();
    total += d === 0 || d === 6 ? weH : wdH;
    cur.setDate(cur.getDate() + 1);
  }
  return Math.round(total);
}

// ── Step dots ──────────────────────────────────────────────────────────────
function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center py-3 px-4 border-b border-gray-100 bg-white shrink-0 overflow-x-auto scrollbar-hide">
      <div className="flex items-center shrink-0">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-0.5">
                <div
                  className={[
                    "flex items-center justify-center rounded-full border-2 font-bold transition-all duration-300 text-[10px] select-none",
                    active
                      ? "w-6 h-6 border-green-700 text-green-700"
                      : done
                        ? "w-5 h-5 border-green-700 bg-green-700 text-white"
                        : "w-5 h-5 border-cyan-900 bg-white text-cyan-900",
                  ].join(" ")}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span
                  className={[
                    "text-[9px] whitespace-nowrap hidden sm:block",
                    active
                      ? "text-green-700 font-bold"
                      : done
                        ? "text-cyan-900 font-medium"
                        : "text-gray-400",
                  ].join(" ")}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-4 sm:w-5 h-px mx-0.5 bg-green-700 mb-2 sm:mb-2.5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepHeading({
  step,
  title,
  sub,
}: {
  step: number;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-semibold text-amber-700 tracking-[2px] uppercase mb-1.5">
        Step {step + 1} of {STEPS.length}
      </p>
      <h2 className="text-lg font-extrabold text-cyan-950 leading-tight m-0">
        {title}
      </h2>
      {sub && <p className="text-gray-500 text-sm mt-1 mb-0">{sub}</p>}
    </div>
  );
}

function SelectCard({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={[
        "border rounded-xl cursor-pointer transition-all duration-200 select-none",
        selected
          ? "border-amber-700 bg-amber-50 shadow-sm"
          : "border-gray-200 bg-white shadow-sm hover:border-amber-300",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function HourChip({
  val,
  selected,
  onClick,
}: {
  val: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={[
        "w-10 h-10 sm:w-11 sm:h-11 rounded-lg border flex items-center justify-center cursor-pointer font-bold text-sm transition-all duration-150 select-none",
        selected
          ? "bg-cyan-900 text-white border-cyan-900"
          : "border-cyan-800/50 bg-white text-cyan-900 hover:bg-cyan-900 hover:text-white",
      ].join(" ")}
    >
      {val}
    </div>
  );
}

function NavButtons({
  step,
  onBack,
  onNext,
  nextDisabled,
  hint,
}: {
  step: number;
  onBack: () => void;
  onNext: () => void;
  nextDisabled: boolean;
  hint?: string;
}) {
  return (
    <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3 sm:px-6 sm:py-4">
      {hint && (
        <p className="text-center text-cyan-950 text-xs mb-2.5">{hint}</p>
      )}
      <div className="flex justify-between items-center">
        {step > 0 ? (
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-lg border border-cyan-900 bg-cyan-900 text-white text-sm hover:opacity-90 transition-all cursor-pointer"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className={[
            "px-6 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all duration-200",
            nextDisabled
              ? "bg-amber-100 text-amber-300 cursor-not-allowed"
              : "bg-amber-600 text-white shadow-md cursor-pointer hover:bg-amber-700",
          ].join(" ")}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// ── STEP 0 ─────────────────────────────────────────────────────────────────
function Step0({
  form,
  set,
}: {
  form: FormState;
  set: (p: Partial<FormState>) => void;
}) {
  const { entrances, loading, error } = useExams();
  const selectedEntrance: Entrance | undefined = entrances.find(
    (e) => e.id === form.entrance?.id,
  );

  if (loading)
    return (
      <div className="text-center py-10 text-cyan-400">
        <div className="text-3xl mb-3">⏳</div>
        <p className="text-sm">Loading exams...</p>
      </div>
    );
  if (error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm">
        ⚠️ {error}
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-[11px] font-semibold text-cyan-900 uppercase tracking-widest mb-2">
          Select Entrance
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {entrances.map((entrance) => (
            <SelectCard
              key={entrance.id}
              selected={form.entrance?.id === entrance.id}
              onClick={() =>
                set({
                  entrance: { id: entrance.id!, title: entrance.title },
                  exam: null,
                })
              }
              className="p-3"
            >
              <p className="font-semibold text-sm text-cyan-900">
                {entrance.title}
              </p>
              <p className="font-semibold text-[11px] text-amber-600 mt-0.5">
                {entrance.exams.length} exams
              </p>
            </SelectCard>
          ))}
        </div>
      </div>
      {selectedEntrance && (
        <div className="animate-[fadeSlide_0.3s_ease]">
          <label className="block text-[11px] font-semibold text-cyan-900 uppercase tracking-widest mb-2">
            Select Exam
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {selectedEntrance.exams.map((exam: Exam) => (
              <SelectCard
                key={exam.id}
                selected={form.exam?.id === exam.id}
                onClick={() =>
                  set({ exam: { id: exam.id!, title: exam.title } })
                }
                className="px-3 py-2.5 flex items-center gap-2"
              >
                {exam.icon && (
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src={`${API_BASE_URL}/public/${exam?.icon || ""}`}
                      alt={exam.title || ""}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                )}
                <span
                  className={[
                    "font-bold text-sm leading-tight",
                    form.exam?.id === exam.id
                      ? "text-amber-600"
                      : "text-cyan-950",
                  ].join(" ")}
                >
                  {exam.title}
                </span>
              </SelectCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── STEP 1 ─────────────────────────────────────────────────────────────────
function Step1({
  form,
  set,
}: {
  form: FormState;
  set: (p: Partial<FormState>) => void;
}) {
  const [prepReq, setPrepReq] = useState<PrepRequirement | null>(null);

  useEffect(() => {
    if (!form.exam?.id || !form.examPrepLevel) return;
    studyPlannerService
      .getPrepRequirement(form.exam.id, form.examPrepLevel)
      .then(setPrepReq);
  }, [form.exam?.id, form.examPrepLevel]);

  const days =
    form.prepStartDate && form.examDate
      ? diffDays(form.prepStartDate, form.examDate)
      : null;

  function getDaysBadge(d: number) {
    if (!prepReq) {
      if (d < 30)
        return {
          emoji: "⚡",
          color: "text-red-700",
          label: "Very tight — focusing on high-yield topics only.",
        };
      if (d > 120)
        return {
          emoji: "🏆",
          color: "text-green-700",
          label: "Great! Plenty of time for thorough preparation.",
        };
      return {
        emoji: "📅",
        color: "text-amber-600",
        label: "Good window. Full syllabus with revision phase.",
      };
    }
    if (d < prepReq.min_days)
      return {
        emoji: "⚡",
        color: "text-red-700",
        label: `Very tight — minimum is ${prepReq.min_days} days. Some topics may be dropped.`,
      };
    if (d >= prepReq.recommended_days)
      return {
        emoji: "🏆",
        color: "text-green-700",
        label: `Ideal! Recommended is ~${prepReq.recommended_days} days. All topics + revision included.`,
      };
    return {
      emoji: "📅",
      color: "text-amber-600",
      label: `Good window. Aim for ${prepReq.recommended_days} days for full coverage.`,
    };
  }

  const badge = days !== null && days > 0 ? getDaysBadge(days) : null;

  return (
    <div>
      <StepHeading
        step={1}
        title="When is your exam?"
        sub="We'll build your plan around these two dates."
      />
      {prepReq && !days && (
        <div className="flex items-start gap-3 p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-800 mb-4">
          <span className="text-base shrink-0">ℹ️</span>
          <p>
            Recommended prep for{" "}
            <span className="font-bold">{form.exam?.title}</span>:{" "}
            <span className="font-bold">{prepReq.recommended_days} days</span>{" "}
            (min: {prepReq.min_days}d).
            {prepReq.description && ` ${prepReq.description}`}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[11px] font-semibold text-amber-600 uppercase tracking-widest mb-1.5">
            Prep Start Date
          </label>
          <input
            type="date"
            value={form.prepStartDate}
            min={todayStr()}
            onChange={(e) =>
              set({ prepStartDate: e.target.value, examDate: "" })
            }
            className="w-full bg-white border border-cyan-900 rounded-lg px-3 py-2.5 text-cyan-900 text-sm outline-none focus:border-cyan-600 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-amber-600 uppercase tracking-widest mb-1.5">
            Exam Date
          </label>
          <input
            type="date"
            value={form.examDate}
            min={
              form.prepStartDate ? addDays(form.prepStartDate, 7) : todayStr()
            }
            onChange={(e) => set({ examDate: e.target.value })}
            className="w-full bg-white border border-cyan-900 rounded-lg px-3 py-2.5 text-cyan-900 text-sm outline-none focus:border-cyan-600 transition-colors"
          />
        </div>
      </div>
      {badge && days !== null && days > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl animate-[fadeSlide_0.3s_ease] bg-gradient-to-br from-amber-50 to-white border border-amber-200">
          <span className="text-2xl">{badge.emoji}</span>
          <div className="flex-1">
            <p
              className={[
                "font-extrabold text-lg leading-tight",
                badge.color,
              ].join(" ")}
            >
              {days} days to go
            </p>
            <p className="text-cyan-900 text-xs mt-0.5">{badge.label}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-cyan-900">Approx.</p>
            <p className="font-bold text-base text-cyan-900">
              {Math.floor(days / 7)} wks
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── STEP 2 ─────────────────────────────────────────────────────────────────
function Step2({
  form,
  set,
}: {
  form: FormState;
  set: (p: Partial<FormState>) => void;
}) {
  const totalHours =
    form.prepStartDate &&
    form.examDate &&
    form.hoursPerWeekday &&
    form.hoursPerWeekend
      ? calcHours(
          form.prepStartDate,
          form.examDate,
          form.hoursPerWeekday,
          form.hoursPerWeekend,
        )
      : null;

  return (
    <div>
      <StepHeading
        step={2}
        title="How many hours can you study?"
        sub="Be realistic — consistency beats burnout."
      />
      <div className="mb-5">
        <label className="block text-[11px] font-semibold text-amber-700 uppercase tracking-widest mb-2">
          Weekday
          {form.hoursPerWeekday && (
            <span className="text-cyan-900 font-bold ml-2 normal-case tracking-normal">
              · {form.hoursPerWeekday} hrs/day
            </span>
          )}
        </label>
        <div className="flex flex-wrap gap-2">
          {WEEKDAY_HOURS.map((h) => (
            <HourChip
              key={h}
              val={h}
              selected={form.hoursPerWeekday === h}
              onClick={() => set({ hoursPerWeekday: h })}
            />
          ))}
        </div>
      </div>
      <div className="mb-5">
        <label className="block text-[11px] font-semibold text-amber-700 uppercase tracking-widest mb-2">
          Weekend
          {form.hoursPerWeekend && (
            <span className="text-cyan-900 font-bold ml-2 normal-case tracking-normal">
              · {form.hoursPerWeekend} hrs/day
            </span>
          )}
        </label>
        <div className="flex flex-wrap gap-2">
          {WEEKEND_HOURS.map((h) => (
            <HourChip
              key={h}
              val={h}
              selected={form.hoursPerWeekend === h}
              onClick={() => set({ hoursPerWeekend: h })}
            />
          ))}
        </div>
      </div>
      {totalHours !== null && (
        <div className="grid grid-cols-3 gap-2 mt-4 bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-xl p-4 animate-[fadeSlide_0.3s_ease]">
          {[
            { label: "Total Hours", value: `${totalHours} hrs`, icon: "⏱️" },
            {
              label: "Weekdays",
              value: `${form.hoursPerWeekday} × 5`,
              icon: "📅",
            },
            {
              label: "Weekends",
              value: `${form.hoursPerWeekend} × 2`,
              icon: "🌅",
            },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xl mb-0.5">{s.icon}</p>
              <p className="font-extrabold text-sm text-cyan-900">{s.value}</p>
              <p className="text-[10px] text-cyan-900 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── STEP 3 ─────────────────────────────────────────────────────────────────
function Step3({
  form,
  set,
}: {
  form: FormState;
  set: (p: Partial<FormState>) => void;
}) {
  return (
    <div>
      <StepHeading
        step={3}
        title="Where are you right now?"
        sub="This controls how many hours each topic gets."
      />
      <div className="flex flex-col gap-2.5">
        {LEVELS.map((l) => (
          <SelectCard
            key={l.id}
            selected={form.examPrepLevel === l.id}
            onClick={() => set({ examPrepLevel: l.id })}
            className="p-3.5 flex items-center gap-3"
          >
            <div
              className={[
                "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xl transition-all",
                form.examPrepLevel === l.id
                  ? "bg-amber-100 border border-amber-300"
                  : "bg-white border border-gray-100",
              ].join(" ")}
            >
              {l.icon}
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-sm text-cyan-950">{l.label}</p>
              <p className="text-xs text-amber-700">{l.sub}</p>
            </div>
            {form.examPrepLevel === l.id && (
              <div className="w-5 h-5 rounded-full bg-green-700 flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] font-bold">✓</span>
              </div>
            )}
          </SelectCard>
        ))}
      </div>
      {form.examPrepLevel && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-cyan-900 text-xs animate-[fadeSlide_0.25s_ease]">
          💡 {LEVELS.find((l) => l.id === form.examPrepLevel)?.desc}
        </div>
      )}
    </div>
  );
}

// ── STEP 4 ────────────────────────────────────────────────────────────────
function Step4Wrapper({
  form,
  set,
}: {
  form: FormState;
  set: (p: Partial<FormState>) => void;
}) {
  const handleWeakChange = useCallback(
    (sel: WeakSelection) => {
      set({
        weakSubSectionIds: sel.weakSubSectionIds,
        weakTopicIds: sel.weakTopicIds,
      });
    },
    [set],
  );

  return (
    <div>
      <StepHeading
        step={4}
        title="Here's what you'll study"
        sub="Review your syllabus — optionally flag weak areas for extra focus."
      />
      {form.exam?.id && form.examPrepLevel ? (
        <Step35TopicPreview
          examId={form.exam.id}
          level={form.examPrepLevel}
          onWeakSelectionChange={handleWeakChange}
        />
      ) : (
        <p className="text-sm text-gray-400">No exam or level selected.</p>
      )}
    </div>
  );
}

// ── STEP 5: Review ─────────────────────────────────────────────────────────
function Step5({
  form,
  onSubmit,
  loading,
}: {
  form: FormState;
  onSubmit: () => void;
  loading: boolean;
}) {
  const days = diffDays(form.prepStartDate, form.examDate);
  const hours = calcHours(
    form.prepStartDate,
    form.examDate,
    form.hoursPerWeekday!,
    form.hoursPerWeekend!,
  );
  const level = LEVELS.find((l) => l.id === form.examPrepLevel);
  const weakTotal = form.weakSubSectionIds.length + form.weakTopicIds.length;

  const rows = [
    { label: "Entrance", value: form.entrance?.title, icon: "🎓" },
    { label: "Exam", value: form.exam?.title, icon: "📝" },
    { label: "Start", value: fmtDate(form.prepStartDate), icon: "🗓️" },
    { label: "Exam Date", value: fmtDate(form.examDate), icon: "🏁" },
    {
      label: "Window",
      value: `${days}d / ${Math.floor(days / 7)}wks`,
      icon: "⏳",
    },
    { label: "Weekday", value: `${form.hoursPerWeekday} hrs/day`, icon: "📅" },
    { label: "Weekend", value: `${form.hoursPerWeekend} hrs/day`, icon: "🌅" },
    { label: "Total Hours", value: `~${hours} hrs`, icon: "⏱️" },
    { label: "Level", value: level?.label, icon: level?.icon },
  ];

  return (
    <div>
      <StepHeading
        step={5}
        title="Everything looks good?"
        sub="Review before we generate your personalised schedule."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-xl p-2.5"
          >
            <span className="text-base shrink-0">{r.icon}</span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">
                {r.label}
              </p>
              <p className="font-bold text-xs text-cyan-900 mt-0.5 truncate">
                {r.value ?? "—"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {weakTotal > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl mb-4 animate-[fadeSlide_0.3s_ease]">
          <span className="text-xl shrink-0">🎯</span>
          <div>
            <p className="font-bold text-red-800 text-sm">Weak areas flagged</p>
            <p className="text-red-700 text-xs mt-0.5">
              {form.weakSubSectionIds.length > 0 &&
                `${form.weakSubSectionIds.length} sub-section${form.weakSubSectionIds.length > 1 ? "s" : ""}`}
              {form.weakSubSectionIds.length > 0 &&
                form.weakTopicIds.length > 0 &&
                " · "}
              {form.weakTopicIds.length > 0 &&
                `${form.weakTopicIds.length} topic${form.weakTopicIds.length > 1 ? "s" : ""}`}{" "}
              — extra hours allocated.
            </p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-2xl p-5 text-center">
        <p className="text-3xl mb-2">🚀</p>
        <p className="font-extrabold text-base text-cyan-900 mb-1">
          Ready to build your plan?
        </p>
        <p className="text-xs text-cyan-900 mb-4">
          {hours} hours across {Math.floor(days / 7)} weeks — smart section
          balance + revision phase.
        </p>
        <button
          onClick={onSubmit}
          disabled={loading}
          className={[
            "w-full sm:w-auto px-8 py-3 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-200",
            loading
              ? "bg-cyan-100 text-cyan-300 cursor-not-allowed"
              : "bg-amber-600 text-white shadow-lg cursor-pointer hover:bg-amber-700",
          ].join(" ")}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate My Plan →"
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
interface StudyPlannerModalProps {
  onClose: () => void;
  onPlanGenerated?: (data: unknown) => void;
}

export function StudyPlannerModal({
  onClose,
  onPlanGenerated,
}: StudyPlannerModalProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, setPostAuthAction, openAuth } = useAuth();
  const { showLoader, hideLoader } = useLoader();

  const [form, setFormRaw] = useState<FormState>({
    entrance: null,
    exam: null,
    prepStartDate: todayStr(),
    examDate: "",
    hoursPerWeekday: null,
    hoursPerWeekend: null,
    examPrepLevel: null,
    weakSubSectionIds: [],
    weakTopicIds: [],
  });

  const set = useCallback(
    (patch: Partial<FormState>) =>
      setFormRaw((prev) => ({ ...prev, ...patch })),
    [],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const canProceed: boolean[] = [
    !!(form.entrance && form.exam),
    !!(form.prepStartDate && form.examDate),
    !!(form.hoursPerWeekday && form.hoursPerWeekend),
    !!form.examPrepLevel,
    true,
    true,
  ];

  const hints = [
    "Pick your entrance first, then your specific exam.",
    "Exact dates help us fit your full syllabus before the exam.",
    "Honest hours = a plan you'll actually follow.",
    "Your level sets how much time each topic gets.",
    "Review topics and optionally flag weak areas.",
    "",
  ];

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };
  const handleBack = () => {
    setError(null);
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!user || !user.username) {
      // Not logged in — close modal, show auth, and run plan generation after login
      onClose();
      showLoader();

      setPostAuthAction(() => async () => {
        hideLoader();
        showLoader(); // show loader during generation

        try {
          const payload = {
            entrance: form.entrance,
            exam: form.exam,
            prepStartDate: form.prepStartDate,
            examDate: form.examDate,
            hoursPerWeekday: form.hoursPerWeekday,
            hoursPerWeekend: form.hoursPerWeekend,
            examPrepLevel: form.examPrepLevel,
            weakSubSectionIds: form.weakSubSectionIds,
            weakTopicIds: form.weakTopicIds,
          };
          const data = await studyPlannerService.generateStudyPlan(payload);
          onPlanGenerated?.(data);
          router.push("/dashboard");
        } catch (e) {
          console.error("Plan generation failed:", e);
        } finally {
          hideLoader();
        }
      });

      hideLoader();
      openAuth();
      return;
    }

    // Already logged in
    setLoad(true);
    setError(null);
    showLoader();
    onClose();

    try {
      const payload = {
        entrance: form.entrance,
        exam: form.exam,
        prepStartDate: form.prepStartDate,
        examDate: form.examDate,
        hoursPerWeekday: form.hoursPerWeekday,
        hoursPerWeekend: form.hoursPerWeekend,
        examPrepLevel: form.examPrepLevel,
        weakSubSectionIds: form.weakSubSectionIds,
        weakTopicIds: form.weakTopicIds,
      };
      const data = await studyPlannerService.generateStudyPlan(payload);
      onPlanGenerated?.(data);
      router.push("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoad(false);
      hideLoader();
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.5; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Dialog
        open
        fullWidth
        maxWidth="md"
        onClose={onClose}
        disableEscapeKeyDown
        BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.75)" } }}
        PaperProps={{
          // Mobile: full screen. Desktop: 85vh centered modal
          className:
            "!rounded-none sm:!rounded-2xl !shadow-2xl !bg-[#faf9f7] !m-0 sm:!m-4 !flex !flex-col !overflow-hidden !font-sans !w-full sm:!max-h-[85vh] !h-full sm:!h-auto",
          style: { maxHeight: "100dvh" },
        }}
      >
        {/* ── Header ── */}
        <div className="relative flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 shrink-0 border-b border-cyan-800 bg-cyan-900">
          <div className="absolute inset-0 z-10">
            {/* Deep space base */}
            <div className="absolute inset-0 bg-[#020617]" />

            {/* Cyan nebula */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />

            {/* Green nebula */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />

            {/* Soft atmospheric diffusion */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04),transparent_120%)]" />

          
          </div>
          <div className="absolute top-0 left-0 w-screen h-full bg-[rgba(0,0,0,0.2)] z-10"></div>
          <div className="flex items-center gap-2.5 z-20">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500 flex items-center justify-center text-sm shrink-0">
              📋
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base text-amber-50 leading-none">
                Study Planner
              </p>
              <p className="text-[12px] text-amber-100 mt-0.5">crackora.com</p>
            </div>
          </div>
          <div className="flex-1 max-w-36 sm:max-w-48 mx-3 sm:mx-5">
            <div className="h-1 bg-amber-50/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
            <p className="text-[9px] sm:text-[10px] text-amber-200 mt-1 text-center">
              {step + 1} / {STEPS.length} — {STEPS[step]}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 z-20 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-red-800 bg-white hover:bg-red-50 border border-red-200 transition-colors text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* ── Step dots ── */}
        <StepDots current={step} />

        {/* ── Scrollable content ── */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto bg-[#f8f7f4]">
          <div
            key={step}
            className="animate-[fadeSlide_0.3s_ease] px-4 sm:px-6 py-4 sm:py-5"
          >
            {step === 0 && <Step0 form={form} set={set} />}
            {step === 1 && <Step1 form={form} set={set} />}
            {step === 2 && <Step2 form={form} set={set} />}
            {step === 3 && <Step3 form={form} set={set} />}
            {step === 4 && <Step4Wrapper form={form} set={set} />}
            {step === 5 && (
              <Step5 form={form} onSubmit={handleSubmit} loading={loading} />
            )}

            {error && (
              <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-500 text-xs">
                ⚠️ {error}
              </div>
            )}

            {step === 5 && (
              <div className="mt-4">
                <button
                  onClick={handleBack}
                  className="px-5 py-2 rounded-lg border border-cyan-900 bg-cyan-900 text-white text-sm cursor-pointer hover:opacity-90 transition-opacity"
                >
                  ← Edit Details
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Fixed bottom nav (steps 0–4 only) ── */}
        {step < 5 && (
          <NavButtons
            step={step}
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={!canProceed[step]}
            hint={hints[step]}
          />
        )}
      </Dialog>
    </>
  );
}
