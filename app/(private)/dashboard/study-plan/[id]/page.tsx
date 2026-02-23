import { StudyCalendar } from "@/components/study-plan/StudyCalendar";
import { studyPlannerService } from "@/services/StudyPlan.service";
import { cookies } from "next/headers";

export default async function StudyPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;
  
  const studyPlan = await studyPlannerService.getStudentPlanById(id, {
    Cookie: `jwt=${token}`,
  });
  return (
    <>
      <StudyCalendar studyPlan={studyPlan} />
    </>
  );
}
