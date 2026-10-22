"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";

export function TimelineProgress({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.72", "end 0.78"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });

  return (
    <div className="timeline-progress" ref={containerRef}>
      <div aria-hidden="true" className="timeline-progress__track" />
      <motion.div
        aria-hidden="true"
        className="timeline-progress__fill"
        style={{
          scaleY: reducedMotion ? scrollYProgress : progress,
          transformOrigin: "top",
        }}
      />
      {children}
    </div>
  );
}
