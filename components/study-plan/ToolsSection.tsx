"use client";

import Image from "next/image";
import Link from "next/link";

const tools = [
  { icon: "🎓", name: "College Predictor" },
  { icon: "📊", name: "Rank Predictor" },
  { icon: "📅", name: "Study Planner" },
  { icon: "📉", name: "Cutoff Analyser" },
  { icon: "💰", name: "Salary Calculator" },
  { icon: "🔍", name: "Eligibility Checker" },
];

export function ToolsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f8f7f4] px-6 sm:px-12 lg:px-24 py-16 lg:py-24">
      <div className="max-w-6xl mx-auto">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
        />

        {/* grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* LEFT */}
          <div className="lg:w-3/5 flex flex-col gap-7">
            {/* SEO heading */}
            <div className="flex flex-col gap-3">
              <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-cyan-900 leading-tight">
                Free MCA Entrance{" "}
                <span className="text-amber-600">
                  Predictor & Preparation Tools
                </span>
              </h2>

              <div className="h-0.5 w-32 bg-amber-500 rounded-full" />
            </div>

            <p className="text-[#05101f]/70 text-base leading-relaxed">
              Use Crackora's free tools for NIMCET, MAH MCA CET, TANCET, IPU
              CET, WB JECA and CUET PG. Predict colleges, estimate rank, analyse
              cutoffs, plan your study schedule, check eligibility, and
              calculate salary — all in one place.
            </p>

            {/* tool list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tools.map((t) => (
                <div
                  key={t.name}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm"
                >
                  <span>{t.icon}</span>
                  <span className="text-gray-700">{t.name}</span>
                </div>
              ))}
            </div>

            {/* button */}
            <div>
              <Link
                href="/tools/college"
                className="
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-amber-600
              text-white
              font-semibold
              text-sm
              hover:bg-amber-700
              transition
              "
              >
                Open All Tools →
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:w-2/5 w-full flex items-center justify-center">
            <div className="relative w-64 h-64 sm:w-150 sm:h-100">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.08),transparent_70%)]" />

              <Image
                src="/tools.svg"
                alt="MCA entrance preparation tools illustration"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* grain */}
    </section>
  );
}
