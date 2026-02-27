"use client";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { BiSolidQuoteAltLeft } from "react-icons/bi";

export function Testimonials() {
  return (
    <>
      <div className="relative lg:px-18 sm:px-5  bg-white py-20">
        <h2 className="text-4xl py-5 ml-5 text-cyan-900 font-semibold">
          Testimonials
        </h2>
        <button
          className="swiper-prev absolute left-10 top-1/2 -translate-y-1/2 
                           hidden lg:flex items-center justify-center 
                           w-10 h-10 rounded-full bg-cyan-800 text-white shadow z-20"
        >
          ‹
        </button>

        <button
          className="swiper-next absolute right-10 top-1/2 -translate-y-1/2 
                           hidden lg:flex items-center justify-center 
                           w-10 h-10 rounded-full bg-cyan-800 shadow z-20 text-white"
        >
          ›
        </button>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: ".swiper-prev",
            nextEl: ".swiper-next",
          }}
          pagination={{ clickable: true }}
          centeredSlides
          slidesPerView={3}
          spaceBetween={30}
          breakpoints={{
            0: { slidesPerView: 1.15, centeredSlides: true },
            480: { slidesPerView: 2, spaceBetween: 20, centeredSlides: true },
            640: { slidesPerView: 2, centeredSlides: false },
            1280: { slidesPerView: 3, centeredSlides: false },
          }}
          className="!pb-10 h-100  !px-5"
        >
          {[1, 2, 3, 4, 5].map((_, i) => (
            <SwiperSlide key={i}>
              <div
                className={`relative w-full flex flex-col bg-[linear-gradient(rgba(0,100,100,0.8),rgba(0,60,100,0.8))] h-full rounded-2xl text-white `}
              >
                <div
                  className={`${
                    i % 2 === 0 ? "text-cyan-950" : "text-cyan-950"
                  } text-center flex justify-center py-7`}
                >
                  <BiSolidQuoteAltLeft className="w-10 h-10 text-white/50" />
                </div>
                <div className="px-8 lg:text-[17px] font-normal text-white/90">
                  &quot;My car is paying for itself. I can cover the EMI and get
                  some extra income on top of it. I am in love with this idea
                  and have enjoyed my time with Zoomcar.&quot;
                </div>

                <div className="absolute bottom-0 bg-white sm:w-70 h-25 rounded-tr-xl rounded-bl-xl -left-1 flex p-2">
                  <div className="bg-amber-600/70 w-full h-full rounded-xl flex  justify-center items-center gap-3 p-1">
                    <div className="rounded-full w-13 h-13 bg-cyan-950"></div>
                    <div className="flex flex-col px-2">
                      <span className="text-neutral-900 sm:text-lg text-sm font-roboto">
                        Mitesh Gandhi
                      </span>
                      <span className="text-sm text-cyan-900">Student</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
