import { BiRupee } from "react-icons/bi";

export function CoursePackageCard() {
  return (
    <>
      <div
        className="sm:w-65 w-60 h-90 border border-neutral-200 rounded-lg shadow-xl
        bg-white flex flex-col gap-2"
      >
        <div className="w-full  h-[45%] p-2">
          <div className="border border-gray-200 bg-neutral-200 h-full rounded-lg"></div>
        </div>
        <div className="flex flex-col gap-2 px-4">
          <div className="bg-sky-50 w-30 h-8 rounded-xl  text-xs text-cyan-800  font-semibold flex justify-center items-center">
            CAT Exam
          </div>

          <div className="text-cyan-950 text-[14px]">
            Combine course for CAT Exam
          </div>

          <div className="flex gap-2 text-gray-400 text-xs">
            <span>Lessons 7</span>
            <span>Mock tests 5</span>
          </div>
        <div className="flex flex-col ">
          <span className=" text-cyan-800 text-sm font-semibold">
            Mitesh Gandhi
          </span>
          <span className=" text-cyan-600 text-xs">Software Engineer</span>
        </div>
        </div>

        <div className="w-full border-b border-b-neutral-200 px-2 mt-2"></div>

        <div className="flex justify-between px-2 items-center h-6">
          <div className="flex justify-center items-center text-gray-700">
            <BiRupee></BiRupee> 2999
          </div>
          <div>
            <button className="text-[14px] text-cyan-800 cursor-pointer">
              View Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
