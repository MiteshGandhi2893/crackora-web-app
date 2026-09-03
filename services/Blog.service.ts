/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BlogCategory,
  BlogComment,
  BlogDetailResponse,
  BlogListParams,
  BlogListResponse,
  CommentsResponse,
} from "@/interfaces/blog.interface";
import { apiService, unwrap } from "./api.service";

// ─── Service ───────────────────────────────────────────────────────────────────
// Uses the shared apiService so the global 401 handler, credentials, and
// JSON parsing all work identically to the rest of the app. Every function
// here returns the raw payload directly (via unwrap) and throws an Error on
// failure — callers use try/catch or .then(), no { success, data } checking.

export const blogService = {
  // ── Public listing ─────────────────────────────────────────────────────────

  getBlogs: (params: BlogListParams = {}) => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.tag) q.set("tag", params.tag);
    if (params.search) q.set("search", params.search);
    if (params.category) q.set("category", params.category);
    const qs = q.toString();
    return unwrap(
      apiService.get<BlogListResponse>(`/blogs${qs ? `?${qs}` : ""}`),
    );
  },

  // Remember to pass limit if you want more than 1 blog
  getLatestBlog: () =>
    unwrap(apiService.get<BlogDetailResponse>(`/blogs/latest`)),

  // ── Single blog by slug ────────────────────────────────────────────────────

  getBlogBySlug: (slug: string) =>
    unwrap(apiService.get<BlogDetailResponse>(`/blogs/${slug}`)),

  // ── Blogs in a category ────────────────────────────────────────────────────

  getBlogsByCategory: (
    slug: string,
    params: { page?: number; limit?: number } = {},
  ) => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    const qs = q.toString();
    return unwrap(
      apiService.get<BlogListResponse>(
        `/categories/${slug}/blogs${qs ? `?${qs}` : ""}`,
      ),
    );
  },

  // ── All categories ─────────────────────────────────────────────────────────

  getCategories: () =>
    unwrap(apiService.get<{ categories: BlogCategory[] }>("/categories")),

  // ── Comments ───────────────────────────────────────────────────────────────

  getComments: (blogId: string) =>
    unwrap(apiService.get<CommentsResponse>(`/blogs/${blogId}/comments`)),

  postComment: (blogId: string, content: string, parentId?: string) =>
    unwrap(
      apiService.post<{ comment: BlogComment }>(`/blogs/${blogId}/comments`, {
        content,
        parent_id: parentId ?? null,
      }),
    ),

  reportComment: (commentId: string, reason = "inappropriate") =>
    unwrap(
      apiService.post<{ message: string }>(
        `/blogs/comments/${commentId}/report`,
        { reason },
      ),
    ),
};

export const tagService = {
  getTags: () => unwrap(apiService.get<{ tags: { id: string; name: string; slug: string }[] }>(`/tags`)),
};