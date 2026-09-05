"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ShopHeader } from "./ShopHeader";
import { ShopFooter } from "./ShopFooter";
import { WinkelwagenPaneel } from "@/components/winkel/WinkelwagenPaneel";

/**
 * Welke jas de site aan heeft.
 *
 * schaapsvishandel.nl is de winkelsite: assortiment, waar we staan, ons verhaal,
 * de blog. Klikt iemand op Bestellen, dan hoort het te voelen als een webshop —
 * een smalle kop met de winkelwagen rechtsboven, geen menu dat je wegleidt, en
 * een korte voet. Daarom staan hier twee jassen, en kiest het pad welke.
 *
 * De kop en voet van de winkelsite komen als element binnen, zodat ze
 * servercomponenten kunnen blijven; alleen deze keuze gebeurt in de browser.
 */
export function Chrome({
  header,
  footer,
  extras,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  /** Dingen die alleen op de winkelsite horen, zoals de WhatsApp-knop. */
  extras: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const inWebshop = /^\/(nl|en|de)\/bestellen(\/|$)/.test(pathname);

  if (inWebshop) {
    return (
      <>
        <ShopHeader />
        <main id="inhoud" className="flex-1">{children}</main>
        <ShopFooter />
        <WinkelwagenPaneel />
      </>
    );
  }

  return (
    <>
      {header}
      <main id="inhoud" className="flex-1">{children}</main>
      {footer}
      {extras}
      <WinkelwagenPaneel />
    </>
  );
}
