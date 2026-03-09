"use client";

import { useExamMenu } from "@/providers/ExamMenuUIProvider";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
function FlyText({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block opacity-0 animate-fly"
          style={{
            animationDelay: `${i * 35}ms`,
            animationFillMode: "forwards",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
}
export function HeroBanner() {
  const { setOpen } = useExamMenu();

  const slides = [
    {
      title: "MAH MCA CET 2026 Full-Length Mock Test Series",
      subtitle: "Real exam-level practice for MCA entrances.",
      description:
        "Practice MAH MCA CET with full-length mock tests designed according to the latest exam pattern. Get detailed solutions and performance analysis to improve your score.",
      button: "Buy Mock Test Series",
      link: "https://learn.crackora.com/learn/MCA-Mocktest-Series",
    },
    {
      title: "Computer Concepts for MCA Entrance – 500 Important MCQs",
      subtitle: "Master the most important Computer topics.",
      description:
        "A focused e-book covering 500 important Computer Concepts MCQs frequently asked in MCA entrance exams like MAH MCA CET and NIMCET.",
      button: "Buy E-Book",
      link: "https://learn.crackora.com/learn/Computer-Concep-500-Important-MCQs",
    },
    {
      title: "Entrance Exam GK Power Pack – 1500+ Important Questions",
      subtitle: "Boost your GK for LAW and other entrances.",
      description:
        "Comprehensive GK preparation with 1500+ important questions covering static GK, current affairs, and exam-relevant topics for LAW entrance exams.",
      button: "Buy GK Power Pack",
      link: "https://learn.crackora.com/learn/Computer-Concep-500-Important-MCQs",
    },
  ];
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length);
        setAnimate(true);
      }, 300);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full lg:min-h-150 min-h-200 overflow-hidden bg-cyan-950 lg:hero  bg-opacity-10 mt-16">
      <div className="absolute inset-0 z-10">
        {/* Deep space base */}
        <div className="absolute inset-0 bg-[#020617]" />

        {/* Cyan nebula */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />

        {/* Green nebula */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />

        {/* Soft atmospheric diffusion */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04),transparent_120%)]" />

        {/* CSS star texture (no image → faster) */}
        <div
          className="absolute inset-0 opacity-[0.15]
          bg-[radial-gradient(circle_at_10px_1px,rgba(255,255,255,.8)_1px,transparent_0)]
          bg-size-[30px_30px]"
        />
      </div>
      <div className="absolute top-0 left-0 w-screen h-full bg-[rgba(0,0,0,0.2)] z-10"></div>

      <div className="absolute top-0 left-0  lg:py-20 py-10 pb-20 flex flex-col lg:flex-row  gap-14 z-10 w-full justify-center items-center">
        {/* ================= LEFT CONTENT (Animated) ================= */}
        {/* ================= LEFT CONTENT (Animated) ================= */}
        <div className="lg:w-[60%] w-full text-white/90 z-10 flex flex-col justify-center lg:px-30 md:px-15 px-6">
          <div
            key={index}
            className={`transition-all duration-500 ease-in-out transform
      ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
    `}
          >
            {/* TITLE with Fly Letters */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight lg:text-left text-center text-amber-50">
              <FlyText text={slides[index].title} />
            </h1>

            {/* DESCRIPTION fade only */}
            <p className="mt-6 text-white/75 lg:text-lg sm:text-lg text-md lg:text-left text-center transition-opacity duration-700">
              {slides[index].description}
            </p>

            {/* BUTTON */}
            <div className="lg:mt-8 mt-5 flex flex-wrap gap-4 lg:justify-start justify-center">
              <Link href={slides[index].link} >
                <button className="bg-amber-600 cursor-pointer text-white px-6 py-3 lg:text-[15px] text-xs rounded-xl font-medium hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300">
                  {slides[index].button}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ORBIT ================= */}
        <div className="lg:w-[45%]  w-full flex lg:justify-center items-center justify-center relative lg:mt-0 sm:mt-25 mt-20">
          {/* Soft radial glow */}

          <div className="absolute -top-10 left-20 sm:left-30  flex items-end rotate-0">
            <span className=" text-white sm:text-lg text-sm drop-shadow-[0px_10px_8px_rgba(255,255,255,0.5)] ">
              NIMCET
            </span>
          </div>

          <div className="absolute lg:bottom-50 lg:-left-20 sm:bottom-25  -bottom-8 left-10 flex items-end rotate-0">
            <span className=" text-white sm:text-lg  text-xs drop-shadow-[0px_10px_8px_rgba(255,255,255,0.5)]">
              MH CET LAW
            </span>
          </div>

          <div className="absolute top-0 right-10 sm:right-30 flex items-end rotate-0">
            <span className=" text-white sm:text-lg text-sm drop-shadow-[0px_10px_8px_rgba(255,255,255,0.5)]">
              CAT
            </span>
          </div>

          <div className="absolute sm:bottom-0 lg:right-8 lg:w-fit -bottom-10 right-20 flex items-end rotate-0">
            <span className=" text-white sm:text-lg text-[13px] drop-shadow-[0px_10px_8px_rgba(255,255,255,0.5)]">
              MBA CET
            </span>
          </div>

          <div className="absolute lg:top-110 lg:left-50  sm:top-15 sm:left-20 top-3  left-6 flex items-end rotate-0">
            <span className=" text-white sm:text-lg text-sm drop-shadow-[0px_10px_8px_rgba(255,255,255,0.5)]">
              CLAT{" "}
            </span>
          </div>

          <div className="absolute lg:top-10 lg:-left-8 sm:-top-20 sm:left-1/2  sm:flex hidden items-end rotate-0">
            <span className=" text-white sm:text-lg drop-shadow-[0px_10px_8px_rgba(255,255,255,0.5)]">
              MAH MCA CET{" "}
            </span>
          </div>

          <div className="absolute lg:bottom-10 lg:-left-12 sm:left-140 md:left-150 sm:flex hidden items-end">
            <span className=" text-white text-lg drop-shadow-[0px_10px_8px_rgba(255,255,255,0.5)]">
              IPMAT{" "}
            </span>
          </div>

          <div className="absolute lg:w-100 lg:h-100 w-60 h-60 rounded-full bg-linear-to-tr from-white/10 to-white/0 blur-3xl" />

          {/* Orbit container */}
          <div className="relative lg:w-100 sm:w-70 sm:h-70 w-65 lg:h-100 h-65 flex items-center justify-center">
            {/* OUTER RING */}
            <div
              className="absolute lg:inset-0 -inset-3 rounded-full shadow shadow-white
              bg-[radial-gradient(circle,rgba(245,135,11,0.8),rgba(255,255,255,0.02))]
              border border-white/60"
            />

            {/* MIDDLE RING */}
            <div
              className="absolute lg:inset-20 inset-10   rounded-full shadow shadow-white
              bg-[radial-gradient(circle,rgba(245,255,255,0.8),rgba(255,255,255,0.01))]
              border border-white/50"
            />

            {/* INNER CORE */}
            <div className="relative flex items-center justify-center z-20">
              {/* Glow Ring */}
              <div
                className="
      absolute
      lg:w-30 lg:h-30
      w-24 h-24
      rounded-full
      border-10 border-amber-700/50
      blur-[5px]
      shadow-[0_20px_40px_rgba(255,158,11,0.1)]
    "
              />

              {/* Planet */}
              <div
                className="
      lg:w-28 lg:h-28
      w-22 h-22
      rounded-full
      bg-amber-200
      flex items-center justify-center
      
      relative
    "
              >
                <Image
                  src="/vertical-logo.svg"
                  alt="Crackora"
                  width={10}
                  height={10}
                  className="sm:w-20 sm:h-20 w-18 h-18 -mt-3  object-cover object-center"
                />
              </div>
            </div>

            <div className="absolute lg:bottom-10 lg:left-60 right-20 bottom-4 -translate-x-1/2">
              <OrbitItem
                label="Live Classes"
                size="lg:w-20 lg:h-20 w-13 h-13"
                bg="sm:text-[11px] text-[10px] bg-amber-100 text-cyan-900"
              />
            </div>
            <div className="absolute lg:top-30 lg:right-15 top-20 right-3">
              <OrbitItem
                label="Analytics"
                size="lg:w-20 lg:h-20 w-13 h-13"
                bg="sm:text-[11px] text-[10px] bg-amber-100 text-cyan-900"
              />
            </div>

            <div className="absolute lg:top-30 lg:left-12 top-20 left-3">
              <OrbitItem
                label="Resources"
                size="lg:w-20 lg:h-20 w-14 h-14"
                bg="sm:text-[11px] text-[10px] bg-amber-100 text-cyan-900"
              />
            </div>

            <div className="absolute lg:-left-5 sm:-left-8 -left-4 lg:bottom-5  bottom-0 -translate-y-1/2">
              <OrbitItem
                label="Doubt Solving"
                size="lg:w-22 lg:h-22 sm:w-18 sm:h-18 w-14 h-14"
                bg="bg-amber-600 border-1 border-white/80 lg:text-[13px] text-[9.5px]"
              />
            </div>

            <div className="absolute -top-10  left-1/2 -translate-x-1/2">
              <OrbitItem
                label="Courses"
                size="lg:w-22 lg:h-22 sm:w-18 sm:h-18 w-14 h-14"
                bg="bg-amber-600 border-1 border-white/80 lg:text-[13px] text-[9.5px]"
              />
            </div>

            <div className="absolute  lg:-right-10 sm:-right-11 lg:bottom-20 bottom-0 -right-5 -translate-y-1/2">
              <OrbitItem
                label="Mock Tests"
                size="lg:w-22 lg:h-22 sm:w-18 sm:h-18 w-14 h-14"
                bg="bg-amber-600 border-1 border-white/80 lg:text-[13px] text-[9.5px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- ORBIT ITEM ---------- */
function OrbitItem({
  label,
  bg = "bg-white/90",
  size = "w-18 h-18",
}: {
  label: string;
  bg?: string;
  size?: string;
}) {
  return (
    <div
      className={`${bg || "bg-cyan-900/95 text-xs text-cyan-50"}  
      font-sans font-semibold
      px-4 py-1 rounded-full shadow-xl
      ${size} flex items-center justify-center text-center
      hover:scale-105 transition`}
    >
      {label}
    </div>
  );
}
