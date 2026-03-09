import { CoursePackage } from "@/interfaces/CoursePackage.interface";
import { packageService } from "@/services/courses.service";
import { notFound } from "next/navigation";

export default async function PackageInfoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await packageService.getPackageBySlug(slug);
  if (response.status === 404) {
    notFound();
  }

  if (!response.success) {
    throw new Error(
      response.error || "Server Error, please contact info@crackora.com",
    );
  }

  const coursePackage = response.package as CoursePackage;

  return (
    <>
    </>
  );
}
