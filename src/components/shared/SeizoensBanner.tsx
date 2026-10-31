import Link from "next/link";
import { aanbiedingVanDeWeek } from "@/lib/aanbieding";

// Server component. Een handmatige aanbieding kan in het Nederlands worden
// ingesteld; anders verwijst de balk algemeen naar het assortiment van vandaag.
export function SeizoensBanner({ locale }: { locale: string }) {
  const m = new Date().getMonth();
  const teksten = {
    nl: { titel: "Uit de winkel", tekst: "Vraag ons naar het assortiment van vandaag.", assortiment: "Bekijk het assortiment", feest: "Feestdagen 2026", feestTekst: "Schalen, gourmet, gerookte zalm en cadeaus voor december." },
    en: { titel: "From our fish shop", tekst: "Ask us what is available in the shop today.", assortiment: "Explore the range", feest: "Festive season 2026", feestTekst: "Platters, gourmet, smoked salmon and gifts for December." },
    de: { titel: "Aus unserem Fischgeschäft", tekst: "Fragen Sie uns, was heute im Geschäft erhältlich ist.", assortiment: "Sortiment ansehen", feest: "Festtage 2026", feestTekst: "Platten, Gourmet, Räucherlachs und Geschenke für Dezember." },
  }[locale as "nl" | "en" | "de"] ?? {
    titel: "Uit de winkel", tekst: "Vraag ons naar het assortiment van vandaag.", assortiment: "Bekijk het assortiment", feest: "Feestdagen 2026", feestTekst: "Schalen, gourmet, gerookte zalm en cadeaus voor december.",
  };
  const handmatigAanbod = locale === "nl" ? aanbiedingVanDeWeek : null;
  const titel = handmatigAanbod?.titel ?? teksten.titel;
  const tekst = handmatigAanbod?.tekst ?? teksten.tekst;
  const isFeestseizoen = m >= 9;
  const cta = isFeestseizoen
    ? { label: teksten.feest, href: `/${locale}/feestdagen` }
    : { label: teksten.assortiment, href: `/${locale}/assortiment` };
  const bannerTekst = isFeestseizoen ? teksten.feestTekst : tekst;

  return (
    <section className="seasonal-banner px-6 py-3.5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <p className="text-[11px] uppercase tracking-widest font-bold">
            {titel}
          </p>
          <p className="text-sm font-medium">
            {bannerTekst}
          </p>
        </div>
        <Link
          href={cta.href}
          className="flex-shrink-0 text-sm font-semibold px-5 py-2.5 text-white whitespace-nowrap transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--navy-dark)" }}
        >
          {cta.label} &rarr;
        </Link>
      </div>
    </section>
  );
}
