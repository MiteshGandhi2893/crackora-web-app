// lib/seo/examSchema.ts

import { CoursePackage } from "@/interfaces/CoursePackage.interface";

export function getPackageSchema(coursePackage: CoursePackage) {
  return {
    "@context": "https://schema.org",
    "@type": "Exam",
    name: coursePackage.course_name,
    description: coursePackage.description,
    url: `https://crackora.com/courses/${coursePackage.slug}`,
    educationalLevel: "Postgraduate",
    examLocation: "India",
    provider: {
      "@type": "Organization",
      name: "Crackora",
      url: "https://crackora.com",
    },
  };
}
