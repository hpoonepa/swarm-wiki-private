import React from "react";

export type FilterRule = {
  id: string;
  filter: string;                 // e.g., "Primer length"
  rule?: string;                  // e.g., "28–36 nt" (for rule/range type)
  weight?: string;                // e.g., "0.3" (for weight type)
  definition?: React.ReactNode;   // shown when the row is opened
  required?: boolean;             // small "Required" badge
};

type Props = {
  items: FilterRule[];
  className?: string;
  title?: string;
  caption?: string;
  showHeader?: boolean;
  columnType?: "rule" | "weight";  // determines the column header and data field
};

const FilterRuleTable: React.FC<Props> = ({
  items,
  className = "",
  title,
  caption,
  showHeader = true,
  columnType = "rule",
}) => {
  const columnHeader = columnType === "weight" ? "Weight" : "Rule / Range";
  
  return (
    <section
      className={`rounded-2xl border border-gray-200 bg-[#FFFCF3] shadow-sm ${className}`}
      aria-label={title || "Filter rules table"}
    >
      {/* Header - conditionally rendered */}
      {showHeader && (title || caption) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            {title && <h3 className="text-lg font-extrabold text-[#502F00]">{title}</h3>}
            {caption && (
              <p className="text-sm text-[#502F00]/70 mt-0.5">{caption}</p>
            )}
          </div>
        </div>
      )}

      {/* Column labels */}
      {/* Column labels - hidden on mobile, shown on medium+ */}
<div className="hidden md:grid grid-cols-12 gap-3 px-5 pt-4 pb-2 text-sm font-semibold text-[#502F00]">
  <div className="col-span-1"></div>
  <div className="col-span-7">Feature</div>
  <div className="col-span-4">{columnHeader}</div>
</div>

      {/* Rows */}
      <ul className="divide-y divide-gray-200">
        {items.map((row) => (
          <li key={row.id} className="px-5">
            {/* Each row is a <details>: arrow on the LEFT inside <summary> */}
            <details className="group">
              <summary
  // This is now a flex container. The arrow and the content are two separate items.
  // This makes the responsive transition much cleaner.
  className="flex items-start gap-3 py-3 cursor-pointer list-none"
  aria-label={`Toggle ${row.filter} details`}
>
  {/* Arrow on the left (no changes needed here) */}
  {/* It's a non-shrinking flex item. */}
  <div className="flex-shrink-0">
    <span
      aria-hidden
      className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-[#f8efe2] text-[#502F00] shadow-sm transition-transform group-open:rotate-180"
    >
      ⌄
    </span>
  </div>

  {/* This new wrapper contains all the text content. */}
  {/* It stacks vertically on mobile (grid-cols-1) and switches to a horizontal grid on desktop (md:grid-cols-11). */}
  <div className="flex-1 grid grid-cols-1 gap-1 md:grid-cols-11 md:gap-3 items-center">
    {/* Filter name */}
    {/* On desktop, it takes 7 of the 11 available columns. */}
    <div className="md:col-span-7">
      <div className="flex items-center gap-2">
        <span className="text-base font-medium italic text-[#502F00]">
          {row.filter}
        </span>
        {row.required && (
          <span className="inline-flex items-center rounded-full border border-[#c7b094] bg-[#f8efe2] px-2 py-0.5 text-[11px] font-semibold text-[#502F00]">
            Required
          </span>
        )}
      </div>
    </div>

    {/* Rule or Weight */}
    {/* On desktop, it takes the remaining 4 of the 11 columns. */}
    <div className="md:col-span-4">
      {/* This label provides context on mobile and is hidden on desktop */}
      <span className="font-semibold text-sm text-[#502F00]/70 md:hidden">
        {columnHeader}:{" "}
      </span>
      <span className="text-base font-semibold italic text-[#502F00]">
        {columnType === "weight" ? row.weight : row.rule}
      </span>
    </div>
  </div>
</summary>

              {/* Inline expanding panel (pushes content down) */}
              {row.definition && (
                <div
                  className="col-span-12 mb-3 ml-0 rounded-xl border border-gray-200 bg-[#FFF8EE] p-4 text-sm text-[#502F00]
                             transition-all overflow-hidden
                             group-open:mt-1 group-open:max-h-[1000px] group-open:opacity-100
                             max-h-0 opacity-0"
                  role="region"
                  aria-label={`${row.filter} definition`}
                >
                  {typeof row.definition === "string" ? (
                    <p className="leading-snug">{row.definition}</p>
                  ) : (
                    row.definition
                  )}
                </div>
              )}
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FilterRuleTable;
