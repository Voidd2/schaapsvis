"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Herbruikbare scroll-onthulling in dezelfde stijl als de viswijzer:
// content vervaagt en schuift zacht omhoog zodra hij in beeld komt.
// Respecteert "reduce motion" (dan gewoon direct zichtbaar, geen animatie).
export function Reveal({
  children,
  y = 40,
  delay = 0,
  className,
}: {
  children: ReactNode;
  y?: number;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return className ? <div className={className}>{children}</div> : <>{children}</>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
