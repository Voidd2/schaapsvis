"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  BASISSCHAAL,
  EXTRAS,
  GROEP_LABELS,
  GROEP_UITLEG,
  GROEP_VOLGORDE,
  PRIJZEN_DEFINITIEF,
  STARTBEDRAG,
  berekenTotaal,
  keuzeRegels,
  type Extra,
  type Keuze,
} from "@/lib/visschaal";
import { euro, whatsappLink } from "@/lib/bedrijf";
import { useSchaalTekst } from "@/components/visschaal/tekst";

/** Zodat de bestelpagina de samengestelde schaal kan overnemen. */
export const SCHAAL_OPSLAG = "sv_visschaal_v1";

/**
 * De schaal samenstellen.
 *
 * Bij de meeste vishandels moet je een offerte aanvragen en dan afwachten. Dat
 * kost de klant een dag en jou een telefoontje. Hier ziet iemand direct wat zijn
 * schaal kost terwijl hij hem samenstelt — en wat er precies op ligt.
 */
export function VisschaalConfigurator() {
  const t = useTranslations("visschaal");
  const g = useTranslations("gedeeld");
  const locale = useLocale();
  const tekst = useSchaalTekst();

  const [keuze, setKeuze] = useState<Keuze>({});
  const [geladen, setGeladen] = useState(false);

  // Eerder samengestelde schaal terughalen, zodat iemand die even weg navigeert
  // niet opnieuw hoeft te beginnen.
  useEffect(() => {
    try {
      const opgeslagen = localStorage.getItem(SCHAAL_OPSLAG);
      if (opgeslagen) {
        const gelezen = JSON.parse(opgeslagen) as Keuze;
        const geldig: Keuze = {};
        for (const [id, aantal] of Object.entries(gelezen)) {
          if (EXTRAS.some((e) => e.id === id) && Number(aantal) > 0) {
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

  const totaal = useMemo(() => berekenTotaal(keuze), [keuze]);
  const regels = useMemo(() => keuzeRegels(keuze), [keuze]);

  function zet(id: string, aantal: number) {
    setKeuze((vorige) => {
      const volgende = { ...vorige };
      if (aantal <= 0) delete volgende[id];
      else volgende[id] = Math.min(aantal, 50);
      return volgende;
    });
  }

  const whatsappBericht = [
    "Hallo Schaap's Vishandel, ik wil graag een visschaal bestellen.",
    "",
    `Basisschaal: ${euro(STARTBEDRAG)}`,
    ...regels.map((r) => `${r.aantal}× ${r.naam} — ${euro(r.bedrag)}`),
    "",
    `Totaal: ${euro(totaal)}`,
  ].join("\n");

  return (
    <div className="grid lg:grid-cols-[1fr_20rem] gap-10 lg:gap-14 items-start">
      {/* ── Basis en toevoegingen ─────────────────────────────────────────── */}
      <div>
        <div
          className="p-6 md:p-7 mb-10"
          style={{ backgroundColor: "#fff", border: "1px solid var(--linen)" }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-1">
            <h2 className="text-[1.4rem]">{t("basisKop")}</h2>
            <span className="bedrag text-[1.3rem] font-semibold" style={{ color: "var(--navy)" }}>
              {euro(STARTBEDRAG)}
            </span>
          </div>
          <p className="text-sm mb-5" style={{ color: "var(--grijs)" }}>
            {t("basisVoor", { personen: tekst.personen(BASISSCHAAL.personen) })}
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-8">
            {BASISSCHAAL.bevat.map((item, i) => (
              <li
                key={item}
                className="py-2 text-[0.95rem]"
                style={{ borderTop: "1px solid var(--linen)", color: "var(--charcoal)" }}
              >
                {tekst.basisregel(i, item)}
              </li>
            ))}
          </ul>
        </div>

        <h2 className="text-[1.6rem] mb-2">{t("extrasKop")}</h2>
        <p className="mb-8 max-w-2xl" style={{ color: "var(--charcoal)" }}>
          {t("extrasTekst")}
        </p>

        {GROEP_VOLGORDE.map((groep) => {
          const items = EXTRAS.filter((e) => e.groep === groep);
          if (items.length === 0) return null;
          return (
            <section key={groep} className="mb-9">
              <h3
                className="text-[1.15rem] pb-2 mb-1"
                style={{ borderBottom: "2px solid var(--navy)" }}
              >
                {tekst.groep(groep, GROEP_LABELS[groep])}
              </h3>
              <p className="text-sm mb-3" style={{ color: "var(--grijs)" }}>
                {tekst.uitleg(groep, GROEP_UITLEG[groep])}
              </p>
              <ul>
                {items.map((extra) => (
                  <ExtraRegel
                    key={extra.id}
                    extra={extra}
                    aantal={keuze[extra.id] ?? 0}
                    onZet={(n) => zet(extra.id, n)}
                    naam={tekst.naam(extra.id, extra.naam)}
                    toelichting={tekst.toelichting(extra.id, extra.toelichting)}
                    seizoenLabel={(periode) => t("seizoen", { periode: tekst.seizoen(periode) ?? periode })}
                    perLabel={(eenheid) => t("perStuk", { eenheid: tekst.eenheid(eenheid) ?? eenheid })}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* ── Samenvatting ──────────────────────────────────────────────────── */}
      <aside className="lg:sticky lg:top-32">
        <div
          className="p-6"
          style={{ backgroundColor: "var(--navy)", color: "rgba(250,246,239,0.85)" }}
        >
          <h2 className="text-[1.25rem] mb-4" style={{ color: "var(--cream)" }}>
            {t("samenvattingKop")}
          </h2>

          <dl className="text-sm">
            <div
              className="flex justify-between gap-3 py-2"
              style={{ borderTop: "1px solid rgba(250,246,239,0.22)" }}
            >
              <dt>{t("basisschaal")}</dt>
              <dd className="bedrag shrink-0">{euro(STARTBEDRAG)}</dd>
            </div>

            {regels.length === 0 ? (
              <p className="py-3 text-[0.85rem]" style={{ opacity: 0.6 }}>
                {t("niksGekozen")}
              </p>
            ) : (
              regels.map((r) => (
                <div
                  key={r.naam}
                  className="flex justify-between gap-3 py-2"
                  style={{ borderTop: "1px solid rgba(250,246,239,0.22)" }}
                >
                  <dt>
                    {r.aantal > 1 && <span style={{ opacity: 0.7 }}>{r.aantal}× </span>}
                    {tekst.naam(r.id, r.naam)}
                  </dt>
                  <dd className="bedrag shrink-0">{euro(r.bedrag)}</dd>
                </div>
              ))
            )}

            <div
              className="flex justify-between gap-3 pt-3 mt-1 text-[1.15rem] font-semibold"
              style={{ borderTop: "2px solid rgba(250,246,239,0.5)", color: "var(--cream)" }}
            >
              <dt>{g("totaal")}</dt>
              <dd className="bedrag shrink-0">{euro(totaal)}</dd>
            </div>
          </dl>

          {!PRIJZEN_DEFINITIEF && (
            <p className="mt-4 text-[0.8rem] leading-relaxed" style={{ opacity: 0.65 }}>
              {t("voorlopig")}
            </p>
          )}

          <div className="mt-6 space-y-2">
            <Link
              href={`/${locale}/bestellen?type=visschaal`}
              className="knop knop-rood w-full"
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
      </aside>
    </div>
  );
}

function ExtraRegel({
  extra,
  naam,
  toelichting,
  aantal,
  onZet,
  seizoenLabel,
  perLabel,
}: {
  extra: Extra;
  naam: string;
  toelichting?: string;
  aantal: number;
  onZet: (aantal: number) => void;
  seizoenLabel: (periode: string) => string;
  perLabel: (eenheid: string) => string;
}) {
  const gekozen = aantal > 0;

  return (
    <li
      className="py-3.5 flex flex-wrap items-start justify-between gap-x-5 gap-y-2"
      style={{ borderBottom: "1px solid var(--linen)" }}
    >
      <div className="flex-1 min-w-[13rem]">
        <p className="font-semibold text-[1rem]" style={{ color: "var(--ink)" }}>
          {naam}
          {extra.seizoen && (
            <span className="ml-2 text-[0.72rem] font-normal" style={{ color: "var(--gold)" }}>
              {seizoenLabel(extra.seizoen)}
            </span>
          )}
        </p>
        {toelichting && (
          <p className="text-[0.87rem] leading-snug mt-0.5" style={{ color: "var(--grijs)" }}>
            {toelichting}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="bedrag text-[0.95rem] whitespace-nowrap" style={{ color: "var(--charcoal)" }}>
          {euro(extra.prijs)}
          {extra.meervoudig && extra.eenheid && (
            <span className="text-[0.78rem]" style={{ color: "var(--grijs)" }}>
              {" "}
              {perLabel(extra.eenheid)}
            </span>
          )}
        </span>

        {extra.meervoudig ? (
          <div className="flex items-stretch" style={{ border: "1px solid var(--linen)" }}>
            <button
              type="button"
              onClick={() => onZet(aantal - 1)}
              disabled={aantal === 0}
              className="w-9 h-9 text-lg leading-none disabled:opacity-30"
              style={{ color: "var(--navy)" }}
              aria-label={`− ${naam}`}
            >
              −
            </button>
            <span
              className="w-9 h-9 flex items-center justify-center bedrag text-sm font-semibold"
              style={{
                borderLeft: "1px solid var(--linen)",
                borderRight: "1px solid var(--linen)",
                backgroundColor: gekozen ? "var(--sand)" : "transparent",
              }}
              aria-live="polite"
            >
              {aantal}
            </span>
            <button
              type="button"
              onClick={() => onZet(aantal + 1)}
              className="w-9 h-9 text-lg leading-none"
              style={{ color: "var(--navy)" }}
              aria-label={`+ ${naam}`}
            >
              +
            </button>
          </div>
        ) : (
          <label
            className="flex items-center gap-2 cursor-pointer select-none px-3 h-9"
            style={{
              border: "1px solid",
              borderColor: gekozen ? "var(--navy)" : "var(--linen)",
              backgroundColor: gekozen ? "var(--navy)" : "transparent",
              color: gekozen ? "var(--cream)" : "var(--navy)",
            }}
          >
            <input
              type="checkbox"
              checked={gekozen}
              onChange={(e) => onZet(e.target.checked ? 1 : 0)}
              className="sr-only"
            />
            <span className="text-sm font-semibold" aria-hidden>{gekozen ? "−" : "+"}</span>
          </label>
        )}
      </div>
    </li>
  );
}
