import { CoursePackage } from "@/interfaces/CoursePackage.interface";
import { packageService } from "./courses.service";

let cache: CoursePackage[] | null = null;
let inflight: Promise<CoursePackage[]> | null = null;

export async function getCachedPackages(): Promise<CoursePackage[]> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = packageService.getPackages().then((data) => {
    cache = data;
    inflight = null;
    return data;
  });
  return inflight;
}