"use client";

import { STARS } from "@/lib/util";
import { useExamMenu } from "@/providers/ExamMenuUIProvider";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";

/* ─────────────────────────────────────────────────────
   Stars
───────────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────────
   Three-Ring Orbit SVG
   - Outer ring  (r=175): 6 exam pills
   - Middle ring (r=115): 6 feature pills
   - Inner ring  (r=60):  3 live class pills
   - Center:              Crackora logo planet
   All angles are evenly spaced within each ring.
   SVG viewBox 420×420, center (210,210).
───────────────────────────────────────────────────── */

const CX = 210,
  CY = 210;
const R_OUTER = 175;
const R_MIDDLE = 100;
const R_INNER = 60;

// Converts polar to cartesian
const polar = (angleDeg: number, r: number) => ({
  x: CX + r * Math.cos((angleDeg * Math.PI) / 180),
  y: CY + r * Math.sin((angleDeg * Math.PI) / 180),
});

// Outer ring: 6 exams, evenly spaced, start at -90 (top)
const OUTER_ITEMS = [
  "NIMCET",
  "MAH MCA CET",
  "CUET PG MCA",
  "TANCET",
  "IPU CET MCA",
  "WB JECA",
].map((label, i) => ({ label, ...polar(-90 + i * 60, R_OUTER) }));

// Middle ring: 6 features, offset 30° so they sit between outer items
const MIDDLE_ITEMS = [
  "Mock Tests",
  "Doubt Solving",
  "Study Planner",
  "Analytics",
  "Career Guide",
  "PYQ Bank",
].map((label, i) => ({ label, ...polar(-60 + i * 60, R_MIDDLE) }));

// Inner ring: 3 live items, evenly spaced
const INNER_ITEMS = ["Live Classes", "Recorded", "Mentorship"].map(
  (label, i) => ({ label, ...polar(-90 + i * 120, R_INNER) }),
);

/* ─────────────────────────────────────────────────────
   OrbitBubble — circle with 2-line text
───────────────────────────────────────────────────── */
function OrbitBubble({
  x,
  y,
  label,
  tier,
}: {
  x: number;
  y: number;
  label: string;
  tier: "outer" | "middle";
}) {
  const cfg = {
    outer: {
      r: 28,
      bg: "#B46309",
      border: "rgba(251,200,36,0.68)",
      glow: "rgba(245,150,11,0.22)",
      glowR: 30,
      textCol: "#fff",
      ts: 9.0,
      sw: 1.2,
    },
    middle: {
      r: 25,
      bg: "#164E63",
      border: "rgba(103,232,249,0.58)",
      glow: "rgba(6,182,212,0.18)",
      glowR: 28,
      textCol: "#fff",
      ts: 9,
      sw: 1.0,
    }
   
  };
  const c = cfg[tier];
  const words = label.split(" ");
  const line1 =
    words.length === 1
      ? words[0]
      : words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const line2 =
    words.length === 1
      ? ""
      : words.slice(Math.ceil(words.length / 2)).join(" ");
  const twoLine = line2.length > 0;
  return (
    <g>
      <circle cx={x} cy={y} r={c.glowR} fill={c.glow} />
      <circle
        cx={x}
        cy={y}
        r={c.r}
        fill={c.bg}
        stroke={c.border}
        strokeWidth={c.sw}
      />
      {twoLine ? (
        <>
          <text
            x={x}
            y={y - 4.5}
            textAnchor="middle"
            dominantBaseline="central"
            fill={c.textCol}
            fontSize={c.ts}
            fontWeight="700"
            fontFamily="system-ui,sans-serif"
          >
            {line1}
          </text>
          <text
            x={x}
            y={y + 5.5}
            textAnchor="middle"
            dominantBaseline="central"
            fill={c.textCol}
            fontSize={c.ts}
            fontWeight="700"
            fontFamily="system-ui,sans-serif"
          >
            {line2}
          </text>
        </>
      ) : (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={c.textCol}
          fontSize={c.ts}
          fontWeight="700"
          fontFamily="system-ui,sans-serif"
        >
          {line1}
        </text>
      )}
    </g>
  );
}

// Keep OrbitPill alias so nothing else breaks — but it's unused now
function OrbitPill({
  x,
  y,
  label,
  tier,
}: {
  x: number;
  y: number;
  label: string;
  tier: "outer" | "middle" ;
}) {
  const configs = {
    outer: {
      rx: 10,
      py: 5,
      px: 10,
      textSize: 9.5,
      fillOpacity: 0.92,
      bg: "#1e3a5f",
      border: "rgba(251,191,36,0.55)",
      textCol: "#fde68a",
      glow: "rgba(251,191,36,0.18)",
    },
    middle: {
      rx: 9,
      py: 4.5,
      px: 9,
      textSize: 9,
      fillOpacity: 0.88,
      bg: "#0f2a40",
      border: "rgba(103,232,249,0.45)",
      textCol: "#a5f3fc",
      glow: "rgba(103,232,249,0.12)",
    },
  };

  const c = configs[tier];
  // Estimate pill width from char count
  const estW = label.length * c.textSize * 0.62 + c.px * 2;
  const estH = c.textSize + c.py * 2;

  return (
    <g>
      {/* Glow shadow behind pill */}
      <rect
        x={x - estW / 2 - 2}
        y={y - estH / 2 - 2}
        width={estW + 4}
        height={estH + 4}
        rx={c.rx + 2}
        fill={c.glow}
      />
      {/* Pill background */}
      <rect
        x={x - estW / 2}
        y={y - estH / 2}
        width={estW}
        height={estH}
        rx={c.rx}
        fill={c.bg}
        fillOpacity={c.fillOpacity}
        stroke={c.border}
        strokeWidth={0.8}
      />
      {/* Label */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={c.textCol}
        fontSize={c.textSize}
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.02em"
      >
        {label}
      </text>
    </g>
  );
}

function ThreeRingOrbit() {
  return (
    <div className="w-full flex items-center justify-center select-none">
      <div className="w-[310px] h-[310px] sm:w-[370px] sm:h-[370px] md:w-[415px] md:h-[415px] lg:w-[455px] lg:h-[455px]">
        <svg
          viewBox="0 0 420 420"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Faded ring fills — radial so colour is strongest at the ring edge */}
            <radialGradient id="outerFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
              <stop offset="74%" stopColor="#f59e0b" stopOpacity="0" />
              <stop offset="88%" stopColor="#f59e0b" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.16" />
            </radialGradient>
            <radialGradient id="middleFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="78%" stopColor="#06b6d4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.14" />
            </radialGradient>
            <radialGradient id="innerFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.16" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            {/* Planet */}
            <radialGradient id="pg" cx="36%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
            {/* Centre warm glow */}
            <radialGradient id="cg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.42" />
              <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            {/* Ambient */}
            <radialGradient id="amb" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.08" />
              <stop offset="55%" stopColor="#1d4ed8" stopOpacity="0.05" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            {/* Glow filter for ring strokes */}
            <filter id="rg" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ambient */}
          <circle cx={CX} cy={CY} r={215} fill="url(#amb)" />

          {/* ── Faded ring zones ── */}
          <circle cx={CX} cy={CY} r={R_OUTER + 30} fill="url(#outerFill)" />
          <circle cx={CX} cy={CY} r={R_MIDDLE + 26} fill="url(#middleFill)" />
          <circle cx={CX} cy={CY} r={R_INNER + 22} fill="url(#innerFill)" />

          {/* ── Ring strokes (dashed, glowing) ── */}
          <circle
            cx={CX}
            cy={CY}
            r={R_OUTER}
            fill="none"
            stroke="rgba(251,191,36,0.38)"
            strokeWidth={1}
            strokeDasharray="5 7"
            filter="url(#rg)"
          />
          <circle
            cx={CX}
            cy={CY}
            r={R_MIDDLE}
            fill="none"
            stroke="rgba(103,232,249,0.32)"
            strokeWidth={0.9}
            strokeDasharray="4 6"
            filter="url(#rg)"
          />
       

          {/* Subtle connectors outer → centre */}
          {OUTER_ITEMS.map(({ x, y, label }) => (
            <line
              key={`cl${label}`}
              x1={CX + (x - CX) * 0.86}
              y1={CY + (y - CY) * 0.86}
              x2={x}
              y2={y}
              stroke="rgba(251,191,36,0.09)"
              strokeWidth={0.6}
            />
          ))}

          {/* Centre glow */}
          <circle cx={CX} cy={CY} r={64} fill="url(#cg)" />

          {/* Planet */}
          <circle
            cx={CX}
            cy={CY}
            r={43}
            fill="url(#pg)"
            stroke="rgba(251,191,36,0.55)"
          />

          {/* Saturn halo — two strokes for soft + sharp */}
    

          {/* Logo */}
          <image
            href="/vertical-logo.svg"
            x={CX - 22}
            y={CY - 26}
            width={50}
            height={50}
            preserveAspectRatio="xMidYMid meet"
          />

          {MIDDLE_ITEMS.map(({ x, y, label }) => (
            <OrbitBubble key={label} x={x} y={y} label={label} tier="middle" />
          ))}
          {OUTER_ITEMS.map(({ x, y, label }) => (
            <OrbitBubble key={label} x={x} y={y} label={label} tier="outer" />
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   LiveBatchCard
───────────────────────────────────────────────────── */
function LiveBatchCard() {
  return (
    <div className="w-full max-w-[340px] sm:max-w-[390px] lg:max-w-[410px] mx-auto lg:mx-0 lg:ml-auto">
      <div className="rounded-2xl bg-[#f8f7f4] shadow-2xl shadow-black/50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-400" />
        <div className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="text-green-600 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
              Now Enrolling
            </span>
          </div>

          <div className="flex items-start justify-between mb-3 sm:mb-0">
            <div>
              <h2 className="text-gray-900 text-[18px] sm:text-xl lg:text-2xl font-bold leading-tight">
                MCA 2027
                <span className="block text-amber-600">Live Batch</span>
              </h2>
              <p className="text-gray-400 text-[10px] sm:text-[11px] mt-0.5 tracking-wide">
                NIMCET · MAH MCA CET · CUET PG · TANCET
              </p>
            </div>
            <div className="flex flex-col items-end sm:hidden shrink-0 ml-3">
              <div className="flex items-baseline gap-0.5">
                <span className="text-amber-600 text-[18px] font-bold">
                  ₹999
                </span>
                <span className="text-gray-400 text-[10px]">/mo</span>
              </div>
              <span className="text-[9px] text-amber-700 border border-amber-200 bg-amber-50 px-1.5 py-0.5 rounded-full font-medium mt-1">
                Limited
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-2 gap-x-2 mt-3 mb-3 sm:mt-4 sm:mb-4">
            {[
              "3 Live Sessions/week",
              "Recorded Backups",
              "Doubt Solving",
              "Mock Tests Included",
              "Study Planner",
              "PYQ Discussions",
            ].map((f) => (
              <div key={f} className="flex items-start gap-1.5">
                <span className="mt-[4px] w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-gray-600 text-[10px] sm:text-[11px] lg:text-[13px] leading-snug">
                  {f}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-gray-100 mb-3 sm:mb-4" />

          <div className="hidden sm:flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-gray-400 text-xs line-through">₹1,999</span>
              <span className="text-amber-600 text-2xl font-bold">₹999</span>
              <span className="text-gray-400 text-xs">/month</span>
            </div>
            <span className="text-[11px] text-amber-700 border border-amber-200 bg-amber-50 px-2.5 py-1 rounded-full font-medium">
              Limited seats
            </span>
          </div>

          <Link href="/live-classes">
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2.5 rounded-xl text-[13px] sm:text-sm lg:text-[15px] transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 cursor-pointer">
              Enroll Now →
            </button>
          </Link>

          <p className="text-center text-gray-400 text-[10px] sm:text-[11px] mt-2">
            Starts May 2026 · Cancel Anytime
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   GuidanceCard
───────────────────────────────────────────────────── */
function GuidanceCard() {
  const questions = [
    { q: "Which MCA entrance exam suits me?", show: true },
    { q: "Should I do MCA or MTech?", show: true },
    { q: "Which college should I target?", show: false },
    { q: "What's the right prep strategy?", show: false },
  ];

  return (
    <div className="w-full max-w-[340px] sm:max-w-[390px] lg:max-w-[460px] mx-auto lg:mx-0 lg:ml-auto">
      <div className="rounded-2xl bg-[#f8f7f4] shadow-2xl shadow-black/50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-400" />
        <div className="p-4 sm:p-5 lg:p-6">
          <span className="inline-block text-amber-600 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-2 sm:mb-3">
            Free MCA Guidance
          </span>

          <h2 className="text-gray-900 text-[17px] sm:text-lg lg:text-xl font-bold leading-tight mb-1.5 sm:mb-2">
            Not sure where
            <span className="block text-amber-600">to start?</span>
          </h2>

          <p className="text-gray-500 text-[11px] sm:text-[13px] leading-relaxed mb-3 sm:mb-4">
            Our mentors will help you figure out which exam, college, and career
            suits you — completely free.
          </p>

          <div className="space-y-1.5 mb-3 sm:mb-4">
            {questions.map(({ q, show }) => (
              <div
                key={q}
                className={`items-start gap-2 p-2 sm:p-2.5 rounded-lg bg-gray-50 border border-gray-100 ${show ? "flex" : "hidden sm:flex"}`}
              >
                <span className="text-amber-500 text-[11px] shrink-0 mt-0.5">
                  <BiSend />
                </span>
                <span className="text-gray-600 text-[11px] sm:text-[12px] lg:text-[13px] leading-snug">
                  {q}
                </span>
              </div>
            ))}
            <p className="text-amber-500 text-[10px] font-medium sm:hidden">
              + 2 more topics we can help with
            </p>
          </div>

          <div className="w-full h-px bg-gray-100 mb-3 sm:mb-4" />

          <a
            href="https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%20need%20guidance%20for%20MCA%20entrance"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 rounded-xl text-[13px] sm:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 cursor-pointer flex items-center justify-center gap-2">
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat with a Mentor — Free
            </button>
          </a>

          <p className="text-center text-gray-400 text-[10px] sm:text-[11px] mt-2">
            Typically replies within 2 hours
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Slide data
───────────────────────────────────────────────────── */
const slides = [
  {
    id: "batch",
    eyebrow: "live" as const,
    title: "NIMCET 2027 — Live Batch Now Open",
    titleAccent: "Live Batch",
    accentColor: "text-amber-500",
    description: "India's most focused MCA entrance prep. Live classes 3×/week, doubt solving, mock test access, and a personalised study plan. Limited seats.",
    primaryBtn:   { label: "Enroll Now — ₹999/month", href: "/live-classes" },
    secondaryBtn: { label: "View Schedule",            href: "/live-classes#schedule" },
    right: "batch" as const,
  },
  {
    id: "platform",
    eyebrow: "platform" as const,
    title: "Your MCA Journey Starts Here — Entrance to Employment",
    titleAccent: "Starts Here",
    accentColor: "text-amber-500",
    description: "From cracking NIMCET and MAH MCA CET to landing your first ₹8–18 LPA tech role — Crackora guides you through every step. Mock tests, college predictor, career roadmap. All free.",
    primaryBtn:   { label: "Explore Free Tools",    href: "/tools/college"       },
    secondaryBtn: { label: "Start Free Mock Test",  href: "https://learn.crackora.com/learn/Free-MAH-MCA-CET-2026-Mock-Test"  },
    right: "orbit" as const,
  },
  {
    id: "guidance",
    eyebrow: "guidance" as const,
    title: "Confused About MCA? We'll Guide You — Free",
    titleAccent: "MCA?",
    accentColor: "text-amber-500",
    description: "Not sure which exam to give, which college to target, or whether MCA is right for you? Talk to our mentors — no sales pitch, just honest guidance.",
    primaryBtn:   { label: "Chat with a Mentor",    href: "https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%20need%20MCA%20guidance" },
    secondaryBtn: { label: "Read MCA Career Guide", href: "/guidance" },
    right: "guidance" as const,
  },
];

function SlideTitle({
  title,
  accent,
  accentColor,
}: {
  title: string;
  accent: string;
  accentColor: string;
}) {
  const parts = title.split(accent);
  return (
    <>
      {parts[0]}
      <span className={accentColor}>{accent}</span>
      {parts[1]}
    </>
  );
}

const eyebrowMap = {
  live: {
    cls: "border-amber-400/60 bg-amber-950/60 text-amber-300",
    label: "2027 Batch — Enrolling Now",
  },
  platform: {
    cls: "border-amber-400/60 bg-amber-950/60 text-amber-300",
    label: "India's #1 MCA End-to-End Platform",
  },
  guidance: {
    cls: "border-amber-400/60 bg-amber-950/60 text-amber-300",
    label: "Free MCA Guidance",
  },
};

/* ─────────────────────────────────────────────────────
   HeroBanner
───────────────────────────────────────────────────── */
export function HeroBanner() {
  const { setOpen } = useExamMenu();

  const [visible, setVisible] = useState(0);
  const [exiting, setExiting] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const goTo = (next: number) => {
    if (next === visible) return;
    if (isMobile) {
      setVisible(next);
      return;
    }
    setDirection(next > visible ? "left" : "right");
    setExiting(visible);
    setVisible(next);
    setTimeout(() => setExiting(null), 450);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setVisible((prev) => {
        const next = (prev + 1) % slides.length;
        if (window.innerWidth < 1024) return next;
        setDirection("left");
        setExiting(prev);
        setTimeout(() => setExiting(null), 450);
        return next;
      });
    }, 3000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exitCls =
    direction === "left"
      ? "-translate-x-12 opacity-0 pointer-events-none"
      : "translate-x-12 opacity-0 pointer-events-none";

  return (
    <div className="relative w-full overflow-hidden mt-16 bg-[#020817]">
      {/* ── Galaxy background layers ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Deep space */}
       <div className="absolute inset-0 bg-[#020617]" />
        {/* Cyan nebula */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
        {/* Green nebula */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
        {/* Soft atmospheric diffusion */}
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* ── Stars ── */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {STARS.map((s) => (
          <span
            key={s.id}
            className={`absolute rounded-full ${s.amber ? "bg-amber-300" : "bg-white"}`}
            style={{
              top: s.top,
              left: s.left,
              width: s.w,
              height: s.w,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* ── Slide viewport ──
          Mobile/tablet: single slide in normal flow
          Desktop lg+: fixed min-h, slides absolute
      ── */}
      <div className="relative z-10 lg:min-h-150 max-w-6xl  mx-auto lg:px-10 px-5">
        {slides.map((slide, i) => {
          const isVisible = i === visible;
          const isExiting = i === exiting;
          if (isMobile && !isVisible) return null;
          if (!isMobile && !isVisible && !isExiting) return null;

          const eb = eyebrowMap[slide.eyebrow];

          return (
            <div
              key={slide.id}
              className={[
                "lg:absolute lg:inset-0",
                "transition-all duration-[420ms] ease-in-out",
                isExiting ? exitCls : "translate-x-0 opacity-100",
              ].join(" ")}
            >
              <div
                className="
                w-full h-full 
                flex flex-col lg:flex-row items-center
                px-5 sm:px-0
                pt-9 sm:pt-12 lg:pt-14
                pb-7 sm:pb-10 lg:pb-16
                gap-6 sm:gap-8 lg:gap-8
              "
              >
                {/* ════ LEFT — text ════ */}
                <div className="w-full lg:w-[50%] flex flex-col items-center lg:items-start">
                  {/* Eyebrow */}
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mb-3 sm:mb-4 backdrop-blur-sm ${eb.cls}`}
                  >
                    {slide.eyebrow === "live" && (
                      <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-400" />
                      </span>
                    )}
                    {eb.label}
                  </span>

                  {/* Headline */}
                  <h1
                    className="
                    text-[21px] sm:text-[31px] lg:text-[38px] xl:text-[44px]
                    font-bold leading-[1.22]
                    text-white
                    text-center lg:text-left
                    mb-3 sm:mb-4
                    drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]
                  "
                  >
                    <SlideTitle
                      title={slide.title}
                      accent={slide.titleAccent}
                      accentColor={slide.accentColor}
                    />
                  </h1>

                  {/* Description */}
                  <p
                    className="
                    text-white/60 leading-relaxed
                    text-[12px] sm:text-[14px] lg:text-[15px]
                    text-center lg:text-left
                    max-w-[310px] sm:max-w-lg mx-auto lg:mx-0
                    mb-5 sm:mb-7
                    line-clamp-3 sm:line-clamp-none
                    drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]
                  "
                  >
                    {slide.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto justify-center lg:justify-start">
                    <Link
                      href={slide.primaryBtn.href}
                      className="w-full sm:w-auto"
                    >
                      <button
                        className="
                        w-full bg-amber-600 hover:bg-amber-500 text-white
                        font-semibold cursor-pointer
                        px-5 py-3 sm:px-7 sm:py-3
                        text-[13px] sm:text-[14px] lg:text-[15px]
                        rounded-xl transition-all duration-300
                        shadow-lg shadow-amber-900/40
                        hover:scale-105 hover:shadow-amber-500/40
                      "
                      >
                        {slide.primaryBtn.label}
                      </button>
                    </Link>
                    <Link
                      href={slide.secondaryBtn.href}
                      className="w-full sm:w-auto"
                    >
                      <button
                        className="
                        w-full border border-white/25 text-white/85
                        font-medium cursor-pointer
                        px-5 py-3 sm:px-6 sm:py-3
                        text-[13px] sm:text-[14px] lg:text-[15px]
                        rounded-xl bg-white/5 backdrop-blur-sm
                        transition-all duration-300
                        hover:bg-white/10 hover:border-white/40 hover:scale-105
                      "
                      >
                        {slide.secondaryBtn.label}
                      </button>
                    </Link>
                  </div>
                </div>

                {/* ════ RIGHT ════ */}
                <div className="w-full lg:w-[50%] flex items-center justify-center lg:justify-center">
                  {slide.right === "batch" && <LiveBatchCard />}
                  {slide.right === "guidance" && <GuidanceCard />}
                  {slide.right === "orbit" && (
                    <div className="w-full flex justify-center mt-4 sm:mt-6 lg:mt-0">
                      <ThreeRingOrbit />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Dots — always visible, never animated ── */}
        <div className="relative lg:absolute lg:bottom-10  w-full flex justify-center gap-2 z-20 pt-3 pb-5 lg:pt-0 lg:pb-0">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                goTo(i);
                resetTimer();
              }}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === visible
                  ? "w-7 bg-amber-600"
                  : "w-2 bg-white/20 hover:bg-white/45"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
