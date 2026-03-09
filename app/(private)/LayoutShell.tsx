"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/header/DashboardHeader";

export function LayoutShell({ children, studyPlans }: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="lg:p-5 flex gap-4 lg:gap-5">

        <Sidebar
          studyPlans={studyPlans}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className="w-full flex flex-col gap-3 min-w-0">
          <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />

          <main className="w-full h-full rounded-2xl overflow-hidden border border-[#e8e4dc] shadow-[0_2px_16px_rgba(5,16,31,0.06)] bg-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}