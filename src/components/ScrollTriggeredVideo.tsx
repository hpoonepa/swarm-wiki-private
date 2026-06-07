import { useEffect, useRef, useState } from "react";

interface ScrollVideoProps {
  videoSrc: string;
  aspectRatio?: string;
  className?: string;
}

export default function ScrollTriggeredVideo({
  videoSrc,
  aspectRatio = "aspect-[16/9]",
  className = "",
}: ScrollVideoProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  // Load video on mount
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const baseParams =
      "loop=1&muted=1&title=0&warningTitle=0&controlBar=0&peertubeLink=0";

    iframe.src = `${videoSrc}?${baseParams}&autoplay=0`;
  }, [videoSrc]);

  // Observe visibility
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsFullyVisible(entry.isIntersecting);
      },
      { threshold: 0.5 } // adjust as needed
    );

    observer.observe(iframe);
    return () => observer.disconnect();
  }, []);

  // Pause or play depending on visibility
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Wait a little to make sure iframe is loaded
    const timer = setTimeout(() => {
      const method = isFullyVisible ? "play" : "pause";

      // Correct Peertube API message
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          type: "call",
          method: method,
          arguments: [],
        }),
        "*"
      );
    }, 500); // 0.5s delay ensures iframe is ready

    return () => clearTimeout(timer);
  }, [isFullyVisible]);

  return (
    <div
      className={`bg-[#FFFBF2] rounded-2xl border p-6 flex items-center justify-center ${className}`}
    >
      <div className={`w-full relative scale-[65%] sm:scale-100 overflow-hidden rounded-lg ${aspectRatio}`}>
        <iframe
          ref={iframeRef}
          title="Scroll-Triggered Video"
          className="absolute top-0 left-0 w-full h-full"
          allow="fullscreen"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        ></iframe>
      </div>
    </div>
  );
}