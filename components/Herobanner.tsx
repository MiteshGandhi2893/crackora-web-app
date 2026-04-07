/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

import { STARS } from "@/lib/util";
import { useExamMenu } from "@/providers/ExamMenuUIProvider";
import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  useMemo,
  useReducer,
} from "react";
import { BiSend } from "react-icons/bi";

/* ─────────────────────────────────────────────────────
   Stars — single canvas, drawn once, zero DOM nodes
───────────────────────────────────────────────────── */
const StarField = memo(function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      STARS.forEach((s) => {
        const x = (parseFloat(s.left) / 100) * canvas.width;
        const y = (parseFloat(s.top) / 100) * canvas.height;
        const r = parseFloat(s.w + "") / 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = s.amber
          ? `rgba(252,211,77,${s.opacity})`
          : `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
      });
    };

    draw();

    let raf: number;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
});

/* ─────────────────────────────────────────────────────
   Orbit constants (computed once, outside component)
───────────────────────────────────────────────────── */
const CX = 210,
  CY = 210;
const R_OUTER = 175;
const R_MIDDLE = 100;

const polar = (angleDeg: number, r: number) => ({
  x: CX + r * Math.cos((angleDeg * Math.PI) / 180),
  y: CY + r * Math.sin((angleDeg * Math.PI) / 180),
});

const OUTER_ITEMS = [
  "NIMCET",
  "MAH MCA CET",
  "CUET PG MCA",
  "TANCET",
  "IPU CET MCA",
  "WB JECA",
].map((label, i) => ({ label, ...polar(-90 + i * 60, R_OUTER) }));

const MIDDLE_ITEMS = [
  "Mock Tests",
  "Doubt Solving",
  "Study Planner",
  "Analytics",
  "Career Guide",
  "PYQ Bank",
].map((label, i) => ({ label, ...polar(-60 + i * 60, R_MIDDLE) }));

/* ─────────────────────────────────────────────────────
   OrbitBubble — memoized, no internal state
───────────────────────────────────────────────────── */
const OrbitBubble = memo(function OrbitBubble({
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
    },
  };
  const c = cfg[tier];
  const words = label.split(" ");
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const line2 =
    words.length > 1
      ? words.slice(Math.ceil(words.length / 2)).join(" ")
      : "";

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
      {line2 ? (
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
});

/* ─────────────────────────────────────────────────────
   ThreeRingOrbit — fully memoized, never re-renders
───────────────────────────────────────────────────── */
const ThreeRingOrbit = memo(function ThreeRingOrbit() {
  return (
    <div className="w-full flex items-center justify-center select-none">
      <div className="w-[310px] h-[310px] sm:w-[370px] sm:h-[370px] md:w-[415px] md:h-[415px] lg:w-[455px] lg:h-[455px]">
        <svg
          viewBox="0 0 420 420"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
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
            <radialGradient id="pg" cx="36%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
            <radialGradient id="cg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.42" />
              <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="amb" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.08" />
              <stop offset="55%" stopColor="#1d4ed8" stopOpacity="0.05" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <filter id="rg" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>

          <circle cx={CX} cy={CY} r={215} fill="url(#amb)" />
          <circle cx={CX} cy={CY} r={R_OUTER + 30} fill="url(#outerFill)" />
          <circle cx={CX} cy={CY} r={R_MIDDLE + 26} fill="url(#middleFill)" />

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

          <circle cx={CX} cy={CY} r={64} fill="url(#cg)" />
          <circle
            cx={CX}
            cy={CY}
            r={43}
            fill="url(#pg)"
            stroke="rgba(251,191,36,0.55)"
          />

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
});

/* ─────────────────────────────────────────────────────
   LiveBatchCard — memoized
───────────────────────────────────────────────────── */
const LiveBatchCard = memo(function LiveBatchCard() {
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
});

/* ─────────────────────────────────────────────────────
   GuidanceCard — memoized
───────────────────────────────────────────────────── */
const GuidanceCard = memo(function GuidanceCard() {
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
});

/* ─────────────────────────────────────────────────────
   Slide data (static, defined outside component)
───────────────────────────────────────────────────── */
const slides = [
  {
    id: "batch",
    eyebrow: "live" as const,
    title: "NIMCET 2027 — Live Batch Now Open",
    titleAccent: "Live Batch",
    description:
      "India's most focused MCA entrance prep. Live classes 3×/week, doubt solving, mock test access, and a personalised study plan. Limited seats.",
    primaryBtn: { label: "Enroll Now — ₹999/month", href: "/live-classes" },
    secondaryBtn: { label: "View Schedule", href: "/live-classes#schedule" },
    right: "batch" as const,
  },
  {
    id: "platform",
    eyebrow: "platform" as const,
    title: "Your MCA Journey Starts Here — Entrance to Employment",
    titleAccent: "Starts Here",
    description:
      "From cracking NIMCET and MAH MCA CET to landing your first ₹8–18 LPA tech role — Crackora guides you through every step. Mock tests, college predictor, career roadmap. All free.",
    primaryBtn: { label: "Explore Free Tools", href: "/tools/college" },
    secondaryBtn: {
      label: "Start Free Mock Test",
      href: "https://learn.crackora.com/learn/Free-MAH-MCA-CET-2026-Mock-Test",
    },
    right: "orbit" as const,
  },
  {
    id: "guidance",
    eyebrow: "guidance" as const,
    title: "Confused About MCA? We'll Guide You — Free",
    titleAccent: "MCA?",
    description:
      "Not sure which exam to give, which college to target, or whether MCA is right for you? Talk to our mentors — no sales pitch, just honest guidance.",
    primaryBtn: {
      label: "Chat with a Mentor",
      href: "https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%20need%20MCA%20guidance",
    },
    secondaryBtn: { label: "Read MCA Career Guide", href: "/guidance" },
    right: "guidance" as const,
  },
];

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
   SlideTitle — pure, no state
───────────────────────────────────────────────────── */
const SlideTitle = memo(function SlideTitle({
  title,
  accent,
}: {
  title: string;
  accent: string;
}) {
  const parts = title.split(accent);
  return (
    <>
      {parts[0]}
      <span className="text-amber-500">{accent}</span>
      {parts[1]}
    </>
  );
});

/* ─────────────────────────────────────────────────────
   PERF: Single flat state object — one dispatch,
   one re-render. No separate exiting/dir state.
───────────────────────────────────────────────────── */
type SlideState = { visible: number; exiting: number | null; dir: "left" | "right" };
type SlideAction =
  | { type: "GO"; next: number }
  | { type: "CLEAR_EXIT" };

function slideReducer(state: SlideState, action: SlideAction): SlideState {
  switch (action.type) {
    case "GO":
      return {
        visible: action.next,
        exiting: state.visible,
        dir: action.next > state.visible ? "left" : "right",
      };
    case "CLEAR_EXIT":
      if (state.exiting === null) return state; // PERF: bail if already clear, skip re-render
      return { ...state, exiting: null };
    default:
      return state;
  }
}

/* ─────────────────────────────────────────────────────
   RightPanel — stable reference, prevents re-render
   of panels that are NOT transitioning.
   PERF: All three panels are always mounted on desktop
   (opacity/pointer-events gate them). This avoids
   remounting ThreeRingOrbit / cards on slide change.
───────────────────────────────────────────────────── */
const RightPanel = memo(function RightPanel({
  type,
}: {
  type: "batch" | "orbit" | "guidance";
}) {
  if (type === "batch") return <LiveBatchCard />;
  if (type === "guidance") return <GuidanceCard />;
  return (
    <div className="w-full flex justify-center mt-4 sm:mt-6 lg:mt-0">
      <ThreeRingOrbit />
    </div>
  );
});

/* ─────────────────────────────────────────────────────
   PERF: useInterval stores the latest callback in a
   ref so the interval ID never needs to change when
   `advance` is recreated. resetTimer() restarts the
   interval from zero without touching the callback ref.
───────────────────────────────────────────────────── */
function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);
  // Always point at the freshest callback — zero overhead, no deps change
  useEffect(() => {
    savedCallback.current = callback;
  });

  const idRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback(() => {
    if (idRef.current) clearInterval(idRef.current);
    idRef.current = setInterval(() => savedCallback.current(), delay);
  }, [delay]); // delay is a constant — this memoizes forever

  useEffect(() => {
    reset();
    return () => {
      if (idRef.current) clearInterval(idRef.current);
    };
  }, [reset]);

  return reset;
}

/* ─────────────────────────────────────────────────────
   PERF: isMobile via a ref that's read at transition
   time, not reactive state. Avoids a cascade of
   re-renders on every resize tick.
───────────────────────────────────────────────────── */
function useIsMobileRef(): React.RefObject<boolean> {
  const ref = useRef(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  useEffect(() => {
    let raf: number;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        ref.current = window.innerWidth < 1024;
      });
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}

/* ─────────────────────────────────────────────────────
   HeroBanner
───────────────────────────────────────────────────── */
export function HeroBanner() {
  const [state, dispatch] = useReducer(slideReducer, {
    visible: 0,
    exiting: null,
    dir: "left",
  });
  const { visible, exiting, dir } = state;

  // PERF: ref instead of state — resize never triggers a re-render cascade
  const isMobileRef = useIsMobileRef();

  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // PERF: goTo reads `visible` from a ref so its identity is stable forever.
  // Previously `visible` in the dep array meant a new goTo every slide tick,
  // which invalidated handleDot and resetTimer on every auto-advance.
  const visibleRef = useRef(visible);
  useEffect(() => {
    visibleRef.current = visible;
  });

  const goTo = useCallback((next: number) => {
    if (next === visibleRef.current) return;

    if (isMobileRef.current) {
      // On mobile: no exit animation, just swap immediately
      dispatch({ type: "GO", next });
      dispatch({ type: "CLEAR_EXIT" });
      return;
    }

    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    dispatch({ type: "GO", next });
    exitTimeoutRef.current = setTimeout(
      () => dispatch({ type: "CLEAR_EXIT" }),
      450
    );
  }, []); // stable forever — reads refs, not state

  // PERF: advance reads visibleRef so useInterval doesn't need to re-register
  // the interval when the slide index changes.
  const advance = useCallback(() => {
    goTo((visibleRef.current + 1) % slides.length);
  }, [goTo]); // goTo is stable, so advance is stable

  const resetTimer = useInterval(advance, 3000);

  const handleDot = useCallback(
    (i: number) => {
      goTo(i);
      resetTimer();
    },
    [goTo, resetTimer]
  ); // both stable — handleDot never recreates

  const exitCls =
    dir === "left"
      ? "-translate-x-12 opacity-0 pointer-events-none"
      : "translate-x-12 opacity-0 pointer-events-none";

  return (
    <div className="relative w-full overflow-hidden mt-16 bg-[#020817]">
      {/* ── Background layers — no JS, pure CSS ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* ── Stars on canvas — zero DOM nodes ── */}
      <StarField />

      {/* ── Slide viewport ── */}
      <div className="relative z-10 lg:min-h-150 max-w-6xl mx-auto lg:px-10 px-5">
        {slides.map((slide, i) => {
          const isVisible = i === visible;
          const isExiting = i === exiting;

          /*
           * PERF: On mobile we skip non-visible slides entirely (same as
           * before). On desktop we render ALL slides but hide them via CSS
           * visibility + pointer-events rather than conditional mounting.
           *
           * Why: conditional mounting unmounts/remounts ThreeRingOrbit and
           * the card components on every slide transition, blowing away their
           * DOM and forcing layout recalc. Keeping them mounted means React
           * only touches className during transitions — zero reconciliation
           * of the heavy SVG or card subtrees.
           */
          const shouldSkipOnMobile =
            typeof window !== "undefined" &&
            window.innerWidth < 1024 &&
            !isVisible;
          if (shouldSkipOnMobile) return null;

          // On desktop: only visible + exiting slides participate in the
          // animated layer. All others sit hidden with opacity-0 and no
          // pointer events but ARE mounted (see above).
          const isActive = isVisible || isExiting;

          const eb = eyebrowMap[slide.eyebrow];

          return (
            <div
              key={slide.id}
              aria-hidden={!isVisible}
              className={[
                "lg:absolute lg:inset-0",
                "transition-[transform,opacity] duration-[420ms] ease-in-out",
                "will-change-[transform,opacity]",
                // PERF: non-active slides on desktop get opacity-0 + no
                // pointer-events. They remain mounted but invisible — no
                // layout cost, no paint, no interaction.
                !isActive && "lg:opacity-0 lg:pointer-events-none",
                isExiting ? exitCls : "translate-x-0 opacity-100",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="w-full h-full flex flex-col lg:flex-row items-center px-5 sm:px-0 pt-9 sm:pt-12 lg:pt-14 pb-7 sm:pb-10 lg:pb-16 gap-6 sm:gap-8 lg:gap-8">
                {/* LEFT — text */}
                <div className="w-full lg:w-[50%] flex flex-col items-center lg:items-start">
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

                  <h1 className="text-[21px] sm:text-[31px] lg:text-[38px] xl:text-[44px] font-bold leading-[1.22] text-white text-center lg:text-left mb-3 sm:mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                    <SlideTitle title={slide.title} accent={slide.titleAccent} />
                  </h1>

                  <p className="text-white/60 leading-relaxed text-[12px] sm:text-[14px] lg:text-[15px] text-center lg:text-left max-w-[310px] sm:max-w-lg mx-auto lg:mx-0 mb-5 sm:mb-7 line-clamp-3 sm:line-clamp-none drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
                    {slide.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto justify-center lg:justify-start">
                    <Link href={slide.primaryBtn.href} className="w-full sm:w-auto">
                      <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold cursor-pointer px-5 py-3 sm:px-7 sm:py-3 text-[13px] sm:text-[14px] lg:text-[15px] rounded-xl transition-all duration-300 shadow-lg shadow-amber-900/40 hover:scale-105 hover:shadow-amber-500/40">
                        {slide.primaryBtn.label}
                      </button>
                    </Link>
                    <Link href={slide.secondaryBtn.href} className="w-full sm:w-auto">
                      <button className="w-full border border-white/25 text-white/85 font-medium cursor-pointer px-5 py-3 sm:px-6 sm:py-3 text-[13px] sm:text-[14px] lg:text-[15px] rounded-xl bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:scale-105">
                        {slide.secondaryBtn.label}
                      </button>
                    </Link>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-[50%] flex items-center justify-center lg:justify-center">
                  <RightPanel type={slide.right} />
                </div>
              </div>
            </div>
          );
        })}

        {/* Dots */}
        <div className="relative lg:absolute lg:bottom-10 w-full flex justify-center gap-2 z-20 pt-3 pb-5 lg:pt-0 lg:pb-0">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === visible ? "w-7 bg-amber-600" : "w-2 bg-white/20 hover:bg-white/45"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}