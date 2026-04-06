"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiUser, BiHomeAlt, BiGridAlt } from "react-icons/bi";
import { Logo } from "./header/Logo";

const MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BiGridAlt,
    href: "/dashboard",
  },
  {
    id: "my-account",
    label: "My Account",
    icon: BiUser,
    href: "/dashboard/my-account",
  },
  // Future menu items go here — sidebar will scroll if list grows
];

export function Sidebar({ studyPlans, mobileMenuOpen, setMobileMenuOpen }: any) {
  // studyPlans accepted for future use
  void studyPlans;

  const pathname = usePathname();

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
          fixed top-0 left-0 h-full w-64 flex flex-col
          bg-cyan-950
          transform transition-transform duration-300 ease-in-out
          z-50 shadow-xl
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:shrink-0
          lg:h-[calc(100vh-40px)] lg:rounded-2xl lg:sticky lg:top-5
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 bg-amber-50/95 lg:rounded-t-2xl border-b border-amber-100 shrink-0">
          <Logo />
        </div>

        {/* Nav label */}
        <div className="px-6 pt-5 pb-2 shrink-0">
          <p className="text-cyan-500 text-[10px] font-bold uppercase tracking-widest">
            Menu
          </p>
        </div>

        {/* Scrollable nav items — grows as menu items are added */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "bg-amber-500 text-white shadow-md shadow-amber-900/30"
                    : "text-cyan-200 hover:bg-cyan-800/60 hover:text-white"
                  }
                `}
              >
                <item.icon
                  className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-amber-400"}`}
                />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Back to Home + brand tag */}
        <div className="shrink-0 px-3 pb-4 pt-2 border-t border-cyan-800/50 flex flex-col gap-2">
          {/* Home link */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-cyan-300 hover:bg-cyan-800/60 hover:text-white transition-all duration-200 group"
          >
            <BiHomeAlt className="w-5 h-5 text-amber-400 group-hover:text-amber-300 shrink-0" />
            <span>Back to Home</span>
          </Link>

          {/* Brand tag */}
          <div className="border border-cyan-800 rounded-xl px-3 py-2 text-center">
            <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">
              Crackora
            </p>
            <p className="text-amber-50 text-[10px] mt-0.5 tracking-widest">
              Your MCA Journey Companion
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}