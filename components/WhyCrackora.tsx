import { BiCalendarCheck, BiVideo, BiQuestionMark } from "react-icons/bi";
import { para, subText } from "../styles/typography";

const features = [
  {
    icon: <BiCalendarCheck className="w-6 h-6" />,
    title: "Personalized Study Plan",
    description: "Tailored schedules to optimize your learning.",
    bgColor: "bg-amber-200/50",
    borderColor: "border-l-8 border-l-amber-800 border border-amber-400",
    textColor: "text-amber-800",
    padding: "p-3",
    justify: "items-start jusitfy-center",
  },
  {
    icon: <BiQuestionMark className="w-6 h-6" />,
    title: "Live Doubt Sessions",
    description: "Get expert answers whenever you need them.",
    bgColor: "bg-green-100",
    borderColor: " border-l-8 border-l-green-700 border border-green-400",
    textColor: "text-green-800",
    padding: "p-3 ",
    justify: "items-start jusitfy-center",
  },
  {
    icon: null,
    title: "Exam-Specific Resources",
    description: "High-quality materials to boost your preparation.",
    bgColor: "bg-amber-200/50",
    borderColor: "border-l-8 border-l-amber-800 border border-amber-400",
    textColor: "text-amber-800",
    padding: "p-3",
    justify: "items-start jusitfy-center",
  },
  {
    icon: <BiVideo className="w-6 h-6" />,
    title: "Live & Recorded Sessions",
    description: "Learn at your own pace, anytime, anywhere.",
    bgColor: "bg-green-100",
    borderColor: "border-l-8 border-l-green-700 border border-green-400",
    textColor: "text-green-800",
    padding: "p-3",
    justify: "items-start jusitfy-center",
  },
];

export function WhyCrackora() {
  return (
    <div className="flex flex-col lg:flex-col w-full lg:px-30 px-8 sm:py-15 py-10 gap-5 relative bg-white">
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
        {features.map((feature, index) => (
          <div
            key={index}
            className={`${feature.bgColor} ${feature.borderColor} rounded-2xl sm:h-30 h-22 shadow ${feature.padding} flex flex-col gap-1 ${feature.justify}`}
          >
            <span className={`flex text-[16px]  font-semibold ${feature.textColor} text-left gap-2 items-center`}>
              {feature.icon} {feature.title}
            </span>
            <span className={`flex text-left ${feature.textColor} ${subText}`}>
              {feature.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
