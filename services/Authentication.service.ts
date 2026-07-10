/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/providers/AuthProvider";
import {
  SignInPayload,
  SignUpPayload,
} from "../interfaces/authentication-interface";
import { apiService, tokenStore, refreshAccessToken } from "./api.service";

export const authService = {
  // ── Auth ────────────────────────────────────────────────────────────────────

  signIn: async (signInPayload: SignInPayload) => {
    const response = await apiService.post("/user/signIn", signInPayload);

    if (!response.success) {
      return { success: false, error: response.error, status: response.status };
    }

    // Store access token in memory so subsequent requests send Bearer header
    if (response.data?.accessToken) {
      tokenStore.set(response.data.accessToken);
    }

    return { success: true, user: response.data?.user ?? response.data, status: response.status };
  },

  signUp: async (signUpPayload: SignUpPayload) => {
    const response = await apiService.post("/user/signUp", signUpPayload);

    if (!response.success) {
      return { success: false, error: response.error, status: response.status };
    }

    if (response.data?.accessToken) {
      tokenStore.set(response.data.accessToken);
    }

    return { success: true, user: response.data?.user ?? response.data, status: response.status };
  },

  signOut: async () => {
    const response = await apiService.post("/user/signout", {});
    tokenStore.clear();
    return response;
  },

  // On page load: try in-memory token first, then silent refresh via cookie.
  signInStatus: async () => {
    // If we already have a token in memory, hit the status endpoint directly.
    // apiRequest will handle an ACCESS_TOKEN_EXPIRED 401 automatically.
    if (tokenStore.get()) {
      const response = await apiService.get<User>("/user/signin-status");

      if (response.success) {
        return { success: true, user: response.data, status: response.status };
      }

      // Hard 401 (not just expired) — give up
      if (response.status === 401) {
        return { success: false, error: response.error, status: response.status };
      }
    }

    // No token in memory (page was refreshed). Attempt silent refresh first.
    try {
      await refreshAccessToken();
    } catch {
      // No valid refresh token — user must log in
      return { success: false, error: "No session", status: 401 };
    }

    // Now retry the status endpoint with the fresh access token
    const response = await apiService.get<User>("/user/signin-status");

    if (!response.success) {
      return { success: false, error: response.error, status: response.status };
    }

    return { success: true, user: response.data, status: response.status };
  },

  // ── Email OTP (signup verification) ────────────────────────────────────────
  sendOtp: async (email: string) => {
    return await apiService.post("/user/send-otp", { email });
  },

  verifyOtp: async (email: string, otp: string) => {
    return await apiService.post("/user/verify-otp", { email, otp });
  },

  // ── Profile (authenticated) ─────────────────────────────────────────────────
  updateProfile: async (payload: { fullname: string }) => {
    const response = await apiService.put("/user/update-profile", payload);

    if (!response.success) {
      return { success: false, error: response.error, status: response.status };
    }

    return { success: true, user: response.data as User, status: response.status };
  },

  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await apiService.put("/user/change-password", payload);

    if (!response.success) {
      return { success: false, error: response.error, status: response.status };
    }

    return { success: true, status: response.status };
  },

  // ── Forgot password (unauthenticated, OTP-gated) ────────────────────────────
  forgotPasswordSendOtp: async (email: string) => {
    return await apiService.post("/user/forgot-password/send-otp", { email });
  },

  forgotPasswordVerifyOtp: async (email: string, otp: string) => {
    return await apiService.post("/user/forgot-password/verify-otp", { email, otp });
  },

  resetPassword: async (payload: { email: string; newPassword: string }) => {
    const response = await apiService.post("/user/forgot-password/reset", payload);

    if (!response.success) {
      return { success: false, error: response.error, status: response.status };
    }

    return { success: true, status: response.status };
  },

  refreshToken: async() =>  {
    return refreshAccessToken();
  }
};