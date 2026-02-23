"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { CoursePackageCard } from "./course-card/CourseCard";
import { Navigation, Pagination } from "swiper/modules";
import { useTopPackages } from "@/providers/TopPackagesProvide";

const categories = [
  "MBA Entrance",
  "LAW Entrance",
  "MCA Entrance",
  "BBA Entrance",
];

export function TopPackages() {
  const pkgContext = useTopPackages();

  return (
    <section className="w-full bg-white py-8 lg:py-14 sm:px-10 z-30 isolate lg:px-30 px-8">
      {/* Heading */}
      <h2 className=" text-cyan-950 font-semibold text-2xl lg:text-4xl mb-5">
        Popular Mock Tests
      </h2>

      <div className="flex px-0">
        {/* Slider w=82%*/}
        <div className="relative w-full lg:w-full sm:px-6">
          {/* Desktop arrows */}
          <button className="swiper-prev absolute -left-5 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-cyan-800 text-white shadow z-30 text-2xl">
            {" "}
            ‹{" "}
          </button>{" "}
          <button className="swiper-next absolute -right-5 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-cyan-800 shadow z-30 text-white text-2xl">
            {" "}
            ›{" "}
          </button>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".swiper-prev",
              nextEl: ".swiper-next",
            }}
            pagination={{ clickable: true }}
            slidesPerView={1.15}
            spaceBetween={10}
            breakpoints={{
              0: { slidesPerView: 1.25, centeredSlides: true },
              480: { slidesPerView: 1.15, spaceBetween: 20 },
              640: { slidesPerView: 2.5, spaceBetween: 25 },
              1280: { slidesPerView: 4, spaceBetween: 20 },
              1536: { slidesPerView: 4 },
            }}
            className="px-14  pb-10 h-110"
          >
            {pkgContext.topPackages.map((item, index) => (
              <SwiperSlide key={index}>
                <CoursePackageCard topPackage={item}/>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

// breakpoints={{
//           640: { slidesPerView: 2, centeredSlides: true },
//           768: { slidesPerView: 3, centeredSlides: false },
//           1024: { slidesPerView: 3, centeredSlides: false },
//         }}
