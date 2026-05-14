/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { LuClock, LuEye, LuCalendar, LuArrowLeft } from "react-icons/lu";
import CommentsSection from "@/components/blogs/CommentsSection";
import { blogService } from "@/services/Blog.service";
import { API_BASE_URL } from "@/services/api.service";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const p = await params;
  const res = await blogService.getBlogBySlug(p.slug);
  if (!res.success || !res.data?.blog) return { title: "Not found" };

  const blog = res.data.blog;
  const title = blog.seo_title || `${blog.title} | Crackora`;
  const desc = blog.seo_description || blog.excerpt;
  const image = blog.og_image || blog.cover_image;

  return {
    title,
    metadataBase: new URL("https://crackora.com"),

    description: desc,
    keywords: blog.seo_keywords,
    alternates: {
      canonical:
        blog.canonical_url || `https://crackora.com/blogs/${blog.slug}`,
    },
    openGraph: {
      title: blog.seo_title || blog.title,
      description: desc,
      type: "article",
      publishedTime: blog.published_at,
      authors: blog.author?.name ? [blog.author.name] : [],
      tags: blog.tags?.map((t: any) => t.name),
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seo_title || blog.title,
      description: desc,
      images: image ? [image] : [],
    },
  };
}

// ─── Table of contents ────────────────────────────────────────────────────────

function TableOfContents({
  sections,
}: {
  sections: { title: string; id: string; link: string }[];
}) {
  if (!sections?.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-amber-500 rounded-full" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-900">
          In this article
        </p>
      </div>
      <ol className="space-y-2.5">
        {sections.map((s, i) => (
          <li key={s.id} className="flex items-start gap-3">
            <span
              className="shrink-0 w-5 h-5 rounded-full bg-cyan-50 border border-cyan-100
                         text-xs font-bold text-amber-500 flex items-center justify-center mt-0.5"
            >
              {i + 1}
            </span>
            <a
              href={s.link}
              className="text-sm text-gray-600 hover:text-cyan-900 transition-colors leading-snug"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const p = await params;
  const res = await blogService.getBlogBySlug(p.slug);

  if (!res.success || !res.data?.blog) notFound();

  const blog = res.data.blog;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": blog.schema_type || "Article",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.og_image || blog.cover_image,
    datePublished: blog.published_at,
    dateModified: blog.updated_at,
    author: { "@type": "Person", name: blog.author?.name },
    publisher: {
      "@type": "Organization",
      name: "Crackora",
      logo: { "@type": "ImageObject", url: "https://crackora.com/logo.png" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#f8f7f4]">
        {/* ── Cover image hero ──────────────────────────────── */}
        {blog.cover_image && (
          <div className="h-72 sm:h-96 md:h-[480px] bg-cyan-900">
            <div className="relative max-w-6xl h-full m-auto">
              <Image
                src={`${API_BASE_URL}/public${blog.cover_image}`}
                alt={blog.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-60"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/95 via-cyan-950/70 to-cyan-950/10" />

              {/* Overlay content */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-6 max-w-3xl mx-auto w-full">
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold mb-5
                           text-white/60 hover:text-amber-400 transition-colors"
                >
                  <LuArrowLeft size={13} /> Back to all articles
                </Link>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {blog.tags.map((t: any) => (
                      <Link
                        key={t.slug}
                        href={`/blogs?tag=${t.slug}`}
                        className="text-xs bg-amber-500 text-amber-900 font-bold px-3 py-1
                                 rounded-full hover:bg-amber-400 transition-colors"
                      >
                        {t.name}
                      </Link>
                    ))}
                  </div>
                )}

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
                  {blog.title}
                </h1>

                {/* Author + stats row */}
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-2.5">
                    {blog.author?.avatar ? (
                      <Image
                        src={blog.author.avatar}
                        alt={blog.author.name ?? "Author"}
                        width={36}
                        height={36}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="rounded-full border-2 border-amber-400/50"
                      />
                    ) : (
                      <div
                        className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/30
                                    flex items-center justify-center"
                      >
                        <span className="text-sm font-bold text-amber-300">
                          {blog.author?.name?.[0] ?? "C"}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {blog.author?.name}
                      </p>
                      {blog.author?.bio && (
                        <p className="text-xs text-white/50">
                          {blog.author.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-white/50">
                    {blog.published_at && (
                      <span className="flex items-center gap-1">
                        <LuCalendar size={12} />
                        {format(new Date(blog.published_at), "d MMM yyyy")}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <LuClock size={12} /> {blog.read_time} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <LuEye size={12} /> {blog.views} views
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── No cover image fallback header ──────────────── */}
        {!blog.cover_image && (
          <div className="max-w-3xl mx-auto px-6 pt-20 pb-10">
            {/* Back link */}
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold mb-6
                         text-gray-400 hover:text-cyan-900 transition-colors"
            >
              <LuArrowLeft size={13} /> Back to all articles
            </Link>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex gap-2 mb-5 flex-wrap">
                {blog.tags.map((t: any) => (
                  <Link
                    key={t.slug}
                    href={`/blogs?tag=${t.slug}`}
                    className="text-xs bg-amber-500 text-amber-900 font-bold px-3 py-1
                               rounded-full hover:bg-amber-400 transition-colors"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Label + rule */}
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-3">
              Article
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-cyan-900 leading-tight mb-4">
              {blog.title}
            </h1>
            <div className="h-0.5 w-16 bg-amber-500 mb-6" />

            {/* Author + stats row */}
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2.5">
                {blog.author?.avatar ? (
                  <Image
                    src={blog.author.avatar}
                    alt={blog.author.name ?? "Author"}
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full bg-cyan-50 border border-cyan-100
                                  flex items-center justify-center"
                  >
                    <span className="text-sm font-bold text-cyan-800">
                      {blog.author?.name?.[0] ?? "C"}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-cyan-900">
                    {blog.author?.name}
                  </p>
                  {blog.author?.bio && (
                    <p className="text-xs text-gray-400">{blog.author.bio}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400">
                {blog.published_at && (
                  <span className="flex items-center gap-1">
                    <LuCalendar size={12} />
                    {format(new Date(blog.published_at), "d MMM yyyy")}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <LuClock size={12} /> {blog.read_time} min read
                </span>
                <span className="flex items-center gap-1">
                  <LuEye size={12} /> {blog.views} views
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Divider (no-cover only) ──────────────────────── */}
        {!blog.cover_image && (
          <div className="max-w-3xl mx-auto px-6">
            <div className="border-t border-gray-200" />
          </div>
        )}

        {/* ── Main content ─────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-4">
          {/* Categories */}
          {blog.categories && blog.categories.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-8">
              {blog.categories.map((cat: any) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                             font-semibold border-2 hover:scale-105 transition-transform"
                  style={{
                    borderColor: cat.color,
                    color: cat.color,
                    backgroundColor: `${cat.color}15`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          <TableOfContents sections={blog.table_index ?? []} />

          {/* Article body */}
          <div className="bg-white border border-gray-200 rounded-2xl px-6 sm:px-10 py-8 mb-10">
            <article
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-gray-200 mb-10" />

          <CommentsSection blogId={blog.id} />
          <div className="pb-16" />
        </div>
      </main>
    </>
  );
}
