// components/StakeholderCarousel.tsx
import React from "react";

type Stakeholder = {
  name: string;
  blurb: string;
  // optional image URL for the little rounded square inside each card
  photoUrl?: string;
};

type ColorKey = "rose" | "peach" | "sun" | "mint";

const COLOR_MAP: Record<
  ColorKey,
  {
    bg: string;
    border: string;
    title: string;
    slotBg: string;
  }
> = {
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-300",
    title: "text-rose-600",
    slotBg: "bg-rose-100",
  },
  peach: {
    bg: "bg-orange-50",
    border: "border-orange-300",
    title: "text-orange-600",
    slotBg: "bg-orange-100",
  },
  sun: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    title: "text-amber-600",
    slotBg: "bg-yellow-100",
  },
  mint: {
    bg: "bg-green-50",
    border: "border-green-300",
    title: "text-emerald-700",
    slotBg: "bg-green-100",
  },
};

// Inline color equivalents for the title color classes (avoid Tailwind for paragraph color)
const TITLE_HEX: Record<ColorKey, string> = {
  rose: "#e11d48", // tailwind rose-600
  peach: "#ea580c", // tailwind orange-600
  sun: "#d97706", // tailwind amber-600
  mint: "#047857", // tailwind emerald-700
};

function StakeholderCard({
  person,
  color,
}: {
  person: Stakeholder;
  color: ColorKey;
}) {
  const c = COLOR_MAP[color];
  return (
    <div
      className={[
        "w-full rounded-2xl border px-4 py-4 shadow-sm",
        c.bg,
        c.border,
      ].join(" ")}
    >
      {/* Title at top */}
      <div
        className={["text-sm font-semibold mb-3 leading-tight", c.title].join(" ")}
        title={person.name}
      >
        {person.name}
      </div>

      {/* Horizontal layout: image left, text right */}
      <div className="flex gap-3 items-start">
        {/* Image on left */}
        <div
          className={[
            "w-[80px] h-[80px] rounded-lg border flex-shrink-0",
            c.border,
            c.slotBg,
            "flex items-center justify-center overflow-hidden",
          ].join(" ")}
        >
          {person.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={person.photoUrl}
              alt={`${person.name} photo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-xs text-gray-400 text-center px-1"><img src="https://static.igem.wiki/teams/5612/education/tick.avif" alt="" /></div>
          )}
        </div>

        {/* Text on right */}
        <p
          className="text-xs leading-4 flex-1"
          style={{ color: TITLE_HEX[color] }}
        >
          {person.blurb}
        </p>
      </div>
    </div>
  );
}

export default function StakeholderCarousel({
  title = "Stakeholders Leading Us to Education",
  items,
}: {
  title?: string;
  items: Stakeholder[];
}) {
  return (
    <section className="relative w-full mx-auto max-w-6xl bg-[#FFFCF3] py-8 md:py-10 rounded-xl">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-emerald-700 mb-6">
        {title}
      </h2>

      <div className="px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((p, i) => {
            const order: ColorKey[] = ["rose", "peach", "sun", "mint"];
            return (
              <StakeholderCard
                key={i}
                person={p}
                color={order[i % order.length]}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
