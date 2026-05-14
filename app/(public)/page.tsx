import dynamic from "next/dynamic";
import { HeroBanner } from "@/components/Herobanner";

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