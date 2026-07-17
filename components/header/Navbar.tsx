// ✅ FIX: force Navbar to re-render immediately on logout

"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState, useEffect } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import { Menu } from "@/interfaces/menu.interface";
import { baseMenu, dashboardMenu } from "@/data/Menu";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

export function Navbar({
  mobile = false,
  onExamsInfoClicked,
  onPackagesInfoClicked,

}: {
  mobile?: boolean;
  onExamsInfoClicked?: () => void;
  onPackagesInfoClicked?: () => void;
}) {
  const { user } = useAuth();
  const router = useRouter();

  // ✅ IMPORTANT: depend on user?.username (not full user object)
  const LEFT_MENU: Menu[] = useMemo(() => {
    const items = [...baseMenu];
    if (user?.username) items.push(dashboardMenu);
    return items;
  }, [user?.username]); // ✅ FIXED

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleMenuClick = (clicked: Menu) => {
    const hasSubMenu = !!clicked.subMenu?.length;

    setActiveMenuId((prev) =>
      prev === clicked.id ? null : clicked.id
    );

    if (clicked.label === "Exams" && !mobile) {
      onExamsInfoClicked?.();
    }

    if (clicked.label === "Courses" && !mobile) {
      onPackagesInfoClicked?.();
    }

    if (!hasSubMenu && clicked.href && clicked.href !== "#") {
      router.push(clicked.href);
      setActiveMenuId(null);
    }
  };

  const handleSubClick = (href?: string) => {
    if (href) router.push(href);
    setActiveMenuId(null);
  };

  useEffect(() => {
    const handleOutside = () => setActiveMenuId(null);
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  }, []);

  const renderMenu = (menu: Menu) => {
    const isOpen = activeMenuId === menu.id;

    return (
      <li key={menu.id} id={menu.id} className={mobile ? "w-full" : "w-fit"}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleMenuClick(menu);
          }}
          className={`
            cursor-pointer text-cyan-950 flex justify-between items-center
            ${mobile ? "pl-2 pb-2 mt-4 border-b" : "text-[14px]"}
          `}
        >
          <span className="flex items-center gap-1">
            {menu.icon && (
              <menu.icon className="w-4 h-4 text-amber-700 opacity-80" />
            )}

            {menu.href && menu.href !== "#" && !menu.subMenu ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubClick(menu.href);
                }}
              >
                {menu.label}
              </span>
            ) : (
              <span>{menu.label}</span>
            )}
          </span>

          {menu.subMenu && (
            <BiSolidDownArrow
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>

        {mobile && menu.subMenu && isOpen && (
          <div className="bg-sky-50 rounded-md mt-2 max-h-75 overflow-auto">
            <ul className="ml-4 space-y-2 pr-2">
              {menu.subMenu.map((sub) => (
                <li key={sub.id}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubClick(sub.href);
                    }}
                    className="flex justify-between items-center p-2 cursor-pointer text-cyan-700 hover:bg-amber-50 rounded-md"
                  >
                    {sub.label}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <nav className={`w-full ${mobile ? "flex flex-col" : "flex items-center"}`}>
      <ul className={`flex list-none ${mobile ? "flex-col w-full" : "gap-3"}`}>
        {LEFT_MENU.map(renderMenu)}
      </ul>
    </nav>
  );
}