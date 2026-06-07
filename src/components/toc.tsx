import { useEffect, useState } from "react";

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

export default function TOC({
  headings,
  color,
  className = "",
}: {
  headings: Heading[];
  color: string;
  className?: string;
}) {
  const [currentSection, setCurrentSection] = useState<string>("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // === Group h2s under their preceding h1 ===
  const groupedHeadings = headings.reduce((acc, heading) => {
    if (heading.depth === 1) {
      acc.push({ ...heading, children: [] });
    } else if (heading.depth === 2 && acc.length > 0) {
      acc[acc.length - 1].children.push(heading);
    }
    return acc;
  }, [] as (Heading & { children: Heading[] })[]);

  // === Scroll tracking ===
  useEffect(() => {
    const handleScroll = () => {
      const sections = headings.map((heading) =>
        document.getElementById(heading.slug)
      );
      const current = sections
        .reverse()
        .find(
          (section) =>
            section &&
            section.getBoundingClientRect().top <= window.innerHeight / 2
        );
      if (current) {
        setCurrentSection(current.id);
      } else {
        const firstSection = document.getElementById(headings[0]?.slug);
        if (firstSection && firstSection.getBoundingClientRect().top > 0) {
          setCurrentSection("");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  // ✅ ADDED: Automatically open the parent group when a child is active
  useEffect(() => {
    const parentGroup = groupedHeadings.find((h1) =>
      h1.children.some((h2) => h2.slug === currentSection)
    );

  }, [currentSection, groupedHeadings]);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    slug: string
  ) => {
    event.preventDefault();
    const target = document.getElementById(slug);
    if (target) {
      const yOffset = -100;
      const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const toggleGroup = (slug: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <div className={`text-[#502F00] font-inter ${className}`}>
      <ul className="space-y-1">
        {groupedHeadings.map((h1) => {
          // ✅ UPDATED: A new condition to check if the H1 or any of its children are active
          const isH1OrChildActive =
            currentSection === h1.slug ||
            h1.children.some((child) => child.slug === currentSection);

          return (
            <li key={h1.slug}>
              {/* H1 Heading */}
              <div
                className={`flex items-center justify-between cursor-pointer select-none ${
                  isH1OrChildActive // Use the new, clearer condition
                    ? "text-[#447701]"
                    : "text-[#502F00]"
                } font-bold py-3`}
                onClick={() => {
                  if (h1.children.length > 0) toggleGroup(h1.slug);
                  else
                    document
                      .getElementById(h1.slug)
                      ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <a
                  href={`#${h1.slug}`}
                  onClick={(e) => handleClick(e, h1.slug)}
                  className="block w-full hover:text-[#5a9310ff] transition-colors duration-200"
                >
                  {h1.text}
                </a>
                {h1.children.length > 0 && (
                  <span
                    className={`ml-2 transform transition-transform duration-300 ${
                      openGroups[h1.slug] ? "rotate-90" : ""
                    }`}
                  >
                    &gt;
                  </span>
                )}
              </div>

              {/* H2 Children */}
              {h1.children.length > 0 && (
                <ul
                  className={`overflow-hidden transition-all duration-300 ${
                    openGroups[h1.slug]
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {h1.children.map((h2) => (
                    <li
                      key={h2.slug}
                      className={`${
                        currentSection === h2.slug
                          ? "text-[#447701]"
                          : "text-[#502F00]"
                      } font-medium`}
                    >
                      <a
                        href={`#${h2.slug}`}
                        onClick={(e) => handleClick(e, h2.slug)}
                        className="block pl-6 py-2 text-sm hover:text-[#5a9310ff] transition-colors duration-200"
                      >
                        {h2.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}