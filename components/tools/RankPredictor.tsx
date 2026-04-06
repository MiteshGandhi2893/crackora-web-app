"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  mcaToolsService,
  type ExamKey,
  type ExamMeta,
  type CollegeResult,
  type PredictRankResult,
} from "@/services/mca-tools.service";
import { TierBadge } from "./tools-util";

// ─── Colours ──────────────────────────────────────────────────────────────────

const EXAM_COLORS: Record<string, { primary: string; light: string; border: string }> = {
  nimcet: { primary: "#f59e0b", light: "#fffbeb", border: "#fde68a" },
  mah:    { primary: "#8b5cf6", light: "#f5f3ff", border: "#ddd6fe" },
};

// ─── College card ─────────────────────────────────────────────────────────────

function CollegeCard({
  college,
  isRank,
  color,
}: {
  college: Pick<CollegeResult, "name" | "state" | "tier" | "fees" | "cutoff">;
  isRank: boolean;
  color: string;
}) {
  const tierBg =
    college.tier === "S" ? "bg-amber-50 border-amber-200"
    : college.tier === "A" ? "bg-sky-50 border-sky-200"
    : "bg-gray-50 border-gray-200";

  return (
    <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${tierBg}`}>
      <div className="flex items-center gap-2 min-w-0">
        <TierBadge tier={college.tier} />
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate">{college.name}</p>
          <p className="text-[11px] text-gray-400">{college.state}</p>
        </div>
      </div>
      <div className="text-right shrink-0 ml-3">
        <p className="text-[10px] text-gray-400 leading-tight">
          {isRank ? "Last seat at rank" : "Min percentile"}
        </p>
        <p className="text-sm font-black tabular-nums" style={{ color }}>
          {isRank
            ? Number(college.cutoff).toLocaleString()
            : Number(college.cutoff).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Compute total marks from pattern sections (sum of all section marks)
// pattern.total from DB is question count, not marks total
function getTotalMarks(meta: ExamMeta): number {
  return meta.pattern.sections.reduce((sum, s) => sum + s.marks, 0);
}

function getTotalQuestions(meta: ExamMeta): number {
  return meta.pattern.sections.reduce((sum, s) => sum + s.q, 0);
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RankPredictorTool() {
  const [examMetaList, setExamMetaList] = useState<ExamMeta[]>([]);
  const [exam,         setExam]         = useState<ExamKey>("nimcet");

  // NIMCET: student can enter score (pre-result) OR rank (post-result)
  // MAH: always percentile
  const [nimcetMode, setNimcetMode] = useState<"score" | "rank">("score");

  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const [rankResult,    setRankResult]    = useState<PredictRankResult | null>(null);
  const [collegeResult, setCollegeResult] = useState<CollegeResult[] | null>(null);

  useEffect(() => {
    mcaToolsService.getExamMeta().then(setExamMetaList).catch(() => {});
  }, []);

  const meta   = examMetaList.find(m => m.key === exam);
  const colors = EXAM_COLORS[exam] ?? EXAM_COLORS.nimcet;

  const isNimcet      = exam === "nimcet";
  const effectiveMode = isNimcet ? nimcetMode : "rank";
  const isScoreMode   = effectiveMode === "score";

  // Max allowed value for the input — score mode uses total marks, rank/pct uses maxInput
  const totalMarks    = meta ? getTotalMarks(meta) : 1000;
  const totalQuestions = meta ? getTotalQuestions(meta) : 120;
  const inputMax      = isScoreMode ? totalMarks : (meta?.maxInput ?? 15000);

  // ── KEY FIX: reset() must NOT clear the input field ──────────
  // The old reset() called setInput("") which cleared the input on every
  // keystroke because onChange called reset(). Now reset() only clears
  // results/error — input is only cleared on exam switch or manual clear.
  const clearResults = () => {
    setRankResult(null);
    setCollegeResult(null);
    setError(null);
  };

  const clearAll = () => {
    setInput("");
    clearResults();
  };

  const resetExam = (key: ExamKey) => {
    setExam(key);
    setNimcetMode("score");
    clearAll();
  };

  const handlePredict = async () => {
    const val = parseFloat(input);
    if (!val || val <= 0) return;

    setLoading(true);
    clearResults();

    try {
      if (isNimcet && isScoreMode) {
        // NIMCET score → predicted rank band + college preview
        const res = await mcaToolsService.predictRank({ exam: "nimcet", score: val });
        setRankResult(res);
      } else {
        // NIMCET rank OR MAH percentile → colleges directly
        const res = await mcaToolsService.predictColleges({
          exam,
          value   : val,
          category: "General",
          year    : 2025,
        });
        setCollegeResult(res.colleges.slice(0, 8));
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasResult = rankResult !== null || collegeResult !== null;

  return (
    <div className="space-y-4">

      {/* ── Exam tabs ─────────────────────────────────────────── */}
      {examMetaList.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {examMetaList.map(m => {
            const mc = EXAM_COLORS[m.key] ?? EXAM_COLORS.nimcet;
            return (
              <button
                key={m.key}
                onClick={() => resetExam(m.key)}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border"
                style={exam === m.key
                  ? { backgroundColor: mc.primary, color: "#fff", borderColor: "transparent" }
                  : { backgroundColor: "#f9fafb", color: "#6b7280", borderColor: "#e5e7eb" }}
              >
                {m.shortName}
              </button>
            );
          })}
        </div>
      )}

      {/* ── NIMCET: score vs rank toggle ───────────────────────── */}
      {isNimcet && (
        <div className="flex flex-col sm:flex-row gap-2 p-1 bg-gray-100 rounded-xl w-fit">
          {([
            
            // {
            //   mode : "rank" as const,
            //   emoji: "🏆",
            //   title: "I know my rank",
            //   sub  : "Result is already out",
            // },
          ]).map(({ mode, emoji, title, sub }) => (
            <button
              key={mode}
              onClick={() => { setNimcetMode(mode); clearAll(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-all cursor-pointer ${
                nimcetMode === mode
                  ? "bg-white shadow-sm"
                  : "hover:bg-white/50"
              }`}
            >
              <span className="text-lg">{emoji}</span>
              <div>
                <p className={`text-xs font-bold ${nimcetMode === mode ? "text-gray-800" : "text-gray-500"}`}>
                  {title}
                </p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── What to enter — student-first explanation ─────────── */}
      <div
        className="rounded-xl px-4 py-3 text-sm leading-relaxed"
        style={{ backgroundColor: colors.light, border: `1px solid ${colors.border}` }}
      >
        {isNimcet && isScoreMode ? (
          <div>
            <p className="font-black text-base mb-1" style={{ color: colors.primary }}>
              Enter your NIMCET score below 👇
            </p>
            <p className="text-gray-600">
              This tool will predict <strong>what rank you are likely to get</strong> based on your score,
              and show you <strong>which colleges you can target</strong>.
            </p>
            <p className="text-gray-500 text-xs mt-1.5">
              Works for mock test scores too — great for planning before the actual exam.
            </p>
          </div>
        ) : isNimcet ? (
          <div>
            <p className="font-black text-base mb-1" style={{ color: colors.primary }}>
              Enter your NIMCET rank below 👇
            </p>
            <p className="text-gray-600">
              We will show you <strong>which colleges you can get into</strong> based on your rank.
              Rank 1 = top scorer in India. Lower number = better.
            </p>
          </div>
        ) : (
          <div>
            <p className="font-black text-base mb-1" style={{ color: colors.primary }}>
              Enter your MAH MCA CET percentile below 👇
            </p>
            <p className="text-gray-600">
              We will show you <strong>which colleges you qualify for</strong>.
              Percentile 99.5 means you scored better than 99.5% of all students. Higher = better.
            </p>
          </div>
        )}
      </div>

      {/* ── Input ─────────────────────────────────────────────── */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="number"
            min={1}
            max={inputMax}
            placeholder={
              isNimcet && isScoreMode
                ? `Your score  e.g. 280  (out of ${totalMarks} marks)`
                : isNimcet
                ? "Your rank  e.g. 450"
                : "Your percentile  e.g. 98.50"
            }
            value={input}
            // ── FIX: onChange only updates input value, does NOT call clearAll/reset
            //    clearResults() only clears result cards, never the input itself
            onChange={e => {
              setInput(e.target.value);
              clearResults();   // clear old results when user types new value
            }}
            onKeyDown={e => e.key === "Enter" && handlePredict()}
            className="w-full border-2 rounded-xl px-4 py-3 text-base font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-normal outline-none transition-all bg-white"
            style={{ borderColor: input ? colors.primary : "#e5e7eb" }}
          />
          {/* Score range hint shown inside input area */}
          {isNimcet && isScoreMode && input && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              / {totalMarks}
            </span>
          )}
        </div>

        <button
          onClick={handlePredict}
          disabled={loading || !input || parseFloat(input) <= 0}
          className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          style={{ backgroundColor: colors.primary }}
        >
          {loading
            ? <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10"/>
                </svg>
                Checking…
              </span>
            : isNimcet && isScoreMode
            ? "Predict My Rank →"
            : "Show My Colleges →"
          }
        </button>
      </div>

      {/* ── Exam pattern — always visible ────────────────────── */}
      {meta && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            {meta.shortName} exam pattern
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {meta.pattern.sections.map(s => (
              <span
                key={s.name}
                className="text-[11px] px-2.5 py-1 rounded-lg font-semibold text-gray-600"
                style={{ backgroundColor: colors.light, border: `1px solid ${colors.border}` }}
              >
                {s.name} — {s.q}Q · {s.marks} marks
              </span>
            ))}
          </div>
          <p className="text-[11px] text-gray-400">
            Marking: {meta.pattern.marking}
            {meta.pattern.duration && <span> · Duration: {meta.pattern.duration}</span>}
            {" · "}{totalQuestions} questions · {totalMarks} total marks
          </p>
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          RESULTS
      ═══════════════════════════════════════════════════════════ */}

      {/* CASE 1: Score mode → predicted rank band */}
      {rankResult && (
        <div className="space-y-3">

          {/* Rank prediction card */}
          <div
            className="rounded-2xl p-5 border"
            style={{ backgroundColor: colors.light, borderColor: colors.border }}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: colors.primary }}>
              If you score {input} marks, your predicted rank is
            </p>
            <p className="text-4xl font-black tabular-nums leading-none mb-1" style={{ color: colors.primary }}>
              {rankResult.predicted_rank.min.toLocaleString()}
              <span className="text-2xl"> – </span>
              {rankResult.predicted_rank.max.toLocaleString()}
            </p>
            <p className="text-xs font-semibold mt-1" style={{ color: colors.primary, opacity: 0.75 }}>
              {rankResult.predicted_rank.label}
            </p>
            <div
              className="mt-3 pt-3 border-t text-xs text-gray-500 leading-relaxed"
              style={{ borderColor: colors.border }}
            >
              Students who scored around <strong>{input}</strong> out of <strong>{totalMarks}</strong>{" "}
              in past years typically landed in this rank range.
              Your actual rank may differ based on how many students appeared and how hard the paper was.
            </div>
          </div>

          {/* What this rank means in plain English */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-600 leading-relaxed">
            <p className="font-bold text-gray-700 mb-1">What does this rank mean for you?</p>
            <p>
              Rank <strong>{rankResult.predicted_rank.min.toLocaleString()}</strong> to{" "}
              <strong>{rankResult.predicted_rank.max.toLocaleString()}</strong> means that roughly{" "}
              <strong>{rankResult.predicted_rank.min.toLocaleString()} to {rankResult.predicted_rank.max.toLocaleString()} students</strong>{" "}
              scored better than you across India. The colleges below had their last seat filled by someone with a rank in this range or higher.
            </p>
          </div>

          {/* Colleges at this rank */}
          {rankResult.colleges_preview.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Colleges you can likely target at this rank
              </p>
              {rankResult.colleges_preview.map(c => (
                <CollegeCard key={c.name} college={c} isRank={true} color={colors.primary} />
              ))}
              <p className="text-[11px] text-gray-400 leading-relaxed">
                ⚠ This is an estimate based on historical data. Once your actual rank is out,
                use the <strong>College Predictor</strong> tab for exact results with category filters.
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center">
              <p className="text-sm font-bold text-orange-800 mb-1">
                No colleges found for this rank range
              </p>
              <p className="text-xs text-orange-600">
                With a predicted rank of {rankResult.predicted_rank.min.toLocaleString()}–{rankResult.predicted_rank.max.toLocaleString()},
                you are beyond the cutoff of all colleges in our current list.
                Try scoring higher on your next mock test to see college options appear.
              </p>
            </div>
          )}
        </div>
      )}

      {/* CASE 2: Rank/percentile → colleges directly */}
      {collegeResult !== null && (
        <div className="space-y-3">

          {/* Summary header */}
          <div
            className="rounded-2xl p-4 border flex items-center justify-between flex-wrap gap-3"
            style={{ backgroundColor: colors.light, borderColor: colors.border }}
          >
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest mb-0.5" style={{ color: colors.primary }}>
                {exam === "nimcet" ? "Your NIMCET rank" : "Your MAH MCA CET percentile"}
              </p>
              <p className="text-3xl font-black tabular-nums" style={{ color: colors.primary }}>
                {exam === "nimcet"
                  ? Number(input).toLocaleString()
                  : Number(input).toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-400">General category</p>
              <p className="text-sm font-bold text-gray-600">2025 data</p>
            </div>
          </div>

          {collegeResult.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {collegeResult.length} college{collegeResult.length !== 1 ? "s" : ""} you can get into
              </p>
              {collegeResult.map(c => (
                <CollegeCard
                  key={c.name}
                  college={c}
                  isRank={exam === "nimcet"}
                  color={colors.primary}
                />
              ))}
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                Want category-wise cutoffs (OBC / SC / ST / EWS) and Safe / Likely / Tough labels?
                Use the <strong>College Predictor</strong> tab for the full breakdown.
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">😕</div>
              <p className="text-sm font-bold text-orange-800 mb-2">
                No colleges found for {exam === "nimcet" ? "rank" : "percentile"} {input}
              </p>
              <p className="text-xs text-orange-600 max-w-sm mx-auto">
                {exam === "nimcet"
                  ? `In 2025, the last seat at every college went to a student with a better rank than ${Number(input).toLocaleString()}. You need a lower rank number to qualify.`
                  : `In 2025, every college required a higher percentile than ${input}. You need a better score to qualify.`}
              </p>
            </div>
          )}

          {collegeResult.length > 0 && (
            <p className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 leading-relaxed">
              📋 Based on 2025 actual admissions · General category · Cutoffs change every year, treat this as a guide.
            </p>
          )}
        </div>
      )}

      {/* ── Clear / try again ─────────────────────────────────── */}
      {hasResult && (
        <button
          onClick={clearAll}
          className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 cursor-pointer transition-colors"
        >
          ← Clear and try a different{" "}
          {isNimcet && isScoreMode ? "score" : exam === "nimcet" ? "rank" : "percentile"}
        </button>
      )}
    </div>
  );
}