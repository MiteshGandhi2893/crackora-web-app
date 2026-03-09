"use client";
import Image from "next/image";
import { CreatePlanButton } from "../app-buttons/create-plan";

const steps = [
  { num: "01", label: "Pick your exam & date" },
  { num: "02", label: "Set daily study hours" },
  { num: "03", label: "Get your weekly roadmap" },
];

export function StudyPlanSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#05101f] px-6 sm:px-12 lg:px-24 py-16 lg:py-24">
      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Glows */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#020617]" />

        {/* Cyan nebula */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />

        {/* Green nebula */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />

        {/* Soft atmospheric diffusion */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04),transparent_120%)]" />

        {/* CSS star texture (no image → faster) */}
        <div
          className="absolute inset-0 opacity-[0.15]
          bg-[radial-gradient(circle_at_10px_1px,rgba(255,255,255,.8)_1px,transparent_0)]
          bg-size-[30px_30px]"
        />

        <div className="absolute top-0 left-0 w-screen h-full bg-[rgba(0,0,0,0.2)] z-10"></div>
      </div>

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        {/* Left — copy */}
        <div className="lg:w-3/5 flex flex-col gap-7">
          <div className="flex flex-col gap-3">
         
            <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-white leading-tight tracking-tight">
              Smart Study <span className="text-amber-500">Planner</span>
            </h2>
            <div className="h-[2px] w-12 bg-amber-500 rounded-full" />
          </div>

          <p className="text-white/70 text-base leading-relaxed max-w-xl font-sans">
            Tell us your exam date and daily hours — Crackora&apos;s planner
            breaks your entire syllabus into structured weekly goals, so you
            always know exactly what to study next. No confusion. No overwhelm.
            Just progress.
          </p>

          {/* Steps */}
          <div className="flex flex-col sm:flex-row gap-4">
            {steps.map(({ num, label }) => (
              <div
                key={num}
                className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3 flex-1"
              >
                <span className="font-serif text-2xl text-amber-400/60 font-bold leading-none">
                  {num}
                </span>
                <span className="text-white/65 text-xs font-sans leading-snug">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div>
            <CreatePlanButton addonClass="px-6 py-3 bg-amber-600 text-[#05101f] font-bold text-sm rounded-xl transition-all duration-200 hover:scale-[1.02]" />
          </div>
        </div>

        {/* Right — illustration */}
        <div className="lg:w-2/5 w-full flex items-center justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.08),transparent_70%)]" />
            <Image
              src="/planner.svg"
              alt="Study Planner illustration"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
