import { apiService } from "./api.service";
import type { PreviousPaper, SubjectTag } from "../interfaces/previous-paper.interface";

// ─── Shared FormData builder for create/update, same pattern as
// coursepackage.service.ts's buildFormData ───
function buildFormData(data: PreviousPaper): FormData {
  const formData = new FormData();

  formData.append("exam_id", data.exam_id);
  formData.append("entrance_id", data.entrance_id);
  formData.append("entrance_name", String(data.entrance_name ?? ""));
  formData.append("exam_title", String(data.exam_title ?? ""));
  formData.append("year", String(data.year || ""));
  formData.append("title", data.title || "");
  formData.append("slug", data.slug || "");
  formData.append("description", data.description || "");
  formData.append("content", data.content || "");
  formData.append("total_questions", String(data.total_questions || ""));
  formData.append("duration_minutes", String(data.duration_minutes || ""));
  formData.append(
    "exam_date",
    data.exam_date ? new Date(data.exam_date).toISOString() : "",
  );
  formData.append("solution_type", data.solution_type);
  formData.append("solution_video_url", data.solution_video_url || "");
  formData.append("display_order", String(data.display_order || 0));
  formData.append("is_published", String(data.is_published));
  formData.append("subject_tag_ids", JSON.stringify(data.subject_tag_ids || []));

  if (data.question_paper_file)
    formData.append("question_paper_file", data.question_paper_file);
  if (data.solution_pdf_file)
    formData.append("solution_pdf_file", data.solution_pdf_file);

  return formData;
}

export const previousPaperService = {
  getAll: (params?: {
    entrance_id?: string;
    exam_id?: string;
    year?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.entrance_id) qs.append("entrance_id", params.entrance_id);
    if (params?.exam_id) qs.append("exam_id", params.exam_id);
    if (params?.year) qs.append("year", String(params.year));
    return apiService.get<PreviousPaper[]>(`/previous-papers?${qs.toString()}`);
  },

  getById: (id: string) =>
    apiService.get<PreviousPaper>(`/previous-papers/${id}`),

  getBySlug: (slug: string) =>
    apiService.get<PreviousPaper>(`/previous-papers/view/${slug}`),

  create: (data: PreviousPaper) =>
    apiService.post<{ message: string; data: PreviousPaper }>(
      `/previous-papers`,
      buildFormData(data),
    ),

  update: (id: string, data: PreviousPaper) =>
    apiService.put<{ message: string; data: PreviousPaper }>(
      `/previous-papers/${id}`,
      buildFormData(data),
    ),

  updatePublishStatus: (id: string, is_published: boolean) =>
    apiService.put<{ message: string; data: PreviousPaper }>(
      `/previous-papers/${id}/publish`,
      { is_published },
    ),

  delete: (id: string) => apiService.delete(`/previous-papers/${id}`),

  getSubjectTags: () => apiService.get<SubjectTag[]>(`/paper-subject-tags`),

  createSubjectTag: (name: string) =>
    apiService.post<SubjectTag>(`/paper-subject-tags`, { name }),
};