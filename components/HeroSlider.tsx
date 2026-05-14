"use client";
// HeroSlider.tsx — CLIENT COMPONENT
//
// "use client" is here because this file uses:
//   - useReducer (slide state)
//   - useEffect (resize listener, canvas draw, exit timeout)
//   - useRef (canvas, interval, timeout)
//   - useCallback (memoised handlers)
//   - useState (isMobile)
//
// Everything else (outer wrapper, backgrounds) stayed in the server component.
// This boundary means only THIS subtree is hydrated in the browser.

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

// ─── StarField ──────────────────────────────────────
// Canvas needs useEffect + useRef → must be client.
// But it's memo'd so it only re-renders on unmount/mount.
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

// ─── PlatformPanel ──────────────────────────────────
// No hooks — but it's a child of a "use client" file,
// so it implicitly runs on the client. It could also be
// extracted to its own server component if you import it
// differently (via children prop pattern).
const PlatformPanel = memo(function PlatformPanel() {
  return (
    <div className="w-full flex lg:justify-end justify-center select-none">
      <div
        className="w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[380px] xl:max-w-[400px] rounded-2xl shadow-xl shadow-white/20 bg-white/8"
        style={{ border: "0.5px solid rgba(255,255,255,0.08)", padding: 20 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
            paddingBottom: 16,
            borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "#1a1200",
              border: "1px solid rgba(245,158,11,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <path
                d="M8 12 L11 15 L16 9"
                stroke="#f59e0b"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="text-[15px] font-bold tracking-wider text-amber-500">
              CRACKORA
            </div>
            <div className="text-sm text-stone-300 mt-1">
              Entrance · College · Career
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            {[
              { num: "6+", lbl: "Exams" },
              { num: "Free", lbl: "Tools" },
            ].map(({ num, lbl }) => (
              <div
                key={lbl}
                className="flex flex-col justify-center items-center border border-amber-500/20"
                style={{
                  background: "rgba(245,158,11,0.07)",
                  borderRadius: 8,
                  padding: "6px 10px",
                }}
              >
                <div className="text-[15px] font-bold text-amber-500">
                  {num}
                </div>
                <div className="text-xs text-stone-400">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[15px] font-bold mb-5 text-stone-400">
          Exams covered
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 6,
            marginBottom: 16,
          }}
        >
          {EXAMS.map(({ label }) => (
            <div
              key={label}
              className="text-amber-400 border border-amber-500/30 rounded-xl p-4 text-xs font-bold flex justify-center items-center text-center shadow bg-amber-50/5"
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            height: "0.5px",
            background: "rgba(255,255,255,0.06)",
            margin: "16px 0",
          }}
        />

        <div className="text-sm text-stone-400 font-bold mb-5">
          What you get — free
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 6,
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="
      rounded-xl
      border border-cyan-400/15
      bg-cyan-500/[0.03]
      p-3
      transition-all duration-300
      hover:bg-cyan-500/[0.06]
    "
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />

                <h4 className="text-sm font-semibold text-white">{f.title}</h4>
              </div>

              {/* <p className="text-[12px] leading-relaxed text-white/60">
                {f.desc}
              </p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ─── MentorCard ─────────────────────────────────────
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
  features: readonly string[];
  bookHref: string;
  badge?: string;
}) {
  return (
    <div className="w-full max-w-85 lg:max-w-100">
      <div className="rounded-2xl bg-[#f8f7f4] shadow-2xl shadow-black/50 overflow-hidden">
        <div className="h-0.5 bg-linear-to-r from-amber-500 to-amber-400" />
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="relative shrink-0">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 z-0" />
              <div className="absolute -inset-1 rounded-full bg-amber-500/20 z-[-1]" />
              <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 lg:w-40 lg:h-40 xl:w-30 xl:h-30 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={photoSrc}
                  alt={photoAlt}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="absolute bottom-0 right-0 z-20 w-4 h-4 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
                <svg
                  className="w-2 h-2 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 font-bold text-xl leading-tight">
                {name}
              </h3>
              <p className="text-gray-500 text-[13px] mt-0.5 leading-snug">
                {role}
              </p>
              {badge && (
                <span className="inline-block mt-1 text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  {badge}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mb-3.5">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-1.5">
                <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-gray-600 text-[14px] sm:text-[13.5px] leading-snug">
                  {f}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-gray-100 mb-3" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-1">
              <span className="text-gray-400 text-2xl line-through">₹599</span>
              <span className="text-amber-600 text-3xl font-bold">₹249</span>
              <span className="text-gray-400 text-xl">/ session</span>
            </div>
            <span className="text-md text-green-700 border border-green-200 bg-green-50 px-2 py-0.5 rounded-full font-bold">
              58% OFF
            </span>
          </div>

          <Link href={bookHref}>
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 rounded-xl text-md transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 cursor-pointer">
              Book 1-on-1 Session →
            </button>
          </Link>
          <p className="text-center text-gray-400 text-md mt-1.5">
            45 min · Limited slots · Offer ends soon
          </p>
        </div>
      </div>
    </div>
  );
});

// ─── RightPanel ─────────────────────────────────────
const RightPanel = memo(function RightPanel({ type }: { type: RightKey }) {
  if (type === "orbit") return <PlatformPanel />;
  if (type === "college-mentor") return <MentorCard {...MENTOR_DATA.college} />;
  if (type === "guidance-mentor")
    return <MentorCard {...MENTOR_DATA.guidance} />;
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
// This is the ONLY export from this file.
// The server component (HeroBanner.tsx) imports only this.
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
      {/* StarField — canvas needs client, lives here */}
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
