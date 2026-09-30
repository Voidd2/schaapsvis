"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useWinkelwagen } from "./Winkelwagen";
import { useSchaalTekst } from "@/components/visschaal/tekst";
import { regels as schaalRegelsVan, schaalById } from "@/lib/visschaal";
import { BEZORGING } from "@/lib/bezorging";
import { euro } from "@/lib/bedrijf";
import { platterQuantity } from "@/lib/platter-localization";

/**
 * Het winkelwagenpaneel.
 *
 * Schuift van rechts in beeld. Wat er staat hangt af van wat erin zit:
 *
 *  • Een visschaal heeft een hard bedrag. Dan kunnen we ook eerlijk zeggen
 *    hoeveel er nog bij moet voor gratis bezorging, en dat is precies het
 *    moment om dat te zeggen.
 *  • Verse vis gaat op gewicht. Daar staat geen bedrag bij, en dus ook geen
 *    balkje dat doet alsof we weten hoe ver iemand is. We zeggen wél vanaf welk
 *    bedrag de bezorging gratis is, zodat het geen verrassing wordt.
 */
export function WinkelwagenPaneel() {
  const { open, zetOpen, regels, samenstelling, aantal } =
    useWinkelwagen();
  const t = useTranslations("winkelwagen");
  const locale = useLocale();
  const tekst = useSchaalTekst();

  // Escape sluit het paneel, en zolang het open staat scrollt de pagina niet mee.
  useEffect(() => {
    if (!open) return;
    const bijToets = (e: KeyboardEvent) => {
      if (e.key === "Escape") zetOpen(false);
    };
    document.addEventListener("keydown", bijToets);
    const vorige = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", bijToets);
      document.body.style.overflow = vorige;
    };
  }, [open, zetOpen]);

  if (!open) return null;

  const schaal = samenstelling.schaal ? schaalById(samenstelling.schaal) : undefined;
  const schaalRegels = schaal ? schaalRegelsVan(samenstelling) : [];
  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label={t("sluiten")}
        onClick={() => zetOpen(false)}
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(13,21,56,0.5)" }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("kop")}
        className="absolute right-0 top-0 h-full w-full max-w-[26rem] flex flex-col"
        style={{ backgroundColor: "var(--cream)" }}
      >
        <header
          className="flex items-center justify-between gap-4 px-5 py-4"
          style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}
        >
          <h2 className="text-[1.25rem]" style={{ color: "var(--cream)" }}>
            {t("kop")}
          </h2>
          <button
            type="button"
            onClick={() => zetOpen(false)}
            className="text-[1.6rem] leading-none px-2"
            aria-label={t("sluiten")}
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {aantal === 0 ? (
            <p style={{ color: "var(--charcoal)" }}>{t("leeg")}</p>
          ) : (
            <>
              {schaal && (
                <section className="mb-8">
                  <p className="kapitaal mb-2">{t("kopSchaal")}</p>
                  <dl style={{ borderTop: "1px solid var(--linen)" }}>
                    {schaalRegels.map((r) => (
                      <div
                        key={r.id}
                        className="flex justify-between gap-3 py-2.5 text-[0.92rem]"
                        style={{ borderBottom: "1px solid var(--linen)" }}
                      >
                        <dt style={{ color: "var(--charcoal)" }}>
                          <span className="bedrag" style={{ color: "var(--grijs)" }}>
                            {platterQuantity(r, locale)}
                          </span>{" "}
                          {r.isSchaal ? r.naam : tekst.naam(r.id, r.naam)}
                        </dt>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-2 text-sm" style={{ color: "var(--grijs)" }}>{t("visschaalPrijsWhatsApp")}</p>
                  <Link
                    href={`/${locale}/visschalen#samenstellen`}
                    onClick={() => zetOpen(false)}
                    className="inline-block mt-2 text-sm font-semibold underline underline-offset-4"
                    style={{ color: "var(--navy)" }}
                  >
                    {t("schaalAanpassen")}
                  </Link>
                </section>
              )}

              {regels.length > 0 && (
                <section className="mb-8">
                  <p className="kapitaal mb-2">{t("kopVerseVis")}</p>
                  <ul style={{ borderTop: "1px solid var(--linen)" }}>
                    {regels.map((r) => (
                      <li
                        key={r.slug}
                        className="py-2.5 text-[0.92rem]"
                        style={{ borderBottom: "1px solid var(--linen)" }}
                      >
                        <span style={{ color: "var(--ink)", fontWeight: 600 }}>{r.naam}</span>
                        {r.hoeveelheid && (
                          <span style={{ color: "var(--grijs)" }}> · {r.hoeveelheid}</span>
                        )}
                        {!r.bezorgbaar && (
                          <span className="block kapitaal mt-0.5" style={{ color: "var(--rood)" }}>
                            {t("alleenAfhalen")}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--grijs)" }}>
                    {t("opGewicht")}
                  </p>
                </section>
              )}
            </>
          )}
        </div>

        {/* ── Gratis bezorgen ────────────────────────────────────────────── */}
        <div className="px-5 py-4" style={{ borderTop: "1px solid var(--linen)" }}>
          {regels.length > 0 ? (
            /* Verse vis gaat op gewicht: we weten het bedrag nog niet, dus geen
               balkje dat doet alsof. Wél zeggen wanneer de bezorging vervalt. */
            <p className="text-sm leading-relaxed" style={{ color: "var(--charcoal)" }}>
              {t("gratisWeegvis", { bedrag: euro(BEZORGING.gratisVanaf) })}
            </p>
          ) : (
            <p className="text-sm" style={{ color: "var(--charcoal)" }}>
              {t("gratisVanaf", {
                bedrag: euro(BEZORGING.gratisVanaf),
                kosten: euro(BEZORGING.standaardKosten),
              })}
            </p>
          )}
        </div>

        <div className="px-5 pb-5 pt-1 space-y-2">
          {aantal === 0 ? (
            <Link
              href={`/${locale}/assortiment`}
              onClick={() => zetOpen(false)}
              className="knop knop-rood w-full"
            >
              {t("naarAssortiment")}
            </Link>
          ) : (
            <Link
              href={`/${locale}/bestellen`}
              onClick={() => zetOpen(false)}
              className="knop knop-rood w-full"
            >
              {t("afrekenen")}
            </Link>
          )}
          <button
            type="button"
            onClick={() => zetOpen(false)}
            className="knop knop-lijn w-full !text-[0.85rem]"
          >
            {t("verderWinkelen")}
          </button>
        </div>
      </aside>
    </div>
  );
}
