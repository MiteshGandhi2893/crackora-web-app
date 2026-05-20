"use client";
// HeroSlider.tsx — CLIENT COMPONENT
//
// "use client" because this file uses:
//   - useReducer (slide state)
//   - useEffect  (resize listener, canvas stars, exit timeout)
//   - useRef     (canvas, interval, timeout)
//   - useCallback (memoised handlers)
//   - useState   (isMobile, activeSkill)
//
// Slide data and types live in hero-data.ts.
// SEO meta tags (seoTitle, seoDescription) must be injected by the
// parent server component — see Slide.seoTitle / Slide.seoDescription.

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
  JOURNEY_STEPS,
  SKILL_TRACKS,
  MENTOR_DATA,
} from "../data/hero-data";
import { Socials } from "./SocialButtons";

// ─────────────────────────────────────────────────────────────────────────────
// StarField
// Canvas draws static stars from STARS constant. Memo'd — only re-draws on
// mount/resize, never on slide transitions.
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// EntrancePanel — Slide 1 right panel
//
// Replaces the old "buttons and boxes" panel with a constellation/orbit
// diagram of the 6 MCA exams orbiting a central "Crackora" hub, plus a
// compact features grid. SVG orbit is purely decorative (aria-hidden).
// ─────────────────────────────────────────────────────────────────────────────
const EntrancePanel = memo(function EntrancePanel() {
  // 6 exams distributed on an ellipse, angled for visual interest
  // Center of SVG: cx=160, cy=152. Rx=118, Ry=92
  const orbitExams = [
    // angle in degrees, label, color
    { angle: -80,  label: "NIMCET",      color: "#f59e0b", sub: "NIT seats" },
    { angle: -10,  label: "MAH MCA CET", color: "#38bdf8", sub: "Maharashtra" },
    { angle: 50,   label: "CUET PG",     color: "#a78bfa", sub: "Central Uni" },
    { angle: 105,  label: "TANCET",      color: "#34d399", sub: "Tamil Nadu" },
    { angle: 170,  label: "IPU CET",     color: "#fb923c", sub: "Delhi" },
    { angle: 230,  label: "WB JECA",     color: "#f472b6", sub: "West Bengal" },
  ] as const;

  const cx = 160;
  const cy = 150;
  const rx = 115;
  const ry = 90;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const nodePoints = orbitExams.map((e) => ({
    ...e,
    x: cx + rx * Math.cos(toRad(e.angle)),
    y: cy + ry * Math.sin(toRad(e.angle)),
  }));

  return (
    <div className="w-full flex lg:justify-end justify-center select-none">
      <div
        className="w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[390px] xl:max-w-[410px] rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(255,255,255,0.09)",
          padding: 20,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
            paddingBottom: 14,
            borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#f59e0b" strokeWidth="1.5" />
              <path
                d="M8 12 L11 15 L16 9"
                stroke="#f59e0b"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-bold tracking-widest text-amber-400">
              CRACKORA
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              6 Exams · Free Tools · Real Guidance
            </div>
          </div>
          <div
            className="ml-auto text-right"
            style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}
          >
            <div className="text-[13px] font-bold text-white">10K+</div>
            <div>Students</div>
          </div>
        </div>

        {/* Orbit SVG — exam constellation */}
        <div className="relative" style={{ marginBottom: 14 }}>
          <svg
            width="100%"
            viewBox="0 0 320 302"
            aria-hidden="true"
            style={{ display: "block" }}
          >
            {/* Orbit ellipse */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Spoke lines from center to each node */}
            {nodePoints.map((n) => (
              <line
                key={n.label + "-spoke"}
                x1={cx}
                y1={cy}
                x2={n.x}
                y2={n.y}
                stroke={n.color}
                strokeWidth="0.6"
                strokeOpacity="0.25"
              />
            ))}

            {/* Center hub */}
            <circle cx={cx} cy={cy} r={28} fill="rgba(245,158,11,0.08)" />
            <circle
              cx={cx}
              cy={cy}
              r={28}
              fill="none"
              stroke="rgba(245,158,11,0.3)"
              strokeWidth="1"
            />
            <circle
              cx={cx}
              cy={cy}
              r={20}
              fill="rgba(245,158,11,0.12)"
            />
            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              fontSize="7"
              fontWeight="700"
              letterSpacing="1.2"
              fill="#f59e0b"
            >
              CRACK
            </text>
            <text
              x={cx}
              y={cy + 7}
              textAnchor="middle"
              fontSize="7"
              fontWeight="700"
              letterSpacing="1.2"
              fill="#f59e0b"
            >
              ORA
            </text>

            {/* Exam nodes */}
            {nodePoints.map((n) => {
              // node box: wider if label is longer
              const boxW = n.label.length > 8 ? 76 : 66;
              const boxH = 38;
              const bx = n.x - boxW / 2;
              const by = n.y - boxH / 2;
              return (
                <g key={n.label}>
                  {/* glow circle behind node */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={boxW / 2 + 4}
                    fill={n.color}
                    fillOpacity="0.05"
                  />
                  <rect
                    x={bx}
                    y={by}
                    width={boxW}
                    height={boxH}
                    rx="8"
                    fill="rgba(0,0,0,0.55)"
                    stroke={n.color}
                    strokeWidth="0.8"
                    strokeOpacity="0.7"
                  />
                  <text
                    x={n.x}
                    y={n.y - 4}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="700"
                    fill={n.color}
                  >
                    {n.label}
                  </text>
                  <text
                    x={n.x}
                    y={n.y + 8}
                    textAnchor="middle"
                    fontSize="7"
                    fill="rgba(255,255,255,0.45)"
                  >
                    {n.sub}
                  </text>
                </g>
              );
            })}

            {/* Stats on right side of SVG */}
            {[
              { val: "50+", lbl: "Mock Tests", y: 60 },
              { val: "1,285", lbl: "NIT Seats", y: 110 },
              { val: "Free", lbl: "All Tools", y: 160 },
              { val: "6", lbl: "Exams Covered", y: 210 },
            ].map(({ val, lbl, y }) => (
              <g key={lbl}>
                <rect
                  x={300 - 80}
                  y={y - 16}
                  width={78}
                  height={34}
                  rx="6"
                  fill="rgba(255,255,255,0.04)"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="0.5"
                />
                <text
                  x={300 - 41}
                  y={y + 1}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="#f59e0b"
                >
                  {val}
                </text>
                <text
                  x={300 - 41}
                  y={y + 12}
                  textAnchor="middle"
                  fontSize="7.5"
                  fill="rgba(255,255,255,0.4)"
                >
                  {lbl}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Features grid */}
        <div
          style={{
            height: "0.5px",
            background: "rgba(255,255,255,0.06)",
            marginBottom: 14,
          }}
        />
        <div className="text-[11px] text-stone-500 font-semibold tracking-wider uppercase mb-3">
          What you get — free
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 6,
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                background: "rgba(56,189,248,0.04)",
                border: "0.5px solid rgba(56,189,248,0.14)",
                borderRadius: 10,
                padding: "8px 6px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 14, marginBottom: 3 }}>{f.icon}</div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.2,
                }}
              >
                {f.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// JourneyPanel — Slide 2 right panel
//
// Vertical step-by-step timeline of the 6 MCA journey stages.
// Each step has a coloured dot, number, title, subtitle, and a live stat.
// ─────────────────────────────────────────────────────────────────────────────
const JourneyPanel = memo(function JourneyPanel() {
  const stats = ["BCA / BSc", "6 Exams", "40+ NITs", "2 Years", "4 Tracks", "₹4–10 LPA"];

  return (
    <div className="w-full flex lg:justify-end justify-center select-none">
      <div
        className="w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[390px] xl:max-w-[410px] rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(255,255,255,0.09)",
          padding: 20,
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: 18,
            paddingBottom: 14,
            borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="text-[13px] font-bold tracking-widest text-cyan-400 mb-1">
            THE MCA JOURNEY
          </div>
          <div className="text-[11px] text-stone-400">
            From eligibility check to your first job offer
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {JOURNEY_STEPS.map((step, idx) => (
            <div
              key={step.num}
              style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
            >
              {/* Left: dot + line */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  width: 28,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `${step.color}18`,
                    border: `1.5px solid ${step.color}60`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 800,
                    color: step.color,
                    flexShrink: 0,
                    letterSpacing: "0.04em",
                  }}
                >
                  {step.num}
                </div>
                {idx < JOURNEY_STEPS.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      height: 28,
                      background: `linear-gradient(to bottom, ${step.color}40, transparent)`,
                      margin: "3px 0",
                    }}
                  />
                )}
              </div>

              {/* Right: content */}
              <div
                style={{
                  flex: 1,
                  paddingBottom: idx < JOURNEY_STEPS.length - 1 ? 4 : 0,
                  paddingTop: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.88)",
                      lineHeight: 1.25,
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.38)",
                      marginTop: 2,
                    }}
                  >
                    {step.sub}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: step.color,
                    background: `${step.color}12`,
                    border: `0.5px solid ${step.color}30`,
                    borderRadius: 6,
                    padding: "3px 7px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {stats[idx]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: "0.5px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
            Free tools at every stage
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#38bdf8",
              background: "rgba(56,189,248,0.08)",
              border: "0.5px solid rgba(56,189,248,0.25)",
              borderRadius: 6,
              padding: "3px 8px",
            }}
          >
            10,000+ Students
          </div>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SkillsPanel — Slide 3 right panel
//
// 4 skill track cards (Full Stack, AI/ML, Cloud, Data Analytics).
// Shows salary, demand badge, and key tags. One card is "highlighted"
// on hover via state — defaults to AI/ML as the most sought-after.
// ─────────────────────────────────────────────────────────────────────────────
const SkillsPanel = memo(function SkillsPanel() {
  const [active, setActive] = useState<string>("aiml");

  return (
    <div className="w-full flex lg:justify-end justify-center select-none">
      <div
        className="w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[390px] xl:max-w-[410px] rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "0.5px solid rgba(255,255,255,0.09)",
          padding: 20,
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: 16,
            paddingBottom: 14,
            borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="text-[13px] font-bold tracking-widest text-violet-400 mb-1">
            SKILL TRACKS FOR MCA
          </div>
          <div className="text-[11px] text-stone-400">
            Pick your path · Semester-wise roadmap · Free resources
          </div>
        </div>

        {/* Track cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SKILL_TRACKS.map((track) => {
            const isActive = active === track.id;
            return (
              <div
                key={track.id}
                onMouseEnter={() => setActive(track.id)}
                style={{
                  borderRadius: 12,
                  background: isActive ? track.colorBg : "rgba(255,255,255,0.02)",
                  border: `0.5px solid ${isActive ? track.colorBorder : "rgba(255,255,255,0.07)"}`,
                  padding: "10px 12px",
                  cursor: "default",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: isActive
                      ? `${track.color}20`
                      : "rgba(255,255,255,0.04)",
                    border: `0.5px solid ${isActive ? track.color + "40" : "rgba(255,255,255,0.08)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                  }}
                >
                  {track.icon}
                </div>

                {/* Title + tags */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: isActive ? track.color : "rgba(255,255,255,0.75)",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {track.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginTop: 4,
                      flexWrap: "wrap",
                    }}
                  >
                    {track.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.4)",
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: 4,
                          padding: "2px 5px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Salary + demand */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: isActive ? track.color : "rgba(255,255,255,0.5)",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {track.salary}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "rgba(255,255,255,0.3)",
                      marginTop: 2,
                    }}
                  >
                    {track.demand}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: "0.5px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
            Based on 2026 MCA placement data
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#a78bfa",
              background: "rgba(167,139,250,0.1)",
              border: "0.5px solid rgba(167,139,250,0.25)",
              borderRadius: 6,
              padding: "3px 8px",
            }}
          >
            Free Roadmap →
          </div>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// MentorCard — Slide 4 right panel (refined from original)
// ─────────────────────────────────────────────────────────────────────────────
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
    <div className="w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[380px] xl:max-w-[400px]">
      <div className="rounded-2xl bg-[#f8f7f4] shadow-2xl shadow-black/50 overflow-hidden">
        {/* Top amber stripe */}
        <div className="h-0.5 bg-gradient-to-r from-amber-500 to-amber-400" />
        <div className="p-4 sm:p-5">
          {/* Mentor identity */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative shrink-0">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 z-0" />
              <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={photoSrc}
                  alt={photoAlt}
                  fill
                  className="object-cover object-center"
                />
              </div>
              {/* Verified badge */}
              <div className="absolute bottom-0 right-0 z-20 w-4 h-4 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 font-bold text-[17px] leading-tight">
                {name}
              </h3>
              <p className="text-gray-500 text-[12px] mt-0.5 leading-snug">{role}</p>
              {badge && (
                <span className="inline-block mt-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  {badge}
                </span>
              )}
            </div>
          </div>

          {/* Feature bullets */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-1.5">
                <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-gray-600 text-[12.5px] leading-snug">{f}</span>
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-gray-100 mb-3" />

          {/* Pricing */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-gray-400 text-lg line-through">₹599</span>
              <span className="text-amber-600 text-[26px] font-bold">₹249</span>
              <span className="text-gray-400 text-base">/ session</span>
            </div>
            <span className="text-sm text-green-700 border border-green-200 bg-green-50 px-2 py-0.5 rounded-full font-bold">
              58% OFF
            </span>
          </div>

          {/* CTA */}
          <Link href={bookHref} target="_blank">
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2.5 rounded-xl text-[13px] transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 cursor-pointer">
              Book 1-on-1 Session →
            </button>
          </Link>
          <p className="text-center text-gray-400 text-[11px] mt-1.5">
            45 min · Expert mentors · Offer ends soon
          </p>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// RightPanel — dispatcher
// ─────────────────────────────────────────────────────────────────────────────
const RightPanel = memo(function RightPanel({ type }: { type: RightKey }) {
  if (type === "entrance") return <EntrancePanel />;
  if (type === "journey") return <JourneyPanel />;
  if (type === "skills") return <SkillsPanel />;
  if (type === "mentor") return <MentorCard {...MENTOR_DATA.guidance} />;
  return null;
});

// ─────────────────────────────────────────────────────────────────────────────
// SlideTitle — renders title with amber accent on titleAccent substring
// ─────────────────────────────────────────────────────────────────────────────
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
      <span className="text-amber-400">{accent}</span>
      {parts[1]}
    </>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// TrustBar — shown below CTAs on every slide
// Social proof that converts first-time visitors
// ─────────────────────────────────────────────────────────────────────────────
const TrustBar = memo(function TrustBar() {
  const items = [
    { icon: "✓", text: "10,000+ students guided" },
    { icon: "★", text: "Free tools, no login needed" },
    { icon: "✓", text: "Real mentors, no fake promises" },
  ] as const;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 justify-center lg:justify-start">
      {items.map((item) => (
        <span
          key={item.text}
          className="flex items-center gap-1.5 text-[11px] text-white/50"
        >
          <span className="text-amber-500 text-[10px] font-bold">{item.icon}</span>
          {item.text}
        </span>
      ))}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Slide reducer
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// useInterval
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// SlideNavDots — Dot navigation with slide labels for accessibility
// ─────────────────────────────────────────────────────────────────────────────
const SLIDE_LABELS = ["Entrance", "Journey", "Skills", "Mentorship"] as const;

const SlideNavDots = memo(function SlideNavDots({
  total,
  visible,
  onDot,
}: {
  total: number;
  visible: number;
  onDot: (i: number) => void;
}) {
  return (
    <div
      className="relative lg:absolute lg:bottom-5 lg:left-0 lg:right-0 w-full flex items-center justify-center gap-3 z-20 pb-5 lg:pb-0"
      role="tablist"
      aria-label="Slide navigation"
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === visible}
          aria-label={`${SLIDE_LABELS[i]} slide`}
          onClick={() => onDot(i)}
          className="group flex items-center gap-1.5 cursor-pointer"
        >
          <span
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === visible
                ? "w-8 bg-amber-500"
                : "w-2 bg-white/20 group-hover:bg-white/40"
            }`}
          />
          <span
            className={`text-[10px] font-semibold transition-all duration-300 hidden sm:block ${
              i === visible ? "text-amber-400 opacity-100" : "text-white/0"
            }`}
          >
            {SLIDE_LABELS[i]}
          </span>
        </button>
      ))}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// HeroSlider — main export
// The server component (HeroBanner.tsx) imports only this.
//
// SEO NOTES for parent server component:
//  - Use slides[currentSlide].seoTitle as <title> and <meta og:title>
//  - Use slides[currentSlide].seoDescription as <meta name="description">
//  - The H1 in each slide is keyword-rich — do NOT add another H1 elsewhere
//    on the page. Use H2 for subsequent sections.
//  - Schema.org: add WebSite + EducationalOrganization JSON-LD in the <head>
// ─────────────────────────────────────────────────────────────────────────────
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
        1500
      );
    },
    [visible, isMobile]
  );

  const advance = useCallback(
    () => goTo((visible + 1) % slides.length),
    [visible, goTo, slides.length]
  );
  const resetTimer = useInterval(advance, 6000);

  const handleDot = useCallback(
    (i: number) => {
      goTo(i);
      resetTimer();
    },
    [goTo, resetTimer]
  );

  const exitCls =
    dir === "left"
      ? "-translate-x-10 opacity-0 pointer-events-none"
      : "translate-x-10 opacity-0 pointer-events-none";

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
              <div className="w-full h-full flex flex-col lg:flex-row lg:items-center pt-16 sm:pt-16 lg:pt-14 pb-6 sm:pb-8 lg:pb-16 gap-6 lg:gap-10 xl:gap-14">

                {/* ── LEFT COLUMN ── */}
                <div className="w-full lg:w-[52%] flex flex-col items-center lg:items-start">

                  {/* Eyebrow — keyword-dense, indexable */}
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm ${eb.cls}`}
                  >
                    {eb.label}
                  </span>

                  {/*
                    H1 — Primary SEO heading.
                    Each slide has a unique, keyword-rich H1 targeting
                    a different search cluster. Only one is visible at a time.
                    Parent server component must ensure no other H1 exists on page.
                  */}
                  <h1
                    className={`${h1.lg} ${h1.sm} ${h1.default} font-bold leading-tight text-white text-center lg:text-left mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]`}
                  >
                    <SlideTitle
                      title={slide.title}
                      accent={slide.titleAccent}
                    />
                  </h1>

                  {/* Description — includes secondary keywords naturally */}
                  <p className="text-amber-50/80 leading-relaxed text-center lg:text-left max-w-[310px] sm:max-w-md lg:max-w-none mb-6 line-clamp-3 sm:line-clamp-none drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)] text-sm sm:text-base">
                    {slide.description}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto justify-center lg:justify-start">
                    <Link
                      href={slide.primaryBtn.href}
                      className="w-full sm:w-auto"
                      target={slide.primaryBtn.href.startsWith("http") ? "_blank" : undefined}
                      rel={slide.primaryBtn.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      <button className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold cursor-pointer px-6 py-3 text-[13px] sm:text-[14px] rounded-xl transition-all duration-300 shadow-lg shadow-amber-900/40 hover:scale-[1.02] hover:shadow-amber-500/40">
                        {slide.primaryBtn.label}
                      </button>
                    </Link>
                    <Link
                      href={slide.secondaryBtn.href}
                      className="w-full sm:w-auto"
                      target={slide.secondaryBtn.href.startsWith("http") ? "_blank" : undefined}
                      rel={slide.secondaryBtn.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      <button className="w-full border border-white/20 text-white/80 font-medium cursor-pointer px-6 py-3 text-[13px] sm:text-[14px] rounded-xl bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/35 hover:scale-[1.02]">
                        {slide.secondaryBtn.label}
                      </button>
                    </Link>
                  </div>

                  {/* Trust bar — social proof below CTAs */}
                  <TrustBar />

                  {/* Social links — below trust bar, not in the hero eye-line */}
                  <div className="mt-6">
                    <Socials />
                  </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="w-full lg:w-[48%] flex items-center justify-center lg:justify-end">
                  <RightPanel type={slide.right} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dot navigation */}
      <SlideNavDots
        total={slides.length}
        visible={visible}
        onDot={handleDot}
      />
    </div>
  );
}