/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "./api.service";

export const studyPlannerService = {
  generateStudyPlan: async (studyPlanForm: any) => {
    const response: any = await apiService.post(
      "/studyplanner/generate",
      studyPlanForm,
    );
    return response;
  },

  getStudentPlans: async (headers?: any) => {
    const response: any = await apiService.get("/studyplanner/", headers);
    if (!response.success) throw new Error(response.error);
    return response.data;
  },

  getStudentPlanById: async (id: string, headers?: any) => {
    const response: any = await apiService.get(`/studyplanner/${id}`, headers);
    if (!response.success) throw new Error(response.error);
    return response.data;
  },

  getPlannerForm: async (redirectToken: string) => {
    const res = await apiService.get(
      `/studyplanner/get-intent/${redirectToken}`,
    );
    return res.data;
  },
};
