// src/components/BackToCatalog.tsx
// No hooks and no "use client": it works inside server or client components.
//
// It always points at the catalog, whichever way the student arrived
// (catalog card, header menu, Google, a shared link). It describes where this
// page lives in the site, not the student's browsing history.
import Link from "next/link";
import { BiChevronLeft } from "react-icons/bi";

interface BackToCatalogProps {
  href?: string;
  label?: string;
}

export function BackToCatalog({
  href = "/courses",
  label = "Back to catalog",
}: BackToCatalogProps) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 py-1.5 pr-4 pl-2 text-sm font-medium text-white/85! transition-colors hover:bg-white/10 hover:text-white! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 motion-reduce:transition-none"
    >
      <BiChevronLeft className="h-5 w-5" aria-hidden />
      {label}
    </Link>
  );
}