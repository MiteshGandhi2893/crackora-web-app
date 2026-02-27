"use client";
import { CounsellingForm } from "./forms/CounsellingForm";

export function CounsellingSection() {
  return (
    <>
      <section className="bg-linear-to-r from-cyan-950 via-cyan-950 to-green-900  py-10 flex flex-col-reverse sm:flex-row-reverse justify-center items-center gap-10 lg:px-25 px-6">
        {/* Left image */}
        <div className="sm:w-1/2 w-full relative h-96 justify-center items-center flex">
          <div className="w-100">
            <CounsellingForm />
          </div>
        </div>

        {/* Right content */}
        <div className="lg:w-1/2 w-full flex justify-end">
          <div className=" flex flex-col gap-6">
            
            <div className="flex flex-col  gap-2">
              <h2 className=" text-amber-100 font-semibold text-2xl lg:text-4xl ">
              Mentorship & Doubt Solving
              </h2>
              <div className="bg-amber-600 h-0.5 sm:w-60 w-30"></div>
            </div>
            <p className="text-amber-50/90 sm:text-lg text-sm">
              Get personalized guidance from expert mentors. Solve your doubts
              and accelerate your exam preparation.
            </p>
            <ul className="flex flex-col gap-2 text-slate-300">
              <li>✅ Personalized doubt solving sessions</li>
              <li>✅ One-to-one counselling for exam strategies</li>
              <li>✅ Flexible timings as per your schedule</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
