/* eslint-disable @typescript-eslint/no-explicit-any */
// NOTE: no `any` is actually used anywhere in this file — this disable
// directive appears to be unnecessary/vestigial. Left in per request,
// but safe to delete if lint doesn't complain about it.
"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api.service";
import { Entrance } from "@/interfaces/entrance-interface";
import { getCachedExams } from "@/services/EntranceCache";

/**
 * Homepage "Explore Exams" section.
 *
 * Replaces the sidebar + grid layout from MegaExamInfoMenu with a single
 * flat section: filter chips on top, a card grid below. Nothing lives
 * behind a click — every exam is visible on load.
 *
 * Grouping rule:
 * - An entrance with MORE than one exam gets its own filter chip, and its
 *   exams show under their own titles.
 * - An entrance with EXACTLY one exam gets no chip and no separate
 *   grouping — that single exam is shown directly in the grid, titled
 *   with the entrance's name (e.g. an "MBA" entrance with just "CMAT"
 *   shows one card titled "MBA", not a "CMAT" card buried under an
 *   "MBA" filter with nothing else in it).
 */

type GridExam = {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  entranceTitle: string;
  entranceId: string;
};

export function ExploreExamsSection() {
  const [entrances, setEntrances] = useState<Entrance[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    getCachedExams()
      .then(setEntrances)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Only entrances with more than one exam become filter chips.
  const chipEntrances = useMemo(
    () => entrances.filter((e) => e.exams.length > 1),
    [entrances],
  );

  // Flatten everything into one list of cards, applying the grouping rule
  // above for single-exam entrances.
  const allExams: GridExam[] = useMemo(() => {
    return entrances.flatMap((entrance) => {
      const entranceId = entrance.id ?? entrance.title ?? "";

      if (entrance.exams.length === 1) {
        const exam = entrance.exams[0];
        return [
          {
            // FIX: exam.slug is `string | undefined` on the source type,
            // but GridExam.slug is required `string`. Fall back to "" so
            // the shape matches (mirrors the entranceId fallback above).
            slug: exam.slug ?? "",
            title: entrance.title,
            description: exam.description,
            icon: exam.icon,
            entranceTitle: entrance.title,
            entranceId,
          },
        ];
      }

      return entrance.exams.map((exam) => ({
        // FIX: same reasoning as above.
        slug: exam.slug ?? "",
        title: exam.title,
        description: exam.description,
        icon: exam.icon,
        entranceTitle: entrance.title,
        entranceId,
      }));
    });
  }, [entrances]);

  const visibleExams = useMemo(
    () =>
      activeFilter === "all"
        ? allExams
        : allExams.filter((exam) => exam.entranceId === activeFilter),
    [allExams, activeFilter],
  );

  // UNUSED: totalExams is only ever "used" inside the JSX comment below
  // (`{/* ${totalExams} exams... */}`), which is a plain comment, not a
  // template literal — so this doesn't count as a real reference. As
  // written, this variable is dead code / will trigger no-unused-vars.
  const totalExams = allExams.length;

  const handleExamClick = (slug: string) => {
    router.push(`/exam-info/${slug}`);
  };

  return (
    <section className="bg-[#f8f7f4] py-14 lg:px-5 px-10 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-cyan-900 leading-tight tracking-tight">
            MCA Exams we <span className="text-amber-600">Cover</span>
          </h2>
          <p className="text-sm text-[#05101f]/60 mt-1">
            {loading ? "Loading exams..." : ``}
          </p>
        </div>
        {/* ${totalExams} exams across ${entrances.length} categories — pick one to see syllabus, mock tests and cutoffs. */}
        {/* Filter chips — only entrances with more than one exam appear here */}
        {chipEntrances.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2  -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
            {/* <button
              onClick={() => setActiveFilter("all")}
              className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === "all"
                  ? "bg-cyan-900 text-white"
                  : "bg-white text-[#05101f]/70 border border-[#e8e4dc] hover:border-amber-300"
              }`}
            >
              All exams
            </button> */}
            {/* {chipEntrances.map((entrance) => {
              const id = entrance.id ?? entrance.title ?? "";
              const selected = activeFilter === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveFilter(id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selected
                      ? "bg-cyan-900 text-white"
                      : "bg-white text-[#05101f]/70 border border-[#e8e4dc] hover:border-amber-300"
                  }`}
                >
                  {entrance.title}
                  <span
                    className={`ml-1.5 text-[11px] ${
                      selected ? "text-white/70" : "text-amber-600"
                    }`}
                  >
                    {entrance.exams.length}
                  </span>
                </button>
              );
            })} */}
          </div>
        )}

        {/* Card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-xl border border-[#e8e4dc] bg-white/60 animate-pulse"
              />
            ))}

          {!loading && visibleExams.length === 0 && (
            <p className="col-span-full text-center text-sm text-[#05101f]/40 py-10">
              No exams found in this category yet.
            </p>
          )}

          {!loading &&
            visibleExams.map((exam) => (
              <button
                key={exam.slug}
                onClick={() => handleExamClick(exam.slug)}
                data-examcard={exam.title}
                className="group flex flex-col items-center text-center gap-2 bg-white border border-[#e8e4dc] hover:border-amber-300 rounded-xl p-4 transition-all duration-200 shadow-[0_4px_16px_rgba(5,16,31,0.05)] hover:shadow-[0_4px_16px_rgba(5,16,31,0.12)] hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#e8e4dc] bg-[#f8f7f4] shrink-0">
                  <Image
                    src={`${API_BASE_URL}/public/${exam.icon || ""}`}
                    alt={exam.title || ""}
                    fill
                    unoptimized
                    className="object-contain p-2"
                  />
                </div>

                <p
                  className="text-[13px] font-semibold text-cyan-900 group-hover:text-amber-600 transition-colors leading-snug"
                  data-examcard-title={exam.title}
                >
                  {exam.title}
                </p>

                {/* Entrance tag — only shown in the mixed "All" view, and
                    only for cards where it adds info (i.e. not the
                    single-exam entrances, whose title already IS the
                    entrance name) */}
                {activeFilter === "all" &&
                  exam.entranceTitle !== exam.title && (
                    <span className="text-[10px] uppercase tracking-wide text-amber-800/80 font-semibold">
                      {exam.entranceTitle}
                    </span>
                  )}

                <span className="text-[11px] text-[#05101f]/60 line-clamp-2">
                  {exam.description || "Syllabus, mock tests & analytics"}
                </span>
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}