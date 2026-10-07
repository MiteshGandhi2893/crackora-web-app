// LatestYoutubeCard.tsx — SERVER COMPONENT
// Mini card: video frame, title, link.
// Phone: vertical (video on top). Laptop: horizontal (video left).

import { LiteYoutube } from "./LiteYoutube";

const CHANNEL_ID = "UCbT5UpHQRs5ZTJl_3ukZWUA";

const CHANNEL_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL || "https://www.youtube.com";

type Video = {
  id: string;
  title: string;
};

async function getLatestVideo(): Promise<Video | null> {
  if (!CHANNEL_ID) return null;

  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return null;

    const xml = await res.text();

    const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[1];

    if (!entry) return null;

    const id = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];

    const title = entry.match(/<title>(.*?)<\/title>/)?.[1];

    if (!id || !title) return null;

    return {
      id,
      title: decodeXml(title),
    };
  } catch {
    return null;
  }
}

function decodeXml(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export async function LatestYoutubeCard({
  className = "",
}: {
  className?: string;
}) {
  const video = await getLatestVideo();

  const shell = `
    flex h-full w-full min-w-0 flex-col gap-3 lg:flex-row
    rounded-2xl border border-stone-200 bg-cyan-900 p-2.5
    ${className}
  `;

  if (!video) {
    return (
      <section className={`${shell} justify-center lg:flex-col lg:gap-1`}>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
          YouTube
        </span>
        <h3 className="font-roboto text-[13px] font-semibold leading-snug text-cyan-950 sm:text-sm">
          Free lessons and exam tips
        </h3>
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-fit text-xs font-semibold text-amber-700 hover:underline lg:mt-1"
        >
          Visit our channel →
        </a>
      </section>
    );
  }

  return (
    <section className={shell}>
      {/* Video frame */}
      <div className="w-full min-w-0 shrink-0 lg:w-50">
        <div className="overflow-hidden rounded-xl">
          <LiteYoutube id={video.id} title={video.title} />
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col lg:justify-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-400">
          Latest on YouTube
        </span>

        <h3 className="mt-0.5 line-clamp-2 min-w-0 wrap-break-word font-roboto text-[13px] font-semibold leading-snug text-cyan-50 sm:text-sm">
          {video.title}
        </h3>

        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-fit pt-1.5 text-xs font-semibold text-amber-500 transition-colors hover:text-amber-400 hover:underline lg:mt-1.5 lg:pt-0"
        >
          More videos →
        </a>
      </div>
    </section>
  );
}