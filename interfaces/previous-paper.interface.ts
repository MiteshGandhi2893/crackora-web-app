export type SolutionType = "pdf" | "video" | "both";

export interface SubjectTag {
  id: string;
  name: string;
  slug: string;
}

export interface PreviousPaper {
  id?: string;
  exam_id: string;
  entrance_id: string;
  entrance_name?: string;
  exam_title?: string;

  year: number | "";
  title: string;
  slug: string;
  description?: string;
  content?: string;

  total_questions?: number;
  duration_minutes?: number;
  exam_date?: Date | null;

  // Question paper — always public once published.
  question_paper_file_path?: string;
  question_paper_file?: File; // set only when a new file is picked

  // Solutions — gated, dashboard-only viewing on the public site.
  solution_type: SolutionType;
  solution_pdf_url?: string;
  solution_pdf_file?: File;
  solution_video_url?: string;

  // Subject tags — coarse paper-level filter chips (e.g. "Maths", "English").
  // Separate from paper_questions.topic_id, which is the fine-grained
  // curriculum topic used once a paper is digitized.
  subject_tag_ids: string[];
  subject_tags?: SubjectTag[];

  question_count?: number;
  has_question_bank?: boolean;
  download_count?: number;
  view_count?: number;
  display_order: number;
  is_published: boolean;

  created_at?: string;
  updated_at?: string;
}

export const EMPTY_PAPER: PreviousPaper = {
  exam_id: "",
  entrance_id: "",
  year: "",
  title: "",
  slug: "",
  description: "",
  content: "",
  total_questions: undefined,
  duration_minutes: undefined,
  exam_date: null,
  solution_type: "pdf",
  solution_pdf_url: "",
  solution_video_url: "",
  subject_tag_ids: [],
  display_order: 0,
  is_published: false,
};