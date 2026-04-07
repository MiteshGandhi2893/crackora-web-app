import { CounsellingSection } from "@/components/counselling-section";
import { DemoLectures } from "@/components/DemoLectures";
import { HeroBanner } from "@/components/Herobanner";
import { LazySection } from "@/components/LazySection";
import { ToolsSection } from "@/components/study-plan/ToolsSection";
import { Testimonials } from "@/components/Testimonials";
import { WhyCrackora } from "@/components/WhyCrackora";
import { McaJourneySection } from "@/components/WhyMCA";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <LazySection>
        {/* <TopPackages /> */}
        <WhyCrackora />
      </LazySection>
      <LazySection>
        <McaJourneySection />
      </LazySection>
      <LazySection>
        <ToolsSection />
      </LazySection>
      <LazySection>
        <DemoLectures />
      </LazySection>
      <LazySection>
        <CounsellingSection />
      </LazySection>
      <LazySection>
        <Testimonials />
      </LazySection>
    </>
  );
}
