import React from "react";
import { SolutionCard } from "./Solutions";

function SolutionsDiagnostic() {
  const diagnostics = [
    {
      title: "PDL",
      image: "https://static.igem.wiki/teams/5612/mainlayout/link/pdlnav.webp",
      alt: "PDL",
      href: "/lambert-ga/diagnosticsoverview#proximity-dependent-ligation",
      description: (
        <>
          Proximity Dependent Ligation
        </>
      ),
      subtext: (
        <>
          DNA Production
        </>
      ),
    },
    {
      title: "RPA",
      image: "https://static.igem.wiki/teams/5612/mainlayout/link/rpanav.webp",
      alt: "RPA",
      href: "/lambert-ga/diagnosticsoverview#recombinase-polymerase-amplification",
      description: (
        <>
          Recombinase Polymerase Amplification
        </>
      ), subtext: (
        <>
          DNA Amplification
        </>
      ),
    },
    {
      title: "Cas12",
      image: "https://static.igem.wiki/teams/5612/mainlayout/link/cas12nav.webp",
      alt: "Cas12",
      href: "/lambert-ga/diagnosticsoverview#cas12a-detectr",
      description: (
        <>
          CRISPR-Cas12
        </>
      ), subtext: (
        <>
          DNA Detection
        </>
      ),
    },
    {
      title: "LFA",
      image: "https://static.igem.wiki/teams/5612/mainlayout/link/lfanav.webp",
      alt: "LFA",
      href: "/lambert-ga/diagnosticsoverview#cas12a-detectr",
      description: (
        <>
          Lateral Flow Assay
        </>
      ), subtext: (
        <>
          Visual Output
        </>
      ),
    },
  ];

  const therapeutics = [
    {
      title: "CRISPRi",
      image: "https://static.igem.wiki/teams/5612/mainlayout/link/crisprinav.webp",
      alt: "CRISPRi",
      href: "/lambert-ga/therapeutics-crispri/",
      description: (
        <>
          CRISPR Interference
        </>
      ), subtext: (
        <>
          Gene Downregulation
        </>
      ),
    },
    {
      title: "LNPs",
      image: "https://static.igem.wiki/teams/5612/mainlayout/link/lnpnav.webp",
      alt: "LNPs",
      href: "/lambert-ga/therapeutics-lnps/",
      description: (
        <>
          Lipid Nanoparticles
        </>
      ), subtext: (
        <>
          Delivery Mechanism
        </>
      ),
    },
  ];

  return (
    <section className="w-full flex flex-col items-center py-16">
      {/* ---- DIAGNOSTIC ---- */}
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        SEE MORE:
      </h2>

      {/* Mobile: Grid layout with arrows */}
      <div className="md:hidden mb-14">
        <div className="grid grid-cols-2 gap-6 place-items-center relative">
          {/* First row: PDL and RPA */}
          <div className="flex flex-col items-center">
            <SolutionCard {...diagnostics[0]} />
          </div>
          
          {/* Right arrow between PDL and RPA */}
          <div className="flex flex-col items-center relative">
            <SolutionCard {...diagnostics[1]} />
            <svg 
              className="w-6 h-6 text-gray-600 absolute -left-6 top-1/2 transform -translate-y-1/2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </div>
          
          {/* Down arrow from RPA to LFA */}
          <div className="col-start-2 flex justify-center mt-8">
            <svg 
              className="w-6 h-6 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </div>
          
          {/* Second row: Cas12 and LFA */}
          <div className="flex flex-col items-center mt-8">
            <SolutionCard {...diagnostics[2]} />
          </div>
          
          {/* Left arrow between Cas12 and LFA */}
          <div className="flex flex-col items-center mt-8 relative">
            <SolutionCard {...diagnostics[3]} />
            <svg 
              className="w-6 h-6 text-gray-600 absolute -left-6 top-1/2 transform -translate-y-1/2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop: Row layout with arrows */}
      <div className="hidden md:flex items-center justify-center gap-4 mb-14 flex-wrap">
        {diagnostics.map((item, idx) => (
          <React.Fragment key={idx}>
            <SolutionCard {...item} />
            {idx < diagnostics.length - 1 && (
              <div className="flex items-center">
                <svg 
                  className="w-8 h-8 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

    </section>
  );
}

export default SolutionsDiagnostic;
