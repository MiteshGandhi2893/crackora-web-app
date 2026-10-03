// lib/seo/examSchema.ts

import { PaperSet } from "@/interfaces/papersets.interface";

export function getPaperSetSchema(paperSet: PaperSet) {
  return {
    "@context": "https://schema.org",
    "@type": "Exam",
    name: paperSet.title,
    description: paperSet.description,
    url: `https://crackora.com/paper-set/${paperSet.slug}`,
    educationalLevel: "Postgraduate",
    examLocation: "India",
    provider: {
      "@type": "Organization",
      name: "Crackora",
      url: "https://crackora.com",
    },
  };
}
