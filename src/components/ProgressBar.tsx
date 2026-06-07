import { useScroll, motion } from "framer-motion";

export default function ProgressBar() {
  const { scrollY, scrollYProgress } = useScroll();
  return (
    <div
      className="bg-slate-100 fixed top-0 left-0 right-0 pt-8"
      style={{ marginTop: -40 }}
    >
      {/* current todo: trying to make progress bar's top bar show only after scroll bt margin Top -40 initially, then adding as scroll. */}
      <motion.div
        className="bottom-0 left-0 pb-1 mt-2 right-0 bg-yellow-400 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
