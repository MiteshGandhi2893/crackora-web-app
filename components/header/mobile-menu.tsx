/* eslint-disable react-hooks/set-state-in-effect */
// ✅ FIXED: MobileMenu updates instantly on logout (Dashboard removed)
// ✅ ADDED: Packages submenu (entrance -> package type -> package), mirrors Exams
// ✅ ADDED: Previous Papers submenu (entrance -> papers), mirrors Exams/Courses

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
import {
  packageService,
} from "@/services/courses.service";
import { MenuPackage, PackageCategory } from "@/interfaces/CoursePackage.interface";
import { paperSetService } from "@/services/previouspaperset.service";
import {
  Entrance as PaperEntrance,
  PaperExamForMenu,
  PaperExam,
} from "@/interfaces/papersets.interface";

// NOTE: duplicated from PackageMegaMenu.tsx — consider moving to a shared
// constants file (e.g. @/data/packageTypes.ts) so both stay in sync.
const PACKAGE_TYPE_LABELS: Record<PackageCategory, string> = {
  self_study: "Self Study",
  live_course: "Live Batches",
  mock_test: "Mock Tests",
  ebook: "E-books",
};
const PACKAGE_TYPE_ORDER: PackageCategory[] = Object.keys(
  PACKAGE_TYPE_LABELS,
) as PackageCategory[];


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

  const [packages, setPackages] = useState<MenuPackage[]>([]);
  const [packagesLoaded, setPackagesLoaded] = useState(false);

  const [paperSets, setPaperSets] = useState<Record<string, PaperExamForMenu>>(
    {},
  );
  const [paperEntrances, setPaperEntrances] = useState<PaperEntrance[]>([]);
  const [papersLoaded, setPapersLoaded] = useState(false);

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

  // Groups a flat package list into entrance -> [package-type-grouped leaves]
  const buildPackageEntrances = (pkgs: MenuPackage[]): Menu[] => {
    const entranceMap = new Map<
      string,
      { id: string; name: string; items: MenuPackage[] }
    >();

    pkgs.forEach((p) => {
      if (!entranceMap.has(p.entrance_id)) {
        entranceMap.set(p.entrance_id, {
          id: p.entrance_id,
          name: p.entrance_name,
          items: [],
        });
      }
      entranceMap.get(p.entrance_id)!.items.push(p);
    });

    return Array.from(entranceMap.values()).map((entrance) => {
      const byType = new Map<PackageCategory, MenuPackage[]>();
      entrance.items.forEach((p) => {
        if (!byType.has(p.category)) byType.set(p.category, []);
        byType.get(p.category)!.push(p);
      });

      const orderedTypes = PACKAGE_TYPE_ORDER.filter((t) => byType.has(t));

      const subMenu: Menu[] = [];
      orderedTypes.forEach((type) => {
        byType.get(type)!.forEach((pkg, idx) => {
          subMenu.push({
            id: pkg.id,
            label: pkg.course_name,
            slug: pkg.slug,
            imageIcon: pkg.image,
            // only the first item of each type group carries the divider label
            groupLabel: idx === 0 ? PACKAGE_TYPE_LABELS[type] : undefined,
          } as Menu);
        });
      });

      return {
        id: entrance.id,
        label: entrance.name,
        subMenu,
      } as Menu;
    });
  };

  // Groups paper sets into entrance -> [paper leaves], mirrors buildPackageEntrances
  const buildPaperEntrances = (
    sets: Record<string, PaperExamForMenu>,
    ents: PaperEntrance[],
  ): Menu[] =>
    ents.map((entrance) => ({
      id: entrance.id,
      label: entrance.name,
      subMenu: (sets[entrance.id]?.paperExams ?? []).map(
        (paperExam: PaperExam) =>
          ({
            id: paperExam.slug,
            label: paperExam.paper_title,
            slug: paperExam.slug,
            imageIcon: paperExam.exam_icon,
          }) as Menu,
      ),
    }) as Menu);

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

    const packagesMenu = cloned.find((item) => item.label === "Courses");
    if (packagesMenu && packages.length) {
      packagesMenu.subMenu = buildPackageEntrances(packages);
    }

    const papersMenu = cloned.find((item) => item.label === "Previous Papers");
    if (papersMenu && paperEntrances.length) {
      papersMenu.subMenu = buildPaperEntrances(paperSets, paperEntrances);
    }

    return cloned;
  }, [baseItems, entrances, packages, paperSets, paperEntrances]);

  const handleMenuClick = async (item: Menu) => {
    if (item.label === "Exams" && !examsLoaded) {
      const data = await getCachedExams();
      setEntrances(data ?? []);
      setExamsLoaded(true);
    }

    if (item.label === "Courses" && !packagesLoaded) {
      const packages = await packageService.getActiveForMenu();
      setPackages(packages);
      setPackagesLoaded(true);
    }

    if (item.label === "Previous Papers" && !papersLoaded) {
      const res = await paperSetService.getAll();
      setPaperSets(res.paperSets ?? {});
      setPaperEntrances(res.entrances ?? []);
      setPapersLoaded(true);
    }

    if (item.label === "Dashboard") {
      setPostAuthAction?.(() => () => router.push("/dashboard"));

      if (!user?.username) openAuth();
      else router.push("/dashboard");

      onClose();
      return;
    }

    const hasSubMenu =
      !!item.subMenu?.length ||
      item.label === "Exams" ||
      item.label === "Courses" ||
      item.label === "Previous Papers";

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

  // rootLabel tells Level3 which route/behavior to use ("Exams" vs "Packages" vs "Previous Papers")
  const renderMenu = (items: Menu[], rootLabel?: string) =>
    items.map((item) => {
      const hasSubMenu =
        !!item.subMenu?.length ||
        item.label === "Exams" ||
        item.label === "Courses" ||
        item.label === "Previous Papers";
      const isOpen = openLevel1 === item.id;
      const currentRoot = rootLabel ?? item.label; // set root at Level1

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
                      ${subOpen ? "text-cyan-950" : "text-[#05101f]/55 hover:text-amber-600"}`}
                    onClick={() =>
                      hasChild && setOpenLevel2(subOpen ? null : subItem.id)
                    }
                  >
                    <span className="text-[13px] font-medium">
                      {subItem.label}
                    </span>

                    {hasChild &&
                      (subOpen ? (
                        <BiCaretDown className="w-3.5 h-3.5 text-cyan-950" />
                      ) : (
                        <BiCaretRight className="w-3.5 h-3.5 text-[#05101f]/30" />
                      ))}
                  </div>

                  {/* Level 3 */}
                  {hasChild &&
                    subOpen &&
                    subItem.subMenu!.map((lastItem) => (
                      <div key={lastItem.id}>
                        {/* Non-clickable divider for package-type groups */}
                        {(lastItem as any).groupLabel && (
                          <div className="pl-9 pr-3 pt-3 pb-1 text-[10px] font-bold tracking-[0.14em] uppercase text-cyan-900/50">
                            {(lastItem as any).groupLabel}
                          </div>
                        )}

                        <div
                          onClick={() => {
                            if (currentRoot === "Courses") {
                              router.push(`/packages/${lastItem.slug}`);
                            } else if (currentRoot === "Previous Papers") {
                              router.push(`/previous-paperset/${lastItem.slug}`);
                            } else {
                              router.push(`/exam-info/${lastItem.slug}`);
                            }
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