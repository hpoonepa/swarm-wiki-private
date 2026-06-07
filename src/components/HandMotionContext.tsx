import React, { createContext, useContext } from "react";
import { MotionValue } from "framer-motion";

type HandMotionContextType = {
  x: MotionValue<string> | null;
  y: MotionValue<string> | null;
  scale: MotionValue<number> | null;
};

const HandMotionContext = createContext<HandMotionContextType>({
  x: null,
  y: null,
  scale: null,
});

export const useHandMotion = () => useContext(HandMotionContext);

export const HandMotionProvider = HandMotionContext.Provider;
