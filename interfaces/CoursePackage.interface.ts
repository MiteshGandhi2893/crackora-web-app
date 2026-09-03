/* eslint-disable @typescript-eslint/no-explicit-any */
export type PackageCategory =
  | "live_course"
  | "self_study"
  | "mock_test"
  | "ebook";
export type MockTestVariant = "test_series" | "single_mock" | "sectional";
export const ALLOWED_LINK_TARGETS: Record<PackageCategory, PackageCategory[]> =
  {
    ebook: [],
    mock_test: ["ebook"],
    self_study: ["mock_test", "ebook"],
    live_course: ["self_study", "mock_test", "ebook"],
  };

export interface LinkedPackageSummary {
  id: string;
  title: string;
  category: PackageCategory;
  price: number;
  image: string;
}

// Matches what getTeachersFor() returns from the API.
export interface TeacherSummary {
  username: string;
  fullname: string;
  avatar?: string;
  designation?: string;
}

export interface CurriculumTopic {
  id: string;
  title: string;
  weightage: string;
  maxWeightage: number;
  examIDs: string[];
}

export interface CurriculumSubSection {
  id: string;
  title: string;
  topics: CurriculumTopic[];
}

export interface CurriculumSection {
  id: string;
  title: string;
  subSections: CurriculumSubSection[];
}

export interface CurriculumResponse {
  curriculum: CurriculumSection[];
  examIDsUsed: string[];
  missingExamIDs: string[];
}

export interface ExamsCovered {
  id: string;
  title: string;
  slug: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TeacherSummary {
  username: string;
  fullname: string;
  avatar?: string;
  designation?: string;
  qualifications?: string[];
  skills?:string[];
  affiliation?: string;
  bio?: string;
}

export interface CoursePackage {
  id?: string;
  category: PackageCategory;
  entrance_id: string;
  entrance_name?: string;
  course_name: string;
  description: string;
  title: string;
  slug?: string;
  hero_content: string;
  faq: string;
  content: string;
  price: number;
  discounted_price: number;
  discount_percentage: number;
  is_active: boolean;
  in_top: boolean;
  checkout_link: string;
  teacher: string;
  exams_covered: ExamsCovered[];
  image: string;
  image_file?: File;
  expiry_date?: Date;
  duration?: number;

  // bundling — populated on read, editable on write
  linked_package_ids?: string[];
  linked_packages?: LinkedPackageSummary[];

  // teachers (M-M via course_package_teachers) — populated on read
  teacher_usernames?: string[];
  teachers?: TeacherSummary[];

  // live_course-specific
  batch_start_date?: Date;
  total_sessions?: number;
  session_duration_minutes?: number;
  seats_available?: number;
  mode?: "Online" | "Offline" | "Hybrid";
  schedule_note?: string;

  // self_study-specific
  level?: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  language?: string;
  certificate?: boolean;
  what_you_will_get?: string[];
  requirements?: string[];
  curriculum?: CurriculumSection[];

  // ebook-specific
  author?: string;
  page_count?: number;
  file_format?: "PDF" | "EPUB" | "PDF + EPUB";
  sample_link?: string;

  // mock_test-specific
  mock_test_variant?: MockTestVariant;
  total_tests?: number;
  questions_per_test?: number;
  test_duration_minutes?: number;
  syllabus_topics?: string[];
  difficulty_level?: "Easy" | "Moderate" | "Hard" | "Mixed";


  // SEO / meta
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
}

// Lightweight shape used only by menu/listing endpoints — a subset of
// CoursePackage. Kept separate since menu APIs don't return metadata.
export interface MenuPackage {
  id: string;
  category: PackageCategory;
  course_name: string;
  title: string;
  slug: string;
  price: number;
  discounted_price: number;
  image: string;
  entrance_id: string;
  entrance_name: string;
  description?: string;
  checkout_link?: string;
  what_you_will_get?: [string];
}
