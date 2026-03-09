"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Swiper, SwiperSlide } from "swiper/react";
import { CoursePackageCard } from "./course-card/CourseCard";
import { Pagination } from "swiper/modules";
import { useTopPackages } from "@/providers/TopPackagesProvide";
import Link from "next/link";

export function TopPackages() {
  const pkgContext = useTopPackages();

  return (
    <section className="w-full bg-[#f8f7f4] py-16 lg:py-24 px-6 sm:px-10 lg:px-24 relative overflow-hidden">

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
        <p className="text-[#05101f]/50 text-sm max-w-xs leading-relaxed font-sans hidden sm:block">
          Handpicked packages trusted by thousands of exam aspirants across India.
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
          className="pb-10"
        >
          {pkgContext.topPackages.map((item, i) => (
            <SwiperSlide key={i}>
              <CoursePackageCard topPackage={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {pkgContext.topPackages.map((item, i) => (
           <Link href={item.checkout_link || '/'} key={i}>
             <CoursePackageCard topPackage={item} />
           </Link>
        ))}
      </div>

      <style jsx>{`
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
        .font-sans { font-family: 'DM Sans', system-ui, sans-serif; }
      `}</style>
    </section>
  );
}