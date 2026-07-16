/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { STARS } from "@/lib/util";
import { CoursePackage } from "@/interfaces/CoursePackage.interface";
import { BiHeart, BiShareAlt, BiChevronDown } from "react-icons/bi";

import Image from "next/image";
import { API_BASE_URL } from "@/services/api.service";
import Link from "next/link";
import router from "next/router";
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

// ─── Placeholder building blocks ───────────────────────────────────────────────

function SkeletonLine({ width = "w-full" }: { width?: string }) {
  return <div className={`h-3 rounded bg-white/15 ${width}`} />;
}

function SkeletonLineDark({ width = "w-full" }: { width?: string }) {
  return <div className={`h-3 rounded bg-[#05101f]/10 ${width}`} />;
}

function ContentSectionPlaceholder({ title }: { title: string }) {
  return (
    <section className="mb-10">
      <div className="h-5 w-40 rounded bg-[#05101f]/10 mb-4" />
      <div className="bg-white border border-[#e8e4dc] rounded-xl p-5 space-y-3">
        <SkeletonLineDark width="w-full" />
        <SkeletonLineDark width="w-11/12" />
        <SkeletonLineDark width="w-4/5" />
      </div>
    </section>
  );
}

// ─── Builds the purchase-card feature list based on package_type ──────────────

function getFeatureList(pkg: CoursePackage): string[] {
  const rows: string[] = (() => {
    switch (pkg.category) {
      case "live_course":
      case "self_study":
        return pkg.what_you_will_get || [];
      default:
        return [];
    }
  })();

  return rows;
}

// ─── Sticky purchase card ──────────────────────────────────────────────────────

function PurchaseCardPlaceholder({
  coursePackage,
}: {
  coursePackage: CoursePackage;
}) {
  const features = getFeatureList(coursePackage);

  return (
    <div className="bg-white border border-[#e8e4dc] rounded-xl overflow-hidden shadow-[0_8px_28px_rgba(5,16,31,0.14)]">
      {/* Preview image */}
      <div className="relative w-full aspect-video bg-[#e8e4dc] flex items-center justify-center">
        <Image
          src={`${API_BASE_URL}/public/${coursePackage.image || ""}`}
          alt={coursePackage.course_name}
          fill
          unoptimized
          className="object-center"
        />
      </div>

      <div className="p-5">
        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-full flex items-center justify-center gap-2">
            {Number(coursePackage.discounted_price) > 0 ? (
              <>
                <span className="text-sm text-[#05101f]/40 line-through">
                  ₹{coursePackage.price}
                </span>
                <span className="text-lg font-bold font-inter text-cyan-700">
                  ₹{coursePackage.discounted_price}
                </span>
              </>
            ) : (
              <span className="text-[13px] font-semibold text-amber-700">
                ₹{coursePackage.price}
              </span>
            )}
          </div>
        </div>

        {/* CTA buttons */}
        <Link href={coursePackage.checkout_link || "#"} target="_blank">
          {" "}
          <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-lg py-3 mb-3 transition-colors cursor-pointer">
            Enroll now
          </button>
        </Link>

        <div className="flex items-center justify-center gap-4 mb-4 text-xs text-[#05101f]/50">
          <button className="flex items-center gap-1.5 hover:text-amber-700 cursor-pointer">
            <BiHeart className="w-3.5 h-3.5" />
            Wishlist
          </button>
          <button className="flex items-center gap-1.5 hover:text-amber-700 cursor-pointer">
            <BiShareAlt className="w-3.5 h-3.5" />
            Share
          </button>
        </div>

        {/* Feature list — driven by package_type */}
        <div className="space-y-2.5 pt-4 border-t border-[#f0ede6] flex flex-wrap justify-center w-full p-3">
          {features.length > 0 ? (
            features.map((f, i) => (
              <div key={i} className="w-1/2">
                <span className="text-[13px] text-gray-900/50">{f}</span>
              </div>
            ))
          ) : (
            <div className="h-3 rounded bg-[#05101f]/8 w-full" />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tabs ───────────────────────────────────────────────────────────────────

type TabKey = "overview" | "curriculum" | "instructor" | "reviews";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "curriculum", label: "Curriculum" },
  { key: "instructor", label: "Instructor" },
  { key: "reviews", label: "Reviews" },
];

function PackageTabs({
  activeTab,
  onChange,
}: {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  // Measure the active button's position/width and move the underline there.
  // Re-runs on tab change and on resize so it never falls out of sync.
  useEffect(() => {
    const measure = () => {
      const el = tabRefs.current[activeTab];
      if (el) {
        setUnderline({ left: el.offsetLeft, width: el.offsetWidth });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeTab]);

  return (
    <div className="relative flex gap-6 border-b border-[#e8e4dc] mb-8 overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          ref={(el) => {
            tabRefs.current[tab.key] = el;
          }}
          onClick={() => onChange(tab.key)}
          className={`pb-3 text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors duration-200 ${
            activeTab === tab.key
              ? "text-cyan-950"
              : "text-[#05101f]/40 hover:text-cyan-900"
          }`}
        >
          {tab.label}
        </button>
      ))}

      {/* Sliding underline */}
      <div
        className="absolute bottom-0 h-[2px] bg-amber-600 transition-all duration-300 ease-out"
        style={{ left: underline.left, width: underline.width }}
      />
    </div>
  );
}

// ─── Main CoursePackageInfo ────────────────────────────────────────────────────

export function CoursePackageInfo({
  coursePackage,
}: {
  coursePackage: CoursePackage;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [openSubSections, setOpenSubSections] = useState<Set<string>>(
    new Set(),
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSubSection = (id: string) => {
    setOpenSubSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* ── Banner ── */}
      <section className="relative w-full overflow-hidden bg-linear-to-b from-cyan-950 via-cyan-900 to-cyan-800 py-15 ">
        <div className="pointer-events-none absolute inset-0">
          {/* Deep space */}
          <div className="absolute inset-0 bg-[#020617]" />
          {/* Cyan nebula */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
          {/* Green nebula */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
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

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 pt-16 sm:pt-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-inter mb-4 text-white">
              {coursePackage.course_name}
            </h1>

            <h2 className="my-5 text-amber-50/80 font-sans">
              {coursePackage.description}
            </h2>

            <div className="space-y-2.5 mb-5 flex flex-col">
              <div className="text-amber-500 font-bold">Exams Covered:</div>
              <div className="flex flex-wrap gap-2">
                {coursePackage.exams_covered.map((item) => (
                  <Link
                    key={item.id}
                    target="_blank"
                    href={`/exam-info/${item.slug}`}
                    className="border border-cyan-600 rounded shadow cursor-pointer hover:scale-105  text-[11px] p-2 py-1"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex gap-2 text-white/60">
              <span className="font-bold text-amber-500">Educators: </span>
              <span className="">{coursePackage.teacher}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 relative pb-20">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/*
            Purchase card:
            - Mobile: order-1, sits first, no overlap, no sticky.
            - Desktop: order-2, pulled up with negative margin to overlap
              the bottom of the banner (Udemy-style), then goes sticky
              once you scroll past it.
          */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            <div className="mt-4 lg:-mt-56 lg:sticky lg:top-24">
              <PurchaseCardPlaceholder coursePackage={coursePackage} />
            </div>
          </div>

          {/* Main content column */}
          <div className="order-2 lg:order-1 lg:col-span-2 pt-8 lg:pt-10">
            <PackageTabs activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "overview" && (
              <div
                className="prose prose-sm max-w-none text-[#05101f]/80 mb-10 package-overview"
                dangerouslySetInnerHTML={{
                  __html: coursePackage.content || "",
                }}
              />
            )}
            {activeTab === "curriculum" && (
              <div className="_curriculum flex flex-col gap-4">
                {coursePackage.curriculum?.map((section, sIdx) => {
                  const isSectionOpen = openSections.has(section.id);
                  const topicCount = section.subSections.reduce(
                    (acc, sub) => acc + sub.topics.length,
                    0,
                  );

                  return (
                    <div
                      key={section.id}
                      className="border border-cyan-100 rounded-xl overflow-hidden bg-white shadow-[0_2px_10px_rgba(5,16,31,0.04)]"
                    >
                      {/* ── Section header ── */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className={`w-full flex justify-between items-center p-4 cursor-pointer transition-colors ${
                          isSectionOpen
                            ? "bg-gradient-to-r from-cyan-900 to-cyan-800"
                            : "bg-white hover:bg-cyan-50/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex items-center justify-center w-7 h-7 rounded-lg text-[12px] font-bold ${
                              isSectionOpen
                                ? "bg-amber-500 text-cyan-950"
                                : "bg-cyan-50 text-cyan-800"
                            }`}
                          >
                            {sIdx + 1}
                          </span>
                          <span
                            className={`font-semibold text-sm ${
                              isSectionOpen ? "text-white" : "text-cyan-950"
                            }`}
                          >
                            {section.title}
                          </span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                              isSectionOpen
                                ? "bg-white/10 text-amber-300"
                                : "bg-cyan-50 text-cyan-700"
                            }`}
                          >
                            {section.subSections.length} sub-section
                            {section.subSections.length > 1 ? "s" : ""} ·{" "}
                            {topicCount} topic{topicCount > 1 ? "s" : ""}
                          </span>
                        </div>

                        <BiChevronDown
                          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                            isSectionOpen
                              ? "rotate-180 text-amber-400"
                              : "text-cyan-700"
                          }`}
                        />
                      </button>

                      {/* ── Subsections ── */}
                      {isSectionOpen && (
                        <div className="divide-y divide-cyan-50 bg-cyan-50/20">
                          {section.subSections.map((sub) => {
                            const isSubOpen = openSubSections.has(sub.id);

                            return (
                              <div key={sub.id}>
                                <button
                                  onClick={() => toggleSubSection(sub.id)}
                                  className="w-full flex justify-between items-center py-3 pl-6 pr-4 hover:bg-white cursor-pointer transition-colors group"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                    <span className="text-[13px] font-medium text-amber-700 group-hover:text-cyan-900 text-left">
                                      {sub.title}
                                    </span>
                                    <span className="text-[11px] text-gray-400">
                                      ({sub.topics.length})
                                    </span>
                                  </div>
                                  <BiChevronDown
                                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                                      isSubOpen
                                        ? "rotate-180 text-amber-600"
                                        : "text-gray-400"
                                    }`}
                                  />
                                </button>

                                {/* ── Topics ── */}
                                {isSubOpen && (
                                  <div className="pl-11 pr-4 pb-4 flex flex-col gap-3">
                                    {sub.topics.map((topic) => {
                           
                                      return (
                                        <div
                                          key={topic.id}
                                          className="flex flex-col gap-1"
                                        >
                                          <div className="flex justify-between items-center text-[12px] border-b border-b-gray-200">
                                            <span className="text-gray-600">
                                              {topic.title}
                                            </span>
                                            <span className="text-amber-700 font-semibold pb-2">
                                              {topic.weightage === 'NA' ? ' RARE' : topic.weightage}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "instructor" && (
              <ContentSectionPlaceholder title="Instructor" />
            )}

            {activeTab === "reviews" && (
              <ContentSectionPlaceholder title="Reviews" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
