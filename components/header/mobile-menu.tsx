/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { menu } from "@/data/Menu";
import { useMemo, useState, useEffect } from "react";
import { BiX, BiCaretRight, BiCaretDown } from "react-icons/bi";
import { Menu } from "@/interfaces/menu.interface";
import { useExams } from "@/providers/ExamsProvider";
import { apiService } from "@/services/api.service";
import { Logo } from "./Logo";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const data = useExams();

  // Handle click: set cookie and navigate
  // ✅ Separate accordion state per level
  const [openLevel1, setOpenLevel1] = useState<string | null>(null);
  const [openLevel2, setOpenLevel2] = useState<string | null>(null);

  // reset when menu closes
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
          slug: exam.slug
        })),
      }));
    }

    return clonedMenu;
  }, [data.entrances]);

  const renderMenu = (items: Menu[]) =>
    items.map((item) => {
      const hasSubMenu = item.subMenu?.length;
      const isOpen = openLevel1 === item.id;

      return (
        <div key={item.id}>
          {/* LEVEL 1 */}
          <div
            className="border-b flex justify-between border-b-gray-100 py-2 cursor-pointer"
            onClick={() => {
              if (hasSubMenu) {
                setOpenLevel1(isOpen ? null : item.id);
                setOpenLevel2(null); // reset level 2 when switching level 1
              }
            }}
          >
            <span className="text-sm">{item.label}</span>
            {hasSubMenu && (isOpen ? <BiCaretDown /> : <BiCaretRight />)}
          </div>

          {/* LEVEL 2 */}
          {hasSubMenu &&
            isOpen &&
            item.subMenu!.map((subItem) => {
              const hasChild = subItem.subMenu?.length;
              const subOpen = openLevel2 === subItem.id;

              return (
                <div key={subItem.id}>
                  <div
                    className="border-b px-5 flex items-center justify-between border-b-gray-100 py-2 cursor-pointer"
                    onClick={() => {
                      if (hasChild) {
                        setOpenLevel2(subOpen ? null : subItem.id);
                      }
                    }}
                  >
                    <span className="text-[13.5px] text-cyan-700 ">
                      {subItem.label}
                    </span>
                    {hasChild && (subOpen ? <BiCaretDown /> : <BiCaretRight />)}
                  </div>

                  {/* LEVEL 3 (LEAF) */}
                  {hasChild &&
                    subOpen &&
                    subItem.subMenu!.map((lastItem) => (
                      <Link
                        key={lastItem.id}
                        href={`/exam-info/${lastItem.slug}`}
                        onClick={onClose}
                      >
                        <div className="border-b px-8 flex justify-between border-b-gray-100 py-1 cursor-pointer">
                          <span className="text-xs text-cyan-700 flex items-center gap-2">
                            <span className="relative w-8 h-8 ">
                              <Image
                                src={apiService.getPublicAsset(
                                  lastItem.imageIcon || "",
                                )}
                                alt=""
                                fill
                              />
                            </span>
                            <span className="text-amber-700 flex flex-col">
                              <span className="text-xs">{lastItem.label}</span>
                            </span>
                          </span>
                        </div>
                      </Link>
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
        flex flex-col transform transition-transform duration-300
        ease-in-out lg:hidden
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* HEADER */}
      <div className="w-full flex items-center h-14 font-semibold justify-between px-5 py-1 border-b border-b-gray-100 shadow">
        <Logo/>
        <button
          className="border bg-red-700 rounded-full text-white cursor-pointer"
          onClick={onClose}
        >
          <BiX className="w-6 h-6" />
        </button>
      </div>

      {/* BODY */}
      <div className="p-5 text-cyan-900 max-h-[80vh] overflow-y-auto">
        {renderMenu(_menu)}
      </div>
    </div>
  );
}
