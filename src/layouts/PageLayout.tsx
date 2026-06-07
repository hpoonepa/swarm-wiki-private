import React, { useRef, useEffect } from "react";
import { icons } from "lucide-react";
import Nav from "../components/Nav";
import TOC from "../components/toc";
import clsx from "clsx";
import "../styles/global.css";

interface LayoutProps {
  children: React.ReactNode;
  tabs?: React.ReactNode;
  header: string;
  title: string;
  description: string;
  icon: string;
  color: "blue" | "magenta" | "green" | "pink" | (string & {});
  headings: any;
  TOCPadding?: boolean;
  noTOC: boolean;
  isTab?: boolean;
}

const PageLayout = ({
  children,
  tabs,
  header,
  title,
  description,
  headings,
  icon,
  color,
  noTOC,
  isTab,
}: LayoutProps) => {
  const LucideIcon = (icons as any)[icon as any];
  const isDarkTheme = isTab;

  const accentColor = `accent-${color}-9`;
  const proseAAccent = `prose-a:text-${color}-9`;

  const styling =  "prose lg:prose-lg max-w-7xl text-neutral-900 prose-h1:font-inter prose-h1:text-4xl prose-h1:text-neutral-900 prose-h2:font-inter prose-h2:text-2xl prose-h2:text-neutral-900 prose-h3:font-inter prose-h3:text-lg prose-h3:font-semibold prose-h3:text-neutral-900 prose-p:font-inter prose-p:text-neutral-900 font-normal leading-relaxed prose-a:font-inter prose-a:underline prose-a:font-normal prose-quoteless prose-strong prose-em prose-ol prose-ul prose-li:text-neutral-900 prose-table:text-neutral-900";

  const contentRef = useRef<HTMLDivElement>(null);

  // Wrap tables and style images automatically
  useEffect(() => {
    if (contentRef.current) {
      const tables = contentRef.current.querySelectorAll("table");
      /*const imgs = contentRef.current.querySelectorAll("img");

      imgs.forEach((img) => {
        img.className = "mx-2 rounded-xl w-[65%]";
      });
        */
      tables.forEach((table) => {
        if (table.parentElement?.classList.contains("table-container")) return;
        const wrapper = document.createElement("div");
        wrapper.className = "table-container";
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      });
    }
  }, [children]);

  useEffect(() => {
    const toc = document.querySelector(".toc-container") as HTMLElement | null;
    const stopEl = document.querySelector("#toc-stop");
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    if (!toc || !stopEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
            toc.style.transition = "top 0.5s ease-in-out";

        if (!mediaQuery.matches) {
          if (entry.isIntersecting) {
            toc.style.display = "block";
            toc.style.top = "-1000%";
            toc.style.position = "sticky";
            toc.style.bottom = "auto";
          } else {
            toc.style.display = "block";
            toc.style.position = "sticky";
            toc.style.top = "5%";
            toc.style.bottom = "auto";
          }
        } else {
          toc.style.display = "none";
        }
      },
      { rootMargin: "0px 0px -100px 0px" }
    );

    const handleResize = () => {
      if (mediaQuery.matches) {
        toc.style.display = "none";
      } else {
        toc.style.display = "block";
      }
    };

    mediaQuery.addEventListener("change", handleResize);
    observer.observe(stopEl);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <div
      className={clsx("font-sans w-full", accentColor, {
        "bg-[#FFFCF3] text-neutral-900": !isDarkTheme,
      })}
    >
      {isDarkTheme ? (
        <>
          <div
          
            className="bg-cover absolute w-full left-0 top-0 p-0 m-0 h-2/3 -z-10"
            style={{
              background: `linear-gradient(to bottom, rgba(255, 255, 255, 0) 36.46%, #0e0e0e 100%), url(${header})`,
              backgroundSize: "cover",
            }}
          />
          <div className="flex flex-col justify-center w-full items-center h-[50vh] space-y-6 px-4">
            <LucideIcon
              size={55}
              className={clsx(
                "flex justify-center w-full items-center",
                `text-${color}-9`
              )}
            />
            <h1 className="font-inter pb-3 font-bold text-4xl lg:text-8xl md:text-6xl text-center text-white-1">
              {title}
            </h1>
            <p
              className={clsx(
                "rounded-full py-2 px-4 flex justify-center text-center",
                `text-${color}-11`,
                `bg-${color}-9/[0.25]`
              )}
            >
              {description}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="fixed z-50 bg-[#FFFCF3]">
            <div className="flex items-center justify-between">
              <Nav />
            </div>
          </div>
          <header
            className="relative w-full h-[70vh] bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient( #00000020, #00000020), url(${header})`,
              backgroundSize: "cover",
            }}
          >
            <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_10%,transparent_35%,transparent_65%,black_95%)]" />
            <div className="relative z-10 flex flex-col justify-center items-center h-full space-y-6 px-4">
              <h1 className="font-inter font-bold text-[3rem] text-center text-[#FFFFFF]">
                {title}
              </h1>
              <p className="font-inter rounded-full py-2 px-4 text-center shadow-lg text-[#FFFFFF] bg-[#502F00]">
                {description}
              </p>
            </div>
          </header>
        </>
      )}

      <main className={clsx("w-full", { "bg-[#FFFCF3]": !isDarkTheme })}>
        {tabs}
        <div className="seperator"></div>

        <div className="flex justify-center w-full items-start lg:mx-0 relative">
          {!noTOC && (
            <div className="toc-container hidden lg:block relative">
              <div className="toc-heading">Table of Contents</div>
              <TOC
                headings={headings}
                color={"#FFFFFF"}
                className="toc sticky p-4 top-0"
              />
            </div>
          )}
          <div className={clsx("content-wrapper")}>
            <div
              ref={contentRef}
              className={clsx(
                styling,
                "break-words content",
                accentColor,
                proseAAccent
              )}
            >
              {children}
            </div>
          </div>
        </div>

        <div id="toc-stop" className="h-[1px]" />
      </main>
    </div>
  );
};

export default PageLayout;