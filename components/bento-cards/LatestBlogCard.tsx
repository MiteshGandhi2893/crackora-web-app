"use client";
// LatestBlogCard.tsx — CLIENT COMPONENT
// Mini card: image frame, title, link.
// Phone: vertical (image on top). Laptop: horizontal (image left).

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

  const shell = `
    flex h-full w-full min-w-0 flex-col gap-3 lg:flex-row
    rounded-2xl border border-stone-200 bg-cyan-900 p-4
    ${className}
  `;

  // Don't render a link to "/blogs/undefined" or an image with a broken
  // src while the fetch is in flight (or if it comes back empty).
  if (loading || !latestBlog) {
    return (
      <div className={shell}>
        <div className="aspect-video w-full shrink-0 animate-pulse rounded-xl bg-stone-200/70 lg:w-36" />
        <div className="flex min-w-0 flex-1 flex-col gap-2 lg:justify-center">
          <div className="h-2.5 w-20 animate-pulse rounded bg-stone-200/70" />
          <div className="h-3.5 w-full animate-pulse rounded bg-stone-200/70" />
          <div className="h-3.5 w-2/3 animate-pulse rounded bg-stone-200/70" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/blogs/${latestBlog.slug}`}
      className={`group transition-all duration-300 hover:border-amber-300 hover:shadow-md ${shell}`}
    >
      {/* Image frame */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl lg:w-50">
        <Image
          src={`${API_BASE_URL}/public/${latestBlog.cover_image}`}
          alt={latestBlog.title}
          fill
          sizes="(max-width: 1024px) 50vw, 144px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col lg:justify-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-400">
          Latest on the blog
        </span>

        <h3 className="mt-0.5 line-clamp-2 min-w-0 wrap-break-word text-[13px] font-semibold leading-snug text-cyan-50 sm:text-sm">
          {latestBlog.title}
        </h3>

        <span className="mt-auto inline-flex w-fit items-center gap-1 pt-1.5 text-xs font-semibold text-amber-500 transition-all group-hover:gap-2 group-hover:text-amber-400 group-hover:underline lg:mt-1.5 lg:pt-0">
          View {latestBlog.schema_type} →
        </span>
      </div>
    </Link>
  );
}