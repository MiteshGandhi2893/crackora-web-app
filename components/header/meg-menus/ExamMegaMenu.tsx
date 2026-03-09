"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import { API_BASE_URL } from "@/services/api.service";
import { useRouter } from "next/navigation";
import { useExams } from "@/providers/ExamsProvider";

export function MegaExamInfoMenu({ onClose }: any) {
  const data = useExams();
  const router = useRouter();

  const handleExamClick = (exam: any) => {
    router.push(`/exam-info/${exam.slug}`);
    onClose?.();
  };

  return (
    <div className="w-full overflow-hidden bg-white">

      {/* Header bar */}
      <div className="flex items-center justify-between px-6 sm:px-8 py-3 border-b border-[#f0ede6]">
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] font-bold tracking-[0.18em] uppercase text-amber-700">
            Explore Exams
          </span>
        
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-[#f8f7f4] hover:bg-[#f0ede6] border border-[#e8e4dc] flex items-center justify-center text-[#05101f]/50 hover:text-[#05101f] transition-all duration-200 text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-[#f0ede6]">
        {data.entrances.map((entrance, idx) => (
          <div key={idx} className="flex flex-col">

            {/* Category title */}
            <div className="px-5 py-3 border-b border-[#f0ede6] bg-[#faf9f7]">
              <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-[#05101f]/60">
                {entrance.title}
              </h3>
            </div>

            {/* Exam list */}
            <div className="flex-1 overflow-y-auto max-h-[72vh] p-3 flex flex-col gap-2">
              {entrance.exams.map((exam, i) => (
                <button
                  key={i}
                  onClick={() => handleExamClick(exam)}
                  className="group w-full flex items-center gap-3 bg-white border border-[#e8e4dc] hover:border-amber-300 rounded-xl p-3 text-left transition-all duration-200 hover:shadow-[0_4px_16px_rgba(5,16,31,0.08)] hover:-translate-y-0.5"
                >
                  {/* Icon */}
                  <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#e8e4dc] bg-[#f8f7f4] flex-shrink-0">
                    <Image
                      src={`${API_BASE_URL}/public/${exam?.icon || ""}`}
                      alt={exam.title || ""}
                      fill
                      unoptimized
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#05101f] group-hover:text-amber-600 transition-colors duration-200 truncate">
                      {exam.title}
                    </p>
                    <p className="text-[11px] text-[#05101f]/40 line-clamp-1 mt-0.5 leading-snug">
                      {exam.description || "Syllabus, mock tests & analytics"}
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="w-3.5 h-3.5 text-[#05101f]/20 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}