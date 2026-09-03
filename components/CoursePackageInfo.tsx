/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { STARS } from "@/lib/util";
import {
  CoursePackage,
  TeacherSummary,
} from "@/interfaces/CoursePackage.interface";
import { BiHeart, BiShareAlt, BiChevronDown } from "react-icons/bi";

import Image from "next/image";
import { API_BASE_URL } from "@/services/api.service";
import Link from "next/link";
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

// ─── Linked / related package type ─────────────────────────────────────────
// Matches what getLinkedPackagesFor() returns from the API — id, title,
// category, price, discounted_price, image, slug. If your shared
// CoursePackage.interface.ts doesn't declare `linked_packages` yet, add:
//   linked_packages?: LinkedPackage[]
// there instead of relying on this local type.
export interface LinkedPackage {
  id: string;
  title: string;
  category: string;
  price: number;
  discounted_price?: number;
  image?: string;
  slug?: string;
  description?: string;
}

function InstructorSection({ teachers }: { teachers: TeacherSummary[] }) {
  if (!teachers.length) {
    return <ContentSectionPlaceholder title="Instructor" />;
  }

  return (
    <section className="mb-10 flex flex-col gap-4">
      {teachers.map((t) => (
        <div
          key={t.username}
          className="flex flex-col  gap-4 bg-white border border-[#e8e4dc] rounded-xl"
        >
          <div className="flex items-center gap-5 bg-cyan-950 p-4">
            {t.avatar ? (
              <div className="relative w-20 h-20  overflow-hidden shrink-0 shadow-xl rounded border border-amber-500 ">
                <Image
                  src={`${API_BASE_URL}/public/${t.avatar}`}
                  alt={t.fullname}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center text-lg font-semibold shrink-0">
                {t.fullname.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-sm font-semibold text-cyan-50 flex lg:flex-row flex-col  lg:items-end  lg:gap-2 ">
                <span className="text-lg">{t.fullname}</span>
                {t.designation && (
                  <div className="text-xs text-amber-400">{t.designation}</div>
                )}
              </div>

              {t.qualifications && (
                <div className="text-xs text-gray-300/90 font-sans mt-2">
                  {" "}
                  {t.qualifications.join(", ")}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 px-4">
            {t.bio && (
              <div className="text-[13px] text-gray-500 font-roboto ">
                {" "}
                {t.bio}
              </div>
            )}
          </div>

          {t.skills && (
            <div className="text-xs text-amber-800 flex gap-2 px-4 mb-5">
              {" "}
              <span className="font-semibold text-cyan-900">
                Expertise:
              </span>{" "}
              {t.skills.join(", ")}
            </div>
          )}
        </div>
      ))}
    </section>
  );
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

// ─── FAQ Accordion (same visual language as ExamInfo) ─────────────────────────

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!items.length) return null;

  return (
    <section className="mt-10" id="faq-section">
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
                className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer"
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
                <BiChevronDown
                  className={`flex-shrink-0 w-4 h-4 transition-transform duration-200
                    ${isOpen ? "rotate-180 text-amber-500" : "text-gray-400"}`}
                />
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

// ─── Related / Recommended packages ────────────────────────────────────────

function RelatedPackages({ packages }: { packages: LinkedPackage[] }) {
  if (!packages.length) return null;
  return (
    <section
      className="lg:max-w-6xl sm:max-w-3xl mx-auto px-6 lg:px-10 pb-20"
      id="related-packages"
    >
      <div className="mb-6">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">
          Recommended
        </p>
        <h2 className="text-2xl font-bold text-cyan-900">Related Packages</h2>
        <div className="h-0.5 w-12 bg-amber-500 mt-3" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.map((pkg) => (
          <Link
            key={pkg.id}
            href={pkg.slug ? `/packages/${pkg.slug}` : "#"}
            className="group border border-[#e8e4dc] rounded-xl overflow-hidden bg-white
                       shadow-[0_2px_10px_rgba(5,16,31,0.04)] hover:shadow-[0_8px_28px_rgba(5,16,31,0.14)]
                       transition-shadow"
          >
            <div className="relative w-full aspect-video bg-[#e8e4dc]">
              <Image
                src={`${API_BASE_URL}/public/${pkg.image || ""}`}
                alt={pkg.title}
                fill
                unoptimized
                className="object-cover"
              />
              <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide bg-cyan-950/80 text-amber-300 px-2 py-1 rounded-full">
                {pkg.category?.replace("_", " ")}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-cyan-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                {pkg.title}
              </h3>
              <h4 className="text-sm  text-cyan-950 mb-2 line-clamp-2  transition-colors">
                {pkg.description}
              </h4>

              <div className="flex items-center gap-2">
                {pkg.discounted_price ? (
                  <>
                    <span className="text-md text-[#05101f]/40 line-through">
                      ₹{pkg.price}
                    </span>
                    <span className="text-lg font-bold text-amber-700">
                      ₹{pkg.discounted_price}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-amber-700">
                    ₹{pkg.price}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Placeholder building blocks ───────────────────────────────────────────────

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
    return pkg.what_you_will_get || [];
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

      <div className="lg:p-5 p-2">
        {/* Price */}
        <div className="flex items-center lg:gap-2 mb-4">
          <div className="w-full flex items-center justify-center gap-2">
            {Number(coursePackage.discounted_price) > 0 ? (
              <>
                <span className="text-sm text-[#05101f]/40 line-through">
                  ₹{coursePackage.price}
                </span>
                <span className="text-2xl font-bold font-inter text-cyan-900">
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
        <div className="space-y-2.5 pt-4 border-t border-[#f0ede6] flex flex-wrap justify-between w-full">
          {features.length > 0 ? (
            features.map((f, i) => (
              <div key={i} className="w-1/2 text-left">
                <span className="lg:text-[12px] text-[12px] text-gray-900/50">
                  {f}
                </span>
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
  // { key: "reviews", label: "Reviews" },
];

function PackageTabs({
  activeTab,
  onChange,
  category,
}: {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  category?: string;
}) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const showCourseTabs =
    category === "live_courses" || category === "self_study";

  const tabs = showCourseTabs
    ? TABS
    : TABS.filter(
        (tab) => tab.key !== "curriculum" && tab.key !== "instructor",
      );

  useEffect(() => {
    const measure = () => {
      const el = tabRefs.current[activeTab];

      if (el) {
        setUnderline({
          left: el.offsetLeft,
          width: el.offsetWidth,
        });
      }
    };

    measure();

    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [activeTab, showCourseTabs]);

  return (
    <div className="relative flex gap-6 border-b border-[#e8e4dc] mb-8 overflow-x-auto">
      {tabs.map((tab) => (
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

      <div
        className="absolute bottom-0 h-[2px] bg-amber-600 transition-all duration-300 ease-out"
        style={{
          left: underline.left,
          width: underline.width,
        }}
      />
    </div>
  );
}
// ─── Main CoursePackageInfo ────────────────────────────────────────────────────

export function CoursePackageInfo({
  coursePackage,
}: {
  coursePackage: CoursePackage & {
    linked_packages?: LinkedPackage[];
    teachers?: TeacherSummary[];
  };
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

  const faqItems = parseFaqItems(coursePackage.faq);
  const linkedPackages = coursePackage.linked_packages || [];

  return (
    <>
      {/* ── Banner ── */}
      <section className="relative w-full overflow-hidden bg-linear-to-b from-cyan-950 via-cyan-900 to-cyan-800">
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

        <div className="relative z-10 lg:max-w-6xl sm:max-w-3xl mx-auto px-6  py-25 pt-30 lg:pt-45 sm:pt-35">
          <div className="max-w-2xl">
            <h1 className="lg:text-5xl text-3xl font-inter mb-4 text-white">
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

            {coursePackage.teachers && coursePackage.teachers.length > 0 && (
              <div className="flex gap-2 text-white/60">
                <span className="font-bold text-amber-500">Educators: </span>
                <span>
                  {coursePackage.teachers.map((t) => t.fullname).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="lg:max-w-6xl sm:max-w-3xl mx-auto px-6 lg:px-10 relative pb-20">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/*
            Purchase card:
            - Mobile: order-1, sits first, no overlap, no sticky.
            - Desktop: order-2, pulled up with negative margin to overlap
              the bottom of the banner (Udemy-style), then goes sticky
              once you scroll past it.
          */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            <div className="mt-4 lg:-mt-70 lg:sticky lg:top-32">
              <PurchaseCardPlaceholder coursePackage={coursePackage} />
            </div>
          </div>

          {/* Main content column */}
          <div className="order-2 lg:order-1 lg:col-span-2 pt-8 lg:pt-10">
            <PackageTabs
              activeTab={activeTab}
              onChange={setActiveTab}
              category={coursePackage.category}
            />

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
                            ? "bg-linear-to-r from-cyan-900 to-cyan-800"
                            : "bg-linear-to-r from-cyan-900 to-cyan-800 hover:bg-cyan-50/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex items-center justify-center w-7 h-7 rounded-lg text-[12px] font-bold bg-amber-500 text-cyan-950`}
                          >
                            {sIdx + 1}
                          </span>
                          <span
                            className={`font-semibold text-sm text-white`}
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
                                              {topic.weightage === "NA"
                                                ? " RARE"
                                                : topic.weightage}
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
              <InstructorSection teachers={coursePackage.teachers || []} />
            )}
            {/* {activeTab === "reviews" && (
              <ContentSectionPlaceholder title="Reviews" />
            )} */}

            {faqItems.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-6 sm:px-8 sm:py-8 w-full">
                <FaqAccordion items={faqItems} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Related / recommended packages ── */}
      <RelatedPackages packages={linkedPackages} />
    </>
  );
}
