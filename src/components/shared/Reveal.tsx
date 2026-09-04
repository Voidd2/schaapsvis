import type { ReactNode } from "react";

/**
 * Rustige omhulling voor een sectie.
 *
 * Vroeger schoof elke sectie met framer-motion omhoog zodra hij in beeld kwam.
 * Dat is inmiddels hét herkenningspunt van een sjabloonsite en het kostte een
 * clientbundel én een extra JavaScript-laag op elke pagina. Wat er nu gebeurt is
 * niets meer dan een korte vervaging bij het laden — puur CSS, geen JavaScript,
 * en uit bij "beperk beweging".
 *
 * De props `y` en `delay` blijven bestaan zodat bestaande pagina's onveranderd
 * blijven werken; `delay` wordt nog gebruikt, `y` bewust niet meer.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  y?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={className ? `sv-in ${className}` : "sv-in"}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
