/* eslint-disable react-hooks/set-state-in-effect */
// course-mobile-menu.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { BiX, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import {
  MenuPackage,
  PackageCategory,
} from "@/interfaces/CoursePackage.interface";
import { CoursePackageCard } from "@/components/course-card/CourseCard"; // TODO: adjust import path
import { packageService } from "@/services/courses.service"; // TODO: adjust path if different

const PACKAGE_TYPE_LABELS: Record<PackageCategory, string> = {
  self_study: "Self Study",
  live_course: "Live Batches",
  mock_test: "Mock Tests",
  ebook: "E-books",
};

const PACKAGE_TYPE_ORDER: PackageCategory[] = Object.keys(
  PACKAGE_TYPE_LABELS,
) as PackageCategory[];

interface EntranceGroup {
  id: string;
  label: string;
  categories: {
    category: PackageCategory;
    groupLabel: string;
    items: MenuPackage[];
  }[];
}

// Same grouping logic as your original buildPackageEntrances — keeps the
// full MenuPackage objects, and now also dedupes by pkg.id (the API can
// return the same package more than once, e.g. via a join against
// multiple exam rows), which is what was producing duplicate React keys.
const buildPackageEntrances = (pkgs: MenuPackage[]): EntranceGroup[] => {
  const seenIds = new Set<string>();
  const deduped = pkgs.filter((p) => {
    if (seenIds.has(p.id)) return false;
    seenIds.add(p.id);
    return true;
  });

  const entranceMap = new Map<
    string,
    { id: string; name: string; items: MenuPackage[] }
  >();

  deduped.forEach((p) => {
    if (!entranceMap.has(p.entrance_id)) {
      entranceMap.set(p.entrance_id, {
        id: p.entrance_id,
        name: p.entrance_name,
        items: [],
      });
    }
    entranceMap.get(p.entrance_id)!.items.push(p);
  });

  return Array.from(entranceMap.values()).map((entrance) => {
    const byType = new Map<PackageCategory, MenuPackage[]>();
    entrance.items.forEach((p) => {
      if (!byType.has(p.category)) byType.set(p.category, []);
      byType.get(p.category)!.push(p);
    });

    const orderedTypes = PACKAGE_TYPE_ORDER.filter((t) => byType.has(t));

    const categories = orderedTypes.map((type) => ({
      category: type,
      groupLabel: PACKAGE_TYPE_LABELS[type],
      items: byType.get(type)!,
    }));

    return {
      id: entrance.id,
      label: entrance.name,
      categories,
    };
  });
};

// Turns an id into a safe CSS class fragment (ids can contain characters
// that aren't valid in a class selector).
const slugForClass = (value: string) => value.replace(/[^a-zA-Z0-9-_]/g, "");

export function CourseMobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [packages, setPackages] = useState<MenuPackage[]>([]);
  const [selectedEntranceId, setSelectedEntranceId] = useState<string | null>(
    null,
  );
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!open || hasFetched) return;

    let cancelled = false;
    setLoading(true);
    setError(false);

    packageService
      .getActiveForMenu()
      .then((data) => {
        if (cancelled) return;
        setPackages(data);
        setHasFetched(true);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load menu packages", err);
        setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, hasFetched]);

  // lock body scroll while panel is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const entrances = useMemo(() => buildPackageEntrances(packages), [packages]);

  useEffect(() => {
    if (!selectedEntranceId && entrances.length > 0) {
      setSelectedEntranceId(entrances[0].id);
    }
  }, [entrances, selectedEntranceId]);

  const activeEntrance =
    entrances.find((e) => e.id === selectedEntranceId) ?? entrances[0];

  const singleEntrance = entrances.length === 1;

  const handleRetry = () => {
    setHasFetched(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel — slides right to left */}
      <div
        className={`fixed top-0 right-0 h-full w-[100%]  bg-white z-50 shadow-2xl
          flex flex-col transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-amber-600/20 shrink-0">
          <h2 className="text-cyan-950 font-semibold text-[15px]">
            Explore Courses
          </h2>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1 rounded-md text-cyan-950/70 hover:bg-amber-50 cursor-pointer"
          >
            <BiX className="w-6 h-6" />
          </button>
        </div>

        {/* Entrance — pill slider when there's more than one, plain title when there's only one */}
        {!loading && !error && entrances.length > 1 && (
          <div className="px-4 pt-3 pb-2 border-b border-amber-600/20 shrink-0">
            <span className="text-[8px] font-bold tracking-[0.14em] uppercase text-amber-900/50">
              Choose Exam
            </span>

            <Swiper
              modules={[FreeMode]}
              freeMode
              slidesPerView="auto"
              spaceBetween={8}
              className="!mt-2"
            >
              {entrances.map((entrance) => (
                <SwiperSlide key={entrance.id} className="!w-auto">
                  <button
                    onClick={() => setSelectedEntranceId(entrance.id)}
                    className={`whitespace-nowrap text-[13px] font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer
                      ${
                        activeEntrance?.id === entrance.id
                          ? "bg-amber-600 border-amber-600 text-white"
                          : "bg-white border-amber-600/30 text-cyan-950/80"
                      }`}
                  >
                    {entrance.label}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {!loading && !error && singleEntrance && activeEntrance && (
          <div className="px-4 pt-3 pb-2 border-b border-amber-600/20 shrink-0">
            <h3 className="text-cyan-950/80 font-semibold text-[15px]">
              {activeEntrance.label}
            </h3>
          </div>
        )}

        {/* Category sections */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-6">
          {loading && (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-3 w-24 bg-amber-100 rounded" />
                  <div className="flex gap-3">
                    <div className="h-64 w-[190px] bg-amber-50 rounded-2xl shrink-0" />
                    <div className="h-64 w-[190px] bg-amber-50 rounded-2xl shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-3 mt-10">
              <p className="text-sm text-cyan-950/60 text-center">
                Couldn&apos;t load courses. Please try again.
              </p>
              <button
                onClick={handleRetry}
                className="text-[13px] font-semibold text-amber-700 border border-amber-600/40 px-3 py-1.5 rounded-full cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && entrances.length === 0 && (
            <p className="text-sm text-cyan-950/60 text-center mt-10">
              No courses available right now.
            </p>
          )}

          {!loading &&
            !error &&
            activeEntrance?.categories.map(
              ({ category, groupLabel, items }) => {
                const slug = `${slugForClass(activeEntrance.id)}-${category}`;

                return (
                  <div key={category} className="flex flex-col gap-2 ">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold tracking-[0.14em] uppercase text-amber-600">
                        {groupLabel}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          className={`tp-prev-${slug} w-6 h-6 flex items-center justify-center rounded-full bg-cyan-900 border border-cyan-900 text-amber-200 disabled:opacity-30 cursor-pointer`}
                          aria-label="Previous"
                        >
                          <BiChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          className={`tp-next-${slug} w-6 h-6 flex items-center justify-center rounded-full border  bg-cyan-900 border border-cyan-900 text-amber-200 disabled:opacity-30 cursor-pointer`}
                          aria-label="Next"
                        >
                          <BiChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div
                      className="rounded-3xl border border-white/90 bg-white/70 backdrop-blur-xl
                         shadow-[0_2px_8px_-2px_rgba(5,16,31,0.12),0_24px_60px_-16px_rgba(5,16,31,0.25)]
                         ring-1 ring-black/3
                         p-3 sm:p-5 lg:p-6"
                    >
                      {" "}
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        {/* Content — packages for active entrance + category */}
                        <div className="flex-1 min-w-0">
                          <div className="animate-[tpFadeIn_0.35s_ease]">
                            <Swiper
                              modules={[Navigation, Pagination]}
                              navigation={{
                                prevEl: `.tp-prev-${slug}`,
                                nextEl: `.tp-next-${slug}`,
                              }}
                              pagination={{
                                clickable: true,
                                el: `.tp-pag-${slug}`,
                              }}
                              spaceBetween={16}
                              slidesPerView={1.1}
                              breakpoints={{
                                480: { slidesPerView: 1.4, spaceBetween: 16 },
                                640: { slidesPerView: 2.1, spaceBetween: 20 },
                                1024: { slidesPerView: 2.6, spaceBetween: 20 },
                                1280: { slidesPerView: 3, spaceBetween: 24 },
                              }}
                              className="!pb-1 [&_.swiper-wrapper]:items-stretch"
                            >
                              {items.map((pkg, idx) => (
                                <SwiperSlide
                                  key={`${slug}-${pkg.id}-${idx}`}
                                  className="!h-auto"
                                >
                                  <CoursePackageCard topPackage={pkg} onClose={onClose}/>
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`tp-pag-${slug} !relative !bottom-0 flex justify-center gap-1.5 [&_.swiper-pagination-bullet]:bg-amber-600/30 [&_.swiper-pagination-bullet-active]:bg-amber-600`}
                    />
                  </div>
                );
              },
            )}
        </div>
      </div>
    </>
  );
}