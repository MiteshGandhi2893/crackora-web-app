"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { coursesService } from "@/services/courses.service";
import { CoursePackage } from "@/interfaces/CoursePackage.interface";

type TopPackageType = {
  topPackages: CoursePackage[];
  loading: boolean;
  error?: string;
};

const TopPackageContext = createContext<TopPackageType | null>(null);

export function TopPackagesProvider({ children }: { children: React.ReactNode }) {
  const [topPackages, setTopPackages] = useState<CoursePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    coursesService
      .getCoursePackages()
      .then(setTopPackages)
      .catch((err) => {
        console.error(err);
        setError("Failed to load packages");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <TopPackageContext.Provider value={{ topPackages, loading, error }}>
      {children}
    </TopPackageContext.Provider>
  );
}

export function useTopPackages() {
  const ctx = useContext(TopPackageContext);
  if (!ctx) throw new Error("usePackages must be used inside TopPackagesProvider");
  return ctx;
}
