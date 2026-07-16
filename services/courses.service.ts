/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "./api.service";
import { Entrance } from "../interfaces/entrance-interface";
import {
  CoursePackage,
  MenuPackage,
  PackageType,
} from "@/interfaces/CoursePackage.interface";

export type { PackageType, MenuPackage };

// ─── Normalizes a raw API package row: flattens metadata JSONB onto
// the top level so CoursePackage.level / .curriculum / .total_tests
// etc. are directly readable, regardless of package_type. Safe to run
// on rows that already lack metadata (menu rows, list rows, etc). ───
function safeParseJSON(value: string): Record<string, unknown> | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizePackage(raw: any): CoursePackage {
  if (!raw) return raw;
  const { metadata, ...base } = raw;
  const parsedMetadata =
    typeof metadata === "string" ? safeParseJSON(metadata) : metadata;

  return {
    ...base,
    ...(parsedMetadata && typeof parsedMetadata === "object"
      ? parsedMetadata
      : {}),
    metadata: parsedMetadata ?? undefined,
  } as CoursePackage;
}

// ─── Builds the JSONB `metadata` payload for the active package_type ───
// Only the fields relevant to the selected type are sent; switching types
// on the frontend and saving will replace metadata with the new type's shape.
function buildMetadata(data: CoursePackage): Record<string, unknown> {
  switch (data.package_type) {
    case "course":
      return {
        level: data.level,
        language: data.language,
        certificate: !!data.certificate,
        what_you_will_get: data.what_you_will_get || [],
        requirements: data.requirements || [],
        curriculum: data.curriculum || [],
      };
    case "ebook":
      return {
        author: data.author || "",
        page_count: data.page_count ?? null,
        file_format: data.file_format || "PDF",
        sample_link: data.sample_link || "",
      };
    case "live":
      return {
        batch_start_date: data.batch_start_date ?? null,
        total_sessions: data.total_sessions ?? null,
        session_duration_minutes: data.session_duration_minutes ?? null,
        seats_available: data.seats_available ?? null,
        mode: data.mode || "Online",
        schedule_note: data.schedule_note || "",
      };
    case "mock_test":
      return {
        total_tests: data.total_tests ?? null,
        questions_per_test: data.questions_per_test ?? null,
        test_duration_minutes: data.test_duration_minutes ?? null,
        syllabus_topics: data.syllabus_topics || [],
        difficulty_level: data.difficulty_level || "Mixed",
      };
    default:
      return {};
  }
}

// ─── Shared FormData builder for create/update ──────────────────────
function buildFormData(data: CoursePackage): FormData {
  const formData = new FormData();

  formData.append("package_type", data.package_type);
  formData.append("title", data.title || data.course_name || "");
  formData.append("entrance_id", data.entrance_id);
  formData.append("entrance_name", String(data.entrance_name ?? ""));
  formData.append("facility", data.facility || "Online Course");
  formData.append("course_name", data.course_name);
  formData.append("description", data.description || "");
  formData.append(
    "expiry_date",
    data.expiry_date ? new Date(data.expiry_date).toISOString() : "",
  );
  formData.append("discount_percentage", String(data.discount_percentage || 0));
  formData.append("price", String(data.price || 0));
  formData.append("discounted_price", String(data.discounted_price || 0));
  formData.append("duration", String(data.duration || 0));
  formData.append("is_active", String(data.is_active));
  formData.append("in_top", String(data.in_top));
  formData.append("checkout_link", data.checkout_link || "");
  formData.append("teacher", data.teacher || "");
  formData.append("content", data.content || "");
  formData.append("hero_content", data.hero_content || "");
  formData.append("faq", data.faq || "");
  formData.append("slug", data.slug || "");
  formData.append("metadata", JSON.stringify(buildMetadata(data)));

  // ─── exams_covered: sent as ONE clean JSON string, same pattern as
  // metadata. This replaces the old repeated `examsCovered[]` fields,
  // which were fragile to parse back out on the backend/DB side. ───
  formData.append("exams_covered", JSON.stringify(data.exams_covered || []));

  if (data.image_file) formData.append("image", data.image_file);

  return formData;
}

// ─── Admin CRUD ───────────────────────────────────────────────────────
export const coursePackageService = {
  getAll: async (entrance_id?: string, page: number = 1, limit: number = 50) => {
    const params = new URLSearchParams();
    if (entrance_id) params.append("entrance_id", entrance_id);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const response = await apiService.get<{
      packages: CoursePackage[];
      totalPages: number;
      totalCount: number;
      currentPage: number;
    }>(`/course-packages?${params.toString()}`);

    if (!response.success) return response;

    return {
      ...response,
      data: {
        ...response.data,
        packages: (response.data.packages || []).map(normalizePackage),
      },
    };
  },

  getById: async (id: string) => {
    const response = await apiService.get<CoursePackage>(
      `/course-packages/${id}`,
    );
    if (!response.success) return response;
    return { ...response, data: normalizePackage(response.data) };
  },

  getBySlug: async (slug: string) => {
    const response = await apiService.get<CoursePackage>(
      `/course-packages/view/${slug}`,
    );
    if (!response.success) return response;
    return { ...response, data: normalizePackage(response.data) };
  },

  create: async (data: CoursePackage) =>
    apiService.post<{ message: string; data: CoursePackage }>(
      `/course-packages`,
      buildFormData(data),
    ),

  update: async (id: string, data: CoursePackage) =>
    apiService.put<{ message: string; data: CoursePackage }>(
      `/course-packages/${id}`,
      buildFormData(data),
    ),

  copyPackage: async (id: string) =>
    apiService.post(`/course-packages/${id}/copy`, {}),

  updateStatus: (id: string, isActive: boolean) => {
    return apiService.put<{ message: string; data: CoursePackage }>(
      `/course-packages/${id}/status`,
      { isActive },
    );
  },
};

// ─── Public-facing reads (nav menu, package detail page) ──────────────
export const packageService = {
  getCoursesByExam: async () => {
    const response = await apiService.get("/coursesByExams");
    if (!response.success) throw new Error(response.error);
    return response.data as Entrance[];
  },

  getPackages: async () => {
    const response = await apiService.get("/course-packages");
    if (!response.success) throw new Error(response.error);
    if (!response.data?.success) throw new Error("Failed to fetch packages");
    return (response.data.packages || []).map(normalizePackage);
  },

  // Menu rows are intentionally lightweight (no metadata from the API),
  // so normalization is a no-op here — kept out on purpose for speed.
  getActiveForMenu: async () => {
    const response = await apiService.get("/course-packages/menu");
    if (!response.success) {
      return {
        success: false,
        error: response.error,
        status: response.status,
      };
    }

    return {
      success: true,
      packages: response.data.packages as MenuPackage[],
      status: response.status,
    };
  },

  getPackageBySlug: async (slug: string) => {
    const response = await apiService.get(`/course-packages/view/${slug}`);
    if (!response.success) {
      return {
        success: false,
        error: response.error,
        status: response.status,
      };
    }

    return {
      success: true,
      package: normalizePackage(response.data),
      status: response.status,
    };
  },
};