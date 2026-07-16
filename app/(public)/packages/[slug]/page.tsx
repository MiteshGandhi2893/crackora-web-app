import { CoursePackageInfo } from "@/components/CoursePackageInfo";
import { CoursePackage } from "@/interfaces/CoursePackage.interface";
import { getPackageSchema } from "@/schema-generators/package.schema";
import { packageService } from "@/services/courses.service";
import { notFound } from "next/navigation";
import Script from "next/script";

export default async function PackageInfoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await packageService.getPackageBySlug(slug);
  let coursePackage;
  if (response.success) {
    coursePackage = response.package;
  }

  if (response.error) {
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

      <CoursePackageInfo coursePackage={coursePackage}></CoursePackageInfo>
    </>
  );
}
