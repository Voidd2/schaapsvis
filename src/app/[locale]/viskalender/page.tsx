import Link from "next/link";
import Image from "next/image";
import { Schema } from "@/components/Schema";
import { Vragen } from "@/components/ui/Sectie";
import { kruimelSchema, vraagSchema } from "@/lib/seo";
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
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return eenTaalMetadata({
    taal: "nl",
    pad: "/viskalender",
    title: "Viskalender: welke vis is in het seizoen? | Schaap’s Vis",
    image: "/images/recepten/gebakken-schol-tomaat-olijven.webp",
    description:
      "Welke vis is in het seizoen? Bekijk onze viskalender per maand met foto’s, kooktips en recepten. Vraag Schaap’s Vis in Leiden naar de actuele aanvoer.",
  });
}

export default async function ViskalenderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const maandIndex = Number(new Intl.DateTimeFormat("nl-NL", { month: "numeric", timeZone: "Europe/Amsterdam" }).format(new Date())) - 1;
  const vragen = [
    { v: "Wanneer is het mosselseizoen?", a: "Zeeuwse bodemcultuurmosselen zijn doorgaans van juli tot april verkrijgbaar. De start en het einde kunnen per oogst verschillen. Hangcultuurmosselen kunnen eerder beschikbaar zijn. Vraag ons naar de actuele aanvoer." },
    { v: "Wanneer komt de Hollandse Nieuwe?", a: "Het nieuwe haringseizoen begint doorgaans in juni. De exacte verkoopstart wordt ieder jaar vastgesteld; vraag ons wanneer de nieuwe haring er is." },
    { v: "Is zalm alleen in een bepaald seizoen verkrijgbaar?", a: "Kweekzalm en gerookte zalm zijn doorgaans jaarrond verkrijgbaar. De viskalender helpt bij gerechten en seizoensaanvoer, maar is geen voorraadgarantie." },
    { v: "Kan ik de vis uit de kalender bestellen?", a: "Voor visproducten kunt u via WhatsApp vragen naar de beschikbaarheid en mogelijkheden. Alleen visschalen kunt u online samenstellen en bestellen." },
  ];

  return (
    <>
      <JsonLd />
      <Schema data={[vraagSchema(vragen), kruimelSchema("nl", [{ naam: BEDRIJF.naamKort, pad: "/" }, { naam: "Viskalender", pad: "/viskalender" }])]} />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: "Viskalender" },
        ]}
        label="Seizoensvis · Leiden"
        titel="De viskalender — wat is nu op zijn best?"
        intro="Welke vis past bij deze maand? Ontdek seizoensaanvoer, kookideeën en recepten. De kalender helpt u kiezen; wat vandaag verkrijgbaar is, hangt af van de vangst en levering."
        knoppen={[
          { label: bestelContact(locale).label, href: bestelContact(locale).href, extern: true },
          { label: "Het assortiment", href: `/${locale}/assortiment`, soort: "lijn" },
        ]}
        feiten={[
          { label: "Mosselen", waarde: "Doorgaans juli–april" },
          { label: "Hollandse Nieuwe", waarde: "Seizoensstart meestal in juni" },
          { label: "Aanvoer", waarde: "Vraag wat vandaag verkrijgbaar is" },
        ]}
      />

      <DezeMaand locale={locale} maandIndex={maandIndex} />

      <MaandStrip />

      <div className="section-wrap py-12 grid md:grid-cols-2 gap-7">
      {viskalenderData.map((maand, i) => (
        <article key={maand.naam} id={`maand-${i}`} className="scroll-mt-44 overflow-hidden rounded-2xl border border-sky-100 bg-white">
          <Image src={maand.foto.src} alt={maand.foto.alt} width={1200} height={800} sizes="(max-width: 768px) 100vw, 50vw" className="w-full aspect-[16/9] object-cover" />
          <div className="p-6 md:p-8">
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
        </article>
      ))}
      </div>
      <Sectie grond="zand" smal><h2 className="text-2xl mb-6">Vragen over seizoensvis</h2><Vragen vragen={vragen} /><p className="mt-6 text-sm">Seizoensbron: <a className="underline" href="https://www.mosselen.nl/nl/mosselinfo/seizoen/" target="_blank" rel="noopener noreferrer">Mosselen. Zo uit Zeeland</a>. Dit zijn algemene indicaties, geen garanties voor onze dagvoorraad.</p></Sectie>

      <PaginaSlot
        titel="Weten wanneer het binnen is?"
        tekst="Vraag ons via WhatsApp wat er vandaag verkrijgbaar is. We denken graag mee over de vis, porties en een passend recept."
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
