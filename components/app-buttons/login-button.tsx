"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { BiLogIn, BiUser, BiLogOut } from "react-icons/bi";
import { authService } from "@/services/Authentication.service";

export function LoginStatus(props: any) {
  const { mobile } = props;

  const router = useRouter();
  const pathname = usePathname();

  const { user, openAuth, setPostAuthAction } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);

  // --- NEW: ref for dropdown
  const menuRef = useRef<HTMLDivElement>(null);

  // --- NEW: click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ When login button clicked
  const handleLoginClick = () => {
    setPostAuthAction(() => () => {
      router.push("/dashboard"); // redirect AFTER login success
    });
    openAuth(); // just open modal
  };

  // ✅ Logout handler
  const handleLogout = async () => {
    await authService.signOut();
    setOpenMenu(false);
    router.push("/"); // optional redirect
  };

  return (
    <div
      className={`flex items-center text-sm font-normal ${
        mobile ? "text-cyan-900 text-lg" : "text-gray-300"
      }`}
    >
      {!user ? (
        // --------------------
        // NOT LOGGED IN
        // --------------------
        <div
          className="flex gap-2 justify-center items-center cursor-pointer"
          onClick={handleLoginClick}
        >
          <BiLogIn className="text-amber-600 w-6 h-6" />
          <div className="text-cyan-900 text-[15px] font-medium">Log In</div>
        </div>
      ) : (
        // --------------------
        // LOGGED IN
        // --------------------
        <div className="relative" ref={menuRef}>
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <BiUser className="text-amber-600 sm:w-6 sm:h-6 w-5 h-5" />
            <div className="text-cyan-900 sm:text-[15px] text-[13px] font-medium">
              {user.fullname || "Profile"}
            </div>
          </div>

          {openMenu && (
            <div className="absolute right-0 mt-2 left-0 w-40 bg-white border border-cyan-900/60 rounded-lg shadow-lg z-50">
              <div
                className="flex items-center gap-2 px-3 py-2 cursor-pointer text-cyan-900"
                onClick={handleLogout}
              >
                <BiLogOut className="text-amber-600" />
                Logout
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
