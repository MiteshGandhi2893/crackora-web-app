/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useStudyPlanner } from "@/providers/StudyPlanProvider";
import { BiCalendar } from "react-icons/bi";

export function CreatePlanButton(props: any) {
  const { addonClass } = props;
  const { openPlanner } = useStudyPlanner();

  return (
    <>
      <button
        className={` ${addonClass}  flex gap-1 justify-center items-center text-white rounded cursor-pointer hover:scale-105`}
        onClick={openPlanner}
      >
        <BiCalendar className="w-4 h-4"/>
        <span>Create Plan</span>
      </button>
    </>
  );
}
