"use client";
// LiteYouTube.tsx — CLIENT COMPONENT
// Shows only the thumbnail until clicked, then swaps in the real player.
// This keeps the page fast: YouTube's heavy scripts load only on demand.
// Uses youtube-nocookie.com (privacy-enhanced mode).
// Keeps a 16:9 shape; the parent decides how wide it is.

import { useState } from "react";
import Image from "next/image";
import { BiPlay } from "react-icons/bi";

export function LiteYoutube({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 focus-visible:outline-2 focus-visible:outline-amber-500"
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 300px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg transition-transform group-hover:scale-110">
            <BiPlay className="h-8 w-8" aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}