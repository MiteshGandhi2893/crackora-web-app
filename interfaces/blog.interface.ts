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

export interface BlogCardProps {
  blog: BlogListItem;
}

export interface BlogAuthor {
  username?: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface BlogsSectionProps {
  blogs: BlogListItem[];
}

export interface BlogPaginationProps {
  page: number;
  totalPages: number;
  searchParams: Record<string, string>;
}


export interface BlogFiltersProps {
  currentTag?: string;
  currentSearch?: string;
  tags?: { name: string; slug: string }[];
}

export interface Tags {
  name: string;
  slug: string;
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
  schema_type?: string;
}

export interface CommentItemProps {
  comment: BlogComment;
  // FIX: typed properly instead of passing the whole User object around
  currentUsername?: string;
  currentAvatar?: string;
  onReply: (parentId: string, text: string) => Promise<void>;
  onReport: (commentId: string) => void;
  depth?: number;
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