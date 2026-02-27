import { CounsellingSection } from "@/components/counselling-section";
import { DemoLectures } from "@/components/DemoLectures";
import { Footer } from "@/components/Footer";
import { HeroBanner } from "@/components/Herobanner";
import { StudyPlanSection } from "@/components/study-plan/StudyPlanSection";
import { Testimonials } from "@/components/Testimonials";
import { TopPackages } from "@/components/TopPackages";
import { WhyCrackora } from "@/components/WhyCrackora";

export default function Home() {
  
  return (
    <>
      <HeroBanner/>
      <TopPackages/>
      <WhyCrackora/>
      <StudyPlanSection/>
      <DemoLectures/>
      <CounsellingSection/>
      <Testimonials/>
    </>
  );
}
