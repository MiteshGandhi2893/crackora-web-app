"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Swiper, SwiperSlide } from "swiper/react";
import { CoursePackageCard } from "./course-card/CourseCard";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useMemo, useState } from "react";
import {
  MenuPackage,
  PackageCategory,
} from "@/interfaces/CoursePackage.interface";
import { packageService } from "@/services/courses.service";
import { BiBook, BiBookOpen, BiBroadcast, BiTask } from "react-icons/bi";
import router from "next/router";

const CATEGORY_META: Record<
  PackageCategory,
  {
    label: string;
    icon: React.ElementType;
    accent: string; // solid tailwind bg for active pill
    light: string;
    soft: string;
    ring: string;
    text: string;
    glow: string; // rgba used for the ambient background blob
  }
> = {
  live_course: {
    label: "Live Course",
    icon: BiBroadcast,
    accent: "bg-rose-600",
    light: "bg-rose-600/10",
    soft: "bg-rose-50",
    ring: "border-rose-200",
    text: "text-rose-700",
    glow: "rgba(225,29,72,0.20)",
  },
  self_study: {
    label: "Self Study",
    icon: BiBookOpen,
    accent: "bg-indigo-600",
    light: "bg-indigo-600/10",
    soft: "bg-indigo-50",
    ring: "border-indigo-200",
    text: "text-indigo-700",
    glow: "rgba(79,70,229,0.20)",
  },
  mock_test: {
    label: "Mock Test Series",
    icon: BiTask,
    accent: "bg-teal-600",
    light: "bg-teal-600/10",
    soft: "bg-teal-50",
    ring: "border-teal-200",
    text: "text-teal-700",
    glow: "rgba(13,148,136,0.20)",
  },
  ebook: {
    label: "Ebook",
    icon: BiBook,
    accent: "bg-amber-600",
    light: "bg-amber-600/10",
    soft: "bg-amber-50",
    ring: "border-amber-200",
    text: "text-amber-700",
    glow: "rgba(217,119,6,0.20)",
  },
};

const CATEGORY_ORDER: PackageCategory[] = [
  "live_course",
  "self_study",
  "mock_test",
  "ebook",
];

interface Entrance {
  id: string;
  name: string;
}

function ComingSoon() {
  const text = "Coming soon, stay tuned";
  return (
    <div className="flex items-center justify-center h-40 sm:h-48 rounded-2xl border border-dashed border-cyan-900/15 bg-white/40 px-4">
      <p className="font-serif text-sm sm:text-base text-cyan-900/50 tracking-wide select-none">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="inline-block opacity-0 animate-[fadeInUp_0.5s_ease_forwards]"
            style={{
              animationDelay: `${i * 0.04}s`,
              whiteSpace: char === " " ? "pre" : "normal",
            }}
          >
            {char}
          </span>
        ))}
      </p>
    </div>
  );
}

export function TopPackages() {
  const [topPackages, setTopPackages] = useState<MenuPackage[]>([]);
  const [activeCategory, setActiveCategory] =
    useState<PackageCategory>("live_course");
  const [activeEntrance, setActiveEntrance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    packageService
      .getActiveTopPackages()
      .then((packages) => {
        setTopPackages(packages);
        if (packages.length > 0) {
          const firstCategory =
            CATEGORY_ORDER.find((c) =>
              packages.some((p: { category: string }) => p.category === c),
            ) ?? "live_course";
          setActiveCategory(firstCategory);
          setActiveEntrance(packages[0].entrance_id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const entrances = useMemo<Entrance[]>(() => {
    const map = new Map<string, Entrance>();
    topPackages.forEach((p) => {
      if (!map.has(p.entrance_id)) {
        map.set(p.entrance_id, { id: p.entrance_id, name: p.entrance_name });
      }
    });
    return Array.from(map.values());
  }, [topPackages]);

  const activePackages = useMemo(() => {
    if (!activeEntrance) return [];
    return topPackages.filter(
      (p) => p.entrance_id === activeEntrance && p.category === activeCategory,
    );
  }, [topPackages, activeEntrance, activeCategory]);

  const entrancesWithActiveCategory = useMemo(() => {
    const set = new Set<string>();
    topPackages.forEach((p) => {
      if (p.category === activeCategory) set.add(p.entrance_id);
    });
    return set;
  }, [topPackages, activeCategory]);

  const activeMeta = CATEGORY_META[activeCategory];
  const hasPackages = activePackages.length > 0;

  return (
    <section className="relative w-full overflow-hidden bg-[#f0eee6] py-16 lg:py-24 lg:px-0 px-5">
      {" "}
      {/* Ambient background: OMR-sheet dot grid + category-reactive glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(#05101f 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 90%)",
          }}
        />
        <div
          className="tp-blob absolute -top-32 -left-24 w-95 h-95 sm:w-130 sm:h-130 rounded-full blur-[130px] sm:blur-[150px] opacity-70 transition-colors duration-700 ease-out"
          style={{ backgroundColor: activeMeta.glow }}
        />
        <div className="tp-blob-2 absolute -bottom-40 -right-24 w-[320px] h-80 sm:w-115 sm:h-115 rounded-full blur-[130px] sm:blur-[150px] opacity-70 bg-amber-500/15" />{" "}
      </div>
      <div className="relative z-10 lg:max-w-6xl sm:max-w-3xl mx-auto ">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 lg:mb-12 gap-4">
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-amber-600 font-sans">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              Top MCA Packages
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-cyan-900 leading-tight tracking-tight">
              Students Already <span className="text-amber-600">Bought</span>
            </h2>
            <div className="h-[2px] w-12 bg-amber-500 rounded-full" />
          </div>
        </div>

        {/* Category segmented control */}
        <div
          className="flex overflow-x-auto snap-x snap-mandatory mb-6 lg:mb-8 gap-1.5 p-1.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/70 shadow-[0_4px_24px_-8px_rgba(5,16,31,0.12)] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            const Icon = meta.icon;
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 snap-start cursor-pointer px-3.5 sm:px-5 py-2.5 flex-1 rounded-xl
                   text-xs sm:text-sm font-semibold font-sans transition-all duration-300 whitespace-nowrap ${
                     isActive
                       ? `${meta.accent} text-white shadow-md scale-[1.02]`
                       : `text-cyan-900/60 hover:bg-cyan-900/5`
                   }`}
              >
                <Icon className="text-base shrink-0" />
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="flex md:flex-col gap-2 md:w-48 shrink-0">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-9 w-28 md:w-full bg-[#eae6dc] rounded-full animate-pulse shrink-0"
                  />
                ))}
              </div>
              <div className="flex gap-3 flex-1">
                {[0, 1, 2].map((j) => (
                  <div
                    key={j}
                    className="h-40 w-full sm:w-56 shrink-0 bg-[#eae6dc] rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty — no entrances at all */}
        {!loading && entrances.length === 0 && (
          <div className="text-center py-16 text-cyan-900/50 font-sans rounded-3xl border border-white/60 bg-white/60 backdrop-blur-xl">
            No packages available right now.
          </div>
        )}

        {/* Glass panel: sidebar + content */}
        {!loading && entrances.length > 0 && (
          <div
            className="rounded-3xl border border-white/90 bg-white/70 backdrop-blur-xl
     shadow-[0_2px_8px_-2px_rgba(5,16,31,0.12),0_24px_60px_-16px_rgba(5,16,31,0.25)]
     ring-1 ring-black/[0.03]
     p-3 sm:p-5 lg:p-6"
          >
            {" "}
         
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Content — packages for active entrance + category */}
              <div className="flex-1 min-w-0">
                {hasPackages ? (
                  <div
                    key={`${activeEntrance}-${activeCategory}`}
                    className="animate-[tpFadeIn_0.35s_ease]"
                  >
                    <Swiper
                      modules={[Navigation, Pagination]}
                      navigation={{
                        prevEl: ".tp-prev",
                        nextEl: ".tp-next",
                      }}
                      pagination={{ clickable: true, el: ".tp-pag" }}
                      spaceBetween={16}
                      slidesPerView={1.15}
                      breakpoints={{
                        480: { slidesPerView: 1.4, spaceBetween: 16 },
                        640: { slidesPerView: 2.1, spaceBetween: 20 },
                        1024: { slidesPerView: 2.6, spaceBetween: 20 },
                        1280: { slidesPerView: 3, spaceBetween: 24 },
                      }}
                      className="!pb-1 [&_.swiper-wrapper]:items-stretch"
                    >
                      {activePackages.map((pkg) => (
                        <SwiperSlide key={pkg.id} className="!h-auto">
                          <CoursePackageCard topPackage={pkg} />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    <div className="flex items-center justify-between mt-4">
                      <div className="tp-pag flex gap-1.5 [&_.swiper-pagination-bullet]:!bg-amber-600/50 [&_.swiper-pagination-bullet-active]:!bg-amber-600 justify-center w-full" />
                         {activePackages.length > 1 && (
              <div className="hidden sm:flex gap-2 justify-end mb-5">
                <button className="tp-prev w-8 h-8 rounded-full border border-cyan-800/50 bg-cyan-900 cursor-pointer   hover:bg-cyan-800/80 hover:border-cyan-900 text-white hover:text-white transition-all duration-200 flex items-center justify-center text-sm font-light shadow-sm">
                  ‹
                </button>
                <button className="tp-next w-8 h-8 rounded-full border border-cyan-800/50 bg-cyan-900 cursor-pointer   hover:bg-cyan-800/80 hover:border-cyan-900 text-white hover:text-white transition-all duration-200 flex items-center justify-center text-sm font-light shadow-sm">
                  ›
                </button>
              </div>
            )}
                    </div>
                  </div>
                ) : (
                  <ComingSoon />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
