/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { BlogFiltersProps, Tags } from '@/interfaces/blog.interface';
import { tagService } from '@/services/Blog.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { BiSearch, BiWindowClose } from 'react-icons/bi';





export default function   BlogFilters({
  currentTag,
  currentSearch,
  tags,
}: BlogFiltersProps) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // FIX: use ?? instead of default param to handle explicit undefined from parent

  const [searchInput, setSearchInput] = useState(currentSearch ?? '');
  const [defaultTags, setDefaultTags] = useState<Tags[]>([{name:"All", slug:"all"}]);


  useEffect(() => {
    const getTags = async() => {
        const res = await tagService.getTags();
        setDefaultTags(res?.tags)
    }
    getTags();

  }, []);

  // Sync if parent prop changes (e.g. back navigation)
  useEffect(() => {
    setSearchInput(currentSearch ?? '');
  }, [currentSearch]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else   params.delete(k);
      });
      params.delete('page'); // always reset to page 1 on filter change
      router.push(`/blogs?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const current = currentSearch ?? '';
      if (searchInput !== current) {
        updateParams({ search: searchInput || null });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, currentSearch, updateParams]);

  const toggleTag = (slug: string) =>
    updateParams({ tag: currentTag === slug ? null : slug });

  const clearAll = () => {
    setSearchInput('');
    router.push('/blogs');
  };

  const hasFilters = Boolean(currentTag || currentSearch);

  return (
    <div className="mb-8 space-y-4">
      {/* Search input */}
      <div className="relative max-w-md">
        <BiSearch
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search articles..."
          className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm
                     text-gray-700 bg-white placeholder-gray-400
                     focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100
                     transition-all"
        />
        {searchInput && (
          <button
            onClick={() => {
              setSearchInput('');
              updateParams({ search: null });
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <BiWindowClose size={14} />
          </button>
        )}
      </div>

      {/* Tag pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => updateParams({ tag: null })}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
            !currentTag
              ? 'bg-cyan-900 text-white border-cyan-900'
              : 'border-gray-200 text-gray-500 hover:border-cyan-300 hover:text-cyan-800'
          }`}
        >
          All
        </button>

        {defaultTags.map((tag) => (
          <button
            key={tag.slug}
            onClick={() => toggleTag(tag.slug)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              currentTag === tag.slug
                ? 'bg-amber-500 text-amber-900 border-amber-500'
                : 'border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-700'
            }`}
          >
            {tag.name}
          </button>
        ))}

        {hasFilters && (
          <button
            onClick={clearAll}
            className="ml-1 flex items-center gap-1 text-xs text-gray-400
                       hover:text-red-500 transition-colors font-medium"
          >
            <BiWindowClose size={12} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}