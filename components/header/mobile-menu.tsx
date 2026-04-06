/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { menu } from "@/data/Menu";
import { useMemo, useState, useEffect } from "react";
import { BiX, BiCaretRight, BiCaretDown, BiUser, BiGrid } from "react-icons/bi";
import { Menu } from "@/interfaces/menu.interface";
import { useExams } from "@/providers/ExamsProvider";
import { apiService } from "@/services/api.service";
import { Logo } from "./Logo";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { LoginStatus } from "../app-buttons/login-button";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const data = useExams();
  const router = useRouter();
  const { user, openAuth, setPostAuthAction } = useAuth();
  const [openLevel1, setOpenLevel1] = useState<string | null>(null);
  const [openLevel2, setOpenLevel2] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenLevel1(null);
      setOpenLevel2(null);
    }
  }, [open]);

  const _menu: Menu[] = useMemo(() => {
    const entrances = data.entrances;
    const clonedMenu: Menu[] = JSON.parse(JSON.stringify(menu));
    const examsMenu = clonedMenu.find((item) => item.label === "Exams");
    if (examsMenu && entrances?.length) {
      examsMenu.subMenu = entrances.map((entrance: any) => ({
        label: entrance.title,
        id: entrance.id,
        isActive: false,
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
    return clonedMenu;
  }, [data.entrances]);

  // ── Unified click handler ────────────────────────────────────────────────
  const handleMenuClick = (item: Menu) => {
    const hasSubMenu = !!item.subMenu?.length;

    // Dashboard — auth gate then redirect
    if (item.label === "Dashboard") {
      setPostAuthAction?.(() => () => {
        router.push("/dashboard");
      });
      if (!user?.username) {
        openAuth();
      } else {
        router.push("/dashboard");
      }
      onClose();
      return;
    }

    // Items with submenus (including Exams on mobile) — toggle accordion
    if (hasSubMenu) {
      setOpenLevel1((prev) => (prev === item.id ? null : item.id));
      setOpenLevel2(null);
      return;
    }

    // Plain link items — close drawer
    onClose();
  };

  const renderMenu = (items: Menu[]) =>
    items.map((item) => {
      const hasSubMenu = !!item.subMenu?.length;
      const isOpen = openLevel1 === item.id;

      return (
        <div key={item.id}>
          {/* ── Level 1 ── */}
          <div
            className={`flex justify-between items-center py-3 px-1 cursor-pointer border-b border-[#f0ede6] transition-colors duration-150
              ${isOpen ? "text-amber-600" : "text-cyan-950/80 hover:text-amber-600"}`}
            onClick={() => handleMenuClick(item)}
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              {item.icon && (
                <item.icon className="w-4 h-4 text-amber-700 opacity-80" />
              )}
              {item.label === "Dashboard" ? (
                <span>{item.label}</span> // NOT a Link
              ) : item.href && item.href !== "#" ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </span>
            {hasSubMenu &&
              (isOpen ? (
                <BiCaretDown className="w-4 h-4 text-amber-500 flex-shrink-0" />
              ) : (
                <BiCaretRight className="w-4 h-4 text-[#05101f]/30 flex-shrink-0" />
              ))}
          </div>

          {/* ── Level 2 ── */}
          {hasSubMenu &&
            isOpen &&
            item.subMenu!.map((subItem) => {
              const hasChild = !!subItem.subMenu?.length;
              const subOpen = openLevel2 === subItem.id;

              return (
                <div key={subItem.id}>
                  <div
                    className={`flex items-center justify-between pl-5 pr-1 py-2.5 cursor-pointer border-b border-[#f0ede6] transition-colors duration-150
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
                        <BiCaretDown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      ) : (
                        <BiCaretRight className="w-3.5 h-3.5 text-[#05101f]/30 flex-shrink-0" />
                      ))}
                  </div>

                  {/* ── Level 3 (leaf) ── */}
                  {hasChild &&
                    subOpen &&
                    subItem.subMenu!.map((lastItem) => (
                      <div
                        key={lastItem.id}
                        role="button"
                        onClick={() => {
                          router.push(`/exam-info/${lastItem.slug}`);
                          onClose();
                        }}
                        className="flex items-center gap-3 pl-9 pr-3 py-2.5 border-b border-[#f0ede6] hover:bg-amber-50 transition-colors duration-150 group cursor-pointer"
                      >
                        <div className="relative w-7 h-7 rounded-md overflow-hidden border border-[#e8e4dc] bg-[#f8f7f4] flex-shrink-0">
                          <Image
                            src={apiService.getPublicAsset(
                              lastItem.imageIcon || "",
                            )}
                            alt={lastItem.label}
                            fill
                            className="object-contain p-0.5"
                          />
                        </div>
                        <span className="text-xs font-semibold text-amber-600 group-hover:text-amber-700">
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
        flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between h-14 px-5 bg-white border-b border-[#f0ede6] shadow-sm">
        <Logo />
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-[#05101f] hover:bg-rose-600 flex items-center justify-center transition-colors duration-200"
        >
          <BiX className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-3 bg-white">
        {renderMenu(_menu)}
        <div className="mt-5">
          <LoginStatus />
        </div>
      </div>

      {/* Footer — auth CTA if not logged in */}
    </div>
  );
}
