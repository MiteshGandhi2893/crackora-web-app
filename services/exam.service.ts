import { Exam } from "@/interfaces/entrance-interface";
import { apiService } from "./api.service";
import { cache } from "react";

export const examService = {
  getExamById: cache(async (examId: string): Promise<Exam> => {
    const response = await apiService.get(`/exams/${examId}`);
    if (!response.success) throw new Error(response.error);
    return response.data as Exam;
  }),

  getExamBySlug: cache(async (slug: string): Promise<Exam> => {
    const response = await apiService.get(`/exams/exam-slug/${slug}`);
    if (!response.success) throw new Error(response.error);
    return response.data as Exam;
  }),
};
