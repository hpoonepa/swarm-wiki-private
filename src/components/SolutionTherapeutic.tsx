import React from "react";
import { SolutionCard } from "./Solutions";

function SolutionsTherapeutic() {

  const therapeutics = [
    {
      title: "CRISPRi",
      image: "https://static.igem.wiki/teams/5612/mainlayout/link/crisprinav.webp",
      alt: "CRISPRi",
      href: "/lambert-ga/therapeutics-overview/",
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
      href: "/lambert-ga/therapeutics-overview/",
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
    <section className="w-full flex flex-col items-center py-16">     {/* ---- THERAPEUTIC ---- */}
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        SEE MORE:
      </h2>

      <div className="flex flex-wrap justify-center gap-6">
        {therapeutics.map((item, idx) => (
          <SolutionCard key={idx} {...item} />
        ))}
      </div>
    </section>
  );
}

export default SolutionsTherapeutic;
