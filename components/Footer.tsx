"use client";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "./header/Logo";

export function Footer() {
  return (
    <footer className="bg-gray-900/95 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        
        {/* Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Logo + Address */}
          <div className="flex flex-col gap-4 lg:col-span-2 justify-start">
            <Logo/>
            <p className="text-sm text-white/60 leading-relaxed">
              <span className="font-semibold text-amber-400">Address:</span>{" "}
              Shop 7, Vaibhav Horizon, Bhayander West, Mumbai – 401101
            </p>

            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Crackora. All rights reserved.
            </p>
          </div>

          {/* Column */}
          <FooterColumn
            title="Company"
            links={[
              { label: "About Us", href: "/about-us" },
              { label: "Disclaimer", href: "/disclaimer" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Refund & Cancellation Policy", href: "/refund-policy" },
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

          {/* <FooterColumn
            title="Quick Links"
            links={[
              { label: "Demo Lectures", href: "/demo" },
              { label: "Study Planner", href: "/planner" },
              { label: "Blogs", href: "/blogs" },
              { label: "FAQs", href: "/faqs" },
            ]}
          />
           <FooterColumn
            title="Resources"
            links={[
              { label: "Demo Lectures", href: "/demo" },
              { label: "Study Planner", href: "/planner" },
              { label: "Blogs", href: "/blogs" },
              { label: "FAQs", href: "/faqs" },
            ]}
          /> */}
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------- */
/* Footer Column Component */
/* ----------------------------- */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">
        {title}
      </h4>
      <ul className="flex flex-col gap-2 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-white/60 hover:text-amber-400 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
