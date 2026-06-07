import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 1 }}          // start fully visible
    animate={{ opacity: 1 }}          // stay visible while mounted
    exit={{ opacity: 0 }}             // fade out when unmounted
    transition={{ duration: .5 }}    // smooth timing
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "#FFFCF3",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {/* Image in the middle */}
    <div className="flex-1 flex items-center justify-center">
      <img
        src="https://static.igem.wiki/teams/5612/mainlayout/tickjuggling.webp"
        alt="Loading"
        className="w-96 h-96 sm:w-[30rem] sm:h-[30m] md:w-[35rem] md:h-[35rem] lg:w-[40rem] lg:h-[40rem] xl:w-[45rem] xl:h-[45rem] object-contain"
      />
    </div>

  </motion.div>
);

export default LoadingScreen;
