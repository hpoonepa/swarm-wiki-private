import React, { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface NavButtonProps {
  isOpen: boolean;
  // other props
}

const NavButton = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    console.log(false);
    setOpen(!open);
  };

  return (
    <>
      <button
        className="rounded-full z-30 bg-orange-300 hover:bg-yellow-300 text-white font-bold py-6 px-6"
        onClick={handleClick}
      ></button>

      <motion.div
        layoutId="navmenu"
        className={`bg-yellow-200 right-0 top-0 absolute flex justify-center align-middle z-20 ${
          open ? "  w-full h-full" : "w-1 h-1 -m-2"
        }`}
      >
        {open && <p className="m-10">navigation buttons</p>}
      </motion.div>
    </>
  );
};

export default NavButton;
