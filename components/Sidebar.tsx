/* eslint-disable react-hooks/set-state-in-effect */
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { BiCalendar, BiCalendarEvent } from "react-icons/bi";
import { Menu } from "@/interfaces/menu.interface";
import { CreatePlanButton } from "./app-buttons/create-plan";
import Link from "next/link";
import { Logo } from "./header/Logo";

export function Sidebar({
  studyPlans,
  mobileMenuOpen,
  setMobileMenuOpen,
}: any) {
  const [activeTab, setActiveTab] = useState("study");
  const [menuItems, setMenuItems] = useState<Menu[]>([]);

  useEffect(() => {
    if (!studyPlans) return;

    const items: Menu[] = [
      {
        label: "My Study Plans",
        id: "study",
        icon: BiCalendar,
        subMenu: studyPlans.map((plan: any) => ({
          id: plan.study_plan_id,
          label: `${plan.exam_title} plan`,
          icon: BiCalendarEvent,
          href: `/dashboard/study-plan/${plan.study_plan_id}`,
        })),
      },
    ];

    setMenuItems(items);

    // Always open the study tab so submenu is visible on load
    setActiveTab("study");
  }, [studyPlans]);

  const hasPlans = studyPlans && studyPlans.length > 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64
          bg-cyan-950/90
          transform transition-transform duration-300 ease-in-out
          z-50 shadow-xl
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative
          lg:h-[calc(100vh-40px)] lg:rounded-xl
        `}
      >
        {/* Logo */}
        <div className="w-full sm:h-16 h-13 relative py-1.5 px-3 bg-amber-50/90">
          <Logo />
        </div>

        <div className="flex flex-col gap-2 mt-5">
          <div className="text-gray-100 ml-5 text-sm">Menu</div>

          <ul className="flex flex-col">
            {menuItems.map((m) => (
              <li key={m.id} className="cursor-pointer flex flex-col">

                {/* Main Menu Item */}
                <div
                  onClick={() => {
                    setActiveTab(m.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full transition-colors duration-200
                    ${
                      activeTab === m.id
                        ? "text-cyan-900"
                        : "hover:bg-cyan-800 hover:text-white text-cyan-950"
                    }`}
                >
                  {activeTab === m.id && (
                    <div className="bg-amber-600 w-2 h-10 rounded-br rounded-tr" />
                  )}
                  <div
                    className={`flex items-center gap-2 pl-3 w-full py-1.5
                      ${activeTab === m.id ? "bg-amber-50/80" : ""}`}
                  >
                    {m.icon && <m.icon className="w-5 h-5 text-amber-700" />}
                    <span className="text-sm sm:text-[15px]">{m.label}</span>
                  </div>
                </div>

                {/* Submenu — always open when tab is active */}
                {activeTab === m.id && (
                  <ul className="px-4 text-sm mt-1 flex flex-col gap-1">

                    {hasPlans ? (
                      // Plans exist — list them
                      m.subMenu?.map((entry: any) => (
                        <li
                          key={entry.id}
                          className="py-1 hover:text-amber-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link
                            className="flex items-center gap-2 w-full"
                            href={entry.href}
                          >
                            {entry.icon && (
                              <entry.icon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            )}
                            <span className="text-[12px] sm:text-[13px] text-cyan-50 truncate">
                              {entry.label}
                            </span>
                          </Link>
                        </li>
                      ))
                    ) : (
                      // No plans — empty state message
                      <li className="px-1 py-2">
                        <p className="text-cyan-200/50 text-[11px] leading-relaxed">
                          No study plans yet.
                          <br />
                          Click below to generate one.
                        </p>
                      </li>
                    )}

                    {/* Generate Plan button — always shown */}
                    <li className="mt-2 pb-1">
                      <CreatePlanButton
                        addonClass="px-3 py-1.5 sm:text-[15px] text-[12px] w-full bg-amber-600"
                      />
                    </li>

                  </ul>
                )}

              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}