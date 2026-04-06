"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BiMenu, BiUser, BiLogOut, BiCog } from "react-icons/bi";
import { useAuth } from "@/providers/AuthProvider";
import { authService } from "@/services/Authentication.service";

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
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await authService.signOut();
    setOpenMenu(false);
    router.push("/");
  };

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
      {user && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpenMenu((v) => !v)}
            className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 hover:border-amber-300 rounded-xl px-3 py-1.5 transition-all duration-200 cursor-pointer"
          >
            <Avatar name={user.fullname ?? ""} />
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-cyan-950 text-[13px] font-semibold">
                {user.fullname}
              </span>
              <span className="text-amber-600 text-[10px] font-medium capitalize mt-0.5">
                {user?.roles?.[0] ?? "student"}
              </span>
            </div>
            <svg
              className={`w-3.5 h-3.5 text-cyan-400 transition-transform duration-200 ${openMenu ? "rotate-180" : ""}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown */}
          {openMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
              {/* User info */}
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-cyan-950 text-xs font-semibold truncate">{user.fullname}</p>
                <p className="text-gray-400 text-[11px] truncate mt-0.5">{user.email}</p>
              </div>

              <button
                onClick={() => { router.push("/dashboard/my-account"); setOpenMenu(false); }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-cyan-900 hover:bg-[#f8f7f4] transition-colors cursor-pointer"
              >
                <BiCog className="text-amber-500 w-4 h-4" />
                Account Settings
              </button>

              <div className="border-t border-gray-100 mt-1" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <BiLogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}