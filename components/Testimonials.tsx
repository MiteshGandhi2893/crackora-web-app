"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { BiSolidQuoteAltLeft } from "react-icons/bi";

const testimonials = [
  {
    text: "Crackora's MCA mock tests felt very close to the real exam. The detailed solutions and performance analysis helped me improve my speed and accuracy consistently.",
    name: "Pram Gandhi",
    role: "MCA Aspirant",
    initial: "P",
    accent: "bg-amber-400",
  },
  {
    text: "The structured e-books and topic-wise mock tests made my MCA entrance preparation clear and focused. I finally understood where I was losing marks.",
    name: "Rohit Kulkarni",
    role: "MCA Entrance Student",
    initial: "R",
    accent: "bg-cyan-400",
  },
  {
    text: "Practicing LAW mock tests on Crackora improved my Legal Aptitude and reasoning significantly. The exam-level questions boosted my confidence before MH CET Law.",
    name: "Aarav Mehta",
    role: "LAW Aspirant",
    initial: "A",
    accent: "bg-emerald-400",
  },
  {
    text: "The LAW preparation material was concise and easy to revise. Mock tests helped me manage time better and approach questions strategically.",
    name: "Sneha Sharma",
    role: "CLAT / MH CET Law Student",
    initial: "S",
    accent: "bg-pink-400",
  },
];

export function Testimonials() {
  return (
    <section className="w-full bg-[#f8f7f4] px-6 sm:px-12 lg:px-24 py-16 lg:py-24 relative overflow-hidden">

      {/* Glow */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-[40vw] h-[50vh] rounded-full bg-[radial-gradient(ellipse,rgba(217,119,6,0.06),transparent_65%)]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 lg:mb-12 gap-4">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-600 font-sans">
            Student Stories
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-[#05101f] leading-tight tracking-tight">
            What Students Say
          </h2>
          <div className="h-[2px] w-12 bg-amber-500 rounded-full" />
        </div>

        {/* Desktop nav buttons */}
        <div className="hidden lg:flex gap-2">
          <button className="swiper-testimonial-prev w-10 h-10 rounded-xl border border-[#e8e4dc] bg-white hover:bg-[#05101f] hover:border-[#05101f] text-[#05101f] hover:text-white transition-all duration-200 flex items-center justify-center text-lg font-light shadow-sm">
            ‹
          </button>
          <button className="swiper-testimonial-next w-10 h-10 rounded-xl border border-[#e8e4dc] bg-white hover:bg-[#05101f] hover:border-[#05101f] text-[#05101f] hover:text-white transition-all duration-200 flex items-center justify-center text-lg font-light shadow-sm">
            ›
          </button>
        </div>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{ prevEl: ".swiper-testimonial-prev", nextEl: ".swiper-testimonial-next" }}
        pagination={{ clickable: true }}
        spaceBetween={20}
        breakpoints={{
          0:    { slidesPerView: 1.05, centeredSlides: true },
          480:  { slidesPerView: 1.5,  centeredSlides: false },
          768:  { slidesPerView: 2,    centeredSlides: false },
          1280: { slidesPerView: 3,    centeredSlides: false },
        }}
        className="!pb-10"
      >
        {testimonials.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="bg-white border border-[#e8e4dc] rounded-2xl p-6 flex flex-col gap-5 h-full shadow-[0_2px_16px_rgba(5,16,31,0.05)] hover:shadow-[0_6px_30px_rgba(5,16,31,0.1)] hover:border-amber-200 transition-all duration-300">

              {/* Quote icon */}
              <BiSolidQuoteAltLeft className="w-7 h-7 text-amber-600" />

              {/* Text */}
              <p className="text-[#05101f]/65 text-sm leading-relaxed font-sans flex-1">
                &ldquo;{item.text}&rdquo;
              </p>

              {/* Divider */}
              <div className="h-px bg-[#f0ede6]" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${item.accent} flex items-center justify-center text-sm font-bold text-[#05101f] flex-shrink-0 font-sans`}>
                  {item.initial}
                </div>
                <div>
                  <div className="text-[#05101f] text-sm font-semibold font-sans">{item.name}</div>
                  <div className="text-[#05101f]/40 text-xs font-sans">{item.role}</div>
                </div>

                {/* Stars */}
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
        .font-sans { font-family: 'DM Sans', system-ui, sans-serif; }
      `}</style>
    </section>
  );
}