/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { Logo } from "./header/Logo";
import { useEffect, useState } from "react";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[13px] font-bold tracking-[0.18em] uppercase text-amber-400 font-sans">
        {title}
      </h4>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-white/80 hover:text-white text-sm font-sans transition-colors duration-200"
            >
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
      id: i, // ✅ stable
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      w: `${Math.random() * 2 + 1}px`,
      opacity: Math.random(),
      amber: Math.random() > 0.7,
    }));

    setStars(generated);
  }, []);
  return (
    <footer className="relative border-t border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto lg:px-0 px-10">
        <div className="pointer-events-none absolute inset-0">
          {/* Deep space */}
          <div className="absolute inset-0 bg-[#020617]" />
          {/* Cyan nebula */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
          {/* Green nebula */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* ── Stars ── */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          {/* FIX: guard against undefined STARS */}
          {(stars ?? []).map((s) => (
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

        <div className="relative z-10 py-8">
          {/* Main grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 pb-10 border-b border-white/[0.06]">
            {/* Brand col */}
            <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-2">
              <div className="w-fit bg-amber-50/90 px-2 py-1 rounded-md">
                <Logo />
              </div>
              <p className="text-white/70 text-sm leading-relaxed font-sans max-w-sm">
                A focused competitive exam preparation platform built for MCA,
                LAW, CAT, and more. Mock tests, e-books, and expert mentorship —
                all in one place.
              </p>
              <div>
                <p className="text-[11px] text-amber-400 font-sans uppercase tracking-widest mb-1">
                  Address
                </p>
                <p className="text-white/70 text-sm font-sans leading-relaxed">
                  Shop 7, Vaibhav Horizon, Bhayander West,
                  <br />
                  Mumbai – 401101
                </p>
              </div>
            </div>

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
                {
                  label: "MAH MCA CET",
                  href: "/exam-info/mah-mca-cet",
                },
                { label: "CUET PG MCA", href: "/exam-info/cuet-pg-mca" },
                { label: "WB JECA", href: "/exam-info/wb-jeca" },
                { label: "IPU CET MCA", href: "/exam-info/ipu-cet-mca" },
                { label: "TANCET", href: "/exam-info/tancet-mca" },
              ]}
            />
          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/20 text-xs font-sans">
              © {new Date().getFullYear()} Crackora. All rights reserved.
            </p>
            <div className="flex gap-5">
              {[
                { label: "Privacy", href: "/privacy-policy" },
                { label: "Terms", href: "/terms-and-conditions" },
                { label: "Refunds", href: "/refund-policy" },
              ].map((m) => (
                <Link
                  key={m.label}
                  href={m.href}
                  className="text-white/70 hover:text-white/50 text-xs font-sans transition-colors duration-200"
                >
                  {m.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
