import type { ReactNode } from "react";
import { CatalogCart } from "./CatalogCart";
import { BedieningSlot } from "./BedieningSlot";

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return <>{children}<BedieningSlot><CatalogCart /></BedieningSlot></>;
}
