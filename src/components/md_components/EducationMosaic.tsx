// src/components/md_components/EducationMosaic.tsx
import React, { useMemo, useState, isValidElement, useCallback } from "react";
import { Button } from "../ui/button";


// …inside your component file, above the return:
function renderModalContent(val: unknown) {
  // Function component or render prop
  if (typeof val === "function") {
    const Comp = val as React.ComponentType;
    return <Comp />;
  }
  // React element
  if (isValidElement(val)) return val;

  // String content
  if (typeof val === "string") return <p>{val}</p>;

  // Best-effort: try MDX/AST children if present (don’t crash if weird)
  if (val && typeof val === "object") {
    // Some MDX compilers put children under .props?.children; try to render if it’s a string/array/element
    // @ts-ignore – loose check by design
    const maybe = val.props?.children;
    if (isValidElement(maybe)) return maybe;
    if (Array.isArray(maybe)) return <>{maybe}</>;
    if (typeof maybe === "string") return <p>{maybe}</p>;
  }

  // Fallback
  return <p className="text-gray-600">No additional information provided for this item yet.</p>;
}
export type MosaicTile = {
  id: string;
  title: string;
  image: string;
  x: number; y: number; w: number; h: number;
  blurb?: string;
  cta?: { label: string; href?: string; onClick?: () => void; mode?: "link" | "modal" };
  indexBadge?: string | number;

  /** Optional per-tile modal content */
  modalTitle?: string;
  modalDescription?: string;
  modalContent?: React.ReactNode;
};

type Props = {
  tiles: MosaicTile[];
  aspect?: number;
  className?: string;
  rounded?: string;
  borderColor?: string;
  containerId?: string; 
};

export default function EducationMosaic({
  tiles,
  // Slightly taller to make tiles larger
  aspect = 9 / 16,
  className = "",
  rounded = "rounded-3xl",
  borderColor = "border-[#6aa24b]",
  containerId = "education-mosaic",
}: Props) {
  // Helper to generate stable section IDs per tile and smooth-scroll to them
  const toSectionId = useCallback((id: string) => `education-section-${id}`, []);
  const scrollToSection = useCallback((id: string, updateHash = true) => {
    const el = typeof document !== "undefined" ? document.getElementById(id) : null;
    if (updateHash && typeof window !== "undefined") {
      // don’t add a new history entry; just set the hash
      history.replaceState(null, "", `#${id}`);
    }
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);


  return (
    <>
      <div id={containerId} className={`relative w-full ${className}`}>
        <div className="relative w-full" style={{ paddingBottom: `${(1 / aspect) * 100}%` }}>
          <div className="absolute inset-0">
            <div className="relative h-full w-full">
              {tiles.map((t) => {
                const hasDetailSection = t.cta?.mode === "modal" || (!!t.modalContent && !t.cta?.href);
                const sectionId = toSectionId(t.id);

                return (
                  <article
                    key={t.id}
                    className={`group absolute ${rounded} overflow-hidden shadow-md border bg-white [perspective:1000px]`}
                    style={{ left: `${t.x}%`, top: `${t.y}%`, width: `${t.w}%`, height: `${t.h}%` }}
                    // No onClick for tiles anymore to avoid surprise navigation; use explicit button below
                    role={undefined}
                    tabIndex={-1}
                  >
                    {/* Flip container */}
                    <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                      {/* Front */}
                      <div className="absolute inset-0 [backface-visibility:hidden]">
                        <img
                          src={t.image}
                          alt={t.title}
                          className="h-full w-full object-cover"
                          draggable={false}
                        />
                        {/* Title pill */}
                        <div className="pointer-events-none absolute left-3 top-3">
                          <span
                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 bg-[#D8E8C8]/95 text-[#2C5A1F] font-semibold tracking-wide ${borderColor}`}
                          >
                            {typeof t.indexBadge !== "undefined" && (
                              <span className="text-lg leading-none">{t.indexBadge}</span>
                            )}
                            <span className="uppercase text-sm">{t.title}</span>
                          </span>
                        </div>

                        {/* Front CTA overlay removed per request; CTA on back side only */}
                      </div>

                      {/* Back */}
                      <div className={`absolute inset-0 ${rounded} [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#E6F2D9]/95 border-2 ${borderColor}`}>
                        <div className="flex h-full w-full flex-col justify-between p-3 md:p-4">
                          <div className="flex items-start gap-2">
                            {typeof t.indexBadge !== "undefined" && (
                              <div className="text-2xl md:text-3xl font-extrabold text-[#4E7F35] leading-none">
                                {t.indexBadge}
                              </div>
                            )}
                            <h3 className="text-sm md:text-base font-extrabold text-[#4E7F35] uppercase">
                              {t.title}
                            </h3>
                          </div>

                          {t.blurb && (
                            <p className="mt-1 text-xs md:text-sm text-[#4E7F35]/90">{t.blurb}</p>
                          )}

                          {t.cta && (
                            <div>
                              {hasDetailSection ? (
                                <Button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); scrollToSection(sectionId); }}
                                  className={`h-9 ${rounded} border ${borderColor} bg-white text-[#4E7F35] font-bold px-3 py-1.5 hover:bg-[#e0edcf] transition`}
                                >
                                  SEE MORE
                                </Button>
                              ) : t.cta.href ? (
                                <a
                                  href={t.cta.href}
                                  className={`inline-flex items-center justify-center ${rounded} border ${borderColor} text-[#4E7F35] font-bold px-3 py-1.5 hover:bg-[#e0edcf] transition`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {t.cta.label}
                                </a>
                              ) : (
                                <Button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); t.cta?.onClick?.(); }}
                                  className={`h-9 ${rounded} border ${borderColor} bg-white text-[#4E7F35] font-bold px-3 py-1.5 hover:bg-[#e0edcf] transition`}
                                >
                                  {t.cta.label}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detail sections (replacing modal). These render below and are scroll targets. */}
      <div className="mt-10 space-y-16">
        {tiles.map((t) => {
          const hasDetailSection = t.cta?.mode === "modal" || (!!t.modalContent && !t.cta?.href);
          if (!hasDetailSection) return null;
          const sectionId = toSectionId(t.id);
          return (
            <section
              key={`section-${t.id}`}
              id={sectionId}
              className="scroll-mt-28"
            >
              <div className="rounded-[28px] border-[6px] border-lime-400 bg-[#FFFCF3] p-6 sm:p-8 shadow-2xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-lime-700">
                  {t.modalTitle || t.title}
                </h2>
                {t.modalDescription && (
                  <p className="mt-2 text-sm text-gray-600">{t.modalDescription}</p>
                )}

                <div className="prose max-w-none mt-5">
                  {renderModalContent(t.modalContent)}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
