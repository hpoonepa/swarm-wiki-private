import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type Hotspot = {
  id: string;
  x: number; // percent (0–100)
  y: number; // percent (0–100)
  label: string;
  blurb?: string;
  content: React.ReactNode; // use this for the (T) Target section
  investigate?: React.ReactNode; // (I) Investigate section
  consider?: React.ReactNode; // (C) Consider section
  kickstart?: React.ReactNode; // (K) Kickstart section
  radius?: number; // px
};

type Props = {
  src: string;
  alt?: string;
  caption?: string;
  items: Hotspot[];
  mode?: "modal";
  className?: string;
  modalTitle?: string;
};

export default function HotspotImage({
  src,
  alt = "",
  caption,
  items,
  mode = "modal",
  className = "max-w-5xl mx-auto",
  modalTitle = "T.I.C.K. Analysis",
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeIndex = useMemo(() => {
    const i = items.findIndex((i) => i.id === activeId);
    return i < 0 ? 0 : i;
  }, [activeId, items]);

  const active = items[activeIndex] ?? null;

  const close = () => setActiveId(null);
  const prev = () =>
    setActiveId(items[(activeIndex - 1 + items.length) % items.length].id);
  const next = () => setActiveId(items[(activeIndex + 1) % items.length].id);

  if (mode !== "modal") mode = "modal";

  return (
    <>
      <figure className={`w-full ${className}`}>
        <div className="relative w-full">
          <img
            src={src}
            alt={alt}
            className="w-full h-[60%] rounded-xl border border-gray-200 shadow-sm select-none"
            draggable={false}
          />

          {/* Tree Image - positioned inside the tree */}
          <div 
            className="absolute"
            style={{
              left: '48%',
              top: '16%',
              width: '55%',
              height: '7%',
              transform: 'translate(-50%, -50%)'
            }}
          >

          </div>

          {/* Hotspots */}
          <div className="pointer-events-none absolute inset-0">
            {items.map((it) => {
              const r = it.radius ?? 12;
              const isActive = activeId === it.id;
              return (
                <Button
                  key={it.id}
                  type="button"
                  variant="ghost"
                  className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full border
                              focus:outline-none focus:ring transition
                              ${isActive ? "scale-110 ring-2 ring-offset-2 ring-lime-500" : ""}
                              bg-white/90 border-gray-300 shadow`}
                  style={{
                    left: `${it.x}%`,
                    top: `${it.y}%`,
                    width: r * 2,
                    height: r * 2,
                    padding: 0,
                  }}
                  aria-label={it.label}
                  title={it.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveId(it.id);
                  }}
                >
                  <span className="sr-only">{it.label}</span>
                  <span
                    className="absolute inset-1 rounded-full"
                    aria-hidden="true"
                    style={{ backgroundColor: "#475569" }} // slate-600 dot
                  />
                </Button>
              );
            })}
          </div>
        </div>

        {caption && (
          <figcaption className="mt-2 text-center text-sm text-gray-600">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Modal */}
      <Dialog open={!!activeId} onOpenChange={(open) => !open && close()}>
        <DialogContent
          className="
            sm:max-w-[min(1200px,95vw)]
            w-[95vw] p-0 overflow-hidden
            rounded-[32px] border-[6px] border-lime-400
            shadow-2xl bg-[#FFFCF3]
          "
        >
          {/* Header */}
          <div className="relative px-6 sm:px-8 py-4 bg-[#FFFCF3]">
            <DialogHeader className="pr-10">
              <DialogTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-lime-700">
                {modalTitle}
              </DialogTitle>
              {active?.label && (
                <DialogDescription className="text-sm text-gray-500">
                  {active.label}
                </DialogDescription>
              )}
            </DialogHeader>

          </div>

          {/* Body */}
          {active && (
            <div className="relative">
              {/* Nav arrows */}
              <button
                onClick={prev}
                aria-label="Previous"
                className="
                  hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10
                  h-12 w-12 items-center justify-center rounded-full border bg-white
                  border-lime-300 shadow hover:bg-lime-50 focus:outline-none focus:ring-2 focus:ring-lime-500
                "
              >
                <ChevronLeft />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="
                  hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10
                  h-12 w-12 items-center justify-center rounded-full border bg-white
                  border-lime-300 shadow hover:bg-lime-50 focus:outline-none focus:ring-2 focus:ring-lime-500
                "
              >
                <ChevronRight />
              </button>

              <div className="flex flex-col">
                {/* 4-column grid taking full width */}
                <div className="w-full p-4 sm:p-8 bg-[#FFFCF3]">
                  <ScrollArea className="h-[220px] sm:h-[520px] pr-2">
                    <div className="grid grid-cols-4 gap-4">
                      {/* (T) Target — filled with active.content */}
                      <section className="rounded-2xl border-2 border-yellow-300/80 bg-yellow-50 shadow-md p-4">
                        <header className="mb-3">
                          <h3 className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-yellow-200/60 text-yellow-800 font-semibold text-xs">
                            (T) Target
                          </h3>
                        </header>
                        <div className="prose max-w-none text-sm">{active.content}</div>
                      </section>

                      {/* (I) Investigate — now uses active.investigate */}
                      <section className="rounded-2xl border-2 border-orange-300/80 bg-orange-50 shadow-md p-4">
                        <header className="mb-3">
                          <h3 className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-orange-200/60 text-orange-800 font-semibold text-xs">
                            (I) Investigate
                          </h3>
                        </header>
                        <div className="prose max-w-none text-sm whitespace-pre-wrap">
                          {active.investigate || <span className="text-gray-500 italic">No content provided</span>}
                        </div>
                      </section>

                      {/* (C) Consider — now uses active.consider */}
                      <section className="rounded-2xl border-2 border-rose-300/80 bg-rose-50 shadow-md p-4">
                        <header className="mb-3">
                          <h3 className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-200/60 text-rose-800 font-semibold text-xs">
                            (C) Consider
                          </h3>
                        </header>
                        <div className="prose max-w-none text-sm whitespace-pre-wrap">
                          {active.consider || <span className="text-gray-500 italic">No content provided</span>}
                        </div>
                      </section>

                      {/* (K) Kickstart — now uses active.kickstart */}
                      <section className="rounded-2xl border-2 border-emerald-300/80 bg-emerald-50 shadow-md p-4">
                        <header className="mb-3">
                          <h3 className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-200/60 text-emerald-800 font-semibold text-xs">
                            (K) Kickstart
                          </h3>
                        </header>
                        <div className="prose max-w-none text-sm whitespace-pre-wrap">
                          {active.kickstart || <span className="text-gray-500 italic">No content provided</span>}
                        </div>
                      </section>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
