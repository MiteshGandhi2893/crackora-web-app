"use client";
import { useState } from "react";
import { BiPlay } from "react-icons/bi";
import Image from "next/image";
type DemoVideo = {
  title: string;
  desc: string;
  videoId: string;
};

export function DemoLectures() {
  const videos: DemoVideo[] = [
    {
      title: "Computer Concepts",
      desc: "PYQs",
      videoId: "oAQtkhUmWQ0",
    },
    {
      title: "Computer Basics",
      desc: "Top 30 Questions",
      videoId: "WjOi_I240is",
    },
    {
      title: "OLAT",
      desc: "Law aptitude & reasoning basics",
      videoId: "oAQtkhUmWQ0",
    },
    {
      title: "SLAT",
      desc: "Legal aptitude & comprehension",
      videoId: "oAQtkhUmWQ0",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeVideo = videos[activeIndex];
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnail = `https://img.youtube.com/vi/${activeVideo.videoId}/hqdefault.jpg`;

  return (
    <section className="w-full bg-[#f8f7f4] px-6 sm:px-12 lg:px-24 pb-16 lg:py-0 lg:pb-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Subtle glow */}
        <div className="pointer-events-none absolute top-0 right-0 w-[40vw] h-[50vh] rounded-full bg-[radial-gradient(ellipse,rgba(8,60,100,0.05),transparent_65%)]" />

        {/* Header */}
        <div className="flex flex-col gap-3 mb-10 lg:mb-12">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-600 font-sans">
            Free Preview
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-cyan-900 leading-tight tracking-tight">
            Explore How We Teach
          </h2>
          <div className="h-0.5 w-12 bg-amber-500 rounded-full" />
          <p className="text-[#05101f]/70 text-base leading-relaxed max-w-2xl font-sans mt-1">
            Watch real demo lectures before you commit. Concept-driven teaching
            with exam-focused clarity — see exactly what makes our approach
            different.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-5 lg:gap-8">
          {/* Left — selector */}
          <div className="flex flex-col gap-3 sm:justify-center">
            {videos.map((video, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={video.title}
                  onClick={() => {
                    setActiveIndex(i);
                    setIsPlaying(false); // 👈
                  }}
                  className={`group w-full flex items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-all duration-200
                  ${
                    isActive
                      ? "bg-cyan-950 shadow-[0_4px_20px_rgba(5,16,31,0.15)]"
                      : "bg-white border border-[#e8e4dc] hover:border-amber-200 hover:shadow-[0_2px_12px_rgba(5,16,31,0.07)]"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200
                  ${isActive ? "bg-amber-500" : "bg-amber-200 group-hover:bg-amber-200"}`}
                  >
                    <BiPlay
                      className={`w-4 h-4 ${isActive ? "text-[#05101f]" : "text-amber-600"}`}
                    />
                  </div>

                  <div className="min-w-0">
                    <div
                      className={`text-sm font-semibold font-sans transition-colors duration-200
                    ${isActive ? "text-amber-500" : "text-[#05101f] group-hover:text-amber-600"}`}
                    >
                      {video.title}
                    </div>
                    <div
                      className={`text-xs mt-0.5 font-sans transition-colors duration-200 truncate
                    ${isActive ? "text-white/55" : "text-[#05101f]/45"}`}
                    >
                      {video.desc}
                    </div>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right — video player */}
          <div className="rounded-2xl overflow-hidden border border-[#e8e4dc] shadow-[0_8px_40px_rgba(5,16,31,0.1)] bg-[#05101f] relative">
            {!isPlaying ? (
              <div
                className="relative w-full aspect-video cursor-pointer group"
                onClick={() => setIsPlaying(true)}
              >
                <Image
                  src={thumbnail}
                  alt={activeVideo.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                    <BiPlay className="w-8 h-8 text-black ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                className="w-full aspect-video"
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
