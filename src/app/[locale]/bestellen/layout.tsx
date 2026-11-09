"use client";

import type { ReactNode } from "react";
import { ShopHeader } from "@/components/layout/ShopHeader";
import { ShopFooter } from "@/components/layout/ShopFooter";
import { WinkelwagenProvider } from "@/components/winkel/Winkelwagen";
import { WinkelwagenPaneel } from "@/components/winkel/WinkelwagenPaneel";

export default function BestellenLayout({ children }: { children: ReactNode }) {
  return <WinkelwagenProvider>
    <ShopHeader />
    <main id="inhoud" className="flex-1">{children}</main>
    <ShopFooter />
    <WinkelwagenPaneel />
  </WinkelwagenProvider>;
}
