/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_BASE_URL, apiService, unwrap } from "./api.service";
const BASE = "/paper-sets";

export const paperSetService = {
  // Every function below returns the raw payload directly and throws on
  // failure, EXCEPT getSolutionPageBlob — blob responses put the payload
  // in res.blob, not res.data, so unwrap()'s "throw if data is undefined"
  // check would misfire on a perfectly successful blob fetch. That one
  // stays on manual { success, blob } handling on purpose.

  getAll: async () => {
    const data = await unwrap<{ paperSets: any; entrances: any }>(
      apiService.get(`${BASE}/for-menu`),
    );
    return { paperSets: data.paperSets, entrances: data.entrances };
  },

  getSetBySlug: async (slug: string) => {
    const data = await unwrap<{ paperSet: any }>(
      apiService.get(`${BASE}/view/${slug}`),
    );
    return data.paperSet;
  },

  // ── Download ──
  // Server sets Content-Disposition on this route, so it's a direct URL
  // for an <a> tag rather than a JSON call.
  downloadUrl: (itemId: string) =>
    `${API_BASE_URL}${BASE}/items/${itemId}/download-file`,

  // ── Solution viewer ──
  getSolutionInfo: async (itemId: string) => {
    const data = await unwrap<{ totalPages: number }>(
      apiService.get(`${BASE}/items/${itemId}/solution/info`),
    );
    return data.totalPages || 0;
  },

  // NOT using unwrap — see note above. Blob payload lives in res.blob.
  getSolutionPageBlob: async (itemId: string, page: number) => {
    const res = await apiService.getBlob(
      `${BASE}/items/${itemId}/solution/page/${page}`,
    );
    if (!res.success || !res.blob) {
      throw new Error(res.error || "Failed to load solution page");
    }
    return URL.createObjectURL(res.blob) || "";
  },

  // Direct URL for an <img> tag — auth is checked fresh on every page load
  // via the request's own cookies, matching the backend's per-request gate.
  solutionPageUrl: (itemId: string, page: number) =>
    `${API_BASE_URL}${BASE}/items/${itemId}/solution/page/${page}`,

  saveToDashboard: (itemId: string) =>
    unwrap(apiService.post(`${BASE}/items/${itemId}/save`, {})),
};