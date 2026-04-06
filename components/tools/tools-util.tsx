"use client";
import { EXAM_META, ExamKey } from "@/data/mca-tools-data";
import { CollegePredictorTool } from "./CollegePredictor";
import { CollegeCompareTool } from "./CollegeComparision";
import { CutoffAnalyserTool } from "./CuttoffAnalyserTool";
import { StudyPlannerPreview } from "./StudyPlannerTool";
import { SalaryCalculatorTool } from "./SalaryCalculator";
import { EligibilityCheckerTool } from "./EligibilityCheckerTool";
import { useState } from "react";
import { ComingSoon } from "../ComingSoon";

export function ExamTab({
  keys,
  active,
  onSelect,
}: {
  keys: ExamKey[];
  active: ExamKey;
  onSelect: (k: ExamKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {keys.map((k) => {
        const m = EXAM_META[k];
        return (
          <button
            key={k}
            onClick={() => onSelect(k)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              active === k
                ? "text-white border-transparent"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
            style={
              active === k
                ? { backgroundColor: m.color, borderColor: m.color }
                : {}
            }
          >
            {m.shortName}
          </button>
        );
      })}
    </div>
  );
}

export function InfoBanner({ text, color }: { text: string; color: string }) {
  return (
    <div
      className="flex items-start gap-2 rounded-xl px-3 py-2.5 border mb-4 text-xs"
      style={{
        backgroundColor: EXAM_META[color as ExamKey]?.bgColor ?? "#fffbeb",
        borderColor: EXAM_META[color as ExamKey]?.borderColor ?? "#fcd34d",
      }}
    >
      <span className="shrink-0 mt-0.5">ℹ</span>
      <p style={{ color: EXAM_META[color as ExamKey]?.color ?? "#d97706" }}>
        {text}
      </p>
    </div>
  );
}

export function ResultHeader({
  count,
  label,
  color,
}: {
  count: number;
  label: string;
  color: string;
}) {
  return (
    <p
      className="text-[11px] font-bold uppercase tracking-wider mb-2"
      style={{ color: EXAM_META[color as ExamKey]?.color ?? "#d97706" }}
    >
      {count} {count === 1 ? "college" : "colleges"} {label}
    </p>
  );
}

export function TierBadge({ tier }: { tier: string }) {
  const cls =
    tier === "S"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : tier === "A"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border ${cls}`}
    >
      {tier === "S" ? "★" : tier}
    </span>
  );
}

export function ToolCard({ tool }: { tool: ToolDef }) {
  const [open, setOpen] = useState(tool.featured ?? false);
  return (
    <div
      className={` rounded-2xl border ${tool.extraClass} shadow-md hover:shadow-md transition-all duration-300 overflow-hidden ${tool.featured ? "lg:col-span-2" : ""}`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shrink-0">
              {tool.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h3 className="text-[15px] font-bold text-gray-900">
                  {tool.title}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tool.badgeBg} ${tool.badgeText}`}
                >
                  {tool.badge}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {tool.tagline} · No login required
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              open
                ? "bg-gray-100 border-gray-200 text-gray-600"
                : "border-amber-200 text-amber-600 hover:bg-amber-600 hover:text-white"
            }`}
          >
            {open ? "Hide ↑" : "Try Now ↓"}
          </button>
        </div>
        <p className="text-gray-700 text-[13px] leading-relaxed mt-3">
          {tool.description}
        </p>
      </div>

      {open && (
        <div className="px-5 sm:px-6 pb-6 border-t border-gray-50 pt-5">
          {tool.component}
        </div>
      )}
    </div>
  );
}

export type ToolKey =
  | "college"
  | "college-comparison"
  | "planner"
  | "cutoff"
  | "salary"
  | "eligibility";

export type ToolDef = {
  id: ToolKey;
  icon: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  title: string;
  tagline: string;
  description: string;
  when: string;
  component: React.ReactNode;
  featured?: boolean;
  extraClass?: string;
  isActive?: boolean;
};

export const TOOL_LIST: ToolDef[] = [
  {
    id: "college",
    icon: "🎓",
    badge: "Most Used",
    badgeBg: "bg-amber-600",
    badgeText: "text-amber-50",
    title: "College Predictor",
    tagline: "Use after results — July/Aug",
    description:
      "Enter your rank or score for any of the 6 MCA exams. See which colleges you're likely to get based on official 2023–2025 counselling data. All 6 exams, all categories.",
    when: "After results",
    component: <CollegePredictorTool />,
    featured: true,
    extraClass: "bg-[#f8f7f4]/50 border-amber-200",
  },
  {
  id: "college-comparison",
  icon: "🏫",
  badge: "New",
  badgeBg: "bg-blue-600",
  badgeText: "text-blue-50",
  title: "College Comparison",
  tagline: "Compare Now",
  description:
    "Compare MCA colleges side-by-side based on placements, fees, cutoffs, rankings, and real data from recent counselling rounds. Make smarter decisions with clarity.",
  when: "Before choice filling",
  component: <CollegeCompareTool />,
  featured: true,
  extraClass: "bg-[#f4f8fb]/50 border-blue-200",
},

  {
    id: "planner",
    icon: "📅",
    badge: "Personalized Tracker",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    title: "Study Planner",
    tagline: "Use at the start of preparation",
    description:
      "Tell us your exam date, weak subjects, and daily available hours. Get a complete day-by-day schedule personalised to your timeline.",
    when: "Start of prep",
    component: <ComingSoon />,
  },
  {
    id: "cutoff",
    icon: "📉",
    badge: "Research",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    title: "Cutoff Analyser",
    tagline: "Use when setting targets",
    description:
      "3 years of cutoff history for all 6 exams and their colleges. See if competition is rising or falling. Set realistic targets with real data, not guesswork.",
    when: "Target setting",
    component: <CutoffAnalyserTool />,
    extraClass: "bg-amber-50/50 border-amber-200",
    featured: true,
  },
  {
    id: "salary",
    icon: "💰",
    badge: "Career",
    badgeBg: "bg-teal-50",
    badgeText: "text-teal-700",
    title: "Salary Calculator",
    tagline: "Use when deciding if MCA is worth it",
    description:
      "Select your specialisation and role track. See realistic salary ranges at 0–2, 3–5, and 5+ years based on AmbitionBox, Glassdoor India, and Naukri data.",
    when: "Decision phase",
    component: <SalaryCalculatorTool />,
  },
  {
    id: "eligibility",
    icon: "🔍",
    badge: "Right Now",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-700",
    title: "Eligibility Checker",
    tagline: "Use before registering for exams",
    description:
      "Enter your stream and percentage. Instantly know which of the 6 MCA entrance exams you're eligible for — covering all official 2026 criteria.",
    when: "Before registration",
    component: <EligibilityCheckerTool />,
  },
];
