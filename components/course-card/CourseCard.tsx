import { BiRupee } from "react-icons/bi";

export function CoursePackageCard() {
  return (
    <>
      <div className="w-[280px] border-1 border-neutral-200 rounded-lg shadow-xl p-4
       h-[400px] bg-white flex flex-col gap-2">

        <div className="w-full  h-[45%] p-2">
            <div className="border border-gray-200 bg-neutral-200 h-full rounded-lg"></div>
        </div>
        <div className="bg-sky-50 w-30 h-8 ml-2 rounded-xl p-1 text-xs text-cyan-800  font-semibold flex justify-center items-center">
            CAT Exam
        </div>

        <div className="text-cyan-950 text-[14px] ml-2">
            Combine course for CAT Exam
        </div>

        <div className="flex ml-2 gap-2 text-gray-400 text-xs">
            <span>Lessons 7</span>
            <span>Mock tests 5</span>
        </div>

        <div className="flex flex-col ml-2">
            <span className=" text-cyan-800 text-sm font-semibold">Mitesh Gandhi</span>
            <span className=" text-cyan-600 text-xs">Software Engineer</span>
        </div>
        <div className="w-full border-b-1 border-b-neutral-200 px-2 mt-2"></div>

        <div className="flex justify-between px-2 items-center h-10">
          <div className="flex justify-center items-center text-gray-700"><BiRupee></BiRupee> 2999</div>
            <div><button className="text-[14px] text-cyan-800 cursor-pointer">View Details</button></div>
        </div>
       </div>
    </>
  );
}
