import Link from "next/link";
import { bestelContact } from "@/lib/bestel-contact";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Sectie } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { MaandStrip } from "./MaandStrip";
import { DezeMaand } from "./DezeMaand";
import { viskalenderData } from "@/lib/viskalender";
import { eenTaalMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";

export async function generateMetadata(): Promise<Metadata> {
  return eenTaalMetadata({
    taal: "nl",
    pad: "/viskalender",
    title: "Viskalender — welke vis is nu het lekkerst? | Schaap's Vis Leiden",
    description:
      "Maand voor maand welke vis in het seizoen is. Van Hollandse Nieuwe in juni tot Zeeuwse mosselen in september. De viskalender van Schaap's Vishandel in Leiden.",
  });
}

export default async function ViskalenderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <JsonLd />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: "Viskalender" },
        ]}
        label="Seizoensvis · Leiden"
        titel="De viskalender — wat is nu op zijn best?"
        intro="Vis heeft een seizoen, net als aardbeien. Hieronder staat maand voor maand wat er dan het mooist ligt, wat er dan juist niet is, en waar u het bij ons vindt."
        knoppen={[
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true },
          { label: "Het assortiment", href: `/${locale}/assortiment`, soort: "lijn" },
        ]}
        feiten={[
          { label: "Mosselen", waarde: "September tot februari" },
          { label: "Hollandse Nieuwe", waarde: "Vanaf half juni" },
          { label: "Oesters", waarde: "De maanden met een r" },
        ]}
      />

      <DezeMaand locale={locale} />

      <MaandStrip />

      {viskalenderData.map((maand, i) => (
        <Sectie key={maand.naam} grond={i % 2 === 0 ? "papier" : "zand"} id={`maand-${i}`}>
          <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-10 lg:gap-16">
            <div>
              <p className="kapitaal mb-3">{maand.seizoen}</p>
              <h2 className="text-[2rem] md:text-[2.6rem] leading-none mb-4">{maand.naam}</h2>
              <p
                className="text-[1.1rem] mb-5"
                style={{ fontFamily: "var(--font-display)", color: "var(--navy)" }}
              >
                {maand.hoogtepunt}
              </p>
              <p className="lees" style={{ color: "var(--charcoal)" }}>
                {maand.tekst}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
                {maand.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="font-semibold underline underline-offset-4"
                    style={{ color: "var(--navy)" }}
                  >
                    {link.label} &rarr;
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="kapitaal mb-3">Wat er dan is</p>
              <ul style={{ borderTop: "1px solid var(--linen)" }}>
                {maand.vis.map((vis) => (
                  <li
                    key={vis.naam}
                    className="flex items-baseline justify-between gap-4 py-3"
                    style={{ borderBottom: "1px solid var(--linen)" }}
                  >
                    <span style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                      {vis.naam}
                    </span>
                    {vis.keurmerk && (
                      <span className="kapitaal shrink-0" style={{ color: "var(--seafoam)" }}>
                        {vis.keurmerk}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Sectie>
      ))}

      <PaginaSlot
        titel="Weten wanneer het binnen is?"
        tekst="Bel of bestel vooruit, dan leggen we het apart zodra het er is. De Hollandse Nieuwe gaat elk jaar hard: wie vroeg vraagt, heeft hem op dag één."
        knoppen={[
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true },
          { label: "Visschaal samenstellen", href: `/${locale}/visschalen`, soort: "lijn" },
          {
            label: BEDRIJF.telefoon.weergave,
            href: `tel:${BEDRIJF.telefoon.e164}`,
            extern: true,
            soort: "lijn",
          },
        ]}
      />
    </>
  );
}
