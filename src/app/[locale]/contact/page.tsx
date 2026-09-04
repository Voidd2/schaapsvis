import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kruimels } from "@/components/ui/Sectie";
import { ContactFormulier } from "./ContactFormulier";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";
import { BEDRIJF, whatsappLink } from "@/lib/bedrijf";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return paginaMetadata({
    locale,
    pad: "/contact",
    title: t("contactTitle"),
    description: t("contactDesc"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const g = await getTranslations({ locale, namespace: "gedeeld" });
  const p = await getTranslations({ locale, namespace: "plekken" });

  return (
    <>
      <JsonLd locale={locale} />
      <Schema
        data={kruimelSchema(locale, [
          { naam: BEDRIJF.naamKort, pad: "/" },
          { naam: nav("contact"), pad: "/contact" },
        ])}
      />

      <section style={{ backgroundColor: "var(--navy)" }} className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Kruimels
            donker
            items={[{ naam: BEDRIJF.naamKort, href: `/${locale}` }, { naam: nav("contact") }]}
          />
          <h1 className="text-[2.1rem] md:text-[2.9rem] mb-4" style={{ color: "var(--cream)" }}>
            {t("title")}
          </h1>
          <p
            className="text-[1.05rem] leading-relaxed max-w-2xl"
            style={{ color: "rgba(250,246,239,0.82)" }}
          >
            {t("sub")}
          </p>
        </div>
      </section>

      <Sectie grond="papier">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20">
          {/* ── Meteen contact ────────────────────────────────────────────── */}
          <div>
            <h2 className="text-[1.5rem] mb-6">{t("infoTitle")}</h2>

            <dl>
              <div className="py-4" style={{ borderTop: "1px solid var(--linen)" }}>
                <dt className="kapitaal mb-1">{t("telLabel")}</dt>
                <dd>
                  <a
                    href={`tel:${BEDRIJF.telefoon.e164}`}
                    className="text-[1.6rem]"
                    style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}
                  >
                    {BEDRIJF.telefoon.weergave}
                  </a>
                </dd>
              </div>

              <div className="py-4" style={{ borderTop: "1px solid var(--linen)" }}>
                <dt className="kapitaal mb-1">WhatsApp</dt>
                <dd>
                  <a
                    href={whatsappLink("Hallo Schaap's Vishandel, ik heb een vraag.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline underline-offset-4"
                    style={{ color: "var(--navy)" }}
                  >
                    {g("whatsapp")} &rarr;
                  </a>
                </dd>
              </div>

              <div className="py-4" style={{ borderTop: "1px solid var(--linen)" }}>
                <dt className="kapitaal mb-1">{t("adresLabel")}</dt>
                <dd>
                  <address className="not-italic leading-relaxed" style={{ color: "var(--charcoal)" }}>
                    {BEDRIJF.naam}
                    <br />
                    {BEDRIJF.adres.straat}
                    <br />
                    {BEDRIJF.adres.postcode} {BEDRIJF.adres.plaats}
                  </address>
                  <a
                    href={BEDRIJF.maps.route}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm font-semibold underline underline-offset-4"
                    style={{ color: "var(--navy)" }}
                  >
                    {g("route")} &rarr;
                  </a>
                </dd>
              </div>

              <div
                className="py-4"
                style={{ borderTop: "1px solid var(--linen)", borderBottom: "1px solid var(--linen)" }}
              >
                <dt className="kapitaal mb-2">{t("openLabel")}</dt>
                <dd className="text-[0.95rem]" style={{ color: "var(--charcoal)" }}>
                  {[
                    [p("diVr"), "09:00 – 18:00"],
                    [p("za"), "09:00 – 17:00"],
                    [p("zoMa"), p("gesloten")],
                  ].map(([dag, tijd]) => (
                    <span key={dag} className="flex flex-wrap gap-x-3 py-0.5">
                      <span style={{ minWidth: "11rem", fontWeight: 600, color: "var(--ink)" }}>
                        {dag}
                      </span>
                      <span className="bedrag">{tijd}</span>
                    </span>
                  ))}
                  <Link
                    href={`/${locale}/bezoek-ons`}
                    className="inline-block mt-3 text-sm font-semibold underline underline-offset-4"
                    style={{ color: "var(--navy)" }}
                  >
                    {nav("locaties")} &rarr;
                  </Link>
                </dd>
              </div>
            </dl>
          </div>

          {/* ── Bericht sturen ────────────────────────────────────────────── */}
          <div>
            <h2 className="text-[1.5rem] mb-6">{t("formTitle")}</h2>
            <ContactFormulier />
          </div>
        </div>
      </Sectie>
    </>
  );
}
