// src/app/packages/[slug]/page.tsx  (adjust the folder to wherever your details route lives)
import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CoursePackageInfo } from "@/components/CoursePackageInfo";
import { getPackageSchema } from "@/schema-generators/package.schema";
import { packageService } from "@/services/courses.service";
import { API_BASE_URL } from "@/services/api.service";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://crackora.com").replace(/\/$/, "");
const SITE_NAME = "Crackora";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`; // put a 1200x630 fallback in /public

// Regenerate this page at most once per hour (fast static page, fresh data)
export const revalidate = 3600;

// cache() => generateMetadata and the page share ONE API call per request
const getPackage = cache(async (slug: string) => {
  return packageService.getPackageBySlug(slug).catch(() => null);
});

// Strip HTML, collapse whitespace, cut at a word boundary (~155 chars for Google)
function toMetaDescription(text: string | undefined, max = 155): string {
  const clean = (text || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// Escaping "<" prevents content from ever closing the script tag.
const toJsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) {
    // Don't let "not found" pages get indexed
    return {
      title: { absolute: `Package Not Found | ${SITE_NAME}` },
      robots: { index: false, follow: false },
    };
  }

  const title = pkg.meta_title?.trim() || `${pkg.course_name} | ${SITE_NAME}`;
  const description =
    toMetaDescription(pkg.meta_description) ||
    toMetaDescription(pkg.description) ||
    `Explore ${pkg.course_name} on ${SITE_NAME}.`;

  const url = `${SITE_URL}/packages/${slug}`;
  const ogImage = pkg.og_image || pkg.image;
  const imageUrl = ogImage ? `${API_BASE_URL}/public/${ogImage}` : DEFAULT_OG_IMAGE;

  return {
    // `absolute` stops a layout title template from appending the brand twice
    title: { absolute: title },
    description,
    alternates: { canonical: url },

    // Hide inactive/draft packages from search engines
    robots: pkg.is_active
      ? { index: true, follow: true }
      : { index: false, follow: false },

    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: pkg.course_name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    // meta_keywords intentionally dropped: Google ignores the keywords tag
  };
}

export default async function PackageInfoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const coursePackage = await getPackage(slug);

  if (!coursePackage) {
    notFound();
  }

  const coursePackageSchema = getPackageSchema(coursePackage);

  // Home > Courses > this package. This is what Google can show in the search
  // result instead of a raw URL, and it matches the "Back to catalog" link on the page.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Courses",
        item: `${SITE_URL}/courses`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: coursePackage.course_name,
        item: `${SITE_URL}/packages/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* Plain <script> is the recommended way for JSON-LD in the App Router. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(coursePackageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbSchema) }}
      />

      <CoursePackageInfo coursePackage={coursePackage} />
    </>
  );
}