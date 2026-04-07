/* eslint-disable react-hooks/set-state-in-effect */
// ✅ FIXED: MobileMenu updates instantly on logout (Dashboard removed)

"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { BiX, BiCaretRight, BiCaretDown } from "react-icons/bi";
import { Menu } from "@/interfaces/menu.interface";
import { baseMenu, dashboardMenu } from "@/data/Menu";
import { apiService } from "@/services/api.service";
import { Logo } from "./Logo";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { LoginStatus } from "../app-buttons/login-button";
import { getCachedExams } from "@/services/EntranceCache";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { user, openAuth, setPostAuthAction } = useAuth();

  const [openLevel1, setOpenLevel1] = useState<string | null>(null);
  const [openLevel2, setOpenLevel2] = useState<string | null>(null);
  const [entrances, setEntrances] = useState<any[]>([]);
  const [examsLoaded, setExamsLoaded] = useState(false);

  // ✅ reset accordion on close OR logout
  useEffect(() => {
    if (!open || !user?.username) {
      setOpenLevel1(null);
      setOpenLevel2(null);
    }
  }, [open, user?.username]); // ✅ FIX

  // ✅ IMPORTANT: depend only on user?.username
  const baseItems: Menu[] = useMemo(() => {
    const items = [...baseMenu];
    if (user?.username) items.push(dashboardMenu);
    return items;
  }, [user?.username]); // ✅ FIX

  const menu: Menu[] = useMemo(() => {
    const cloned: Menu[] = JSON.parse(JSON.stringify(baseItems));
    const examsMenu = cloned.find((item) => item.label === "Exams");

    if (examsMenu && entrances.length) {
      examsMenu.subMenu = entrances.map((entrance: any) => ({
        label: entrance.title,
        id: entrance.id,
        subMenu: entrance.exams.map((exam: any) => ({
          label: exam.title,
          href: `/exams/${exam.id}`,
          id: exam.id,
          imageIcon: exam.icon,
          description: exam.description,
          slug: exam.slug,
        })),
      }));
    }

    return cloned;
  }, [baseItems, entrances]);

  const handleMenuClick = async (item: Menu) => {
    if (item.label === "Exams" && !examsLoaded) {
      const data = await getCachedExams();
      setEntrances(data ?? []);
      setExamsLoaded(true);
    }

    if (item.label === "Dashboard") {
      setPostAuthAction?.(() => () => router.push("/dashboard"));

      if (!user?.username) openAuth();
      else router.push("/dashboard");

      onClose();
      return;
    }

    const hasSubMenu =
      !!item.subMenu?.length || item.label === "Exams";

    if (hasSubMenu) {
      setOpenLevel1((prev) => (prev === item.id ? null : item.id));
      setOpenLevel2(null);
      return;
    }

    if (item.href && item.href !== "#") {
      router.push(item.href);
    }

    onClose();
  };

  const renderMenu = (items: Menu[]) =>
    items.map((item) => {
      const hasSubMenu =
        !!item.subMenu?.length || item.label === "Exams";
      const isOpen = openLevel1 === item.id;

      return (
        <div key={item.id}>
          {/* Level 1 */}
          <div
            className={`flex justify-between items-center py-3 px-1 cursor-pointer border-b border-[#f0ede6]
              ${isOpen ? "text-amber-600" : "text-cyan-950/80 hover:text-amber-600"}`}
            onClick={() => handleMenuClick(item)}
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              {item.icon && (
                <item.icon className="w-4 h-4 text-amber-700 opacity-80" />
              )}
              <span>{item.label}</span>
            </span>

            {hasSubMenu &&
              (isOpen ? (
                <BiCaretDown className="w-4 h-4 text-amber-500" />
              ) : (
                <BiCaretRight className="w-4 h-4 text-[#05101f]/30" />
              ))}
          </div>

          {/* Level 2 */}
          {item.subMenu && isOpen &&
            item.subMenu.map((subItem) => {
              const hasChild = !!subItem.subMenu?.length;
              const subOpen = openLevel2 === subItem.id;

              return (
                <div key={subItem.id}>
                  <div
                    className={`flex items-center justify-between pl-5 pr-1 py-2.5 cursor-pointer border-b border-[#f0ede6]
                      ${subOpen ? "text-amber-600" : "text-[#05101f]/55 hover:text-amber-600"}`}
                    onClick={() =>
                      hasChild && setOpenLevel2(subOpen ? null : subItem.id)
                    }
                  >
                    <span className="text-[13px] font-medium">
                      {subItem.label}
                    </span>

                    {hasChild &&
                      (subOpen ? (
                        <BiCaretDown className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <BiCaretRight className="w-3.5 h-3.5 text-[#05101f]/30" />
                      ))}
                  </div>

                  {/* Level 3 */}
                  {hasChild &&
                    subOpen &&
                    subItem.subMenu!.map((lastItem) => (
                      <div
                        key={lastItem.id}
                        onClick={() => {
                          router.push(`/exam-info/${lastItem.slug}`);
                          onClose();
                        }}
                        className="flex items-center gap-3 pl-9 pr-3 py-2.5 border-b border-[#f0ede6] hover:bg-amber-50 cursor-pointer"
                      >
                        <div className="relative w-7 h-7 rounded-md overflow-hidden border bg-[#f8f7f4]">
                          <Image
                            src={apiService.getPublicAsset(lastItem.imageIcon || "")}
                            alt={lastItem.label}
                            fill
                            className="object-contain p-0.5"
                          />
                        </div>

                        <span className="text-xs font-semibold text-amber-600">
                          {lastItem.label}
                        </span>
                      </div>
                    ))}
                </div>
              );
            })}
        </div>
      );
    });

  return (
    <div
      className={`
        fixed top-0 left-0 w-full h-screen bg-white z-50
        flex flex-col transform transition-transform duration-300 lg:hidden
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <div className="flex items-center justify-between h-14 px-5 border-b">
        <Logo />
        <button onClick={onClose}>
          <BiX className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3">
        {renderMenu(menu)}

        <div className="mt-5">
          <LoginStatus />
        </div>
      </div>
    </div>
  );
}