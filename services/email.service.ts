/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "./api.service";

export const emailService = {
  sendCounsellingEmail: async (formData: any) => {
    const response: any = await apiService.post(
      "/send-email/counselling",
      formData,
    );
    return response;
  },
};
