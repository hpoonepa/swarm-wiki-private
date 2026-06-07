import React from "react";

type VideoEmbedProps = {
  src: string;
  title: string;
  className?: string;
};

export default function VideoEmbed({ src, title, className }: VideoEmbedProps) {
  // Build an autoplaying, muted, looping URL to satisfy browser autoplay policies
  let embedSrc = src;
  try {
    const url = new URL(src, typeof window !== "undefined" ? window.location.href : "http://localhost");
    url.searchParams.set("autoplay", "1");
    url.searchParams.set("muted", "1");
    url.searchParams.set("controls", "1");
    url.searchParams.set("loop", "1");
    url.searchParams.set("preload", "auto");
    embedSrc = url.toString();
  } catch {
    // Fallback to the provided src if URL parsing fails (SSR-safe)
    embedSrc = src.includes("?") ? `${src}&autoplay=1&muted=1&controls=1&loop=1` : `${src}?autoplay=1&muted=1&controls=1&loop=1`;
  }

  return (
    <div className={className ?? ""} style={{ width: "100%" }}>
      {/* Keep a 16:9 area to avoid black bars from letterboxing inside the player */}
      <div className="w-full aspect-video">
        <iframe
          title={title}
          src={embedSrc}
          allow="autoplay; fullscreen; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          allowFullScreen
          style={{ border: 0 }}
          className="w-full h-full rounded-2xl"
        />
      </div>
    </div>
  );
}
