"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { apiService } from "@/services/api.service";
import { useRouter } from "next/navigation";
import { useExams } from "@/providers/ExamsProvider";

export function MegaExamInfoMenu({ onClose }: any) {
  const data = useExams();
  const router = useRouter();
  
  // Handle click: set cookie and navigate
  const handleExamClick = (exam: any) => {
    // Navigate to slug-only URL
    router.push(`/exam-info/${exam.slug}`);
    onClose?.();
  };

  return (
    <div className="w-full overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-end px-8 pt-1">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 text-3xl"
        >
          ×
        </button>
      </div>

      {/* ================= COLUMNS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 px-8 pb-5">
        {data.entrances.map((entrance, idx) => (
          <div key={idx} className="flex flex-col">
            {/* Entrance Title */}
            <div className="px-3 bg-white border-b border-b-cyan-950/30">
              <h3 className="text-lg font-semibold text-cyan-900">
                {entrance.title}
              </h3>
            </div>

            {/* Scrollable Exams */}
            <div className="flex-1 overflow-y-auto max-h-[79vh] px-2 py-2 gap-5">
              {entrance.exams.map((exam, i) => (
                <div
                  key={i}
                  onClick={() => handleExamClick(exam)}
                  className="block bg-gray-100/80 border border-gray-100 mb-4 rounded-lg p-3 transition hover:bg-cyan-950/90 hover:scale-105 text-cyan-950 hover:text-white group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10">
                      <Image
                        src={apiService.getPublicAsset(exam?.icon || "")}
                        alt={exam.title || ""}
                        fill
                        unoptimized
                        className="w-10 h-10 border border-gray-300 shadow object-center"
                      />
                    </div>
                    <p className="text-[14px] font-medium text-amber-800 group-hover:text-amber-400 group-hover:font-semibold">
                      {exam.title}
                    </p>
                  </div>

                  <p className="text-xs mt-1 line-clamp-2">
                    {exam.description ||
                      "Syllabus, mock tests and performance analytics"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
