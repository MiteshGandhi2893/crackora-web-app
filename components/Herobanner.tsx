// ─────────────────────────────────────────────────────
// HeroBanner.tsx — SERVER COMPONENT (no "use client")
//
// Bento grid, built around one idea: the thesis card is a warm
// solid "crack of dawn" panel — the breakthrough moment — sitting
// inside a grid of dark glass "aurora" cards — the longer journey
// around it. That contrast is the one deliberate flourish; every
// other cell stays quiet glass so the starfield reads through it.
//
// Cells:
//   - Thesis (solid, contrasting)  → who we are + what we offer
//   - Courses (glass, slim)        → what courses we have (real data)
//   - Journey (glass, slim)        → the differentiator
//   - Blog (glass, wide)           → free resources, a real page
//
// Rows are content-sized (no forced equal-fr height) so a short
// card like Blog doesn't get stretched to match the thesis card's
// full two-row height — each card's height now comes from its own
// content plus consistent internal spacing, not from the grid
// forcing it taller.
//
// Only two things need the browser: <StarField/> (canvas) and
// <PackagesTeaserCard/> (fetches + auto-slides real packages).
// Everything else is plain server-rendered markup.
// ─────────────────────────────────────────────────────

import type { ReactNode } from "react";
import Link from "next/link";
import { Socials } from "./SocialButtons";
import { PackagesTeaserCard } from "./bento-cards/PackagesTeaserCard";
import {
  THESIS_CONTENT,
  JOURNEY_CONTENT,
  BLOG_CONTENT,
} from "../data/hero-data";
import { LatestBlogCard } from "./bento-cards/LatestBlogCard";
import { PaperListCard } from "./bento-cards/PaperListCard";
import { STARS } from "@/lib/util";

function BentoCard({
  children,
  className = "",
  href,
  variant = "glass",
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  variant?: "glass" | "solid";
}) {
  const base =
    variant === "solid"
      ? "group relative overflow-hidden rounded-3xl border border-amber-50 bg-amber-50 shadow-[0_20px_60px_-15px_rgba(217,119,6,0.45)] transition-transform duration-300 hover:scale-[1.01]"
      : "group relative overflow-hidden rounded-3xl border border-white/30 bg-white/[0.04] backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20";

  const classes = `${base} ${className}`;

  if (href) {
    return (
      <div  className={classes}>
        {children}
      </div>
    );
  }
  return <div className={classes}>{children}</div>;
}

export function HeroBanner() {
  return (
    <div className="relative w-full overflow-hidden mt-5 bg-[#020817]">
      {/* Background layers — pure CSS, server-rendered */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>


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

      {/* Aurora signature: slow-rotating conic gradient behind the grid.
          Deliberately absent from directly behind the thesis card —
          that card is the "dawn," this glow is the "aurora" around it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -right-40 h-[640px] w-[640px] rounded-full opacity-20 blur-3xl animate-[spin_34s_linear_infinite] bg-[conic-gradient(from_0deg,theme(colors.cyan.500),theme(colors.emerald.500),theme(colors.violet.500),theme(colors.cyan.500))]"
      />

      <div className="relative z-10 lg:max-w-6xl sm:max-w-3xl mx-auto px-5 lg:px-0 pt-24  pb-12 lg:py-40 lg:pb-20">
        {/* auto-rows (not a forced 1fr) — each row sizes to its own
            content, so Blog isn't inflated to match the thesis card's
            full height. Default align-items (stretch) is left alone,
            so Courses and Journey — which DO share a row — still
            match each other's height, same as any normal grid row. */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Thesis — solid contrasting card: who we are + what we offer.
              Single flex column with one consistent gap between blocks —
              no justify-between, so nothing gets stretched apart. */}
          <BentoCard
            variant="solid"
            className="lg:col-span-2 lg:row-span-2 p-7 lg:p-10 lg:py-5 flex flex-col gap-7"
          >
            <div>
              <span className="inline-block text-[11px] tracking-[0.14em] uppercase text-orange-950/70 font-semibold mb-2">
                {THESIS_CONTENT.eyebrow}
              </span>
              <h1 className="font-roboto text-[2rem] sm:text-[2.1rem] lg:text-[2.3rem] font-bold leading-tight text-cyan-950">
                {THESIS_CONTENT.title}{" "}
                <span className="font-display italic text-amber-700">
                  {THESIS_CONTENT.titleAccent}
                </span>
              </h1>
              <p className="mt-5 text-cyan-950/80 font-roboto font-medium leading-relaxed text-[1rem] lg:text-[1rem] max-w-md">
                {THESIS_CONTENT.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {THESIS_CONTENT.offerBadges.map((badge) => (
                <span
                  key={badge}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-cyan-950/10 text-cyan-950 border border-cyan-950/10"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              <a
                href={THESIS_CONTENT.primaryCta.href}
                className="inline-flex w-fit items-center gap-2 font-semibold font-roboto px-6 py-3 text-cyan-50 bg-amber-600 text-sm rounded-xl transition-all duration-300 hover:bg-cyan-900 hover:scale-[1.03]"
              >
                {THESIS_CONTENT.primaryCta.label}
              </a>

              <Socials />
            </div>
          </BentoCard>

          {/* Courses — real top packages, auto-sliding, each slide
              links to its own real checkout page */}
          <PackagesTeaserCard className="lg:col-span-1" />

          {/* Journey */}
          <BentoCard
            href={JOURNEY_CONTENT.cta.href}
            className="p-4 flex flex-col gap-4 "
          >
            <div>
              <span className="text-[10px] tracking-[0.14em] uppercase text-cyan-100 font-bold">Previous Year Papers</span>
              <PaperListCard />
            </div>
          </BentoCard>

          {/* Blog — a real, already-built page. Content-sized now, not
              stretched to match the thesis card's row-span-2 height. */}
          <BentoCard
            href={BLOG_CONTENT.cta.href}
            className="lg:col-span-2 p-5 flex flex-col gap-1"
          >
            <div>
              <span className="text-[10px] tracking-[0.14em] uppercase text-amber-500 font-bold">
                {BLOG_CONTENT.eyebrow}{" "}
                <span className="text-amber-50"> - BLOG</span>
              </span>
            </div>

            <LatestBlogCard />
          </BentoCard>
        </div>
      </div>
    </div>
  );
}
