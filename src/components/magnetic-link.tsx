"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { HTMLMotionProps } from "framer-motion";

type MagneticLinkProps = Omit<
  HTMLMotionProps<"a">,
  "children" | "className"
> & {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "quiet";
  size?: "sm" | "md" | "lg";
};

export function MagneticLink({
  children,
  className,
  variant = "primary",
  size = "md",
  onPointerMove,
  onPointerLeave,
  ...props
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handlePointerMove(event: React.PointerEvent<HTMLAnchorElement>) {
    onPointerMove?.(event);
    if (reducedMotion || event.pointerType !== "mouse") return;

    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;

    setOffset({
      x: (event.clientX - bounds.left - bounds.width / 2) * 0.12,
      y: (event.clientY - bounds.top - bounds.height / 2) * 0.12,
    });
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLAnchorElement>) {
    onPointerLeave?.(event);
    setOffset({ x: 0, y: 0 });
  }

  return (
    <motion.a
      ref={ref}
      className={[
        "button",
        `button--${variant}`,
        size === "md" ? "" : `button--${size}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      animate={{ x: offset.x, y: offset.y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 18 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}
