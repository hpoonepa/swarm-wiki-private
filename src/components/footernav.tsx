import React from "react";

type NavNode = {
  id: string;
  label: string;
  href?: string; // This property controls the link destination
  x: number;
  y: number;
  r: number;
  color: string;
};

type Props = {
  nodes?: NavNode[];
  treeSrc?: string;
  viewBox?: { width: number; height: number };
  treeWidth?: string;
  overlap?: number;
  className?: string;
};

const DEFAULT_NODES: NavNode[] = [
  { id: "n1", label: "Model",    href: "/lambert-ga/model",             x: -40, y: 150, r: 90, color: "#447700" },
  { id: "n2", label: "Project", href: "/lambert-ga/description",      x: 0,  y: -45,  r: 110, color: "#125C00" },
  { id: "n3", label: "RNAi",  href: "/lambert-ga/therapeutics-overview",    x: 270,  y: -110, r: 120, color: "#2C8117" },
  { id: "n4", label: "Team",  href: "/lambert-ga/team",         x: 500,  y: 60,  r: 90,color: "#2C8117" },
  { id: "n5", label: "Software", href: "/lambert-ga/software", x: 690, y: -70, r: 115,color: "#447700" },
  { id: "n6", label: "Minibinders",  href: "/lambert-ga/diagnosticsoverview",           x: 1070, y: -80, r: 120,color: "#125C00" },
  { id: "n7", label: "Results", href: "/lambert-ga/results",          x: 1200, y: 100, r: 100,color: "#2C8117" },
];
// --------------------

export default function FooterNav({
  nodes = DEFAULT_NODES,
  treeSrc = "https://static.igem.wiki/teams/5612/mainlayout/igemtree.webp",
  viewBox = { width: 1200, height: 380 },
  treeWidth = "70vw",
  overlap = 120,
  className = "",
}: Props) {
  return (
    <section
      className={`relative w-full overflow-visible z-0 ${className}`}
      style={{ marginBottom: `-${overlap}px` }}
    >
      <div id="toc-stop" className="h-[1px]" />
      <div className="relative overflow-visible" style={{display:"flex", justifyContent:"center"}}>
        <div className="relative overflow-visible" style={{ width: treeWidth }}>
          {/* The tree image */}
          <img
            src={treeSrc}
            alt="Navigation tree"
            className="block w-full h-auto select-none pointer-events-none"
            loading="lazy"
            style={{ display: "block", overflow: "visible"}}
          />

          {/* Absolute overlay layer for clickable circles */}
          <div className="pointer-events-none absolute inset-0 overflow-visible">
            {nodes.map((n) => {
              const leftPct = (n.x / viewBox.width) * 100;
              const topPct = (n.y / viewBox.height) * 100;
              const sizePct = ((2 * n.r) / viewBox.width) * 100;
              return (
                <a
                  key={n.id}
                  href={n.href || "#"} // This line reads the href from your array
                  className="pointer-events-auto"
                  style={{
                    position: "absolute",
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${sizePct}%`,
                    aspectRatio: "1 / 1",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="
                      group grid place-items-center w-full h-full rounded-full 
                      transition-transform duration-300 ease-out
                      hover:scale-110 active:scale-105
                      will-change-transform
                    "
                    style={{
                      overflow: "visible",
                      backgroundColor: n.color
                    }}
                  >
                    <div
                      className="
                        grid place-items-center w-[78%] h-[78%] rounded-full
                        text-[clamp(12px,1.6vw,20px)] font-extrabold tracking-wide
                      "
                      style={{backgroundColor: "#FFFFFF15", color: "white", fontWeight: "600", textAlign: "center" }}
                    >
                      {n.label}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}