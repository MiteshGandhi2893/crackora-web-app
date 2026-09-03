import { MenuPackage } from "@/interfaces/CoursePackage.interface";
import { packageService } from "./courses.service";

let cache: MenuPackage[] | null = null;
let inflight: Promise<MenuPackage[]> | null = null;

export async function getCachedPackages(): Promise<MenuPackage[]> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = packageService
    .getActiveTopPackages()
    .then((data) => {
      cache = data;
      return data;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}