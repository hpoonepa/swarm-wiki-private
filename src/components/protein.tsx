// protein.tsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Protein() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end -30%"],
  });

  const x = useTransform(scrollYProgress, [0, 0.8], ["-10vw", "-85vw"]);
  const y = useTransform(
    scrollYProgress,
    [0, 0.3, 0.8],
    ["-60%", "40%", "150%"]
  );
  const rotate = useTransform(scrollYProgress, [0, 1], [10, -8]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section className="relative w-full overflow-hidden bg-[#FFFCF3]">
      <div ref={ref} className="relative mx-auto w-full">
        <div className="pointer-events-none absolute inset-x-0">
          <img
            src="https://static.igem.wiki/teams/5612/mainlayout/squiggleprotein.webp"
            alt=""
            aria-hidden
            className="relative rotate-[-870deg] hidden sm:block right-[-1200px] top-[90px] opacity-90 drop-shadow-md"
            style={{ width: "12vw" }}
          />
          <img
            src="https://static.igem.wiki/teams/5612/mainlayout/squiggleprotein.webp"
            alt=""
            aria-hidden
            className="relative rotate-[-8deg] hidden sm:block left-[800px] md:top-[20px] top-[-90px] w-28 sm:w-32 lg:w-60 opacity-90 drop-shadow-md"
            style={{ width: "12vw" }}
          />
          <img
            src="https://static.igem.wiki/teams/5612/mainlayout/squiggleprotein.webp"
            alt=""
            aria-hidden
            style={{ width: "12vw" }}
            className="relative rotate-[12deg] hidden md:block left-[450px] top-[-50px] w-28 sm:w-32 lg:w-60 opacity-90 drop-shadow-md"
          />
        </div>

        <div className="relative z-20 max-w-xl" style={{ paddingLeft: "10%" }}>
          <h2 className="text-3xl ml-24 sm:ml-0 sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#BB3C3E]">
            However…
          </h2>
          <p className="mt-4 text-base sm:text-lg lg:text-xl ml-[19.5%] sm:ml-0 leading-relaxed text-[#BB3C3E]/90">
            the <span className="font-semibold  text-[#FF9181]/90">CspZ</span>{" "}
            protein remains{" "}
            <span className="font-semibold text-[#FF9181]/90">
              within the blood stream
            </span>
          </p>
        </div>

        {/* Illustration layer */}
        <div className="relative">
          {/* Blood vessel sweeping across */}
          <img
            src="https://static.igem.wiki/teams/5612/mainlayout/betterbloodstream.webp"
            alt="Blood vessel illustration"
            style={{ zIndex: 10, width: "100%" }}
          />

          {/* Protein moving along the vessel (faster) */}
          <motion.img
            src="https://static.igem.wiki/teams/5612/mainlayout/proteinblood.webp"
            alt="CspZ protein within the bloodstream"
            className="
              absolute
              left-[90%] sm:left-[90%] lg:left-[90%]
              top-[40%] sm:top-[40%]
              will-change-transform
            "
            style={{
              translateX: x,
              translateY: y,
              rotate,
              scale,
              zIndex: 20,
              width: "9vw",
            }}
          />
        </div>
      </div>
    </section>
  );
}
