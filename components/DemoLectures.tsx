"use client"
import { useState } from "react";
import { BiPlay } from "react-icons/bi";
import { para, sectionHeading } from "../styles/typography";

type DemoVideo = {
  title: string;
  desc: string;
  videoId: string;
};

export function DemoLectures() {
  const videos: DemoVideo[] = [
    {
      title: "MCA",
      desc: "Maths, reasoning & CS fundamentals",
      videoId: "8Apv0Jj695A",
    },
    {
      title: "CAT",
      desc: "Quant & logical reasoning strategy",
      videoId: "l9nh1l8ZIJQ",
    },
    {
      title: "OLAT",
      desc: "Law aptitude & reasoning basics",
      videoId: "OZBWfyYtYQY",
    },
    {
      title: "SLAT",
      desc: "Legal aptitude & comprehension",
      videoId: "R2zC3dKQ42Y",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeVideo = videos[activeIndex];

  return (
    <section className="bg-white sm:py-20 py-10 px-6 sm:px-8 lg:px-28 z-20">
      <div className="w-full">
        {/* Header */}
        <div className="mb-5">
          <h2 className={`text-3xl font-semibold text-cyan-900 ${sectionHeading}`}>
            Explore How We Teach
          </h2>
          <p className={`text-slate-600 mt-2 leading-6 ${para}`}>
           Watch real demo lectures before you commit. Experience concept-driven teaching with a structured flow, exam-focused clarity, and expert mentorship. 
           Gain confidence, clear your doubts instantly, and prepare effectively for competitive exams like MCA, GATE, NIMCET, and more. 
           Join thousands of students who trust our one-on-one guidance and personalized learning sessions to boost scores and master concepts faster.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-[360px_1fr] lg:grid-cols-[600px_1fr] gap-10">
          {/* Left selector */}
          <div className="space-y-3 flex flex-col justify-center">
            {videos.map((video, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={video.title}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full flex items-start gap-3 rounded-xl px-4 py-3 text-left cursor-pointer transition-all
                    ${
                      isActive
                        ? "bg-cyan-900 border-l-4 border-cyan-500 shadow"
                        : "bg-slate-200/90 hover:bg-cyan-900 border-l-4 border-white/60 "
                    }
                  group`}
                >
                  {/* Watch icon */}
                  <div
                    className={`mt-1 ${
                      isActive ? "text-cyan-200" : "text-cyan-800"
                    } group-hover:text-cyan-200`}
                  >
                    <BiPlay size={18} />
                  </div>

                  <div>
                    <div
                      className={`font-medium ${
                        isActive ? "text-amber-200" : "text-amber-700"
                      } group-hover:text-amber-200`}
                    >
                      {video.title}
                    </div>
                    <div
                      className={`text-sm ${
                        isActive ? "text-slate-200" : "text-cyan-900"
                      } ${para} group-hover:text-slate-200`}
                    >
                      {video.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Video */}
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black">
            <iframe
              key={activeVideo.videoId}
              className="w-full aspect-video sm:h-full h-60"
              src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
              title={activeVideo.title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
