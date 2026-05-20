"use client";
// HeroSlider.tsx — CLIENT COMPONENT

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  useReducer,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { STARS } from "@/lib/util";
import { h1 } from "@/data/tailwind-utils";
import {
  type Slide,
  type RightKey,
  eyebrowMap,
  EXAMS,
  FEATURES,
  MENTOR_DATA,
} from "../data/hero-data";
import { Socials } from "./SocialButtons";
import { MockTestCard } from "./Mocktestcard";

// ─── StarField ──────────────────────────────────────
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

// // ─── PlatformPanel ──────────────────────────────────
// const PlatformPanel = memo(function PlatformPanel() {
//   return (
//     <div className="w-full flex lg:justify-end justify-center select-none">
//       <div
//         className="w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[380px] xl:max-w-[400px] rounded-2xl shadow-xl shadow-white/20 bg-white/8"
//         style={{ border: "0.5px solid rgba(255,255,255,0.08)", padding: 20 }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//             marginBottom: 18,
//             paddingBottom: 16,
//             borderBottom: "0.5px solid rgba(255,255,255,0.07)",
//           }}
//         >
//           <div
//             style={{
//               width: 40,
//               height: 40,
//               borderRadius: 10,
//               background: "#1a1200",
//               border: "1px solid rgba(245,158,11,0.5)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexShrink: 0,
//             }}
//           >
//             <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
//               <circle
//                 cx="12"
//                 cy="12"
//                 r="9"
//                 stroke="#f59e0b"
//                 strokeWidth="1.5"
//               />
//               <path
//                 d="M8 12 L11 15 L16 9"
//                 stroke="#f59e0b"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//           <div className="flex flex-col">
//             <div className="text-[15px] font-bold tracking-wider text-amber-500">
//               CRACKORA
//             </div>
//             <div className="text-sm text-stone-300 mt-1">
//               Entrance · College · Career
//             </div>
//           </div>
//           <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
//             {[
//               { num: "6+", lbl: "Exams" },
//               { num: "Free", lbl: "Tools" },
//             ].map(({ num, lbl }) => (
//               <div
//                 key={lbl}
//                 className="flex flex-col justify-center items-center border border-amber-500/20"
//                 style={{
//                   background: "rgba(245,158,11,0.07)",
//                   borderRadius: 8,
//                   padding: "6px 10px",
//                 }}
//               >
//                 <div className="text-[15px] font-bold text-amber-500">
//                   {num}
//                 </div>
//                 <div className="text-xs text-stone-400">{lbl}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="text-[15px] font-bold mb-5 text-stone-400">
//           Exams covered
//         </div>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//             gap: 6,
//             marginBottom: 16,
//           }}
//         >
//           {EXAMS.map(({ label }) => (
//             <div
//               key={label}
//               className="text-amber-400 border border-amber-500/30 rounded-xl p-4 text-xs font-bold flex justify-center items-center text-center shadow bg-amber-50/5"
//             >
//               {label}
//             </div>
//           ))}
//         </div>

//         <div
//           style={{
//             height: "0.5px",
//             background: "rgba(255,255,255,0.06)",
//             margin: "16px 0",
//           }}
//         />

//         <div className="text-sm text-stone-400 font-bold mb-5">
//           What you get — free
//         </div>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
//             gap: 6,
//           }}
//         >
//           {FEATURES.map((f) => (
//             <div
//               key={f.title}
//               className="rounded-xl border border-cyan-400/15 bg-cyan-500/[0.03] p-3 transition-all duration-300 hover:bg-cyan-500/[0.06]"
//             >
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="w-2 h-2 rounded-full bg-cyan-400" />
//                 <h4 className="text-sm font-semibold text-white">{f.title}</h4>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// });

// ─── MentorCard ─────────────────────────────────────
// Matches the card design from the reference images:
// teal/dark header band with LIVE SESSION badge + program title,
// white body with feature checklist, photo on right, book now CTA.
const MentorCard = memo(function MentorCard({
  name,
  role,
  photoSrc,
  photoAlt,
  programTitle,
  programSubtitle,
  features,
  validity,
  bookHref,
  badge,
  price,
  originalPrice,
  discount,
  sessionDuration,
}: {
  name: string;
  role: string;
  photoSrc: string;
  photoAlt: string;
  programTitle: string;
  programSubtitle: string;
  features: readonly string[];
  validity: string;
  bookHref: string;
  badge?: string;
  price: string;
  originalPrice: string;
  discount: string;
  sessionDuration: string;
}) {
  return (
    <div className="w-full flex lg:justify-end justify-center select-none">
      <div className="w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[380px] xl:max-w-[400px] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">

        {/* ── Header band (teal-dark, matches reference images) ── */}
        <div
          className="relative px-4 pt-4 pb-5"
          style={{
            background: "linear-gradient(135deg, #0d3d4f 0%, #0a2a38 60%, #071e2a 100%)",
          }}
        >
          {/* LIVE SESSION badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#ff4d4d" }}
              />
              LIVE SESSION
            </span>
          </div>

          {/* Program title + photo side by side */}
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="text-white font-extrabold text-[15px] sm:text-[16px] leading-snug uppercase tracking-wide">
                {programTitle}:{" "}
                <span style={{ color: "#fbbf24" }}>{programSubtitle}</span>
              </h3>
              {badge && (
                <span
                  className="inline-block mt-2 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border"
                  style={{
                    background: "rgba(251,191,36,0.12)",
                    borderColor: "rgba(251,191,36,0.4)",
                    color: "#fbbf24",
                  }}
                >
                  {badge}
                </span>
              )}
            </div>

            {/* Photo placeholder / actual image */}
            <div
              className="shrink-0 rounded-xl overflow-hidden"
              style={{
                width: 80,
                height: 90,
                border: "2.5px solid #f59e0b",
                background: "rgba(255,255,255,0.07)",
                position: "relative",
              }}
            >
              {/* Placeholder silhouette shown when image not yet present */}
              <div
                className="absolute inset-0 flex items-end justify-center"
                style={{ background: "rgba(245,158,11,0.08)" }}
              >
                <svg
                  width="52"
                  height="64"
                  viewBox="0 0 52 64"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="26" cy="18" r="14" fill="rgba(245,158,11,0.25)" />
                  <ellipse
                    cx="26"
                    cy="54"
                    rx="22"
                    ry="16"
                    fill="rgba(245,158,11,0.18)"
                  />
                </svg>
              </div>
              <Image
                src={photoSrc}
                alt={photoAlt}
                fill
                className="object-cover object-top"
                // Show nothing if the image 404s; the silhouette stays visible
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        </div>

        {/* ── White body ── */}
        <div className="bg-white px-4 pt-4 pb-5">

          {/* Mentor name + role */}
          <div className="flex items-center gap-2 mb-3">
            <div>
              <p className="text-gray-900 font-bold text-[15px] leading-tight">
                {name}
              </p>
              <p className="text-gray-500 text-[12px]">{role}</p>
            </div>
          </div>

          {/* Features */}
          <p className="text-gray-700 font-semibold text-[13px] mb-2">
            Features
          </p>
          <ul className="space-y-1.5 mb-4">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                {/* Amber circle-check icon matching images */}
                <svg
                  className="shrink-0 mt-[2px]"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <circle cx="7.5" cy="7.5" r="7.5" fill="#f59e0b" />
                  <path
                    d="M4.5 7.5 L6.5 9.5 L10.5 5.5"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-gray-700 text-[13px] leading-snug">
                  {f}
                </span>
              </li>
            ))}
          </ul>

          {/* Validity */}
          <div className="flex items-center gap-1.5 mb-4 text-gray-500 text-[12px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="#9ca3af"
                strokeWidth="1.5"
              />
              <path
                d="M12 7v5l3 3"
                stroke="#9ca3af"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {validity}
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-gray-400 text-lg line-through">
                {originalPrice}
              </span>
              <span className="text-amber-600 text-2xl font-bold">{price}</span>
              <span className="text-gray-400 text-sm">/ session</span>
            </div>
            <span className="text-xs text-green-700 border border-green-200 bg-green-50 px-2 py-0.5 rounded-full font-bold">
              {discount}
            </span>
          </div>

          {/* Book now CTA */}
          <Link href={bookHref} target="_blank">
            <button className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-2.5 rounded-xl text-[14px] transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 cursor-pointer">
              Book Now →
            </button>
          </Link>
          <p className="text-center text-gray-400 text-[11px] mt-1.5">
            {sessionDuration}
          </p>
        </div>
      </div>
    </div>
  );
});

// ─── RightPanel ─────────────────────────────────────
const RightPanel = memo(function RightPanel({ type }: { type: RightKey }) {
  if (type === "orbit") return <MockTestCard />;
  if (type === "college-mentor") return <MentorCard {...MENTOR_DATA.college} />;
  if (type === "guidance-mentor") return <MentorCard {...MENTOR_DATA.guidance} />;
  return null;
});

// ─── SlideTitle ─────────────────────────────────────
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

// ─── Slide reducer ──────────────────────────────────
type SlideState = {
  visible: number;
  exiting: number | null;
  dir: "left" | "right";
};
type SlideAction = { type: "GO"; next: number } | { type: "CLEAR_EXIT" };

function slideReducer(state: SlideState, action: SlideAction): SlideState {
  switch (action.type) {
    case "GO":
      return {
        visible: action.next,
        exiting: state.visible,
        dir: action.next > state.visible ? "left" : "right",
      };
    case "CLEAR_EXIT":
      return { ...state, exiting: null };
    default:
      return state;
  }
}

// ─── useInterval ────────────────────────────────────
function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  const idRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reset = useCallback(() => {
    if (idRef.current) clearInterval(idRef.current);
    idRef.current = setInterval(() => savedCallback.current(), delay);
  }, [delay]);
  useEffect(() => {
    reset();
    return () => {
      if (idRef.current) clearInterval(idRef.current);
    };
  }, [reset]);
  return reset;
}

// ─── HeroSlider (main export) ────────────────────────
export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [state, dispatch] = useReducer(slideReducer, {
    visible: 0,
    exiting: null,
    dir: "left",
  });
  const { visible, exiting, dir } = state;

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    let raf: number;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (next: number) => {
      if (next === visible) return;
      if (isMobile) {
        dispatch({ type: "GO", next });
        dispatch({ type: "CLEAR_EXIT" });
        return;
      }
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
      dispatch({ type: "GO", next });
      exitTimeoutRef.current = setTimeout(
        () => dispatch({ type: "CLEAR_EXIT" }),
        1500,
      );
    },
    [visible, isMobile],
  );

  const advance = useCallback(
    () => goTo((visible + 1) % slides.length),
    [visible, goTo, slides.length],
  );
  const resetTimer = useInterval(advance, 5000);

  const handleDot = useCallback(
    (i: number) => {
      goTo(i);
      resetTimer();
    },
    [goTo, resetTimer],
  );

  const exitCls =
    dir === "left"
      ? "-translate-x-12 opacity-0 pointer-events-none"
      : "translate-x-12 opacity-0 pointer-events-none";

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4">
      <StarField />

      <div className="relative lg:min-h-screen">
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
                "transition-[transform,opacity] duration-420 ease-in-out",
                "will-change-[transform,opacity]",
                isExiting ? exitCls : "translate-x-0 opacity-100",
              ].join(" ")}
            >
              <div className="w-full h-full flex flex-col lg:flex-row lg:items-center pt-15 sm:pt-15 lg:pt-12 pb-6 sm:pb-8 lg:pb-14 gap-6 lg:gap-10 xl:gap-14">
                {/* LEFT */}
                <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-semibold tracking-wider uppercase mb-3 backdrop-blur-sm ${eb.cls}`}
                  >
                    {eb.label}
                  </span>

                  <h1
                    className={`${h1.lg} ${h1.sm} ${h1.default} font-bold leading-tight text-white text-center lg:text-left mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]`}
                  >
                    <SlideTitle
                      title={slide.title}
                      accent={slide.titleAccent}
                    />
                  </h1>

                  <p className="text-amber-50 leading-relaxed text-center lg:text-left max-w-[310px] sm:max-w-md lg:max-w-none my-5 line-clamp-3 sm:line-clamp-none drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
                    {slide.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto justify-center lg:justify-start">
                    <Link
                      href={slide.primaryBtn.href}
                      className="w-full sm:w-auto"
                      target="_blank"
                    >
                      <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold cursor-pointer px-5 py-2.5 text-[12px] sm:text-[13px] xl:text-[17px] rounded-xl transition-all duration-300 shadow-lg shadow-amber-900/40 hover:scale-105 hover:shadow-amber-500/40">
                        {slide.primaryBtn.label}
                      </button>
                    </Link>
                    <Link
                      href={slide.secondaryBtn.href}
                      className="w-full sm:w-auto"
                      target="_blank"
                    >
                      <button className="w-full border border-white/25 text-white/85 font-medium cursor-pointer px-5 py-2.5 text-[12px] sm:text-[13px] xl:text-sm rounded-xl bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:scale-105">
                        {slide.secondaryBtn.label}
                      </button>
                    </Link>
                  </div>
                  <div className="mt-8"></div>
                  <Socials />
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-[45%] flex items-center justify-center lg:justify-end">
                  <RightPanel type={slide.right} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dot navigation */}
      <div className="relative lg:absolute lg:bottom-5 lg:left-0 lg:right-0 w-full flex justify-center gap-2 z-20 pb-5 lg:pb-0">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              i === visible
                ? "w-6 bg-amber-600"
                : "w-2 bg-white/20 hover:bg-white/45"
            }`}
          />
        ))}
      </div>
    </div>
  );
}