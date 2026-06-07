import React from "react";

export default function Awards() {
  return (
    // This section uses negative top margin and a high z-index so it visually
    // overlaps the hero area above it. Adjust the -mt values to tweak overlap.
    <section
      className="relative flex justify-center px-4 sm:px-6 z-40"
      style={{ marginTop: "5%" }}
    >
      <div className="max-w-md md:max-w-4xl w-full bg-[#5C3B22] text-white rounded-2xl p-4 md:p-8 shadow-lg">
        {/* Main title with icon */}
        <div className="flex items-center justify-center gap-4 mb-4 md:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-center w-full text-[#ffffff]">
            Awards
          </h2>
        </div>

        {/* Three badges */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 md:gap-8 mb-6 md:mb-8">
          {/* Top 10 */}
          <div className="flex flex-col items-center gap-2 md:w-1/3">
            <img
              src="https://static.igem.wiki/teams/5612/awards/top10.avif"
              alt="top 10"
              className="h-20 w-20 md:h-32 md:w-32 lg:h-40 lg:w-40 object-contain"
            />
            <div className="mt-1 md:mt-2 font-semibold text-center w-full text-[#ffffff] text-xs sm:text-sm md:text-base">
              Top 10
            </div>
          </div>

          {/* Gold Medal - center aligned */}
          <div className="flex flex-col items-center gap-2 md:w-1/3">
            <img
              src="https://static.igem.wiki/teams/5612/awards/gold.avif"
              alt="gold medal"
              className="h-20 w-20 md:h-32 md:w-32 lg:h-40 lg:w-40 object-contain"
            />
            <div className="mt-1 md:mt-2 font-semibold text-center w-full text-[#ffffff] text-xs sm:text-sm md:text-base">
              Gold Medal
            </div>
          </div>

          {/* Best Software Tool */}
          <div className="flex flex-col items-center gap-2 md:w-1/3">
            <img
              src="https://static.igem.wiki/teams/5612/awards/softwaretool.avif"
              alt="best software tool"
              className="h-20 w-20 md:h-32 md:w-32 lg:h-40 lg:w-40 object-contain"
            />
            <div className="mt-1 md:mt-2 font-semibold text-center w-full text-[#ffffff] text-xs sm:text-sm md:text-base">
              Best Software Tool
            </div>
          </div>
        </div>

        {/* Nominations heading */}
        <div className="text-center text-base sm:text-lg md:text-xl font-bold mb-3 md:mb-6 text-[#ffffff]">
          Nominations
        </div>

        {/* Nominations grid */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-center text-gray-200 text-xs sm:text-sm md:text-base">
          <div>Best Model</div>
          <div>Best Wiki</div>
          <div>Best Education</div>
          <div>Best Village Project</div>
        </div>

        <div className="text-center text-xs sm:text-sm md:text-base font-bold mt-3 md:mt-6 text-[#ffffff]">
          Featured on CBS 60 Minutes
        </div>
      </div>
    </section>
  );
}
