/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { CreatePlanButton } from "@/components/app-buttons/create-plan";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function StudyPlannerCard() {
  const [hasPreview, setHasPreview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("previewPlan");
    if (stored) setHasPreview(true);
  }, []);

  return (
    <>
      <div className="space-y-3">

        {/* Info badge */}
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
          <span className="text-blue-500 text-sm shrink-0">ℹ</span>
          <p className="text-xs text-blue-700">
            Your personalised plan is generated based on your exam date,
            weak topics, and daily hours.
            Preview is free — save to track daily progress.
          </p>
        </div>

        {/* Generate button */}
        <CreatePlanButton
          addonClass="px-3 py-1.5 sm:text-[15px] text-[12px] w-fit bg-amber-600"
        />

        {/* ✅ NEW BUTTON */}
        {hasPreview && (
          <button
            onClick={() => router.push("/study-plan-preview")}
            className="px-3 py-1.5 text-[12px] sm:text-[15px] rounded-lg border border-cyan-700 text-cyan-700 hover:bg-cyan-50 transition"
          >
            Open last generated plan
          </button>
        )}

      </div>
    </>
  );
}