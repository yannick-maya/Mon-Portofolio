"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
