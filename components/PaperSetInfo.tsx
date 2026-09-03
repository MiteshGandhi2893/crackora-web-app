/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useRef, useState } from "react";
import { RequestCallback } from "./forms/RequestCallbackForm";
import { STARS } from "@/lib/util";
import {
  FaqEntry,
  PaperItem,
  PaperSet,
} from "@/interfaces/papersets.interface";
import { useAuth } from "@/providers/AuthProvider";
import { paperSetService } from "@/services/previouspaperset.service";
import { BiReset, BiZoomIn, BiZoomOut } from "react-icons/bi";

/* ── Lock icon ────────────────────────────────────────────────────────── */
function LockIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ── FAQ schema (SEO) ─────────────────────────────────────────────────── */
function FaqSchema({ items }: { items: FaqEntry[] }) {
  if (!items.length) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ── FAQ accordion ────────────────────────────────────────────────────── */
function FaqAccordion({ items }: { items: FaqEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!items.length) return null;

  return (
    <section className="mt-10" id="faq-section">
      <div className="mb-6">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-1">
          Got questions?
        </p>
        <h2 className="text-2xl font-bold text-cyan-900">
          Frequently asked questions
        </h2>
        <div className="h-0.5 w-12 bg-amber-500 mt-3" />
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={item.id || i}
              className={`border-2 rounded-2xl overflow-hidden transition-all duration-200
                ${
                  isOpen
                    ? "border-amber-300 shadow-sm"
                    : "border-gray-100 hover:border-gray-200"
                }`}
            >
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-left"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                    text-xs font-bold transition-colors
                    ${isOpen ? "bg-amber-500 text-white" : "bg-cyan-50 text-amber-500"}`}
                >
                  {i + 1}
                </span>
                <span
                  className={`flex-1 text-sm font-semibold leading-snug transition-colors
                    ${isOpen ? "text-cyan-900" : "text-gray-700"}`}
                >
                  {item.question}
                </span>
                <svg
                  className={`flex-shrink-0 w-4 h-4 transition-transform duration-200
                    ${isOpen ? "rotate-180 text-amber-500" : "text-gray-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0">
                  <div className="ml-11 text-sm text-gray-600 leading-relaxed border-l-2 border-amber-300 pl-4">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SolutionViewerModal({
  itemId,
  onClose,
}: {
  itemId: string;
  onClose: () => void;
}) {
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 4;
  const ZOOM_STEP = 0.25;

  const containerRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragStart = useRef({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartZoom = useRef(1);

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

  const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  // How far the image can be panned before it starts leaving the container
  function getBounds(z: number) {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return {
      x: Math.max(0, (rect.width * (z - 1)) / 2),
      y: Math.max(0, (rect.height * (z - 1)) / 2),
    };
  }

  function clampPosition(pos: { x: number; y: number }, z: number) {
    const bounds = getBounds(z);
    return {
      x: clamp(pos.x, -bounds.x, bounds.x),
      y: clamp(pos.y, -bounds.y, bounds.y),
    };
  }

  // Load total page count once
  useEffect(() => {
    (async () => {
      setLoading(false);
      const totalPages = await paperSetService.getSolutionInfo(itemId);
      setTotalPages(totalPages);
      setLoading(false);
    })();
  }, [itemId]);

  // Load the current page as a blob whenever page changes
  useEffect(() => {
    if (totalPages === 0) return;
    let cancelled = false;
    let currentUrl: string | null = null;

    (async () => {
      setPageLoading(true);
      const url = await paperSetService.getSolutionPageBlob(itemId, page);
      if (cancelled) return;
      currentUrl = url!;
      setImgUrl(url);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setPageLoading(false);
    })();

    return () => {
      cancelled = true;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [itemId, page, totalPages]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "+" || e.key === "=") handleZoomIn();
      else if (e.key === "-" || e.key === "_") handleZoomOut();
      else if (e.key === "0") handleResetZoom();
      else if (e.key === "ArrowLeft") setPage((p) => Math.max(1, p - 1));
      else if (e.key === "ArrowRight")
        setPage((p) => Math.min(totalPages, p + 1));
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages, onClose]);

  async function handleSave() {
    // const res = await paperSetService.saveToDashboard(itemId);
    // if (res.success) {
    //   setSaved(true);
    // } else {
    //   setError("Couldn't save right now.");
    // }
  }

  function handleZoomIn() {
    setZoom((z) => {
      const nz = clamp(+(z + ZOOM_STEP).toFixed(2), MIN_ZOOM, MAX_ZOOM);
      setPosition((p) => (nz <= 1 ? { x: 0, y: 0 } : clampPosition(p, nz)));
      return nz;
    });
  }

  function handleZoomOut() {
    setZoom((z) => {
      const nz = clamp(+(z - ZOOM_STEP).toFixed(2), MIN_ZOOM, MAX_ZOOM);
      setPosition((p) => (nz <= 1 ? { x: 0, y: 0 } : clampPosition(p, nz)));
      return nz;
    });
  }

  function handleResetZoom() {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }

  function handleDoubleClick() {
    if (zoom > 1) {
      handleResetZoom();
    } else {
      setZoom(2);
    }
  }

  // Desktop scroll / trackpad zoom
  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    setZoom((z) => {
      const nz = clamp(+(z + delta).toFixed(2), MIN_ZOOM, MAX_ZOOM);
      setPosition((p) => (nz <= 1 ? { x: 0, y: 0 } : clampPosition(p, nz)));
      return nz;
    });
  }

  // Pointer handlers: unify mouse drag + single-finger touch drag + two-finger pinch
  function onPointerDown(e: React.PointerEvent) {
    if (zoom <= 1) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      lastPosition.current = position;
    } else if (pointers.current.size === 2) {
      setIsDragging(false);
      const pts = Array.from(pointers.current.values());
      pinchStartDist.current = distance(pts[0], pts[1]);
      pinchStartZoom.current = zoom;
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStartDist.current) {
      const pts = Array.from(pointers.current.values());
      const dist = distance(pts[0], pts[1]);
      const scale = dist / pinchStartDist.current;
      const nz = clamp(
        +(pinchStartZoom.current * scale).toFixed(2),
        MIN_ZOOM,
        MAX_ZOOM,
      );
      setZoom(nz);
      setPosition((p) => clampPosition(p, nz));
      return;
    }

    if (isDragging && pointers.current.size === 1) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition(
        clampPosition(
          { x: lastPosition.current.x + dx, y: lastPosition.current.y + dy },
          zoom,
        ),
      );
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    pinchStartDist.current = null;

    if (pointers.current.size === 0) {
      setIsDragging(false);
    } else if (pointers.current.size === 1) {
      // Went from pinch back down to a single finger — resume dragging from there
      const [remaining] = Array.from(pointers.current.values());
      dragStart.current = remaining;
      lastPosition.current = position;
      setIsDragging(true);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="bg-white w-full h-screen max-h-screen flex flex-col overflow-hidden shadow-2xl select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar: page indicator + zoom controls */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-cyan-900">
            {totalPages > 0 && `Page ${page} of ${totalPages}`}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= MIN_ZOOM}
              className="p-1.5 rounded-full text-cyan-700 hover:bg-cyan-50 disabled:opacity-30"
              aria-label="Zoom out"
            >
              <BiZoomOut size={18} />
            </button>
            <span className="text-xs font-medium text-gray-500 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= MAX_ZOOM}
              className="p-1.5 rounded-full text-cyan-700 hover:bg-cyan-50 disabled:opacity-30"
              aria-label="Zoom in"
            >
              <BiZoomIn size={18} />
            </button>
            <button
              onClick={handleResetZoom}
              disabled={zoom === 1 && position.x === 0 && position.y === 0}
              className="p-1.5 rounded-full text-cyan-700 hover:bg-cyan-50 disabled:opacity-30 ml-1"
              aria-label="Reset zoom"
            >
              <BiReset size={18} />
            </button>
          </div>
        </div>

        {/* Image viewer */}
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden bg-gray-50 flex items-center justify-center p-4 relative touch-none"
          onWheel={handleWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {(loading || pageLoading) && (
            <p className="text-sm text-gray-500">Loading…</p>
          )}
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {!loading && !pageLoading && !error && imgUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgUrl}
              alt={`Solution page ${page}`}
              draggable={false}
              onDoubleClick={handleDoubleClick}
              onContextMenu={(e) => e.preventDefault()}
              className="max-w-full max-h-full object-contain shadow-sm rounded"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transition: isDragging ? "none" : "transform 150ms ease-out",
                cursor:
                  zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                touchAction: "none",
              }}
            />
          )}
          {zoom > 1 && !isDragging && (
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] text-gray-400 bg-white/70 px-2 py-0.5 rounded-full pointer-events-none">
              Drag to pan • Double-tap to reset
            </span>
          )}
        </div>

        {/* Bottom bar: prev / save / close / next */}
        <div className="flex items-center justify-center px-4 py-3 border-t border-gray-100 lg:gap-14 gap-5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || totalPages <= 1}
            className="text-sm font-medium text-cyan-50 disabled:opacity-30 bg-cyan-900 px-2 py-1 rounded cursor-pointer"
          >
            ← Prev
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saved}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500 text-white disabled:opacity-50 cursor-pointer"
            >
              {saved ? "Saved" : "Save to dashboard"}
            </button>
            <button
              onClick={onClose}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Close
            </button>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages <= 1}
            className="text-sm font-medium text-cyan-50 disabled:opacity-30 bg-cyan-900 px-2 py-1 rounded cursor-pointer"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Paper row card — dumb, no auth logic of its own ─────────────────── */
function PaperRow({
  item,
  isLoggedIn,
  onViewSolution,
}: {
  item: PaperItem;
  isLoggedIn: boolean;
  onViewSolution: (itemId: string) => void;
}) {
  const hasSolution =
    Boolean(item.solution_page_count) || Boolean(item.solution_video_url);

  function handleDownload() {
    if (!item.id) return;
    const link = document.createElement("a");
    link.href = paperSetService.downloadUrl(item.id);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 px-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white">
      <div className="min-w-0">
        <p className="text-lg font-semibold text-cyan-900 truncate">
          {item.name}
        </p>
        <p className="text-sm text-gray-400 mt-0.5">
          {item.slot}{" "}
          {item.total_questions ? `· ${item.total_questions} questions` : ""}+
          {item.duration_minutes ? `· ${item.duration_minutes} minutes` : ""}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleDownload}
          className="flex-1 sm:flex-none text-xs font-semibold px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"
        >
          Download Paper
        </button>
        {hasSolution ? (
          <button
            onClick={() => item.id && onViewSolution(item.id)}
            className="flex-1 sm:flex-none text-xs font-semibold px-3 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white transition-colors flex items-center justify-center gap-1.5"
          >
            {!isLoggedIn && <LockIcon />}
            View Solution
          </button>
        ) : (
          <span className="flex-1 sm:flex-none text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 text-gray-400 text-center cursor-not-allowed">
            No solution yet
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────────── */
export function PaperSetInfo({ paperSet }: { paperSet: PaperSet }) {
  const [years, setYears] = useState<string[]>([]);
  const { user, openAuth, setPostAuthAction } = useAuth();
  const isLoggedIn = !!user;

  const [viewerItemId, setViewerItemId] = useState<string | null>(null);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const prevLoggedIn = useRef(isLoggedIn);

  useEffect(() => {
    setYears(
      Object.keys(paperSet.paper_items).sort((a, b) => Number(b) - Number(a)),
    );
  }, [paperSet]);

  useEffect(() => {
    if (!prevLoggedIn.current && isLoggedIn) {
      setJustUnlocked(true);
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);

  function handleViewSolution(itemId: string) {
    if (!isLoggedIn) {
      setPostAuthAction(() => () => setViewerItemId(itemId));
      openAuth();
      return;
    }
    setViewerItemId(itemId);
  }

  const faqItems = paperSet.faqs || [];

  return (
    <div className="w-full bg-[#f8f7f4]">
      <FaqSchema items={faqItems} />

      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-cyan-950 via-cyan-900 to-cyan-800">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[#020617]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(8,51,80,1),transparent_60%)]" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
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

        <div className="relative z-10 lg:max-w-6xl sm:max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 flex flex-col sm:flex-row gap-8 sm:gap-10 items-center mt-15 lg:mt-25">
          <div className="flex-1 flex flex-col gap-3 sm:gap-4 text-white text-center sm:text-left">
            <span className="mx-auto sm:mx-0 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full w-fit">
              Previous year papers
            </span>
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold leading-tight">
              {paperSet?.title}
            </h1>
            <div className="h-0.5 w-16 bg-amber-500 mx-auto sm:mx-0" />
          </div>

          <div className="relative w-80 sm:w-100 shrink-0">
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-24
                            bg-amber-400/20 blur-3xl rounded-full pointer-events-none"
            />
            <div
              className="relative bg-[#f8f7f4] rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                            ring-1 ring-white/20"
            >
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 mb-3">
                Need guidance?
              </p>
              <RequestCallback
                sourcePage="paperset"
                sourceSlug={paperSet.slug}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="lg:max-w-6xl sm:max-w-3xl mx-auto px-4 lg:px-10 py-8 lg:py-12 flex flex-col gap-8">
        {/* Papers by year */}
        <div className="w-full flex flex-col gap-6">
          {years.map((year) => (
            <div key={year} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-amber-600">
                  Year {year}
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="grid gap-2">
                {paperSet.paper_items[year].map((item, i) => (
                  <PaperRow
                    key={item.id || i}
                    item={item}
                    isLoggedIn={isLoggedIn}
                    onViewSolution={handleViewSolution}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Unlock success banner — same tone as CollegeCompareTool's */}
        {justUnlocked && isLoggedIn && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="text-[12px] text-emerald-700 font-medium">
              You`re logged in — solutions are unlocked.
            </p>
          </div>
        )}

        {/* Exam content + FAQ */}
        <main className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-6 sm:px-8 sm:py-8 w-full">
          <div
            className="exam-content prose max-w-none prose-headings:text-cyan-900"
            dangerouslySetInnerHTML={{ __html: paperSet?.content || "" }}
          />
        </main>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-6 sm:px-8 sm:py-8 w-full">
          {faqItems.length > 0 && <FaqAccordion items={faqItems} />}
        </div>
      </div>

      {/* Single modal instance, driven by main component state */}
      {viewerItemId && (
        <SolutionViewerModal
          itemId={viewerItemId}
          onClose={() => setViewerItemId(null)}
        />
      )}
    </div>
  );
}
