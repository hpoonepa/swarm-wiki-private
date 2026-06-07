import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/** Small helper: cubic Bézier at parameter t (0..1) */
function cubicPoint(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

/** Derivative for tangent angle (optional; nice polish) */
function cubicTangent(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
) {
  const u = 1 - t;
  // derivative of cubic Bézier
  const dx =
    3 * u * u * (p1.x - p0.x) +
    6 * u * t * (p2.x - p1.x) +
    3 * t * t * (p3.x - p2.x);
  const dy =
    3 * u * u * (p1.y - p0.y) +
    6 * u * t * (p2.y - p1.y) +
    3 * t * t * (p3.y - p2.y);
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

type TickScrollerProps = {
  /** Overall scrolling container (your page root) */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Anchor over the bush image (starting point) */
  startRef: React.RefObject<HTMLDivElement>;
  /** Section that contains the Map (used for scroll range) */
  mapSectionRef: React.RefObject<HTMLElement>;
  /** Anchor on/near the Hand (end point) */
  endRef: React.RefObject<HTMLDivElement>;
  /** Optional: How far to go right before dropping down (px). If omitted, auto from map’s right edge. */
  bendXPadding?: number;
  /** Optional: how much vertical extra drop after end (px) to make the "attach" feel snappy */
  overshoot?: number;
  /** Optional: tick image URL */
  tickUrl?: string;
  /** Optional size in px */
  size?: number;
};

const TickScroller: React.FC<TickScrollerProps> = ({
  containerRef,
  startRef,
  mapSectionRef,
  endRef,
  bendXPadding = 24,
  overshoot = 16,
  tickUrl = "https://static.igem.wiki/teams/5612/mainlayout/tick.webp",
  size = 56,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Absolute document coordinates of our anchors and bend control
  const [points, setPoints] = useState<{
    p0: { x: number; y: number };
    p1: { x: number; y: number };
    p2: { x: number; y: number };
    p3: { x: number; y: number };
  } | null>(null);

  // We’ll drive progress by the scroll through the map + hand region:
  const { scrollYProgress } = useScroll({
    target: mapSectionRef,
    // Start when the map's top hits 70% of viewport; end when its bottom passes 30%
    offset: ["start 0.7", "end 0.3"],
  });

  // Smoother motion
  const t = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 120,
    damping: 30,
    mass: 0.25,
  });

  // Recompute geometry on layout changes
  const compute = () => {
    if (!overlayRef.current || !startRef.current || !endRef.current) return;

    const docY = window.scrollY || window.pageYOffset;

    const sRect = startRef.current.getBoundingClientRect();
    const eRect = endRef.current.getBoundingClientRect();

    // Start at center of start anchor
    const p0 = {
      x: sRect.left + sRect.width / 2,
      y: docY + sRect.top + sRect.height / 2,
    };

    // End at center of end anchor (slightly overshoot vertically for a nice snap)
    const p3 = {
      x: eRect.left + eRect.width / 2,
      y: docY + eRect.top + eRect.height / 2 + overshoot,
    };

    // Find a bend X near the right edge of the map area, so the tick moves right then down.
    let bendX = p0.x + 200; // fallback
    if (mapSectionRef.current) {
      const mRect = mapSectionRef.current.getBoundingClientRect();
      bendX = Math.min(
        window.innerWidth - bendXPadding,
        mRect.right - bendXPadding
      );
    }

    // Control points:
    // p1: move horizontally toward the right edge, staying near start Y
    const p1 = { x: bendX, y: p0.y };
    // p2: straight down near the right edge, close to end Y
    const p2 = { x: bendX, y: p3.y };

    setPoints({ p0, p1, p2, p3 });
  };

  useLayoutEffect(() => {
    compute();
    // Recompute on resize/orientation
    const ro = new ResizeObserver(() => compute());
    ro.observe(document.body);
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("orientationchange", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", compute);
      window.removeEventListener("orientationchange", compute);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Current position + rotation along the curve
  const [pos, rot] = useMemo(() => {
    if (!points) return [({ x: -9999, y: -9999 } as const), 0] as const;
    // We return functions that read current t
    return [
      (tt: number) => cubicPoint(tt, points.p0, points.p1, points.p2, points.p3),
      (tt: number) =>
        cubicTangent(tt, points.p0, points.p1, points.p2, points.p3),
    ] as const;
  }, [points]);

  return (
    <div
      ref={overlayRef}
      className="fixed pointer-events-none inset-0 z-[60]"
      aria-hidden
    >
      {/* The mover */}
      <motion.div
        style={{
          // live-compute x/y from t; framer allows function motion values:
          x: t.to((tt) => (points ? pos(tt).x : -9999)),
          y: t.to((tt) => (points ? pos(tt).y : -9999)),
          rotate: t.to((tt) => (points ? rot(tt) : 0)),
          translateX: "-50%",
          translateY: "-50%",
          width: size,
          height: size,
        }}
      >
        <img
          src={tickUrl}
          alt=""
          draggable={false}
          className="select-none"
          style={{ width: "100%", height: "100%" }}
        />
      </motion.div>
    </div>
  );
};

export default TickScroller;
