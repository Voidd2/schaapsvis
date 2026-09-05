"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  GROEP_LABELS,
  GROEP_UITLEG,
  GROEP_VOLGORDE,
  MARKT,
  MINIMUM_BEDRAG,
  ONDERDELEN,
  PORTIES,
  PRIJZEN_DEFINITIEF,
  hoeveelheidTekst,
  personenBorrel,
  prijsPerPersoon,
  regels as maakRegels,
  totaal as berekenTotaal,
  totaalGewicht,
  type Keuze,
  type Onderdeel,
} from "@/lib/visschaal";
import { euro, whatsappLink } from "@/lib/bedrijf";
import { useSchaalTekst } from "@/components/visschaal/tekst";

/** Zodat de bestelpagina de samengestelde schaal kan overnemen. */
export const SCHAAL_OPSLAG = "sv_visschaal_v2";

/** Gewicht gaat met 100 gram tegelijk; stuks met één. */
const STAP = 100;

/**
 * De schaal samenstellen, per 100 gram.
 *
 * Bij vrijwel elke concurrent koop je een pakket per persoon: je betaalt dus
 * ook voor de paling waar je niet van houdt. Hier kiest de klant zelf wat
 * erop komt en hoeveel, en ziet hij het bedrag meelopen — inclusief wat het
 * per persoon wordt, zodat het te vergelijken is met die pakketprijzen.
 */
export function VisschaalConfigurator() {
  const t = useTranslations("visschaal");
  const g = useTranslations("gedeeld");
  const locale = useLocale();
  const tekst = useSchaalTekst();

  const [keuze, setKeuze] = useState<Keuze>({});
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    try {
      const opgeslagen = localStorage.getItem(SCHAAL_OPSLAG);
      if (opgeslagen) {
        const gelezen = JSON.parse(opgeslagen) as Keuze;
        const geldig: Keuze = {};
        for (const [id, aantal] of Object.entries(gelezen)) {
          if (ONDERDELEN.some((o) => o.id === id) && Number(aantal) > 0) {
            geldig[id] = Number(aantal);
          }
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setKeuze(geldig);
      }
    } catch {
      /* opslag niet beschikbaar — dan begint iemand gewoon opnieuw */
    }
    setGeladen(true);
  }, []);

  useEffect(() => {
    if (!geladen) return;
    try {
      localStorage.setItem(SCHAAL_OPSLAG, JSON.stringify(keuze));
    } catch {
      /* niets aan te doen */
    }
  }, [keuze, geladen]);

  const regels = useMemo(() => maakRegels(keuze), [keuze]);
  const totaal = useMemo(() => berekenTotaal(keuze), [keuze]);
  const gewicht = useMemo(() => totaalGewicht(keuze), [keuze]);
  const personen = useMemo(() => personenBorrel(keuze), [keuze]);
  const perPersoon = useMemo(() => prijsPerPersoon(keuze), [keuze]);

  const teWeinig = totaal > 0 && totaal < MINIMUM_BEDRAG;

  function zet(onderdeel: Onderdeel, hoeveelheid: number) {
    const stap = onderdeel.perStuk ? 1 : STAP;
    const max = onderdeel.perStuk ? 20 : 5000;
    setKeuze((vorige) => {
      const volgende = { ...vorige };
      const nieuw = Math.max(0, Math.min(hoeveelheid, max));
      if (nieuw < stap) delete volgende[onderdeel.id];
      else volgende[onderdeel.id] = nieuw;
      return volgende;
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
      {/* ── Kiezen ────────────────────────────────────────────────────────── */}
      <div>
        {GROEP_VOLGORDE.map((groep) => {
          const items = ONDERDELEN.filter((o) => o.groep === groep);
          if (items.length === 0) return null;
          return (
            <section key={groep} className="mb-12">
              <div className="mb-5">
                <h3 className="text-[1.5rem] mb-1">
                  {tekst.groep(groep, GROEP_LABELS[groep])}
                </h3>
                <p className="text-[0.95rem]" style={{ color: "var(--grijs)" }}>
                  {tekst.uitleg(groep, GROEP_UITLEG[groep])}
                </p>
              </div>
              <ul style={{ borderTop: "1px solid var(--linen)" }}>
                {items.map((onderdeel) => (
                  <Regel
                    key={onderdeel.id}
                    onderdeel={onderdeel}
                    naam={tekst.naam(onderdeel.id, onderdeel.naam)}
                    toelichting={tekst.toelichting(onderdeel.id, onderdeel.toelichting)}
                    hoeveelheid={keuze[onderdeel.id] ?? 0}
                    onZet={(n) => zet(onderdeel, n)}
                    perLabel={t("per100")}
                    stukLabel={(eenheid) => t("perStuk", { eenheid })}
                    seizoenLabel={(periode) =>
                      t("seizoen", { periode: tekst.seizoen(periode) ?? periode })
                    }
                  />
                ))}
              </ul>
            </section>
          );
        })}
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
                      {tekst.naam(r.id, r.naam)}
                    </dt>
                    <dd className="bedrag shrink-0">{euro(r.bedrag)}</dd>
                  </div>
                ))}
              </dl>
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

            {gewicht > 0 && (
              <p className="mt-2 text-[0.85rem]" style={{ opacity: 0.7 }}>
                {t("gewichtRegel", {
                  gewicht:
                    gewicht >= 1000
                      ? `${(gewicht / 1000).toFixed(1).replace(".", ",")} kg`
                      : `${gewicht} g`,
                })}
                {personen >= 1 && ` · ${t("personenRegel", { personen })}`}
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

            {teWeinig && (
              <p className="mt-3 text-[0.82rem]" style={{ color: "#ffb4a8" }}>
                {t("minimum", { bedrag: euro(MINIMUM_BEDRAG) })}
              </p>
            )}

            {!PRIJZEN_DEFINITIEF && (
              <p className="mt-3 text-[0.78rem] leading-relaxed" style={{ opacity: 0.6 }}>
                {t("voorlopig")}
              </p>
            )}

            <div className="mt-6 space-y-2">
              <Link
                href={`/${locale}/bestellen?type=visschaal`}
                className="knop knop-rood w-full"
                aria-disabled={teWeinig || regels.length === 0}
              >
                {t("naarBestellen")}
              </Link>
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
                  onClick={() => setKeuze({})}
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
  perLabel,
  stukLabel,
  seizoenLabel,
}: {
  onderdeel: Onderdeel;
  naam: string;
  toelichting?: string;
  hoeveelheid: number;
  onZet: (hoeveelheid: number) => void;
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
        <p className="text-[1.05rem]" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
          {naam}
          {onderdeel.seizoen && (
            <span className="ml-2 text-[0.72rem]" style={{ color: "var(--gold)", fontFamily: "var(--font-body)" }}>
              {seizoenLabel(onderdeel.seizoen)}
            </span>
          )}
        </p>
        {toelichting && (
          <p className="text-[0.87rem] leading-snug mt-0.5 max-w-md" style={{ color: "var(--grijs)" }}>
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

        <div className="flex items-stretch" style={{ border: "1px solid var(--linen)" }}>
          <button
            type="button"
            onClick={() => onZet(hoeveelheid - stap)}
            disabled={!gekozen}
            className="w-9 h-10 text-lg leading-none disabled:opacity-25"
            style={{ color: "var(--navy)" }}
            aria-label={`Minder ${naam}`}
          >
            −
          </button>
          <span
            className="min-w-[4.2rem] h-10 flex items-center justify-center bedrag text-[0.88rem] font-semibold px-1"
            style={{
              borderLeft: "1px solid var(--linen)",
              borderRight: "1px solid var(--linen)",
              backgroundColor: gekozen ? "var(--sand)" : "transparent",
              color: gekozen ? "var(--ink)" : "var(--grijs)",
            }}
            aria-live="polite"
          >
            {gekozen ? weergave : "—"}
          </span>
          <button
            type="button"
            onClick={() => onZet(hoeveelheid + stap)}
            className="w-9 h-10 text-lg leading-none"
            style={{ color: "var(--navy)" }}
            aria-label={`Meer ${naam}`}
          >
            +
          </button>
        </div>
      </div>
    </li>
  );
}
