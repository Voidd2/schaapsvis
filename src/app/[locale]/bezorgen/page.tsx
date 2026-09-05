import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { PostcodeCheck } from "@/components/bezorgen/PostcodeCheck";
import { paginaMetadata, kruimelSchema, vraagSchema } from "@/lib/seo";
import { BEDRIJF, euro, whatsappLink } from "@/lib/bedrijf";
import { BEZORGING, GEMEENTEN, kostenVoor, bezorgdagenTekst } from "@/lib/bezorging";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return paginaMetadata({
    locale,
    pad: "/bezorgen",
    title: t("bezorgenTitle"),
    description: t("bezorgenDesc"),
  });
}

export default async function BezorgenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bezorgen" });
  const g = await getTranslations({ locale, namespace: "gedeeld" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const h = await getTranslations({ locale, namespace: "home" });

  const vragen = t.raw("faq") as { v: string; a: string }[];
  const dagen = bezorgdagenTekst();

  return (
    <>
      <JsonLd locale={locale} />
      <Schema
        data={[
          vraagSchema(vragen),
          kruimelSchema(locale, [
            { naam: BEDRIJF.naamKort, pad: "/" },
            { naam: nav("bezorgen"), pad: "/bezorgen" },
          ]),
        ]}
      />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: nav("bezorgen") },
        ]}
        label={t("eyebrow")}
        titel={t("kop")}
        intro={t("inleiding")}
        uitgelijnd="boven"
        zijkant={
          <div
            className="p-6 md:p-7"
            style={{ backgroundColor: "var(--cream)", border: "1px solid var(--linen)" }}
          >
            <h2 className="text-[1.3rem] mb-1">{t("checkKop")}</h2>
            <p className="text-sm mb-4" style={{ color: "var(--grijs)" }}>
              {t("checkTekst")}
            </p>
            <PostcodeCheck />
          </div>
        }
      />

      {/* ── Wat wel en wat niet ───────────────────────────────────────────── */}
      <Sectie grond="papier">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16">
          <div>
            <Kop titel={t("watKop")} />
            <p className="lees" style={{ color: "var(--charcoal)" }}>
              {t("watTekst")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 self-center">
            {[
              {
                kop: h("bezorgWelKop"),
                kleur: "var(--seafoam)",
                regels: [h("bezorgWel1"), h("bezorgWel2")],
              },
              {
                kop: h("bezorgNietKop"),
                kleur: "var(--grijs)",
                regels: [h("bezorgNiet1"), h("bezorgNiet2")],
              },
            ].map(({ kop, kleur, regels }) => (
              <div key={kop}>
                <h3 className="kapitaal mb-3" style={{ color: kleur }}>
                  {kop}
                </h3>
                <ul className="text-[0.98rem]" style={{ color: "var(--charcoal)" }}>
                  {regels.map((regel) => (
                    <li
                      key={regel}
                      className="py-2.5 leading-snug"
                      style={{ borderTop: "1px solid var(--linen)" }}
                    >
                      {regel}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Sectie>

      {/* ── Zo gaat het ───────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <Kop titel={t("hoeKop")} />
        <ol className="grid md:grid-cols-3 gap-8 md:gap-12 mt-4">
          {[
            [t("stap1Kop"), t("stap1Tekst", { tijd: BEZORGING.uitersteBesteltijd })],
            [t("stap2Kop"), t("stap2Tekst")],
            [t("stap3Kop"), t("stap3Tekst")],
          ].map(([kop, tekst], i) => (
            <li key={kop} style={{ borderTop: "2px solid var(--navy)" }} className="pt-4">
              <span
                className="block text-[0.72rem] font-semibold tracking-[0.18em] mb-2"
                style={{ color: "var(--gold)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[1.15rem] mb-2">{kop}</h3>
              <p className="text-[0.95rem] leading-relaxed" style={{ color: "var(--charcoal)" }}>
                {tekst}
              </p>
            </li>
          ))}
        </ol>
      </Sectie>

      {/* ── Kosten en gebied ──────────────────────────────────────────────── */}
      <Sectie grond="papier">
        <Kop label={t("gebiedKop")} titel={t("kostenKop")} intro={t("gebiedTekst")} />

        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[t("kolomGemeente"), t("kolomKosten"), t("kolomRijtijd")].map((kolom) => (
                  <th
                    key={kolom}
                    className="kapitaal py-3 pr-6 whitespace-nowrap"
                    style={{ borderBottom: "2px solid var(--navy)" }}
                  >
                    {kolom}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GEMEENTEN.map((gem) => (
                <tr key={gem.slug} style={{ borderBottom: "1px solid var(--linen)" }}>
                  <td className="py-3.5 pr-6">
                    <Link
                      href={`/${locale}/bezorgen/${gem.slug}`}
                      className="font-semibold underline underline-offset-4"
                      style={{ color: "var(--navy)" }}
                    >
                      {gem.naam}
                    </Link>
                  </td>
                  <td className="py-3.5 pr-6 bedrag whitespace-nowrap">
                    {euro(kostenVoor(gem))}
                  </td>
                  <td className="py-3.5 pr-6 whitespace-nowrap" style={{ color: "var(--grijs)" }}>
                    {gem.rijtijd}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-6 space-y-1.5 text-[0.95rem]" style={{ color: "var(--charcoal)" }}>
          <li>{t("kostenTarief", { bedrag: euro(BEZORGING.standaardKosten) })}</li>
          <li>{t("gratisVanaf", { bedrag: euro(BEZORGING.gratisVanaf) })}</li>
          <li>{t("minimum", { bedrag: euro(BEZORGING.minimumBedrag) })}</li>
          <li>{t("dagen", { dagen })}</li>
          <li>{t("besteltijd", { tijd: BEZORGING.uitersteBesteltijd })}</li>
        </ul>
      </Sectie>

      {/* ── Betalen ───────────────────────────────────────────────────────── */}
      <Sectie grond="zand" smal>
        <Kop titel={t("betalenKop")} />
        <p className="lees" style={{ color: "var(--charcoal)" }}>
          {t("betalenTekst")}
        </p>
        <p
          className="mt-5 inline-block px-4 py-2 text-sm font-semibold"
          style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}
        >
          {t("betalenBinnenkort")}
        </p>
      </Sectie>

      {/* ── Vragen ────────────────────────────────────────────────────────── */}
      <Sectie grond="papier" smal>
        <Kop titel={t("faqKop")} />
        <Vragen vragen={vragen} />
      </Sectie>

      <PaginaSlot
        titel={t("ctaKop")}
        tekst={t("ctaTekst", { tijd: BEZORGING.uitersteBesteltijd })}
        knoppen={[
          { label: nav("bestellen"), href: `/${locale}/bestellen` },
          { label: nav("visschalen"), href: `/${locale}/visschalen`, soort: "lijn" },
          {
            label: g("whatsapp"),
            href: whatsappLink("Hallo Schaap's Vishandel, ik heb een vraag over bezorgen."),
            extern: true,
            soort: "lijn",
          },
        ]}
      />

    </>
  );
}

