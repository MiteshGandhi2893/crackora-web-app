"use client";

import {
  BiTargetLock,
  BiBuildings,
  BiQuestionMark,
  BiTrendingUp,
} from "react-icons/bi";

const features = [
  {
    icon: <BiTargetLock className="w-5 h-5" />,
    title: "Entrance Preparation Guidance",
    description:
      "Clear roadmap for NIMCET, MAH MCA CET, CUET PG and other exams — what to study, how to prepare, and how to improve step by step.",
    accent: "amber",
  },
  {
    icon: <BiBuildings className="w-5 h-5" />,
    title: "College Selection Support",
    description:
      "Understand colleges, cutoffs, rankings and options so you choose the right MCA college based on your rank, budget and goals.",
    accent: "cyan",
  },
  {
    icon: <BiQuestionMark className="w-5 h-5" />,
    title: "MCA Study Guidance",
    description:
      "Help during your MCA — subjects, specialisations, projects, and how to build the right skills during 2 years.",
    accent: "amber",
  },
  {
    icon: <BiTrendingUp className="w-5 h-5" />,
    title: "Career & Placement Direction",
    description:
      "Guidance for internships, skills, specialisation choices and placements so you finish MCA with real career opportunities.",
    accent: "cyan",
  },
];

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

export function WhyCrackora() {
  return (
    <section className="w-full bg-[#f8f7f4] py-14 sm:py-18 lg:py-24 relative overflow-hidden">
      {/* glows */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-[50vw] h-[50vh] rounded-full bg-[radial-gradient(ellipse,rgba(8,60,100,0.05),transparent_65%)]" />
      <div className="pointer-events-none absolute -top-10 right-0 w-[35vw] h-[40vh] rounded-full bg-[radial-gradient(ellipse,rgba(217,119,6,0.05),transparent_65%)]" />

      <div className="max-w-6xl mx-auto px-4 lg:px-0">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 xl:gap-20 items-start lg:items-center mb-10 sm:mb-14 lg:mb-16">

          {/* Left copy */}
          <div className="lg:w-1/2 flex flex-col gap-3 sm:gap-4">
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-amber-600 font-sans">
              Why Crackora
            </span>

            <h2 className="font-serif text-[1.6rem] sm:text-[2rem] lg:text-[2.2rem] xl:text-[2.6rem] text-cyan-900 leading-[1.2] tracking-tight">
              Best platform for{" "}
              <span className="text-amber-600">MCA Entrance Preparation</span>
            </h2>

            <div className="h-0.5 w-10 bg-amber-500 rounded-full" />

            <p className="text-[#05101f]/65 text-[0.875rem] sm:text-[0.9rem] lg:text-[0.9rem] leading-[1.75] max-w-lg font-sans">
              Crackora helps MCA aspirants at every stage — entrance exam
              preparation, college selection, MCA studies, and placement
              guidance. Instead of figuring everything alone, you get a clear
              path from the day you start preparing until you land your first
              job.
            </p>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-8 pt-1">
              {[
                ["10K+", "Students"],
                ["50+", "Mock Tests"],
                ["40+", "Colleges"],
              ].map(([num, label]) => (
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

          {/* Video */}
          <div className="lg:w-1/2 w-full">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(5,16,31,0.12)] border border-[#e8e4dc]">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/5UA_XiBI-hk"
                title="Why Crackora MCA preparation"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>
          </div>
        </div>

        {/* ── Feature cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((f, i) => {
            const a = accentMap[f.accent];
            return (
              <div
                key={i}
                className={`${a.card} rounded-2xl p-4 sm:p-5 flex flex-col gap-3 transition-all duration-300 shadow-[0_2px_16px_rgba(5,16,31,0.07)] hover:shadow-[0_8px_40px_rgba(5,16,31,0.13)] hover:-translate-y-1 group`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${a.icon} flex items-center justify-center shrink-0`}>
                    {f.icon}
                  </div>
                  <div className={`h-0.5 flex-1 rounded-full ${a.bar} opacity-30 group-hover:opacity-60 transition-opacity duration-300`} />
                </div>

                <h3 className="text-cyan-900 text-[0.8rem] sm:text-[0.825rem] font-semibold leading-snug">
                  {f.title}
                </h3>

                <p className="text-cyan-950/55 text-[0.75rem] sm:text-[0.775rem] leading-[1.7]">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}