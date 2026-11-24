"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Welke jas de site aan heeft.
 *
 * schaapsvishandel.nl is de winkelsite: assortiment, waar we staan, ons verhaal,
 * de blog. Klikt iemand op Bestellen, dan hoort het te voelen als een webshop —
 * een smalle kop met de winkelwagen rechtsboven, geen menu dat je wegleidt, en
 * een korte voet. Ook de nieuwsbriefpagina heeft een eigen kop en voet.
 *
 * De kop en voet van de winkelsite komen als element binnen, zodat ze
 * servercomponenten kunnen blijven; alleen deze keuze gebeurt in de browser.
 */
export function Chrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const inWebshop = /^\/(nl|en|de)\/bestellen(\/|$)/.test(pathname);

  const newsletterLanding = /^\/(nl|en|de)\/nieuwsbrief\/?$/.test(pathname);
  if (inWebshop || newsletterLanding) return children;

  return (
    <>
      {header}
      <main id="inhoud" className="flex-1">{children}</main>
      {footer}
    </>
  );
}
