'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LuClock, LuEye } from 'react-icons/lu';
import { formatDistanceToNow } from 'date-fns';
import {API_BASE_URL} from '@/services/api.service';
import { BlogCardProps } from '@/interfaces/blog.interface';


export default function BlogCard({ blog }: BlogCardProps) {
  // FIX: guard against null/invalid date — published_at may be empty on some records
  const timeAgo = blog.published_at
    ? formatDistanceToNow(new Date(blog.published_at), { addSuffix: true })
    : null;

  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group flex flex-col rounded-2xl border border-gray-100 overflow-hidden
                 bg-white hover:shadow-md hover:border-cyan-200 transition-all duration-200"
    >
      {/* Cover */}
      <div className="relative w-full h-48 bg-cyan-50 overflow-hidden shrink-0">
        {blog.cover_image ? (
          <Image
            src={`${API_BASE_URL}/public${blog.cover_image}`}
            alt={`${API_BASE_URL}/public${blog.cover_image}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center
                          bg-linear-to-br from-cyan-50 to-cyan-100">
            <svg
              className="w-10 h-10 text-cyan-200"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5
                   7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5
                   2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125
                   1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {blog.tags.slice(0, 2).map((t) => (
              <span
                key={t.slug}
                className="text-xs bg-amber-50 text-amber-700 font-semibold
                           px-2.5 py-0.5 rounded-full"
              >
                {t.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-cyan-900 font-bold text-base leading-snug mb-2
                       group-hover:text-amber-600 transition-colors line-clamp-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm line-clamp-3 flex-1 leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {/* Author */}
          <div className="flex items-center gap-2 min-w-0">
            {blog.author_avatar ? (
              <Image
                src={blog.author_avatar}
                alt={blog.author_name}
                width={22}
                height={22}
                className="rounded-full shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center
                              justify-center shrink-0">
                <span className="text-cyan-800 text-xs font-bold">
                  {blog.author_name?.[0] ?? 'C'}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-500 font-medium truncate">
              {blog.author_name}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-gray-400 text-xs shrink-0">
            <span className="flex items-center gap-1">
              <LuClock size={11} /> {blog.read_time}m
            </span>
            <span className="flex items-center gap-1">
              <LuEye size={11} /> {blog.views}
            </span>
            {timeAgo && (
              <span className="hidden sm:block">{timeAgo}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}