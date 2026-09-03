/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "@/services/api.service";
import { useRouter } from "next/navigation";
import {
  Entrance,
  PaperExam,
  PaperExamForMenu,
} from "@/interfaces/papersets.interface";
import { paperSetService } from "@/services/previouspaperset.service";

export function PreviousPaperMegaMenu({ onClose }: { onClose?: () => void }) {
  const [paperSets, setPaperSets] = useState<Record<string, PaperExamForMenu>>(
    {},
  );
  const [entrances, setEntrances] = useState<Entrance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeEntranceId, setActiveEntranceId] = useState("");
  const router = useRouter();
  useEffect(() => {
    setLoading(true);

    paperSetService
      .getAll()
      .then((res) => {
        setPaperSets(res.paperSets || {});
        setEntrances(res.entrances || []);

        if (res.entrances?.length) {
          setActiveEntranceId(res.entrances[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const papers = useMemo(() => {
    if (!activeEntranceId) return [];

    return paperSets[activeEntranceId]?.paperExams ?? [];
  }, [paperSets, activeEntranceId]);


 const handlePapersetClick = (paperExam: PaperExam) => {
    router.push(`/previous-paperset/${paperExam.slug}`);
    onClose?.();
  };


  return (
    <div className="w-full overflow-hidden bg-[#f8f7f4]">
      {/* Header */}
      <div className="flex items-center bg-cyan-950 justify-between px-6 py-3 border-b border-[#f0ede6]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-cyan-50">
            Previous Papers
          </span>
          {/* <span className="text-[11px] bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5 font-semibold">
            {totalActive} 
          </span> */}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search papers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[12px] pl-7 pr-3 py-1.5 rounded-lg border border-[#e8e4dc] bg-[#faf9f7] focus:outline-none focus:border-amber-300 w-44 text-[#05101f]"
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
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white hover:bg-[#f0ede6] border border-[#e8e4dc] flex items-center justify-center cursor-pointer text-amber-700 hover:text-red-800 transition-all text-lg"
          >
            ×
          </button>
        </div>
      </div>
      {/* Body: sidebar + tabbed grid */}
      <div className="flex flex-col sm:flex-row max-h-[70vh] my-5">
        {/* Sidebar: entrances */}
        <div className="sm:w-56 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-gray-300 bg-[#faf9f7]">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:max-h-[70vh] p-2 gap-1">
            {entrances.map((entrance) => {
              const isSelected = entrance.id === activeEntranceId;
              return (
                <button
                  key={entrance.id}
                  onClick={() => {
                    setActiveEntranceId(entrance.id);
                    setSearch("");
                  }}
                  className={`flex-shrink-0 sm:flex-shrink flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer whitespace-nowrap sm:whitespace-normal ${
                    isSelected
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-[#05101f]/70 hover:bg-[#f0ede6]"
                  }`}
                >
                  <span className="text-[13px] font-semibold">
                    {entrance.name}
                  </span>
                  <span
                    className={`text-[10px] rounded-full px-1.5 py-0.5 font-semibold flex-shrink-0 ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {entrance.total_papers}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 overflow-y-auto">
          {loading && (
            <p className="col-span-full text-center text-sm text-[#05101f]/40 py-8">
              Loading papers...
            </p>
          )}
          {!loading && papers.length === 0 && (
            <p className="col-span-full text-center text-sm text-[#05101f]/40 py-8">
              No papers found for {search}
            </p>
          )}
          {papers.map((paperExam, i) => (
            <button
              key={i}
              onClick={() => handlePapersetClick(paperExam)}
              data-examcard={paperExam.exam_name}
              className="max-h-50  cursor-pointer group flex flex-col shadow items-center gap-3 bg-white border border-[#e8e4dc] hover:border-amber-300  w-50
                      rounded-xl p-3 text-left transition-all duration-200 hover:shadow-[0_4px_16px_rgba(5,16,31,0.08)] hover:-translate-y-0.5"
            >
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#e8e4dc] bg-[#f8f7f4] flex-shrink-0">
                  <Image
                    src={`${API_BASE_URL}/public/${paperExam?.exam_icon || ""}`}
                    alt={paperExam.paper_title || ""}
                    fill
                    unoptimized
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="flex-1 min-w-0 ">
                  <p
                    className="text-[12px] font-semibold text-cyan-900  transition-colors text-wrap text-center"
                    data-examcard-title={paperExam.paper_title}
                  >
                    {paperExam.paper_title}
                  </p>
                </div>

                <div className="flex-1 min-w-0 ">
                  <p
                    className="text-[12px] font-semibold text-gray-500 transition-colors text-wrap text-center"
                    data-examcard-title={paperExam.paper_title}
                  >
                    {paperExam.paper_count} Papers
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-white border px-2 py-1 border-gray-200 rounded shadow bg-amber-600">
                View More
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
