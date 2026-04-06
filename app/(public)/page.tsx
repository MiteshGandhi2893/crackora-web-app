import { CounsellingSection } from "@/components/counselling-section";
import { DemoLectures } from "@/components/DemoLectures";
import { Footer } from "@/components/Footer";
import { HeroBanner } from "@/components/Herobanner";
import { ToolsSection } from "@/components/study-plan/ToolsSection";
import { Testimonials } from "@/components/Testimonials";
import { TopPackages } from "@/components/TopPackages";
import {  WhyCrackora } from "@/components/WhyCrackora";
import { McaJourneySection } from "@/components/WhyMCA";

export default function Home() {
  
  return (
    <>
      <HeroBanner/>
      <TopPackages/>
      <WhyCrackora/>
      <McaJourneySection/>
      <ToolsSection/>
      <DemoLectures/>
      <CounsellingSection/>
      <Testimonials/>
    </>
  );
}
