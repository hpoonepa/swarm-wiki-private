import React from "react";
import SiInstagram from "@icons-pack/react-simple-icons/icons/SiInstagram.mjs";
import SiGmail from "@icons-pack/react-simple-icons/icons/SiGmail.mjs";
import SiX from "@icons-pack/react-simple-icons/icons/SiX.mjs";
import SiGooglemaps from "@icons-pack/react-simple-icons/icons/SiGooglemaps.mjs";

const SPONSOR_LOGOS = [
  { name: "Thermo Fisher Scientific", url: "https://static.igem.wiki/teams/5612/footer/bhamla-sponsor-card.webp" },
  { name: "IDT", url: "https://static.igem.wiki/teams/5612/footer/ctae-sponsor-card.webp" },
  { name: "New England BioLabs", url: "https://static.igem.wiki/teams/5612/footer/fsa-sponsor-card.webp" },
  { name: "Georgia Tech BME", url: "https://static.igem.wiki/teams/5612/footer/georgia-life-science-sponsor-card.webp" },
  { name: "Forsyth County Schools", url: "https://static.igem.wiki/teams/5612/footer/gt-cos-sponsor-card.webp" },
  { name: "GenScript", url: "https://static.igem.wiki/teams/5612/footer/idt-sponsor-card.webp" },
  { name: "Qiagen", url: "https://static.igem.wiki/teams/5612/footer/lambert-sponsor-card.webp" },
  { name: "Opentrons", url: "https://static.igem.wiki/teams/5612/footer/opentron-sponsor-card.webp" },
  { name: "Styczynski Lab", url: "https://static.igem.wiki/teams/5612/footer/styczynski-sponsor-card.webp" },
  { name: "Twist Bioscience", url: "https://static.igem.wiki/teams/5612/footer/twist-sponsor-card.webp" },
];
const duplicatedSponsors = [...SPONSOR_LOGOS, ...SPONSOR_LOGOS];

const SponsorsStrip = () => (
  <div className="w-[70%] scale-[175%] mt-16 mb-16 md:scale-100 md:mt-0 md:mb-0 mx-auto md:w-full">
    <div
      className="relative flex overflow-hidden rounded-xl border border-white/10 bg-[#7b4a2e]/80 py-3"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <div className="marquee-track flex shrink-0 items-center gap-8 will-change-transform hover:[animation-play-state:paused] px-8">
        {duplicatedSponsors.map(({ name, url }, i) => (
          <div key={`${i}-${name}`} className="shrink-0">
            <img
              src={url}
              alt={name}
              title={name}
              loading="lazy"
              decoding="async"
              className="h-14 w-auto object-contain"
            />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marqueeX {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marqueeX 28s linear infinite;
        }
      `}</style>
    </div>
  </div>
);

const Footer = () => {
  const currentYear = 2026;

  return (
    <footer className="relative w-full bottom-0 left-0">
      <div className="bg-[#153f36]" style={{ minHeight: "400px" }}>
        {/* Changed py-8 to pt-24 pb-8 to push content down */}
        <div className="w-full max-w-4xl scale-[60%] md:scale-100 mx-auto flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:pt-24 md:pb-8 text-white">
          <div className="flex flex-col scale-100 md:scale-125 w-full md:w-1/2">
            <h1 className="text-7xl md:text-4xl text-[#FFF] font-bold drop-shadow-lg">Lambert-GA</h1>
            <SponsorsStrip />
          </div>

          {/* Right side — Contact */}
          <div className="mt-28 mx-auto md:ml-20 md:mt-4 bg-[#fdf6ec] rounded-2xl p-5 scale-[175%] md:scale-100 text-sm text-[#502F00] shadow-lg">
            <h2 className="text-2xl font-bold text-[#6b4b00] mb-3">CONTACT US</h2>
            <div className="space-y-2">
              <p className="flex items-center gap-2 bg-[#faefdfff] p-2 rounded-lg">
                <SiInstagram className="h-4 w-4 text-pink-500" /> @lambertigem
              </p>
              <p className="flex items-center gap-2 bg-[#faefdfff] p-2 rounded-lg">
                <SiGmail className="h-4 w-4 text-red-500" /> igem.lamb@gmail.com
              </p>
              <p className="flex items-center gap-2 bg-[#faefdfff] p-2 rounded-lg">
                <SiX className="h-4 w-4 text-black" /> @lamberths_igem
              </p>
              <p className="flex items-center gap-2 bg-[#faefdfff] p-2 rounded-lg">
                <SiGooglemaps className="h-4 w-4 text-blue-500" /> 805 Nichols Road, Suwanee, GA 30024
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="w-full border-t border-white/60 py-3 text-center text-xs text-gray-200 font-semibold bg-black/20">
          <p>
            © {currentYear} - Content licensed under{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              className="underline hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              CC Attribution 4.0 International
            </a>
            .
          </p>
          <p>
            Repository:{" "}
            <a
              href="https://gitlab.igem.org/2026/lambert-ga"
              className="underline hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              https://gitlab.igem.org/2026/lambert-ga
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
