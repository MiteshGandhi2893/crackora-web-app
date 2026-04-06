import Link from 'next/link';
import Image from 'next/image';
import { LuArrowRight, LuClock, LuEye } from 'react-icons/lu';
import { formatDistanceToNow } from 'date-fns';
import type { BlogListItem } from '@/services/Blog.service';

interface BlogsSectionProps {
  blogs: BlogListItem[];
}

export default function BlogsSection({ blogs }: BlogsSectionProps) {
  if (!blogs.length) return null;

  const featured = blogs[0];
  const rest = blogs.slice(1, 4);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-2">
              From the blog
            </p>
            <h2 className="text-3xl font-bold text-cyan-900">
              Insights for your MCA journey
            </h2>
          </div>
          <Link
            href="/blogs"
            className="hidden md:flex items-center gap-2 text-cyan-900 font-semibold text-sm
                       border-b-2 border-amber-500 pb-0.5 hover:text-amber-600 transition-colors"
          >
            View all posts <LuArrowRight size={15} />
          </Link>
        </div>

        {/* Featured + side cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Featured — 2 cols */}
          <Link
            href={`/blogs/${featured.slug}`}
            className="lg:col-span-2 group relative rounded-2xl overflow-hidden
                       bg-cyan-900 text-white flex flex-col min-h-[360px]"
          >
            {featured.cover_image && (
              <Image
                src={featured.cover_image}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300"
              />
            )}
            <div className="relative z-10 flex flex-col justify-end h-full p-8">
              {featured.tags.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {featured.tags.slice(0, 2).map((t) => (
                    <span
                      key={t.slug}
                      className="text-xs bg-amber-500 text-amber-900 font-bold px-2.5 py-0.5 rounded-full"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
              <h3 className="text-2xl font-bold leading-snug mb-3 group-hover:text-amber-400 transition-colors">
                {featured.title}
              </h3>
              <p className="text-white/70 text-sm line-clamp-2 mb-4 leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4 text-white/50 text-xs">
                <span className="flex items-center gap-1">
                  <LuClock size={11} /> {featured.read_time} min
                </span>
                <span className="flex items-center gap-1">
                  <LuEye size={11} /> {featured.views}
                </span>
                <span>
                  {formatDistanceToNow(new Date(featured.published_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </Link>

          {/* Side cards */}
          <div className="flex flex-col gap-4">
            {rest.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="group flex gap-3 p-4 rounded-xl border border-gray-100
                           hover:border-cyan-100 hover:bg-cyan-50/50 transition-all duration-200"
              >
                {blog.cover_image && (
                  <div className="w-[72px] h-[72px] rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={blog.cover_image}
                      alt={blog.title}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-between min-w-0">
                  {blog.tags[0] && (
                    <span className="text-xs text-amber-600 font-semibold">
                      {blog.tags[0].name}
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-cyan-900 leading-snug mt-0.5
                                 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h4>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                    <span className="flex items-center gap-1"><LuClock size={10} /> {blog.read_time}m</span>
                    <span>{formatDistanceToNow(new Date(blog.published_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="flex md:hidden justify-center mt-8">
          <Link
            href="/blogs"
            className="flex items-center gap-2 text-cyan-900 font-semibold border-b-2 border-amber-500 text-sm"
          >
            View all posts <LuArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}