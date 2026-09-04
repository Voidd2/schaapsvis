import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Sectie } from "@/components/ui/Sectie";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";

/**
 * Waar de klant terechtkomt na het afrekenen bij SumUp.
 *
 * Deze pagina hoort niet in de zoekresultaten: hij zegt niets zonder
 * bestelnummer en zou als losse zoektreffer alleen maar verwarren.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bestel" });
  return paginaMetadata({
    locale,
    pad: "/bestellen/bedankt",
    title: `${t("bedanktKop")} — ${BEDRIJF.naam}`,
    description: t("bedanktZonder"),
    geenIndex: true,
  });
}

export default async function BedanktPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { locale } = await params;
  const { ref } = await searchParams;
  const t = await getTranslations({ locale, namespace: "bestel" });

  // Alleen ons eigen bestelnummerformaat tonen — wat er verder in de adresbalk
  // wordt geplakt komt niet op de pagina terecht.
  const nummer = ref && /^SV-\d{8}-[A-Z0-9]{4}$/.test(ref) ? ref : null;

  return (
    <Sectie grond="papier" smal>
      <div className="py-8 text-center">
        <h1 className="text-[2.1rem] md:text-[2.6rem] mb-4">{t("bedanktKop")}</h1>
        <p className="text-[1.05rem] leading-relaxed mb-8" style={{ color: "var(--charcoal)" }}>
          {nummer ? t("bedanktTekst", { nummer }) : t("bedanktZonder")}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href={`/${locale}`} className="knop knop-navy">
            {t("naarHome")}
          </Link>
          <a href={`tel:${BEDRIJF.telefoon.e164}`} className="knop knop-lijn">
            {BEDRIJF.telefoon.weergave}
          </a>
        </div>
      </div>
    </Sectie>
  );
}
