import ToolsClient from "@/components/tools/ToolsPage";
import { ToolKey } from "@/components/tools/tools-util";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

const TOOL_META: Record<string, { title: string; description: string; keywords: string[] }> = {
  college: {
    title: "MCA College Predictor 2025 — Predict Colleges by Rank",
    description:
      "Enter your NIMCET, MAH MCA CET, TANCET, IPU CET, WB JECA, or CUET PG rank and instantly see which colleges you're likely to get. Based on official 2023–2025 counselling cutoff data.",
    keywords: ["MCA college predictor", "NIMCET college predictor", "MCA rank vs college", "MCA counselling 2025"],
  },
  rank: {
    title: "MCA Rank Predictor 2025 — Estimate Rank from Mock Score",
    description:
      "Enter your MCA mock test score and get an estimated rank range. Know exactly what score you need for your target college before the real exam.",
    keywords: ["MCA rank predictor", "NIMCET rank estimator", "MCA score to rank", "MCA mock test rank"],
  },
  planner: {
    title: "MCA Study Planner 2025 — Personalised Day-by-Day Schedule",
    description:
      "Get a personalised MCA entrance exam study plan based on your exam date, weak subjects, and daily hours. Built for NIMCET, MAH MCA CET, TANCET and more.",
    keywords: ["MCA study planner", "NIMCET preparation schedule", "MCA exam timetable", "MCA study plan 2025"],
  },
  cutoff: {
    title: "MCA Cutoff Analyser 2025 — 3 Years of Cutoff Trends",
    description:
      "Explore 3 years of official cutoff data across all 6 MCA entrance exams and their colleges. See if competition is rising or falling and set realistic targets.",
    keywords: ["MCA cutoff 2025", "NIMCET cutoff trends", "MCA entrance cutoff history", "MAH MCA CET cutoff"],
  },
  salary: {
    title: "MCA Salary Calculator 2025 — College Tier vs Salary",
    description:
      "See realistic MCA salary ranges at 0–2, 3–5, and 5+ years by college tier and specialisation. Based on NIT placement reports and Ambitionbox data.",
    keywords: ["MCA salary after graduation", "NIT MCA placement", "MCA salary by college", "MCA career salary 2025"],
  },
  eligibility: {
    title: "MCA Eligibility Checker 2025 — Which Exams Can You Appear For?",
    description:
      "Enter your stream and percentage to instantly check eligibility for all 6 MCA entrance exams — NIMCET, MAH MCA CET, TANCET, IPU CET, WB JECA, CUET PG — based on official 2026 criteria.",
    keywords: ["MCA eligibility 2025", "NIMCET eligibility criteria", "MCA entrance exam eligibility", "who can apply for MCA"],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = TOOL_META[slug];

  if (!meta) {
    return {
      title: "Free MCA Entrance Exam Tools 2025",
      description: "6 free tools for MCA entrance exam prep — college predictor, rank estimator, cutoff analyser and more.",
    };
  }

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://crackora.com/tools/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `https://crackora.com/tools/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return [
    { slug: "college" },
    { slug: "rank" },
    { slug: "planner" },
    { slug: "cutoff" },
    { slug: "salary" },
    { slug: "eligibility" },
  ];
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;

  return <ToolsClient slug={slug as ToolKey} />;
}