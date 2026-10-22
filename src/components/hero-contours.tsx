"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

const paths = [
  "M239 25c118 0 214 96 214 215S357 455 239 455 25 359 25 240 121 25 239 25Z",
  "M239 57c101 0 183 82 183 183s-82 183-183 183S56 341 56 240 138 57 239 57Z",
  "M240 91c82 0 149 67 149 149s-67 149-149 149-149-67-149-149S158 91 240 91Z",
  "M240 126c63 0 114 51 114 114s-51 114-114 114-114-51-114-114 51-114 114-114Z",
  "M240 162c43 0 78 35 78 78s-35 78-78 78-78-35-78-78 35-78 78-78Z",
];

export function HeroContours() {
  const reducedMotion = useReducedMotion();
  const artRef = useRef<SVGSVGElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [hasPointer, setHasPointer] = useState(false);

  function moveContours(clientX: number, clientY: number) {
    const bounds = artRef.current?.getBoundingClientRect();
    if (!bounds || reducedMotion) return;

    const x = ((clientX - bounds.left) / bounds.width - 0.5) * 16;
    const y = ((clientY - bounds.top) / bounds.height - 0.5) * 16;
    setPointer({ x, y });
    setHasPointer(true);
  }

  function releaseContours() {
    setHasPointer(false);
  }

  return (
    <svg
      ref={artRef}
      aria-hidden="true"
      className="landing__art"
      fill="none"
      onMouseLeave={releaseContours}
      onMouseMove={(event) => moveContours(event.clientX, event.clientY)}
      onTouchEnd={releaseContours}
      onTouchMove={(event) => {
        const touch = event.touches[0];
        if (touch) moveContours(touch.clientX, touch.clientY);
      }}
      viewBox="0 0 480 480"
    >
      {paths.map((path, index) => (
        <motion.path
          animate={{
            pathLength: 1,
            opacity: [0, 0.2 + index * 0.14],
            x: hasPointer ? pointer.x * (1 - index * 0.12) : 0,
            y: hasPointer ? pointer.y * (1 - index * 0.12) : 0,
          }}
          d={path}
          initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
          key={path}
          stroke="currentColor"
          strokeWidth="1"
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  pathLength: { duration: 1.2, delay: index * 0.12, ease: "easeOut" },
                  opacity: { duration: 0.4, delay: index * 0.12 },
                  x: { type: "spring", stiffness: 70, damping: 18 },
                  y: { type: "spring", stiffness: 70, damping: 18 },
                }
          }
        />
      ))}
      <motion.path
        animate={{ pathLength: 1 }}
        d="M240 240h174"
        initial={reducedMotion ? false : { pathLength: 0 }}
        stroke="currentColor"
        strokeDasharray="4 8"
        strokeOpacity=".55"
        transition={reducedMotion ? { duration: 0 } : { duration: 1.1, delay: 0.55 }}
      />
      <motion.circle
        animate={{ scale: 1 }}
        cx="240"
        cy="240"
        fill="var(--accent)"
        initial={reducedMotion ? false : { scale: 0 }}
        r="8"
        transition={reducedMotion ? { duration: 0 } : { type: "spring", delay: 0.75 }}
      />
      <motion.circle
        animate={{ scale: 1 }}
        cx="414"
        cy="240"
        fill="var(--signal)"
        initial={reducedMotion ? false : { scale: 0 }}
        r="5"
        transition={reducedMotion ? { duration: 0 } : { type: "spring", delay: 1 }}
      />
    </svg>
  );
}

export function AnimatedName({ name }: { name: string }) {
  const reducedMotion = useReducedMotion();
  const words = name.split(" ");
  let letterIndex = 0;

  return (
    <span aria-label={name} className="animated-name">
      {words.map((word, wordIndex) => (
        <span
          aria-hidden="true"
          className="animated-name__word"
          key={`${word}-${wordIndex}`}
        >
          {Array.from(word).map((letter) => {
            const index = letterIndex++;

            return (
              <motion.span
                className="animated-name__letter"
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 0.35, delay: index * 0.035, ease: "easeOut" }
                }
                key={`${letter}-${index}`}
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
