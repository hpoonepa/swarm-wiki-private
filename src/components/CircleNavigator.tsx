import React, { useMemo, useId } from "react";

type Props = {
  progress: number; // Overall progress (e.g., 0 to 12 for 3 iterations)
  iterations: number; // The total number of iterations/loops
  colors?: string[]; // An array of colors, one for each iteration
  size?: number;
  ringWidth?: number;
  bgColor?: string;
  textColor?: string;
};

// Default colors if none are provided
const defaultColors = ["#814419", "#A5693B", "#C98E5D", "#EDC280"];

export default function CircleNavigator({
  progress,
  iterations,
  colors = defaultColors,
  size = 320,
  ringWidth = 44,
  bgColor = "#ddd7cdff",
  textColor = "#cabeb0ff",
}: Props) {
  const clipId = useId();

  // --- Geometry ---
  const r = (size - ringWidth) / 2;
  const outerR = r + ringWidth / 2;
  const innerR = r - ringWidth / 2;
  const cx = size / 2;
  const cy = size / 2;

  const totalSegments = 4; // Always 4: Learn, Design, Build, Test
  const labels = useMemo(() => [ "design", "build", "test", "learn"], []);

  const currentIterationIndex = Math.floor(progress / 4);

  const getSegmentPath = (startAngle: number, endAngle: number) => {
    // Clamp endAngle to prevent graphical glitches if it slightly exceeds 360
    endAngle = Math.min(endAngle, startAngle + 359.99); // Use 359.99 to avoid 360-degree arc issues
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    const x1 = cx + outerR * Math.cos(startRad);
    const y1 = cy + outerR * Math.sin(startRad);
    const x2 = cx + outerR * Math.cos(endRad);
    const y2 = cy + outerR * Math.sin(endRad);
    const x3 = cx + innerR * Math.cos(endRad);
    const y3 = cy + innerR * Math.sin(endRad);
    const x4 = cx + innerR * Math.cos(startRad);
    const y4 = cy + innerR * Math.sin(startRad);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };

  const labelPolar = (i: number) => {
    const segmentAngle = 360 / totalSegments;
    const midAngle = segmentAngle * i + segmentAngle / 2;
    const angle = (midAngle - 90) * (Math.PI / 180);
    let rotation = midAngle;
    if (midAngle > 90 && midAngle < 270) rotation = midAngle + 180;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), rotation };
  };

  // Determine the active index for label highlighting based on the top-most layer
  const overallActiveIndex = Math.floor(progress % 4);

  return (
    <div aria-hidden style={{ pointerEvents: "none" }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Engineering cycle progress"
        style={{ display: "block" }}
      >
        <defs>
          <clipPath id={clipId}>
            <path
                d={`M ${cx} ${cy} m -${outerR}, 0 a ${outerR} ${outerR} 0 1 0 ${outerR * 2} 0 a ${outerR} ${outerR} 0 1 0 -${outerR * 2} 0 M ${cx} ${cy} m -${innerR}, 0 a ${innerR} ${innerR} 0 1 1 ${innerR * 2} 0 a ${innerR} ${innerR} 0 1 1 -${innerR * 2} 0`}
                fillRule="evenodd"
            />
          </clipPath>
        </defs>

        {/* Background ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={bgColor} strokeWidth={ringWidth} opacity="0.35"/>

        {/* Fills for each iteration, clipped to the donut shape */}
        <g clipPath={`url(#${clipId})`}>
          {Array.from({ length: iterations }).map((_, i) => {
            const progressForThisRing = Math.max(0, Math.min(4, progress - i * 4));
            if (progressForThisRing <= 0) return null;

            const iterationColor = colors[i % colors.length];
            
            // If the ring is full, draw a full circle clipped to the donut shape.
            // This avoids issues with rendering a 360-degree SVG arc path.
            if (progressForThisRing >= 4) {
              return (
                <circle
                  key={`fill-full-${i}`}
                  cx={cx}
                  cy={cy}
                  r={outerR} // Use outer radius to ensure it covers the whole clipped area
                  fill={iterationColor}
                />
              );
            }

            const fillAngle = (progressForThisRing / totalSegments) * 360;
            return (
              <path
                key={`fill-partial-${i}`}
                d={getSegmentPath(0, fillAngle)}
                fill={iterationColor}
              />
            );
          })}
        </g>

        {/* Separators (drawn on top) */}
        {Array.from({ length: totalSegments }).map((_, i) => {
            const angle = (360 / totalSegments) * i;
            const rad = (angle - 90) * (Math.PI / 180);
            const x1 = cx + innerR * Math.cos(rad);
            const y1 = cy + innerR * Math.sin(rad);
            const x2 = cx + outerR * Math.cos(rad);
            const y2 = cy + outerR * Math.sin(rad);
            return (<line key={`sep-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>);
        })}
        
        {/* Labels (drawn on top) */}
        {labels.map((txt, i) => {
            const { x, y, rotation } = labelPolar(i);
            const isCurrent = i === overallActiveIndex;
            let labelFill = textColor;

            const progressInCurrentSegment = progress % 1;

            if(i < overallActiveIndex || iterations == currentIterationIndex || (isCurrent && progressInCurrentSegment > 0.5)) {
              labelFill = "#F5F0E8";
            }

            return (
              <text
                key={txt} x={x} y={y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={16} fontWeight={isCurrent ? 700 : 600}
                fill={labelFill}
                transform={`rotate(${rotation} ${x} ${y})`}
                style={{
                  textTransform: "capitalize",
                  textShadow: labelFill === "#F5F0E8" ? "0 1px 3px rgba(0,0,0,0.4)" : "0 1px 2px rgba(255,255,255,0.3)",
                  transition: "fill 0.2s ease-out, font-weight 0.15s ease-out",
                }}
              >
                {txt}
              </text>
            );
        })}
      </svg>
    </div>
  );
}
