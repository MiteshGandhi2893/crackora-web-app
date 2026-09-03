/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { h2, p } from "@/data/tailwind-utils";
import { STARS } from "@/lib/util";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const stats = [
  { num: "₹4 – 10L", label: "Starting salary after MCA" },
  { num: "1,285", label: "NIT seats via NIMCET" },
  { num: "2 yrs", label: "To become job-ready" },
];

const steps = [
  {
    label: "Check Eligibility",
    sub: "BCA · BSc · BCom with Maths",
    badge: "Start",
    about:
      "MCA eligibility criteria require a bachelor's degree with Mathematics as a subject, either at the 10+2 level or during graduation, depending on the university. Most colleges accept BCA, BSc (Computer Science, IT, or Maths), and BCom with Maths graduates, making it one of the most accessible postgraduate routes into tech.",
    details: [
      "BCA, BSc (CS/IT/Maths), or BCom with Maths qualifies at most colleges",
      "Minimum 50–60% aggregate, relaxed for reserved categories",
      "Final-year students can usually apply provisionally",
    ],
  },
  {
    label: "Prepare for Entrance",
    sub: "NIMCET · MAH CET · CUET PG",
    badge: "Exams",
    about:
      "MCA entrance exams like NIMCET, MAH MCA CET, and CUET PG are the gateway to top colleges, and each tests a similar mix of Mathematics, Logical Reasoning, and Computer Fundamentals. Scoring well here matters more than almost any other single factor, since it directly decides which NIT or university you can get into.",
    details: [
      "NIMCET → all 7 NITs offering MCA (1,285 seats)",
      "MAH MCA CET → Maharashtra state colleges",
      "CUET PG → central & many private universities",
    ],
  },
  {
    label: "Choose MCA College",
    sub: "NIT · State · Private",
    badge: "Admission",
    about:
      "Choosing the best MCA college in India shapes placements more than almost anything else in this journey. Weigh NIRF ranking, fee structure, and location against each college's actual placement record — a lower-ranked college with strong industry tie-ups can outperform a bigger name on paper.",
    details: [
      "NITs — best ROI, lowest fees, strongest brand value",
      "State universities — solid, affordable, regional reach",
      "Private colleges — check NAAC/NBA accreditation and placement %",
    ],
  },
  {
    label: "Complete MCA (2 years)",
    sub: "Subjects · Projects · Internships",
    badge: "Study",
    about:
      "The 2-year MCA syllabus, spread across 4 semesters, builds core computer science fundamentals — Data Structures, DBMS, Operating Systems, and Networks — while leaving room to specialize through electives and hands-on projects. This is where most of the technical foundation for a software career actually gets built.",
    details: [
      "Core: DSA, DBMS, OS, Networks, Software Engineering",
      "Semester-wise mini projects + a final capstone project",
      "Internship in the final semester at most colleges",
    ],
  },
  {
    label: "Build Tech Skills",
    sub: "Full Stack · AI · Cloud · Data",
    badge: "Skills",
    about:
      "Coursework alone rarely gets an MCA graduate hired — pairing it with a focused skill track in Full Stack Development, Data Science/AI, or Cloud/DevOps is what makes a resume stand out to recruiters. Employers increasingly screen for real, shippable projects over degree credentials alone.",
    details: [
      "Pick one lane: Full Stack, Data/AI, or Cloud/DevOps",
      "Ship 2–3 real projects, not just tutorials",
      "Contribute to open source or freelance for proof of work",
    ],
  },
  {
    label: "Get Your First Job",
    sub: "Software · Data · IT",
    badge: "Career",
    about:
      "MCA graduates in India move into software development, data analysis, and IT services roles, with many landing their first job through campus placements or referrals during the final semester. Starting salaries typically range from ₹4–10L depending on college pedigree, specialization, and project portfolio.",
    details: [
      "Campus placements start in the final semester",
      "Common roles: SDE, Data Analyst, QA, Support Engineer",
      "Typical starting range: ₹4–10L depending on college & skills",
    ],
  },
];

const AUTOPLAY_MS = 5000;
const SLIDE_PX = 28;
const OUT_MS = 220;
const IN_MS = 380;

export function McaJourneySection() {
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  // "settled" -> resting in place | "leaving" -> sliding out | "entering" -> about to slide in (pre-transition frame)
  const [phase, setPhase] = useState<"settled" | "leaving" | "entering">("settled");
  const [direction, setDirection] = useState(1); // 1 = forward (slides in from right), -1 = backward
  const [autoplay, setAutoplay] = useState(true);

  const prevActive = useRef(0);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafId = useRef<number | null>(null);

  // Autoplay: advances `active` every 5s while enabled.
  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % steps.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [autoplay]);

  // Slide transition: leave (slide out + fade) → swap content → enter (slide in + fade),
  // direction-aware so it reads as a sliding window rather than a plain crossfade.
  useEffect(() => {
    const prev = prevActive.current;
    if (prev === active) return;

    let dir = active > prev ? 1 : -1;
    if (prev === steps.length - 1 && active === 0) dir = 1; // autoplay wrap-around
    if (prev === 0 && active === steps.length - 1) dir = -1; // manual wrap backward
    setDirection(dir);

    setPhase("leaving");
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    if (rafId.current) cancelAnimationFrame(rafId.current);

    leaveTimer.current = setTimeout(() => {
      setDisplayed(active);
      setPhase("entering");
      // Let the "entering" (pre-transition) frame paint, then release to "settled"
      // so the browser animates from the offset position back to rest.
      rafId.current = requestAnimationFrame(() => {
        rafId.current = requestAnimationFrame(() => setPhase("settled"));
      });
    }, OUT_MS);

    prevActive.current = active;
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [active]);

  const handleStepClick = (i: number) => {
    if (i === active) return;
    setActive(i);
    setAutoplay(false); // manual pick — stop pulling focus away from it
  };

  const step = steps[displayed];

  const panelStyle =
    phase === "settled"
      ? { transform: "translateX(0)", opacity: 1, transition: `transform ${IN_MS}ms cubic-bezier(.22,1,.36,1), opacity ${IN_MS}ms ease-out` }
      : phase === "leaving"
        ? { transform: `translateX(${-direction * SLIDE_PX}px)`, opacity: 0, transition: `transform ${OUT_MS}ms cubic-bezier(.4,0,1,1), opacity ${OUT_MS}ms ease-in` }
        : { transform: `translateX(${direction * SLIDE_PX}px)`, opacity: 0, transition: "none" as const };

  return (
    <section className="relative w-full overflow-hidden isolate py-16 lg:py-24 lg:px-0 px-5">
      {/* ── background: ink navy + a faint structural grid + one soft brass glow ── */}
           {/* ── background ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* ── Stars ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {STARS.map((s) => (
          <span
            key={s.id}
            className={`absolute rounded-full ${s.amber ? "bg-amber-300" : "bg-white"}`}
            style={{ top: s.top, left: s.left, width: s.w, height: s.w, opacity: s.opacity }}
          />
        ))}
      </div>


      {/* ── content ── */}
      <div className="relative z-20 lg:max-w-6xl sm:max-w-3xl mx-auto px-4 sm:px-0">
        {/* header row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-md text-amber-600 font-sans tracking-wider">The MCA journey</p>
            </div>
            <h2 className={`${h2.default} ${h2.sm} ${h2.lg} font-serif text-cyan-100  leading-tight tracking-tight mb-3`}>
              From Eligibility to your <span className="text-amber-500">First Tech Job</span>
             </h2>
            <p className={`${p.default} ${p.sm} ${p.lg} text-white/60 leading-relaxed font-sans max-w-xl`}>
              Many students choose MCA after graduation but are unsure about
              exams, colleges, duration, and career options. Here is the
              complete path, stage by stage.
            </p>
          </div>
        </div>

        {/* fact strip */}
        <div className="flex flex-wrap items-stretch gap-x-8 gap-y-4 mb-10 lg:mb-16 border-t border-b border-white/10 py-5 bg-amber-50/95 px-4 rounded shadow">
          {stats.map((s, i) => (
            <div
              key={s.num}
              className={`flex items-baseline gap-2.5 pr-8 ${i < stats.length - 1 ? "sm:border-r sm:border-white/10" : ""}`}
            >
              <span className="font-serif text-xl lg:text-2xl text-amber-800">{s.num}</span>
              <span className="text-xs sm:text-[14px] text-cyan-950 font-sans tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>

        {/* 6-step timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-6 lg:gap-x-6">
          {steps.map((s, i) => {
            const isActive = active === i;
            return (
              <button
                key={i}
                onClick={() => handleStepClick(i)}
                className="relative text-left cursor-pointer group"
              >
                <div
                  className={`relative px-5 pt-4 pb-4 rounded-xl border transition-all duration-300 h-40 flex flex-col justify-center ${
                    isActive
                      ? "bg-[#f7f4ec] backdrop-blur-md border-[#b08a4e]/40 shadow-[0_8px_28px_rgba(0,0,0,0.28)] -translate-y-0.5"
                      : "bg-gray-200/3 border-gray-200/20 group-hover:bg-white/3 group-hover:border-white/10 -translate-y-0.5"
                  }`}
                >
                  <span
                    className={`block font-serif  mb-3 transition-colors duration-300 ${
                      isActive ? "text-amber-800 text-lg" : "text-amber-200 text-md"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className={`text-sm lg:text-[15px] font-semibold leading-snug mb-1 font-sans transition-colors duration-300 ${
                      isActive ? "text-cyan-900" : "text-green-50"
                    }`}
                  >
                    {s.label}
                  </p>
                  <p
                    className={`text-xs lg:text-[13px] leading-relaxed font-sans transition-colors duration-300 ${
                      isActive ? "text-amber-700/80" : "text-cyan-50/50"
                    }`}
                  >
                    {s.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Detail panel ── */}
        <div className="mt-10 lg:mt-14 overflow-hidden">
          <div className="max-w-2xl mx-auto w-full will-change-transform" style={panelStyle}>
            <div className="bg-[#f7f4ec] p-7 lg:p-9 border border-black/5">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <span className="text-amber-600 font-sans tracking-wider font-semibold text-lg">
                  {String(displayed + 1).padStart(2, "0")}
                </span>
                <span className="text-xs text-amber-700 font-sans tracking-wider font-semibold">{step.badge}</span>
              </div>
              <p className="font-serif text-lg lg:text-xl text-[#164e61] leading-snug mb-3">
                {step.sub}
              </p>
              <p className="text-sm lg:text-[15px] text-black/65 leading-relaxed font-sans mb-5">
                {step.about}
              </p>
              <ul className="space-y-2.5 border-t border-black/8 pt-4">
                {step.details.map((d, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-black/60 font-sans leading-snug">
                    <span className="mt-2 w-1 h-1 rounded-full bg-[#b08a4e] shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* resume autoplay hint after a manual click */}
        {!autoplay && (
          <div className="mt-5 flex justify-center">
            <button
              onClick={() => setAutoplay(true)}
              className="text-xs text-white/35 hover:text-amber-400 transition-colors font-sans underline underline-offset-4 cursor-pointer"
            >
              Resume auto-play
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 lg:mt-14 flex justify-center">
          <Link
            href="/mca-journey"
            className="group inline-flex items-center gap-2.5 border border-[#b08a4e]/50 hover:border-[#b08a4e] bg-amber-600 rounded shadow 
            text-white hover:text-white px-7 py-3 text-sm lg:text-base font-sans font-medium tracking-wide transition-colors duration-300"
          >
            Explore the MCA guide
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}