"use client";
// PackagesTeaserCard.tsx — CLIENT COMPONENT
// The "what courses we have" bento cell — now on the real MenuPackage
// shape (course_name / image / price / discounted_price / checkout_link),
// borrowed directly from CourseCard.tsx. Compact vertical slides,
// one per view, no feature list — just enough to make someone tap.

import { useEffect, useState } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/services/api.service";
import {
  Entrance,
  PaperExam,
  PaperExamForMenu,
} from "@/interfaces/papersets.interface";
import { paperSetService } from "@/services/previouspaperset.service";
import router from "next/router";

export function PaperListCard({ className = "" }: { className?: string }) {
  const [paperSets, setPaperSets] = useState<Record<string, PaperExamForMenu>>(
    {},
  );
  const [entrances, setEntrances] = useState<Entrance[]>([]);
  const handlePapersetClick = (paperExam: PaperExam) => {
    router.push(`/previous-paperset/${paperExam.slug}`);
  };
  useEffect(() => {
    paperSetService
      .getAll()
      .then((res) => {
        setPaperSets(res.paperSets || {});
        setEntrances(res.entrances || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col mt-5 max-h-60 overflow-y-auto">
      {entrances.map((entrance, index) => {
        return (
          <div key={index} className="text-amber-500 text-[14px]">
            {entrance.name}
            <div className="flex flex-col gap-3">
              {paperSets[entrance.id].paperExams.map((paper, index) => {
                return (
                  <div
                    key={index}
                    className="flex gap-3  text-white/70 items-center hover:bg-amber-100/10 p-1 py-2 "
                    onClick={() => handlePapersetClick(paper)}
                  >
                    <div className="relative w-15 h-15 rounded-lg overflow-hidden border border-[#e8e4dc] bg-[#f8f7f4] shrink-0">
                      <Image
                        src={`${API_BASE_URL}/public/${paper?.exam_icon || ""}`}
                        alt={paper.paper_title || ""}
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <div className="text-[12px]">
                      {paper.paper_title} <br />
                      <span className="text-amber-300 text-xs">
                        ({paper.paper_count} Papers)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
