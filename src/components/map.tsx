import React from "react";
import { useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Responsive full-width band with a left image and right text.
 * Mobile-friendly: Stacks and centers content on small screens.
 */
export default function Map() {
  // Scroll-driven counter setup
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const START_CASES = 100000;
  const END_CASES = 600000;
  const START_YEAR = 2025;
  const END_YEAR = 2050;

  // Track scroll progress through this section (0 -> 1)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Starts when section enters viewport bottom, ends when it leaves at top
    offset: ["start end", "end start"],
  });

  // Map progress to numeric ranges and smooth them with springs
  const rawCases = useTransform(scrollYProgress, [0, 1], [START_CASES, END_CASES]);
  const rawYear = useTransform(scrollYProgress, [0, 1], [START_YEAR, END_YEAR]);
  const smoothCases = useSpring(rawCases, { stiffness: 120, damping: 20, mass: 0.4 });
  const smoothYear = useSpring(rawYear, { stiffness: 120, damping: 20, mass: 0.4 });

  // Keep rounded integers for display with thousand separators; guard NaN
  const [displayCases, setDisplayCases] = React.useState<number>(START_CASES);
  const [displayYear, setDisplayYear] = React.useState<number>(START_YEAR);
  useMotionValueEvent(smoothCases, "change", (latest) => {
    const n = Math.round(latest as number);
    if (Number.isFinite(n)) {
      // Clamp to range to avoid floating rounding artifacts; supports scrolling both directions
      const lo = Math.min(START_CASES, END_CASES);
      const hi = Math.max(START_CASES, END_CASES);
      setDisplayCases(Math.max(lo, Math.min(hi, n)));
    }
  });
  useMotionValueEvent(smoothYear, "change", (latest) => {
    const y = Math.round(latest as number);
    if (Number.isFinite(y)) {
      setDisplayYear(Math.min(END_YEAR, Math.max(START_YEAR, y)));
    }
  });

  return (
    <section ref={sectionRef} className="relative w-full">
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[38vw] max-h-[360px] min-h-[160px] bg-[#E9C59C]/90"
        aria-hidden
      />

      {/* Added horizontal padding for mobile */}
      <div className="relative scale-75 sm:scale-100 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-0">
          {/* Left: Map image */}
          {/* Centered on mobile (mx-auto), margin only on desktop (md:ml-8) */}
          <div className="order-2 mx-auto w-full max-w-md md:order-1 md:ml-8 md:max-w-none">
            <div className="w-full overflow-hidden rounded-2xl bg-white">
              <img
                src="https://static.igem.wiki/teams/5612/mainlayout/map.webp"
                alt="Map showing predicted case increases"
                className="h-[90%] w-full object-contain"
              />
            </div>
          </div>

          {/* Right: counter + headline text */}
          {/* Centered text/items on mobile, left-aligned on desktop */}
          <div className="order-1 flex flex-col items-center text-center md:order-2 md:items-start md:text-left">
            {/* Scroll-driven counter (cases + year) */}
            <div className="mb-2 sm:mb-3">
              <div className="flex flex-col">
                <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 md:justify-start">
                  <span
                    className="font-extrabold text-[#5C3A22] text-5xl tabular-nums md:text-[4vw]"
                    aria-live="polite"
                    aria-label={`${displayCases.toLocaleString()} cases in ${displayYear}`}
                  >
                    {displayCases.toLocaleString()}
                  </span>
                  <span className="font-semibold text-[#5C3A22] text-lg md:text-[1.4vw]">
                    cases estimated by
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 md:justify-start">
                  <span className="font-bold text-[#5C3A22] text-4xl md:text-[2.8vw]">
                    {displayYear}
                  </span>
                  <span className="font-semibold tracking-wide text-[#5C3A22] text-2xl md:text-[2vw]">
                    in Eastern United States
                  </span>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-extrabold leading-tight text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.25)] sm:text-3xl lg:text-4xl">
              {/* Headline text can go here */}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}