"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api.service";
import { packageService } from "@/services/courses.service";
import { MenuPackage, PackageCategory } from "@/interfaces/CoursePackage.interface";

const PACKAGE_TYPE_LABELS: Record<PackageCategory, string> = {
  self_study: "Self Study Courses",
  live_course: "Live Batches",
  mock_test: "Mock Tests",
  ebook: "E-books",
};

// Controls tab order within each entrance — courses first, ebooks last.
const PACKAGE_TYPE_ORDER: PackageCategory[] = ["self_study", "live_course", "mock_test", "ebook"];

export function PackageMegaMenu({ onClose }: { onClose?: () => void }) {
  const [packages, setPackages] = useState<MenuPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEntranceId, setActiveEntranceId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<PackageCategory | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    packageService
      .getActiveForMenu()
      .then((packages) => {
        setPackages(packages);
        if (packages.length > 0) setActiveEntranceId(packages[0].entrance_id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Distinct entrances present among active packages ──
  const entrances = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    packages.forEach((p) => {
      if (!map.has(p.entrance_id)) {
        map.set(p.entrance_id, { id: p.entrance_id, name: p.entrance_name, count: 0 });
      }
      map.get(p.entrance_id)!.count += 1;
    });
    return Array.from(map.values());
  }, [packages]);

  // ── Category tabs — only categories that actually have packages for this entrance ──
  const categoryTabs = useMemo(() => {
    const scoped = packages.filter((p) => p.entrance_id === activeEntranceId);
    const counts = new Map<PackageCategory, number>();
    scoped.forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));
    return PACKAGE_TYPE_ORDER.filter((t) => counts.has(t)).map((t) => ({
      type: t,
      label: PACKAGE_TYPE_LABELS[t],
      count: counts.get(t)!,
    }));
  }, [packages, activeEntranceId]);

  // Keep activeCategory valid whenever the entrance (and its tabs) changes
  useEffect(() => {
    if (categoryTabs.length === 0) {
      setActiveCategory(null);
      return;
    }
    if (!activeCategory || !categoryTabs.some((c) => c.type === activeCategory)) {
      setActiveCategory(categoryTabs[0].type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryTabs]);

  // ── Items for the selected entrance + category (+ search) ──
  const items = useMemo(() => {
    const scoped = packages.filter(
      (p) => p.entrance_id === activeEntranceId && p.category === activeCategory,
    );
    return search
      ? scoped.filter((p) => (p.course_name || "").toLowerCase().includes(search.toLowerCase()))
      : scoped;
  }, [packages, activeEntranceId, activeCategory, search]);

  // const totalActive = packages.length;

  const handlePackageClick = (pkg: MenuPackage) => {
    router.push(`/packages/${pkg.slug}`);
    onClose?.();
  };

  return (
    <div className="w-full overflow-hidden bg-[#f8f7f4]">
      {/* Header */}
      <div className="flex items-center bg-cyan-950 justify-between px-6 py-3 border-b border-[#f0ede6]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-cyan-50">
            Course Packages
          </span>
          {/* <span className="text-[11px] bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5 font-semibold">
            {totalActive} 
          </span> */}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search package..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[12px] pl-7 pr-3 py-1.5 rounded-lg border border-[#e8e4dc] bg-[#faf9f7] focus:outline-none focus:border-amber-300 w-44 text-[#05101f]"
            />
            <svg
              className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#05101f]/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white hover:bg-[#f0ede6] border border-[#e8e4dc] flex items-center justify-center cursor-pointer text-amber-700 hover:text-red-800 transition-all text-lg"
          >
            ×
          </button>
        </div>
      </div>

      {/* Body: sidebar + tabbed grid */}
      <div className="flex flex-col sm:flex-row max-h-[70vh] my-5">
        {/* Sidebar: entrances */}
        <div className="sm:w-56 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-gray-300 bg-[#faf9f7]">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:max-h-[70vh] p-2 gap-1">
            {entrances.map((entrance) => {
              const isSelected = entrance.id === activeEntranceId;
              return (
                <button
                  key={entrance.id}
                  onClick={() => {
                    setActiveEntranceId(entrance.id);
                    setSearch("");
                  }}
                  className={`flex-shrink-0 sm:flex-shrink flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer whitespace-nowrap sm:whitespace-normal ${
                    isSelected
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-[#05101f]/70 hover:bg-[#f0ede6]"
                  }`}
                >
                  <span className="text-[13px] font-semibold">{entrance.name}</span>
                  <span
                    className={`text-[10px] rounded-full px-1.5 py-0.5 font-semibold flex-shrink-0 ${
                      isSelected ? "bg-white/20 text-white" : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {entrance.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category tabs + package grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {categoryTabs.length > 0 && (
            <div className="flex items-center gap-1 px-4 pt-3 border-b border-gray-300 overflow-x-auto">
              {categoryTabs.map((tab) => {
                const isActive = tab.type === activeCategory;
                return (
                  <button
                    key={tab.type}
                    onClick={() => setActiveCategory(tab.type)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold rounded-t-lg border-b-2 transition-all cursor-pointer ${
                      isActive
                        ? "border-amber-600 text-cyan-900"
                        : "border-transparent text-[#05101f]/45 hover:text-cyan-900/70"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`text-[10px] rounded-full px-1.5 py-0.5 font-semibold ${
                        isActive ? "bg-amber-50 text-amber-600" : "bg-[#f0ede6] text-[#05101f]/40"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex-1 p-4 overflow-y-auto">
            {loading && (
              <p className="text-center text-sm text-[#05101f]/40 py-8">Loading packages...</p>
            )}
            {!loading && categoryTabs.length === 0 && (
              <p className="text-center text-sm text-[#05101f]/40 py-8">
                No packages found for this entrance
              </p>
            )}
            {!loading && categoryTabs.length > 0 && items.length === 0 && (
              <p className="text-center text-sm text-[#05101f]/40 py-8">
                No packages found{search ? ` for ${search}` : ""}
              </p>
            )}

            {!loading && items.length > 0 && (
              <div className="flex flex-wrap gap-5">
                {items.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => handlePackageClick(pkg)}
                    className="cursor-pointer w-60 group flex flex-col shadow items-center gap-3 bg-white border border-[#e8e4dc] hover:border-amber-300 rounded-xl p-3 text-left transition-all duration-200 hover:shadow-[0_4px_16px_rgba(5,16,31,0.08)] hover:-translate-y-0.5"
                  >
                    <div className="flex flex-col justify-center items-center gap-3 w-full">
                      <div className="relative w-full h-20 rounded-lg overflow-hidden border border-[#e8e4dc] bg-[#f8f7f4] flex-shrink-0">
                        <Image
                          src={`${API_BASE_URL}/public/${pkg.image || ""}`}
                          alt={pkg.title || pkg.course_name || ""}
                          fill
                          unoptimized
                          className="object-contain p-1.5"
                        />
                      </div>
                      <div className="flex-1 w-full text-wrap break-all">
                        <p className="text-[13px] font-semibold text-cyan-900 group-hover:text-amber-600 transition-colors text-center">
                          {pkg.course_name}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs rounded text-amber-50 bg-amber-600 px-4 py-1">View Details</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}