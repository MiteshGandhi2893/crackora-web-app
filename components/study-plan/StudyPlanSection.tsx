"use client";
import { para, sectionHeading } from "../../styles/typography";
import Image from "next/image";
import { CreatePlanButton } from "../app-buttons/create-plan";

export function StudyPlanSection() {

  return (
    <>
      <section className="bg-linear-to-r from-cyan-950 via-cyan-950 to-green-900 w-full z-30 lg:px-30 sm:px-10 px-5 flex flex-col py-20 gap-5 relative justify-center">
        <div className="flex gap-10 ">
          <div className="flex flex-col gap-5 lg:w-4/5 sm:w-1/2 z-100">
            <h2
              className={`text-4xl font-semibold text-white ${sectionHeading}`}
            >
              Study Planner
            </h2>
            <p
              className={` tracking-tight  leading-6  text-neutral-300  ${para} `}
            >
              Crackora’s Study Planner creates a structured preparation plan
              based on your exam date and available study hours. It breaks your
              syllabus into weekly goals, assigns topics to each phase of
              preparation, and distributes study hours across topics so you know
              exactly what to focus on every day. The goal is simple: remove
              confusion and help you prepare in a steady, manageable way.
            </p>
            <div>
              <CreatePlanButton addonClass={"px-4 py-2 bg-amber-600"}/>
            </div>
          </div>
          <div className="sm:flex lg:w-1/5 sm:w-1/2 hidden items-center relative">
            <Image src="/planner.svg" alt="" className="w-100" fill />
          </div>
        </div>
      </section>
    </>
  );
}
