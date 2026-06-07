import React, { useEffect, useMemo, useRef, useState } from "react";

export type TickSector = {
  /** Clockwise starting at TOP of the ring image */
  id: "target" | "investigate" | "consider" | "kickstart";
  title: string;
  color: string;     // card bg
  border: string;    // card border
  badge: string;     // badge bg
  badgeText: string; // badge text color
  body: React.ReactNode;
};

type Props = {
  treeSrc: string;      // tree with oval
  ringSrc: string;      // OUTER ring (rotates)
  centerSrc: string;    // tick (fixed)
  sectors: [TickSector, TickSector, TickSector, TickSector];
  /** inset the oval stage inside the tree art (percentages) */
  ovalInset?: { top?: number; right?: number; bottom?: number; left?: number };
  className?: string;
};

export default function TickWheelInTree({
  treeSrc,
  ringSrc,
  centerSrc,
  sectors,
  ovalInset = { top: 7, right: 12, bottom: 14, left: 12 },
  className = "max-w-5xl mx-auto",
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const dragging = useRef(false);
  const base = useRef(0);

  const norm = (d: number) => ((d % 360) + 360) % 360;

  const angleFromCenter = (x: number, y: number) => {
    const r = stageRef.current!.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let deg = (Math.atan2(y - cy, x - cx) * 180) / Math.PI; // -180..180, 0=+X
    deg = 90 + deg;                                         // 0 at top
    if (deg < 0) deg += 360;
    return deg;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragging.current = true;
    base.current = angleFromCenter(e.clientX, e.clientY) - rotation;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setRotation(angleFromCenter(e.clientX, e.clientY) - base.current);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as Element).releasePointerCapture(e.pointerId);
    dragging.current = false;
  };

  useEffect(() => {
    const h = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowRight") setRotation((r) => r + 15);
      if (ev.key === "ArrowLeft") setRotation((r) => r - 15);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const top = norm(rotation);
  const activeIdx = Math.floor(top / 90) % 4;
  const active = sectors[activeIdx];

  const cardStyle = useMemo(
    () => ({ backgroundColor: active.color, borderColor: active.border }),
    [active]
  );
  const badgeStyle = useMemo(
    () => ({ backgroundColor: active.badge, color: active.badgeText }),
    [active]
  );

  return (
    <div className={`relative w-full ${className}`}>
      {/* tree bg */}
      <img src={treeSrc} alt="Tree" className="w-full h-auto select-none pointer-events-none" draggable={false} />

      {/* oval stage */}
      <div
        className="absolute"
        style={{
          top: `${ovalInset.top ?? 0}%`,
          right: `${ovalInset.right ?? 0}%`,
          bottom: `${ovalInset.bottom ?? 0}%`,
          left: `${ovalInset.left ?? 0}%`,
        }}
      >
        <div ref={stageRef} className="relative w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-6 place-items-center">
          {/* wheel */}
          <div
            className="relative aspect-square w-[min(60vh,44vw)] max-w-full"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            {/* rotating ring */}
            <img
              src={ringSrc}
              alt="Ring"
              className="absolute inset-0 w-full h-full select-none"
              style={{ transform: `rotate(${rotation}deg)` }}
              draggable={false}
            />
            {/* fixed tick */}
            <img
              src={centerSrc}
              alt="Tick"
              className="absolute inset-[18%] w-[64%] h-[64%] object-contain select-none pointer-events-none"
              draggable={false}
            />
          </div>

          {/* context card */}
          <div className="w-full max-w-xl rounded-2xl border-2 shadow-md p-5" style={cardStyle}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-semibold" style={badgeStyle}>
              {active.title}
            </div>
            <div className="mt-3 prose max-w-none text-sm">{active.body}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
