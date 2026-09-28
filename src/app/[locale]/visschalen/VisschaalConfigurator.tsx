"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  GROEP_LABELS,
  GROEP_UITLEG,
  GROEP_VOLGORDE,
  LEGE_SAMENSTELLING,
  MARKT,
  ONDERDELEN,
  PORTIES,
  PRIJZEN_DEFINITIEF,
  SCHALEN,
  extrasGewicht,
  extrasTotaal,
  hoeveelheidTekst,
  personen as berekenPersonen,
  prijsPerPersoon,
  regels as maakRegels,
  schaalById,
  totaal as berekenTotaal,
  type Onderdeel,
  type Schaal,
} from "@/lib/visschaal";
import { useWinkelwagen } from "@/components/winkel/Winkelwagen";
import { euro, whatsappLink } from "@/lib/bedrijf";
import { useSchaalTekst } from "@/components/visschaal/tekst";
import { Beeld } from "@/components/ui/Beeld";

/** Gewicht gaat met 100 gram tegelijk; stuks met één. */
const STAP = 100;

/**
 * De visschaal samenstellen.
 *
 * Eerst kiest de klant een schaal — dat is de beslissing die telt, en daarom
 * staat die bovenaan met een foto en een bedrag. Pas daarna komt de vraag of er
 * nog iets bij moet. Andersom (eerst een lange lijst met vinkjes) haakt de helft
 * af voordat er iets in de schaal ligt.
 */
export function VisschaalConfigurator() {
  const t = useTranslations("visschaal");
  const g = useTranslations("gedeeld");
  const locale = useLocale();
  const tekst = useSchaalTekst();

  // Eén gedeelde samenstelling: ook bij client-side navigatie ziet de
  // checkout direct de schaal en extra's die hier zijn gekozen.
  const { samenstelling: samen, zetSamenstelling: setSamen } = useWinkelwagen();

  const regels = useMemo(() => maakRegels(samen), [samen]);
  const totaal = useMemo(() => berekenTotaal(samen), [samen]);
  const extras = useMemo(() => extrasTotaal(samen), [samen]);
  const gewicht = useMemo(() => extrasGewicht(samen), [samen]);
  const personen = useMemo(() => berekenPersonen(samen), [samen]);
  const perPersoon = useMemo(() => prijsPerPersoon(samen), [samen]);

  const gekozenSchaal = samen.schaal ? schaalById(samen.schaal) : undefined;

  function kiesSchaal(schaal: Schaal) {
    setSamen((vorige) => ({
      ...vorige,
      schaal: vorige.schaal === schaal.id ? null : schaal.id,
    }));
  }

  function zetExtra(onderdeel: Onderdeel, hoeveelheid: number) {
    const stap = onderdeel.perStuk ? 1 : STAP;
    const max = onderdeel.perStuk ? 20 : 5000;
    setSamen((vorige) => {
      const extras = { ...vorige.extras };
      const nieuw = Math.max(0, Math.min(hoeveelheid, max));
      if (nieuw < stap) delete extras[onderdeel.id];
      else extras[onderdeel.id] = nieuw;
      return { ...vorige, extras };
    });
  }

  const whatsappBericht = [
    "Hallo Schaap's Vishandel, ik wil graag een visschaal bestellen.",
    "",
    ...regels.map((r) => `${hoeveelheidTekst(r)} ${r.naam} — ${euro(r.bedrag)}`),
    "",
    `Totaal: ${euro(totaal)}`,
  ].join("\n");

  return (
    <div className="grid lg:grid-cols-[1fr_21rem] gap-12 lg:gap-16 items-start">
      <div>
        {/* ── Stap 1: de schaal ───────────────────────────────────────────── */}
        <section className="mb-14">
          <p className="kapitaal mb-2">{t("stap1")}</p>
          <h2 className="text-[1.6rem] mb-2">{t("schaalKop")}</h2>
          <p className="mb-7 max-w-2xl" style={{ color: "var(--charcoal)" }}>
            {t("schaalUitleg")}
          </p>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCHALEN.map((schaal) => {
              const gekozen = samen.schaal === schaal.id;
              return (
                <li key={schaal.id}>
                  <article
                    className="flex flex-col h-full"
                    style={{
                      backgroundColor: "#fff",
                      border: gekozen ? "2px solid var(--navy)" : "1px solid var(--linen)",
                    }}
                  >
                    <Beeld naam={schaal.beeld} verhouding="vierkant" streep="var(--navy)" />

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-[1.25rem] mb-1">{schaal.naam}</h3>
                      <p className="kapitaal mb-3" style={{ color: "var(--grijs)" }}>
                        {t("voorPersonen", {
                          van: schaal.personenVan,
                          tot: schaal.personenTot,
                        })}
                      </p>
                      <p
                        className="bedrag text-[1.9rem] leading-none mb-1"
                        style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}
                      >
                        {euro(schaal.prijs)}
                      </p>
                      <p className="text-sm mb-4" style={{ color: "var(--grijs)" }}>
                        {t("startbedrag")}
                      </p>

                      <p className="leading-relaxed mb-4" style={{ color: "var(--charcoal)" }}>
                        {schaal.omschrijving}
                      </p>

                      <p className="kapitaal mb-2">{t("watErOpLigt")}</p>
                      <ul className="mb-5 flex-1" style={{ borderTop: "1px solid var(--linen)" }}>
                        {schaal.bevat.map((wat) => (
                          <li
                            key={wat}
                            className="py-2 text-[0.9rem]"
                            style={{
                              borderBottom: "1px solid var(--linen)",
                              color: "var(--charcoal)",
                            }}
                          >
                            {wat}
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={() => kiesSchaal(schaal)}
                        className={`knop w-full ${gekozen ? "knop-lijn" : "knop-rood"}`}
                        aria-pressed={gekozen}
                      >
                        {gekozen ? t("gekozen") : t("kiesSchaal")}
                      </button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Stap 2: de extra's ──────────────────────────────────────────── */}
        <section>
          <p className="kapitaal mb-2">{t("stap2")}</p>
          <h2 className="text-[1.6rem] mb-2">{t("extrasKop")}</h2>
          <p className="mb-8 max-w-2xl" style={{ color: "var(--charcoal)" }}>
            {gekozenSchaal ? t("extrasUitleg") : t("extrasEerstSchaal")}
          </p>

          {/* Uitklapbaar per groep. Alle vijf de lijsten open onder elkaar werd
              op een telefoon een prijslijst van twee schermen lang — en dan
              scrolt iemand eroverheen in plaats van erdoorheen. Op de dichte kop
              staat hoeveel je uit die groep al hebt gekozen, zodat je niet hoeft
              open te klappen om te zien waar iets zit. */}
          <div style={{ opacity: gekozenSchaal ? 1 : 0.55 }}>
            {GROEP_VOLGORDE.map((groep) => {
              const items = ONDERDELEN.filter((o) => o.groep === groep);
              if (items.length === 0) return null;
              const gekozenInGroep = items.filter((o) => (samen.extras[o.id] ?? 0) > 0).length;
              return (
                <details
                  key={groep}
                  open={gekozenInGroep > 0}
                  className="group"
                  style={{ borderTop: "1px solid var(--linen)" }}
                >
                  <summary className="flex items-start justify-between gap-4 py-5 cursor-pointer">
                    <span>
                      <span className="block text-[1.25rem]" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                        {tekst.groep(groep, GROEP_LABELS[groep])}
                      </span>
                      <span className="block text-[0.92rem] mt-0.5" style={{ color: "var(--grijs)" }}>
                        {tekst.uitleg(groep, GROEP_UITLEG[groep])}
                      </span>
                    </span>
                    <span className="flex items-center gap-3 shrink-0 pt-1">
                      {gekozenInGroep > 0 && (
                        <span
                          className="kapitaal px-2 py-1"
                          style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}
                        >
                          {gekozenInGroep}
                        </span>
                      )}
                      <span
                        className="transition-transform group-open:rotate-45"
                        style={{ color: "var(--gold)", fontSize: "1.3rem", lineHeight: 1 }}
                        aria-hidden
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <ul className="pb-4" style={{ borderTop: "1px solid var(--linen)" }}>
                    {items.map((onderdeel) => (
                      <Regel
                        key={onderdeel.id}
                        onderdeel={onderdeel}
                        naam={tekst.naam(onderdeel.id, onderdeel.naam)}
                        toelichting={tekst.toelichting(onderdeel.id, onderdeel.toelichting)}
                        hoeveelheid={samen.extras[onderdeel.id] ?? 0}
                        onZet={(n) => zetExtra(onderdeel, n)}
                        uitgeschakeld={!gekozenSchaal}
                        perLabel={t("per100")}
                        stukLabel={(eenheid) => t("perStuk", { eenheid })}
                        seizoenLabel={(periode) =>
                          t("seizoen", { periode: tekst.seizoen(periode) ?? periode })
                        }
                      />
                    ))}
                  </ul>
                </details>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Uw schaal ─────────────────────────────────────────────────────── */}
      <aside className="lg:sticky lg:top-32">
        <div style={{ backgroundColor: "var(--navy)", color: "rgba(250,246,239,0.85)" }}>
          <div className="p-6">
            <h2 className="text-[1.3rem] mb-4" style={{ color: "var(--cream)" }}>
              {t("samenvattingKop")}
            </h2>

            {regels.length === 0 ? (
              <p className="text-[0.9rem] py-2" style={{ opacity: 0.6 }}>
                {t("niksGekozen")}
              </p>
            ) : (
              <dl className="text-sm">
                {regels.map((r) => (
                  <div
                    key={r.id}
                    className="flex justify-between gap-3 py-2"
                    style={{ borderTop: "1px solid rgba(250,246,239,0.22)" }}
                  >
                    <dt>
                      <span className="bedrag" style={{ opacity: 0.7 }}>
                        {hoeveelheidTekst(r)}
                      </span>{" "}
                      {r.isSchaal ? r.naam : tekst.naam(r.id, r.naam)}
                    </dt>
                    <dd className="bedrag shrink-0">{euro(r.bedrag)}</dd>
                  </div>
                ))}
              </dl>
            )}

            {extras > 0 && (
              <p className="mt-2 text-[0.85rem]" style={{ opacity: 0.7 }}>
                {t("extrasRegel", { bedrag: euro(extras) })}
              </p>
            )}

            <div
              className="flex justify-between gap-3 pt-3 mt-2 text-[1.3rem]"
              style={{
                borderTop: "2px solid rgba(250,246,239,0.5)",
                color: "var(--cream)",
                fontFamily: "var(--font-display)",
              }}
            >
              <span>{g("totaal")}</span>
              <span className="bedrag">{euro(totaal)}</span>
            </div>

            {personen > 0 && (
              <p className="mt-2 text-[0.85rem]" style={{ opacity: 0.7 }}>
                {t("personenRegel", { personen })}
                {gewicht > 0 &&
                  ` · ${t("gewichtRegel", {
                    gewicht:
                      gewicht >= 1000
                        ? `${(gewicht / 1000).toFixed(1).replace(".", ",")} kg`
                        : `${gewicht} g`,
                  })}`}
              </p>
            )}

            {/* Vergelijking met de goedkoopste pakketprijs die we in de regio
                vonden. Alleen tonen als we er echt onder zitten. */}
            {perPersoon !== null && perPersoon < MARKT.goedkoopstePerPersoon && (
              <p
                className="mt-3 p-3 text-[0.82rem] leading-relaxed"
                style={{ backgroundColor: "rgba(250,246,239,0.1)", color: "var(--cream)" }}
              >
                {t("vergelijking", {
                  bedrag: euro(perPersoon),
                  markt: euro(MARKT.goedkoopstePerPersoon),
                })}
              </p>
            )}

            {!PRIJZEN_DEFINITIEF && (
              <p className="mt-3 text-[0.78rem] leading-relaxed" style={{ opacity: 0.6 }}>
                {t("voorlopig")}
              </p>
            )}

            <div className="mt-6 space-y-2">
              {gekozenSchaal ? (
                <Link href={`/${locale}/bestellen?type=visschaal`} className="knop knop-rood w-full">
                  {t("naarBestellen")}
                </Link>
              ) : (
                <span className="knop knop-rood w-full" aria-disabled="true">
                  {t("naarBestellen")}
                </span>
              )}
              <a
                href={whatsappLink(whatsappBericht)}
                target="_blank"
                rel="noopener noreferrer"
                className="knop knop-lijn-licht w-full !text-[0.85rem]"
              >
                {t("viaWhatsapp")}
              </a>
              {regels.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSamen(LEGE_SAMENSTELLING)}
                  className="w-full text-[0.8rem] underline underline-offset-4 pt-1"
                  style={{ opacity: 0.6 }}
                >
                  {t("wissen")}
                </button>
              )}
            </div>
          </div>

          {/* Hulpje: hoeveel heb ik nodig? */}
          <div
            className="px-6 py-4 text-[0.82rem] leading-relaxed"
            style={{ borderTop: "1px solid rgba(250,246,239,0.22)", opacity: 0.75 }}
          >
            <p className="kapitaal kapitaal-licht mb-1.5">{t("hoeveelKop")}</p>
            <p>{t("hoeveelTekst", { borrel: PORTIES.borrel, maaltijd: PORTIES.maaltijd })}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Regel({
  onderdeel,
  naam,
  toelichting,
  hoeveelheid,
  onZet,
  uitgeschakeld,
  perLabel,
  stukLabel,
  seizoenLabel,
}: {
  onderdeel: Onderdeel;
  naam: string;
  toelichting?: string;
  hoeveelheid: number;
  onZet: (hoeveelheid: number) => void;
  uitgeschakeld: boolean;
  perLabel: string;
  stukLabel: (eenheid: string) => string;
  seizoenLabel: (periode: string) => string;
}) {
  const stap = onderdeel.perStuk ? 1 : STAP;
  const gekozen = hoeveelheid > 0;

  const weergave = onderdeel.perStuk
    ? String(hoeveelheid)
    : hoeveelheid >= 1000
      ? `${(hoeveelheid / 1000).toFixed(1).replace(".", ",")} kg`
      : `${hoeveelheid} g`;

  return (
    <li
      className="py-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-3"
      style={{
        borderBottom: "1px solid var(--linen)",
        backgroundColor: gekozen ? "rgba(22,34,90,0.04)" : undefined,
      }}
    >
      <div className="flex-1 min-w-[12rem]">
        <p
          className="text-[1.05rem]"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
        >
          {naam}
          {onderdeel.seizoen && (
            <span
              className="ml-2 text-[0.72rem]"
              style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}
            >
              {seizoenLabel(onderdeel.seizoen)}
            </span>
          )}
        </p>
        {toelichting && (
          <p
            className="text-[0.87rem] leading-snug mt-0.5 max-w-md"
            style={{ color: "var(--grijs)" }}
          >
            {toelichting}
          </p>
        )}
      </div>

      <div className="flex items-center gap-5 shrink-0">
        <span className="text-right leading-tight">
          <span className="bedrag block text-[1.05rem]" style={{ color: "var(--ink)" }}>
            {euro(onderdeel.prijs)}
          </span>
          <span className="block text-[0.72rem]" style={{ color: "var(--grijs)" }}>
            {onderdeel.perStuk ? stukLabel(onderdeel.perStuk) : perLabel}
          </span>
        </span>

        <span className="flex items-stretch" style={{ border: "1px solid var(--navy)" }}>
          <button
            type="button"
            onClick={() => onZet(hoeveelheid - stap)}
            disabled={uitgeschakeld || hoeveelheid === 0}
            className="px-3 py-1.5 text-[1.1rem] leading-none disabled:opacity-30"
            style={{ color: "var(--navy)" }}
            aria-label={`Minder ${naam}`}
          >
            −
          </button>
          <span
            className="bedrag px-3 py-1.5 min-w-[4.5rem] text-center text-[0.9rem]"
            style={{
              borderLeft: "1px solid var(--navy)",
              borderRight: "1px solid var(--navy)",
              color: gekozen ? "var(--navy)" : "var(--grijs)",
            }}
            aria-live="polite"
          >
            {gekozen ? weergave : "—"}
          </span>
          <button
            type="button"
            onClick={() => onZet(hoeveelheid + stap)}
            disabled={uitgeschakeld}
            className="px-3 py-1.5 text-[1.1rem] leading-none disabled:opacity-30"
            style={{ color: "var(--navy)" }}
            aria-label={`Meer ${naam}`}
          >
            +
          </button>
        </span>
      </div>
    </li>
  );
}
