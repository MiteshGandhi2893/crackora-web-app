// src/services/entranceCache.ts
import { Entrance } from "@/interfaces/entrance-interface";
import { entranceService } from "./entrance.service";

let cache: Entrance[] | null = null;
let inflight: Promise<Entrance[]> | null = null;

export async function getCachedExams(): Promise<Entrance[]> {
  if (cache) return cache;
  if (inflight) return inflight; // two calls at once → share the same promise
  inflight = entranceService.getMCAEntranceExams().then((data) => {
    cache = data;
    inflight = null;
    return data;
  });
  return inflight;
}