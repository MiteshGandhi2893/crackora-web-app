import { BiCalendarCheck, BiVideo, BiQuestionMark } from "react-icons/bi";

import { para, subText } from "../styles/typography";

export function WhyCrackora() {
  return (
    <>
      <div className="flex flex-col lg:flex-col w-full lg:px-30 px-8 py-15 mb-20 gap-5 relative bg-white">
        {/* Right Section */}

        <div className="flex sm:h-80 h-150 items-center sm:flex-row flex-col gap-5">
          <div className="sm:w-1/2 w-full flex flex-col  gap-2">
            <div className="text-amber-600 font-semibold text-3xl lg:text-5xl">
              Why Crackora Stands Out?
            </div>
            <div className="text-bold text-2xl lg:text-3xl text-cyan-900">
              Expert-Led Learning, Tailored for You
            </div>
            <p className={`text-gray-600 text-md md:text-md ${para}`}>
             A focused competitive exam preparation platform that prioritizes realistic mock tests and meaningful practice. Instead of overwhelming students, we aim to provide the right tools at the right time. With upcoming courses, preparation packages, and live sessions, Crackora is growing into a complete exam-prep ecosystem—step by step.
            </p>
          </div>
          <div className="h-full sm:w-1/2 w-full relative cursor-pointer rounded-t-xl">
            <iframe
              className="w-full h-full rounded-xl shadow"
              src="https://www.youtube.com/embed/8Apv0Jj695A?si=EZe20ODdrz7qjJes"
              title="YouTube video player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-4 mt-7">
          <div className="bg-amber-200/50 border-l-amber-800 border-l-8 border border-amber-400  rounded-2xl shadow p-5 flex flex-col gap-2 items-center">
            <span className="flex sm:text-lg text-md font-semibold text-amber-800 text-left gap-2">
              <BiCalendarCheck className="w-6 h-6" /> Personalized Study Plans
            </span>
            <p className={` text-amber-800 flex text-left ${subText}`}>
              Tailored schedules to optimize your learning.
            </p>
          </div>

          <div className="bg-green-100  border-l-green-700 border-l-8 border border-green-400 rounded-2xl shadow p-5 flex flex-col gap-2 justify-center items-start">
            <span className="flex sm:text-lg text-md  font-semibold text-green-900 items-center justify-cente gap-2">
              <BiQuestionMark className="w-6 h-6" /> Doubt-Solving on Demand
            </span>
            <span className={` text-green-800 flex text-left ${subText}`}>
              Get expert answers whenever you need them.
            </span>
          </div>

          <div className="bg-amber-200/50  border-l-amber-800 border-l-8 border border-amber-400  rounded-2xl shadow p-5 flex flex-col gap-2 items-start">
            <span className="flex sm:text-lg text-md font-semibold text-amber-800 text-left gap-2">
              Exam-Specific Resources
            </span>
            <span className={` text-amber-800 flex text-left ${subText}`}>
              High-quality materials to boost your preparation.
            </span>
          </div>

          <div className="bg-green-100  border-l-green-700 border-l-8 border border-green-400 rounded-2xl shadow p-5 flex flex-col gap-2 justify-center items-start">
            <span className="flex sm:text-lg text-md  font-semibold text-green-900 items-center justify-cente gap-2">
              <BiVideo className="w-6 h-6" /> Live & Recorded Sessions
            </span>
            <span className={` text-green-800 flex text-left ${subText}`}>
              Learn at your own pace, anytime, anywhere.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
