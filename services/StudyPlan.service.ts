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


  saveProgress: async(planId: string, weekPlan: any) => {
    const response: any = await apiService.post(
     `/studyplanner/${planId}/progress`,
    { weekly_plan: weekPlan }
    );
    return response;
  },

  getStudentPlans: async (headers?: any) => {
    const response: any = await apiService.get("/studyplanner/", headers);
    const res = { plans: [], error: "" };
    if (response.success) {
      res.plans = response.data;
    } else {
      res.error = response.error;
    }
    return res;
  },

  getStudentPlanById: async (id: string, headers?: any) => {
    const response: any = await apiService.get(`/studyplanner/${id}`, headers);
    if (!response.success) {
      return {
        success: false,
        error: response.error,
        status: response.status,
      };
    }

    return {
      success: true,
      plan: response.data,
      status: response.status,
    };
  },

  getPlannerForm: async (redirectToken: string) => {
    const res = await apiService.get(
      `/studyplanner/get-intent/${redirectToken}`,
    );
    return res.data;
  },

  // ── New: fetch topic preview for Step 4 (section accordion) ──────────────
  // Returns Section[] with subSections and topics including weightage + estimatedHours.
  // No auth needed — purely informational.
  getTopicsForPreview: async (
    examId: string,
    level: string,
  ): Promise<{ sections: any[]; error: string }> => {
    const response: any = await apiService.get(
      `/studyplanner/topics?examId=${examId}&level=${level}`,
    );
    if (response.success) {
      return { sections: response.data ?? [], error: "" };
    }
    return { sections: [], error: response.error ?? "Failed to load topics" };
  },

  // ── New: fetch prep_requirements row to drive date-step warning ──────────
  // Returns the DB row (min_days, recommended_days, max_days, description)
  // or null if none found. No auth needed.
  getPrepRequirement: async (
    examId: string,
    level: string,
  ): Promise<any | null> => {
    const response: any = await apiService.get(
      `/studyplanner/prep-requirement?examId=${examId}&level=${level}`,
    );
    if (response.success) {
      return response.data ?? null;
    }
    return null;
  },
};