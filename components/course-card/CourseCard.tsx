// CourseCard.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  CoursePackage,
  MenuPackage,
} from "@/interfaces/CoursePackage.interface";
import { BiRupee } from "react-icons/bi";
import Image from "next/image";
import { API_BASE_URL } from "@/services/api.service";
import { useRouter } from "next/navigation";

export function CoursePackageCard({
  topPackage,
}: {
  topPackage: CoursePackage | MenuPackage;
}) {
  const router = useRouter();
  const handlePackageClick = (pkg: CoursePackage | MenuPackage) => {
    router.push(`/packages/${pkg.slug}`);
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow shadow-amber-600/20
        border border-amber-600/30 hover:border-amber-300
        transition-all duration-300 hover:-translate-y-1
        flex flex-col w-full h-full"
    >
      {/* Image */}
      <div className="relative h-40 w-full shrink-0 bg-[#f0ede6] overflow-hidden">
        <Image
          className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
          src={`${API_BASE_URL}/public${topPackage?.image || ""}`}
          fill
          alt={topPackage.course_name}
        />
      </div>

      {/* Body — flex-1 so it stretches, keeping the footer aligned across cards */}
      <div className="flex-1 flex flex-col px-4 py-3 gap-2">
        <div className="flex items-start justify-between gap-2">
          <span className="shrink-0 text-[11px] font-semibold font-roboto tracking-wide border border-amber-600 text-amber-700 px-1.5 py-1 bg-amber-50 rounded-md">
            {topPackage.entrance_name}
          </span>
          <div className="flex items-baseline gap-1.5 shrink-0">
            {topPackage.discounted_price ? (
              <>
                <span className="text-cyan-950/50 text-sm flex items-center line-through decoration-amber-500">
                  <BiRupee />
                  {topPackage.price}
                </span>
                <span className="text-amber-600 font-bold text-lg flex items-center font-sans">
                  <BiRupee />
                  {topPackage.discounted_price}
                </span>
              </>
            ) : (
              <span className="text-[#05101f] font-bold text-sm flex items-center font-sans">
                <BiRupee />
                {topPackage.price}
              </span>
            )}
          </div>
        </div>

        <h3 className="text-cyan-900 text-[16px] font-semibold  leading-snug  font-roboto text-center mt-5">
          {topPackage.course_name}
        </h3>

        {/* Spacer pushes footer down for cards with little/no content below */}

        {topPackage.what_you_will_get?.length ? (
          <div className="pt-3 border-t border-[#f0ede6] grid grid-cols-2 gap-x-2 gap-y-1 text-gray-500 text-[12.5px]">
            {topPackage.what_you_will_get.map((item) => (
              <span key={item} className="truncate">
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="shrink-0 flex justify-center px-4 py-3 border-t border-[#f0ede6] bg-[#faf9f7]">
        <button
          onClick={() => handlePackageClick(topPackage)}
          className="text-[14px] w-full max-w-55 cursor-pointer font-semibold text-white bg-amber-600 hover:bg-amber-500 px-3 py-2 rounded-lg transition-colors duration-200 font-sans"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
