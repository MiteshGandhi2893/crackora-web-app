export type SolutionType = "pdf" | "video" | "both";

export interface SubjectTag {
  id: string;
  name: string;
  slug: string;
}

export interface FaqEntry {
  id?: string;
  question: string;
  answer: string;
}

export interface PaperExam {
  id: string;
  exam_id: string;
  exam_name: string;
  paper_title: string;
  paper_count: number;
  is_live: boolean;
  exam_icon: string;
  slug: string;
}
export interface Entrance {
  id: string;
  name: string;
  total_papers: string;
}

/**
 * One paper inside a paper set (a single year/slot's question paper +
 * solution). `file_key` is a client-generated stable id used to name the
 * multipart fields (`pq_<file_key>`, `ps_<file_key>`) so the backend can
 * match files to items regardless of array order.
 */
export interface PaperItem {
  id?: string;
  file_key: string;
  name: string;
  year: number | "";
  slot: string;
  slug: string;
  total_questions?: number | "";
  duration_minutes?: number | "";
  exam_date?: Date | null;
  display_order?: number;

  // New files staged for upload (not yet sent)
  question_paper_file?: File | null;
  solution_pdf_file?: File | null;

  // Existing server file paths (edit mode / after save)
  question_paper_file_path?: string;
  solution_type: SolutionType;
  solution_pdf_url?: string;
  solution_video_url?: string;
  // Set by the backend after PDF→webp conversion; 0 means no page-based
  // solution has been uploaded yet (still relevant even if solution_type
  // is "video", since that path never populates this).
  solution_page_count?: number;

  download_count?: number;
  view_count?: number;
}

// Map interface representing { year: PaperItem[] }
export interface PaperItemYearMap {
  [year: string]: PaperItem[];
}

export interface PaperSet {
  id?: string;
  entrance_id: string;
  entrance_name: string;
  exam_id: string;
  exam_title?: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  display_order: number;
  is_published: boolean;
  subject_tag_ids: string[];
  faqs: FaqEntry[];
  paper_items: PaperItemYearMap;
}

export interface PaperExamForMenu {
  id: string;
  name: string;
  count: number;
  paperExams: PaperExam[];
}

export function makeFileKey(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function emptyPaperItem(): PaperItem {
  return {
    file_key: makeFileKey(),
    name: "",
    year: "",
    slot: "General",
    slug: "",
    solution_type: "pdf",
    total_questions: "",
    duration_minutes: "",
    exam_date: null,
    display_order: 0,
    solution_page_count: 0,
  };
}

export const EMPTY_PAPER_SET: PaperSet = {
  entrance_id: "",
  entrance_name: "",
  exam_id: "",
  slug: "",
  title: "",
  description: "",
  content: "",
  display_order: 0,
  is_published: false,
  subject_tag_ids: [],
  faqs: [],
  paper_items: {},
};