"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";

export function StudyCalendar({ studyPlan }: any) {
  const [activeWeek, setActiveWeek] = useState(0);
  const weekPlan = studyPlan?.weekly_plan;

  useEffect(() => {
    if (Array.isArray(weekPlan) && weekPlan.length > 0) {
      setActiveWeek(0);
    }
  }, [weekPlan]);

  const isValidStudyPlan = Array.isArray(weekPlan) && weekPlan.length > 0;

  return (
    <div className="flex flex-col">

      {/* ---------------- Week Selector ---------------- */}
      {isValidStudyPlan && (
        <div className="relative p-6">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <div className="swiper-button-prev cursor-pointer text-amber-700">
              <BiSolidLeftArrow size={20} />
            </div>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <div className="swiper-button-next cursor-pointer text-amber-700">
              <BiSolidRightArrow size={20} />
            </div>
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={8}
            slidesPerView="auto"
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
          >
            {weekPlan.map((s: any, index: number) => (
              <SwiperSlide key={index} className="w-auto!">
                <button
                  onClick={() => setActiveWeek(index)}
                  className={`px-4 py-1.5 rounded-full border text-sm transition
                    ${
                      activeWeek === index
                        ? "bg-amber-700 text-white border-amber-700"
                        : "bg-white text-cyan-900 border border-gray-200 shadow hover:bg-gray-50"
                    }`}
                >
                  Week {s.week}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* ---------------- Active Week ---------------- */}
      {isValidStudyPlan && weekPlan[activeWeek] && (
        <div className="bg-neutral-100 border rounded-2xl p-4 lg:p-6  max-h-[80vh] h-full overflow-auto">

          {/* Header */}
          <div className="mb-4">
            <div className="text-amber-700 text-lg font-semibold">
              Week {weekPlan[activeWeek].week}
            </div>

            <div className="text-gray-500 text-xs">
              {new Date(weekPlan[activeWeek].startDate).toLocaleDateString()} –{" "}
              {new Date(weekPlan[activeWeek].endDate).toLocaleDateString()}
            </div>
          </div>

          {/* ✅ Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {weekPlan[activeWeek].sections?.map(
              (section: any, sectionIndex: number) => (
                <div
                  key={sectionIndex}
                  className="bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-3"
                >
                  <div className="text-amber-700 font-medium">
                    {section.title}
                  </div>

                  {section.subSections?.map(
                    (subSection: any, subIndex: number) => (
                      <div key={subIndex} className="flex flex-col gap-2">

                        <div className="text-cyan-900 sm:text-md text-sm font-medium">
                          {subSection.title}
                        </div>

                        {/* Cleaner Topic Rows Instead of Heavy Table */}
                        <div className="flex flex-col gap-1">
                          {subSection.topics?.map(
                            (topic: any, topicIndex: number) => (
                              <div
                                key={topicIndex}
                                className="flex justify-between text-[13px] bg-gray-50 rounded px-3 py-2"
                              >
                                <span className="text-gray-700">{topic.title}</span>
                                <span className="text-gray-800">
                                  {topic.allocatedHours} hrs
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {!isValidStudyPlan && (
        <div className="text-center text-gray-500 py-10">
          No study plan available.
        </div>
      )}
    </div>
  );
}
