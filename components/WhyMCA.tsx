"use client";
import { h2, p } from "@/data/tailwind-utils";
import { STARS } from "@/lib/util";
import Link from "next/link";

const stats = [
  { num: "₹4 - 10L", label: "Starting salary after MCA", color: "text-amber-400" },
  { num: "1,285", label: "NIT seats via NIMCET", color: "text-cyan-300" },
  { num: "2 yrs", label: "To become job-ready", color: "text-emerald-400" },
];

const steps = [
  {
    emoji: "🎓",
    label: "Check Eligibility",
    sub: "BCA · BSc · BCom with Maths",
    badge: "Start",
    badgeStyle: "bg-cyan-400/10 text-cyan-300 border-cyan-300/20",
  },
  {
    emoji: "📋",
    label: "Prepare for Entrance",
    sub: "NIMCET · MAH CET · CUET PG",
    badge: "Exams",
    badgeStyle: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  {
    emoji: "🏛",
    label: "Choose MCA College",
    sub: "NIT · State · Private",
    badge: "Admission",
    badgeStyle: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  {
    emoji: "📚",
    label: "Complete MCA (2 years)",
    sub: "Subjects · Projects · Internships",
    badge: "Study",
    badgeStyle: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  {
    emoji: "⚙️",
    label: "Build Tech Skills",
    sub: "Full Stack · AI · Cloud · Data",
    badge: "Skills",
    badgeStyle: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  {
    emoji: "💼",
    label: "Get Your First Job",
    sub: "Software · Data · IT",
    badge: "Career",
    badgeStyle: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  },
];

export function McaJourneySection() {
  return (
    <section className="relative w-full overflow-hidden py-14 sm:py-18 lg:py-24 isolate">
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
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-0">

        {/* header row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 lg:mb-12">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold tracking-[.22em] uppercase text-amber-600 mb-2.5 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block animate-pulse" />
              The MCA Journey
            </p>
            <h2 className={`${h2.default} ${h2.sm} ${h2.lg}   font-serif text-white leading-tight tracking-tight mb-2.5`}>
              Confused about MCA?
              <span className="text-amber-500"> Here is the full journey</span>
            </h2>
            <div className="h-0.5 w-10 bg-amber-500 rounded-full mb-3" />
            <p className={` ${p.default} ${p.sm} ${p.lg} text-white/70  leading-relaxed  font-sans`}>
              Many students choose MCA after graduation but are unsure about
              exams, colleges, duration, and career options. Here is the
              complete path from eligibility to your first tech job.
            </p>
          </div>
        </div>

        {/* stat pills */}
        <div className="flex flex-wrap gap-2 mb-8 lg:mb-12">
          {stats.map((s) => (
            <div
              key={s.num}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[.04] border border-white/[.08]"
            >
              <span className={`font-serif text-xl font-bold ${s.color}`}>
                {s.num}
              </span>
              <span className="w-px h-3.5 bg-white/10" />
              <span className="text-lg text-white/70 font-sans">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* 6-step timeline */}
        <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 lg:gap-0">
          {/* connector line — desktop only */}
          <div className="hidden lg:block absolute top-[26px] left-[calc(100%/12)] w-[calc(100%-100%/6)] h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent pointer-events-none z-0" />

          {steps.map((s, i) => (
            <div key={i} className="relative z-10 group">
              <div className="flex flex-col items-center text-center px-1 rounded-[14px] border border-transparent hover:border-amber-400/15 hover:bg-amber-100/10 transition-all duration-200 py-4 cursor-default relative overflow-hidden">
                {/* top amber bar on hover */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-600 to-amber-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />

                {/* node */}
                <div className="relative w-12 h-12 rounded-full bg-amber-400/20 border border-white/[.09] flex items-center justify-center mb-3 group-hover:bg-amber-400/[.09] group-hover:border-amber-400/30 transition-all duration-200">
                  <span className="text-[17px]">{s.emoji}</span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 border border-amber-400/25 text-white text-[10px] font-bold flex items-center justify-center font-sans">
                    {i + 1}
                  </span>
                </div>

                <p className={`${p.default} font-bold text-white/75 leading-snug tracking-wide mb-1 font-sans`}>
                  {s.label}
                </p>
                <p className={`text-sm text-amber-100/60 leading-relaxed mb-2 font-sans`}>
                  {s.sub}
                </p>
                <span className={`inline-flex items-center px-2 py-[2px] rounded-full text-xs font-bold tracking-[.06em] uppercase border ${s.badgeStyle} font-sans`}>
                  {s.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 lg:mt-10 flex justify-center">
          <Link href="/mca-journey">
            <button className="relative overflow-hidden bg-amber-600 hover:bg-amber-700 text-white px-7 py-3 rounded-xl text-lg font-bold tracking-[.02em] hover:scale-[1.04] hover:shadow-[0_10px_36px_rgba(217,119,6,0.3)] transition-all duration-200 font-sans">
              <span className="relative z-10">Explore MCA Guide →</span>
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}