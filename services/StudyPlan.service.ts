/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "./api.service";


export interface GeneratePlanInput {
    entrance:         { id: string };
    exam:             { id: string };
    prepStartDate:    string;
    examDate:         string;
    hoursPerWeekday:  number;
    hoursPerWeekend:  number;
    examPrepLevel:    string;
    weakSubSectionIds?: string[];
    weakTopicIds?:      string[];
}
 
/** Shape that /generate returns — also the shape /save accepts directly. */
export interface StudyPlanPayload {
    entrance:            { id: string; title: string };
    exam:                { id: string; title: string };
    totalHoursAvailable: number;
    requiredHours:       number;
    timeCategory:        'tight' | 'normal' | 'relaxed';
    prepRequirement:     { minDays: number; recommendedDays: number; totalDays: number };
    weakAreas:           { subSectionCount: number; topicCount: number };
    freeTime:            { freeWeeks: number; freeHours: number; contentWeeks: number; revisionWeeks: number };
    feasibility: {
        isShortOnTime:        boolean;
        shortByHours:         number;
        surplusHours:         number;
        coveredTopicsCount:   number;
        uncoveredTopicsCount: number;
        uncoveredTopics:      unknown[];
        rescueSuggestions:    unknown | null;
    };
    weekly_plan: unknown[];
    syllabus:    unknown[];
    inputs: {
        entranceId:     string;
        entranceTitle:  string;
        examId:         string;
        examTitle:      string;
        prepStartDate:  string;
        examDate:       string;
        hoursPerWeekday: number;
        hoursPerWeekend: number;
        prepLevel:      string;
    };
}
 
export interface SavePlanResponse {
    ok:        boolean;
    id:        string;
    createdAt: string;
    replaced:  boolean;
}
 
export interface CheckExistingResponse {
    exists:     boolean;
    planId?:    string;
    createdAt?: string;
}
 
export interface StudyPlanListItem {
    study_plan_id:         string;
    entrance_title:        string;
    exam_title:            string;
    prep_start_date:       string;
    exam_date:             string;
    total_hours_available: number;
    required_hours:        number;
    time_category:         string;
    total_days:            number;
    free_weeks:            number;
    revision_weeks:        number;
    is_short_on_time:      boolean;
    covered_topics_count:  number;
    uncovered_topics_count:number;
    created_at:            string;
    completed_topics:      number;
    total_topics:          number;
}
 

export const studyPlannerService = {
  generateStudyPlan: async (studyPlanForm: any) => {
    const response: any = await apiService.post(
      "/studyplanner/generate",
      studyPlanForm,
    );
    return response;
  },

  savePlan: async (payload: {
    weekly_plan: unknown[];
    syllabus?: unknown[];
    timeCategory?: string;
    feasibility?: unknown;
    freeTime?: unknown;
    prepRequirement?: unknown;
    examId?: string | number;
    entranceId?: string | number;
    examTitle?: string;
    entranceTitle?: string;
    prepStartDate?: string;
    examDate?: string;
    hoursPerWeekday?: number;
    hoursPerWeekend?: number;
    prepLevel?: string;
    totalHoursAvailable?: number;
    requiredHours?: number;
  }) => {
    const response: any = await apiService.post(`/studyplanner/`, payload);
    return response;
  },

  saveProgress: async (planId: string, weekPlan: any) => {
    const response: any = await apiService.post(
      `/studyplanner/${planId}/progress`,
      { weekly_plan: weekPlan },
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

  getTodaysPlan: async (id: string | number, headers?: any) => {
    const response: any = await apiService.get(
      `/studyplanner/${id}/today`,
      headers,
    );
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

  getSyllabus: async (id: string | number, headers?: any) => {
    const response: any = await apiService.get(
      `/studyplanner/${id}/syllabus`,
      headers,
    );
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

  /**
   * Get the syllabus snapshot for a plan.
   * Returned directly inside getPlanById; use this for on-demand refreshes.
   */

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

  checkExisting: async (examId: string): Promise<any | null> => {
    const response: any = await apiService.get(
      `/studyplanner/check-existing?examId=${examId}`,
    );
    if (response.success) {
      return response.data ?? null;
    }
    return null;
  },
};
