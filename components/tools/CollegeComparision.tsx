/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  mcaToolsService,
  type AnalyserCollege,
  type Category,
} from "@/services/mca-tools.service";
import { TierBadge } from "./tools-util";
import { useAuth } from "@/providers/AuthProvider";

// ─── Constants ─────────────────────────────────────────────────────────────────

const FREE_LIMIT = 10;
const CATEGORIES: Category[] = ["General", "OBC", "SC", "ST"];
const EXAM_KEY = "mah" as const;

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "fees_asc", label: "Fees Low - High" },
  { value: "fees_desc", label: "Fees High - Low" },
  { value: "avg_desc", label: "Avg pkg High - Low" },
  { value: "cutoff_asc", label: "Cutoff Low - High" },
  { value: "seats_desc", label: "Seats High - Low" },
] as const;
type SortKey = (typeof SORT_OPTIONS)[number]["value"];

// ─── Types ──────────────────────────────────────────────────────────────────────

interface CollegeRow extends AnalyserCollege {
  avg_lpa?: number | null;
  highest_lpa?: number | null;
  placement_perc?: number | null;
  top_companies?: string | null;
  naac_grade?: string | null;
  college_type?: string | null;
  admission_process?: string | null;
  duration_years?: number | null;
}

type CompareResult = "win" | "lose" | "tie";
type FilterKey = "all" | "govt" | "private" | "tier_a" | "tier_b" | "naac_a";

// ─── Helpers ────────────────────────────────────────────────────────────────────

function parseFees(fees: string | null): number | null {
  if (!fees) return null;
  const n = parseFloat(fees.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? null : n;
}

function fmtFees(fees: string | null): string {
  if (!fees) return "—";
  const n = parseFees(fees);
  if (!n) return fees;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

function cmp(
  a: number | null | undefined,
  b: number | null | undefined,
  lowerBetter = false,
): [CompareResult, CompareResult] {
  if (a == null || b == null || a === b) return ["tie", "tie"];
  const aWins = lowerBetter ? a < b : a > b;
  return aWins ? ["win", "lose"] : ["lose", "win"];
}

function diff(
  a: number | null | undefined,
  b: number | null | undefined,
): number | null {
  if (a == null || b == null) return null;
  return Math.abs(a - b);
}

function matchesFilter(c: CollegeRow, filter: FilterKey): boolean {
  if (filter === "all") return true;
  if (filter === "govt")
    return c.college_type?.toLowerCase().includes("gov") ?? false;
  if (filter === "private")
    return !(c.college_type?.toLowerCase().includes("gov") ?? false);
  if (filter === "tier_a") return c.tier?.toUpperCase() === "A";
  if (filter === "tier_b") return c.tier?.toUpperCase() === "B";
  if (filter === "naac_a") return ["A+", "A++"].includes(c.naac_grade ?? "");
  return true;
}

function applySorting(
  list: CollegeRow[],
  sort: SortKey,
  cat: Category,
  year: number,
): CollegeRow[] {
  const arr = [...list];
  if (sort === "fees_asc")
    arr.sort(
      (a, b) =>
        (parseFees(a.fees) ?? Infinity) - (parseFees(b.fees) ?? Infinity),
    );
  else if (sort === "fees_desc")
    arr.sort((a, b) => (parseFees(b.fees) ?? 0) - (parseFees(a.fees) ?? 0));
  else if (sort === "avg_desc")
    arr.sort((a, b) => (b.avg_lpa ?? 0) - (a.avg_lpa ?? 0));
  else if (sort === "cutoff_asc")
    arr.sort((a, b) => {
      const ac = (a.cutoffs?.[cat] as any)?.[year] ?? Infinity;
      const bc = (b.cutoffs?.[cat] as any)?.[year] ?? Infinity;
      return ac - bc;
    });
  else if (sort === "seats_desc")
    arr.sort((a, b) => (b.seats ?? 0) - (a.seats ?? 0));
  return arr;
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function NaacBadge({ grade }: { grade: string | null | undefined }) {
  if (!grade) return null;
  const map: Record<string, string> = {
    "A++": "bg-purple-100 text-purple-700",
    "A+": "bg-indigo-100 text-indigo-700",
    A: "bg-blue-100 text-blue-700",
    "B++": "bg-cyan-100 text-cyan-700",
    "B+": "bg-teal-100 text-teal-700",
    B: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${map[grade] ?? "bg-gray-100 text-gray-500"}`}
    >
      NAAC {grade}
    </span>
  );
}

function TypeBadge({ type }: { type: string | null | undefined }) {
  if (!type) return null;
  const isGovt = type.toLowerCase().includes("gov");
  return (
    <span
      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
        isGovt ? "bg-emerald-100 text-emerald-700" : "bg-pink-100 text-pink-700"
      }`}
    >
      {isGovt ? "Govt" : "Private"}
    </span>
  );
}

function ResultDot({ result }: { result: CompareResult }) {
  if (result === "win")
    return (
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1" />
    );
  if (result === "lose")
    return (
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 ml-1" />
    );
  return null;
}

interface CompareRowProps {
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
  label,
  aContent,
  bContent,
  aResult = "tie",
  bResult = "tie",
  aTag,
  bTag,
  noBorder,
}: CompareRowProps) {
  const aClass =
    aResult === "win"
      ? "bg-emerald-50/60"
      : aResult === "lose"
        ? "bg-rose-50/40"
        : "";
  const bClass =
    bResult === "win"
      ? "bg-emerald-50/60"
      : bResult === "lose"
        ? "bg-rose-50/40"
        : "";
  return (
    <div
      className={`grid grid-cols-[130px_1fr_1fr] ${noBorder ? "" : "border-b border-gray-100"}`}
    >
      <div className="px-3 py-2.5 text-[11px] text-cyan-900 flex items-center border-r border-gray-100">
        {label}
      </div>
      <div
        className={`px-3 py-2.5 text-[12px] text-gray-800 border-r border-gray-100 ${aClass}`}
      >
        <div className="flex items-start gap-1">
          <div className="flex-1 min-w-0">{aContent}</div>
          <ResultDot result={aResult} />
        </div>
        {aTag}
      </div>
      <div className={`px-3 py-2.5 text-[12px] text-gray-800 ${bClass}`}>
        <div className="flex items-start gap-1">
          <div className="flex-1 min-w-0">{bContent}</div>
          <ResultDot result={bResult} />
        </div>
        {bTag}
      </div>
    </div>
  );
}

function SectionHead({ label }: { label: string }) {
  return (
    <div className="px-3 py-1.5 text-[9px] font-semibold text-white uppercase tracking-widest bg-cyan-900">
      {label}
    </div>
  );
}

// ─── College Card ────────────────────────────────────────────────────────────────

interface CollegeCardProps {
  college: CollegeRow;
  globalIndex: number;
  isSelected: boolean;
  canSelect: boolean;
  cat: Category;
  year: number;
  onToggleCompare: (idx: number) => void;
}

function CollegeCard({
  college: c,
  globalIndex,
  isSelected,
  canSelect,
  cat,
  year,
  onToggleCompare,
}: CollegeCardProps) {
  const cutoff = (c.cutoffs?.[cat] as any)?.[year] ?? null;

  return (
    <div
      onClick={() => onToggleCompare(globalIndex)}
      className={`group relative rounded-2xl border p-4 transition-all duration-200 cursor-pointer
      ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500/30 bg-white shadow-md"
          : "border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg hover:-translate-y-0.5"
      }`}
    >
      {/* ───────── HEADER ───────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* badges */}
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <TierBadge tier={c.tier} />
            <TypeBadge type={c.college_type} />
            {c.naac_grade && <NaacBadge grade={c.naac_grade} />}
          </div>

          {/* name */}
          <h3 className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2">
            {c.name}
          </h3>

          {/* location */}
          <p className="text-[11px] text-gray-500 mt-0.5">
            {c.city ? `${c.city}, ` : ""}
            {c.state}
          </p>
        </div>

        {/* compare checkbox */}
        {canSelect ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(globalIndex);
            }}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
            ${
              isSelected
                ? "bg-blue-600 border-blue-600"
                : "border-gray-300 group-hover:border-blue-400"
            }`}
          >
            {isSelected && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1 4l3 3 5-6"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        ) : (
          <div className="w-5 h-5 rounded-md border-2 border-gray-200 opacity-30" />
        )}
      </div>

      {/* ───────── STATS STRIP ───────── */}
      <div className="grid grid-cols-4 mt-4 rounded-xl overflow-hidden border border-gray-100">
        {[
          { label: "Fees", value: fmtFees(c.fees) },
          { label: "Avg", value: c.avg_lpa ? `${c.avg_lpa}L` : "—" },
          {
            label: "Placed",
            value: c.placement_perc ? `${c.placement_perc}%` : "—",
          },
          {
            label: "Cutoff",
            value: cutoff != null ? Number(cutoff).toFixed(1) : "—",
          },
        ].map(({ label, value }, i) => (
          <div
            key={label}
            className={`flex flex-col items-center py-2.5 text-center
            ${i !== 3 ? "border-r border-gray-100" : ""} bg-white`}
          >
            <span className="text-[13px] font-semibold text-gray-900">
              {value}
            </span>
            <span className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ───────── FOOTER ───────── */}
      <div className="flex items-center justify-between mt-3.5 flex-wrap gap-2">
        {/* left tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {c.admission_process && (
            <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
              via {c.admission_process}
            </span>
          )}
          {c.seats && (
            <span className="text-[10px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              {c.seats} seats
            </span>
          )}
        </div>

        {/* right subtle CTA */}
        <span className="text-[10px] text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition">
          Compare →
        </span>
      </div>
    </div>
  );
}

// ─── Gate Overlay ────────────────────────────────────────────────────────────────
// Sits after the FREE_LIMIT cards with a gradient fade + unlock card.
// No per-card blurring.

interface GateOverlayProps {
  lockedCount: number;
  totalCount: number;
  onUnlock: () => void;
  justUnlocked: boolean;
}

function GateOverlay({
  lockedCount,
  totalCount,
  onUnlock,
  justUnlocked,
}: GateOverlayProps) {
  if (justUnlocked) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 mt-2">
        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <p className="text-[12px] text-emerald-700 font-medium">
          All <strong>{totalCount} colleges</strong> unlocked — scroll down to
          explore them all.
        </p>
      </div>
    );
  }

  return (
    <div className="relative mt-2">
      {/* Gradient fade that bleeds up over the last visible cards */}
      <div
        className="absolute -top-28 left-0 right-0 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(248,247,244,0.92) 70%, #f8f7f4)",
        }}
      />

      {/* Gate card */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 py-6 rounded-2xl border border-gray-100 bg-white/95 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0e7490"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <p className="text-[14px] font-semibold text-gray-800 mb-1">
          Unlock {lockedCount} more colleges
        </p>
        <p className="text-[12px] text-gray-400 leading-relaxed mb-4 max-w-xs">
          Free account — full cutoffs, placements & comparisons for all{" "}
          <strong className="text-gray-600">{totalCount} MCA colleges</strong>{" "}
          in Maharashtra.
        </p>
        <button
          onClick={onUnlock}
          className="text-[13px] font-semibold text-white bg-cyan-900 hover:bg-cyan-800 transition-colors px-6 py-2 rounded-xl"
        >
          Sign in free — unlock all →
        </button>
        <p className="text-[10px] text-gray-400 mt-2">
          No credit card. Takes 30 seconds.
        </p>
      </div>
    </div>
  );
}

// ─── Compare Panel ───────────────────────────────────────────────────────────────

interface ComparePanelProps {
  ca: CollegeRow;
  cb: CollegeRow;
  cat: Category;
  year: number;
  onClose: () => void;
}

function ComparePanel({ ca, cb, cat, year, onClose }: ComparePanelProps) {
  const aFees = parseFees(ca.fees);
  const bFees = parseFees(cb.fees);
  const [aFC, bFC] = cmp(aFees, bFees, true);
  const feeDiff = diff(aFees, bFees);
  const [aAC, bAC] = cmp(ca.avg_lpa, cb.avg_lpa);
  const [aHC, bHC] = cmp(ca.highest_lpa, cb.highest_lpa);
  const [aPC, bPC] = cmp(ca.placement_perc, cb.placement_perc);
  const [aTC, bTC] = cmp(ca.seats, cb.seats);
  const aCutoff = (ca.cutoffs?.[cat] as any)?.[year] ?? null;
  const bCutoff = (cb.cutoffs?.[cat] as any)?.[year] ?? null;
  const [aCC, bCC] = cmp(aCutoff, bCutoff, true);
  const avgDiff = diff(ca.avg_lpa, cb.avg_lpa);
  const placDiff = diff(ca.placement_perc, cb.placement_perc);

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      {/* Sticky header */}
      <div className="grid grid-cols-[130px_1fr_1fr] border-b-2 border-gray-100 bg-gray-50 sticky top-0 z-10">
        <div className={`px-3 py-3 text-xs flex items-center justify-center  border-r border-gray-300 text-cyan-900/70`}> Comparision Parameters</div>
        {[ca, cb].map((col, idx) => (
          <div
            key={idx}
            className={`px-3 py-3 ${idx === 0 ? "border-r border-gray-100" : ""}`}
          >
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <NaacBadge grade={col.naac_grade} />
            </div>
            <p className="text-[13px] font-semibold text-gray-800 leading-tight mt-0.5">
              {col.name}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {col.city ? `${col.city} ` : ""}
             
            </p>
          </div>
        ))}
      </div>

      <SectionHead label="Institution" />
      <CompareRow
        label="Type"
        aContent={<TypeBadge type={ca.college_type} />}
        bContent={<TypeBadge type={cb.college_type} />}
      />
      <CompareRow
        label="NAAC"
        aContent={<NaacBadge grade={ca.naac_grade} />}
        bContent={<NaacBadge grade={cb.naac_grade} />}
      />
      <CompareRow
        label="Admission"
        aContent={ca.admission_process ?? "—"}
        bContent={cb.admission_process ?? "—"}
      />
      <CompareRow
        label="Duration"
        aContent={`${ca.duration_years ?? 2} years`}
        bContent={`${cb.duration_years ?? 2} years`}
      />

      <SectionHead label="Fees" />
      <CompareRow
        label="Total fees"
        aContent={<strong>{fmtFees(ca.fees)}</strong>}
        bContent={<strong>{fmtFees(cb.fees)}</strong>}
        aResult={aFC}
        bResult={bFC}
        aTag={
          feeDiff != null && aFC === "win" ? (
            <span className="text-[10px] text-emerald-600 font-semibold">
              ₹{(feeDiff / 1000).toFixed(0)}K cheaper
            </span>
          ) : feeDiff != null && aFC === "lose" ? (
            <span className="text-[10px] text-rose-400">
              ₹{(feeDiff / 1000).toFixed(0)}K costlier
            </span>
          ) : null
        }
        bTag={
          feeDiff != null && bFC === "win" ? (
            <span className="text-[10px] text-emerald-600 font-semibold">
              ₹{(feeDiff / 1000).toFixed(0)}K cheaper
            </span>
          ) : feeDiff != null && bFC === "lose" ? (
            <span className="text-[10px] text-rose-400">
              ₹{(feeDiff / 1000).toFixed(0)}K costlier
            </span>
          ) : null
        }
      />

      <SectionHead label="Seats" />
      <CompareRow
        label="Total seats"
        aContent={ca.seats ?? "—"}
        bContent={cb.seats ?? "—"}
        aResult={aTC}
        bResult={bTC}
      />

      <SectionHead label={`${year} cutoff — ${cat}`} />
      <CompareRow
        label="Min. percentile"
        aContent={
          aCutoff != null ? <strong>{Number(aCutoff).toFixed(2)}</strong> : "—"
        }
        bContent={
          bCutoff != null ? <strong>{Number(bCutoff).toFixed(2)}</strong> : "—"
        }
        aResult={aCC}
        bResult={bCC}
        aTag={
          aCutoff != null && aCC === "win" ? (
            <span className="text-[10px] text-emerald-600 font-semibold">
              Lower bar — easier entry
            </span>
          ) : aCutoff != null && aCC === "lose" ? (
            <span className="text-[10px] text-rose-400">
              Higher score needed
            </span>
          ) : null
        }
        bTag={
          bCutoff != null && bCC === "win" ? (
            <span className="text-[10px] text-emerald-600 font-semibold">
              Lower bar — easier entry
            </span>
          ) : bCutoff != null && bCC === "lose" ? (
            <span className="text-[10px] text-rose-400">
              Higher score needed
            </span>
          ) : null
        }
      />

      <SectionHead label="Placements" />
      <CompareRow
        label="Avg package"
        aContent={ca.avg_lpa != null ? <strong>{ca.avg_lpa} LPA</strong> : "—"}
        bContent={cb.avg_lpa != null ? <strong>{cb.avg_lpa} LPA</strong> : "—"}
        aResult={aAC}
        bResult={bAC}
        aTag={
          avgDiff != null && aAC === "win" ? (
            <span className="text-[10px] text-emerald-600 font-semibold">
              +{avgDiff.toFixed(1)} LPA
            </span>
          ) : avgDiff != null && aAC === "lose" ? (
            <span className="text-[10px] text-rose-400">
              {avgDiff.toFixed(1)} LPA lower
            </span>
          ) : null
        }
        bTag={
          avgDiff != null && bAC === "win" ? (
            <span className="text-[10px] text-emerald-600 font-semibold">
              +{avgDiff.toFixed(1)} LPA
            </span>
          ) : avgDiff != null && bAC === "lose" ? (
            <span className="text-[10px] text-rose-400">
              {avgDiff.toFixed(1)} LPA lower
            </span>
          ) : null
        }
      />
      <CompareRow
        label="Highest pkg"
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
          placDiff != null && aPC === "win" ? (
            <span className="text-[10px] text-emerald-600 font-semibold">
              +{placDiff.toFixed(0)}% better
            </span>
          ) : placDiff != null && aPC === "lose" ? (
            <span className="text-[10px] text-rose-400">
              {placDiff.toFixed(0)}% lower
            </span>
          ) : null
        }
        bTag={
          placDiff != null && bPC === "win" ? (
            <span className="text-[10px] text-emerald-600 font-semibold">
              +{placDiff.toFixed(0)}% better
            </span>
          ) : placDiff != null && bPC === "lose" ? (
            <span className="text-[10px] text-rose-400">
              {placDiff.toFixed(0)}% lower
            </span>
          ) : null
        }
      />
      {(ca.top_companies || cb.top_companies) && (
        <CompareRow
          label="Top recruiters"
          aContent={
            <span className="text-[11px] text-gray-500 leading-relaxed">
              {ca.top_companies ?? "—"}
            </span>
          }
          bContent={
            <span className="text-[11px] text-gray-500 leading-relaxed">
              {cb.top_companies ?? "—"}
            </span>
          }
          noBorder
        />
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────────

export function CollegeCompareTool() {
  const { user, openAuth, setPostAuthAction } = useAuth();
  const isLoggedIn = !!user;

  const [allColleges, setAllColleges] = useState<CollegeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [selectedCat, setSelectedCat] = useState<Category>("General");
  const [selectedYear] = useState<number>(2025);
  const [compareSet, setCompareSet] = useState<number[]>([]);
  const [compareView, setCompareView] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  // Track previous login state to detect fresh login within this session
  const prevLoggedIn = useRef(isLoggedIn);

  useEffect(() => {
    setLoading(true);
    mcaToolsService
      .getCompareColleges(EXAM_KEY)
      .then((res) => setAllColleges(res.colleges as CollegeRow[]))
      .catch(() => setAllColleges([]))
      .finally(() => setLoading(false));
  }, []);

  // Detect login happening while tool is open → show inline unlock success
  useEffect(() => {
    if (!prevLoggedIn.current && isLoggedIn) {
      setJustUnlocked(true);
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);

  const toggleCompare = useCallback((idx: number) => {
    setCompareSet((prev) => {
      if (prev.includes(idx)) return prev.filter((i) => i !== idx);
      if (prev.length >= 2) return prev;
      return [...prev, idx];
    });
  }, []);

  const handleUnlock = () => {
    // Register post-auth action so gate dismisses inline after login
    setPostAuthAction(() => () => setJustUnlocked(true));
    openAuth();
  };

  // Filtered + sorted list
  const displayList = useMemo(() => {
    const list = allColleges.filter((c) => {
      if (!matchesFilter(c, activeFilter)) return false;
      if (searchQ) {
        const q = searchQ.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          (c.city ?? "").toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q)
        );
      }
      return true;
    });
    return applySorting(list, sortKey, selectedCat, selectedYear);
  }, [allColleges, activeFilter, searchQ, sortKey, selectedCat, selectedYear]);

  const visibleCards = isLoggedIn
    ? displayList
    : displayList.slice(0, FREE_LIMIT);
  const lockedCount = isLoggedIn
    ? 0
    : Math.max(0, displayList.length - FREE_LIMIT);
  const showGate = !isLoggedIn && lockedCount > 0;

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "govt", label: "Govt" },
    { key: "private", label: "Private" },
    { key: "tier_a", label: "Tier A" },
    { key: "tier_b", label: "Tier B" },
    { key: "naac_a", label: "NAAC A+/A++" },
  ];

  // ── Compare view ─────────────────────────────────────────────────────────────
  if (compareView && compareSet.length === 2) {
    const ca = allColleges[compareSet[0]];
    const cb = allColleges[compareSet[1]];
    return (
      <div className="space-y-4">
        {/* Category row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-gray-400 font-semibold shrink-0">
            Category:
          </span>
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                  selectedCat === cat
                    ? "bg-blue-600 text-white border-transparent"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        {/* Back button - always visible */}

        <div className="sticky top-0 z-30  pb-2">
          <button
            onClick={() => setCompareView(false)}
            className="text-[12px]  hover:underline flex items-center gap-1 bg-amber-600 p-2 rounded shadow cursor-pointer"
          >
            ← Back to list
          </button>
        </div>
        {/* Scrollable compare panel */}
        <div className="max-h-[600px] overflow-y-auto rounded-2xl shadow-sm">
          <ComparePanel
            ca={ca}
            cb={cb}
            cat={selectedCat}
            year={selectedYear}
            onClose={() => setCompareView(false)}
          />
        </div>
        <div className="sticky top-0 z-30  pb-2">
          <button
            onClick={() => setCompareView(false)}
            className="text-[12px]  hover:underline flex items-center gap-1 bg-amber-600 p-2 rounded shadow cursor-pointer"
          >
            ← Back to list
          </button>
        </div>
        <p className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 leading-relaxed">
          Cutoffs from MAH MCA CET {selectedYear} actual admissions data.
          Placement figures are indicative. Verify with colleges directly.
        </p>
      </div>
    );
  }

  // ── Directory view ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-0">
      {/* ── Sticky controls ── */}
      <div className="sticky top-0 z-20 bg-[#f8f7f4] pb-2 pt-1 space-y-2">
        {/* Search + Sort — single compact row */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search by name or city…"
              className="w-full pl-7 pr-2.5 py-1.5 text-[13px] border border-gray-200 rounded-xl bg-white text-gray-800 outline-none focus:border-gray-400 placeholder:text-gray-300"
            />
          </div>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="text-[12px] px-2 py-1.5 border border-gray-200 rounded-xl bg-white text-gray-500 outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category + filter pills — single scrollable row on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {/* Category pills */}
          <div className="flex gap-1 shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCat === cat
                    ? "bg-amber-500 text-amber-950 border-transparent"
                    : "bg-gray-50 text-gray-400 border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-gray-200 shrink-0" />

          {/* Filter pills */}
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`text-[11px] px-2.5 py-0.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === key
                  ? "bg-cyan-900 text-white border-transparent"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-[11px] text-gray-400 leading-none">
          {isLoggedIn
            ? displayList.length
            : `${FREE_LIMIT} of ${displayList.length}`}{" "}
          college{displayList.length !== 1 ? "s" : ""}
          {searchQ ? ` for "${searchQ}"` : ""}
        </p>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="text-center py-10">
          <svg
            className="animate-spin h-5 w-5 text-gray-300 mx-auto"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="31.4"
              strokeDashoffset="10"
            />
          </svg>
          <p className="text-xs text-gray-400 mt-2">Loading colleges…</p>
        </div>
      )}

      {/* ── Card grid ── */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            {visibleCards.map((college) => {
              const globalIdx = allColleges.indexOf(college);
              return (
                <CollegeCard
                  key={college.name + globalIdx}
                  college={college}
                  globalIndex={globalIdx}
                  isSelected={compareSet.includes(globalIdx)}
                  canSelect={
                    compareSet.includes(globalIdx) || compareSet.length < 2
                  }
                  cat={selectedCat}
                  year={selectedYear}
                  onToggleCompare={toggleCompare}
                />
              );
            })}

            {displayList.length === 0 && (
              <div className="col-span-2 text-center py-12 text-sm text-gray-400">
                No colleges match your filters.
              </div>
            )}
          </div>

          {/* ── Gate overlay ── */}
          {showGate && (
            <GateOverlay
              lockedCount={lockedCount}
              totalCount={displayList.length}
              onUnlock={handleUnlock}
              justUnlocked={justUnlocked}
            />
          )}

          {/* ── Post-unlock success banner ── */}
          {justUnlocked && isLoggedIn && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 mt-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-[12px] text-emerald-700 font-medium">
                All <strong>{allColleges.length} colleges</strong> are now
                unlocked.
              </p>
            </div>
          )}
        </>
      )}

      {/* ── Sticky compare bar ── */}
      {compareSet.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-b-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.08)] z-20">
          <div className="text-[12px] text-gray-500">
            <span className="font-semibold text-gray-800">
              {compareSet.length}
            </span>{" "}
            of 2 selected
            {compareSet.length === 1 && (
              <span className="text-gray-400 ml-1 hidden sm:inline">
                — pick one more
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCompareSet([]);
                setCompareView(false);
              }}
              className="text-[12px] px-3 py-1.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => compareSet.length === 2 && setCompareView(true)}
              disabled={compareSet.length < 2}
              className={`text-[12px] px-4 py-1.5 rounded-xl text-white font-semibold transition-all cursor-pointer ${
                compareSet.length === 2
                  ? "bg-cyan-900 hover:bg-cyan-800"
                  : "bg-blue-200 cursor-not-allowed"
              }`}
            >
              Compare →
            </button>
          </div>
        </div>
      )}

      {/* ── Disclaimer ── */}
      {!loading && (
        <p className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 leading-relaxed mt-3">
          Cutoffs from MAH MCA CET {selectedYear} actual admissions. Placement
          figures are indicative. Always verify directly with the college.
        </p>
      )}
    </div>
  );
}
