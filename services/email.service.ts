/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "./api.service";


interface LeadPayload {
  fullname: string;
  email: string;
  phone: string;
  message?: string;
  sourcePage: "exam-info" | "paperset" | "home";
  sourceSlug: string;
  sourceUrl?: string;
  [key: string]: any; // CounsellingForm has extra fields (state, city, category, exam)
}

export const emailService = {
  sendCounsellingEmail: async (formData: LeadPayload) => {
    const response: any = await apiService.post(
      "/send-email/counselling",
      formData,
    );
    return response;
  },
  sendCallbackEmail: async (formData: LeadPayload) => {
    const response: any = await apiService.post(
      "/send-email/exam-callback",
      formData,
    );
    return response;
  },
};
