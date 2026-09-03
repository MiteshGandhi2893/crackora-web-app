"use client";
// PackagesTeaserCard.tsx — CLIENT COMPONENT
// The "what courses we have" bento cell — now on the real MenuPackage
// shape (course_name / image / price / discounted_price / checkout_link),
// borrowed directly from CourseCard.tsx. Compact vertical slides,
// one per view, no feature list — just enough to make someone tap.

import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BiRupee } from "react-icons/bi";
import { CoursePackage, MenuPackage } from "@/interfaces/CoursePackage.interface";
import { packageService } from "@/services/courses.service";
import { API_BASE_URL } from "@/services/api.service";

export function PackagesTeaserCard({ className = "" }: { className?: string }) {
  const [packages, setPackages] = useState<(CoursePackage | MenuPackage)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    packageService
      .getActiveTopPackages()
      .then((packages) => setPackages((packages).slice(0, 5)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      id="courses-packages"
      className={`relative overflow-hidden rounded-3xl border border-white/30 bg-white/4 backdrop-blur-xl p-5 scroll-mt-24 flex flex-col ${className}`}
    >
      <div className="mb-4">
        {/* <span className="text-[10px] tracking-[0.14em] uppercase text-cyan-300/70 font-medium">
          What courses we have
        </span> */}
        <h2 className="mt-1 font-roboto text-base font-bold text-amber-500">
          Top picks from students
        </h2>
      </div>

      {loading && (
        <div className="h-40 w-full rounded-2xl bg-white/5 animate-pulse" />
      )}

      {!loading && packages.length === 0 && (
        <div className="flex items-center justify-center h-40 rounded-2xl border border-dashed border-white/15 text-sm text-amber-50/50 font-roboto">
          Courses launching soon.
        </div>
      )}

      {!loading && packages.length > 0 && (
        <>
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3200, disableOnInteraction: false }}
            loop={packages.length > 1}
            pagination={{ clickable: true, el: ".ptc-pag" }}
            slidesPerView={1}
            className="w-full"
          >
            {packages.map((pkg) => (
              <SwiperSlide key={pkg.id}>
                <Link
                  href={pkg.checkout_link || "/"}
                  target="_blank"
                  className="group block  bg-amber-50 border border-amber-600/20 overflow-hidden hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-35 w-full bg-[#f0ede6] overflow-hidden">
                    <Image
                      className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                      src={`${API_BASE_URL}/public${pkg.image || ""}`}
                      fill
                      alt={pkg.course_name}
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-semibold font-roboto tracking-wide border border-amber-600/40 text-amber-700 px-1.5 py-0.5 bg-amber-50/95 ">
                      {pkg.entrance_name}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-3">
                    <h3 className="text-cyan-900 text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5em]">
                      {pkg.course_name}
                    </h3>

                    <div className="mt-2 flex items-center justify-between">
                      {pkg.discounted_price ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-cyan-950/40 text-xs flex items-center line-through decoration-amber-500">
                            <BiRupee />
                            {pkg.price}
                          </span>
                          <span className="text-amber-600 font-bold text-sm flex items-center">
                            <BiRupee />
                            {pkg.discounted_price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-cyan-900 font-bold text-sm flex items-center">
                          <BiRupee />
                          {pkg.price}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="ptc-pag mt-3 flex justify-center gap-1.5 [&_.swiper-pagination-bullet]:bg-white! [&_.swiper-pagination-bullet-active]:bg-amber-600!" />
        </>
      )}
    </div>
  );
}