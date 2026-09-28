"use client";

import { useSyncExternalStore } from "react";
import { viskalenderData } from "@/lib/viskalender";

/**
 * De maandbalk boven de kalender.
 *
 * Alleen dit stukje hoeft in de browser te draaien: welke maand het nú is weet
 * de server niet (die staat in een ander tijdzone-vak dan de bezoeker). De
 * twaalf maandsecties zelf zijn gewoon HTML met ankers, zodat de pagina ook
 * werkt zonder JavaScript — en zodat Google alle twaalf maanden leest.
 *
 * Wat hier bewust niet meer gebeurt: automatisch doorscrollen, secties die
 * omhoog schuiven en een achtergrond die per seizoen van kleur verloopt. Dat
 * was mooi op een demo en onhandig voor iemand die snel wil weten of de haring
 * er al is.
 */
/** De maand is een gegeven van buiten React: de klok van de bezoeker. */
function huidigeMaand(): number {
  return Number(new Intl.DateTimeFormat("nl-NL", { month: "numeric", timeZone: "Europe/Amsterdam" }).format(new Date())) - 1;
}

/** Eén keer per uur nakijken is ruim genoeg voor een maandovergang. */
function abonneer(opnieuw: () => void) {
  const timer = setInterval(opnieuw, 3_600_000);
  return () => clearInterval(timer);
}

export function MaandStrip() {
  // Op de server weten we de maand van de bezoeker niet; dan markeren we niets.
  const nu = useSyncExternalStore(abonneer, huidigeMaand, () => null);

  return (
    <nav
      aria-label="Maanden"
      className="sticky z-40 overflow-x-auto"
      style={{
        top: "var(--kop-hoogte)",
        backgroundColor: "var(--navy)",
        borderBottom: "1px solid rgba(250,246,239,0.22)",
      }}
    >
      <ul className="flex min-w-max px-2">
        {viskalenderData.map((maand, i) => (
          <li key={maand.naam}>
            <a
              href={`#maand-${i}`}
              className="kapitaal block px-3.5 py-3"
              style={{
                color: i === nu ? "var(--navy)" : "rgba(250,246,239,0.65)",
                backgroundColor: i === nu ? "var(--lichtblauw)" : "transparent",
              }}
              aria-current={i === nu ? "true" : undefined}
            >
              {maand.afkorting}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
