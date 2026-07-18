"use client";

import { Children, isValidElement } from "react";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// Wikkelt elk direct kind (meestal een <section>) in een Reveal, zodat de
// secties één voor één zacht in beeld schuiven bij het scrollen — de
// viswijzer-bewegingstaal, met één wrapper per pagina i.p.v. per sectie.
export function RevealGroup({ children }: { children: ReactNode }) {
  return (
    <>
      {Children.map(children, (child, i) =>
        isValidElement(child) ? <Reveal key={i}>{child}</Reveal> : child
      )}
    </>
  );
}
