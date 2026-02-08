import {
  SignInPayload,
  SignUpPayload,
} from "../interfaces/authentication-interface";
import { apiService } from "./api.service";

export const authService = {
  signIn: async (signInPayload: SignInPayload) => {
    const response = await apiService.post("/user/signIn", signInPayload);
    if (response.success) {
      return { user: response.data };
    } else {
      return { error: response.error };
    }
  },

  signUp: async (signUpPayload: SignUpPayload) => {
    const response = await apiService.post("/user/signUp", signUpPayload);
    if (response.success) {
      return { user: response.data };
    } else {
      return { error: response.error };
    }
  },

  signOut: async () => {
    const response = await apiService.get("/user/signout");
    return response;
  },

  signInStatus: async () => {
    const response = await apiService.get("/user/signin-status");
    if (response.success) {
      return { user: response.data };
    } else {
      return { error: response.error };
    }
  },

  //  getCoursesByExam: async () => {
  //         const response = await apiService.get('/coursesByExams')
  //         if (!response.success) throw new Error(response.error);
  //         return response.data as Entrance[];
  //     }
};
