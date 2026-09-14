"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { viskalenderData } from "@/lib/viskalender";

/**
 * Wat er déze maand ligt, bovenaan de kalender.
 *
 * Wie de viskalender opent wil één ding weten: is het nu het seizoen van wat ik
 * zoek? Die vraag beantwoorden we hier, vóór de twaalf maanden eronder. De maand
 * komt van de klok van de bezoeker — de server weet die niet, en gokken levert
 * in de eerste dagen van een maand precies het verkeerde antwoord op.
 *
 * En er staat eerlijk bij dat aanvoer nooit helemaal voorspelbaar is. Een
 * kalender die doet alsof de zee zich aan een schema houdt, klopt niet.
 */

function huidigeMaand(): number {
  return new Date().getMonth();
}

function abonneer(opnieuw: () => void) {
  const timer = setInterval(opnieuw, 3_600_000);
  return () => clearInterval(timer);
}

export function DezeMaand({ locale }: { locale: string }) {
  const nu = useSyncExternalStore(abonneer, huidigeMaand, () => null);

  // Op de server en tijdens hydratie weten we de maand niet. Dan tonen we niets
  // in plaats van januari — een verkeerde maand is erger dan geen maand.
  if (nu === null) return null;

  const maand = viskalenderData[nu];
  if (!maand) return null;

  return (
    <section style={{ backgroundColor: "var(--lichtblauw)" }} className="py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-14">
        <div>
          <p className="kapitaal mb-2" style={{ color: "var(--navy)" }}>
            Deze maand
          </p>
          <h2 className="text-[2rem] md:text-[2.6rem] leading-none mb-3">
            {maand.naam} bij Schaap&rsquo;s
          </h2>
          <p
            className="text-[1.15rem] mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}
          >
            {maand.hoogtepunt}
          </p>
          <p className="lees" style={{ color: "var(--charcoal)" }}>
            {maand.tekst}
          </p>
          <p className="lees mt-4 text-[0.95rem]" style={{ color: "var(--charcoal)" }}>
            Dit is wat er in {maand.naam.toLowerCase()} hoort te liggen. Wat er{" "}
            <em>vandaag</em> daadwerkelijk ligt, hangt af van wat de boten hebben
            gebracht — bel even of vraag het aan de toonbank.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href={`/${locale}/bestellen`} className="knop knop-rood">
              Verse vis bestellen
            </Link>
            <a href={`#maand-${nu}`} className="knop knop-lijn">
              Alles over {maand.naam.toLowerCase()}
            </a>
          </div>
        </div>

        <div>
          <p className="kapitaal mb-3" style={{ color: "var(--navy)" }}>
            Nu in het seizoen
          </p>
          <ul style={{ borderTop: "1px solid var(--navy)" }}>
            {maand.vis.map((vis) => (
              <li
                key={vis.naam}
                className="flex items-baseline justify-between gap-4 py-3"
                style={{ borderBottom: "1px solid rgba(47,62,143,0.25)" }}
              >
                <span style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                  {vis.naam}
                </span>
                {vis.keurmerk && (
                  <span className="kapitaal shrink-0" style={{ color: "var(--seafoam)" }}>
                    {vis.keurmerk}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
