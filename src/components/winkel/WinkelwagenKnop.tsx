"use client";

import { useTranslations } from "next-intl";
import { useWinkelwagen } from "./Winkelwagen";

/**
 * De knop rechtsboven in de webshop.
 *
 * Het getalletje is het aantal dingen in de wagen, niet een bedrag: zolang er
 * verse vis in zit is er geen bedrag dat klopt, en half kloppen is hier erger
 * dan niets zeggen.
 */
export function WinkelwagenKnop({ licht = false }: { licht?: boolean }) {
  const { aantal, zetOpen } = useWinkelwagen();
  const t = useTranslations("winkelwagen");

  return (
    <button
      type="button"
      onClick={() => zetOpen(true)}
      className="inline-flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold"
      style={
        licht
          ? { backgroundColor: "var(--cream)", color: "var(--navy)" }
          : { backgroundColor: "var(--rood)", color: "#fff" }
      }
      aria-label={t("openLabel", { aantal })}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6" />
        <circle cx="10" cy="20" r="1.2" />
        <circle cx="18" cy="20" r="1.2" />
      </svg>
      <span>{t("wagen")}</span>
      <span
        className="bedrag inline-flex items-center justify-center min-w-[1.4rem] h-[1.4rem] px-1 text-[0.75rem]"
        style={
          licht
            ? { backgroundColor: "var(--navy)", color: "var(--cream)" }
            : { backgroundColor: "rgba(255,255,255,0.22)", color: "#fff" }
        }
        aria-hidden
      >
        {aantal}
      </span>
    </button>
  );
}
