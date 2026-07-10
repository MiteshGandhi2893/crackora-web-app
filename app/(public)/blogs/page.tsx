/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { Suspense } from "react";
import BlogCard from "@/components/blogs/BlogCard";
import BlogFilters from "@/components/blogs/BlogFilters";
import BlogPagination from "@/components/blogs/BlogPagination";
import { blogService } from "@/services/Blog.service";
import { STARS } from "@/lib/util";

export const metadata: Metadata = {
  metadataBase: new URL("https://crackora.com"),

  title: "Blog | Crackora — MCA Entrance, Academics & Placement Guides",

  description:
    "Explore Crackora blogs on MAH MCA CET, NIMCET, MCA colleges, placements, interview preparation, coding skills, career guidance, study strategies, and the complete MCA journey.",

  keywords: [
    "Crackora blog",
    "MAH MCA CET blog",
    "NIMCET preparation",
    "MCA placement preparation",
    "MCA colleges",
    "MCA career guidance",
    "DSA interview preparation",
    "MCA entrance strategy",
    "coding interview tips",
    "MCA student resources",
    "MCA academics",
    "placement stories",
  ],

  alternates: {
    canonical: "https://crackora.com/blog",
  },

  openGraph: {
    title: "Crackora Blog",
    description:
      "Exam strategies, MCA college guides, placement preparation, interview tips, coding resources, and career advice for MCA students.",
    url: "https://crackora.com/blog",
    siteName: "Crackora",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Crackora Blog",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Crackora Blog",
    description:
      "Read blogs on MCA entrances, placements, coding, academics, and career growth with Crackora.",
    images: ["/logo.svg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};
// ─── Skeleton ─────────────────────────────────────────────────────────────────

function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-gray-100" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-20 bg-gray-100 rounded-full" />
            <div className="h-5 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-100 rounded w-4/5" />
            <div className="h-4 bg-gray-100 rounded w-3/5" />
            <div className="pt-3 border-t border-gray-100 flex justify-between">
              <div className="h-3 w-24 bg-gray-100 rounded-full" />
              <div className="h-3 w-16 bg-gray-100 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: {
    page?: string;
    tag?: string;
    search?: string;
    category?: string;
  };
}

export default async function BlogListPage({ searchParams }: PageProps) {
  const _params = await searchParams;
  const page = Number(_params.page ?? 1);
  const tag = _params.tag;
  const search = _params.search;
  const category = _params.category;

  // FIX: removed unnecessary Promise.all wrapper (was wrapping a single call)
  const res = await blogService.getBlogs({
    page,
    limit: 9,
    tag,
    search,
    category,
  });

  // FIX: apiService returns { success, data } where data IS the backend response
  // backend sends { blogs, total, page, totalPages } — so read from res.data directly
  const blogs = res.success ? (res.data?.blogs ?? []) : [];
  const total = res.success ? (res.data?.total ?? 0) : 0;
  const totalPages = res.success ? (res.data?.totalPages ?? 1) : 1;

  return (
    <main className=" min-h-screen bg-white mt-10">
      {/* Hero */}
      <section className="relative bg-cyan-900 py-14 px-4 text-white text-center">
        <div className="pointer-events-none absolute inset-0">
          {/* Deep space */}
          <div className="absolute inset-0 bg-[#020617]" />
          {/* Cyan nebula */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
          {/* Green nebula */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(20,83,45,0.22),transparent_4600%)]" />
          {/* Soft atmospheric diffusion */}
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* ── Stars ── */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          {STARS.map((s) => (
            <span
              key={s.id}
              className={`absolute rounded-full ${s.amber ? "bg-amber-300" : "bg-white"}`}
              style={{
                top: s.top,
                left: s.left,
                width: s.w,
                height: s.w,
                opacity: s.opacity,
              }}
            />
          ))}
        </div>

        <div className="relative z-20">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            Crackora Blog
          </p>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Everything you need to know
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-base leading-relaxed">
            Exam strategy, college deep-dives, placement stories and career
            guides — written by someone who&apos;s been through it all.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filters — Suspense needed because BlogFilters uses useSearchParams inside */}
        <Suspense fallback={<div className="h-20" />}>
          <BlogFilters currentTag={tag} currentSearch={search} />
        </Suspense>

        {/* Result count */}
        <p className="text-sm text-gray-400 mb-8">
          {total} article{total !== 1 ? "s" : ""} found
        </p>

        {/* Grid */}
        <Suspense fallback={<BlogGridSkeleton />}>
          {blogs.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 font-medium">No articles found.</p>
              <p className="text-sm text-gray-300 mt-1">
                Try a different search or clear the filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog: any) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </Suspense>

        {/* Pagination */}
        <BlogPagination
          page={page}
          totalPages={totalPages}
          searchParams={{
            ...(tag ? { tag } : {}),
            ...(search ? { search } : {}),
            ...(category ? { category } : {}),
          }}
        />
      </div>
    </main>
  );
}
