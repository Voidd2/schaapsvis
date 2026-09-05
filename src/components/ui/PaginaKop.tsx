import Link from "next/link";
import type { ReactNode } from "react";
import { Kruimels } from "./Sectie";

/**
 * De kop van elke binnenpagina.
 *
 * Eén component, zodat elke pagina dezelfde aanloop heeft: kruimelpad,
 * kapitaaltjes-label, kop, inleiding, en rechts eventueel een paar harde
 * gegevens. Daarvoor had elke pagina zijn eigen hero — de een gecentreerd met
 * een watermerk, de ander links met een gouden balk — en dan voelt een site
 * als een verzameling losse pagina's in plaats van één zaak.
 */

export interface KopFeit {
  label: string;
  waarde: ReactNode;
}

export interface KopKnop {
  label: string;
  href: string;
  /** Buiten de site (telefoon, WhatsApp, kaart): dan een gewone <a>. */
  extern?: boolean;
  soort?: "rood" | "lijn";
}

export function PaginaKop({
  kruimels,
  label,
  titel,
  intro,
  knoppen,
  feiten,
  cijfer,
  zijkant,
  uitgelijnd = "onder",
}: {
  kruimels: { naam: string; href?: string }[];
  label?: string;
  titel: string;
  intro?: string;
  knoppen?: KopKnop[];
  /** Kleine feitenlijst rechts — adres, tijden, tarief. */
  feiten?: KopFeit[];
  /** Eén groot getal rechts, bijvoorbeeld een vanaf-prijs. */
  cijfer?: { label: string; waarde: string; onder?: string };
  /** Iets eigens rechts, zoals de postcodecheck op de bezorgpagina. */
  zijkant?: ReactNode;
  /** Een blok dat hoger is dan de tekst lijnt boven uit in plaats van onder. */
  uitgelijnd?: "onder" | "boven";
}) {
  const heeftZijkant = Boolean(feiten?.length || cijfer || zijkant);
  // Staat er al iets in de rechterkolom, dan gaan de feiten onder de tekst
  // staan in plaats van ernaast. Anders wordt de rechterkolom een stapeltje.
  const feitenOnder = Boolean(feiten?.length && (cijfer || zijkant));

  const feitenlijst = feiten?.length ? (
    <dl
      className={
        feitenOnder
          ? "mt-8 grid sm:grid-cols-3 gap-x-8 gap-y-5 max-w-xl"
          : "grid sm:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-5"
      }
    >
      {feiten.map((feit) => (
        <div
          key={feit.label}
          style={{ borderTop: "1px solid rgba(250,246,239,0.3)" }}
          className="pt-3"
        >
          <dt className="kapitaal kapitaal-licht mb-1">{feit.label}</dt>
          <dd style={{ color: "var(--cream)", fontWeight: 600 }}>{feit.waarde}</dd>
        </div>
      ))}
    </dl>
  ) : null;

  return (
    <section style={{ backgroundColor: "var(--navy)" }} className="pt-10 pb-14 md:pt-12 md:pb-18">
      <div className="max-w-6xl mx-auto px-4">
        <Kruimels donker items={kruimels} />

        <div
          className={
            heeftZijkant
              ? `grid lg:grid-cols-[1.3fr_0.7fr] gap-10 lg:gap-16 ${
                  uitgelijnd === "boven" ? "items-start" : "items-end"
                }`
              : ""
          }
        >
          <div>
            {label && <p className="kapitaal kapitaal-licht mb-4">{label}</p>}
            <h1
              className="text-[2.2rem] md:text-[3.2rem] leading-[1.07] mb-5"
              style={{ color: "var(--cream)" }}
            >
              {titel}
            </h1>
            {intro && (
              <p
                className="text-[1.05rem] leading-relaxed max-w-2xl"
                style={{ color: "rgba(250,246,239,0.82)" }}
              >
                {intro}
              </p>
            )}

            {knoppen && knoppen.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-8">
                {knoppen.map((knop) => {
                  const klasse = `knop ${knop.soort === "lijn" ? "knop-lijn-licht" : "knop-rood"}`;
                  return knop.extern ? (
                    <a
                      key={knop.href}
                      href={knop.href}
                      className={klasse}
                      {...(knop.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {knop.label}
                    </a>
                  ) : (
                    <Link key={knop.href} href={knop.href} className={klasse}>
                      {knop.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {feitenOnder && feitenlijst}
          </div>

          {zijkant}

          {cijfer && (
            <div style={{ borderTop: "2px solid var(--gold)" }} className="pt-5">
              <p className="kapitaal kapitaal-licht mb-2">{cijfer.label}</p>
              <p
                className="bedrag text-[2.8rem] leading-none"
                style={{ color: "var(--cream)", fontFamily: "var(--font-display)" }}
              >
                {cijfer.waarde}
              </p>
              {cijfer.onder && (
                <p className="text-[0.9rem] mt-2" style={{ color: "rgba(250,246,239,0.65)" }}>
                  {cijfer.onder}
                </p>
              )}
            </div>
          )}

          {!feitenOnder && feitenlijst}
        </div>
      </div>
    </section>
  );
}

/**
 * De afsluiting van een pagina.
 *
 * Elke pagina hoort uit te komen bij één van de drie dingen die we willen:
 * een visschaal samenstellen, verse vis bestellen, of langskomen. Daarom staat
 * dit blok onderaan élke pagina, in dezelfde vorm.
 */
export function PaginaSlot({
  titel,
  tekst,
  knoppen,
}: {
  titel: string;
  tekst?: string;
  knoppen: KopKnop[];
}) {
  return (
    <section style={{ backgroundColor: "var(--navy)" }} className="py-14 md:py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-[1.9rem] md:text-[2.3rem] mb-4" style={{ color: "var(--cream)" }}>
          {titel}
        </h2>
        {tekst && (
          <p className="mb-8 leading-relaxed" style={{ color: "rgba(250,246,239,0.8)" }}>
            {tekst}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          {knoppen.map((knop) => {
            const klasse = `knop ${knop.soort === "lijn" ? "knop-lijn-licht" : "knop-rood"}`;
            return knop.extern ? (
              <a
                key={knop.href}
                href={knop.href}
                className={klasse}
                {...(knop.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {knop.label}
              </a>
            ) : (
              <Link key={knop.href} href={knop.href} className={klasse}>
                {knop.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
