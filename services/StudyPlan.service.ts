import { apiService } from "./api.service";

export const studyPlannerService = {
  generateStudyPlan: async (studyPlanForm: any) => {
    const response: any = await apiService.post(
      "/studyplanner/generate",
      studyPlanForm
    );
    return response;
  },

  getStudentPlans: async () => {
    const response: any = await apiService.get("/studyplanner/");
    return response;
  },

  getPlannerForm: async (redirectToken: string) => {
    const res = await apiService.get(
      `/studyplanner/get-intent/${redirectToken}`
    );
    return res.data;
  },
};
