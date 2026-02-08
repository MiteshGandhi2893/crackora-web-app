import { examService } from "@/services/exam.service";
import { ExamInfo } from "@/components/ExamInfo";
import { Exam } from "@/interfaces/entrance-interface";
import { notFound } from "next/navigation";
import { getExamSchema } from "@/schema-generators/exam.schema";
import Script from "next/script";

/**
 * Dynamic SEO for each exam
 */
export async function generateMetadata({ params }: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const exam: Exam | null = await examService.getExamBySlug(slug);

  if (!exam) {
    return {
      title: "Exam Not Found | Crackora",
      description: "The requested exam is not available on Crackora.",
    };
  }

  return {
    title: exam.meta_title,
    description: exam.meta_description,
    keywords: [
      exam.title,
      `${exam.title} syllabus`,
      `${exam.title} exam pattern`,
      `${exam.title} mock tests`,
      `${exam.title} preparation`,
    ],
    alternates: {
      canonical: `https://crackora.com/exams/${slug}`,
    },
    openGraph: {
      title: `${exam.title} Exam Preparation | Crackora`,
      description: `Everything you need to crack ${exam.title} – syllabus, mocks, and guidance.`,
      url: `https://crackora.com/exams/${slug}`,
      siteName: "Crackora",
      type: "article",
    },
  };
}

/**
 * Exam page (server component)
 */
export default async function ExamInfoPage({ params }: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const exam: Exam | null = await examService.getExamBySlug(slug);

  if (!exam) {
    notFound();
  }

  const examSchema = getExamSchema(exam);

return (
    <>
      {/* ✅ Structured Data (Schema.org) */}
      <Script
        id="exam-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(examSchema),
        }}
      />

      {/* ✅ Visible page content */}
      <ExamInfo exam={exam} />
    </>
  );}
