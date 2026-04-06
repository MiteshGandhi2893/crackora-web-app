/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  mcaToolsService,
  type ExamKey,
  type ExamMeta,
  type Category,
  type CollegeResult,
} from "@/services/mca-tools.service";
import { TierBadge } from "./tools-util";

// ─── Colours ──────────────────────────────────────────────────────────────────

const EXAM_COLORS: Record<string, { primary: string; light: string; border: string }> = {
  nimcet: { primary: "#d97706", light: "#fffbeb", border: "#fcd34d" },
  mah:    { primary: "#2563eb", light: "#eff6ff", border: "#93c5fd" },
};

// ─── Safety classification (internal — never shown as raw numbers to student) ─
//
//  NIMCET (rank): relative buffer = (cutoff − rank) / cutoff
//    ≥35% → SAFE    e.g. rank 50 vs cutoff 108 → 54% → SAFE
//    ≥10% → LIKELY  e.g. rank 40 vs cutoff 47  → 15% → LIKELY
//    <10% → TOUGH   e.g. rank 107 vs cutoff 108 → 0.9% → TOUGH
//
//  MAH (percentile): absolute gap = student − cutoff
//    ≥1.5 → SAFE    e.g. 99.20 vs 97.62 → +1.58 → SAFE
//    ≥0.4 → LIKELY  e.g. 99.20 vs 98.76 → +0.44 → LIKELY
//    <0.4 → TOUGH   e.g. 98.50 vs 98.38 → +0.12 → TOUGH
//
//  classify() is only called on colleges the server already confirmed are
//  reachable, so the buffer is always ≥ 0.

type Safety = "SAFE" | "LIKELY" | "TOUGH";

function classify(cutoff: number, studentValue: number, isRank: boolean): Safety {
  if (isRank) {
    const rel = (cutoff - studentValue) / cutoff;
    if (rel >= 0.35) return "SAFE";
    if (rel >= 0.10) return "LIKELY";
    return "TOUGH";
  } else {
    const gap = studentValue - cutoff;
    if (gap >= 1.5) return "SAFE";
    if (gap >= 0.4) return "LIKELY";
    return "TOUGH";
  }
}

// ─── Safety badge ─────────────────────────────────────────────────────────────

function SafetyBadge({ label }: { label: Safety }) {
  const styles: Record<Safety, string> = {
    SAFE  : "bg-emerald-100 text-emerald-700 border-emerald-200",
    LIKELY: "bg-sky-100 text-sky-700 border-sky-200",
    TOUGH : "bg-rose-100 text-rose-700 border-rose-200",
  };
  return (
    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border tracking-wide ${styles[label]}`}>
      {label}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CollegePredictorTool() {
  const [examMetaList,   setExamMetaList]   = useState<ExamMeta[]>([]);
  const [exam,           setExam]           = useState<ExamKey>("nimcet");
  const [value,          setValue]          = useState("");
  const [cat,            setCat]            = useState<Category>("General");
  const [results,        setResults]        = useState<CollegeResult[] | null>(null);
  const [allYearData,    setAllYearData]    = useState<Record<number, CollegeResult[]>>({});
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [tried,          setTried]          = useState(false);
  const [selectedYear,   setSelectedYear]   = useState(2025);
  const [showOlderYears, setShowOlderYears] = useState(false);

  useEffect(() => {
    mcaToolsService.getExamMeta().then(setExamMetaList).catch(() => {});
  }, []);

  const meta   = examMetaList.find(m => m.key === exam);
  const isRank = exam === "nimcet";
  const colors = EXAM_COLORS[exam] ?? EXAM_COLORS.nimcet;

  const predict = async () => {
    setTried(true);
    const v = parseFloat(value);
    if (!v || v <= 0) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setAllYearData({});
    try {
      const [r25, r24, r23] = await Promise.all([
        mcaToolsService.predictColleges({ exam, value: v, category: cat, year: 2025 }),
        mcaToolsService.predictColleges({ exam, value: v, category: cat, year: 2024 }),
        mcaToolsService.predictColleges({ exam, value: v, category: cat, year: 2023 }),
      ]);
      const yearMap: Record<number, CollegeResult[]> = {
        2025: r25.colleges,
        2024: r24.colleges,
        2023: r23.colleges,
      };
      setAllYearData(yearMap);
      setResults(yearMap[2025]);
      setSelectedYear(2025);
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchYear = (yr: number) => {
    setSelectedYear(yr);
    if (allYearData[yr]) setResults(allYearData[yr]);
  };

  const numVal = parseFloat(value);
  const safe   = results?.filter(c => classify(c.cutoff, numVal, isRank) === "SAFE").length   ?? 0;
  const likely = results?.filter(c => classify(c.cutoff, numVal, isRank) === "LIKELY").length ?? 0;
  const tough  = results?.filter(c => classify(c.cutoff, numVal, isRank) === "TOUGH").length  ?? 0;

  const tierBg = (t: string) =>
    t === "S" ? "bg-amber-50 border-amber-200"
    : t === "A" ? "bg-sky-50 border-sky-200"
    : "bg-gray-50 border-gray-200";

  const resetExam = (key: ExamKey) => {
    setExam(key); setResults(null); setValue(""); setCat("General");
    setTried(false); setError(null); setAllYearData({}); setSelectedYear(2025);
  };

  return (
    <div className="space-y-4">

      {/* ── Exam tabs ───────────────────────────────────────── */}
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

      {/* ── What this exam uses ─────────────────────────────── */}
      <div
        className="rounded-xl px-4 py-3 text-xs leading-relaxed"
        style={{ backgroundColor: colors.light, border: `1px solid ${colors.border}`, color: colors.primary }}
      >
        {isRank ? (
          <>
            <span className="font-black">How NIMCET rank works:</span>
            {" "}Rank 1 means you scored the highest in India. Rank 15,000 means you scored the lowest among qualifiers.
            {" "}<span className="font-bold">Lower your rank number = better your score.</span>
            {" "}Enter your rank below to see which colleges you can get into.
          </>
        ) : (
          <>
            <span className="font-black">How MAH MCA CET percentile works:</span>
            {" "}A percentile of 99.5 means you scored better than 99.5% of all students who appeared.
            {" "}<span className="font-bold">Higher your percentile = better your score.</span>
            {" "}Enter your percentile below to see which colleges you can get into.
          </>
        )}
      </div>

      {/* ── Input card ──────────────────────────────────────── */}
      <div className="rounded-2xl p-4 border-2 bg-white" style={{ borderColor: colors.border }}>
        <div className="flex flex-col sm:flex-row gap-2">

          <input
            type="number"
            min={1}
            max={meta?.maxInput}
            placeholder={isRank ? "Enter your rank  e.g. 450" : "Enter your percentile  e.g. 98.50"}
            value={value}
            onChange={e => { setValue(e.target.value); setResults(null); setTried(false); setError(null); }}
            onKeyDown={e => e.key === "Enter" && predict()}
            className="flex-1 border-2 rounded-xl px-4 py-3 text-base font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-normal outline-none transition-all bg-white"
            style={{ borderColor: value ? colors.primary : "#e5e7eb" }}
          />

          <select
            value={cat}
            onChange={e => { setCat(e.target.value as Category); setResults(null); }}
            className="border-2 border-gray-200 focus:border-gray-400 rounded-xl px-3 py-3 text-sm text-gray-700 outline-none bg-white font-semibold sm:w-36"
          >
            {/* Simple category names — students already know their own category */}
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
          </select>

          <button
            onClick={predict}
            disabled={loading || !value}
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
              : "Find My Colleges →"
            }
          </button>
        </div>

        {/* Older year toggle — hidden by default */}
        <button
          onClick={() => setShowOlderYears(x => !x)}
          className="mt-2.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer underline underline-offset-2"
        >
          {showOlderYears ? "▲ Hide" : "▼ Want to check older year cutoffs? (2024 / 2023)"}
        </button>
        {showOlderYears && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Showing cutoffs for:</span>
            {[2025, 2024, 2023].map(yr => (
              <button
                key={yr}
                onClick={() => { setSelectedYear(yr); if (allYearData[yr]) setResults(allYearData[yr]); }}
                className="text-xs px-3 py-1 rounded-lg border font-bold transition-all cursor-pointer"
                style={selectedYear === yr
                  ? { backgroundColor: colors.primary, color: "#fff", borderColor: "transparent" }
                  : { backgroundColor: "#f9fafb", color: "#6b7280", borderColor: "#e5e7eb" }}
              >
                {yr}{yr === 2025 ? " (latest)" : ""}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Validation / error ──────────────────────────────── */}
      {tried && !value && (
        <p className="text-xs text-red-500 font-semibold">
          Please enter your {isRank ? "rank" : "percentile"} first.
        </p>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {/* ── Results ─────────────────────────────────────────── */}
      {results !== null && !loading && (
        <div className="space-y-3">

          {/* What SAFE / LIKELY / TOUGH means — shown BEFORE the list */}
          {results.length > 0 && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-600 space-y-1.5">
              <p className="font-bold text-gray-700 mb-1">What do the labels mean?</p>
              <p>
                <span className="inline-block bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full text-[11px] mr-1.5">SAFE</span>
                Your {isRank ? "rank" : "percentile"} is well above what was needed last year. Good chance of getting a seat here.
              </p>
              <p>
                <span className="inline-block bg-sky-100 text-sky-700 font-black px-2 py-0.5 rounded-full text-[11px] mr-1.5">LIKELY</span>
                You are close to the cutoff. You may get in, but do not treat it as confirmed. Keep a backup.
              </p>
              <p>
                <span className="inline-block bg-rose-100 text-rose-700 font-black px-2 py-0.5 rounded-full text-[11px] mr-1.5">TOUGH</span>
                You just barely qualified based on last year`s data. Very risky — do not rely on this college alone.
              </p>
            </div>
          )}

          {/* Summary: how many in each bucket */}
          {results.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "SAFE",   count: safe,   bg: "bg-emerald-50", border: "border-emerald-200", num: "text-emerald-600", sub: "text-emerald-500", desc: "Good chance"  },
                { label: "LIKELY", count: likely, bg: "bg-sky-50",     border: "border-sky-200",     num: "text-sky-600",     sub: "text-sky-500",     desc: "Keep backup" },
                { label: "TOUGH",  count: tough,  bg: "bg-rose-50",    border: "border-rose-200",    num: "text-rose-600",    sub: "text-rose-500",    desc: "Very risky"  },
              ].map(s => (
                <div key={s.label} className={`${s.bg} ${s.border} border rounded-2xl p-3 text-center`}>
                  <p className={`text-2xl font-black ${s.num}`}>{s.count}</p>
                  <p className={`text-[11px] font-black ${s.sub} tracking-wide`}>{s.label}</p>
                  <p className={`text-[10px] ${s.sub} opacity-70 mt-0.5 hidden sm:block`}>{s.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Year switcher — only visible after results, with plain explanation */}
          {Object.keys(allYearData).length > 0 && results.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-gray-500 font-semibold">Cutoffs from:</span>
              {[2025, 2024, 2023].map(yr => (
                <button
                  key={yr}
                  onClick={() => switchYear(yr)}
                  className="text-xs px-3 py-1 rounded-lg border font-bold transition-all cursor-pointer"
                  style={selectedYear === yr
                    ? { backgroundColor: colors.primary, color: "#fff", borderColor: "transparent" }
                    : { backgroundColor: "#f9fafb", color: "#6b7280", borderColor: "#e5e7eb" }}
                >
                  {yr}{yr === 2025 ? " (latest)" : ""}
                </button>
              ))}
              <span className="text-[10px] text-gray-400">← tap to compare how cutoffs changed year by year</span>
            </div>
          )}

          {/* College list */}
          {results.length > 0 ? (
            <div className="space-y-2 max-h-150 overflow-y-auto pr-0.5">
              {results.map(c => {
                const safety = classify(c.cutoff, numVal, isRank);
                return (
                  <div
                    key={c.name}
                    className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border transition-all hover:shadow-md ${tierBg(c.tier)}`}
                  >
                    {/* Left: name + details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <TierBadge tier={c.tier} />
                        <SafetyBadge label={safety} />
                        <p className="text-sm font-bold text-gray-800">{c.name}</p>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        📍 {c.state}{c.city ? `, ${c.city}` : ""}
                        {c.fees  && <span className="ml-2 font-semibold text-gray-500">· ₹ {c.fees}</span>}
                        {c.seats && <span className="ml-1 text-gray-400">· {c.seats} seats</span>}
                      </p>
                    </div>

                    {/* Right: cutoff in plain language */}
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-gray-400 leading-tight">
                        {isRank
                          ? "Last seat given at rank"
                          : "Minimum percentile needed"}
                      </p>
                      <p className="text-xl font-black tabular-nums mt-0.5" style={{ color: colors.primary }}>
                        {isRank ? c.cutoff.toLocaleString() : Number(c.cutoff)?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* No results — plain English explanation */
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6 text-center">
              <div className="text-4xl mb-3">😕</div>
              <p className="text-sm font-bold text-orange-800 mb-2">
                No colleges found for your {isRank ? "rank" : "percentile"} of <span style={{ color: colors.primary }}>{value}</span>
              </p>
              <p className="text-xs text-orange-700 leading-relaxed mb-4 max-w-sm mx-auto">
                {isRank
                  ? `In ${selectedYear}, the last seat at every college in our list was given to a rank better than ${Number(value).toLocaleString()}. This means students with a lower rank number got those seats.`
                  : `In ${selectedYear}, every college required a percentile higher than ${value}. You need a better score to qualify for the colleges in our list.`}
              </p>
              {/* Suggest other categories */}
              <p className="text-xs text-orange-600 font-semibold mb-2">
                Are you eligible under a reserved category? Cutoffs are usually lower:
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {(["General", "OBC", "SC", "ST", "EWS"] as Category[])
                  .filter(c => c !== cat)
                  .map(c => (
                    <button
                      key={c}
                      onClick={() => { setCat(c); setResults(null); }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold cursor-pointer transition-colors"
                    >
                      Try {c}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Short, plain disclaimer */}
          {results.length > 0 && (
            <p className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 leading-relaxed">
              📋 Cutoffs shown are from <strong>{selectedYear}</strong> actual admissions. Cutoffs change every year — treat this as a guide, not a guarantee. Always apply to a mix of Safe, Likely, and Tough colleges.
            </p>
          )}
        </div>
      )}
    </div>
  );
}