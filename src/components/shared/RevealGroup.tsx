import type { ReactNode } from "react";

/**
 * Voorheen wikkelde dit elk kind in een scroll-animatie. Dat is eruit: de
 * secties staan er nu gewoon. Het component blijft bestaan zodat pagina's die
 * het gebruiken ongewijzigd kunnen blijven.
 */
export function RevealGroup({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
