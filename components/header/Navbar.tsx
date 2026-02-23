"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Link from "next/link";
import { BiSolidDownArrow } from "react-icons/bi";
import { Menu, SubMenu } from "@/interfaces/menu.interface";
import { menu } from "@/data/Menu";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

export function Navbar({
  mobile = false,
  onExamsInfoClicked,
}: {
  mobile?: boolean;
  onExamsInfoClicked?: () => void;
}) {
  const LEFT_MENU = menu;
  const [menuItems, setMenuItems] = useState<Menu[]>(LEFT_MENU);
  const { user, openAuth, setPostAuthAction } = useAuth();
  const router = useRouter();

  const handleMenuClick = (clicked: Menu) => {
    setMenuItems((prev) =>
      prev.map((menu) => ({
        ...menu,
        isActive: menu.id === clicked.id ? !menu.isActive : false,
      })),
    );

    if (clicked.label === "Exams" && !mobile) {
      onExamsInfoClicked?.();
      console.log("Exams Clicked");
    }

    if (clicked.label === "Dashboard") {
      setPostAuthAction(() => () => {
        router.push("/dashboard"); // redirect AFTER login success
      });
      if (!user || !user.username) {
        openAuth();
      } else {
        router.push("/dashboard"); // redirect AFTER login success
      }
    }
  };

  const handleSubMenuClick = (menuId: Menu["id"], subId: SubMenu["id"]) => {
    setMenuItems((prev) =>
      prev.map((menu) =>
        menu.id === menuId
          ? {
              ...menu,
              subMenu: menu.subMenu?.map((sub) => ({
                ...sub,
                isActive: sub.id === subId ? !sub.isActive : false,
              })),
            }
          : menu,
      ),
    );
  };

  const renderMenu = (menu: Menu) => (
    <li key={menu.id} className={mobile ? "w-full" : "w-fit"}>
      <div
        onClick={() => handleMenuClick(menu)}
        className={`
          cursor-pointer text-sky-900 flex justify-between items-center
          ${mobile ? "pl-2 pb-2 mt-4 border-b" : "text-[16px]"}
        `}
      >
        <span className="flex items-center gap-1">
          {menu.icon && (
            <menu.icon className="w-4 h-4 text-amber-700 opacity-80" />
          )}

          {menu.label === "Dashboard" ? (
            <span>{menu.label}</span> // NOT a Link
          ) : menu.href && menu.href !== "#" ? (
            <Link href={menu.href}>{menu.label}</Link>
          ) : (
            <span>{menu.label}</span>
          )}
        </span>

        {menu.subMenu && (
          <BiSolidDownArrow
            className={`w-4 h-4 transition-transform ${
              menu.isActive ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {/* Mobile submenu */}
      {mobile && menu.subMenu && menu.isActive && (
        <div className="bg-sky-50 rounded-md mt-2 max-h-75 overflow-auto">
          <ul className="ml-4 space-y-2 pr-2">
            {menu.subMenu.map((sub) => (
              <li key={sub.id}>
                <div
                  onClick={() => handleSubMenuClick(menu.id, sub.id)}
                  className="flex justify-between items-center p-2 cursor-pointer text-cyan-700 hover:bg-amber-50 rounded-md"
                >
                  {sub.label}
                  {sub.subMenu && (
                    <BiSolidDownArrow
                      className={`w-4 h-4 transition-transform ${
                        sub.isActive ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {sub.subMenu && sub.isActive && (
                  <ul className="ml-6 bg-white border rounded-md max-h-55 overflow-auto">
                    {sub.subMenu.map((s) => (
                      <li
                        key={s.id}
                        className="py-2 px-3 border-b hover:bg-gray-50"
                      >
                        {s.label}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );

  return (
    <nav className={`w-full ${mobile ? "flex flex-col" : "flex items-center"}`}>
      <ul className={`flex list-none ${mobile ? "flex-col w-full" : "gap-3"}`}>
        {menuItems.map(renderMenu)}
      </ul>
    </nav>
  );
}
