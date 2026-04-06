/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "./api.service";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface BlogTag {
  id?: string;
  name: string;
  slug: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface BlogAuthor {
  username?: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string;
  read_time: number;
  views: number;
  status: "draft" | "published";
  published_at: string;
  created_at: string;
  author_name: string;
  author_avatar?: string;
  tags: BlogTag[];
  categories: BlogCategory[];
}

export interface BlogDetail extends BlogListItem {
  content: string;
  updated_at: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_image?: string;
  canonical_url?: string;
  schema_type?: string;
  author: BlogAuthor;
  table_index: { title: string; id: string; link: string }[];
}

export interface BlogComment {
  id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  username: string; // login handle — used for auth checks
  user_name: string; // display name — shown in UI
  user_avatar?: string;
  moderation_status: "auto_approved" | "flagged" | "approved" | "rejected";
  replies: BlogComment[];
}

export interface BlogListResponse {
  blogs: BlogListItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface BlogDetailResponse {
  blog: BlogDetail;
}

export interface CommentsResponse {
  comments: BlogComment[];
}

export interface BlogListParams {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
  category?: string;
}

// ─── Service ───────────────────────────────────────────────────────────────────
// Uses the shared apiService so the global 401 handler, credentials, and
// JSON parsing all work identically to the rest of the app.
// apiService.get/post return { success, data, error } — callers check
// res.success and read res.data directly (e.g. res.data?.blog).

export const blogService = {
  // ── Public listing ─────────────────────────────────────────────────────────

  getBlogs: async (params: BlogListParams = {}) => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.tag) q.set("tag", params.tag);
    if (params.search) q.set("search", params.search);
    if (params.category) q.set("category", params.category);
    const qs = q.toString();
    const response: any = await apiService.get(`/blogs${qs ? `?${qs}` : ""}`);
    return response;
  },

  // ── Single blog by slug ────────────────────────────────────────────────────

  getBlogBySlug: (slug: string) =>
    apiService.get<BlogDetailResponse>(`/blogs/${slug}`),

  // ── Blogs in a category ────────────────────────────────────────────────────

  getBlogsByCategory: (
    slug: string,
    params: { page?: number; limit?: number } = {},
  ) => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    const qs = q.toString();
    return apiService.get<BlogListResponse>(
      `/categories/${slug}/blogs${qs ? `?${qs}` : ""}`,
    );
  },

  // ── All categories ─────────────────────────────────────────────────────────

  getCategories: () =>
    apiService.get<{ categories: BlogCategory[] }>("/categories"),

  // ── Comments ───────────────────────────────────────────────────────────────

  getComments: (blogId: string) =>
    apiService.get<CommentsResponse>(`/blogs/${blogId}/comments`),

  postComment: (blogId: string, content: string, parentId?: string) =>
    apiService.post<{ comment: BlogComment }>(`/blogs/${blogId}/comments`, {
      content,
      parent_id: parentId ?? null,
    }),

  reportComment: (commentId: string, reason = "inappropriate") =>
    apiService.post<{ message: string }>(
      `/blogs/comments/${commentId}/report`,
      { reason },
    ),
};

export const tagService = {
  getTags: async () => {
    const response: any = await apiService.get(`/tags`);
    if (!response.success) {
      return {
        success: false,
        error: response.error,
        status: response.status,
      };
    }

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  },
};
