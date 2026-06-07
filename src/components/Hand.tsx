import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hand(): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 50%"],
  });

  const scale = useTransform(scrollYProgress, [0, 1.25], [1, 2]);
  const x = useTransform(scrollYProgress, [0, 1], ["-15vw", "-120%"]); // move left on scroll
  const y = useTransform(scrollYProgress, [0, 1], ["20%", "77%"]); // move down on scroll

  // popup motion values: appear at later part of scroll and settle lower (aligned with hand end)
  const popupOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 1]);
  const popupX = useTransform(scrollYProgress, [0.3, 0.6], ["100%", "0%"]);

  const popupY = useTransform(scrollYProgress, [0.3, 0.6], ["4vh", "-30%"]);
  const popupPaddingLeft = "19%";
  const popupPaddingRight = "4vw";
  const popupRadus = "12px";
  const shadowSettings = "-5px 5px #A1B58B";

  return (
    <section className="w-full relative overflow-visible mb-20">
      <div className="mx-auto px-6">
        <div
          ref={ref}
          className="relative w-full h-[15vh] md:h-[20vh] lg:h-[25vh]"
        >
          <motion.img
            src="https://static.igem.wiki/teams/5612/mainlayout/besthand-tick.avif"
            alt="Decorative hand"
            className="absolute hidden sm:block left-36 md:left-0 bottom-10 md:bottom-0 h-auto w-[66.666vw] max-w-none pointer-events-none"
            style={{ x, y, scale, transformOrigin: "left bottom" }}
            draggable={false}
          />

          <motion.div
            className="absolute top-14 right-2 flex w-[90vw] sm:w-[53%] flex-col items-end"
            style={{
              opacity: popupOpacity,
              x: popupX,
              y: popupY,
              fontWeight: "bold",
              marginLeft: "auto",
              marginRight: "calc(-50vw + 50% - 1.5rem)",

            }}
          >
            <div
              className="text-[3.8vw] scale-[1.25] sm:scale-100 rounded-xl py-3 font-semibold"
              style={{
                backgroundColor: "#446F22",
                maxWidth: "100%",
                color: "#ffffff",
                fontWeight: "650",
                borderRadius: popupRadus,
                textDecoration: "underline",
                marginLeft: "auto",
                height: "8vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "left",
                paddingRight: "10%",
                paddingLeft: "15%",
                boxShadow: shadowSettings

              }}
            >
              Lyme Disease
            </div>

            <div className="mt-2 grid text-[2.4vw]">
              <div
                className="rounded-lg px-4 mt-1 font-[48px]"
                style={{
                  height: "8vw",
                  borderRadius: popupRadus,
                  backgroundColor: "#446F22",
                  color: "#ffffff",
                  paddingLeft: popupPaddingLeft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: "40px",
                  textAlign: "center",
                  boxShadow: shadowSettings
                }}
              >
                #1 vector-borne illness in the US
              </div>

              <div
                className="rounded-lg px-4 py-2 mt-3 font-[48px]"
                style={{
                  height: "8vw",
                  backgroundColor: "#446F22",
                  color: "#ffffff",
                  paddingRight: "42px",
                  borderRadius: popupRadus,
                  paddingLeft: popupPaddingLeft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  boxShadow: shadowSettings
                }}
              >
                Transmitted by blacklegged ticks
              </div>

              <div
                className="px-4 rounded-lg mt-3 font-[48px]"
                style={{
                  lineHeight: 1.5,
                  height: "15vw",
                  backgroundColor: "#446F22",
                  color: "#ffffff",
                  paddingRight: popupPaddingRight,
                  borderRadius: popupRadus,
                  paddingLeft: "18%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "right",
                  textAlign: "right",
                  boxShadow: shadowSettings
                }}
              >
                Symptoms vary from arthritis, Lyme carditis, Bell’s Palsy, rash,
                fatigue, fever, and neuropathy.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
