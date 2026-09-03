"use client";

import { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { h3 } from "@/data/tailwind-utils";

import { h2, p } from "@/data/tailwind-utils";
import { BiTargetLock, BiBuildings, BiTrendingUp } from "react-icons/bi";
import { STARS } from "@/lib/util";

type Feature = {
  icon: IconType;
  title: string;
  description: string;
};

export function FeatureGrid({ features }: { features: Feature[] }) {
  const [visible, setVisible] = useState<boolean[]>(() =>
    features.map(() => false),
  );
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // One observer per card — each reveals independently the moment it
    // enters the viewport. Works the same whether it's stacked 1-per-row
    // on mobile or 3-per-row on desktop.
    const observers: IntersectionObserver[] = [];

    refs.current.forEach((el, i) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => {
              if (prev[i]) return prev;
              const next = [...prev];
              next[i] = true;
              return next;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
      {features.map((f, i) => {
        const Icon = f.icon;
        const shown = visible[i];

        return (
          <div
            key={f.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            style={{ transitionDelay: shown ? `${i * 100}ms` : "0ms" }}
            className={`rounded-xl border border-white/10 bg-white backdrop-blur-sm p-6 lg:p-7 flex flex-col gap-4 transition-all duration-700 ease-out ${
              shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full border border-amber-500 bg-amber-600 flex items-center justify-center text-white shrink-0">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <span className="font-serif text-md text-amber-600">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <h3
              className={`${h3.default} text-cyan-900 text-lg font-semibold leading-snug`}
            >
              {f.title}
            </h3>

            <p className="text-[13px] lg:text-sm text-cyan-950/70 leading-[1.7]">
              {f.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// NO "use client" — this stays a Server Component.
// The only client-side piece (scroll-reveal) lives in FeatureGrid.tsx.

// Three stages of the journey — exam, college, career.
const features = [
  {
    icon: BiTargetLock,
    title: "Entrance Preparation Guidance",
    description:
      "A clear roadmap for your entrance exam — what to study, how to prepare, and how to improve step by step.",
  },
  {
    icon: BiBuildings,
    title: "College Selection Support",
    description:
      "Understand colleges, cutoffs, rankings and options so you choose the right fit based on your rank, budget and goals.",
  },
  {
    icon: BiTrendingUp,
    title: "Career & Placement Direction",
    description:
      "Guidance on internships, skills, specialisation choices and placements so you finish with real career opportunities.",
  },
];

const stats = [
  ["10K+", "Students"],
  ["50+", "Mock Tests"],
  ["40+", "Colleges"],
] as const;

export function WhyCrackora() {
  return (
    <section className="w-full bg-[#f8f7f4] py-14 sm:py-18 lg:py-24 relative overflow-hidden lg:px-0 px-5">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* ── Stars ── */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {STARS.map((s) => (
          <span
            key={s.id}
            className={`absolute rounded-full ${s.amber ? "bg-amber-300" : "bg-white"}`}
            style={{
              top: s.top,
              left: s.left,
              width: s.w,
              height: s.w,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 w-[50vw] h-[50vh] rounded-full bg-[radial-gradient(ellipse,rgba(8,60,100,0.05),transparent_65%)]" />
      <div className="pointer-events-none absolute -top-10 right-0 w-[35vw] h-[40vh] rounded-full bg-[radial-gradient(ellipse,rgba(217,119,6,0.05),transparent_65%)]" />

      <div className="lg:max-w-6xl sm:max-w-3xl mx-auto px-4 lg:px-0 relative">
        {/* Header — unchanged */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 xl:gap-20 items-start lg:items-center mb-10 sm:mb-14 lg:mb-16">
          <div className="lg:w-1/2 flex flex-col gap-3 sm:gap-4">
            <span className="text-sm font-bold tracking-[0.22em] uppercase text-amber-600 font-sans">
              Why Crackora
            </span>

            <h2
              className={`font-serif ${h2.lg} ${h2.sm} ${h2.default} text-cyan-100 leading-[1.2] tracking-tight`}
            >
              Best platform for{" "}
              <span className="text-amber-500">Entrance Preparation</span>
            </h2>

            <div className="h-0.5 w-10 bg-amber-500 rounded-full" />

            <p
              className={`text-cyan-50/65 lg:${p.default} text-[15.5px] leading-[1.75] max-w-lg font-roboto text-lg`}
            >
              Crackora helps entrance aspirants at every stage — exam
              preparation, college selection, in-course guidance, and placement
              direction. Instead of figuring everything alone, you get a clear
              path from the day you start preparing until you land your first
              job.
            </p>

            <div className="flex gap-6 sm:gap-8 pt-1">
              {stats.map(([num, label]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="font-serif text-xl sm:text-2xl text-amber-500 font-bold leading-none">
                    {num}
                  </span>
                  <span className="text-[10px] text-text-amber-300 /40 font-sans tracking-widest uppercase mt-1">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(5,16,31,0.12)] border border-[#e8e4dc]">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/5UA_XiBI-hk"
                title="Why Crackora entrance preparation"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>
          </div>
        </div>

        {/* Feature cards — 3 now, scroll-reveals one after another */}
        <FeatureGrid features={features} />
      </div>
    </section>
  );
}