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
  onClose,
}: {
  topPackage: CoursePackage | MenuPackage;
  onClose?: () => void;
}) {
  const router = useRouter();
  const handlePackageClick = (pkg: CoursePackage | MenuPackage) => {
    router.push(`/packages/${pkg.slug}`);
    onClose?.();
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow shadow-amber-600/20
        border border-amber-600/30 hover:border-amber-300
        transition-all duration-300 hover:-translate-y-1 cursor-pointer
        flex flex-col w-full h-full"
      onClick={() => handlePackageClick(topPackage)}
    >
      {/* Image */}
      <div className="relative w-full aspect-video bg-[#f0ede6] overflow-hidden">
        <Image
          src={`${API_BASE_URL}/public${topPackage?.image || ""}`}
          alt={topPackage.course_name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Body — flex-1 so it stretches, keeping the footer aligned across cards */}
      <div className="flex-1 flex flex-col px-4 py-3 gap-2">
        <div className="flex items-start justify-between gap-2">
          <span className="shrink-0 text-[11px] font-semibold font-roboto tracking-wide border border-amber-600 text-amber-700 px-1.5 py-1 bg-amber-50 rounded-md">
            {topPackage.entrance_name}
          </span>
        </div>

        <h3 className="text-cyan-900 text-md font-semibold  leading-snug  font-roboto text-center mt-5">
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
      <div className="flex justify-between px-4 mb-1">
        <div className="flex items-center gap-1.5 shrink-0">
          {topPackage.discounted_price ? (
            <>
              <span className="text-cyan-950/50 text-sm flex items-center line-through decoration-green-500">
                <BiRupee />
                {topPackage.price}
              </span>
              <span className="text-green-700 font-bold text-xl flex items-center font-sans">
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

        <div className="flex items-center gap-1.5 shrink-0 bg-red-100 px-2">
          {topPackage.discount_percentage ? (
            <span className="text-red-700  text-md flex items-center font-sans">
              {topPackage.discount_percentage} % off
            </span>
          ) : (
            <span className="text-[#05101f] font-bold text-sm flex items-center font-sans">
              <BiRupee />
              {topPackage.price}
            </span>
          )}
        </div>
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
