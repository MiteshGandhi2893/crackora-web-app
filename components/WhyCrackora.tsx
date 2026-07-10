"use client";

import { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { h3 } from "@/data/tailwind-utils";

import { h2, p } from "@/data/tailwind-utils";
import {
  BiTargetLock,
  BiBuildings,
  BiBookAlt,
  BiTrendingUp,
} from "react-icons/bi";



type Feature = {
  icon: IconType;
  title: string;
  description: string;
  accent: "amber" | "cyan";
};

const accentMap: Record<string, { card: string; icon: string; bar: string }> = {
  amber: {
    card: "bg-white border border-amber-100 hover:border-amber-300",
    icon: "bg-amber-50 text-amber-600",
    bar: "bg-amber-400",
  },
  cyan: {
    card: "bg-white border border-cyan-100 hover:border-cyan-300",
    icon: "bg-cyan-50 text-cyan-700",
    bar: "bg-cyan-500",
  },
};

export function FeatureGrid({ features }: { features: Feature[] }) {
  const [visible, setVisible] = useState<boolean[]>(() => features.map(() => false));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // One observer per card — each reveals independently the moment it
    // enters the viewport. Works the same whether it's stacked 1-per-row
    // on mobile or 4-per-row on desktop.
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
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {features.map((f, i) => {
        const a = accentMap[f.accent];
        const Icon = f.icon;
        const shown = visible[i];

        return (
          <div
            key={f.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            style={{ transitionDelay: shown ? `${i * 100}ms` : "0ms" }}
            className={`${a.card} rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-[0_2px_16px_rgba(5,16,31,0.07)] hover:shadow-[0_8px_40px_rgba(5,16,31,0.13)] hover:-translate-y-1 group transition-all duration-700 ease-out ${
              shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${a.icon} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className={`h-0.5 flex-1 rounded-full ${a.bar} opacity-30 group-hover:opacity-60 transition-opacity duration-300`} />
            </div>

            <h3 className={`${h3.default} text-cyan-900 text-xl font-semibold leading-snug`}>
              {f.title}
            </h3>

            <p className="text-sm text-cyan-950/55 leading-[1.7]">{f.description}</p>
          </div>
        );
      })}
    </div>
  );
}


// NO "use client" — this stays a Server Component.
// The only client-side piece (scroll-reveal) lives in FeatureGrid.tsx.


// Kept general on purpose — more entrances beyond MCA are being added
// later, so nothing here name-checks a specific exam.
const features = [
  {
    icon: BiTargetLock,
    title: "Entrance Preparation Guidance",
    description:
      "A clear roadmap for your entrance exam — what to study, how to prepare, and how to improve step by step.",
    accent: "amber" as const,
  },
  {
    icon: BiBuildings,
    title: "College Selection Support",
    description:
      "Understand colleges, cutoffs, rankings and options so you choose the right fit based on your rank, budget and goals.",
    accent: "cyan" as const,
  },
  {
    icon: BiBookAlt,
    title: "In-Course Study Guidance",
    description:
      "Support once you're in — subjects, specialisations, projects, and how to build the right skills during your course.",
    accent: "amber" as const,
  },
  {
    icon: BiTrendingUp,
    title: "Career & Placement Direction",
    description:
      "Guidance on internships, skills, specialisation choices and placements so you finish with real career opportunities.",
    accent: "cyan" as const,
  },
];

const stats = [
  ["10K+", "Students"],
  ["50+", "Mock Tests"],
  ["40+", "Colleges"],
] as const;

export function WhyCrackora() {
  return (
    <section className="w-full bg-[#f8f7f4] py-14 sm:py-18 lg:py-24 relative overflow-hidden lg:px-0 sm:px-10">
      <div className="pointer-events-none absolute bottom-0 left-0 w-[50vw] h-[50vh] rounded-full bg-[radial-gradient(ellipse,rgba(8,60,100,0.05),transparent_65%)]" />
      <div className="pointer-events-none absolute -top-10 right-0 w-[35vw] h-[40vh] rounded-full bg-[radial-gradient(ellipse,rgba(217,119,6,0.05),transparent_65%)]" />

      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        {/* Header — unchanged */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 xl:gap-20 items-start lg:items-center mb-10 sm:mb-14 lg:mb-16">
          <div className="lg:w-1/2 flex flex-col gap-3 sm:gap-4">
            <span className="text-sm font-bold tracking-[0.22em] uppercase text-amber-600 font-sans">
              Why Crackora
            </span>

            <h2 className={`font-serif ${h2.lg} ${h2.sm} ${h2.default} text-cyan-900 leading-[1.2] tracking-tight`}>
              Best platform for{" "}
              <span className="text-amber-600">Entrance Preparation</span>
            </h2>

            <div className="h-0.5 w-10 bg-amber-500 rounded-full" />

            <p className={`text-[#05101f]/65 ${p.default} leading-[1.75] max-w-lg font-sans`}>
              Crackora helps entrance aspirants at every stage — exam
              preparation, college selection, in-course guidance, and
              placement direction. Instead of figuring everything alone, you
              get a clear path from the day you start preparing until you
              land your first job.
            </p>

            <div className="flex gap-6 sm:gap-8 pt-1">
              {stats.map(([num, label]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="font-serif text-xl sm:text-2xl text-[#05101f] font-bold leading-none">
                    {num}
                  </span>
                  <span className="text-[10px] text-[#05101f]/40 font-sans tracking-widest uppercase mt-1">
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

        {/* Feature cards — same grid, now scroll-reveals one after another */}
        <FeatureGrid features={features} />
      </div>
    </section>
  );
}