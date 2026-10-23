"use client";

import { useEffect, useState } from "react";

// Wings open -> half -> closed -> half, looped.
const STYLES = [
  ["ƸӜƷ", ")Ӝ(", "|Ӝ|", ")Ӝ("],
  ["}{", ")(", "||", ")("],
];

// Fixed (not random) so server and client markup always match.
const FLIGHTS = [
  { path: "a", dur: 28, delay: -3,  size: "text-2xl", style: 0 },
  { path: "b", dur: 34, delay: -12, size: "text-xl",  style: 1 },
  { path: "c", dur: 24, delay: -7,  size: "text-2xl", style: 0 },
  { path: "a", dur: 36, delay: -20, size: "text-xl",  style: 1, reverse: true },
  { path: "b", dur: 30, delay: -1,  size: "text-lg",  style: 0, reverse: true },
  { path: "c", dur: 40, delay: -26, size: "text-xl",  style: 1, reverse: true },
];

// Decorative overlay: put inside a `relative` container. Never intercepts clicks.
export function Butterflies() {
  const [tick, setTick] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
    const id = setInterval(() => setTick((t) => t + 1), 170);
    return () => clearInterval(id);
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden text-[#FF0084]">
      {FLIGHTS.map((f, i) => {
        const frames = STYLES[f.style];
        return (
          <span
            key={i}
            className={`butterfly butterfly-path-${f.path} ${f.size} ${i >= 3 ? "max-md:hidden" : ""}`}
            style={{
              ["--dur" as string]: `${f.dur}s`,
              ["--delay" as string]: `${f.delay}s`,
              animationDirection: f.reverse ? "reverse" : "normal",
            }}
          >
            <span className="butterfly-body">{frames[(tick + i) % frames.length]}</span>
          </span>
        );
      })}
    </div>
  );
}
