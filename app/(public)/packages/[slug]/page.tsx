import { CoursePackageInfo } from "@/components/CoursePackageInfo";
import { getPackageSchema } from "@/schema-generators/package.schema";
import { packageService } from "@/services/courses.service";
import { API_BASE_URL } from "@/services/api.service";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await packageService.getPackageBySlug(slug).catch(() => null);

  if (!pkg) {
    return { title: "Package Not Found | Crackora" };
  }


  const title = pkg.meta_title || `${pkg.course_name} | Crackora`;
  const description =
    pkg.meta_description || pkg.description || "Explore this package on Crackora.";
  const ogImage = pkg.og_image || pkg.image;
  const imageUrl = ogImage ? `${API_BASE_URL}/public/${ogImage}` : undefined;

  return {
    title,
    description,
    keywords: pkg.meta_keywords || undefined,
    alternates: {
      canonical: `/packages/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function PackageInfoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const coursePackage = await packageService.getPackageBySlug(slug);

  if (!coursePackage) {
    notFound();
  }

  const coursePackageSchema = getPackageSchema(coursePackage);

  return (
    <>
      <Script
        id="exam-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(coursePackageSchema),
        }}
      />

      <CoursePackageInfo coursePackage={coursePackage} />
    </>
  );
}