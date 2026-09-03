// ─────────────────────────────────────────────────────
// HeroBanner.tsx — SERVER COMPONENT (no "use client")
//
// Replaces the old split hero + carousel with a bento grid: one
// large "thesis" cell (headline + CTA) alongside cells for each
// exam track and the MCA journey. Every cell is a glass panel
// (translucent + blurred), so the starfield and aurora glow
// behind it stay visible through all of them — nothing here is
// an opaque box sitting on top of the background.
//
// Only the star canvas needs the browser (<StarField/>, its own
// "use client" file). Everything else — layout, copy, links — is
// plain server-rendered markup, so this section ships with far
// less client JS than the previous Swiper-based version.
// ─────────────────────────────────────────────────────

import type { ReactNode } from "react";
import Link from "next/link";
import { StarField } from "./StarField";
import { Socials } from "./SocialButtons";
import {
  THESIS_CONTENT,
  JOURNEY_CONTENT,
} from "../data/hero-data";

// Shared glass-panel shell every bento cell uses. bg-white/[0.04] +
// backdrop-blur is what keeps the background "in" every card instead
// of hidden behind it.
function BentoCard({
  children,
  className = "",
  href,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  const classes = `group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <div className={classes}>{children}</div>;
}

export function HeroBanner() {
  return (
    <div className="relative w-full overflow-hidden mt-5 bg-[#020817]">
      {/* Background layers — pure CSS, server-rendered, unchanged from before */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_60%)]" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <StarField />

      {/* Aurora signature: a slow-rotating conic gradient behind the
          thesis cell — the one deliberate flourish, everything else
          stays quiet. It's also the "aurora" half of the name, made
          literal instead of just a color choice. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-56 -left-40 h-[640px] w-[640px] rounded-full opacity-25 blur-3xl animate-[spin_34s_linear_infinite] bg-[conic-gradient(from_0deg,theme(colors.cyan.500),theme(colors.emerald.500),theme(colors.amber.400),theme(colors.violet.500),theme(colors.cyan.500))]"
      />

      <div className="relative z-10 lg:max-w-6xl sm:max-w-3xl mx-auto px-5 lg:px-0 pt-24 lg:pt-32 pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-5 lg:auto-rows-[1fr]">
          {/* Thesis cell — headline, subcopy, primary CTA, socials */}
          <BentoCard className="lg:col-span-2 lg:row-span-2 p-7 lg:p-10 flex flex-col justify-between">
            <div>
              <span className="inline-block text-[11px] tracking-[0.14em] uppercase text-amber-300/80 font-medium mb-5">
                {THESIS_CONTENT.eyebrow}
              </span>
              <h1 className="font-roboto text-[2rem] sm:text-[2.4rem] lg:text-[2.75rem] font-bold leading-tight text-white">
                {THESIS_CONTENT.title}{" "}
                <span className="text-amber-400 font-display italic">
                  {THESIS_CONTENT.titleAccent}
                </span>
              </h1>
              <p className="mt-5 text-amber-50/80 font-roboto font-light leading-relaxed text-[1rem] lg:text-[1.1rem] max-w-md">
                {THESIS_CONTENT.description}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-6">
              <Link
                href={THESIS_CONTENT.primaryCta.href}
                className="inline-flex w-fit items-center border border-white/25 font-medium font-roboto px-6 py-3 text-white bg-green-600 text-sm rounded-xl transition-all duration-300 hover:bg-green-500 hover:border-green-500 hover:scale-[1.03]"
              >
                {THESIS_CONTENT.primaryCta.label}
              </Link>
              <Socials />
            </div>
          </BentoCard>

          {/* Exam track cells — MCA, Law */}
    

          {/* Journey cell — the differentiator, spans both exam columns */}
          <BentoCard
            href={JOURNEY_CONTENT.cta.href}
            className="lg:col-span-2 p-6 lg:p-7 flex flex-col sm:flex-row sm:items-center gap-5"
          >
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-semibold font-roboto">
              {JOURNEY_CONTENT.mentor.initials}
            </div>
            <div className="flex-1">
              <span className="text-[10px] tracking-[0.14em] uppercase text-cyan-300/70 font-medium">
                {JOURNEY_CONTENT.eyebrow}
              </span>
              <h2 className="mt-1 font-roboto text-lg font-bold text-white">
                {JOURNEY_CONTENT.title}
              </h2>
              <p className="mt-2 text-sm text-amber-50/60 font-roboto leading-relaxed max-w-xl">
                {JOURNEY_CONTENT.description}
              </p>
            </div>
            <span className="flex-shrink-0 inline-flex items-center gap-1 text-sm font-medium text-amber-400 group-hover:gap-2 transition-all">
              {JOURNEY_CONTENT.cta.label} <span aria-hidden="true">→</span>
            </span>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}