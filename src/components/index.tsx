import React, { useRef, useState, useEffect } from "react";
import Footer from "./Footer";
import Map from "./map";
import Solutions from "./Solutions";
import Hand from "./Hand";
import Protein from "./protein";
import { AnimatePresence } from "framer-motion";
import Circles from "./circles";
import Footernav from "./footernav";
import LoadingScreen from "./LoadingScreen";
import SolutionDiagnostic from "./SolutionDiagnostic";
import SolutionTherapeutic from "./SolutionTherapeutic";
import VideoEmbed from "./ScrollTriggeredVideo";
import Awards from "./Awards";
function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      <div className="overflow-hidden text-white font-sans" ref={containerRef}>
        <div className="relative flex justify-center overflow-hidden bg-[#FFFCF3]">
          <img
            src="https://static.igem.wiki/teams/5612/mainlayout/grasshq.webp"
            alt="Grass"
            className="w-full object-cover"
            style={{
              marginTop: "30%",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 90%, transparent 100%)",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "100% 100%",
              maskImage:
                "linear-gradient(to bottom, black 90%, transparent 100%)",
              maskRepeat: "no-repeat",
              maskSize: "100% 100%",
            }}
          />

          <img
            src="https://static.igem.wiki/teams/5612/mainlayout/bushfinal.webp"
            alt="Bush"
            className="absolute object-cover hidden md:block"
            style={{ width: "50%", marginRight: "70%", marginTop: "10%" }}
          />

          {/* Logo */}
          <div
            className="absolute md:ml-[40vw] top-[5rem] md:top-20 lg:top-[7rem] xl:top-[7rem] 2xl:top-[10rem]"
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "column", // Stacks items vertically
              alignItems: "center",
            }}
          >
            <img
              src="https://static.igem.wiki/teams/5612/mainlayout/lancet-logo.webp"
              alt="iGEM 2025 Logo"
            />
            <p
              className="absolute"
              style={{
                fontSize: "1.67vw",
                marginTop: "27%",
                textAlign: "center",
                color: "#553D00",
              }}
            >
              A novel diagnostic and therapeutic to combat Lyme Disease.
            </p>
          </div>
        </div>
        {/* Place Awards directly under hero text */}
        <Awards />
        {/* Lyme Callout */}
        <section className="flex justify-center items-center">
          <div
            className="font-bold bg-white/80 rounded-2xl px-8"
            style={{ color: "#502F00", fontSize: "4vw", paddingTop: "5%" }}
          >
            Of{" "}
            <span className="font-bolda" style={{ color: "#447700" }}>
              476,000+
            </span>{" "}
            estimated cases of Lyme Disease,
          </div>
        </section>

        <section className="flex justify-center items-center">
          <div
            className="font-bold bg-white/80 rounded-2xl px-8"
            style={{ color: "#502F00", fontSize: "3vw", paddingTop: "0%" }}
          >
            Only{" "}
            <span className="font-bolda" style={{ color: "#CC3333" }}>
              88,000
            </span>{" "}
            cases were successfully diagnosed in 2023
          </div>
        </section>

        <section
          className="w-full mx-auto relative"
          style={{ marginBottom: "10%" }}
        >
          <div className="absolute inset-0 w-full bg-[#FFFCF3] z-0"></div>
          <div className="relative z-10">
            <Map />
          </div>
        </section>
        <section className="w-full mx-auto relative overflow-visible z-30">
          <div className="absolute inset-0 w-full bg-[#FFFCF3] z-0"></div>
          <div className="relative z-40">
            <Hand />
          </div>
        </section>
        <section
          className="w-full mx-auto relative"
          style={{ marginTop: "25%" }}
        >
          <div className="absolute inset-0 w-full bg-[#FFFCF3] z-0"></div>
          <div className="relative z-10 h-[120vw]">
            <Circles />
          </div>
        </section>
        <section
          className="mt-[5%] sm:mt-[-10%] md:mt-[-20%] lg:mt-[-30%] xl:mt-[-40%] w-full mx-auto relative z-30"
        >
          <Protein />
        </section>
        <section className="flex flex-col justify-center items-center py-8 bg-[#FFFCF3]">
          <div
            className="font-bold text-center sm:mt-60"
            style={{ color: "#502F00", fontSize: "4vw" }}
          >
            Presenting
          </div>
          <div className="flex justify-center">
            <img
              src="https://static.igem.wiki/teams/5612/mainlayout/lancet-logo.webp"
              alt="LANCET Logo"
              className="max-w-xs md:max-w-sm lg:max-w-md"
            />
          </div>
        </section>
        <section
          className="flex justify-center items-center py-4 bg-[#FFFCF3]"
          style={{ marginTop: "8%" }}
        >
          <div
            className="font-bold text-center"
            style={{ color: "#502F00", fontSize: "4vw" }}
          >
            The Diagnostic:
          </div>
        </section>
        <section className="flex justify-center items-center py-2 bg-[#FFFCF3]">
          <div
            className="font-bold text-left"
            style={{ color: "#502F00", fontSize: "3vw" }}
          >
            Our novel protein detection and visualization workflow
          </div>
        </section>
        {/* First iframe - DIAG */}
        <section className="visualizations-section bg-[#FFFCF3] py-6">
          <div className="max-w-[1100px] mx-auto px-6">
<VideoEmbed videoSrc="https://video.igem.org/videos/embed/gSwUYs3uMjFLB7HaaMq8Xd?loop=1&autoplay=1&muted=1&title=0&warningTitle=0&controlBar=1&peertubeLink=0"aspectRatio="aspect-[16/8.754]"/>
          </div>
        </section>
        {/* SolutionDiagnostic */}

        <div className="text-white">
          <SolutionDiagnostic />
        </div>
        <section
          className="flex justify-center items-center py-4 bg-[#FFFCF3]"
          style={{ marginTop: "8%" }}
        >
          <div
            className="font-bold text-center"
            style={{ color: "#502F00", fontSize: "4vw" }}
          >
            The Therapeutic:
          </div>
        </section>
        <section className="flex justify-center items-center py-2 bg-[#FFFCF3]">
          <div
            className="font-bold text-left"
            style={{ color: "#502F00", fontSize: "3vw" }}
          >
            Our resistance combating antibiotic system for Lyme{" "}
          </div>
        </section>
        {/* Second iframe - THEREP */}
        <section className="visualizations-section bg-[#FFFCF3] py-12">
          <div className="max-w-[1100px] mx-auto px-6">
            <VideoEmbed videoSrc="https://video.igem.org/videos/embed/hKHvhcSsZxTHmeu7PbX94x?loop=1&autoplay=1&muted=1&title=0&warningTitle=0&controlBar=1&peertubeLink=0" aspectRatio="aspect-[16/8.776]"/>
          </div>
        </section>
        {/* SolutionTherapeutic */}
        <div className="text-white">
          <SolutionTherapeutic />
        </div>
        {/* Graphics Section */}
        <div className="text-white hidden sm:block" style={{ marginTop: "20%" }}>
          <Footernav overlap={80} />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default HomePage;
