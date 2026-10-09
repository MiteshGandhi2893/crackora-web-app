// src/components/course-catalog/CourseCatalog.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bricolage_Grotesque } from "next/font/google";
import { BiChevronDown, BiRefresh } from "react-icons/bi";

import { CoursePackageCard } from "@/components/course-card/CourseCard"; // TODO: adjust import path
import type { PackageCategory } from "@/interfaces/CoursePackage.interface";
import { formatList, type EntranceGroup } from "@/lib/course-catalog";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
});

// Collapsed grid shows 2 rows: 6 cards on md (3 cols), 8 cards on lg+ (4 cols).
const MD_LIMIT = 6;
const LG_LIMIT = 8;

const noop = () => {};

const hideScrollbar = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

interface CourseCatalogProps {
  entrances: EntranceGroup[];
  error?: boolean;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const scrollToId = (id: string, block: ScrollLogicalPosition = "start") => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block });
};

export function CourseCatalog({ entrances, error = false }: CourseCatalogProps) {
  const router = useRouter();

  const [entranceId, setEntranceId] = useState<string | null>(
    entrances[0]?.id ?? null,
  );
  const [filter, setFilter] = useState<PackageCategory | "all">("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const active = entrances.find((e) => e.id === entranceId) ?? entrances[0];

  // If the chosen category doesn't exist for the newly selected exam, fall back to "all".
  const activeFilter: PackageCategory | "all" =
    active &&
    filter !== "all" &&
    active.categories.some((c) => c.category === filter)
      ? filter
      : "all";

  const visibleCategories = active
    ? active.categories.filter(
        (c) => activeFilter === "all" || c.category === activeFilter,
      )
    : [];

  const activeTotal = active
    ? active.categories.reduce((n, c) => n + c.items.length, 0)
    : 0;

  const selectEntrance = (id: string) => {
    setEntranceId(id);
    setFilter("all");
  };

  const toggleExpanded = (key: string, sectionId: string) => {
    const isOpen = !!expanded[key];
    setExpanded((prev) => ({ ...prev, [key]: !isOpen }));
    if (isOpen) scrollToId(sectionId);
  };

  const hasData = !error && entrances.length > 0;

  // H1 is built from the real exam names, so it always matches the catalogue
  // and the <title>/meta description that page.tsx generates from the same data.
  const examList = formatList(
    entrances.map((e) => e.label),
    4,
  );
  const heading = examList
    ? `Online Mentorship for ${examList} entrance exams`
    : "Online Mentorship for entrance exams";

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-cyan-950">
      {/* ───────────── Hero ───────────── */}
      <section
        aria-labelledby="catalog-title"
        className="relative overflow-hidden rounded-b-[2rem] bg-cyan-950 text-white md:rounded-b-[3rem] "
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[size:22px_22px]"
        />

        <div className="relative mx-auto max-w-7xl px-7 py-12 pt-25 sm:px-6 sm:pt-25 sm:pb-14 lg:px-8 lg:pt-50 lg:pb-20 ">
          <h1
            id="catalog-title"
            className={`${display.className} max-w-4xl text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl`}
          >
            {heading}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-cyan-100/75 sm:text-lg">
            Live batches, self-study material, mock tests and e-books in one
            place, so you can prepare the way that suits you.
          </p>
        </div>
      </section>

      {/* ───────────── Catalogue ───────────── */}
      <div id="catalog" className="scroll-mt-4">
        {/* Error */}
        {error && (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
            <p className="text-base text-cyan-950/70">
              We couldn&apos;t load the courses. Check your connection and try
              again.
            </p>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="inline-flex items-center gap-2 rounded-full border-2 border-cyan-950 px-5 py-2.5 text-[15px] font-semibold transition-colors hover:bg-cyan-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 motion-reduce:transition-none"
            >
              <BiRefresh className="h-5 w-5" aria-hidden />
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!error && entrances.length === 0 && (
          <p className="mx-auto max-w-md px-4 py-20 text-center text-base text-cyan-950/70">
            No courses are live right now. New batches are added often, so check
            back soon.
          </p>
        )}

        {hasData && active && (
          <>
            {/* Exam picker (only when there is more than one exam) */}
            {entrances.length > 1 && (
              <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 md:pt-12 lg:px-8">
                <p className="text-sm font-medium text-cyan-950/60">
                  Choose your exam
                </p>
                <div
                  role="tablist"
                  aria-label="Exam"
                  className={`-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 ${hideScrollbar}`}
                >
                  {entrances.map((entrance) => {
                    const isActive = entrance.id === active.id;
                    return (
                      <button
                        key={entrance.id}
                        role="tab"
                        aria-selected={isActive}
                        type="button"
                        onClick={() => selectEntrance(entrance.id)}
                        className={`shrink-0 rounded-full border-2 px-4 py-2 text-[15px] font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 motion-reduce:transition-none md:px-5 md:py-2.5 md:text-base ${
                          isActive
                            ? "border-cyan-950 bg-cyan-950 text-white"
                            : "border-cyan-950/15 bg-white text-cyan-950 hover:border-cyan-950/40"
                        }`}
                      >
                        {entrance.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category filter (sticky) */}
            {active.categories.length > 1 && (
              <div className="sticky top-[var(--site-header-h,0px)] z-30 mt-6 border-b border-cyan-950/10 bg-[#f8f7f4] backdrop-blur-md ">
                <div
                  className={`mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8 ${hideScrollbar}`}
                >
                  <button
                    type="button"
                    aria-pressed={activeFilter === "all"}
                    onClick={() => setFilter("all")}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 motion-reduce:transition-none ${
                      activeFilter === "all"
                        ? "bg-amber-500 text-cyan-950"
                        : "bg-white text-cyan-950/80 ring-1 ring-cyan-950/15 hover:ring-cyan-950/40"
                    }`}
                  >
                    All ({activeTotal})
                  </button>

                  {active.categories.map(({ category, groupLabel, items }) => {
                    const isActive = activeFilter === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setFilter(category)}
                        className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 motion-reduce:transition-none ${
                          isActive
                            ? "bg-amber-500 text-cyan-950"
                            : "bg-white text-cyan-950/80 ring-1 ring-cyan-950/15 hover:ring-cyan-950/40"
                        }`}
                      >
                        {groupLabel} ({items.length})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sections */}
            <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 md:gap-16 md:py-12 lg:px-8">
              {visibleCategories.map(({ category, groupLabel, items }) => {
                const key = `${active.id}-${category}`;
                const sectionId = `section-${key}`;
                const isExpanded = !!expanded[key];
                const total = items.length;

                return (
                  <section
                    key={key}
                    id={sectionId}
                    aria-labelledby={`${sectionId}-title`}
                    className="scroll-mt-28"
                  >
                    <div className="mb-4 flex items-baseline justify-between gap-4 md:mb-6">
                      {/* "Live Batches for MCA" carries the keyword; plain "Live Batches" doesn't. */}
                      <h2
                        id={`${sectionId}-title`}
                        className={`${display.className} text-2xl font-bold sm:text-3xl font-roboto text-amber-700 uppercase border-b-3 border-b-cyan-700`}
                      >
                        {groupLabel}
                      </h2>
                      <span className="shrink-0 text-sm text-cyan-950/60">
                        {plural(total, "course")}
                      </span>
                    </div>

                    {/*
                      Mobile: one horizontal swipe rail with snap points.
                      md+:    catalogue grid (3 cols on md, 4 cols on lg+).
                      Same DOM for both, so no JS breakpoint logic and no hydration flicker.
                      Cards hidden by "View all" are only CSS-hidden, so they stay in the HTML for crawlers.
                    */}
                    <div
                      className={`-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 lg:gap-6 ${hideScrollbar}`}
                    >
                      {items.map((pkg, idx) => {
                        let collapsedClass = "";
                        if (!isExpanded) {
                          if (idx >= LG_LIMIT) collapsedClass = "md:hidden";
                          else if (idx >= MD_LIMIT)
                            collapsedClass = "md:hidden lg:block";
                        }

                        return (
                          <div
                            key={`${key}-${pkg.id}`}
                            className={`w-[82%] max-w-[330px] shrink-0 snap-start sm:w-[58%] md:w-auto md:max-w-none [&>*]:h-full ${collapsedClass}`}
                          >
                            <CoursePackageCard
                              topPackage={pkg}
                              onClose={noop}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* View more: md+ only, and only when something is actually hidden */}
                    {total > MD_LIMIT && (
                      <div
                        className={`mt-8 hidden justify-center md:flex ${
                          total <= LG_LIMIT ? "lg:hidden" : ""
                        }`}
                      >
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() => toggleExpanded(key, sectionId)}
                          className="inline-flex items-center gap-2 rounded-full border-2 border-cyan-950 px-6 py-3 text-[15px] font-semibold transition-colors hover:bg-cyan-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 motion-reduce:transition-none"
                        >
                          {isExpanded
                            ? "Show fewer"
                            : `View all ${total} ${groupLabel.toLowerCase()}`}
                          <BiChevronDown
                            aria-hidden
                            className={`h-5 w-5 transition-transform motion-reduce:transition-none ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}