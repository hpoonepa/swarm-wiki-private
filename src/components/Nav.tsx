import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import clsx from "clsx";
import "@fontsource-variable/inter";
import "../styles/global.css";
import "../styles/navbar.css";
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ChevronDown, MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ExploreBadge } from "./ExploreBadge";

export type NavItem = NavItemSolo | NavItemGroup;
export interface NavItemSolo {
  title: string;
  href: string;
}
export interface NavItemGroup {
  title: string;
  items: NavItem[];
}
function isNavItemGroup(object: any): object is NavItemGroup {
  return object && typeof object === "object" && Array.isArray(object.items);
}

export default function Nav({ className }: { className?: string }) {
  const [transparent, setTransparent] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    console.log(currentPath);
    setTransparent(
      currentPath === "/lambert-ga/" || currentPath === "/lambert-ga"
    );
  }, []);

  const [showBadge, setShowBadge] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [openSubGroups, setOpenSubGroups] = useState<string[]>([]);

  useEffect(() => {
    const onScroll = () => setShowBadge(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const schema: NavItem[] = [
    {
      title: "Team",
      items: [
        { title: "Team", href: "/lambert-ga/team" },
        { title: "Attributions", href: "/lambert-ga/attributions" },
      ],
    },
    {
      title: "Project",
      items: [
        { title: "Description", href: "/lambert-ga/description" },
        { title: "Contribution", href: "/lambert-ga/contribution" },
        { title: "Engineering Success", href: "/lambert-ga/engineering" },
        { title: "Implementation", href: "/lambert-ga/implementation" },
      ],
    },
    {
      title: "Wetlab",
      items: [
        {
          title: "Diagnostics",
          items: [
            { title: "Overview", href: "/lambert-ga/diagnosticsoverview" },
            { title: "PDL", href: "/lambert-ga/diagnostics-pdl" },
            { title: "RPA", href: "/lambert-ga/diagnostics-rpa" },
            { title: "CRISPR-Cas12a", href: "/lambert-ga/diagnostics-cas12" },
          ],
        },
        {
          title: "Therapeutics",
          items: [
            { title: "Overview", href: "/lambert-ga/therapeutics-overview" },
            { title: "CRISPRi", href: "/lambert-ga/therapeutics-crispri" },
            { title: "LNPs", href: "/lambert-ga/therapeutics-lnps" },
          ],
        },
        { title: "Parts Library", href: "/lambert-ga/parts-library" },
        { title: "Experiments", href: "/lambert-ga/experiments" },
        { title: "Notebook", href: "/lambert-ga/notebook" },
        { title: "Results", href: "/lambert-ga/results" },
      ],
    },
    {
      title: "Drylab",
      items: [
        { title: "Software", href: "/lambert-ga/software" },
        { title: "Model", href: "/lambert-ga/model" },
        { title: "Hardware", href: "/lambert-ga/hardware" },
      ],
    },
    {
      title: "Human Practices",
      items: [
        {
          title: "Integrated Human Practices",
          href: "/lambert-ga/human-practices",
        },
        {
          title: "Education",
          href: "/lambert-ga/education",
        },
        { title: "Entrepeneurship", href: "/lambert-ga/hp-entre" },
        { title: "Safety", href: "/lambert-ga/safety" },
      ],
    },
    {
      title: "Awards",
      href: "/lambert-ga/awards",
    },
  ];

  const MotionLink = motion(NavigationMenuPrimitive.Link);
  const toggleGroup = (title: string) =>
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  const toggleSubGroup = (title: string) =>
    setOpenSubGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );

  const FullNavbar = (
    <div
      className={clsx(
        "w-full fixed top-0 left-0 isolate z-[70] py-2 navbar-inter font-Inter",
        transparent ? "bg-transparent" : "bg-[#FFFCF3]",
        className
      )}
      style={{
        fontFamily:
          "'Inter', 'Inter Variable', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <NavigationMenuPrimitive.Root>
        {/* Desktop */}
        <NavigationMenuPrimitive.List className="hidden md:flex md:text-[1rem] flex-row items-center w-full py-4]">
          <div className="flex items-center">
            <a href="/lambert-ga/" className="flex items-center">
              <img
                src="https://static.igem.wiki/teams/5612/mainlayout/fabicon.webp"
                alt="Lambert GA Logo"
                className="h-16 w-12 lg:h-14 lg:w-16 xl:h-16 xl:w-20 object-contain"
              />
            </a>
          </div>
          <div className="flex flex-row items-center md:gap-0 lg:gap-4 justify-end w-full md:mr-2 lg:mr-4">
            {schema.map((item, index) => (
              <div key={index} className="relative">
                {isNavItemGroup(item) ? (
                  <NavigationMenuPrimitive.Item>
                    <NavigationMenuPrimitive.Trigger
                      className={clsx(
                        "px-4 py-3 rounded-full transition-colors duration-200",
                        "flex items-center gap-2 lg:text-lg font-bold uppercase text-green-800 hover:bg-[#B8D9B7] md:text-md"
                      )}
                    >
                      {item.title}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </NavigationMenuPrimitive.Trigger>

                    {/* Top-level dropdown panel */}
                    <NavigationMenuPrimitive.Content
                      className={clsx(
                        "absolute mt-2 z-[80] rounded-3xl border border-[#156634]",
                        "bg-white/95 backdrop-blur-sm"
                      )}
                      style={{ backgroundColor: "#FFFCF3", borderWidth: "2px" }}
                    >
                      <div className="min-w-56 p-2 flex flex-col">
                        {item.items.map((link, idx) =>
                          isNavItemGroup(link) ? (
                            <div key={idx} className="group relative">
                              {/* Parent label */}
                              <div
                                className={clsx(
                                  "flex items-center justify-between py-2 px-3 font-bold",
                                  "text-green-800 hover:text-white hover:bg-[#B8D9B7] rounded-2xl cursor-pointer"
                                )}
                              >
                                {link.title}
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </div>

                              {/* Nested submenu */}
                              <div
                                className={clsx(
                                  "absolute left-full top-0 ml-2 min-w-20 rounded-2xl",
                                  "invisible  group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
                                  "transition-opacity duration-150 z-[90] border border-[#512F00]",
                                  "bg-white/95"
                                )}
                                style={{
                                  backgroundColor: "#FFFCF3",
                                  borderWidth: "2px",
                                  transform: "translateX(-0%)",
                                  color: "#512F00",
                                }}
                              >
                                {/* Hover bridge to prevent flicker */}
                                <div className="absolute -left-4 top-0 w-4 h-full bg-transparent" />

                                <div className="flex flex-col p-2">
                                  {link.items.map((subLink, subIdx) =>
                                    !isNavItemGroup(subLink) ? (
                                      <NavigationMenuPrimitive.Link
                                        key={subIdx}
                                        href={subLink.href}
                                        className="py-2 px-3 font-bold hover:text-white hover:bg-[#EBCBA4] rounded-2xl transition-colors duration-150"
                                      >
                                        {subLink.title}
                                      </NavigationMenuPrimitive.Link>
                                    ) : null
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <NavigationMenuPrimitive.Link
                              href={link.href}
                              key={idx}
                              className="py-2 px-3 text-green-800 font-bold hover:text-white hover:bg-[#B8D9B7] rounded-2xl transition-colors duration-150"
                            >
                              {link.title}
                            </NavigationMenuPrimitive.Link>
                          )
                        )}
                      </div>
                    </NavigationMenuPrimitive.Content>
                  </NavigationMenuPrimitive.Item>
                ) : (
                  <NavigationMenuPrimitive.Item asChild>
                    <NavigationMenuPrimitive.Link
                      href={(item as NavItemSolo).href}
                      className="px-5 py-2 flex items-center rounded-full hover:bg-[#B8D9B7] gap-2 text-lg font-extrabold uppercase text-green-800"
                    >
                      {(item as NavItemSolo).title}
                    </NavigationMenuPrimitive.Link>
                  </NavigationMenuPrimitive.Item>
                )}
              </div>
            ))}
          </div>
        </NavigationMenuPrimitive.List>

        {/* Mobile */}
        <div className="z-[80] md:hidden flex items-center justify-between w-full px-4 py-4">
          {/* Left side - Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                style={{ backgroundColor: "transparent", borderWidth: "0px" }}
                variant="outline"
                size="icon"
              >
                <MenuIcon></MenuIcon>
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              {/* Mobile Sheet Logo */}
              <div className="flex items-center mb-6 pt-4">
                <a href="/lambert-ga/" className="flex items-center">
                  <img
                    src="https://static.igem.wiki/teams/5612/mainlayout/fabicon.webp"
                    alt="Lambert GA Logo"
                    className="h-8 w-8 object-contain mr-3"
                  />
                  <span className="text-lg font-bold text-green-800">
                    Lambert GA
                  </span>
                </a>
              </div>

              <nav
                className="flex flex-col space-y-4 bg-[#FFFCF3]"
                style={{ marginTop: "5%" }}
              >
                {schema.map((item, index) => (
                  <React.Fragment key={index}>
                    {isNavItemGroup(item) ? (
                      <div>
                        <Button
                          variant="ghost"
                          className="w-full justify-between"
                          onClick={() => toggleGroup(item.title)}
                        >
                          {item.title}
                          <motion.div
                            animate={{
                              rotate: openGroups.includes(item.title) ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </motion.div>
                        </Button>
                        <AnimatePresence>
                          {openGroups.includes(item.title) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <div className="space-y-2 ml-4 mt-2">
                                {item.items.map((subItem, subIndex) =>
                                  isNavItemGroup(subItem) ? (
                                    <div key={subIndex}>
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-between ml-2"
                                        onClick={() =>
                                          toggleSubGroup(subItem.title)
                                        }
                                      >
                                        {subItem.title}
                                        <motion.div
                                          animate={{
                                            rotate: openSubGroups.includes(
                                              subItem.title
                                            )
                                              ? 180
                                              : 0,
                                          }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <ChevronDown className="h-4 w-4" />
                                        </motion.div>
                                      </Button>
                                      <AnimatePresence>
                                        {openSubGroups.includes(
                                          subItem.title
                                        ) && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                              opacity: 1,
                                              height: "auto",
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{
                                              duration: 0.3,
                                              ease: "easeInOut",
                                            }}
                                          >
                                            <div className="space-y-2 ml-4 mt-2">
                                              {subItem.items.map(
                                                (deepItem, deepIdx) =>
                                                  !isNavItemGroup(deepItem) ? (
                                                    <MotionLink
                                                      key={deepIdx}
                                                      href={deepItem.href}
                                                      className="block py-2 px-4 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                                                      initial={{
                                                        opacity: 1,
                                                        x: -10,
                                                      }}
                                                      animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                      }}
                                                      exit={{
                                                        opacity: 0,
                                                        x: -10,
                                                      }}
                                                      transition={{
                                                        duration: 0.2,
                                                        delay: deepIdx * 0.05,
                                                      }}
                                                    >
                                                      {deepItem.title}
                                                    </MotionLink>
                                                  ) : null
                                              )}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  ) : (
                                    <MotionLink
                                      key={subIndex}
                                      href={(subItem as NavItemSolo).href}
                                      className="block py-2 px-4 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -10 }}
                                      transition={{
                                        duration: 0.2,
                                        delay: subIndex * 0.05,
                                      }}
                                    >
                                      {(subItem as NavItemSolo).title}
                                    </MotionLink>
                                  )
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <a
                        href={(item as NavItemSolo).href}
                        className="block py-2 px-4 text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                      >
                        {(item as NavItemSolo).title}
                      </a>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Right side - Logo */}
          <div className="flex items-center">
            <a href="/lambert-ga/" className="flex items-center">
              <img
                src="https://static.igem.wiki/teams/5612/mainlayout/fabicon.webp"
                alt="Lambert GA Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
              />
            </a>
          </div>
        </div>
      </NavigationMenuPrimitive.Root>
    </div>
  );

  return <>{!showBadge ? FullNavbar : <ExploreBadge />}</>;
}
