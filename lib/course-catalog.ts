// src/lib/course-catalog.ts
// No "use client" here on purpose: imported by the server component (page.tsx)
// and by the client component (CourseCatalog.tsx).

import {
  MenuPackage,
  PackageCategory,
} from "@/interfaces/CoursePackage.interface";

export const PACKAGE_TYPE_LABELS: Record<PackageCategory, string> = {
  self_study: "Self Study",
  live_course: "Live Batches",
  mock_test: "Mock Tests",
  ebook: "E-books",
};

export const PACKAGE_TYPE_ORDER: PackageCategory[] = Object.keys(
  PACKAGE_TYPE_LABELS,
) as PackageCategory[];

export interface CategoryGroup {
  category: PackageCategory;
  groupLabel: string;
  items: MenuPackage[];
}

export interface EntranceGroup {
  id: string;
  label: string;
  categories: CategoryGroup[];
}

// Groups packages by entrance exam, then by category.
// Also dedupes by pkg.id (the API can return the same package more than once,
// e.g. via a join against multiple exam rows), which avoids duplicate React keys.
export const buildPackageEntrances = (pkgs: MenuPackage[]): EntranceGroup[] => {
  const seenIds = new Set<string>();
  const deduped = pkgs.filter((p) => {
    if (seenIds.has(p.id)) return false;
    seenIds.add(p.id);
    return true;
  });

  const entranceMap = new Map<
    string,
    { id: string; name: string; items: MenuPackage[] }
  >();

  deduped.forEach((p) => {
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

    const categories: CategoryGroup[] = PACKAGE_TYPE_ORDER.filter((t) =>
      byType.has(t),
    ).map((type) => ({
      category: type,
      groupLabel: PACKAGE_TYPE_LABELS[type],
      items: byType.get(type)!,
    }));

    return {
      id: entrance.id,
      label: entrance.name,
      categories,
    };
  });
};

// "MCA, MBA and Law"  /  "MCA, MBA, Law and more" (when capped by `max`).
// Used for the H1, <title>, meta description, so all three always agree
// with whatever exams actually exist in the database.
export const formatList = (items: string[], max = items.length): string => {
  const shown = items.slice(0, max);
  const hasMore = items.length > shown.length;

  if (shown.length === 0) return "";
  if (shown.length === 1) return hasMore ? `${shown[0]} and more` : shown[0];
  if (hasMore) return `${shown.join(", ")} and more`;

  return `${shown.slice(0, -1).join(", ")} and ${shown[shown.length - 1]}`;
};