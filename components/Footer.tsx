"use client";
import Link from "next/link";
import { Logo } from "./header/Logo";

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-amber-400 font-sans">
        {title}
      </h4>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-white/70 hover:text-white/90 text-sm font-sans transition-colors duration-200"
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
  return (
    <footer className="relative  border-t border-white/[0.05] overflow-hidden">
  <div className="absolute inset-0 z-10">
        {/* Deep space base */}
        <div className="absolute inset-0 bg-[#020617]" />

        {/* Cyan nebula */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />

        {/* Green nebula */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.3),transparent_4600%)]" />

        {/* Soft atmospheric diffusion */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04),transparent_120%)]" />

        {/* CSS star texture (no image → faster) */}
        
      </div>
      <div className="absolute top-0 left-0 w-screen h-full bg-[rgba(0,0,0,0.2)] z-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 pt-14 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 pb-10 border-b border-white/[0.06]">

          {/* Brand col */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-2">
            <div className="w-fit bg-amber-50/90 px-2 py-1 rounded-md">
              <Logo />
            </div>
            <p className="text-white/70 text-sm leading-relaxed font-sans max-w-sm">
              A focused competitive exam preparation platform built for MCA, LAW, CAT, and more.
              Mock tests, e-books, and expert mentorship — all in one place.
            </p>
            <div>
              <p className="text-[11px] text-amber-400 font-sans uppercase tracking-widest mb-1">Address</p>
              <p className="text-white/70 text-sm font-sans leading-relaxed">
                Shop 7, Vaibhav Horizon, Bhayander West,<br />Mumbai – 401101
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
            ]}
          />

          <FooterColumn
            title="Exams"
            links={[
              { label: "CAT", href: "/exam-info/cat-exam" },
              { label: "MAH MCA CET", href: "/exam-info/mah-mba-cet-2026-exam" },
              { label: "SLAT", href: "/exam-info/slat-exam" },
              { label: "NPAT", href: "/exam-info/npat" },
            ]}
          />
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs font-sans">
            © {new Date().getFullYear()} Crackora. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Refunds"].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}-policy`}
                className="text-white/70 hover:text-white/50 text-xs font-sans transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}