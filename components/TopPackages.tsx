"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Swiper, SwiperSlide } from "swiper/react";
import { CoursePackageCard } from "./course-card/CourseCard";
import { Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { CoursePackage } from "@/interfaces/CoursePackage.interface";
import { getCachedPackages } from "@/services/TopPackageCache.service";

export function TopPackages() {
  const [topPackages, setTopPackages] = useState<CoursePackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCachedPackages()
      .then(setTopPackages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="w-full bg-[#f8f7f4] py-16 lg:py-24  relative overflow-hidden">
      <div className="max-w-6xl mx-auto lg:px-10 px-5">
        {/* Subtle background accent */}
        <div className="pointer-events-none absolute top-0 right-0 w-[40vw] h-[40vh] rounded-full bg-[radial-gradient(ellipse,rgba(217,119,6,0.06),transparent_65%)]" />

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-600 font-sans">
              Top Picks
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-[#05101f] leading-tight tracking-tight">
              Popular Packages
            </h2>
            <div className="h-0.5 w-12 bg-amber-500 rounded-full" />
          </div>
          <p className="text-[#05101f]/70 sm:text-md text-sm max-w-sm leading-relaxed font-sans hidden sm:block">
            Handpicked packages trusted by thousands of exam aspirants across
            India.
          </p>
        </div>

        {/* Mobile slider */}
        <div className="block md:hidden">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            slidesPerView={1.1}
            spaceBetween={14}
            centeredSlides
            className="pb-15 h-110"
          >
            {topPackages.map((item, i) => (
              <div key={i}>
                {item.is_active && (
                  <SwiperSlide>
                    <CoursePackageCard topPackage={item} />
                  </SwiperSlide>
                )}
              </div>
            ))}
          </Swiper>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-15">
          {topPackages.map(
            (item, i) =>
              item.is_active && <CoursePackageCard key={i} topPackage={item} />,
          )}
        </div>

        <style jsx>{`
          .font-serif {
            font-family: "Playfair Display", Georgia, serif;
          }
          .font-sans {
            font-family: "DM Sans", system-ui, sans-serif;
          }
        `}</style>
      </div>
    </section>
  );
}
