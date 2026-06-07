import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const IMG1 = "https://static.igem.wiki/teams/5612/mainlayout/igembones.webp";
const IMG2 = "https://static.igem.wiki/teams/5612/mainlayout/igemheart.webp";
const IMG3 = "https://static.igem.wiki/teams/5612/mainlayout/igemface.webp";

export default function Circles() {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollingDown, setScrollingDown] = useState(true);
  const [inView, setInView] = useState(false);
  const [isReversed, setIsReversed] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollingDown(currentScrollY > lastScrollY);
      lastScrollY = currentScrollY;

      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const triggerStart = sectionTop - 150; // start animation earlier
      const sectionBottom = sectionTop + rect.height;

      // Scroll down into view → play forward
      if (currentScrollY > triggerStart && currentScrollY < sectionBottom && scrollingDown) {
        setInView(true);
        setIsReversed(false);
      }
      // Scroll up above section → play reverse
      else if (currentScrollY < triggerStart && !scrollingDown) {
        setIsReversed(true);
        setInView(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollingDown]);

  const circleVariants = {
    initial: { y: "0vh", scale: 1, opacity: 1 },
    animate: {
      y: "16vh",
      scale: 0,
      opacity: 0,
      transition: { duration: 0.45, ease: "easeInOut" },
    },
    reverse: {
      y: "0vh",
      scale: 1,
      opacity: 1,
      transition: { duration: 0.45, ease: "easeInOut" },
    },
  };

  const leftCircleVariant = {
    initial: { ...circleVariants.initial, x: "20%" },
    animate: { ...circleVariants.animate, x: "100%" },
    reverse: { ...circleVariants.reverse, x: "20%" },
  };

  const centerCircleVariant = {
    initial: { ...circleVariants.initial, x: "0vw" },
    animate: { ...circleVariants.animate, x: "0vw" },
    reverse: { ...circleVariants.reverse, x: "0vw" },
  };

  const rightCircleVariant = {
    initial: { ...circleVariants.initial, x: "0vw" },
    animate: { ...circleVariants.animate, x: "-100%" },
    reverse: { ...circleVariants.reverse, x: "-5vw" },
  };

  const boxVariants = {
    initial: { opacity: 0, scale: 0.5, y: "0px", scaleX: 0 },
    animate: {
      opacity: [0, 1, 1, 1, 1],
      scale: [0, 1, 1, 1],
      scaleX: [0, 1, 1, 1],
      y: ["0px", "-15vh", "-15vh", "-15vh"],
      transition: {
        duration: 1.2,
        times: [0, 0.2, 0.3, 0.5, 1],
      },
    },
    reverse: {
      opacity: 0,
      scale: 0.5,
      scaleX: 0,
      y: "0px",
      transition: { delay: 0.1, duration: 0.2 },
    },
  };

  return (
    <section className="relative h-[120%] md:w-full mx-auto overflow-hidden bg-[#FFFCF3]">
      <div ref={ref} className="relative">
        {/* Circles Row */}
        <motion.div
          className="relative grid w-[75%] sm:w-full mx-auto grid-cols-3 items-center justify-items-center"
          initial="initial"
          animate={
            inView
              ? isReversed
                ? "reverse"
                : "animate"
              : "initial"
          }
        >
          {/* ercle 1: Arthritis */}
          <motion.div
            variants={leftCircleVariant}
            className="group  aspect-square w-[28vw] max-w-[280px] min-w-[20px] rounded-full overflow-hidden z-10 [perspective:1000px]"
          >
            <div className="relative h-full w-full">
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <img
                  src={IMG1}
                  alt="bones"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-[#F2DFC8] text-[#6A4A3C] font-semibold text-sm sm:text-base [transform:rotateY(180deg)] [backface-visibility:hidden]">
                Arthritis
              </div>
            </div>
          </motion.div>

          {/* Circle 2: Lyme carditis */}
          <motion.div
            variants={centerCircleVariant}
            className="group relative aspect-square w-[28vw] max-w-[300px] min-w-[20px] rounded-full overflow-hidden [perspective:1000px]"
          >
            <div className="relative h-full w-full">
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <img
                  src={IMG2}
                  alt="heart"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-[#F2DFC8] text-[#6A4A3C] font-semibold text-sm sm:text-base [transform:rotateY(180deg)] [backface-visibility:hidden]">
                Lyme carditis
              </div>
            </div>
          </motion.div>

          {/* Circle 3: Bell’s palsy */}
          <motion.div
            variants={rightCircleVariant}
            className="group relative aspect-square w-[28vw] max-w-[300px] min-w-[20px] rounded-full overflow-hidden [perspective:1000px]"
          >
            <div className="relative h-full w-full">
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <img
                  src={IMG3}
                  alt="face"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-[#F2DFC8] text-[#6A4A3C] font-semibold text-sm sm:text-base [transform:rotateY(180deg)] [backface-visibility:hidden]">
                Bell’s palsy
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Rectangle / Info Box */}
        <div className="relative mt-16 sm:mt-20 z-10">
          <motion.div
            initial="initial"
            animate={
              inView
                ? isReversed
                  ? "reverse"
                  : "animate"
                : "initial"
            }
            variants={boxVariants}
            style={{
              height: "auto",

              width: "100%",
            }}
            className="mx-auto flex flex-col justify-center items-center rounded-2xl bg-[#F2DFC8] p-6 sm:p-8 lg:p-10"
          >
            <img
  src="https://static.igem.wiki/teams/5612/mainlayout/bestbg.avif"
  alt="background"
  className="absolute inset-0 hfull w-full object-cover"
/>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
