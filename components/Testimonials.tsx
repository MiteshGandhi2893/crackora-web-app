"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import { testimonialService } from "@/services/testimonial.service";
import { apiService } from "@/services/api.service";
import type { Testimonial } from "@/interfaces/testimonial.interface";
import Image from "next/image";

// Cycled through for testimonials that have no photo_url, so the initial
// avatar still gets some visual variety instead of one flat color.
const ACCENTS = [
  "bg-amber-400",
  "bg-cyan-400",
  "bg-emerald-400",
  "bg-pink-400",
  "bg-violet-400",
  "bg-orange-400",
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(false);
      try {
        // Only show approved, spotlighted testimonials on the homepage.
        const res = await testimonialService.getTestimonials();
        if (!cancelled) setTestimonials(res.data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Nothing to show and nothing went wrong — just don't render an empty
  // section rather than showing a header over blank space.
  if (!loading && !error && testimonials.length === 0) return null;

  return (
    <section className="w-full bg-[#f8f7f4] px-6 sm:px-12 lg:px-24 py-16 lg:py-24 relative overflow-hidden">
      <div className="lg:max-w-6xl sm:max-w-3xl mx-auto">
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
            <div className="h-0.5 w-12 bg-amber-500 rounded-full" />
          </div>

          {/* Desktop nav buttons — only worth showing once slides exist */}
          {testimonials.length > 0 && (
            <div className="hidden lg:flex gap-2">
              <button className="swiper-testimonial-prev w-10 h-10 rounded-xl border border-[#e8e4dc] bg-white hover:bg-[#05101f] hover:border-[#05101f] text-[#05101f] hover:text-white transition-all duration-200 flex items-center justify-center text-lg font-light shadow-sm">
                ‹
              </button>
              <button className="swiper-testimonial-next w-10 h-10 rounded-xl border border-[#e8e4dc] bg-white hover:bg-[#05101f] hover:border-[#05101f] text-[#05101f] hover:text-white transition-all duration-200 flex items-center justify-center text-lg font-light shadow-sm">
                ›
              </button>
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#e8e4dc] rounded-2xl h-72 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error — quiet fallback, doesn't break the rest of the page */}
        {!loading && error && (
          <p className="text-sm text-[#05101f]/50 font-sans">
            Couldn&rsquo;t load student stories right now.
          </p>
        )}

        {/* Swiper */}
        {testimonials.length > 0 && (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".swiper-testimonial-prev",
              nextEl: ".swiper-testimonial-next",
            }}
            pagination={{ clickable: true }}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1.05, centeredSlides: true },
              480: { slidesPerView: 1.5, centeredSlides: false },
              768: { slidesPerView: 2, centeredSlides: false },
              1280: { slidesPerView: 3, centeredSlides: false },
            }}
            className="pb-10!"
          >
            {testimonials.map((item, i) => (
              <SwiperSlide key={item.id} className="h-auto!">
                <div className="relative bg-white border border-[#e8e4dc] rounded-2xl p-6 flex flex-col h-full min-h-[280px] shadow-[0_2px_16px_rgba(5,16,31,0.05)] hover:shadow-[0_6px_30px_rgba(5,16,31,0.1)] hover:border-amber-200 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                  {/* Decorative oversized quote mark, bleeding off the corner */}
                  <BiSolidQuoteAltLeft className="absolute -top-2 -right-2 w-20 h-20 text-amber-500/[0.06] pointer-events-none" />

                  {/* Top row: quote icon + rating pill */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                      <BiSolidQuoteAltLeft className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex items-center gap-1 bg-[#f8f7f4] border border-[#e8e4dc] rounded-full px-2.5 py-1">
                      <svg className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-[11px] font-bold text-[#05101f] font-sans">
                        {(item.rating ?? 0).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Text — clamped so message length can't push footer around,
                      which is what made cards feel uneven despite equal height */}
                  <p className="relative text-[#05101f]/70 text-sm leading-relaxed font-sans flex-1 line-clamp-5">
                    &ldquo;{item.message}&rdquo;
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-[#f0ede6] mt-5 mb-4" />

                  {/* Author — pinned to bottom via flex-1 above */}
                  <div className="flex items-center gap-3">
                    {item.photo_url ? (
                      <Image
                        src={apiService.getPublicAsset(item.photo_url)}
                        alt={item.fullname}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-amber-100"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full ${ACCENTS[i % ACCENTS.length]} flex items-center justify-center text-sm font-bold text-[#05101f] shrink-0 font-sans ring-2 ring-amber-100`}
                      >
                        {item.fullname?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-[#05101f] text-sm font-semibold font-sans truncate">
                        {item.fullname}
                      </div>
                      <div className="text-[#05101f]/40 text-xs font-sans truncate">
                        {item.designation || item.category_label || item.achievement}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}