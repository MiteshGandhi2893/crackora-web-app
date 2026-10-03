"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState, useEffect } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import { Menu } from "@/interfaces/menu.interface";
import { baseMenu, dashboardMenu } from "@/data/Menu";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

// ⚠️ Adjust these labels to match the exact `label` strings in your
// data/Menu.ts baseMenu array. Anything NOT in FREE_LABELS falls into
// the "paid" group by default (so Dashboard sits with login/profile).
const FREE_LABELS = ["Exams", "Previous Papers", "Tools", "Blogs", "Dashboard"];

export function Navbar({
  mobile = false,
  group = "paid",
  onExamsInfoClicked,
  onPackagesInfoClicked,
  onPreviousPaperInfoClicked
}: {
  mobile?: boolean;
  group?: "paid" | "free";
  onExamsInfoClicked?: () => void;
  onPackagesInfoClicked?: () => void;
  onPreviousPaperInfoClicked?: () => void;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const LEFT_MENU: Menu[] = useMemo(() => {
    const items = [...baseMenu];
    if (user?.username) items.push(dashboardMenu);

    if (mobile) return items; // mobile untouched — no grouping applied

    return items.filter((item) =>
      group === "free"
        ? FREE_LABELS.includes(item.label)
        : !FREE_LABELS.includes(item.label),
    );
  }, [user?.username, mobile, group]);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleMenuClick = (clicked: Menu) => {
    const hasSubMenu = !!clicked.subMenu?.length;

    setActiveMenuId((prev) => (prev === clicked.id ? null : clicked.id));

    if (clicked.label === "Exams" && !mobile) {
      onExamsInfoClicked?.();
    }

    if (clicked.label === "Courses" && !mobile) {
      onPackagesInfoClicked?.();
    }

    if (clicked.label === "Previous Papers" && !mobile) {
      onPreviousPaperInfoClicked?.();
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
    cursor-pointer flex justify-between items-end transition-all duration-200 
    ${
      mobile
        ? "pl-2 pb-2 mt-4 border-b"
        : group === "paid"
          ? "text-[14px] font-semibold text-white border border-amber-400 bg-amber-600 px-2 py-1 rounded"
          : "px-2 py-2 text-[14px] text-cyan-900 hover:text-cyan-950"
    }
  `}
        >
          <span className="flex items-center gap-1">
            {menu.icon && (
              <menu.icon className={`w-4 h-4 ${group === "paid" ? 'text-white' : 'text-amber-700' }  opacity-80`}/>
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
