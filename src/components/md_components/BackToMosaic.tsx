import React, { useEffect, useState } from "react";

/**
 * BackToMosaic
 * Shows a top-centered, gradient-green button ONLY when the user has scrolled
 * past the bottom of the target element. Clicking it smooth-scrolls back to the target.
 */
type Props = {
  targetId?: string; // id of the mosaic container
  className?: string; // optional extra classes for the wrapper
};

export default function BackToMosaic({
  targetId = "education-mosaic",
  className = "",
}: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => {
      const el = document.getElementById(targetId);
      if (!el) {
        setShow(false);
        return;
      }
      const rect = el.getBoundingClientRect();
      // Button shows only when the mosaic is fully above the viewport
      // i.e., you've scrolled past it
      setShow(rect.bottom <= 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!show) return null;

  return (
    <div
      className={`fixed z-[60] top-4 left-1/2 -translate-x-1/2 ${className}`}
      aria-live="polite"
    >
      <button
        onClick={handleClick}
        className="
          px-5 py-2 rounded-2xl font-semibold shadow-lg
          bg-gradient-to-r from-green-600 to-green-400
          text-white/95 hover:text-white
          opacity-90 hover:opacity-100 transition
          border border-white/20 backdrop-blur
        "
        aria-label="Back to Education Mosaic"
      >
        ↑ Back to Education Mosaic
      </button>
    </div>
  );
}
