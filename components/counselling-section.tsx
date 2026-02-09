"use client";
import { CounsellingForm } from "./forms/CounsellingForm";

export function CounsellingSection() {

  return (
    <>
      <section className="bg-linear-to-l from-cyan-950 via-cyan-900 to-green-950 sm:py-16 py-10 flex flex-col-reverse sm:flex-row items-center gap-10 lg:px-25 px-6">
        {/* Left image */}
        <div className="sm:w-1/2 w-full relative h-96 justify-center flex">
          <div className="w-100">
            <CounsellingForm />
          </div>
        </div>

        {/* Right content */}
        <div className="lg:w-1/2 w-full flex justify-end">
          <div className=" flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-amber-300">
              1-on-1 Mentorship & Doubt Solving
            </h2>
            <p className="text-white/90 sm:text-lg text-sm">
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
