/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { RequestCallback } from "../components/forms/RequestCallbackForm";
import { Exam } from "@/interfaces/entrance-interface";
import { STARS } from "@/lib/util";

// ─── FAQ type ─────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

export function parseFaqItems(faq: string | undefined): FaqItem[] {
  if (!faq) return [];
  try {
    const parsed = JSON.parse(faq);
    return Array.isArray(parsed) ? (parsed as FaqItem[]) : [];
  } catch {
    return [];
  }
}

// ─── FAQ Schema ───────────────────────────────────────────────────────────────

function FaqSchema({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!items.length) return null;

  return (
    <section className="mt-10" id="faq-section">
      {/* Header matching page style */}
      <div className="mb-6">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">
          Got questions?
        </p>
        <h2 className="text-2xl font-bold text-cyan-900">
          Frequently Asked Questions
        </h2>
        <div className="h-0.5 w-12 bg-amber-500 mt-3" />
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`border-2 rounded-2xl overflow-hidden transition-all duration-200
                ${
                  isOpen
                    ? "border-amber-300 shadow-sm"
                    : "border-gray-100 hover:border-gray-200"
                }`}
            >
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-left"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                    text-xs font-bold transition-colors
                    ${isOpen ? "bg-amber-500 text-white" : "bg-cyan-50 text-amber-500"}`}
                >
                  {i + 1}
                </span>
                <span
                  className={`flex-1 text-sm font-semibold leading-snug transition-colors
                    ${isOpen ? "text-cyan-900" : "text-gray-700"}`}
                >
                  {item.question}
                </span>
                <svg
                  className={`shrink-0 w-4 h-4 transition-transform duration-200
                    ${isOpen ? "rotate-180 text-amber-500" : "text-gray-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0">
                  <div className="ml-11 text-sm text-gray-600 leading-relaxed border-l-2 border-amber-300 pl-4">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── TOC Item ─────────────────────────────────────────────────────────────────

function TocItem({
  section,
  isActive,
  onClick,
}: {
  section: { id: string; title: string };
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left py-2 px-3 rounded-xl text-sm transition-all cursor-pointer
        ${
          isActive
            ? "bg-amber-50 text-amber-700 font-semibold border-l-2 border-amber-500 pl-2.5"
            : "text-gray-500 hover:text-cyan-900 hover:bg-gray-50"
        }`}
    >
      {section.title}
    </button>
  );
}

// ─── Main ExamInfo ────────────────────────────────────────────────────────────

export function ExamInfo({ exam }: { exam: Exam }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const faqItems = parseFaqItems(exam?.faq);

  // ── Show/hide "back to top" ──
  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Active section tracker ──
  useEffect(() => {
    if (!exam?.table_index?.length || !isAutoScrolling) return;
    const OFFSET = 140;
    const handleScroll = () => {
      const scrollPos = window.scrollY + OFFSET + 1;
      let current: string | null = null;
      for (const section of exam.table_index) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollPos) current = section.id;
      }
      if (current && current !== activeSection) setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [exam, activeSection, isAutoScrolling]);

  // ── Initialise at top ──
  useEffect(() => {
    if (exam?.table_index?.length && !activeSection) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection(exam.table_index[0].id);
    }
  }, [exam, activeSection]);

  const scrollToId = (id: string, offset = 140) => {
    const el = document.getElementById(id);
    if (!el) return;
    setIsAutoScrolling(false);
    setActiveSection(id);
    window.scrollTo({ top: el.offsetTop - offset, behavior: "smooth" });
    setTimeout(() => setIsAutoScrolling(true), 4000);
  };

  const scrollToFaq = (offset = 140) => {
    const el = document.getElementById("faq-section");
    if (el) window.scrollTo({ top: el.offsetTop - offset, behavior: "smooth" });
  };

  const allSections = exam?.table_index ?? [];

  return (
    <>
      {faqItems.length > 0 && <FaqSchema items={faqItems} />}

      <div className="w-full bg-[#f8f7f4]">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden bg-linear-to-b from-cyan-950 via-cyan-900 to-cyan-800">
          {/* Radial glow */}

          <div className="pointer-events-none absolute inset-0">
            {/* Deep space */}
            <div className="absolute inset-0 bg-[#020617]" />
            {/* Cyan nebula */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
            {/* Green nebula */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
            {/* Soft atmospheric diffusion */}
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* ── Stars ── */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            {STARS.map((s) => (
              <span
                key={s.id}
                className={`absolute rounded-full ${s.amber ? "bg-amber-300" : "bg-white"}`}
                style={{
                  top: s.top,
                  left: s.left,
                  width: s.w,
                  height: s.w,
                  opacity: s.opacity,
                }}
              />
            ))}
          </div>

          <div
            className="relative z-10 h-full lg:max-w-6xl sm:max-w-3xl mx-auto px-6 lg:px-10  sm:py-20 lg:mt-25 py-20
                          flex flex-col sm:flex-row gap-10 items-center sm:items-center"
          >
            {/* Title block */}
            <div className="flex-1 flex  flex-col gap-4 text-white text-center sm:text-left justify-center">
              <div className="inline-flex items-center justify-center sm:justify-start">
                <span
                  className="lg:text-xs text-[9px] font-bold tracking-[0.2em] uppercase text-amber-400 bg-amber-400/10 flex justify-center items-center
                                 border border-amber-400/30 px-3 py-1 rounded-full"
                >
                  Entrance Exam Information
                </span>
              </div>
              <h1
                className="text-2xl lg:text-5xl font-bold leading-tight drop-shadow-lg"
                data-examinfo-title={exam?.meta_title || exam?.title}
              >
                {exam?.meta_title || exam?.title}
              </h1>
              <div className="h-0.5 w-16 bg-amber-500 mx-auto sm:mx-0" />
            </div>

            {/* Callback card */}
            <div className="relative w-80 sm:w-100 shrink-0">
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-24
                              bg-amber-400/20 blur-3xl rounded-full pointer-events-none"
              />
              <div
                className="relative bg-[#f8f7f4] rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                              ring-1 ring-white/20"
              >
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-3">
                  Need guidance?
                </p>
                <RequestCallback sourcePage="exam-info" sourceSlug={exam.slug || ""} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Body ─────────────────────────────────────────── */}
        <div className="lg:max-w-6xl sm:max-w-3xl mx-auto px-4 lg:px-10 py-8 lg:py-12 flex gap-6 items-start">
          {/* ── Desktop TOC sidebar ── */}
          <aside
            className="hidden lg:flex w-72 shrink-0 flex-col sticky top-16
              bg-white border border-gray-200 rounded-2xl p-5 shadow-sm
              max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            {/* TOC header */}
            <div className="mb-4">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">
                Contents
              </p>
              <h2 className="text-base font-bold text-cyan-900">
                On This Page
              </h2>
              <div className="h-0.5 w-8 bg-amber-500 mt-2" />
            </div>

            <nav className="flex flex-col gap-0.5">
              {allSections.map((section: any) => (
                <TocItem
                  key={section.id}
                  section={section}
                  isActive={activeSection === section.id}
                  onClick={() => scrollToId(section.id)}
                />
              ))}

              {faqItems.length > 0 && (
                <>
                  <div className="h-px bg-gray-100 my-2" />
                  <button
                    onClick={() => scrollToFaq()}
                    className="w-full text-left py-2 px-3 rounded-xl text-sm text-gray-500
                               hover:text-cyan-900 hover:bg-gray-50 transition-all"
                  >
                    Frequently Asked Questions
                  </button>
                </>
              )}
            </nav>
          </aside>

          {/* ── Main content ── */}
          <main
            className="flex-1 min-w-0 bg-white border border-gray-200 rounded-2xl
                           shadow-sm px-5 py-6 sm:px-8 sm:py-8"
          >
            <div
              className="exam-content"
              dangerouslySetInnerHTML={{ __html: exam?.content || "" }}
            />

            {faqItems.length > 0 && <FaqAccordion items={faqItems} />}
          </main>
        </div>

        {/* ── Back to top ── */}
        {showTopBtn && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5
                       bg-cyan-900 hover:bg-cyan-800 text-white text-xs font-bold
                       px-4 py-2.5 rounded-full shadow-lg transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
            Top
          </button>
        )}

        {/* ── Mobile TOC trigger ── */}
        <button
          className="lg:hidden fixed bottom-20 right-6 z-50 flex items-center gap-2
                     bg-amber-500 hover:bg-amber-400 text-amber-900 text-xs font-bold
                     px-4 py-2.5 rounded-full shadow-lg transition-colors"
          onClick={() => setShowMobileToc(true)}
          aria-label="Open table of contents"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h10M4 18h7"
            />
          </svg>
          Contents
        </button>

        {/* ── Mobile TOC drawer ── */}
        {showMobileToc && (
          <div
            className="lg:hidden fixed inset-0 z-50 flex items-end"
            onClick={() => setShowMobileToc(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Sheet */}
            <div
              className="relative w-full bg-[#f8f7f4] rounded-t-3xl shadow-2xl
                         max-h-[75vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sheet handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Sheet header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-0.5">
                    Navigate
                  </p>
                  <h2 className="text-base font-bold text-cyan-900">
                    Table of Contents
                  </h2>
                </div>
                <button
                  onClick={() => setShowMobileToc(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200
                             flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Sheet body — scrollable */}
              <nav className="overflow-y-auto flex-1 px-4 py-3">
                {allSections.map((section: any, i: number) => (
                  <button
                    key={section.id}
                    className={`w-full flex items-center gap-3 text-left px-3 py-3
                                rounded-xl text-sm transition-all mb-1
                                ${
                                  activeSection === section.id
                                    ? "bg-amber-50 text-amber-700 font-semibold border-l-2 border-amber-500"
                                    : "text-gray-600 hover:bg-white hover:text-cyan-900"
                                }`}
                    onClick={() => {
                      scrollToId(section.id, 100);
                      setShowMobileToc(false);
                    }}
                  >
                    <span
                      className={`shrink-0 w-6 h-6 rounded-full text-[10px] font-black
                                  flex items-center justify-center
                                  ${
                                    activeSection === section.id
                                      ? "bg-amber-500 text-white"
                                      : "bg-cyan-50 text-amber-500"
                                  }`}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-snug">{section.title}</span>
                  </button>
                ))}

                {faqItems.length > 0 && (
                  <>
                    <div className="h-px bg-gray-200 my-2 mx-3" />
                    <button
                      className="w-full flex items-center gap-3 text-left px-3 py-3
                                 rounded-xl text-sm text-gray-600 hover:bg-white hover:text-cyan-900
                                 transition-all"
                      onClick={() => {
                        scrollToFaq(100);
                        setShowMobileToc(false);
                      }}
                    >
                      <span
                        className="shrink-0 w-6 h-6 rounded-full bg-cyan-50 text-[10px]
                                       font-black flex items-center justify-center text-amber-500"
                      >
                        ?
                      </span>
                      <span>Frequently Asked Questions</span>
                    </button>
                  </>
                )}
              </nav>

              {/* Sheet footer */}
              <div className="px-6 py-4 border-t border-gray-200 shrink-0 bg-white">
                <p className="text-xs text-gray-400 text-center">
                  Tap any section to jump there
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
