/* eslint-disable react-hooks/set-state-in-effect */
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { BiCalendar, BiCalendarEvent } from "react-icons/bi";
import Image from "next/image";
import { Menu } from "@/interfaces/menu.interface";
import { CreatePlanButton } from "./app-buttons/create-plan";
import Link from "next/link";

export function Sidebar({
  studyPlans,
  mobileMenuOpen,
  setMobileMenuOpen,
}: any) {
  const [activeTab, setActiveTab] = useState("study");
  const [menuItems, setMenuItems] = useState<Menu[]>([]);

  /* -----------------------------
     Build menu from study plans
  ------------------------------*/
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
          href: `/dashboard/study-plan/${plan.study_plan_id}`
        })),
      },
    ];

    setMenuItems(items);
  }, [studyPlans]);

  return (
    <>
      {/* -----------------------------
         Mobile Backdrop Overlay
      ------------------------------*/}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* -----------------------------
         Sidebar / Drawer
      ------------------------------*/}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64
          bg-linear-to-b from-gray-200 to-cyan-900/60
          transform transition-transform duration-300 ease-in-out
          z-50 shadow-xl

          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0 lg:relative
          lg:h-[calc(100vh-40px)] lg:rounded-xl
        `}
      >
        {/* Logo (Desktop Only) */}
        <div className="w-full sm:h-16 h-13 relative">
          <Image src="/crackora-logo.svg" alt="Logo" fill />
        </div>

        <div className="flex flex-col gap-2 mt-5">
          <div className="text-gray-600 ml-5 text-sm">Menu</div>

          <ul className="flex flex-col">
            {menuItems.map((m) => (
              <li key={m.id} className="cursor-pointer flex flex-col">
                {/* Main Menu Item */}
                <div
                  onClick={() => {
                    setActiveTab(m.id);
                    setMobileMenuOpen(false); // close drawer on mobile
                  }}
                  className={`flex items-center w-full transition-colors duration-200
                    ${
                      activeTab === m.id
                        ? "text-cyan-950"
                        : "hover:bg-cyan-800 hover:text-white text-cyan-950"
                    }`}
                >
                  {activeTab === m.id && (
                    <div className="bg-amber-600 w-2 h-10 rounded-br rounded-tr" />
                  )}

                  <div
                    className={`flex items-center gap-2 pl-3 w-full py-1.5
                      ${activeTab === m.id ? "bg-amber-100/50" : ""}`}
                  >
                    {m.icon && <m.icon className="w-5 h-5 text-amber-600" />}
                    <span className="text-sm sm:text-[15px]">{m.label}</span>
                  </div>
                </div>

                {/* Submenu */}
                {activeTab === m.id &&
                  Array.isArray(m.subMenu) &&
                  m.subMenu.length > 0 && (
                    <ul className="px-8 text-sm">
                      {m.subMenu.map((entry: any) => (
                        <li
                          key={entry.id}
                          className="py-1 text-cyan-900 hover:text-amber-600"
                          onClick={() => {
                            console.log("Open study plan:", entry.id);

                            // Close drawer on mobile after click
                            setMobileMenuOpen(false);
                          }}
                        >
                          <Link className={`flex items-center gap-2  w-full`} href={entry.href}>
                            {entry.icon && (
                              <entry.icon className="w-5 h-5 text-amber-600" />
                            )}
                            <span className="text-[12px] sm:text-[13px] text-gray-800">
                              {entry.label}
                            </span>
                          </Link>
                        </li>
                      ))}
                      <li className="mt-2">
                        <CreatePlanButton
                          addonClass={
                            "px-3 py-1.5 sm:text-[15px] text-[12px] w-full bg-amber-600"
                          }
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
