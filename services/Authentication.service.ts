import { User } from "@/providers/AuthProvider";
import {
  SignInPayload,
  SignUpPayload,
} from "../interfaces/authentication-interface";
import { apiService } from "./api.service";

export const authService = {
  signIn: async (signInPayload: SignInPayload) => {
    const response = await apiService.post("/user/signIn", signInPayload);

    if (!response.success) {
      return {
        success: false,
        error: response.error,
        status: response.status,
      };
    }

    return {
      success: true,
      user: response.data,
      status: response.status,
    };
  },

  signUp: async (signUpPayload: SignUpPayload) => {
    const response = await apiService.post("/user/signUp", signUpPayload);

    if (!response.success) {
      return {
        success: false,
        error: response.error,
        status: response.status,
      };
    }

    return {
      success: true,
      user: response.data,
      status: response.status,
    };
  },

  signOut: async () => {
    return await apiService.get("/user/signout");
  },

  signInStatus: async () => {
    const response = await apiService.get<User>("/user/signin-status");

    if (!response.success) {
      return {
        success: false,
        error: response.error,
        status: response.status,
      };
    }

    return {
      success: true,
      user: response.data,
      status: response.status,
    };
  },
};