"use client";
/*
  ToolsPage.tsx
  Place at: components/tools/ToolsPage.tsx

  SEO fixes (keeping "use client" since TOOL_LIST contains JSX):
  1. Sidebar buttons → <Link href> (Googlebot can now crawl all 6 tool URLs)
  2. Mobile <select onChange> → <nav> of <Link> pills (crawlable on mobile too)
  3. Removed useRouter — no longer needed
*/

import Link from "next/link";
import { EXAM_META, type ExamKey } from "@/data/mca-tools-data";
import { STARS } from "@/lib/util";
import { TOOL_LIST, ToolKey } from "@/components/tools/tools-util";

export default function ToolsClient({ slug }: { slug: ToolKey }) {
  const activeTool = TOOL_LIST.find((t) => t.id === slug) ?? TOOL_LIST[0];

  return (
    <main className="min-h-screen bg-gray-50/40 lg:mt-10 mt-8">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100 relative">
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

        <div className="relative max-w-6xl mx-auto py-10 px-5 sm:px-8 sm:py-14 z-20">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-amber-600 text-[11px] font-bold tracking-widest uppercase border border-amber-200 bg-amber-50 px-2.5 py-1 rounded-full">
              100% Free
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400 text-[11px]">No login required</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400 text-[11px]">
              All 6 MCA entrance exams
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-600 leading-tight mb-3">
            Free Tools for MCA Entrance Prep
          </h1>
          <p className="text-gray-300 text-[12px] sm:text-[15px] max-w-2xl leading-relaxed mb-6">
            6 tools built on official cutoff data from NIMCET, MAH MCA CET,
            TANCET, IPU CET, WB JECA, and CUET PG. Each tool is designed for a
            specific stage of your MCA journey — from deciding to apply, through
            preparation, to choosing a college.
          </p>

          {/* Exam dates strip */}
          <div className="flex flex-wrap gap-2">
            {(
              Object.entries(EXAM_META) as [
                ExamKey,
                (typeof EXAM_META)[ExamKey],
              ][]
            ).map(([key, m]) => (
              <div
                key={key}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border sm:text-xs text-[11px]"
                style={{
                  backgroundColor: m.bgColor,
                  borderColor: m.borderColor,
                  color: m.color,
                }}
              >
                <span className="font-bold">{m.shortName}</span>
                <span className="opacity-60">·</span>
                <span>{m.examDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {[
              { v: "6", l: "Tools" },
              { v: "6", l: "Exams covered" },
              { v: "40+", l: "Colleges in predictor" },
              { v: "3 yrs", l: "Cutoff history (2023–2025)" },
              { v: "5", l: "College tiers in salary data" },
            ].map((s) => (
              <div key={s.l} className="flex items-center gap-1.5">
                <span className="text-amber-600 font-bold text-sm">{s.v}</span>
                <span className="text-gray-600 text-xs">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10">

        {/* Mobile nav — <Link> pills instead of <select>, so URLs are crawlable */}
        <nav className="md:hidden mb-4 flex flex-wrap gap-2" aria-label="MCA tools">
          {TOOL_LIST.map((t) => (
            <Link
              key={t.id}
              href={`/tools/${t.id}`}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                slug === t.id
                  ? "bg-amber-600 text-white shadow"
                  : "bg-white border border-gray-200 text-cyan-900 hover:bg-gray-50"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.title}</span>
            </Link>
          ))}
        </nav>

        <div className="flex gap-6">
          {/* Sidebar — <Link href> instead of <button onClick>, so URLs are crawlable */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <nav
                className="bg-white border border-gray-200 rounded-2xl p-2 shadow-sm"
                aria-label="MCA tools navigation"
              >
                {TOOL_LIST.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tools/${t.id}`}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium mb-1 transition-all ${
                      slug === t.id
                        ? "bg-amber-600 text-white shadow"
                        : "text-cyan-900 hover:bg-gray-100"
                    }`}
                    aria-current={slug === t.id ? "page" : undefined}
                  >
                    <span className="text-lg" aria-hidden="true">{t.icon}</span>
                    <div className="flex flex-col items-start">
                      <span>{t.title}</span>
                      <span className="text-[10px] opacity-70">{t.when}</span>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right content */}
          <section className="flex-1 min-w-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-cyan-900">
                  {activeTool.title}
                </h2>
                <div className="h-0.5 w-12 bg-amber-500 rounded-full mb-5" />
                <p className="text-sm text-gray-500 mt-1">
                  {activeTool.description}
                </p>
              </div>
              <div>{activeTool.component}</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}