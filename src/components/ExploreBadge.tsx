import React, { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
  title: string;
  href?: string;
  items?: { title: string; href: string }[];
};

const MENU: { title: string; config: NavItem }[] = [
  { title: "Home",   config: { title: "Home", href: "/" } },
  { title: "Team",   config: { title: "Team", items: [
      { title: "Team Page",    href: "/lambert-ga/team" },
      { title: "Attributions", href: "/lambert-ga/attributions" },
    ] } },
  { title: "Project",config: { title: "Project", items: [
      { title: "Description",         href: "/lambert-ga/description" },
      { title: "Contribution",        href: "/lambert-ga/contribution" },
      { title: "Engineering Success", href: "/lambert-ga/engineering" },
      { title: "Implementation",      href: "/lambert-ga/implementation" },
    ] } },
  { title: "Wetlab", config: { title: "Wetlab", items: [
      { title: "PDL",          href: "/lambert-ga/diagnostics-pdl" },
      { title: "RPA",          href: "/lambert-ga/diagnostics-rpa" },
      { title: "Cas12",        href: "/lambert-ga/diagnostics-cas12" },
      { title: "RNAi", href: "/lambert-ga/therapeutics-crispri" },
      { title: "LNPs",         href: "/lambert-ga/therapeutics-lnps" },
      { title: "Parts Library",href: "/lambert-ga/parts-library" },
      { title: "Experiments",  href: "/lambert-ga/experiments" },
      { title: "Notebook",     href: "/lambert-ga/notebook" },
      { title: "Results",      href: "/lambert-ga/results" },
    ] } },
  { title: "Drylab", config: { title: "Drylab", items: [
      { title: "Hardware", href: "/lambert-ga/hardware" },
      { title: "Software", href: "/lambert-ga/software" },
      { title: "Model",    href: "/lambert-ga/model" },
    ] } },
  { title: "HP",     config: { title: "HP", items: [
      { title: "Our Approach", href: "/lambert-ga/human-practices" },
      { title: "Education",    href: "/lambert-ga/hp-healthcare" },
      { title: "Sustainable Development",  href: "/lambert-ga/hp-sustainability" },
      { title: "Safety",       href: "/lambert-ga/safety" },
    ] } },
];

export function ExploreBadge() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // AnimatePresence ensures exit animations play
  return (
    <>
      {/* Menu Button */}
      <div
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 w-28 h-28 z-50 cursor-pointer"
      >
        <div className="w-full h-full flex items-center justify-center">
          <img
            src="https://static.igem.wiki/teams/5612/education/newticknavbar.avif"
            alt="Menu"
            className="w-[60%] ml-10 md:ml-0 md:w-[67%] lg:w-40 object-contain will-change-transform [animation:spin_10s_linear_infinite]"
            style={{ transformOrigin: "50% 50%" }}
          />
        </div>
      </div>

      {/* Animated Navigation Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-[60] flex items-start justify-end"
          >
            {/* Transparent backdrop */}
            <button
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              aria-label="Close menu"
            />

            {/* Sliding nav box */}
            <motion.div
              key="nav-box"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 18,
                duration: 0.05,
              }}
              className="relative z-[70] bg-[#6A3E00] text-[#FFF] p-12 rounded-bl-[50px] shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-12 right-12 hover:text-amber-200 font-bold"
              >
                <X height={"36px"} width={"36px"} />
              </button>

              {/* Grid Layout */}
              <div className="grid grid-cols-2 text-[18px] sm:text-[24px] gap-6 mt-8">
                {/* Left column */}
                <div>
                  <Section title="Team">
                    <NavLink href="/lambert-ga/team" onClose={() => setOpen(false)}>Team Page</NavLink>
                    <NavLink href="/lambert-ga/attributions" onClose={() => setOpen(false)}>Attributions</NavLink>
                  </Section>

                  <Section title="Project">
                    <NavLink href="/lambert-ga/description" onClose={() => setOpen(false)}>Description</NavLink>
                    <NavLink href="/lambert-ga/contribution" onClose={() => setOpen(false)}>Contribution</NavLink>
                    <NavLink href="/lambert-ga/engineering" onClose={() => setOpen(false)}>Engineering Success</NavLink>
                    <NavLink href="/lambert-ga/implementation" onClose={() => setOpen(false)}>Implementation</NavLink>
                  </Section>

                  <Section title="Drylab">
                    <NavLink href="/lambert-ga/hardware" onClose={() => setOpen(false)}>Hardware</NavLink>
                    <NavLink href="/lambert-ga/software" onClose={() => setOpen(false)}>Software</NavLink>
                    <NavLink href="/lambert-ga/model" onClose={() => setOpen(false)}>Model</NavLink>
                  </Section>
                </div>

                {/* Right column */}
                <div>
                  <Section title="Wetlab">
                    <NavLink href="/lambert-ga/diagnosticsoverview" onClose={() => setOpen(false)}>Minibinders</NavLink>
                    <div className="ml-4">
                      <NavLink href="/lambert-ga/diagnostics-pdl" onClose={() => setOpen(false)}>PDL</NavLink>
                      <NavLink href="/lambert-ga/diagnostics-rpa" onClose={() => setOpen(false)}>RPA</NavLink>
                      <NavLink href="/lambert-ga/diagnostics-cas12" onClose={() => setOpen(false)}>Cas12a</NavLink>
                    </div>
                    <NavLink href="/lambert-ga/therapeutics-overview" onClose={() => setOpen(false)}>RNAi</NavLink>
                    <div className="ml-4">
                      <NavLink href="/lambert-ga/therapeutics-crispri" onClose={() => setOpen(false)}>CRISPRi</NavLink>
                      <NavLink href="/lambert-ga/therapeutics-lnps" onClose={() => setOpen(false)}>LNPs</NavLink>
                    </div>
                    <NavLink href="/lambert-ga/results" onClose={() => setOpen(false)}>Results</NavLink>
                    <NavLink href="/lambert-ga/parts-library" onClose={() => setOpen(false)}>Parts Library</NavLink>
                    <NavLink href="/lambert-ga/experiments" onClose={() => setOpen(false)}>Experiments</NavLink>
                    <NavLink href="/lambert-ga/notebook" onClose={() => setOpen(false)}>Notebook</NavLink>
                  </Section>

                  <Section title="Human Practices">
                    <NavLink href="/lambert-ga/human-practices" onClose={() => setOpen(false)}>Integrated HP</NavLink>
                    <NavLink href="/lambert-ga/education" onClose={() => setOpen(false)}>Education</NavLink>
                    <NavLink href="/lambert-ga/hp-entre" onClose={() => setOpen(false)}>Entrepreneurship</NavLink>
                    <NavLink href="/lambert-ga/hp-sustainability" onClose={() => setOpen(false)}>Sustainable Development</NavLink>
                    <NavLink href="/lambert-ga/safety" onClose={() => setOpen(false)}>Safety</NavLink>
                  </Section>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Helper components for structure and readability
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <h3 className="font-bold mb-2 text-amber-100">{title}</h3>
    <div className="space-y-1 ml-2">{children}</div>
  </div>
);

const NavLink = ({ href, children, onClose }: { href: string; children: React.ReactNode; onClose: () => void }) => (
  <a
    href={href}
    onClick={onClose}
    className="block font-semibold text-[#FFFFFF] hover:text-amber-200 transition-transform duration-200 hover:scale-105"
  >
    {children}
  </a>
);
