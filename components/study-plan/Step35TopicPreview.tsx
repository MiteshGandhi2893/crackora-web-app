/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

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

const WEIGHT_CONFIG: Record<
  string,
  { dot: string; badge: string; label: string }
> = {
  HIGH: {
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-600 border border-red-200",
    label: "High",
  },
  MEDIUM: {
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    label: "Medium",
  },
  LOW: {
    dot: "bg-cyan-500",
    badge: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    label: "Low",
  },
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

  const [showWeakPanel, setShowWeakPanel] = useState(false);
  const [weakMode, setWeakMode] = useState<"subsection" | "topic">(
    "subsection"
  );

  const [weakSubSections, setWeakSubSections] = useState<Set<string>>(
    new Set()
  );
  const [weakTopics, setWeakTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!examId || !level) return;
    setLoading(true);
    setError(null);

    studyPlannerService
      .getTopicsForPreview(examId, level)
      .then(({ sections: data, error: err }) => {
        if (err) return setError(err);
        setSections(data);
        if (data.length) setExpanded(new Set([data[0].id]));
      })
      .catch((e) => setError(e?.message ?? "Failed to load topics"))
      .finally(() => setLoading(false));
  }, [examId, level]);

  useEffect(() => {
    onWeakSelectionChange?.({
      weakSubSectionIds: Array.from(weakSubSections),
      weakTopicIds: Array.from(weakTopics),
    });
  }, [weakSubSections, weakTopics, onWeakSelectionChange]);

  const toggleSetItem = (set: Set<string>, id: string) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  };

  const toggleAccordion = (id: string) =>
    setExpanded((prev) => toggleSetItem(prev, id));

  const toggleWeakSubSection = (id: string) =>
    setWeakSubSections((prev) => toggleSetItem(prev, id));

  const toggleWeakTopic = (id: string) =>
    setWeakTopics((prev) => toggleSetItem(prev, id));

  const toggleAllTopicsInSubSection = (ss: SubSection) => {
    if (weakMode !== "topic") return;
    const ids = ss.topics.map((t) => t.id);
    setWeakTopics((prev) => {
      const next = new Set(prev);
      const allSelected = ids.every((id) => next.has(id));
      ids.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const weakCount =
    weakMode === "subsection" ? weakSubSections.size : weakTopics.size;

  if (loading)
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-800 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-sm text-cyan-800 font-medium tracking-wide">
            Loading topics…
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
        <span className="text-red-500 text-lg">⚠</span>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      {/* ── Weak Areas Panel ── */}
      <div
        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
          showWeakPanel
            ? "border-amber-400 shadow-md shadow-amber-100"
            : "border-amber-200"
        }`}
      >
        {/* Header toggle */}
        <button
          onClick={() => setShowWeakPanel((p) => !p)}
          className="w-full flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-amber-50 to-white hover:from-amber-100 transition-colors duration-150"
        >
          {/* Icon */}
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg">
            🎯
          </div>

          {/* Text */}
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-cyan-900 leading-none mb-0.5">
              Mark your weak areas
            </p>
            <p className="text-xs text-amber-600">
              {weakCount > 0
                ? `${weakCount} ${
                    weakMode === "subsection" ? "subsection" : "topic"
                  }${weakCount > 1 ? "s" : ""} selected — extra time allocated`
                : "Optional — we'll prioritise these in your plan"}
            </p>
          </div>

          {/* Chevron */}
          <svg
            className={`w-4 h-4 text-amber-500 transition-transform duration-200 ${
              showWeakPanel ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Panel body */}
        {showWeakPanel && (
          <div className="px-5 pb-5 pt-3 bg-white flex flex-col gap-4">
            {/* Divider */}
            <div className="h-px bg-amber-100" />

            {/* Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-cyan-800 font-medium mr-1">
                Select by:
              </span>
              {(["subsection", "topic"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setWeakMode(mode);
                    if (mode === "subsection") setWeakTopics(new Set());
                    else setWeakSubSections(new Set());
                  }}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 capitalize ${
                    weakMode === mode
                      ? "bg-cyan-900 text-white shadow-sm"
                      : "bg-gray-100 text-cyan-800 hover:bg-cyan-50"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Sections Accordion */}
            <div className="flex flex-col gap-2">
              {sections.map((section) => {
                const open = expanded.has(section.id);

                return (
                  <div
                    key={section.id}
                    className="rounded-xl border border-gray-100 overflow-hidden"
                  >
                    {/* Section header */}
                    <button
                      onClick={() => toggleAccordion(section.id)}
                      className="w-full flex items-center gap-2 px-4 py-3 bg-cyan-950 hover:bg-cyan-900 text-left transition-colors duration-150"
                    >
                      <svg
                        className={`w-3.5 h-3.5 text-amber-400 flex-shrink-0 transition-transform duration-150 ${
                          open ? "rotate-90" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-white flex-1 truncate">
                        {section.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold tracking-wide flex-shrink-0">
                        W {section.weightScore}
                      </span>
                    </button>

                    {/* Section content */}
                    {open && (
                      <div className="flex flex-col divide-y divide-gray-50">
                        {section.subSections.map((ss) => {
                          const allSelected = ss.topics.every((t) =>
                            weakTopics.has(t.id)
                          );
                          const isWeakSub = weakSubSections.has(ss.id);

                          return (
                            <div key={ss.id} className="bg-white">
                              {/* SubSection row */}
                              <button
                                onClick={() =>
                                  weakMode === "subsection" &&
                                  toggleWeakSubSection(ss.id)
                                }
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 ${
                                  weakMode === "subsection"
                                    ? "cursor-pointer hover:bg-amber-50"
                                    : "cursor-default"
                                } ${isWeakSub ? "bg-amber-50" : ""}`}
                              >
                                {/* Checkbox indicator */}
                                {weakMode === "subsection" && (
                                  <span
                                    className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                      isWeakSub
                                        ? "bg-amber-500 border-amber-500"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {isWeakSub && (
                                      <svg
                                        className="w-2.5 h-2.5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3.5}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    )}
                                  </span>
                                )}

                                <span
                                  className={`text-sm flex-1 ${
                                    isWeakSub
                                      ? "text-amber-700 font-medium"
                                      : "text-cyan-900"
                                  }`}
                                >
                                  {ss.title}
                                </span>

                                {isWeakSub && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold flex-shrink-0">
                                    Weak
                                  </span>
                                )}
                              </button>

                              {/* Topics list */}
                              {weakMode === "topic" && (
                                <div className="px-4 pb-2 bg-gray-50">
                                  {/* Select all */}
                                  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 mb-1">
                                    <span className="text-[10px] text-cyan-800 font-medium uppercase tracking-wider">
                                      Topics
                                    </span>
                                    <button
                                      onClick={() =>
                                        toggleAllTopicsInSubSection(ss)
                                      }
                                      className="text-[10px] text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-2"
                                    >
                                      {allSelected
                                        ? "Unselect all"
                                        : "Select all"}
                                    </button>
                                  </div>

                                  {/* Topic rows */}
                                  <div className="flex flex-col gap-0.5">
                                    {ss.topics.map((t) => {
                                      const isWeak = weakTopics.has(t.id);
                                      const cfg = WEIGHT_CONFIG[t.weightage];

                                      return (
                                        <button
                                          key={t.id}
                                          onClick={() => toggleWeakTopic(t.id)}
                                          className={`flex items-center gap-2.5 w-full text-left px-2 py-1.5 rounded-lg transition-colors duration-100 ${
                                            isWeak
                                              ? "bg-amber-100"
                                              : "hover:bg-white"
                                          }`}
                                        >
                                          {/* Checkbox */}
                                          <span
                                            className={`flex-shrink-0 w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-colors ${
                                              isWeak
                                                ? "bg-amber-500 border-amber-500"
                                                : "border-gray-300"
                                            }`}
                                          >
                                            {isWeak && (
                                              <svg
                                                className="w-2 h-2 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={4}
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  d="M5 13l4 4L19 7"
                                                />
                                              </svg>
                                            )}
                                          </span>

                                          {/* Weight dot */}
                                          <span
                                            className={`flex-shrink-0 w-2 h-2 rounded-full ${cfg.dot}`}
                                          />

                                          {/* Title */}
                                          <span
                                            className={`text-xs flex-1 ${
                                              isWeak
                                                ? "text-amber-800 font-medium"
                                                : "text-cyan-900"
                                            }`}
                                          >
                                            {t.title}
                                          </span>

                                          {/* Hours + weight badge */}
                                          <span
                                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${cfg.badge}`}
                                          >
                                            {cfg.label}
                                          </span>
                                          <span className="text-[10px] text-gray-400 flex-shrink-0">
                                            {t.estimatedHours}h
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer summary pill */}
            {weakCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-cyan-950 rounded-xl">
                <span className="text-base">⚡</span>
                <p className="text-xs text-cyan-100">
                  <span className="font-bold text-amber-400">{weakCount}</span>{" "}
                  {weakMode === "subsection" ? "subsection" : "topic"}
                  {weakCount > 1 ? "s" : ""} flagged — your plan will allocate
                  extra revision time here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}