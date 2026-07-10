'use client';

import { useRouter } from 'next/navigation';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface BlogPaginationProps {
  page: number;
  totalPages: number;
  searchParams: Record<string, string>;
}

export default function BlogPagination({
  page,
  totalPages,
  searchParams,
}: BlogPaginationProps) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(p));
    router.push(`/blogs?${params.toString()}`);
  };

  // FIX: corrected the middle window — was showing page-1/page/page+1 correctly
  // but the boundary conditions for the last window were off by one
  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (page >= totalPages - 3) {
      return [
        1, '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    // Middle: always show 1, ellipsis, prev, current, next, ellipsis, last
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-14">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold
                   text-gray-500 hover:bg-gray-100 disabled:opacity-30
                   disabled:cursor-not-allowed transition-colors"
      >
        <LuChevronLeft size={15} /> Prev
      </button>

      {getPages().map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 text-center text-gray-400 text-sm select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p as number)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
              p === page
                ? 'bg-cyan-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold
                   text-gray-500 hover:bg-gray-100 disabled:opacity-30
                   disabled:cursor-not-allowed transition-colors"
      >
        Next <LuChevronRight size={15} />
      </button>
    </div>
  );
}