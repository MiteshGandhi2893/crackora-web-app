// lib/seo/examSchema.ts

import { Exam } from "@/interfaces/entrance-interface";

export function getExamSchema(exam: Exam) {
  return {
    "@context": "https://schema.org",
    "@type": "Exam",
    name: exam.title,
    description: exam.meta_description,
    url: `https://crackora.com/exams/${exam.slug}`,
    educationalLevel: "Postgraduate",
    examLocation: "India",
    provider: {
      "@type": "Organization",
      name: "Crackora",
      url: "https://crackora.com",
    },
  };
}
