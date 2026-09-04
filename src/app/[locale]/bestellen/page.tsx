import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BestellenForm } from "./BestellenForm";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kruimels } from "@/components/ui/Sectie";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";
import { sumupBeschikbaar } from "@/lib/betalen";
import { BEDRIJF } from "@/lib/bedrijf";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return paginaMetadata({
    locale,
    pad: "/bestellen",
    title: t("bestellenTitle"),
    description: t("bestellenDesc"),
  });
}

export default async function BestellenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bestel" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  // Of online betalen al kan, wordt op de server bepaald: de SumUp-sleutels
  // horen nooit in de browser terecht te komen.
  const sumupActief = sumupBeschikbaar();

  return (
    <>
      <JsonLd locale={locale} />
      <Schema
        data={kruimelSchema(locale, [
          { naam: BEDRIJF.naamKort, pad: "/" },
          { naam: nav("bestellen"), pad: "/bestellen" },
        ])}
      />

      <section style={{ backgroundColor: "var(--navy)" }} className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Kruimels
            donker
            items={[{ naam: BEDRIJF.naamKort, href: `/${locale}` }, { naam: nav("bestellen") }]}
          />
          <p className="kapitaal kapitaal-licht mb-3">{t("eyebrow")}</p>
          <h1 className="text-[2.1rem] md:text-[2.9rem] mb-4" style={{ color: "var(--cream)" }}>
            {t("kop")}
          </h1>
          <p
            className="text-[1.05rem] leading-relaxed max-w-2xl"
            style={{ color: "rgba(250,246,239,0.82)" }}
          >
            {t("inleiding")}
          </p>
        </div>
      </section>

      <Sectie grond="papier">
        <Suspense
          fallback={
            <p className="py-10 text-center" style={{ color: "var(--grijs)" }}>
              {t("bezig")}
            </p>
          }
        >
          <BestellenForm sumupActief={sumupActief} />
        </Suspense>
      </Sectie>
    </>
  );
}
