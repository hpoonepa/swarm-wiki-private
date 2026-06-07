import React from "react";

export interface SolutionCardProps {
  title: string;
  image: string;
  alt: string;
  description: React.ReactNode;
  subtext: React.ReactNode;
  href: string;
}

export function SolutionCard({ title, image, alt, description, subtext, href }: SolutionCardProps) {
  return (
    <a href={href} aria-label={`${title} link`} className="block no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70 rounded-2xl">
      <div
        className="rounded-2xl shadow-md flex flex-col items-center bg-[#254A08] text-white w-[180px] md:w-[200px] min-h-[320px] hover:translate-y-[-2px] transition-transform"
        style={{ paddingTop: "20px", paddingLeft: "10px", paddingRight: "10px" }}
      >
        <h3 className="text-lg font-bold font" style={{ color: "white", marginBottom: "10px", fontSize: "2rem" }}>{title}</h3>
        <img src={image} alt={alt} className="w-40 h-40 mb-3" style={{ borderRadius: "10px" }} />
        <h4 className="text-sm text-center font-bold" style={{ color: "white", marginBottom: "10px" }}>{description}</h4>
        <h4 className="text-sm text-center" style={{ color: "white" }}>{subtext}</h4>
      </div>
    </a>
  );
}

function Solutions() {
  const diagnostics = [
    {
      title: "PDL",
      image: "https://static.igem.wiki/teams/5612/mainlayout/link/pdlnav.webp",
      alt: "PDL",
      href: "/lambert-ga/diagnostics-pdl/",
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
      href: "/lambert-ga/diagnostics-rpa/",
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
      href: "/lambert-ga/diagnostics-cas12/",
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
      href: "/lambert-ga/diagnosticsoverview/",
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
        OUR DIAGNOSTIC SOLUTION
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14 place-items-center">
        {diagnostics.map((item, idx) => (
          <SolutionCard key={idx} {...item} />
        ))}
      </div>

      {/* ---- THERAPEUTIC ---- */}
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        OUR THERAPEUTIC SOLUTION
      </h2>

      <div className="flex flex-wrap justify-center gap-6">
        {therapeutics.map((item, idx) => (
          <SolutionCard key={idx} {...item} />
        ))}
      </div>
    </section>
  );
}

export default Solutions;
