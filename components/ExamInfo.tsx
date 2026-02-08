/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { RequestCallback } from "../components/forms/RequestCallbackForm";
import { Exam } from "@/interfaces/entrance-interface";

export function ExamInfo({ exam }: { exam: Exam }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

useEffect(() => {
  if (!exam?.table_index?.length) return;
  if (!isAutoScrolling) return; // ✅ now reactive

  const OFFSET = 140;

  const handleScroll = () => {
    const scrollPos = window.scrollY + OFFSET + 1;
    let current: string | null = null;

    for (const section of exam.table_index) {
      const el = document.getElementById(section.id);
      if (!el) continue;

      if (el.offsetTop <= scrollPos) {
        current = section.id;
      }
    }

    if (current && current !== activeSection) {
      setActiveSection(current);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  return () => window.removeEventListener("scroll", handleScroll);
}, [exam, activeSection, isAutoScrolling]);


  useEffect(() => {
    if (exam?.table_index?.length && !activeSection) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSection(exam.table_index[0].id);
    }
  }, [exam, activeSection]);

  return (
    <div className="w-full bg-gray-200">
      {/* ================= IMMERSIVE HERO ================= */}
      <section
        className="relative min-h-[25vh] w-full overflow-hidden
        bg-linear-to-b from-cyan-950 via-cyan-900 to-cyan-800 flex items-center"
      >
        {/* Torch spotlight */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="
            absolute top-0 left-1/2 -translate-x-1/2
            w-[120%] h-[120%]
            bg-[radial-gradient(ellipse_30%_35%_at_50%_0%,rgba(255,255,255,0.25),transparent_70%)]
            animate-pulse-slow
          "
          />
        </div>

        {/* Cinematic depth */}
        <div
          className="absolute inset-0
          bg-[linear-gradient(to_bottom,rgba(0,0,0,0.3),transparent_40%,rgba(0,0,0,0.5))]"
        />

        {/* Content */}
        <div
          className="relative z-10 flex sm:flex-row flex-col
          justify-between w-full px-6 lg:px-40 py-10 gap-10"
        >
          {/* Left content */}
          <div className="lg:w-[60%] sm:w-[40%] w-full flex flex-col gap-6 text-white justify-center">
            <h1
              className="text-3xl lg:text-[45px] font-bold leading-tight lg:text-left text-center
              drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              {exam?.meta_title || exam?.title}
            </h1>
          </div>

          {/* Form */}
          <div className="relative sm:w-90 ">
            {/* Floor glow */}
            <div
              className="absolute -bottom-20 lg:left-1/2 lg:-translate-x-1/2
              w-75 h-30 bg-amber-400/20 blur-3xl rounded-full"
            />

            <div
              className="relative bg-white/90 backdrop-blur-xl flex justify-center
              rounded-2xl p-5 shadow-[0_40px_80px_rgba(0,0,0,0.7)]
              ring-1 ring-white/20 "
            >
              <RequestCallback />
            </div>
          </div>
        </div>
      </section>

      {/* ================= BODY ================= */}
      <div className="flex gap-6 lg:px-30 lg:py-12">
        {/* TOC Desktop */}
        <aside
          className="hidden lg:flex w-100 bg-white rounded-xl shadow
          sticky top-15 p-6 h-fit flex-col"
        >
          <h2 className="text-xl font-semibold text-cyan-900 mb-4">
            On This Page{" "}
          </h2>

          {exam?.table_index?.map((section: any) => (
            <button
              key={section.id}
              className={`text-left py-2 transition-all text-sm cursor-pointer
                ${
                  activeSection === section.id
                    ? "text-amber-700 font-semibold border-l-4 border-amber-600 pl-2"
                    : "text-gray-600 hover:text-amber-700"
                }`}
              onClick={() => {
                const el = document.getElementById(section.id);
                if (!el) return;

                setIsAutoScrolling(false)
                setActiveSection(section.id);

                window.scrollTo({
                  top: el.offsetTop - 140,
                  behavior: "smooth",
                });

                // Re-enable observer AFTER scroll finishes
                setTimeout(() => {
                  setIsAutoScrolling(true)
                }, 4000); // adjust based on scroll distance
              }}
            >
              {section.title}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="lg:w-[78%] w-full bg-white rounded-xl shadow lg:p-8 p-5 exam-content">
          <div dangerouslySetInnerHTML={{ __html: exam?.content || "" }} />
        </main>
      </div>

      {/* Back to top */}
      {showTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-amber-600 text-white
            px-5 py-3 rounded-full shadow-xl hover:bg-amber-700 z-50"
        >
          ↑ Top
        </button>
      )}

      {/* Mobile TOC */}
      <button
        className="lg:hidden fixed bottom-24 right-8 bg-green-800 text-white
          px-5 py-3 rounded-full shadow-xl z-50"
        onClick={() => setShowMobileToc(true)}
      >
        📘 TOC
      </button>

      {showMobileToc && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end z-50"
          onClick={() => setShowMobileToc(false)}
        >
          <div
            className="bg-white w-full rounded-t-2xl p-6 max-h-[60vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold text-cyan-900">
                Table of Contents
              </h2>
              <button onClick={() => setShowMobileToc(false)}>✕</button>
            </div>

            {exam?.table_index?.map((section: any) => (
              <button
                key={section.id}
                className="block w-full text-left py-2 text-gray-700"
                onClick={() => {
                  const el = document.getElementById(section.id);
                  if (!el) return;
                  window.scrollTo({
                    top: el.offsetTop - 100,
                    behavior: "smooth",
                  });
                  setActiveSection(section.id);
                  setShowMobileToc(false);
                }}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
