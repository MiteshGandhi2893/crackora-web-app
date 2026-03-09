/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CoursePackage } from "@/interfaces/CoursePackage.interface";
import { BiRupee } from "react-icons/bi";
import Image from "next/image";
import { apiService } from "@/services/api.service";
import { useRouter } from "next/navigation";

export function CoursePackageCard({ topPackage }: { topPackage: CoursePackage }) {
  const router = useRouter();

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#e8e4dc] hover:border-amber-300
        shadow-[0_2px_16px_rgba(5,16,31,0.06)] hover:shadow-[0_8px_40px_rgba(5,16,31,0.12)]
        transition-all duration-300 hover:-translate-y-1 flex flex-col w-full"
      style={{ minHeight: "340px" }}
    >
      {/* Image */}
      <div className="relative h-36 w-full bg-[#f0ede6] overflow-hidden">
        <Image
          className="object-contain object-center p-3 group-hover:scale-105 transition-transform duration-500"
          src={apiService.getPublicAsset(topPackage.image || "")}
          fill
          alt={topPackage.course_name}
        />
        {/* Exam tag */}
        <span className="absolute top-2 left-2 text-[10px] font-bold tracking-wide uppercase bg-[#05101f] text-amber-400 px-2.5 py-1 rounded-md font-sans">
          {topPackage.entrance_name}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-4 py-3 gap-1.5">
        <h3 className="text-[#05101f] text-[14px] font-semibold leading-snug line-clamp-2 font-sans">
          {topPackage.course_name}
        </h3>
        <p className="text-[#05101f]/45 text-xs leading-relaxed line-clamp-2 font-sans">
          {topPackage.description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-[#f0ede6] bg-[#faf9f7]">
        {/* Pricing */}
        <div className="flex items-baseline gap-1.5">
          {topPackage.discounted_price ? (
            <>
              <span className="text-[#05101f]/35 text-xs flex items-center line-through decoration-amber-500">
                <BiRupee />{topPackage.price}
              </span>
              <span className="text-amber-600 font-bold text-sm flex items-center font-sans">
                <BiRupee />{topPackage.discounted_price}
              </span>
            </>
          ) : (
            <span className="text-[#05101f] font-bold text-sm flex items-center font-sans">
              <BiRupee />{topPackage.price}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push(`/packages/${topPackage.slug}`)}
          className="text-[12px] font-semibold text-white bg-amber-600 hover:bg-amber-500 px-3 py-1.5 rounded-lg transition-colors duration-200 font-sans"
        >
        View Details &rarr;
        </button>
      </div>

     
    </div>
  );
}