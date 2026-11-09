import type { ReactNode } from "react";
import { CatalogCart } from "./CatalogCart";

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return <>{children}<CatalogCart /></>;
}
