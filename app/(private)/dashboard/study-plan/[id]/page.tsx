import { StudyCalendar } from "@/components/study-plan/StudyCalendar";
import { studyPlannerService } from "@/services/StudyPlan.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ─── Helper: exchange the httpOnly refreshToken cookie for a fresh access token
async function getAccessTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/refresh`, {
      method: "POST",
      headers: { Cookie: `refreshToken=${refreshToken}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.accessToken ?? null;
  } catch {
    return null;
  }
}

export default async function StudyPlanPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // No valid session → redirect to home with auth=expired flag
  const accessToken = await getAccessTokenFromCookie();
  if (!accessToken) {
    redirect("/?auth=expired");
  }

  let studyPlan = null;

  try {
    const res = await studyPlannerService.getStudentPlanById(id, {
      Authorization: `Bearer ${accessToken}`,
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