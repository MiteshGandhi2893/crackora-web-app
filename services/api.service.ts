/* eslint-disable @typescript-eslint/no-explicit-any */
export const API_BASE_URL = "https://api.crackora.com";
// export const API_BASE_URL = "http://localhost:5000";

// ─── In-memory access token store ────────────────────────────────────────────
// Intentionally NOT persisted — cleared on every page refresh.
// Session is restored silently via the httpOnly refresh-token cookie.
let accessToken: string | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
};

// ─── Deduplicated silent refresh ──────────────────────────────────────────────
// Multiple in-flight requests that all 401 will share one refresh call.
let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/user/refresh`, {
      method: "POST",
      credentials: "include", // sends the httpOnly refreshToken cookie
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Refresh failed");
        tokenStore.set(data.accessToken);
        return data.accessToken as string;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// ─── Response envelope (kept identical to original) ──────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T | any;
  blob?: Blob;
  error?: string;
  status?: number;
  statusText?: string;
}

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: HeadersInit;
  withAuth?: boolean; // default true
  responseType?: "json" | "blob"; // default "json"
  _isRetry?: boolean; // internal — prevents infinite refresh loop
}

// ─── Core request ─────────────────────────────────────────────────────────────
const apiRequest = async <T>(
  endpoint: string,
  {
    method,
    body,
    headers,
    withAuth = true,
    responseType = "json",
    _isRetry = false,
  }: RequestOptions,
): Promise<ApiResponse<T>> => {
  const token = tokenStore.get();

  const authHeaders: HeadersInit =
    withAuth && token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        ...(responseType === "json"
          ? { "Content-Type": "application/json" }
          : {}),
        ...authHeaders,
        ...headers,
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });

    // ── 401 handling ─────────────────────────────────────────────────────────
    // Read via clone().json() here regardless of responseType, since the
    // server's error body is JSON even on a route that normally returns a
    // blob — and .clone() lets the real body still be consumed below.
    if (response.status === 401 && withAuth) {
      let responseData: any = null;
      try {
        responseData = await response.clone().json();
      } catch {
        // non-JSON 401 body — leave responseData null
      }
      const msg: string = responseData?.message ?? "";

      const shouldRefresh =
        msg === "ACCESS_TOKEN_EXPIRED" || msg === "No access token";

      if (shouldRefresh && !_isRetry) {
        try {
          await refreshAccessToken();
          return apiRequest<T>(endpoint, {
            method,
            body,
            headers,
            withAuth,
            responseType,
            _isRetry: true,
          });
        } catch {
          tokenStore.clear();
        }
      }

      if (typeof window !== "undefined" && msg.includes("Unauthorized")) {
        window.dispatchEvent(
          new CustomEvent("unauthorized", {
            detail: responseData?.type || msg,
          }),
        );
      }

      return {
        success: false,
        error: responseData?.message || "Unauthorized",
        status: response.status,
      };
    }

    // ── Blob responses ──────────────────────────────────────────────────────
    if (responseType === "blob") {
      if (!response.ok) {
        return {
          success: false,
          error: `HTTP Error ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }
      const blob = await response.blob();
      return { success: true, blob, status: response.status };
    }

    // ── Parse body once (json path) ─────────────────────────────────────────
    const text = await response.text();
    let responseData: any = null;
    try {
      responseData = text ? JSON.parse(text) : null;
    } catch {
      console.error("Non-JSON response from API:", text);
    }

    // ── Non-OK responses ─────────────────────────────────────────────────────
    if (!response.ok) {
      return {
        success: false,
        error:
          responseData?.message ||
          `HTTP Error ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }

    return { success: true, data: responseData, status: response.status };
  } catch (error) {
    console.error("Network Error:", error);
    return {
      success: false,
      error: "Network error. Please try again later.",
    };
  }
};

// ─── Unwrap helper ──────────────────────────────────────────────────────────────
// Same idea as the admin app: turns the { success, data, error } envelope
// back into a plain throw-on-failure call, so service files can return the
// raw payload directly. Do this ONCE per service function — components
// never see ApiResponse, they just await and get the data or a thrown Error.
export async function unwrap<T>(promise: Promise<ApiResponse<T>>): Promise<T> {
  const res = await promise;
  if (!res.success || res.data === undefined) {
    throw new Error(res.error || "Request failed");
  }
  return res.data;
}

// ─── Public API surface (identical signatures to original) ───────────────────
export const apiService = {
  getPublicAsset: (path: string) => `${API_BASE_URL}/public${path}`,

  get: <T>(endpoint: string, headers?: HeadersInit) =>
    apiRequest<T>(endpoint, { method: "GET", headers }),

  post: <T>(endpoint: string, body: any, headers?: HeadersInit) =>
    apiRequest<T>(endpoint, { method: "POST", body, headers }),

  patch: <T>(endpoint: string, body: any, headers?: HeadersInit) =>
    apiRequest<T>(endpoint, { method: "PATCH", body, headers }),

  put: <T>(endpoint: string, body: any, headers?: HeadersInit) =>
    apiRequest<T>(endpoint, { method: "PUT", body, headers }),

  delete: <T>(endpoint: string, headers?: HeadersInit) =>
    apiRequest<T>(endpoint, { method: "DELETE", headers }),

  getBlob: (endpoint: string, headers?: HeadersInit) =>
    apiRequest<never>(endpoint, {
      method: "GET",
      headers,
      responseType: "blob",
    }),
};