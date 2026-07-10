"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BiMenu } from "react-icons/bi";
import { LoginStatus } from "../app-buttons/login-button";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join("");
  return (
    <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 text-xs font-bold shrink-0 select-none">
      {initials || "?"}
    </div>
  );
}

export function DashboardHeader({ onMenuClick }: any) {
  return (
    <header className="w-full h-16 rounded-xl px-4 flex items-center justify-between  ">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[#f8f7f4] transition-colors"
        >
          <BiMenu className="w-5 h-5 text-cyan-900" />
        </button>
        <div className="text-cyan-950 font-semibold text-md sm:text-base tracking-tight">
          Dashboard
        </div>
      </div>

      {/* RIGHT */}
     <LoginStatus/>
    </header>
  );
}
