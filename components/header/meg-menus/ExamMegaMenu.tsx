/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/services/api.service";
import { useRouter } from "next/navigation";
import { Entrance } from "@/interfaces/entrance-interface";
import { getCachedExams } from "@/services/EntranceCache";

export function MegaExamInfoMenu({ onClose }: { onClose?: () => void }) {
 const [entrances, setEntrances] = useState<Entrance[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCachedExams()
      .then(setEntrances)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allExams = entrances.flatMap((e) => e.exams);
  const filtered = allExams.filter((exam) =>
    exam.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleExamClick = (exam: any) => {
    router.push(`/exam-info/${exam.slug}`);
    onClose?.();
  };

  return (
    <div className="w-full overflow-hidden bg-[#f8f7f4]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#f0ede6]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-amber-700">
            MCA Entrance Exams
          </span>
          <span className="text-[11px] bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5 font-semibold">
            {allExams.length} Exams
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search exam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[12px] pl-7 pr-3 py-1.5 rounded-lg border border-[#e8e4dc] bg-[#faf9f7] focus:outline-none focus:border-amber-300 w-40 text-[#05101f]"
            />
            <svg
              className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#05101f]/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div> */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white hover:bg-[#f0ede6] border border-[#e8e4dc] flex items-center justify-center cursor-pointer text-amber-700 hover:text-red-800 transition-all text-lg"
          >
            ×
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[70vh] overflow-y-auto">
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-sm text-[#05101f]/40 py-8">
            No exams found for {search}
          </p>
        )}
        {filtered.map((exam, i) => (
          <button
            key={i}
            onClick={() => handleExamClick(exam)}
            className="h-35 cursor-pointer group flex flex-col shadow items-center gap-3 bg-white border border-[#e8e4dc] hover:border-amber-300 rounded-xl p-3 text-left transition-all duration-200 hover:shadow-[0_4px_16px_rgba(5,16,31,0.08)] hover:-translate-y-0.5"
          >
            <div className="flex justify-center items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#e8e4dc] bg-[#f8f7f4] flex-shrink-0">
                <Image
                  src={`${API_BASE_URL}/public/${exam?.icon || ""}`}
                  alt={exam.title || ""}
                  fill
                  unoptimized
                  className="object-contain p-1.5"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-cyan-900 group-hover:text-amber-600 transition-colors truncate">
                  {exam.title}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-center text-[#05101f]/60 text-ellipsis ">
                {exam.description || "Syllabus, mock tests & analytics"}
              </p>
            </div>
            <span className="text-[13px] text-amber-600">View More</span>
          </button>
        ))}
      </div>
    </div>
  );
}
