import { Entrance } from "@/interfaces/entrance-interface";
import { entranceService } from "./entrance.service";

let cache: Entrance[] | null = null;
let inflight: Promise<Entrance[]> | null = null;

export async function getCachedExams(): Promise<Entrance[]> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = entranceService
    .getMCAEntranceExams()
    .then((data) => {
      cache = data;
      return data;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function clearEntranceCache() {
  cache = null;
}