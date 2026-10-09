// src/app/courses/page.tsx  (Server Component — no "use client")
import { cache } from "react";
import type { Metadata } from "next";
import { CourseCatalog } from "@/components/CourseCatalog";
import {
  buildPackageEntrances,
  formatList,
  type EntranceGroup,
} from "@/lib/course-catalog";
import { packageService } from "@/services/courses.service"; // TODO: adjust path if different

// Cached HTML, regenerated at most once a minute.
export const revalidate = 60;

// TODO: set NEXT_PUBLIC_SITE_URL (e.g. https://www.yourdomain.com) in your env.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.crackora.com"
).replace(/\/$/, "");
const BRAND = "Crackora";

// React `cache` makes generateMetadata() and the page share ONE API call per request.
const getCatalog = cache(
  async (): Promise<{ entrances: EntranceGroup[]; error: boolean }> => {
    try {
      const packages = await packageService.getActiveForMenu();
      return { entrances: buildPackageEntrances(packages), error: false };
    } catch (err) {
      console.error("Failed to load course packages", err);
      return { entrances: [], error: true };
    }
  },
);

export async function generateMetadata(): Promise<Metadata> {
  const { entrances, error } = await getCatalog();
  const labels = entrances.map((e) => e.label);

  // Titles get truncated around 60 characters, so only the first 3 exams go in.
  const titleList = formatList(labels, 3);
  const descList = formatList(labels, 5);

  const title = titleList
    ? `${titleList} Entrance Exam Coaching Online | ${BRAND}`
    : `Online Entrance Exam Coaching | ${BRAND}`;

  const description = descList
    ? `Prepare for ${descList} entrance exams with live batches, self-study material, mock tests and e-books on ${BRAND}.`
    : `Live batches, self-study material, mock tests and e-books for competitive entrance exams on ${BRAND}.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/courses" }, // needs metadataBase in your root layout (see notes)
    // Don't let Google index an error state if the API was down during a render.
    robots: error ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: BRAND,
      title,
      description,
      url: "/courses",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CoursesPage() {
  const { entrances, error } = await getCatalog();
  const labels = entrances.map((e) => e.label);

  const pageUrl = `${SITE_URL}/courses`;
  const examList = formatList(labels, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        name: examList
          ? `${examList} entrance exam courses`
          : "Entrance exam courses",
        description:
          "Live batches, self-study material, mock tests and e-books for entrance exam preparation.",
        isPartOf: { "@type": "WebSite", name: BRAND, url: SITE_URL },
        about: labels.map((name) => ({ "@type": "Thing", name })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Courses", item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // "<" is escaped so the JSON can never close the script tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CourseCatalog entrances={entrances} error={error} />
    </>
  );
}