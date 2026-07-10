"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/header/DashboardHeader";

export function LayoutShell({ children, studyPlans }: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#f8f7f4] lg:p-5 flex gap-4 lg:gap-5 min-h-screen">

      {/* Sidebar — sticky on desktop, handled internally */}
      <Sidebar
        studyPlans={studyPlans}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Right column — sticky container, header + scrollable main */}
      <div className="flex flex-col flex-1 min-w-0 p-3 lg:p-0 lg:h-[calc(100vh-40px)] lg:sticky lg:top-5 gap-3">
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />

        {/* This is the scrollable content area */}
        <main className="flex-1 rounded-2xl border border-[#e8e4dc] shadow-[0_2px_16px_rgba(5,16,31,0.06)] bg-white overflow-y-auto min-h-0">
          {children}
        </main>
      </div>

    </div>
  );
}