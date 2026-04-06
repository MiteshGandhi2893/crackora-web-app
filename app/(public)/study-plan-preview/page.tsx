/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { StudyCalendar } from "@/components/study-plan/StudyCalendar";
import { STARS } from "@/lib/util";
import { useEffect, useState } from "react";

export default function Page() {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("previewPlan");

    if (stored) {
      setPlan(JSON.parse(stored));
    }
  }, []);

  if (!plan) return null;

  return (
    <div className="bg-[#f8f7f4] border-b border-gray-100 relative mt-15">
      <div className="relative">
        {/* BACKGROUND */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[#020617]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* STARS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {STARS.map((s) => (
            <span
              key={s.id}
              className={`absolute rounded-full ${
                s.amber ? "bg-amber-300" : "bg-white"
              }`}
              style={{
                top: s.top,
                left: s.left,
                width: s.w,
                height: s.w,
                opacity: s.opacity,
              }}
            />
          ))}
        </div>
        <div className="pt-10 pb-6 text-center relative z-20">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Your Study Plan is Ready 🚀
          </h1>

          <p className="text-white/70 mt-2 max-w-xl mx-auto">
            This is a preview of your personalized preparation schedule. Save
            the plan to track progress, mark topics complete, and stay on track
            till exam day.
          </p>

          <div className="mt-4 flex justify-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              Preview Mode
            </span>

            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/30">
              Progress disabled
            </span>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              Save to enable tracking
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative max-w-6xl mx-auto px-4 py-10 min-h-screen flex flex-col">
        {/* ───────── Banner ───────── */}

        {/* Calendar */}
        <StudyCalendar studyPlan={plan} mode="preview" />
      </div>
    </div>
  );
}
