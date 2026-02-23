/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/header/DashboardHeader";

export function LayoutShell({
  children,
  studyPlans,
}: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="lg:p-5 flex gap-5">
        
        <Sidebar
          studyPlans={studyPlans}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className="w-full flex flex-col gap-3">
          
          <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />

          <main className="bg-gray-300/60 w-full h-full rounded-xl shadow border border-gray-300/60">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
