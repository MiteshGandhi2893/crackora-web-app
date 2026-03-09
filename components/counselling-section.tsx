"use client";
import { CounsellingForm } from "./forms/CounsellingForm";

const benefits = [
  "Personalized doubt solving sessions",
  "One-to-one exam strategy counselling",
  "Flexible timings as per your schedule",
];

export function CounsellingSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#05101f] px-6 sm:px-12 lg:px-24 py-16 lg:py-24">
      <div className="absolute inset-0 z-10">
        {/* Deep space base */}
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
      </div>
      <div className="absolute top-0 left-0 w-screen h-full bg-[rgba(0,0,0,0.2)] z-10"></div>
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-5 lg:gap-5">
        {/* Left — copy */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:gap-7">
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-500 font-sans">
              Expert Guidance
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-white leading-tight tracking-tight">
              Mentorship & 
              <span className="text-amber-500"> Doubt Solving</span>
            </h2>
            <div className="h-[2px] w-12 bg-amber-500 rounded-full" />
          </div>

          <p className="text-white/50 text-base leading-relaxed  font-sans">
            Get personalized guidance from expert mentors. Solve your doubts
            faster, build clarity in concepts, and accelerate your exam
            preparation with structured, one-on-one support.
          </p>

          {/* Benefits */}
          <ul className="flex flex-col gap-3">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-3 font-sans">
                <span className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-2.5 h-2.5 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-white/65 text-sm">{b}</span>
              </li>
            ))}
          </ul>

          {/* Trust badge */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-1.5">
              {["bg-amber-400", "bg-cyan-400", "bg-emerald-400"].map((c, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full ${c} border-2 border-[#05101f] flex items-center justify-center text-[10px] font-bold text-[#05101f]`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="text-white/35 text-xs font-sans">
              500+ students counselled this month
            </span>
          </div>
        </div>

        {/* Right — form */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/4 border border-white/8 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <CounsellingForm />
          </div>
        </div>
      </div>
    </section>
  );
}
