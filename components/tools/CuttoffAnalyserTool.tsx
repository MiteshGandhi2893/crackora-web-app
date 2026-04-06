/* eslint-disable react-hooks/set-state-in-effect */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import {
  mcaToolsService,
  type ExamKey,
  type ExamMeta,
  type Category,
  type AnalyserCollege,
  type CollegeTier,
} from "@/services/mca-tools.service";
import { TierBadge } from "./tools-util";

// ─── Colours ──────────────────────────────────────────────────────────────────

const EXAM_COLORS: Record<string, { primary: string; light: string; border: string }> = {
  nimcet: { primary: "#f59e0b", light: "#fffbeb", border: "#fde68a" },
  mah:    { primary: "#8b5cf6", light: "#f5f3ff", border: "#ddd6fe" },
};

const YEARS = [2025, 2024, 2023] as const;

// ─── Inline bar chart for a single college across 3 years ────────────────────
// Shows 2023 / 2024 / 2025 as horizontal bars relative to the max value.

function CutoffBar({
  values,       // { 2023: x, 2024: x, 2025: x }
  isRank,       // rank: lower = better (so shorter bar = more competitive)
  color,
}: {
  values: Partial<Record<number, number>>;
  isRank: boolean;
  color: string;
}) {
  const entries = YEARS.map(y => ({ year: y, val: values[y] ?? null })).filter(e => e.val !== null) as { year: number; val: number }[];
  if (entries.length === 0) return <span className="text-gray-300 text-xs">—</span>;

  const max = Math.max(...entries.map(e => e.val));
  const min = Math.min(...entries.map(e => e.val));

  // For rank: bar width = val/max (lower rank = shorter bar = harder)
  // For percentile: bar width = val/max (higher pct = longer bar)
  const barWidth = (val: number) => {
    if (max === min) return 60;
    return isRank
      ? Math.max(15, Math.round((val / max) * 100))
      : Math.max(15, Math.round((val / max) * 100));
  };

  const yearColors: Record<number, string> = {
    2025: color,
    2024: color + "99",  // 60% opacity
    2023: color + "55",  // 33% opacity
  };

  return (
    <div className="space-y-1 min-w-30">
      {entries.map(({ year, val }) => (
        <div key={year} className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400 w-8 shrink-0">{year}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${barWidth(val)}%`, backgroundColor: yearColors[year] }}
            />
          </div>
          <span className="text-[10px] font-bold tabular-nums w-14 text-right shrink-0" style={{ color: year === 2025 ? color : "#9ca3af" }}>
            {isRank ? val.toLocaleString() : val.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Trend badge ──────────────────────────────────────────────────────────────
// Compares 2023 → 2025. Harder/Easier/Stable from a student's perspective.

function TrendBadge({ v25, v23, isRank }: { v25: number | null; v23: number | null; isRank: boolean }) {
  if (!v25 || !v23) return <span className="text-gray-300 text-xs">—</span>;

  // Rank: lower number in 2025 means harder to get in (fewer people qualify)
  // Percentile: higher number in 2025 means harder to get in
  const harder = isRank ? v25 < v23 : v25 > v23;
  const easier = isRank ? v25 > v23 : v25 < v23;

  if (harder) return (
    <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full whitespace-nowrap">
      ↑ Harder
    </span>
  );
  if (easier) return (
    <span className="text-[11px] font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full whitespace-nowrap">
      ↓ Easier
    </span>
  );
  return (
    <span className="text-[11px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
      → Stable
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CutoffAnalyserTool() {
  const [examMetaList, setExamMetaList] = useState<ExamMeta[]>([]);
  const [exam,         setExam]         = useState<ExamKey>("nimcet");
  const [colleges,     setColleges]     = useState<AnalyserCollege[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  // Filters
  const [cat,    setCat]    = useState<Category>("General");
  const [search, setSearch] = useState("");
  const [tier,   setTier]   = useState<"All" | CollegeTier>("All");

  // View mode
  const [view, setView] = useState<"table" | "chart">("table");

  useEffect(() => {
    mcaToolsService.getExamMeta().then(setExamMetaList).catch(() => {});
  }, []);

  // Fetch colleges whenever exam changes
  useEffect(() => {
    setColleges([]);
    setLoading(true);
    setError(null);
    mcaToolsService.getCollegesByExam(exam)
      .then(res => setColleges(res.colleges))
      .catch(() => setError("Failed to load college data. Please try again."))
      .finally(() => setLoading(false));
  }, [exam]);

  const meta   = examMetaList.find(m => m.key === exam);
  const isRank = exam === "nimcet";
  const colors = EXAM_COLORS[exam] ?? EXAM_COLORS.nimcet;

  const cats: Category[] = ["General", "OBC", "SC", "ST", "EWS"];

  // Filtered + sorted list
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return colleges.filter(c =>
      (tier === "All" || c.tier === tier) &&
      (c.name.toLowerCase().includes(q) ||
       c.state.toLowerCase().includes(q) ||
       (c.city ?? "").toLowerCase().includes(q))
    );
  }, [colleges, tier, search]);

  const resetExam = (key: ExamKey) => {
    setExam(key);
    setCat("General");
    setSearch("");
    setTier("All");
  };

  const tierBg = (t: string) =>
    t === "S" ? "bg-amber-50"
    : t === "A" ? "bg-sky-50"
    : "bg-white";

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

      {/* ── What the data means ───────────────────────────────── */}
      <div
        className="rounded-xl px-4 py-2.5 text-xs font-medium"
        style={{ backgroundColor: colors.light, border: `1px solid ${colors.border}`, color: colors.primary }}
      >
        {isRank
          ? "📊 Rank-based — a lower cutoff rank means fewer students qualify → more competitive. Trend ↑ Harder means the cutoff rank dropped since 2023."
          : "📊 Percentile-based — a higher cutoff percentile means you need a better score → more competitive. Trend ↑ Harder means the required percentile went up since 2023."}
      </div>

      {/* ── Filters ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search college, city or state…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-amber-400 bg-white"
        />
        <select
          value={cat}
          onChange={e => setCat(e.target.value as Category)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none bg-white font-semibold"
        >
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {/* Tier filter */}
        <div className="flex gap-1.5">
          {(["All", "S", "A", "B"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className="px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer"
              style={tier === t
                ? { backgroundColor: colors.primary, color: "#fff", borderColor: "transparent" }
                : { backgroundColor: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }}
            >
              {t === "All" ? "All" : `Tier ${t}`}
            </button>
          ))}
        </div>
        {/* View toggle */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {(["table", "chart"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                view === v ? "bg-white shadow-sm text-gray-800" : "text-gray-500"
              }`}
            >
              {v === "table" ? "📋 Table" : "📊 Chart"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading / error ───────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-12 gap-3 text-sm text-gray-400">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10"/>
          </svg>
          Loading cutoff data…
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {/* ── TABLE VIEW ────────────────────────────────────────── */}
      {!loading && !error && view === "table" && colleges.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <div className="max-h-[520px] overflow-y-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                    College
                  </th>
                  <th className="text-center px-2 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wide w-12">
                    Tier
                  </th>
                  <th className="text-center px-3 py-3 text-[11px] font-bold uppercase tracking-wide" style={{ color: colors.primary }}>
                    2025 ★
                  </th>
                  <th className="text-center px-3 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                    2024
                  </th>
                  <th className="text-center px-3 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                    2023
                  </th>
                  <th className="text-center px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                    2-Year Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => {
                  const v25 = row.cutoffs[cat]?.[2025] ?? null;
                  const v24 = row.cutoffs[cat]?.[2024] ?? null;
                  const v23 = row.cutoffs[cat]?.[2023] ?? null;
                  return (
                    <tr
                      key={row.name}
                      className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-gray-800">{row.name}</p>
                        <p className="text-[11px] text-gray-400">
                          📍 {row.state}{row.city ? `, ${row.city}` : ""}
                          {row.fees && <span className="ml-2">· ₹ {row.fees}</span>}
                        </p>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <TierBadge tier={row.tier} />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm font-black tabular-nums" style={{ color: colors.primary }}>
                          {v25 !== null ? (isRank ? v25.toLocaleString() : v25.toFixed(2)) : "—"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm font-semibold tabular-nums text-gray-400">
                          {v24 !== null ? (isRank ? v24.toLocaleString() : v24.toFixed(2)) : "—"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm font-semibold tabular-nums text-gray-400">
                          {v23 !== null ? (isRank ? v23.toLocaleString() : v23.toFixed(2)) : "—"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <TrendBadge v25={v25} v23={v23} isRank={isRank} />
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-sm text-gray-400">
                      No colleges match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CHART VIEW ────────────────────────────────────────── */}
      {!loading && !error && view === "chart" && colleges.length > 0 && (
        <div className="space-y-2 max-h-[560px] overflow-y-auto pr-0.5">
          {filtered.length === 0 ? (
            <p className="text-center py-10 text-sm text-gray-400">No colleges match your search.</p>
          ) : (
            filtered.map(row => {
              const v25 = row.cutoffs[cat]?.[2025] ?? null;
              const v23 = row.cutoffs[cat]?.[2023] ?? null;
              return (
                <div
                  key={row.name}
                  className={`rounded-2xl border border-gray-100 px-4 py-3 ${tierBg(row.tier)}`}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <TierBadge tier={row.tier} />
                        <p className="text-sm font-bold text-gray-800">{row.name}</p>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        📍 {row.state}{row.city ? `, ${row.city}` : ""}
                        {row.fees && <span className="ml-2 font-semibold text-gray-500">· ₹ {row.fees}</span>}
                        {row.seats && <span className="ml-1">· {row.seats} seats</span>}
                      </p>
                    </div>
                    <TrendBadge v25={v25} v23={v23} isRank={isRank} />
                  </div>

                  {/* Bar chart — 3 years side by side */}
                  <CutoffBar
                    values={row.cutoffs[cat] ?? {}}
                    isRank={isRank}
                    color={colors.primary}
                  />

                  {/* What to read from these bars */}
                  {v25 !== null && (
                    <p className="text-[10px] text-gray-400 mt-2">
                      {isRank
                        ? `In 2025 the last seat went to rank ${v25.toLocaleString()}. ${v23 !== null ? `In 2023 it was rank ${v23.toLocaleString()}.` : ""}`
                        : `In 2025 you needed ${v25.toFixed(2)} percentile. ${v23 !== null ? `In 2023 it was ${v23.toFixed(2)}.` : ""}`
                      }
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Footer count ──────────────────────────────────────── */}
      {!loading && colleges.length > 0 && (
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span>
            Showing <strong className="text-gray-600">{filtered.length}</strong> of{" "}
            <strong className="text-gray-600">{colleges.length}</strong> colleges
            · {cat} category · {meta?.shortName} official data
          </span>
          <span>2023–2025 actual counselling</span>
        </div>
      )}
    </div>
  );
}