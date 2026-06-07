import CircleNavigator from "../CircleNavigator";
import React, { useState, useEffect, useRef, useMemo } from "react";

// This internal data structure remains the same
export interface EngineeringData {
  [key: string]: string[][];
}

// The component's props now expect an array of raw MDX content strings
export interface Props {
  data: string[];
  type: string;
  colors?: string[];
}

/**
 * Parses a raw MDX string into a structured object.
 * @param {string} content - The raw string content of an MDX file.
 * @returns An object with the title and structured iteration data, or null if parsing fails.
 */
const parseMdxContent = (content: string) => {
  // 1. Extract the title from the frontmatter
  const titleMatch = content.match(/title:\s*"?([^"\n]+)"?/);
  const title = titleMatch ? titleMatch[1].trim() : null;

  if (!title) {
    console.error("Parsing Error: Could not find a 'title' in the MDX frontmatter.");
    return null;
  }

  // 2. Get the main body of content after the frontmatter
  const body = content.split('---')[2] || content;

  // 3. Split the body into blocks for each iteration heading (e.g., "# Iteration 1")
  const iterationBlocks = body.split(/# Iteration \d+/i).filter(block => block.trim() !== "");

  const allIterationsData: string[][] = [];

  // 4. For each iteration block, extract the content for each phase
  for (const block of iterationBlocks) {
    const iterationPhases: string[] = [];
    const phaseOrder = ["Design", "Build", "Test", "Learn"];

    for (let i = 0; i < phaseOrder.length; i++) {
      const currentPhase = phaseOrder[i];
      const nextPhase = phaseOrder[i + 1];

      // Regex to find content between the current phase heading (e.g., "## Design")
      // and the next phase heading or the end of the block.
      const regex = new RegExp(
        `## ${currentPhase}\\s*([\\s\\S]*?)(?=\\s*## ${nextPhase}|$)`,
        'i'
      );
      const match = block.match(regex);
      
      // Add the found content or a fallback message
      iterationPhases.push(match ? match[1].trim() : `Content for ${currentPhase} not found.`);
    }
    allIterationsData.push(iterationPhases);
  }
  
  return { title, iterations: allIterationsData };
};


export default function EngineeringDesign({
  type = "DIAGNOSTIC",
  data: mdxContents = [], // The 'data' prop now contains raw MDX strings
  colors = ["#EDC280", "#C98E5D", "#A5693B", "#814419"],
}: Props) {
  // --- Data Parsing & Transformation ---
  // useMemo ensures this parsing logic only runs when the mdxContents prop changes.
  const engineeringData: EngineeringData = useMemo(() => {
    const allData: EngineeringData = {};
    for (const content of mdxContents) {
      const parsed = parseMdxContent(content);
      if (parsed) {
        allData[parsed.title] = parsed.iterations;
      }
    }
    return allData;
  }, [mdxContents]);

  // --- From here down, the component logic is IDENTICAL to your original code ---
  
  // Guard clause for when no valid data could be parsed
  if (Object.keys(engineeringData).length === 0) {
    return <div>No valid engineering data to display. Check your MDX file format.</div>;
  }

  const titles = Object.keys(engineeringData);
  const maxIterations = Math.max(
    ...Object.values(engineeringData).map((iterations) => iterations.length)
  );
  const bodies: string[][][] = [];
  for (let i = 0; i < maxIterations; i++) {
    const iterationData: string[][] = [];
    for (const tab of titles) {
      iterationData.push(engineeringData[tab][i] ?? []);
    }
    bodies.push(iterationData);
  }

  const [activeTab, setActiveTab] = useState(titles[0]);
  const [progress, setProgress] = useState(0);
  const [currentIteration, setCurrentIteration] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const phaseRefs = useRef(new Map<string, HTMLElement>());
  const iterationRefs = useRef(new Map<number, HTMLElement>());

  const activeTabIndex = titles.indexOf(activeTab);
  const numIterations = bodies.length;

  const contentForActiveTab = bodies.map(
    (iterationData) => iterationData[activeTabIndex] || []
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let raf: number | null = null;
    const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(v, b));

    const computeProgress = () => {
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const bottomCursor = container.scrollTop + container.clientHeight;
      let totalProgress = 0;

      for (let i = 0; i < numIterations; i++) {
        for (let p = 0; p < 4; p++) {
          const phaseEl = phaseRefs.current.get(`${i}-${p}`);
          if (!phaseEl) continue;

          const phaseRect = phaseEl.getBoundingClientRect();
          const phaseTop = phaseRect.top - containerRect.top + container.scrollTop;
          const phaseHeight = Math.max(1, phaseRect.height);
          const revealedPx = clamp(bottomCursor - phaseTop, 0, phaseHeight);
          const fraction = revealedPx / phaseHeight;
          totalProgress += fraction;
        }
      }

      const clampedTotal = clamp(totalProgress, 0, numIterations * 4);
      setProgress(clampedTotal);

      const iterIndex = Math.min(Math.floor(clampedTotal / 4), Math.max(0, numIterations - 1));
      setCurrentIteration(iterIndex + 1);
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(computeProgress);
    };

    const initTimeout = window.setTimeout(computeProgress, 20);
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", computeProgress);

    return () => {
      clearTimeout(initTimeout);
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", computeProgress);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [activeTab, numIterations]);

  return (
    <div style={{ width: "90vw", height: "auto", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", fontSize: "48px", fontWeight: "bold" }}>
        <h1>
          {type}: {activeTab} - ITERATION {currentIteration}/{numIterations}
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          minHeight: "300px",
          marginTop: "40px",
          marginBottom: "20px",
          borderRadius: "20px",
          alignItems: "center",
        }}
      >
        <CircleNavigator
          progress={progress}
          iterations={numIterations}
          colors={colors}
        />

        <div
          ref={scrollRef}
          style={{
            backgroundColor: "#F9F0E3",
            flex: 1,
            marginLeft: "20px",
            borderRadius: "10px",
            height: "400px",
            overflowY: "auto",
            padding: "20px",
            border: "1px solid #ddd"
          }}
        >
          {contentForActiveTab.map((iterationBodies, iterIndex) => (
            <div
              key={`iter-${iterIndex}`}
              ref={(el) => {
                if (el) iterationRefs.current.set(iterIndex, el);
                else iterationRefs.current.delete(iterIndex);
              }}
              style={{ marginBottom: "2rem" }}
            >
              <h1 style={{fontSize: "28px", color: "#4b2716", borderBottom: "4px solid #d2691e", paddingBottom: "8px", marginBottom: "1rem"}}>
                Iteration {iterIndex + 1}
              </h1>
              {["Design", "Build", "Test", "Learn"].map((phase, phaseIndex) => (
                <div
                  key={phase}
                  ref={(el) => {
                    const key = `${iterIndex}-${phaseIndex}`;
                    if (el) phaseRefs.current.set(key, el);
                    else phaseRefs.current.delete(key);
                  }}
                  style={{ marginBottom: "1.5rem" }}
                >
                  <h2
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      color: "#4b2716",
                    }}
                  >
                    {phase}
                  </h2>
                  <p style={{ lineHeight: "1.6" }}>
                    {iterationBodies[phaseIndex] || "No content available."}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          border: "2px solid #000000",
          borderRadius: "10px",
          minHeight: "80px",
          padding: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          marginTop: "10px",
        }}
      >
        {titles.map((tab) => (
          <div
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setProgress(0);
              if (scrollRef.current) scrollRef.current.scrollTop = 0;
            }}
            style={{
              backgroundColor: activeTab === tab ? "#4b2716" : "#814419",
              color: "white",
              flex: 1,
              textAlign: "center",
              padding: "12px 24px",
              margin: "0 8px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.2s ease",
              borderBottom:
                activeTab === tab
                  ? "4px solid #d2691e"
                  : "4px solid transparent",
            }}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
}