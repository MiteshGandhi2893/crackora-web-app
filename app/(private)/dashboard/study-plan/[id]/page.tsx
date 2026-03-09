import { StudyCalendar } from "@/components/study-plan/StudyCalendar";
import { studyPlannerService } from "@/services/StudyPlan.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function StudyPlanPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  // If no token → open login if user fails to login or register than taken him back to the home page
  if (!token) {
    // this is the bad state just logout and send them back to home page
    redirect("/?auth=expired");
  }

  let studyPlan = null;

  try {
    const res = await studyPlannerService.getStudentPlanById(id, {
      Cookie: `jwt=${token}`,
    });

    if (!res.success || res.status === 401) {
      redirect("/?auth=expired");
    }

    studyPlan = res.plan;
  } catch (error) {
    console.error("Error fetching study plan:", error);
  }

  return <StudyCalendar studyPlan={studyPlan} />;
}
