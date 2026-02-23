/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BiMenu } from "react-icons/bi";
import { LoginStatus } from "../app-buttons/login-button";

export function DashboardHeader({ onMenuClick }: any) {
  return (
    <header className="w-full h-16 bg-gray-300/60 border shadow rounded-xl px-2 flex items-center justify-between">
      {/* LEFT: Mobile Menu Button */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-white/40"
        >
          <BiMenu className="w-6 h-6 text-cyan-900" />
        </button>

        {/* CENTER / TITLE if needed */}
        <div className="text-cyan-900 font-medium text-sm">Dashboard</div>
      </div>

      {/* RIGHT */}
      <div className="">
        <LoginStatus />
      </div>
    </header>
  );
}
