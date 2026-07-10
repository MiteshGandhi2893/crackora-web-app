import dynamic from "next/dynamic";
import { HeroBanner } from "@/components/Herobanner";
import { Metadata } from "next";

// ✅ Keep SSR ON (default) → better LCP + SEO
const WhyCrackora = dynamic(() =>
  import("@/components/WhyCrackora").then((mod) => mod.WhyCrackora)
);

const McaJourneySection = dynamic(() =>
  import("@/components/WhyMCA").then((mod) => mod.McaJourneySection)
);

const ToolsSection = dynamic(() =>
  import("@/components/tools/ToolsSection").then(
    (mod) => mod.ToolsSection
  )
);

const CounsellingSection = dynamic(() =>
  import("@/components/counselling-section").then(
    (mod) => mod.CounsellingSection
  )
);

const Testimonials = dynamic(() =>
  import("@/components/Testimonials").then((mod) => mod.Testimonials)
);

// ✅ Disable SSR ONLY for heavy interactive section
const DemoLectures = dynamic(
  () =>
    import("@/components/DemoLectures").then(
      (mod) => mod.DemoLectures
    ),
  
);


export const metadata: Metadata = {
  metadataBase: new URL("https://crackora.com"),
  title: {
    default: "Crackora - Clarity Before Confidence",
    template: "%s | Crackora",
  },
  description:
    "Crackora helps students crack MCA entrance exams, succeed throughout their MCA journey, and prepare for jobs with PYQs, mock tests, study resources, placement guidance, and career-focused learning tools.",
  keywords: [
    "Crackora",
    "MCA entrance preparation",
    "MCA CET",
    "NIMCET",
    "MCA journey",
    "placement preparation",
    "job preparation",
    "mock tests",
    "PYQ practice",
    "competitive exam preparation",
    "student learning platform",
    "coding interview preparation",
  ],
  authors: [{ name: "Crackora" }],
  creator: "Crackora",
  publisher: "Crackora",
  applicationName: "Crackora",
  alternates: {
    canonical: "https://crackora.com",
  },
  openGraph: {
    title: "Crackora - Clarity Before Confidence",
    description:
      "From MCA entrance preparation to placements and jobs — Crackora helps students with PYQs, mock tests, study resources, interview preparation, and career guidance.",
    url: "https://crackora.com",
    siteName: "Crackora",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Crackora",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crackora - Clarity Before Confidence",
    description:
      "Prepare for MCA entrances, placements, and jobs with Crackora’s PYQs, mock tests, study resources, and career-focused learning tools.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};
export default function Home() {
  return (
    <>
      {/* ✅ Above-the-fold → keep normal */}
      <HeroBanner />

      {/* ✅ Below-the-fold → dynamically loaded */}
      <WhyCrackora />
      <DemoLectures />
      <McaJourneySection />
      <ToolsSection />
      <CounsellingSection />
      <Testimonials />
    </>
  );
}