"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { CoursePackageCard } from "./course-card/CourseCard";
import { Navigation, Pagination } from "swiper/modules";

const categories = [
  "MBA Entrance",
  "LAW Entrance",
  "MCA Entrance",
  "BBA Entrance",
];

export function TopPackages() {
  return (
    <section className="w-full bg-white py-8 lg:py-14 sm:px-10 z-30 isolate lg:px-30 px-8">
      {/* Heading */}
      <h2 className=" text-cyan-950 font-semibold text-2xl lg:text-4xl mb-5">
        Popular Mock Tests 
      </h2>

      {/* Mobile Category Chips */}
      {/* <div className="lg:hidden mb-5">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((item, i) => (
            <button
              key={i}
              className="
                px-4 py-2 text-sm rounded-full
                bg-cyan-900/10 text-cyan-900
                active:scale-95 transition
                whitespace-nowrap
              "
            >
              {item}
            </button>
          ))}
        </div>
      </div> */}

      <div className="flex px-0">
        {/* Desktop Sidebar */}
        {/* <div className="hidden lg:flex py-9 flex-col items-center gap-4 shadow-xl bg-[linear-gradient(rgba(0,100,100,0.9),rgba(0,60,100,0.9))] rounded-xl w-[15%]">
          {" "}
          {categories.map((item, i) => (
            <button
              key={i}
              className="px-4    py-2 text-[15px] rounded-lg tracking-wide text-cyan-950 hover:bg-amber-600 hover:text-white font-normal transition-all duration-200 cursor-pointer bg-white"
            >
              {" "}
              {item}{" "}
            </button>
          ))}{" "}
        </div> */}

        {/* Slider w=82%*/}
        <div className="relative w-full lg:w-full">
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
              0: { slidesPerView: 1, centeredSlides: true },
              480: { slidesPerView: 1.15, spaceBetween: 20 },
              640: { slidesPerView: 2.5, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 20 },
              1536: { slidesPerView: 4 },
            }}
            className="px-4 lg:px-0 pb-10 h-110"
          >
            {[1, 2, 3, 4, 5].map((_, i) => (
              <SwiperSlide key={i}>
                <CoursePackageCard />
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
