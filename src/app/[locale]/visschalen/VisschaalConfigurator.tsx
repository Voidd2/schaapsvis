"use client";

import { Fragment, useMemo } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  LEGE_SAMENSTELLING,
  PORTIES,
  SCHALEN,
  personen as berekenPersonen,
  regels as maakRegels,
  schaalById,
  type Schaal,
} from "@/lib/visschaal";
import { useWinkelwagen } from "@/components/winkel/Winkelwagen";
import { whatsappLink } from "@/lib/bedrijf";
import { useSchaalTekst } from "@/components/visschaal/tekst";
import { localizePlatter, platterQuantity } from "@/lib/platter-localization";
import { Beeld } from "@/components/ui/Beeld";
import { DIRKS_VISSCHALEN } from "@/lib/dirks-selectie";

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
  const locale = useLocale();
  const tekst = useSchaalTekst();

  // Eén gedeelde samenstelling: ook bij client-side navigatie ziet de
  // checkout direct de schaal en extra's die hier zijn gekozen.
  const { samenstelling: samen, zetSamenstelling: setSamen } = useWinkelwagen();

  const regels = useMemo(() => maakRegels(samen), [samen]);
  const personen = useMemo(() => berekenPersonen(samen), [samen]);

  const gekozenSchaal = samen.schaal ? schaalById(samen.schaal) : undefined;

  function kiesSchaal(schaal: Schaal) {
    setSamen((vorige) => ({
      ...vorige,
      schaal: vorige.schaal === schaal.id ? null : schaal.id,
      personen: vorige.schaal === schaal.id ? undefined : schaal.personenVan,
    }));
  }

  const whatsappBericht = gekozenSchaal ? [
    locale === "nl" ? "Hallo Schaap’s Vishandel, ik wil graag een visschaal aanvragen." : locale === "de" ? "Hallo Schaap’s Vishandel, ich möchte eine Fischplatte anfragen." : "Hello Schaap’s Vishandel, I would like to request a seafood platter.",
    "",
    ...regels.map((r) => `${tekst.naam(r.id,r.naam)} — ${platterQuantity(r,locale)}`),
    "",
    `${personen} ${locale === "en" ? "people" : locale === "de" ? "Personen" : "personen"}`,
    locale === "en" ? "Custom additions or premium fish may increase the price; please agree them with us on WhatsApp." : locale === "de" ? "Sonderwünsche oder Edelfisch können den Preis erhöhen; bitte stimmen Sie dies per WhatsApp mit uns ab." : "Extra’s of duurdere vissoorten kunnen de prijs verhogen; stem dit vooraf via WhatsApp met ons af.",
  ].join("\n") : locale === "de" ? "Hallo Schaap’s Vishandel, ich möchte eine Fischplatte anfragen. Können Sie mich zu Auswahl und Preis beraten?" : locale === "en" ? "Hello Schaap’s Vishandel, I would like to enquire about a seafood platter. Could you advise me on the selection and price?" : "Hallo Schaap’s Vishandel, ik wil graag een visschaal aanvragen. Kunt u mij adviseren over de samenstelling en prijs?";

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
            {SCHALEN.map((bron, index) => {
              const schaal = localizePlatter(bron,locale);
              const gekozen = samen.schaal === schaal.id;
              const groep = DIRKS_VISSCHALEN.find((item) => item.slug === bron.id)?.groep ?? "eigen";
              const vorigeGroep = DIRKS_VISSCHALEN.find((item) => item.slug === SCHALEN[index - 1]?.id)?.groep ?? "eigen";
              const koppen = {
                nl: { eigen: "Schaap’s klassiekers", borrelbox: "Borrelboxen", klassiek: "Klassieke visschotels", luxe: "Luxe visschotels", hapjes: "Vishapjesschotels" },
                en: { eigen: "Schaap’s classics", borrelbox: "Sharing boxes", klassiek: "Classic seafood platters", luxe: "Deluxe seafood platters", hapjes: "Seafood bites platters" },
                de: { eigen: "Schaap’s Klassiker", borrelbox: "Snackboxen", klassiek: "Klassische Fischplatten", luxe: "Deluxe-Fischplatten", hapjes: "Fischhäppchen-Platten" },
              };
              const taal = locale === "en" || locale === "de" ? locale : "nl";
              return (
                <Fragment key={schaal.id}>
                {(index === 0 || groep !== vorigeGroep) && <li className="col-span-full mt-4"><h3 className="text-[1.4rem]">{koppen[taal][groep as keyof typeof koppen.nl]}</h3></li>}
                <li>
                  <article
                    className="flex flex-col h-full"
                    style={{
                      backgroundColor: "#fff",
                      border: gekozen ? "2px solid var(--navy)" : "1px solid var(--linen)",
                    }}
                  >
                    <figure>
                      {schaal.foto ? (
                        <div className="relative aspect-square overflow-hidden bg-[#f2f8fb]">
                          <Image src={schaal.foto} alt={`${schaal.naam} — ${locale === "de" ? "Servierbeispiel" : locale === "en" ? "serving suggestion" : "serveervoorbeeld"}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                        </div>
                      ) : schaal.beeld ? <Beeld naam={schaal.beeld} verhouding="vierkant" streep="var(--navy)" /> : null}
                      <figcaption className="px-5 py-3 text-xs leading-relaxed" style={{ background: "var(--lichtblauw)", color: "var(--navy)" }}>
                        {t("fotoVoorbeeld")}
                      </figcaption>
                    </figure>

                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="text-[1.25rem] mb-1">{schaal.naam}</h4>
                      <p className="kapitaal mb-3" style={{ color: "var(--grijs)" }}>
                        {t("voorPersonen", {
                          van: schaal.personenVan,
                          tot: schaal.personenTot,
                        })}
                      </p>
                      <p className="leading-relaxed mb-4" style={{ color: "var(--charcoal)" }}>
                        {schaal.omschrijving}
                      </p>

                      {gekozen && <label className="block mb-4">
                        <span className="block text-sm mb-1">{t("aantalPersonen")}</span>
                        <select className="w-full border border-sky-200 rounded px-3 py-2" value={personen || schaal.personenVan} onChange={(e) => setSamen((prev) => ({ ...prev, personen: Number(e.target.value) }))}>
                          {Array.from({ length: schaal.personenTot - schaal.personenVan + 1 }, (_, i) => schaal.personenVan + i).map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </label>}

                      {schaal.bevat.length > 0 && <p className="kapitaal mb-2">{t("watErOpLigt")}</p>}
                      <ul className="mb-5 flex-1" style={schaal.bevat.length > 0 ? { borderTop: "1px solid var(--linen)" } : undefined}>
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
                </Fragment>
              );
            })}
          </ul>
        </section>

        {/* ── Maatwerk verloopt via WhatsApp ──────────────────────────────── */}
        <section>
          <p className="kapitaal mb-2">{t("stap2")}</p>
          <h2 className="text-[1.6rem] mb-2">{t("extrasKop")}</h2>
          <p className="mb-8 max-w-2xl" style={{ color: "var(--charcoal)" }}>
            {t("extrasUitleg")}
          </p>
          <a href={whatsappLink(whatsappBericht)} target="_blank" rel="noopener noreferrer" className="knop knop-navy">{t("viaWhatsapp")}</a>
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
                        {platterQuantity(r,locale)}
                      </span>{" "}
                      {tekst.naam(r.id, r.naam)}
                    </dt>
                  </div>
                ))}
              </dl>
            )}


            <p className="mt-3 text-[0.9rem] font-semibold" style={{ color: "var(--cream)" }}>{t("gemiddeldePrijs")}</p>

            <div className="mt-6 space-y-2">
              <a
                href={whatsappLink(whatsappBericht)}
                target="_blank"
                rel="noopener noreferrer"
                className="knop knop-rood w-full"
              >
                {t("naarBestellen")}
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
