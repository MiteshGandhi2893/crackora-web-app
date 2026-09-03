"use client";
// LatestBlogCard.tsx — CLIENT COMPONENT
// The "what's new on the blog" bento cell.

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/services/api.service";
import { BlogListItem } from "@/interfaces/blog.interface";
import { blogService } from "@/services/Blog.service";

export function LatestBlogCard({ className = "" }: { className?: string }) {
  const [latestBlog, setLatestBlog] = useState<BlogListItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLatestBlog = async () => {
      try {
        const res = await blogService.getLatestBlog();
        setLatestBlog(res?.blog ?? null);
      } catch (err) {
        console.error("Failed to fetch latest blog:", err);
      } finally {
        setLoading(false);
      }
    };
    getLatestBlog();
  }, []);

  // Don't render a link to "/blogs/undefined" or an image with a broken
  // src while the fetch is in flight (or if it comes back empty).
  if (loading || !latestBlog) {
    return (
      <div className={`w-full h-full flex gap-5 items-center ${className}`}>
        <div className="relative w-35 h-35 bg-cyan-50/10 rounded-lg shrink-0 animate-pulse" />
        <div className="flex flex-col gap-2 w-full">
          <div className="h-4 w-3/4 bg-cyan-50/10 rounded animate-pulse" />
          <div className="h-4 w-full bg-cyan-50/10 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <Link
      className={`w-full h-full flex gap-5 items-center group ${className}`}
      href={`/blogs/${latestBlog.slug}`}
    >
      {/* Cover */}
      <div className="relative w-35 h-35 bg-cyan-50 overflow-hidden shrink-0">
        <Image
          src={`${API_BASE_URL}/public/${latestBlog.cover_image}`}
          alt={latestBlog.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[15px] text-amber-400 font-medium">
          {latestBlog.title}
        </span>
        <span className="text-[15px] text-stone-50/80 font-medium">
          {latestBlog.excerpt}
        </span>
        <span className="items-center gap-1 w-fit px-2 py-1 text-sm font-medium bg-amber-600 group-hover:gap-2 transition-all">
          View {latestBlog.schema_type}
        </span>
      </div>
    </Link>
  );
}