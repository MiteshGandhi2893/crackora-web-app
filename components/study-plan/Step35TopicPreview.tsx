/* eslint-disable react-hooks/set-state-in-effect */
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { studyPlannerService } from "@/services/StudyPlan.service";

interface Topic {
  id: string;
  title: string;
  estimatedHours: number;
  weightage: "HIGH" | "MEDIUM" | "LOW";
}

interface SubSection {
  id: string;
  title: string;
  topics: Topic[];
}

interface Section {
  id: string;
  title: string;
  weightScore: number;
  subSections: SubSection[];
}

export interface WeakSelection {
  weakSubSectionIds: string[];
  weakTopicIds: string[];
}

interface Step35Props {
  examId: string;
  level: string;
  onWeakSelectionChange?: (sel: WeakSelection) => void;
}

const WEIGHT_COLOR: Record<string, string> = {
  HIGH: "bg-red-100 text-red-700 border-red-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  LOW: "bg-cyan-100 text-cyan-700 border-cyan-200",
};

const WEIGHT_DOT: Record<string, string> = {
  HIGH: "bg-red-500",
  MEDIUM: "bg-amber-500",
  LOW: "bg-cyan-500",
};

export function Step35TopicPreview({
  examId,
  level,
  onWeakSelectionChange,
}: Step35Props) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [weakExpanded, setWeakExpanded] = useState<Set<string>>(new Set());

  const [showWeakPanel, setShowWeakPanel] = useState(false);
  const [weakMode, setWeakMode] = useState<"subsection" | "topic">("subsection");

  const [weakSubSections, setWeakSubSections] = useState<Set<string>>(
    new Set()
  );
  const [weakTopics, setWeakTopics] = useState<Set<string>>(new Set());

  /* ---------------------------
     Load topics
  ----------------------------*/
  useEffect(() => {
    if (!examId || !level) return;

    setLoading(true);
    setError(null);

    studyPlannerService
      .getTopicsForPreview(examId, level)
      .then(({ sections: data, error: err }) => {
        if (err) {
          setError(err);
          return;
        }

        setSections(data);

        if (data.length) {
          setExpanded(new Set([data[0].id]));
          setWeakExpanded(new Set([data[0].id]));
        }
      })
      .catch((e) => setError(e?.message ?? "Failed to load topics"))
      .finally(() => setLoading(false));
  }, [examId, level]);

  /* ---------------------------
     Notify parent
  ----------------------------*/
  useEffect(() => {
    onWeakSelectionChange?.({
      weakSubSectionIds: Array.from(weakSubSections),
      weakTopicIds: Array.from(weakTopics),
    });
  }, [weakSubSections, weakTopics, onWeakSelectionChange]);

  /* ---------------------------
     Helpers
  ----------------------------*/
  const toggleSetItem = (set: Set<string>, id: string) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  };

  const toggleAccordion = (id: string) =>
    setExpanded((prev) => toggleSetItem(prev, id));

  const toggleWeakAccordion = (id: string) =>
    setWeakExpanded((prev) => toggleSetItem(prev, id));

  const toggleWeakSubSection = (id: string) =>
    setWeakSubSections((prev) => toggleSetItem(prev, id));

  const toggleWeakTopic = (id: string) =>
    setWeakTopics((prev) => toggleSetItem(prev, id));

  const toggleAllTopicsInSubSection = (ss: SubSection) => {
    const ids = ss.topics.map((t) => t.id);

    setWeakTopics((prev) => {
      const next = new Set(prev);
      const allSelected = ids.every((id) => next.has(id));

      ids.forEach((id) => {
        allSelected ? next.delete(id) : next.add(id);
      });

      return next;
    });
  };

  const allTopics = sections.flatMap((s) =>
    s.subSections.flatMap((ss) => ss.topics)
  );

  const totalTopics = allTopics.length;
  const totalHours = allTopics.reduce((a, t) => a + t.estimatedHours, 0);

  const weakCount =
    weakMode === "subsection" ? weakSubSections.size : weakTopics.size;

  /* ---------------------------
     Loading
  ----------------------------*/
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-cyan-900">Loading your topic map…</p>
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
        ⚠️ {error}
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {/* ---------------------------
         Weak Panel
      ----------------------------*/}
      <div className="border border-dashed border-amber-300 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowWeakPanel((p) => !p)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 hover:bg-amber-100 transition"
        >
          <span className="text-lg">🎯</span>

          <div className="flex-1 text-left">
            <p className="font-bold text-sm text-amber-800">
              Mark your weak areas
            </p>

            <p className="text-[11px] text-amber-600">
              {weakCount > 0
                ? `${weakCount} ${
                    weakMode === "subsection" ? "subsection" : "topic"
                  } marked`
                : "Optional — we'll give extra time here"}
            </p>
          </div>
        </button>

        {showWeakPanel && (
          <div className="px-4 pb-4 pt-3 bg-white flex flex-col gap-4">
            {/* Mode toggle */}
            <div className="flex gap-2">
              {(["subsection", "topic"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setWeakMode(mode)}
                  className={`text-[11px] px-3 py-1 rounded-full border ${
                    weakMode === mode
                      ? "bg-amber-600 text-white border-amber-600"
                      : "border-amber-300 text-amber-700"
                  }`}
                >
                  {mode === "subsection"
                    ? "Sub-section"
                    : "Individual topic"}
                </button>
              ))}
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-2">
              {sections.map((section) => {
                const open = weakExpanded.has(section.id);

                return (
                  <div
                    key={section.id}
                    className="border border-gray-100 rounded-xl"
                  >
                    <button
                      onClick={() => toggleWeakAccordion(section.id)}
                      className="w-full flex items-center px-3 py-2 bg-gray-50 hover:bg-amber-50"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          section.weightScore >= 3
                            ? "bg-red-500"
                            : section.weightScore === 2
                            ? "bg-amber-500"
                            : "bg-cyan-500"
                        }`}
                      />

                      <span className="flex-1 text-xs font-bold text-cyan-950">
                        {section.title}
                      </span>

                      <span
                        className={`text-xs transition ${
                          open ? "rotate-90" : ""
                        }`}
                      >
                        ▶
                      </span>
                    </button>

                    {open && (
                      <div className="p-2 flex flex-col gap-1">
                        {section.subSections.map((ss) => (
                          <button
                            key={ss.id}
                            onClick={() => toggleWeakSubSection(ss.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
                              weakSubSections.has(ss.id)
                                ? "bg-red-50 border-red-300"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            {ss.title}

                            <span className="ml-auto text-[10px] text-gray-400">
                              {ss.topics.length} topics
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            {weakCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl">
                ⚠️
                <span className="text-[11px] text-red-700">
                  {weakCount} weak area
                  {weakCount > 1 ? "s" : ""} selected
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}