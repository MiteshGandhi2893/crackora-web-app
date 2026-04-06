/* eslint-disable @typescript-eslint/no-explicit-any */
// export const API_BASE_URL = "https://api.crackora.com";
export const API_BASE_URL = "http://localhost:5000";

// ─── In-memory access token store ────────────────────────────────────────────
// Intentionally NOT persisted — cleared on every page refresh.
// Session is restored silently via the httpOnly refresh-token cookie.
let accessToken: string | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string) => { accessToken = token; },
  clear: () => { accessToken = null; },
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
interface ApiResponse<T> {
  success: boolean;
  data?: T | any;
  error?: string;
  status?: number;
  statusText?: string;
}

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: HeadersInit;
  withAuth?: boolean;   // default true
  _isRetry?: boolean;   // internal — prevents infinite refresh loop
}

// ─── Core request ─────────────────────────────────────────────────────────────
const apiRequest = async <T>(
  endpoint: string,
  { method, body, headers, withAuth = true, _isRetry = false }: RequestOptions,
): Promise<ApiResponse<T>> => {
  const token = tokenStore.get();

  const authHeaders: HeadersInit =
    withAuth && token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...headers,
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });

    // ── Parse body once ──────────────────────────────────────────────────────
    const text = await response.text();
    let responseData: any = null;
    try {
      responseData = text ? JSON.parse(text) : null;
    } catch {
      console.error("Non-JSON response from API:", text);
    }

    // ── 401 handling ─────────────────────────────────────────────────────────
    if (response.status === 401 && withAuth) {
      const msg: string = responseData?.message ?? "";

      // Trigger silent refresh for expired OR missing access token
      const shouldRefresh =
        msg === "ACCESS_TOKEN_EXPIRED" || msg === "No access token";

      if (shouldRefresh && !_isRetry) {
        try {
          await refreshAccessToken();
          // Retry once with the new token
          return apiRequest<T>(endpoint, {
            method, body, headers, withAuth, _isRetry: true,
          });
        } catch {
          tokenStore.clear();
          // Fall through — return 401 below
        }
      }

      // Dispatch global event for hard 401s (invalid token, deactivated, etc.)
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
};