/* eslint-disable @typescript-eslint/no-explicit-any */
import { CoursePackage } from "@/interfaces/CoursePackage.interface";
import { BiRupee } from "react-icons/bi";
import Image from "next/image";
import { apiService } from "@/services/api.service";
export function CoursePackageCard({
  topPackage,
}: {
  topPackage: CoursePackage;
}) {
  return (
    <>
      <div
        className="sm:w-65 w-60 h-90 border border-neutral-200 rounded-lg shadow-xl
  bg-white flex flex-col"
      >
        {/* IMAGE (Fixed Height) */}
        <div className="relative h-35 w-full p-2">
          <Image
            className="object-contain object-center"
            src={apiService.getPublicAsset(topPackage.image || "")}
            fill
            alt=""
          />
        </div>

        {/* MIDDLE CONTENT (Flexible Area) */}
        <div className="flex-1 flex flex-col">
            <div className="bg-sky-50 w-30 h-7 pl-2  text-xs text-cyan-800 font-semibold flex  items-center border-b border-r rounded-br border-cyan-900/5">
              {topPackage.entrance_name}
            </div>

          <div className="flex flex-col gap-1 px-4 py-2 ">
            <h2 className="text-cyan-900 text-[14px]">
              {topPackage.course_name}
            </h2>

            <span className="text-gray-500 text-xs line-clamp-2">
              {topPackage.description}
            </span>
          </div>
        </div>

        {/* BOTTOM BAR (Fixed Height) */}
        <div className="h-10 flex justify-between px-3 items-center border-t border-neutral-200">
          <div className="flex gap-1">
            {topPackage.discounted_price ? (
              <>
                <span className="relative text-cyan-800 text-sm flex items-center">
                  <BiRupee /> {topPackage.price}
                  <span className="absolute left-0 top-1/2 w-full h-px bg-amber-700 -rotate-12"></span>
                </span>

                <span className="text-amber-700 font-semibold flex items-center">
                  <BiRupee /> {topPackage.discounted_price}
                </span>
              </>
            ) : (
              <span className="text-cyan-800 flex items-center">
                <BiRupee /> {topPackage.price}
              </span>
            )}
          </div>

          <button className="text-[14px] text-cyan-800 cursor-pointer">
            View Details
          </button>
        </div>
      </div>
    </>
  );
}
