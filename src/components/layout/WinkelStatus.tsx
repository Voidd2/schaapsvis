"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { getLocationStatus, type LocationStatus } from "@/lib/openingHours";

/**
 * "Open tot 18:00" of "morgen open vanaf 09:00" in de bovenbalk.
 *
 * De klok is een gegeven van buiten React, en de server weet niet hoe laat het
 * bij de bezoeker is. Daarom leest dit component de status uit als externe bron:
 * op de server komt er niets uit (dan zou er "gesloten" kunnen staan terwijl de
 * winkel open is), in de browser wordt hij elke minuut opnieuw bepaald.
 */

let laatste: LocationStatus | null = null;
let laatsteSleutel = "";

/** Zelfde uitkomst moet hetzelfde object opleveren, anders blijft React herhalen. */
function huidigeStatus(): LocationStatus {
  const status = getLocationStatus("winkel");
  const sleutel = `${status.isOpen}|${status.soort}|${status.tijd ?? ""}|${status.dag ?? ""}`;
  if (sleutel !== laatsteSleutel) {
    laatsteSleutel = sleutel;
    laatste = status;
  }
  return laatste as LocationStatus;
}

function abonneer(opnieuw: () => void) {
  const timer = setInterval(opnieuw, 60_000);
  return () => clearInterval(timer);
}

const DAGSLEUTELS = ["zo", "ma", "di", "wo", "do", "vr", "za"] as const;

export function WinkelStatus() {
  const t = useTranslations("status");
  const status = useSyncExternalStore(abonneer, huidigeStatus, () => null);

  if (!status) {
    // Op de server en tijdens hydratie: ruimte reserveren, niets beweren.
    return <span className="min-h-[1em]" aria-hidden />;
  }

  const zin =
    status.soort === "onbekend"
      ? t("onbekend")
      : t(status.soort, {
          tijd: status.tijd ?? "",
          dag: status.dag !== undefined ? t(DAGSLEUTELS[status.dag]) : "",
        });

  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          flexShrink: 0,
          backgroundColor: status.isOpen ? "#5cb98a" : "var(--gold)",
        }}
      />
      <span>
        <span className="hidden sm:inline">{t("winkel")}: </span>
        <strong style={{ color: "rgba(250,246,239,0.95)", fontWeight: 600 }}>{zin}</strong>
      </span>
    </span>
  );
}
