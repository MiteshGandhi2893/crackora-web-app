export const dynamic = "force-dynamic";

import { studyPlannerService } from "@/services/StudyPlan.service";
import { cookies } from "next/headers";
import { LayoutShell } from "./LayoutShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  const studyPlans = await studyPlannerService.getStudentPlans({
    Cookie: `jwt=${token}`,
  });

  return (
    <LayoutShell studyPlans={studyPlans}>
      {children}
    </LayoutShell>
  );
}
