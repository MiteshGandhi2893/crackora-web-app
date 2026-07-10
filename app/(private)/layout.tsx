export const dynamic = "force-dynamic";

import { studyPlannerService } from "@/services/StudyPlan.service";
import { cookies } from "next/headers";
import { LayoutShell } from "./LayoutShell";

// ─── Helper: exchange the httpOnly refreshToken cookie for a fresh access token
// This is the server-side equivalent of refreshAccessToken() on the client.
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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = await getAccessTokenFromCookie();

  let studyPlans = null;

  if (accessToken) {
    try {
      const res = await studyPlannerService.getStudentPlans({
        Authorization: `Bearer ${accessToken}`,
      });
      studyPlans = res.plans;
    } catch (error) {
      console.error("Error fetching study plans:", error);
    }
  }

  return <LayoutShell studyPlans={studyPlans}>{children}</LayoutShell>;
}