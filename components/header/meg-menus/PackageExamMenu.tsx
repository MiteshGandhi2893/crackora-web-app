"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api.service";
import {
  packageService,
  type MenuPackage,
} from "@/services/courses.service";
import { PackageCategory } from "@/interfaces/CoursePackage.interface";

const PACKAGE_TYPE_LABELS: Record<PackageCategory, string> = {
  self_study: "Self Study Courses",
  live_course: "Live Batches",
  mock_test: "Mock Tests",
  ebook: "E-books",
};

// Controls section order within each entrance — courses first, ebooks last.
const PACKAGE_TYPE_ORDER: PackageCategory[] = ["self_study", "live_course", "mock_test", "ebook"];

export function PackageMegaMenu({ onClose }: { onClose?: () => void }) {
  const [packages, setPackages] = useState<MenuPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEntranceId, setActiveEntranceId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    packageService
      .getActiveForMenu()
      .then((res) => {
        const data = res.packages || [];
        setPackages(data);
        if (data.length > 0) setActiveEntranceId(data[0].entrance_id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Bifurcate: distinct entrances present among active packages ──
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

  // ── For the selected entrance, sub-group by package_type ──
  const groupedForActiveEntrance = useMemo(() => {
    const scoped = packages.filter((p) => p.entrance_id === activeEntranceId);
    const filtered = search
      ? scoped.filter((p) =>
          (p.course_name || "").toLowerCase().includes(search.toLowerCase()),
        )
      : scoped;

    const groups = new Map<PackageCategory, MenuPackage[]>();
    filtered.forEach((p) => {
      if (!groups.has(p.category)) groups.set(p.category, []);
      groups.get(p.category)!.push(p);
    });

    return PACKAGE_TYPE_ORDER.filter((t) => groups.has(t)).map((t) => ({
      type: t,
      label: PACKAGE_TYPE_LABELS[t],
      items: groups.get(t)!,
    }));
  }, [packages, activeEntranceId, search]);

  const totalActive = packages.length;

  const handlePackageClick = (pkg: MenuPackage) => {
    // Assumption: package detail route is /course/[slug]. Adjust to match
    // your actual route (mirrors getPackageBySlug: /course-packages/view/:slug).
    router.push(`/packages/${pkg.slug}`);
    onClose?.();
  };

  return (
    <div className="w-full overflow-hidden bg-[#f8f7f4]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#f0ede6]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-amber-700">
            Course Packages
          </span>
          <span className="text-[11px] bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5 font-semibold">
            {totalActive} Live
          </span>
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

      {/* Body: sidebar + grouped grid */}
      <div className="flex flex-col sm:flex-row max-h-[70vh]">
        {/* Sidebar: entrances */}
        <div className="sm:w-56 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-[#f0ede6] bg-[#faf9f7]">
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

        {/* Package groups, subdivided by type */}
        <div className="flex-1 p-4 overflow-y-auto">
          {loading && (
            <p className="text-center text-sm text-[#05101f]/40 py-8">
              Loading packages...
            </p>
          )}
          {!loading && groupedForActiveEntrance.length === 0 && (
            <p className="text-center text-sm text-[#05101f]/40 py-8">
              No packages found{search ? ` for ${search}` : ""}
            </p>
          )}

          {!loading &&
            groupedForActiveEntrance.map((group) => (
              <div key={group.type} className="mb-6 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-[11px] font-bold tracking-[0.14em] uppercase text-cyan-900/70">
                    {group.label}
                  </h4>
                  <span className="text-[10px] bg-cyan-900/5 text-cyan-900/60 rounded-full px-1.5 py-0.5 font-semibold">
                    {group.items.length}
                  </span>
                  <div className="flex-1 h-px bg-[#f0ede6]" />
                </div>

                <div className="flex gap-5">
                  {group.items.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => handlePackageClick(pkg)}
                      className="cursor-pointer w-60  group flex flex-col shadow items-center gap-3 bg-white border border-[#e8e4dc] hover:border-amber-300 rounded-xl p-3 text-left transition-all duration-200 hover:shadow-[0_4px_16px_rgba(5,16,31,0.08)] hover:-translate-y-0.5"
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
                          <p className="text-[13px] font-semibold text-cyan-900 group-hover:text-amber-600 transition-colors  text-center">
                            {pkg.course_name}
                          </p>
                        </div>
                      </div>

                      {/* <div className="w-full flex items-center justify-center gap-2">
                        {Number(pkg.discounted_price) > 0 ? (
                          <>
                            <span className="text-[11px] text-[#05101f]/40 line-through">
                              ₹{pkg.price}
                            </span>
                            <span className="text-[13px] font-semibold text-cyan-700">
                              ₹{pkg.discounted_price}
                            </span>
                          </>
                        ) : (
                          <span className="text-[13px] font-semibold text-amber-700">
                            ₹{pkg.price}
                          </span>
                        )}
                      </div> */}

                      <span className="text-xs rounded text-amber-50 bg-amber-600 px-4 py-1">Enroll Now</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}