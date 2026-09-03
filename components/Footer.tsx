/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Logo } from "./header/Logo";
import { useEffect, useState } from "react";
import { Socials } from "./SocialButtons";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Section heading with amber left-bar accent */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className="block w-[3px] h-4 rounded-full"
          style={{ background: "linear-gradient(180deg,#f59e0b,#d97706)" }}
          aria-hidden="true"
        />
        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-400 font-sans">
          {title}
        </h4>
      </div>

      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="
                group inline-flex items-center gap-1.5
                text-white/55 hover:text-white
                text-[13px] font-sans
                transition-colors duration-200
              "
            >
              {/* tiny arrow that slides in on hover */}
              <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-amber-400 text-[10px]">
                ›
              </span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      w: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.6 + 0.1,
      amber: Math.random() > 0.75,
    }));
    setStars(generated);
  }, []);

  return (
    <footer className="relative border-t border-white/5 overflow-hidden">

      {/* ── Top gradient rule — amber glow line ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.5) 30%, rgba(245,158,11,0.7) 50%, rgba(245,158,11,0.5) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Background layers ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,0.9),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,rgba(245,158,11,0.05),transparent_55%)]" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* ── Stars ── */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {stars.map((s) => (
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

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto px-5 sm:px-6 lg:px-8 lg:max-w-6xl sm:max-w-3xl">
        <div className="py-10 sm:py-12 lg:py-14">

          {/* ── Main grid ── */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-[1.8fr_1fr_1fr]
              xl:grid-cols-[2fr_1fr_1fr]
              gap-10 lg:gap-14 xl:gap-20
              pb-10
              border-b border-white/6
            "
          >
            {/* ── Brand column ── */}
            <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">

              {/* Logo pill */}
              <div className="w-fit rounded-lg overflow-hidden bg-amber-50/90 px-2 py-1 shadow-md shadow-amber-900/30">
                <Logo />
              </div>

              <p className="text-white/60 text-[13.5px] leading-[1.75] font-sans max-w-sm">
                A focused competitive exam preparation platform built for MCA,
                LAW, CAT, and more. Mock tests, e-books, and expert mentorship —
                all in one place.
              </p>

              {/* Address block */}
              <div
                className="rounded-xl px-4 py-3 flex flex-col gap-1"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-[10px] text-amber-400 font-sans uppercase tracking-[0.18em] font-bold mb-0.5">
                  Our Office
                </p>
                <p className="text-white/60 text-[13px] font-sans leading-relaxed">
                  Shop 7, Vaibhav Horizon, Bhayander West,
                  <br />
                  Mumbai – 401101
                </p>
              </div>

              {/* Social buttons */}
              <div>
                <Socials />
              </div>
            </div>

            {/* ── Link columns — Company & Exams ── */}
            {/* On mobile they sit side-by-side in a 2-col subgrid */}
            <div className="grid grid-cols-2 gap-8 sm:contents">
              <FooterColumn
                title="Company"
                links={[
                  { label: "About Us", href: "/about-us" },
                  { label: "Disclaimer", href: "/disclaimer" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Refund Policy", href: "/refund-policy" },
                  { label: "Terms & Conditions", href: "/terms-and-conditions" },
                ]}
              />

              <FooterColumn
                title="Exams"
                links={[
                  { label: "NIMCET", href: "/exam-info/nimcet" },
                  { label: "MAH MCA CET", href: "/exam-info/mah-mca-cet" },
                  { label: "CUET PG MCA", href: "/exam-info/cuet-pg-mca" },
                  { label: "WB JECA", href: "/exam-info/wb-jeca" },
                  { label: "IPU CET MCA", href: "/exam-info/ipu-cet-mca" },
                  { label: "TANCET", href: "/exam-info/tancet-mca" },
                ]}
              />
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/25 text-[11.5px] font-sans text-center sm:text-left">
              © {new Date().getFullYear()} Crackora. All rights reserved.
            </p>

            <div className="flex items-center gap-1">
              {[
                { label: "Privacy", href: "/privacy-policy" },
                { label: "Terms", href: "/terms-and-conditions" },
                { label: "Refunds", href: "/refund-policy" },
              ].map((m, i, arr) => (
                <span key={m.label} className="flex items-center">
                  <Link
                    href={m.href}
                    className="
                      text-white/40 hover:text-amber-400
                      text-[11.5px] font-sans
                      transition-colors duration-200
                      px-2 py-0.5 rounded
                      hover:bg-amber-400/5
                    "
                  >
                    {m.label}
                  </Link>
                  {i < arr.length - 1 && (
                    <span className="text-white/10 text-xs" aria-hidden="true">
                      |
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}