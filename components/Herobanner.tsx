// HeroBanner.tsx — SERVER COMPONENT (no "use client")
//
// Dark starfield hero → ONE wide cream card.
//   Laptop: text + CTAs + socials on the left, two mini cards
//           (latest blog + latest YouTube) stacked at the bottom right.
//   Phone:  text first, then the two mini cards side by side.
// Height follows the content (no min-h), so the hero stays compact.

import { Socials } from "./SocialButtons";
import { THESIS_CONTENT } from "../data/hero-data";
import { STARS } from "@/lib/util";
import { BsBookHalf, BsFillRocketTakeoffFill } from "react-icons/bs";
import { RiGraduationCapFill } from "react-icons/ri";
import { GrPersonalComputer } from "react-icons/gr";
import { LatestBlogCard } from "./bento-cards/LatestBlogCard";
import { LatestYoutubeCard } from "./LatestYoutubeCard";

export function HeroBanner({ className = "" }: { className?: string }) {
  return (
    <section
      className={`relative isolate flex w-full items-center overflow-hidden bg-[#020617] py-30 lg:py-50 lg:pb-25 ${className}`}
    >
      {/* ── Background (decorative) ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_60%)]" />
        <div className="absolute inset-0 bg-black/30" />
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
        <div className="absolute bottom-0 left-0 h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse,rgba(8,60,100,0.05),transparent_65%)]" />
        <div className="absolute -top-10 right-0 h-[40vh] w-[35vw] rounded-full bg-[radial-gradient(ellipse,rgba(217,119,6,0.05),transparent_65%)]" />

        {/* Soft floating icons: desktop only, so they never collide on phones */}
        <div className="hidden lg:block">
          <BsFillRocketTakeoffFill className="absolute left-[18%] top-[28%] h-14 w-14 text-white opacity-10" />
          <RiGraduationCapFill className="absolute right-[20%] top-[22%] h-14 w-14 text-white opacity-10" />
          <GrPersonalComputer className="absolute bottom-[20%] left-[19%] h-14 w-14 text-white opacity-10" />
          <BsBookHalf className="absolute bottom-[16%] right-[17%] h-14 w-14 text-white opacity-10" />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5">
        <div className="flex w-full flex-col gap-6 rounded-3xl bg-[#f8f7f4] p-5 shadow-2xl sm:p-8 lg:flex-row lg:gap-10 lg:p-10">
          {/* Left: thesis */}
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-5">
            <div className="flex flex-col gap-3">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-700">
                {THESIS_CONTENT.eyebrow}
              </span>
              <h1 className="font-roboto text-[1.8rem] font-bold leading-tight text-cyan-900 sm:text-[2.1rem] lg:text-[2.4rem]">
                {THESIS_CONTENT.title}{" "}
                <span className="font-display italic text-amber-600">
                  {THESIS_CONTENT.titleAccent}
                </span>
              </h1>
              <p className="max-w-xl font-roboto text-[.9rem] font-medium leading-relaxed text-stone-600 lg:text-[1rem]">
                {THESIS_CONTENT.description}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href={THESIS_CONTENT.primaryCta.href}
                  target="_blank"
                  className="inline-flex w-full items-center justify-center gap-2 rounded bg-amber-600 px-5 py-2.5 font-roboto text-sm font-semibold text-cyan-50 transition-all duration-300 hover:scale-[1.03] hover:bg-cyan-900 sm:w-fit"
                >
                  {THESIS_CONTENT.primaryCta.label}
                </a>
                {/* <a
                  href={THESIS_CONTENT.secondaryCta.href}
                  className="inline-flex w-full items-center justify-center gap-2 rounded bg-cyan-700 px-5 py-2.5 font-roboto text-sm font-semibold tracking-wider text-cyan-50 transition-all duration-300 hover:scale-[1.03] hover:bg-cyan-900 sm:w-fit"
                >
                  {THESIS_CONTENT.secondaryCta.label}
                </a> */}
              </div>
              <Socials />
            </div>
          </div>

          {/* Right: two mini cards (bottom right on laptop) */}
          <div className="w-full shrink-0 border-t border-stone-200 pt-5 lg:w-[360px] lg:self-end lg:border-t-0 lg:pt-0 xl:w-[400px]">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-4">
              <LatestBlogCard />
              <LatestYoutubeCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}