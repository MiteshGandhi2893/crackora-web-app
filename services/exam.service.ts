import { Exam } from "@/interfaces/entrance-interface";
import { apiService, unwrap } from "./api.service";
import { cache } from "react";

export const examService = {
  getExamById: cache((examId: string): Promise<Exam> => {
    return unwrap(apiService.get<Exam>(`/exams/${examId}`));
  }),

  getExamBySlug: cache((slug: string): Promise<Exam> => {
    return unwrap(apiService.get<Exam>(`/exams/exam-slug/${slug}`));
  }),
};