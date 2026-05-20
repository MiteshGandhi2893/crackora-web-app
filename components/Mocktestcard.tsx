// ─── MockTestCard ────────────────────────────────────
// Drop-in replacement for PlatformPanel on slide 1.
// Mirrors the MentorCard visual language (dark teal header,
// white body, amber accents) but surfaces the Free Mock Test offer.
//
// USAGE — in RightPanel, replace:
//   if (type === "orbit") return <PlatformPanel />;
// with:
//   if (type === "orbit") return <MockTestCard />;
//
// You can delete PlatformPanel entirely if you no longer need it.

import Link from "next/link";

const MOCK_FEATURES = [
  { icon: "📝", label: "Live Test", sub: "Full-length NIMCET pattern" },
  { icon: "📋", label: "120 Questions", sub: "MCQs across all sections" },
  { icon: "🏆", label: "1000 Marks", sub: "Exact NIMCET scoring" },
  { icon: "⏱️", label: "2h Duration", sub: "Timed, section-locked" },
  { icon: "💡", label: "Detailed Solutions", sub: "Every question explained" },
  { icon: "📊", label: "Rank Estimate", sub: "Know where you stand" },
] as const;

export const MockTestCard = function MockTestCard() {
  return (
    <div className="w-full flex lg:justify-end justify-center select-none">
      <div className="w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[380px] xl:max-w-[400px] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">

        {/* ── Header band — dark teal, matches MentorCard ── */}
        <div
          className="relative px-4 pt-4 pb-5"
          style={{
            background:
              "linear-gradient(135deg, #0d3d4f 0%, #0a2a38 60%, #071e2a 100%)",
          }}
        >
          {/* FREE badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{ background: "rgba(245,158,11,0.18)", color: "#fbbf24" }}
            >
              ✦ FREE — No Sign-up Required
            </span>
          </div>

          {/* Title */}
          <h3 className="text-white font-extrabold text-[15px] sm:text-[16px] leading-snug uppercase tracking-wide mb-1">
            NIMCET-2026{" "}
            <span style={{ color: "#fbbf24" }}>FREE MOCK TEST</span>
          </h3>
          <p className="text-[12px] text-cyan-300/80">
            Mock Test with Detailed Solutions for Every Question.
          </p>

          {/* Decorative device strip */}
          <div
            className="mt-4 rounded-xl overflow-hidden flex items-center justify-center gap-3 px-3 py-3"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Mini screen icons — decorative */}
            {["💻", "🖥️", "📱"].map((emoji) => (
              <span key={emoji} className="text-2xl opacity-70">
                {emoji}
              </span>
            ))}
            <span className="text-[11px] text-white/50 ml-1">
              Attempt on any device
            </span>
          </div>
        </div>

        {/* ── White body ── */}
        <div className="bg-white px-4 pt-4 pb-5">

          {/* Validity */}
          <div className="flex items-center gap-1.5 mb-4 text-gray-500 text-[12px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#9ca3af" strokeWidth="1.5" />
              <path
                d="M12 7v5l3 3"
                stroke="#9ca3af"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Valid for 31 days · Access anytime
          </div>

          {/* What's included heading */}
          <p className="text-gray-700 font-semibold text-[13px] mb-2">
            What`s included
          </p>

          {/* Features grid */}
          <ul className="space-y-1.5 mb-5">
            {MOCK_FEATURES.map((f) => (
              <li key={f.label} className="flex items-center gap-2">
                <svg
                  className="shrink-0"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <circle cx="7.5" cy="7.5" r="7.5" fill="#f59e0b" />
                  <path
                    d="M4.5 7.5 L6.5 9.5 L10.5 5.5"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-gray-800 text-[13px] font-medium leading-tight">
                  {f.label}
                </span>
                <span className="text-gray-400 text-[11px] leading-tight">
                  — {f.sub}
                </span>
              </li>
            ))}
          </ul>

          {/* Price row — FREE */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-gray-400 text-lg line-through">₹499</span>
              <span className="text-amber-600 text-2xl font-bold">FREE</span>
            </div>
            <span className="text-xs text-green-700 border border-green-200 bg-green-50 px-2 py-0.5 rounded-full font-bold">
              100% OFF
            </span>
          </div>

          {/* CTA */}
          <Link
            href="https://learn.crackora.com/learn/NIMCET-2026-FREE-Mock-Test-with-Detailed-Solutions"
            target="_blank"
          >
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-[14px] transition-all duration-300 hover:shadow-lg hover:shadow-cyan-700/30 cursor-pointer tracking-wide">
              ENROLL FOR FREE →
            </button>
          </Link>
          <p className="text-center text-gray-400 text-[11px] mt-1.5">
            Exam on June 6 · 25,000 aspirants · 1,003 NIT seats
          </p>
        </div>
      </div>
    </div>
  );
};