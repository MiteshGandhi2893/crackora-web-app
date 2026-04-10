"use client";

import { STARS } from "@/lib/util";
import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  useReducer,
} from "react";

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
   Orbit constants (unchanged from original)
───────────────────────────────────────────────────── */
const CX = 210, CY = 210;
const R_OUTER = 175;
const R_MIDDLE = 100;

const polar = (angleDeg: number, r: number) => ({
  x: CX + r * Math.cos((angleDeg * Math.PI) / 180),
  y: CY + r * Math.sin((angleDeg * Math.PI) / 180),
});

const OUTER_ITEMS = [
  "NIMCET", "MAH MCA CET", "CUET PG MCA", "TANCET", "IPU CET MCA", "WB JECA",
].map((label, i) => ({ label, ...polar(-90 + i * 60, R_OUTER) }));

const MIDDLE_ITEMS = [
  "Mock Tests", "Doubt Solving", "Study Planner", "Analytics", "Career Guide", "PYQ Bank",
].map((label, i) => ({ label, ...polar(-60 + i * 60, R_MIDDLE) }));

const OrbitBubble = memo(function OrbitBubble({
  x, y, label, tier,
}: { x: number; y: number; label: string; tier: "outer" | "middle" }) {
  const cfg = {
    outer: { r: 28, bg: "#B46309", border: "rgba(251,200,36,0.68)", glow: "rgba(245,150,11,0.22)", glowR: 30, textCol: "#fff", ts: 9.0, sw: 1.2 },
    middle: { r: 25, bg: "#164E63", border: "rgba(103,232,249,0.58)", glow: "rgba(6,182,212,0.18)", glowR: 28, textCol: "#fff", ts: 9, sw: 1.0 },
  };
  const c = cfg[tier];
  const words = label.split(" ");
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const line2 = words.length > 1 ? words.slice(Math.ceil(words.length / 2)).join(" ") : "";
  return (
    <g>
      <circle cx={x} cy={y} r={c.glowR} fill={c.glow} />
      <circle cx={x} cy={y} r={c.r} fill={c.bg} stroke={c.border} strokeWidth={c.sw} />
      {line2 ? (
        <>
          <text x={x} y={y - 4.5} textAnchor="middle" dominantBaseline="central" fill={c.textCol} fontSize={c.ts} fontWeight="700" fontFamily="system-ui,sans-serif">{line1}</text>
          <text x={x} y={y + 5.5} textAnchor="middle" dominantBaseline="central" fill={c.textCol} fontSize={c.ts} fontWeight="700" fontFamily="system-ui,sans-serif">{line2}</text>
        </>
      ) : (
        <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={c.textCol} fontSize={c.ts} fontWeight="700" fontFamily="system-ui,sans-serif">{line1}</text>
      )}
    </g>
  );
});

const ThreeRingOrbit = memo(function ThreeRingOrbit() {
  return (
    <div className="w-full flex items-center justify-center select-none">
      <div className="w-[310px] h-[310px] sm:w-[370px] sm:h-[370px] md:w-[415px] md:h-[415px] lg:w-[455px] lg:h-[455px]">
        <svg viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
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
          <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="rgba(251,191,36,0.38)" strokeWidth={1} strokeDasharray="5 7" filter="url(#rg)" />
          <circle cx={CX} cy={CY} r={R_MIDDLE} fill="none" stroke="rgba(103,232,249,0.32)" strokeWidth={0.9} strokeDasharray="4 6" filter="url(#rg)" />
          {OUTER_ITEMS.map(({ x, y, label }) => (
            <line key={`cl${label}`} x1={CX + (x - CX) * 0.86} y1={CY + (y - CY) * 0.86} x2={x} y2={y} stroke="rgba(251,191,36,0.09)" strokeWidth={0.6} />
          ))}
          <circle cx={CX} cy={CY} r={64} fill="url(#cg)" />
          <circle cx={CX} cy={CY} r={43} fill="url(#pg)" stroke="rgba(251,191,36,0.55)" />
          <image href="/vertical-logo.svg" x={CX - 22} y={CY - 26} width={50} height={50} preserveAspectRatio="xMidYMid meet" />
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
   MentorCard — beautiful photo + pricing card
───────────────────────────────────────────────────── */
const MentorCard = memo(function MentorCard({
  name,
  role,
  photoSrc,
  photoAlt,
  features,
  bookHref,
  badge,
}: {
  name: string;
  role: string;
  photoSrc: string;
  photoAlt: string;
  features: string[];
  bookHref: string;
  badge?: string;
}) {
  return (
    <div className="w-full max-w-[340px] sm:max-w-[390px] lg:max-w-[420px] mx-auto lg:mx-0 lg:ml-auto">
      <div className="rounded-2xl bg-[#f8f7f4] shadow-2xl shadow-black/50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-400" />

        <div className="p-4 sm:p-5 lg:p-6">
          {/* Mentor identity row */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            {/* Photo container */}
            <div className="relative shrink-0">
              {/* Decorative ring */}
              <div className="absolute -inset-0.75 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 z-0" />
              <div className="absolute -inset-[6px] rounded-full bg-amber-500/20 z-[-1]" />
              <div className="relative z-10 w-30 h-30 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={photoSrc}
                  alt={photoAlt}
                  fill
                  className="object-cover object-center"
                />
              </div>
              {/* Verified dot */}
              <div className="absolute bottom-0 right-0 z-20 w-4 h-4 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 font-bold text-[15px] sm:text-[17px] leading-tight">{name}</h3>
              <p className="text-gray-500 text-[11px] sm:text-[12px] mt-0.5 leading-snug">{role}</p>
              {badge && (
                <span className="inline-block mt-1 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  {badge}
                </span>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-2 mb-4">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-1.5">
                <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-gray-600 text-[10px] sm:text-[11px] lg:text-[12px] leading-snug">{f}</span>
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-gray-100 mb-3 sm:mb-4" />

          {/* Pricing */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-gray-400 text-xs line-through">₹599</span>
              <span className="text-amber-600 text-2xl sm:text-3xl font-bold">249</span>
              <span className="text-gray-400 text-xs">/ session</span>
            </div>
            <span className="text-[11px] text-green-700 border border-green-200 bg-green-50 px-2.5 py-1 rounded-full font-bold">
              50% OFF
            </span>
          </div>

          <Link href={bookHref}>
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2.5 rounded-xl text-[13px] sm:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 cursor-pointer">
              Book 1-on-1 Session →
            </button>
          </Link>
          <p className="text-center text-gray-400 text-[10px] sm:text-[11px] mt-2">45 min · Limited slots · Offer ends soon</p>
        </div>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────
   WebinarCTACard — teaser card linking to /webinar
───────────────────────────────────────────────────── */
const WebinarCTACard = memo(function WebinarCTACard() {
  const topics = [
    "What MCA really is",
    "Who should & shouldn't do MCA",
    "Top 5 student mistakes",
    "Live Q&A with mentors",
  ];
  return (
    <div className="w-full max-w-[340px] sm:max-w-[390px] lg:max-w-[420px] mx-auto lg:mx-0 lg:ml-auto">
      <div className="rounded-2xl bg-[#f8f7f4] shadow-2xl shadow-black/50 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-400" />
        <div className="p-4 sm:p-5 lg:p-6">
          {/* Live badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="text-red-600 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">Upcoming — Free Webinar</span>
          </div>

          <h2 className="text-gray-900 text-[18px] sm:text-xl font-bold leading-tight mb-1">
            MCA Masterclass
            <span className="block text-amber-600 text-[15px] sm:text-[17px] font-semibold mt-0.5">Everything You Need to Know</span>
          </h2>

          {/* Date + time */}
          <div className="flex flex-wrap gap-2 mt-2.5 mb-3">
            {[{ icon: "📅", t: "Sunday, 15 Feb" }, { icon: "⏰", t: "11:00 AM IST" }, { icon: "🖥️", t: "Google Meet" }].map((c) => (
              <span key={c.t} className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                {c.icon} {c.t}
              </span>
            ))}
          </div>

          <div className="space-y-1.5 mb-4">
            {topics.map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="text-amber-500 text-[11px]">✓</span>
                <span className="text-gray-600 text-[11px] sm:text-[12px]">{t}</span>
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-gray-100 mb-3" />

          <Link href="/webinar">
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2.5 rounded-xl text-[13px] sm:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 cursor-pointer">
              Register Free — Seats Limited →
            </button>
          </Link>
          <p className="text-center text-gray-400 text-[10px] sm:text-[11px] mt-2">No cost · 90 min · Ask doubts live</p>
        </div>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────
   Slide definitions
───────────────────────────────────────────────────── */
const slides = [
  // ── COMMENTED OUT: Live Batch slide ──
  // {
  //   id: "batch",
  //   eyebrow: "live" as const,
  //   title: "NIMCET 2027 — Live Batch Now Open",
  //   titleAccent: "Live Batch",
  //   description: "India's most focused MCA entrance prep...",
  //   primaryBtn: { label: "Enroll Now — ₹999/month", href: "/live-classes" },
  //   secondaryBtn: { label: "View Schedule", href: "/live-classes#schedule" },
  //   right: "batch" as const,
  // },

  // ── Slide 1: Platform (keep as-is) ──
  {
    id: "platform",
    eyebrow: "platform" as const,
    title: "Your MCA Journey Starts Here — Entrance to Employment",
    titleAccent: "Starts Here",
    description:
      "From cracking NIMCET and MAH MCA CET to landing your first ₹8–18 LPA tech role — Crackora guides you through every step. Mock tests, college predictor, career roadmap. All free.",
    primaryBtn: { label: "Explore Free Tools", href: "/tools/college" },
    secondaryBtn: { label: "Start Free Mock Test", href: "https://learn.crackora.com/learn/Free-MAH-MCA-CET-2026-Mock-Test" },
    right: "orbit" as const,
  },

  // ── Slide 2: College Selection 1-on-1 (Azad Sir) ──
  {
    id: "college-selection",
    eyebrow: "session" as const,
    title: "Pick the Right College — Before It's Too Late",
    titleAccent: "Right College",
    description:
      "One wrong college choice can cost you 2 years and ₹4–10 lakhs. In a 45-minute session with Azad Sir, get a ranked shortlist built around your score, budget, and career goal — so you apply with confidence, not guesswork.",
    primaryBtn: { label: "Book for 249 — 58% Off →", href: "https://learn.crackora.com/learn/fast-checkout/264886?priceId=260251&cpst=1775810584196" },
    secondaryBtn: { label: "See What's Covered", href: "https://learn.crackora.com/learn/MCA-Counselling-Program--1-1-College-Guidance" },
    right: "college-mentor" as const,
  },

  // ── Slide 3: MCA Guidance 1-on-1 (Mitesh Gandhi) ──
  {
    id: "mca-guidance",
    eyebrow: "session" as const,
    title: "Not Sure About MCA? Get Honest Guidance",
    titleAccent: "Honest Guidance",
    description:
      "Should you do MCA or MTech? Which specialisation fits your goals? Which exam to target? Mitesh Gandhi will cut through the noise and give you a clear, personalised roadmap — no sales pitch, just clarity.",
    primaryBtn: { label: "Book for 249 — 58% Off →", href: "https://learn.crackora.com/learn/fast-checkout/264897?priceId=260255&cpst=1775810143484" },
    secondaryBtn: { label: "See What's Covered", href: "https://learn.crackora.com/learn/MCA-Success-Blueprint--1-to-1-Career-Mentorship-Program" },
    right: "guidance-mentor" as const,
  },

  // // ── Slide 4: Free Webinar CTA ──
  // {
  //   id: "webinar",
  //   eyebrow: "webinar" as const,
  //   title: "Free Live Webinar — MCA Masterclass",
  //   titleAccent: "MCA Masterclass",
  //   description:
  //     "90 minutes. Everything about MCA — what it is, who should do it, biggest student mistakes, which entrance exam suits you, and live Q&A. Free, no recording sold. Register before seats fill up.",
  //   primaryBtn: { label: "Register Free — Limited Seats →", href: "/webinar" },
  //   secondaryBtn: { label: "See What We'll Cover", href: "/webinar#topics" },
  //   right: "webinar-cta" as const,
  // },
] as const;

type EyebrowKey = (typeof slides)[number]["eyebrow"];
type RightKey = (typeof slides)[number]["right"];

const eyebrowMap: Record<EyebrowKey, { cls: string; label: string; dot?: string }> = {
  platform: { cls: "border-amber-400/60 bg-amber-950/60 text-amber-300", label: "India's #1 MCA End-to-End Platform" },
  session: { cls: "border-cyan-400/60 bg-cyan-950/60 text-cyan-300", label: "1-on-1 Session · Limited Slots" },
  // webinar: { cls: "border-red-400/60 bg-red-950/60 text-red-300", label: "Upcoming Free Webinar", dot: "red" },
};

/* ─────────────────────────────────────────────────────
   SlideTitle
───────────────────────────────────────────────────── */
const SlideTitle = memo(function SlideTitle({ title, accent }: { title: string; accent: string }) {
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
   RightPanel
───────────────────────────────────────────────────── */
const RightPanel = memo(function RightPanel({ type }: { type: RightKey }) {
  if (type === "orbit") {
    return (
      <div className="w-full flex justify-center mt-4 sm:mt-6 lg:mt-0">
        <ThreeRingOrbit />
      </div>
    );
  }
  if (type === "college-mentor") {
    return (
      <MentorCard
        name="Azad Sir"
        role="MCA College Selection Expert · 6+ yrs mentoring"
        photoSrc="/Azad.jpeg"
        photoAlt="Azad Sir"
        badge="Top Rated Mentor"
        features={[
          "Personalised college shortlist",
          "Score vs cutoff analysis",
          "Budget & ROI guidance",
          "NIT / IIIT vs private colleges",
          "Placement record deep-dive",
          "Application strategy",
        ]}
        bookHref="/book/college-selection"
      />
    );
  }
  if (type === "guidance-mentor") {
    return (
      <MentorCard
        name="Mitesh Gandhi"
        role="MCA Career Counsellor · BCA → MCA pathway expert"
        photoSrc="/Mitesh.jpeg"
        photoAlt="Mitesh Gandhi"
        badge="Career Clarity Expert"
        features={[
          "MCA vs MTech comparison",
          "Right specialisation for you",
          "Exam selection strategy",
          "Study roadmap (0 to D-day)",
          "College tier planning",
          "Post-MCA career paths",
        ]}
        bookHref="/book/mca-guidance"
      />
    );
  }
  if (type === "webinar-cta") {
    return <WebinarCTACard />;
  }
  return null;
});

/* ─────────────────────────────────────────────────────
   Slide state reducer
───────────────────────────────────────────────────── */
type SlideState = { visible: number; exiting: number | null; dir: "left" | "right" };
type SlideAction = { type: "GO"; next: number } | { type: "CLEAR_EXIT" };

function slideReducer(state: SlideState, action: SlideAction): SlideState {
  switch (action.type) {
    case "GO":
      return { visible: action.next, exiting: state.visible, dir: action.next > state.visible ? "left" : "right" };
    case "CLEAR_EXIT":
      return { ...state, exiting: null };
    default:
      return state;
  }
}

/* ─────────────────────────────────────────────────────
   useInterval
───────────────────────────────────────────────────── */
function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  const idRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reset = useCallback(() => {
    if (idRef.current) clearInterval(idRef.current);
    idRef.current = setInterval(() => savedCallback.current(), delay);
  }, [delay]);
  useEffect(() => {
    reset();
    return () => { if (idRef.current) clearInterval(idRef.current); };
  }, [reset]);
  return reset;
}

/* ─────────────────────────────────────────────────────
   HeroBanner
───────────────────────────────────────────────────── */
export function HeroBanner() {
  const [state, dispatch] = useReducer(slideReducer, { visible: 0, exiting: null, dir: "left" });
  const { visible, exiting, dir } = state;

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    let raf: number;
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(check); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);

  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((next: number) => {
    if (next === visible) return;
    if (isMobile) {
      dispatch({ type: "GO", next });
      dispatch({ type: "CLEAR_EXIT" });
      return;
    }
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    dispatch({ type: "GO", next });
    exitTimeoutRef.current = setTimeout(() => dispatch({ type: "CLEAR_EXIT" }), 1500);
  }, [visible, isMobile]);

  const advance = useCallback(() => {
    const next = (visible + 1) % slides.length;
    goTo(next);
  }, [visible, goTo]);

  const resetTimer = useInterval(advance, 6000);

  const handleDot = useCallback((i: number) => {
    goTo(i);
    resetTimer();
  }, [goTo, resetTimer]);

  const exitCls = dir === "left"
    ? "-translate-x-12 opacity-0 pointer-events-none"
    : "translate-x-12 opacity-0 pointer-events-none";

  return (
    <div className="relative w-full overflow-hidden mt-16 bg-[#020817]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <StarField />

      <div className="relative z-10 lg:min-h-150 max-w-6xl mx-auto lg:px-10 px-5">
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
                "transition-[transform,opacity] duration-[420ms] ease-in-out",
                "will-change-[transform,opacity]",
                isExiting ? exitCls : "translate-x-0 opacity-100",
              ].join(" ")}
            >
              <div className="w-full h-full flex flex-col lg:flex-row items-center px-5 sm:px-0 pt-9 sm:pt-12 lg:pt-14 pb-7 sm:pb-10 lg:pb-16 gap-6 sm:gap-8 lg:gap-8">
                {/* LEFT */}
                <div className="w-full lg:w-[50%] flex flex-col items-center lg:items-start">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase mb-3 sm:mb-4 backdrop-blur-sm ${eb.cls}`}>
                    {eb.dot === "red" && (
                      <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-400" />
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