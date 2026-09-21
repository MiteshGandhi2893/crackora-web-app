"use client";
import { h2, p } from "@/data/tailwind-utils";
import { STARS } from "@/lib/util";
import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import {
  BiCheckCircle,
  BiEditAlt,
  BiBuildings,
  BiBookOpen,
  BiCodeAlt,
  BiBriefcase,
  BiChevronLeft,
  BiChevronRight,
} from "react-icons/bi";

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
    icon: BiCheckCircle,
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
    icon: BiEditAlt,
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
    icon: BiBuildings,
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
    icon: BiBookOpen,
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
    icon: BiCodeAlt,
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
    icon: BiBriefcase,
    about:
      "MCA graduates in India move into software development, data analysis, and IT services roles, with many landing their first job through campus placements or referrals during the final semester. Starting salaries typically range from ₹4–10L depending on college pedigree, specialization, and project portfolio.",
    details: [
      "Campus placements start in the final semester",
      "Common roles: SDE, Data Analyst, QA, Support Engineer",
      "Typical starting range: ₹4–10L depending on college & skills",
    ],
  },
];

export function McaJourneySection() {
  // Desktop: which step is selected. Just one useState, no timers/effects.
  const [active, setActive] = useState(0);
  const step = steps[active];
  const ActiveIcon = step.icon;

  // Mobile Swiper custom navigation — must be React *state* (not a plain ref) so
  // Swiper re-renders with real DOM nodes once the buttons mount. This is the
  // pattern Swiper's own docs recommend for custom nav; using useRef here is
  // exactly what caused the duplicate default arrows and the broken nav before.
  const [navPrevEl, setNavPrevEl] = useState<HTMLButtonElement | null>(null);
  const [navNextEl, setNavNextEl] = useState<HTMLButtonElement | null>(null);

  return (
    <section className="relative w-full overflow-hidden isolate py-16 lg:py-24 lg:px-0 px-5">
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
            <h2 className={`${h2.default} ${h2.sm} ${h2.lg} font-serif text-cyan-100 leading-tight tracking-tight mb-3`}>
              From Eligibility to your <span className="text-amber-500">First Tech Job</span>
            </h2>
            <p className={`${p.default} ${p.sm} ${p.lg} text-white/60 leading-relaxed font-sans max-w-xl`}>
              Many students choose MCA after graduation but are unsure about
              exams, colleges, duration, and career options. Explore any stage
              below for the full picture.
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

        {/* ── DESKTOP: step list + detail panel side by side ── */}
        <div className="hidden lg:grid grid-cols-12 gap-6 items-start">
          {/* left: compact step list */}
          <ol className="lg:col-span-4 relative grid grid-cols-1 gap-2">
            {steps.map((s, i) => {
              const isActive = active === i;
              const Icon = s.icon;
              return (
                <li key={s.label}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={isActive}
                    className={`w-full flex items-center gap-3 rounded-xl border pl-3.5 pr-4 py-3.5 text-left cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-[#f7f4ec] border-[#b08a4e]/50 shadow-[0_6px_20px_rgba(0,0,0,0.25)] translate-x-1"
                        : "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20"
                    }`}
                  >
                    <span
                      className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-colors duration-200 ${
                        isActive
                          ? "bg-amber-500 border-amber-500 text-[#0b1220]"
                          : "bg-[#0b1220] border-white/15 text-amber-200"
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block text-sm font-semibold font-sans leading-tight truncate ${
                          isActive ? "text-cyan-900" : "text-green-50"
                        }`}
                      >
                        {s.label}
                      </span>
                      <span
                        className={`block text-xs font-sans truncate mt-0.5 ${
                          isActive ? "text-amber-700/80" : "text-cyan-50/45"
                        }`}
                      >
                        {s.sub}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* right: detail panel */}
          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-[#f7f4ec] p-8 lg:p-10">
              <span aria-hidden="true" className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-800" />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-4 -right-2 font-serif text-[9rem] leading-none text-black/[0.04] select-none"
              >
                {String(active + 1).padStart(2, "0")}
              </span>

              <div className="relative flex items-center gap-4 mb-6">
                <span className="shrink-0 w-14 h-14 rounded-2xl bg-amber-600/10 border border-amber-600/25 flex items-center justify-center text-amber-700">
                  <ActiveIcon className="w-7 h-7" />
                </span>
                <div>
                  <span className="inline-block text-[11px] tracking-wider font-sans font-semibold text-amber-700 bg-amber-600/10 px-2 py-0.5 rounded-full mb-1.5">
                    {step.badge.toUpperCase()}
                  </span>
                  <p className="font-serif text-2xl text-[#0f2b36] leading-snug">{step.label}</p>
                  <p className="text-sm text-[#164e61]/70 font-sans">{step.sub}</p>
                </div>
              </div>

              <p className="relative text-sm lg:text-[15px] text-black/65 leading-relaxed font-sans mb-6 max-w-2xl">
                {step.about}
              </p>

              <ul className="relative grid sm:grid-cols-2 gap-x-6 gap-y-3 border-t border-black/8 pt-5">
                {step.details.map((d, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-black/60 font-sans leading-snug">
                    <span className="mt-2 w-1 h-1 rounded-full bg-[#b08a4e] shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>

              <div className="relative flex items-center gap-1.5 mt-7 pt-5 border-t border-black/8">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to step ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === active ? "w-6 bg-amber-600" : "w-1.5 bg-black/15 hover:bg-black/25"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE: one card at a time, Swiper carousel ── */}
        <div className="lg:hidden relative ">
          <Swiper
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={16}
            navigation={{ prevEl: navPrevEl, nextEl: navNextEl }}
          >
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <SwiperSlide key={s.label}>
                  <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-[#f7f4ec] shadow-xl p-6 sm:p-8">
                    <span aria-hidden="true" className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-800" />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-3 -right-2 font-serif text-[6.5rem] leading-none text-black/[0.04] select-none"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="relative flex items-center gap-3.5 mb-5">
                      <span className="shrink-0 w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-600/25 flex items-center justify-center text-amber-700">
                        <Icon className="w-6 h-6" />
                      </span>
                      <div>
                        <span className="inline-block text-[10px] tracking-wider font-sans font-semibold text-amber-700 bg-amber-600/10 px-2 py-0.5 rounded-full mb-1">
                          {s.badge.toUpperCase()}
                        </span>
                        <p className="font-serif text-lg text-[#0f2b36] leading-snug">{s.label}</p>
                        <p className="text-xs text-[#164e61]/70 font-sans">{s.sub}</p>
                      </div>
                    </div>

                    <p className="relative text-sm text-black/65 leading-relaxed font-sans mb-6">
                      {s.about}
                    </p>

                    <ul className="relative space-y-3 border-t border-black/8 pt-5">
                      {s.details.map((d, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-black/60 font-sans leading-snug">
                          <span className="mt-2 w-1 h-1 rounded-full bg-[#b08a4e] shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* prev/next — circular, half overlapping the card edge, cyan-900 with white icon */}
          <button
            ref={setNavPrevEl}
            type="button"
            aria-label="Previous step"
            className="absolute top-1/2 left-0 z-10 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-cyan-900 text-white flex items-center justify-center shadow-lg cursor-pointer disabled:opacity-30"
          >
            <BiChevronLeft className="w-6 h-6" />
          </button>
          <button
            ref={setNavNextEl}
            type="button"
            aria-label="Next step"
            className="absolute top-1/2 right-0 z-10 -translate-y-1/2 translate-x-1/2 w-11 h-11 rounded-full bg-cyan-900 text-white flex items-center justify-center shadow-lg cursor-pointer disabled:opacity-30"
          >
            <BiChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* CTA */}
        <div className="mt-10 lg:mt-14 flex justify-center">
          <Link
            href="/mca-journey"
            className="group inline-flex items-center gap-2.5 border border-[#b08a4e]/50 hover:border-[#b08a4e] bg-amber-600 rounded shadow
            text-white hover:text-white px-7 py-3 text-sm lg:text-base font-sans font-medium tracking-wide transition-colors duration-300"
          >
            Explore the MCA guide
            <BiChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}