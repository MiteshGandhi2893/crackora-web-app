/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = "https://api.crackora.com";
// const API_BASE_URL = "http://localhost:5000";


interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: HeadersInit;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const apiRequest = async <T>(
  endpoint: string,
  { method, body, headers }: RequestOptions
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });

    // Always read text first
    const text = await response.text();

    let responseData: any = null;
    try {
      responseData = text ? JSON.parse(text) : null;
    } catch {
      // 👇 This is where HTML responses land
      console.error("Non-JSON response from API:", text);
    }

    if (!response.ok) {
      return {
        success: false,
        error:
          responseData?.message ||
          `HTTP Error ${response.status}: ${response.statusText}`,
      };
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Network Error:", error);
    return { success: false, error: "Network error. Please try again later." };
  }
};


// Exported CRUD operations
export const apiService = {
  getPublicAsset: (path: string) => {
      return `${API_BASE_URL}/public${path}`;
  },
  get: async <T>(endpoint: string, headers?: HeadersInit) =>
    await apiRequest<T>(endpoint, { method: "GET", headers }),

  post: async <T>(endpoint: string, body: any, headers?: HeadersInit) =>
    await apiRequest<T>(endpoint, { method: "POST", body, headers }),

  put: async <T>(endpoint: string, body: any, headers?: HeadersInit) =>
    await apiRequest<T>(endpoint, { method: "PUT", body, headers }),

  delete: async <T>(endpoint: string, headers?: HeadersInit) =>
    await apiRequest<T>(endpoint, { method: "DELETE", headers }),
};
