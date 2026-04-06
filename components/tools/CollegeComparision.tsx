/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useMemo } from "react";
import {
  mcaToolsService,
  type ExamMeta,
  type AnalyserCollege,
  type Category,
  type CutoffMap,
} from "@/services/mca-tools.service";
import { TierBadge } from "./tools-util";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CollegeOption {
  name: string;
  city: string | null;
  state: string;
  tier: string;
  fees: string | null;
  seats: number | null;
  cutoffs: CutoffMap;
  avg_lpa?: number | null;
  highest_lpa?: number | null;
  placement_perc?: number | null;
  top_companies?: string | null;
  admission_process?: string | null;
  naac_grade?: string | null;
  college_type?: string | null;
  duration_years?: number | null;
  syllabus_overview?: string | null;
}

type CompareResult = "win" | "lose" | "tie";

// ─── Constants ────────────────────────────────────────────────────────────────

const COMPARE_YEARS: number[] = [2025];
const CATEGORIES: Category[]  = ["General", "OBC", "SC", "ST", "EWS"];
const EXAM_KEY                 = "mah" as const;
const IS_RANK                  = false; // MAH is percentile-based

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseFees(fees: string | null): number | null {
  if (!fees) return null;
  const n = parseFloat(fees.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? null : n;
}

function fmtFees(fees: string | null): string {
  if (!fees) return "—";
  const n = parseFees(fees);
  if (!n) return fees;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

function cmp(
  aVal: number | null | undefined,
  bVal: number | null | undefined,
  lowerBetter = false
): [CompareResult, CompareResult] {
  if (aVal == null || bVal == null || aVal === bVal) return ["tie", "tie"];
  const aWins = lowerBetter ? aVal < bVal : aVal > bVal;
  return aWins ? ["win", "lose"] : ["lose", "win"];
}

function diff(a: number | null | undefined, b: number | null | undefined): number | null {
  if (a == null || b == null) return null;
  return Math.abs(a - b);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ResultDot({ result }: { result: CompareResult }) {
  if (result === "win")
    return <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1.5 shrink-0" />;
  if (result === "lose")
    return <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 ml-1.5 shrink-0" />;
  return null;
}

function WinTag({ text }: { text: string }) {
  return (
    <span className="block text-[10px] font-semibold text-emerald-600 mt-0.5 leading-tight">
      {text}
    </span>
  );
}

function LoseTag({ text }: { text: string }) {
  return (
    <span className="block text-[10px] text-rose-400 mt-0.5 leading-tight">
      {text}
    </span>
  );
}

function SectionHead({ label }: { label: string }) {
  return (
    <div className="grid grid-cols-[160px_1fr_1fr] bg-cyan-900 border-b border-gray-100">
      <div className="col-span-3 px-4 py-2 text-[10px] font-semibold text-white uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}

interface RowProps {
  label: string;
  aContent: React.ReactNode;
  bContent: React.ReactNode;
  aResult?: CompareResult;
  bResult?: CompareResult;
  aTag?: React.ReactNode;
  bTag?: React.ReactNode;
  noBorder?: boolean;
}

function CompareRow({
  label, aContent, bContent,
  aResult = "tie", bResult = "tie",
  aTag, bTag, noBorder,
}: RowProps) {
  const aClass = aResult === "win" ? "bg-emerald-50/60" : aResult === "lose" ? "bg-rose-50/40" : "";
  const bClass = bResult === "win" ? "bg-emerald-50/60" : bResult === "lose" ? "bg-rose-50/40" : "";

  return (
    <div className={`grid grid-cols-[160px_1fr_1fr] ${noBorder ? "" : "border-b border-gray-200"}`}>
      <div className="px-4 py-3 text-[12px] text-cyan-900 flex items-center pt-3 border-r border-gray-200 ">
        {label}
      </div>
      <div className={`px-4 py-3 text-[13px] text-gray-800 border-r border-gray-100 ${aClass}`}>
        <div className="flex items-start gap-1">
          <div className="flex-1 min-w-0">{aContent}</div>
          <ResultDot result={aResult} />
        </div>
        {aTag}
      </div>
      <div className={`px-4 py-3 text-[13px] text-gray-800 ${bClass}`}>
        <div className="flex items-start gap-1">
          <div className="flex-1 min-w-0">{bContent}</div>
          <ResultDot result={bResult} />
        </div>
        {bTag}
      </div>
    </div>
  );
}

function NaacBadge({ grade }: { grade: string | null | undefined }) {
  if (!grade) return <span className="text-gray-400">—</span>;
  const colors: Record<string, string> = {
    "A++": "bg-purple-100 text-purple-700",
    "A+":  "bg-indigo-100 text-indigo-700",
    "A":   "bg-blue-100 text-blue-700",
    "B++": "bg-cyan-100 text-cyan-700",
    "B+":  "bg-teal-100 text-teal-700",
    "B":   "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${colors[grade] ?? "bg-gray-100 text-gray-600"}`}>
      NAAC {grade}
    </span>
  );
}

function TypeBadge({ type }: { type: string | null | undefined }) {
  if (!type) return <span className="text-gray-400">—</span>;
  const isGovt = type.toLowerCase().includes("gov");
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isGovt ? "bg-emerald-100 text-emerald-700" : "bg-pink-100 text-pink-700"}`}>
      {type}
    </span>
  );
}

// ─── Tradeoff engine ──────────────────────────────────────────────────────────

interface Tradeoff {
  color: "green" | "amber" | "blue" | "rose";
  html: string;
}

function buildTradeoffs(
  ca: CollegeOption,
  cb: CollegeOption,
  selectedYear: number,
  selectedCat: Category
): Tradeoff[] {
  const items: Tradeoff[] = [];

  const aFees = parseFees(ca.fees);
  const bFees = parseFees(cb.fees);
  if (aFees && bFees && Math.abs(aFees - bFees) > 20000) {
    const cheaper  = aFees < bFees ? ca : cb;
    const feeDiff  = Math.abs(aFees - bFees);
    const avgLpa   = ca.avg_lpa ?? cb.avg_lpa ?? 8;
    const months   = Math.round((feeDiff / (avgLpa * 100000)) * 12);
    items.push({
      color: "green",
      html : `<strong>${cheaper.name}</strong> is ₹${(feeDiff / 1000).toFixed(0)}K cheaper in total fees — roughly <strong>${months} months</strong> of average salary you don't need to recover.`,
    });
  }

  if (ca.avg_lpa != null && cb.avg_lpa != null) {
    const d = Math.abs(ca.avg_lpa - cb.avg_lpa);
    if (d >= 0.5) {
      const winner = ca.avg_lpa > cb.avg_lpa ? ca : cb;
      items.push({
        color: "blue",
        html : `<strong>${winner.name}</strong> has ₹${d.toFixed(1)}L higher avg package — over 5 years that's <strong>₹${(d * 5).toFixed(0)}L+</strong> extra cumulative earnings.`,
      });
    }
  }

  if (ca.college_type && cb.college_type && ca.college_type !== cb.college_type) {
    const govt = ca.college_type?.toLowerCase().includes("gov") ? ca : cb;
    const pvt  = ca.college_type?.toLowerCase().includes("gov") ? cb : ca;
    items.push({
      color: "amber",
      html : `<strong>${govt.name}</strong> is government-funded — lower fees, reservation seats, stronger brand. <strong>${pvt.name}</strong> may offer better facilities or industry connections.`,
    });
  }

  if (ca.city !== cb.city) {
    items.push({
      color: "amber",
      html : `You're comparing <strong>${ca.city ?? ca.state}</strong> vs <strong>${cb.city ?? cb.state}</strong>. Factor in cost of living, proximity to IT hubs, and city preference.`,
    });
  }

  if (ca.placement_perc != null && cb.placement_perc != null) {
    const placDiff = Math.abs(ca.placement_perc - cb.placement_perc);
    if (placDiff >= 5) {
      const winner      = ca.placement_perc > cb.placement_perc ? ca : cb;
      const extraStudents = Math.round((winner.seats ?? 60) * placDiff / 100);
      items.push({
        color: "blue",
        html : `<strong>${winner.name}</strong> places ${placDiff.toFixed(0)}% more students — in a batch of ${winner.seats ?? "~60"}, that's roughly <strong>${extraStudents} more placed</strong> per year.`,
      });
    }
  }

  const aCutoff = (ca.cutoffs?.[selectedCat] as any)?.[selectedYear];
  const bCutoff = (cb.cutoffs?.[selectedCat] as any)?.[selectedYear];
  if (aCutoff != null && bCutoff != null) {
    // MAH is percentile — lower percentile needed = easier entry
    const easier = aCutoff < bCutoff ? ca : cb;
    items.push({
      color: "rose",
      html : `<strong>${easier.name}</strong> requires a lower percentile for ${selectedCat} in ${selectedYear} — entry here is less competitive with the same score.`,
    });
  }

  if (!items.length) {
    items.push({
      color: "amber",
      html : "These colleges are closely matched. Your decision should hinge on location preference, campus culture, and your category-specific cutoff.",
    });
  }

  return items;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CollegeCompareTool() {
  const [allColleges, setAllColleges] = useState<AnalyserCollege[]>([]);
  const [loading, setLoading]         = useState(false);
  const [idxA, setIdxA]               = useState<number | null>(null);
  const [idxB, setIdxB]               = useState<number | null>(null);
  const [selectedCat, setSelectedCat]     = useState<Category>("General");
  const [selectedYear, setSelectedYear]   = useState<number>(2025);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // MAH accent colour
  const PRIMARY = "#2563eb";
  const BORDER  = "#93c5fd";

  // ── Data fetch — always MAH ──────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setIdxA(null);
    setIdxB(null);
    mcaToolsService
      .getCompareColleges(EXAM_KEY)          // ← enriched colleges_mca path
      .then((res) => setAllColleges(res.colleges))
      .catch(() => setAllColleges([]))
      .finally(() => setLoading(false));
  }, []);

  // ── Dropdown options (mutual exclusion) ──────────────────────────────────
  const optionsA = useMemo(
    () => allColleges.map((c, i) => ({ c, i, disabled: i === idxB })),
    [allColleges, idxB]
  );
  const optionsB = useMemo(
    () => allColleges.map((c, i) => ({ c, i, disabled: i === idxA })),
    [allColleges, idxA]
  );

  const ca = idxA !== null ? (allColleges[idxA] as CollegeOption) : null;
  const cb = idxB !== null ? (allColleges[idxB] as CollegeOption) : null;

  const getCutoff = (college: CollegeOption | null) => {
    if (!college) return null;
    const catMap = college.cutoffs?.[selectedCat] as any;
    return catMap?.[selectedYear] ?? null;
  };

  const tradeoffs = useMemo(() => {
    if (!ca || !cb) return [];
    return buildTradeoffs(ca, cb, selectedYear, selectedCat);
  }, [ca, cb, selectedYear, selectedCat]);

  // ── Tradeoff card colours ────────────────────────────────────────────────
  const tradeoffColors = {
    green: "bg-emerald-50 border-emerald-100",
    blue:  "bg-sky-50 border-sky-100",
    amber: "bg-amber-50 border-amber-100",
    rose:  "bg-rose-50 border-rose-100",
  } as const;
  const tradeoffDot = {
    green: "bg-emerald-500",
    blue:  "bg-sky-500",
    amber: "bg-amber-400",
    rose:  "bg-rose-400",
  } as const;
  const tradeoffText = {
    green: "text-emerald-800",
    blue:  "text-sky-800",
    amber: "text-amber-800",
    rose:  "text-rose-800",
  } as const;

  // ── Comparison table ─────────────────────────────────────────────────────
  const renderComparison = () => {
    if (!ca || !cb) return null;

    const aFees = parseFees(ca.fees);
    const bFees = parseFees(cb.fees);
    const [aFC, bFC] = cmp(aFees, bFees, true);
    const feeDiff    = diff(aFees, bFees);

    const [aAC, bAC] = cmp(ca.avg_lpa, cb.avg_lpa);
    const [aHC, bHC] = cmp(ca.highest_lpa, cb.highest_lpa);
    const [aPC, bPC] = cmp(ca.placement_perc, cb.placement_perc);
    const [aTC, bTC] = cmp(ca.seats, cb.seats);

    const aCutoff = getCutoff(ca);
    const bCutoff = getCutoff(cb);
    // MAH: percentile — higher cutoff = harder to enter = "lose" for the student
    const [aCC, bCC] = cmp(aCutoff, bCutoff, true); // lower percentile needed = better

    const avgDiff  = diff(ca.avg_lpa, cb.avg_lpa);
    const placDiff = diff(ca.placement_perc, cb.placement_perc);

    return (
      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
        {/* Sticky column headers */}
        <div className="grid grid-cols-[160px_1fr_1fr] border-b-2 border-gray-200 bg-white sticky top-0 z-10">
          <div className="px-4 py-3 text-[11px] text-gray-400 uppercase tracking-widest font-semibold border-r border-gray-100">
            Parameter
          </div>
          {[ca, cb].map((col, idx) => (
            <div key={idx} className={`px-4 py-3 ${idx === 0 ? "border-r border-gray-100" : ""}`}>
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <TierBadge tier={col.tier} />
                {col.naac_grade && <NaacBadge grade={col.naac_grade} />}
              </div>
              <p className="text-[13px] font-semibold text-gray-800 leading-tight mt-1">{col.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {col.city ? `${col.city}, ` : ""}{col.state}
              </p>
            </div>
          ))}
        </div>

        {/* Institution */}
        <SectionHead label="Institution" />
        <CompareRow
          label="Type"
          aContent={<TypeBadge type={ca.college_type} />}
          bContent={<TypeBadge type={cb.college_type} />}
        />
        <CompareRow
          label="NAAC grade"
          aContent={<NaacBadge grade={ca.naac_grade} />}
          bContent={<NaacBadge grade={cb.naac_grade} />}
        />
        <CompareRow
          label="Admission via"
          aContent={ca.admission_process ?? "—"}
          bContent={cb.admission_process ?? "—"}
        />
        <CompareRow
          label="Duration"
          aContent={ca.duration_years ? `${ca.duration_years} years` : "2 years"}
          bContent={cb.duration_years ? `${cb.duration_years} years` : "2 years"}
        />

        {/* Fees */}
        <SectionHead label="Fees" />
        <CompareRow
          label="Total fees"
          aContent={<strong>{fmtFees(ca.fees)}</strong>}
          bContent={<strong>{fmtFees(cb.fees)}</strong>}
          aResult={aFC}
          bResult={bFC}
          aTag={
            feeDiff != null && aFC === "win" ? <WinTag text={`₹${(feeDiff / 1000).toFixed(0)}K cheaper`} /> :
            feeDiff != null && aFC === "lose" ? <LoseTag text={`₹${(feeDiff / 1000).toFixed(0)}K costlier`} /> : null
          }
          bTag={
            feeDiff != null && bFC === "win" ? <WinTag text={`₹${(feeDiff / 1000).toFixed(0)}K cheaper`} /> :
            feeDiff != null && bFC === "lose" ? <LoseTag text={`₹${(feeDiff / 1000).toFixed(0)}K costlier`} /> : null
          }
        />

        {/* Seats — total only, no category breakdown */}
        <SectionHead label="Seats" />
        <CompareRow
          label="Total seats"
          aContent={ca.seats ?? "—"}
          bContent={cb.seats ?? "—"}
          aResult={aTC}
          bResult={bTC}
        />

        {/* Cutoffs */}
        <SectionHead label={`${selectedYear} cutoff — ${selectedCat}`} />
        <CompareRow
          label="Min. percentile"
          aContent={
            aCutoff != null
              ? <strong>{Number(aCutoff).toFixed(2)}</strong>
              : "—"
          }
          bContent={
            bCutoff != null
              ? <strong>{Number(bCutoff).toFixed(2)}</strong>
              : "—"
          }
          aResult={aCC}
          bResult={bCC}
          aTag={
            aCutoff != null && aCC === "win"  ? <WinTag  text="Lower bar — easier entry" /> :
            aCutoff != null && aCC === "lose" ? <LoseTag text="Higher bar needed"         /> : null
          }
          bTag={
            bCutoff != null && bCC === "win"  ? <WinTag  text="Lower bar — easier entry" /> :
            bCutoff != null && bCC === "lose" ? <LoseTag text="Higher bar needed"         /> : null
          }
        />

        {/* Placements */}
        <SectionHead label="Placements" />
        <CompareRow
          label="Avg package"
          aContent={ca.avg_lpa != null ? <strong>{ca.avg_lpa} LPA</strong> : "—"}
          bContent={cb.avg_lpa != null ? <strong>{cb.avg_lpa} LPA</strong> : "—"}
          aResult={aAC}
          bResult={bAC}
          aTag={
            avgDiff != null && aAC === "win"  ? <WinTag  text={`+${avgDiff.toFixed(1)} LPA higher`} /> :
            avgDiff != null && aAC === "lose" ? <LoseTag text={`${avgDiff.toFixed(1)} LPA lower`}   /> : null
          }
          bTag={
            avgDiff != null && bAC === "win"  ? <WinTag  text={`+${avgDiff.toFixed(1)} LPA higher`} /> :
            avgDiff != null && bAC === "lose" ? <LoseTag text={`${avgDiff.toFixed(1)} LPA lower`}   /> : null
          }
        />
        <CompareRow
          label="Highest package"
          aContent={ca.highest_lpa != null ? `${ca.highest_lpa} LPA` : "—"}
          bContent={cb.highest_lpa != null ? `${cb.highest_lpa} LPA` : "—"}
          aResult={aHC}
          bResult={bHC}
        />
        <CompareRow
          label="Placement %"
          aContent={ca.placement_perc != null ? `${ca.placement_perc}%` : "—"}
          bContent={cb.placement_perc != null ? `${cb.placement_perc}%` : "—"}
          aResult={aPC}
          bResult={bPC}
          aTag={
            placDiff != null && aPC === "win"  ? <WinTag  text={`+${placDiff.toFixed(0)}% better`} /> :
            placDiff != null && aPC === "lose" ? <LoseTag text={`${placDiff.toFixed(0)}% lower`}   /> : null
          }
          bTag={
            placDiff != null && bPC === "win"  ? <WinTag  text={`+${placDiff.toFixed(0)}% better`} /> :
            placDiff != null && bPC === "lose" ? <LoseTag text={`${placDiff.toFixed(0)}% lower`}   /> : null
          }
        />
        {(ca.top_companies || cb.top_companies) && (
          <CompareRow
            label="Top recruiters"
            aContent={<span className="text-[11px] text-gray-500 leading-relaxed">{ca.top_companies ?? "—"}</span>}
            bContent={<span className="text-[11px] text-gray-500 leading-relaxed">{cb.top_companies ?? "—"}</span>}
            noBorder
          />
        )}

        {/* Curriculum */}
        {(ca.syllabus_overview || cb.syllabus_overview) && (
          <>
            <SectionHead label="Curriculum" />
            <CompareRow
              label="Highlights"
              aContent={<span className="text-[11px] text-gray-500 leading-relaxed">{ca.syllabus_overview ?? "—"}</span>}
              bContent={<span className="text-[11px] text-gray-500 leading-relaxed">{cb.syllabus_overview ?? "—"}</span>}
              noBorder
            />
          </>
        )}
      </div>
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Controls row */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Category */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 font-semibold">Category:</span>
          <div className="flex gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className="text-[11px] px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer"
                style={
                  selectedCat === cat
                    ? { backgroundColor: PRIMARY, color: "#fff", borderColor: "transparent" }
                    : { backgroundColor: "#f9fafb", color: "#6b7280", borderColor: "#e5e7eb" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Year */}
     
      </div>

      {/* College selectors */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "College A", options: optionsA, value: idxA, onChange: setIdxA },
          { label: "College B", options: optionsB, value: idxB, onChange: setIdxB },
        ].map(({ label, options, value, onChange }) => (
          <div
            key={label}
            className="rounded-2xl border-2 bg-white p-3 amber"
            style={{ borderColor: BORDER }}
          >
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">
              {label}
            </p>
            <select
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value === "" ? null : parseInt(e.target.value))}
              disabled={loading}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-800 outline-none cursor-pointer focus:border-gray-400 disabled:opacity-40"
            >
              <option value="">— select a college —</option>
              {options.map(({ c, i, disabled }) => (
                <option key={i} value={i} disabled={disabled}>
                  {c.name} — {c.city ?? c.state}
                </option>
              ))}
            </select>
            {value !== null && allColleges[value] && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <TierBadge tier={allColleges[value].tier} />
                <span className="text-[11px] text-gray-500">
                  {allColleges[value].city ?? allColleges[value].state}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <svg className="animate-spin h-5 w-5 text-gray-400 mx-auto" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
          </svg>
          <p className="text-xs text-gray-400 mt-2">Loading colleges…</p>
        </div>
      )}

      {/* Placeholder */}
      {!loading && (idxA === null || idxB === null) && (
        <div className="rounded-2xl border border-dashed border-gray-200 py-10 text-center">
          <p className="text-sm text-gray-400">
            {idxA === null && idxB === null
              ? "Select two colleges above to compare them side by side"
              : "Now pick a second college to start the comparison"}
          </p>
        </div>
      )}

      {/* Comparison table + tradeoffs */}
      {!loading && idxA !== null && idxB !== null && (
        <div className="space-y-4">
          <div className="max-h-[600px] overflow-y-auto rounded-2xl shadow-sm">
            {renderComparison()}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 px-1">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Legend:</span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Better
            </span>
            <span className="flex items-center gap-1 text-[11px] text-rose-400">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" /> Lower
            </span>
            <span className="text-[10px] text-gray-300">|</span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
              <span className="w-4 h-3 rounded-sm bg-emerald-50 border border-emerald-200 inline-block" /> Advantage
            </span>
            <span className="flex items-center gap-1 text-[11px] text-rose-500">
              <span className="w-4 h-3 rounded-sm bg-rose-50 border border-rose-100 inline-block" /> Disadvantage
            </span>
          </div>

          {/* Tradeoff cards */}
          {tradeoffs.length > 0 && (
            <div className="rounded-2xl border border-gray-100 shadow bg-white p-4">
              <p className="text-[11px] font-semibold text-cyan-900 uppercase tracking-widest mb-3">
                Key tradeoffs
              </p>
              <div className="space-y-2.5">
                {tradeoffs.map((t, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 items-start rounded-xl border px-3.5 py-2.5 ${tradeoffColors[t.color]}`}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${tradeoffDot[t.color]}`} />
                    <p
                      className={`text-[12px] leading-relaxed ${tradeoffText[t.color]}`}
                      dangerouslySetInnerHTML={{ __html: t.html }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 leading-relaxed">
            📋 Cutoffs shown are from MAH MCA CET {selectedYear} actual admissions data. Placement figures are indicative and may vary by batch year. Always verify directly with the college before making a decision.
          </p>
        </div>
      )}
    </div>
  );
}