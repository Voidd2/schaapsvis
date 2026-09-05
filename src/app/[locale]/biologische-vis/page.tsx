import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Schema } from "@/components/Schema";
import { Sectie, Kop, Vragen } from "@/components/ui/Sectie";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { paginaMetadata, kruimelSchema, vraagSchema } from "@/lib/seo";
import { BEDRIJF, ADRES_REGEL } from "@/lib/bedrijf";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return paginaMetadata({
    locale,
    pad: "/biologische-vis",
    title: t("eerlijkeVisTitle"),
    description: t("eerlijkeVisDesc"),
  });
}

/**
 * Keurmerken, in de volgorde van de positionering: biologisch eerst.
 *
 * De ronde icoontjes die hier stonden zijn weg. Vier kaartjes met een tekening
 * erboven is precies de opmaak waaraan je een sjabloonsite herkent; een
 * kapitaaltjes-label boven de kop doet hetzelfde werk zonder die associatie.
 */
const KEURMERKEN = [
  { label: "BIO", titel: "cert3", uitleg: "cert3desc" },
  { label: "ASC", titel: "cert2", uitleg: "cert2desc" },
  { label: "MSC", titel: "cert1", uitleg: "cert1desc" },
  { label: "100%", titel: "cert4", uitleg: "cert4desc" },
] as const;

type DuurzaamheidStatus = "groen" | "oranje" | "rood";

interface FishCard {
  name: string;
  badge: string;
  badgeColor: string;
  opAanvraag: boolean;
  duurzaamheid: DuurzaamheidStatus;
  tagline: string;
  herkomst: string;
  vangenMethode: string;
  duurzaamheidNote: string;
  viswijzerLink: string | null;
  leverancier: string;
}

const ourFish: FishCard[] = [
  {
    name: "Hollandse Garnalen",
    badge: "MSC",
    badgeColor: "#1a6b8a",
    opAanvraag: true,
    duurzaamheid: "groen",
    tagline: "Crangon crangon · Waddenzee & Noordzee · dagvers · Zoutkamp",
    herkomst:
      "Dit zijn de échte Hollandse garnalen — klein, grijsbruin van kleur, en totaal anders dan de grote roze tropische garnalen die u in de supermarkt ziet. De wetenschappelijke naam is Crangon crangon. SOLT is een coöperatie van vijf garnalenvissers uit Zoutkamp. De boten van Zoutkamp (herkenbaar aan 'ZK') varen al vanaf 1620 op de Waddenzee en Noordzee. De garnalen worden direct aan boord in zeewater gekookt — daarna worden ze lichtroze van kleur — en vervolgens machinaal gepeld in Lauwersoog. Alles in Nederland, van vangst tot klaar product.",
    vangenMethode:
      "Gevangen met bokkennetten op de Waddenzee en Noordzee. SOLT gebruikt roller-chain systemen in plaats van traditionele wake chains, waardoor de zeebodem minder beschadigd wordt.",
    duurzaamheidNote: "MSC gecertificeerd — duurzaam gevangen. Beoordeeld als groene keuze.",
    viswijzerLink: "https://www.msc.org/nl/over-msc/wat-is-msc/wat-doet-MSC/populaire-vissoorten-in-nederland/noordzeegarnaal",
    leverancier: "SOLT · Zoutkamp · soltmen.com",
  },
  {
    name: "Fine de Claire III Oesters",
    badge: "IGP",
    badgeColor: "#8b5e14",
    opAanvraag: false,
    duurzaamheid: "groen",
    tagline: "Crassostrea gigas · 60–90 g · Marennes-Oléron, Atlantische kust van Frankrijk",
    herkomst:
      "Fine de Claire oesters komen uit Marennes-Oléron — het oudste en grootste oestergebied van Europa, aan de Atlantische kust van Frankrijk (tussen La Rochelle en Bordeaux). De naam 'claire' verwijst naar de ondiepe kleirijke vijvers (vroeger zoutvijvers) waar de oesters de laatste fase van hun groei doorbrengen. Minimaal 28 dagen, met maximaal 20 oesters per vierkante meter. Die rust en ruimte geven ze een milde, licht nootachtige smaak. De 'III' staat voor de maat: 60–90 gram per oester. Rauw eten met een druppel citroensap — niet te veel kauwen.",
    vangenMethode:
      "Geteeld in vijvers (claires) langs de Atlantische kust. Kweekvis, geen wilde vangst. IGP-beschermd: de naam 'Fine de Claire' is wettelijk beschermd — net zoals champagne of Goudse kaas. Alleen oesters uit dit specifieke gebied mogen deze naam dragen.",
    duurzaamheidNote: "Kweekvis met IGP bescherming — gecontroleerde teelt, geen wilde vangst, lage milieudruk.",
    viswijzerLink: null,
    leverancier: "NL 6075 EQ · Marennes-Oléron, Frankrijk",
  },
  {
    name: "Gestoomde Makreel",
    badge: "Eerlijk",
    badgeColor: "var(--gold)",
    opAanvraag: false,
    duurzaamheid: "rood",
    tagline: "Scomber scombrus · Noordzee & Noorse Zee · makreel · zout · rook",
    herkomst:
      "Makreel (Scomber scombrus) is gevangen in de Noordzee en de Noorse Zee. In vaktaal heet dit 'FAO-zone 27' — dat is gewoon de naam die wetenschappers gebruiken voor dit deel van de Atlantische Oceaan: de wateren van Noorwegen, IJsland, Groot-Brittannië en Nederland. Onze gestoomde makreel bevat maar drie ingrediënten: makreel, zout en rook. Geen conserveermiddelen, geen toevoegingen. De vis is boordevol omega-3 vetzuren en een van de meest voedingsrijke vissoorten die er bestaat. Stevige, volle smaak — heerlijk op brood of in een salade.",
    vangenMethode:
      "Makreel wordt gevangen met ringzegens of pelagische trawls. Makreel die met de handlijn gevangen wordt, is nog wel groen — maar dat is schaars en artisanaal. Onze gestoomde makreel is commercieel gevangen.",
    duurzaamheidNote:
      "Let op: makreel staat momenteel rood op de VISwijzer (april 2025). De oorzaak: de EU, Noorwegen, Groot-Brittannië, IJsland en Rusland kunnen het niet eens worden over visvangstquota. Er is geen breed verkrijgbaar duurzaam alternatief op commerciële schaal — wij zijn hierover eerlijk.",
    viswijzerLink: "https://www.goodfish.nl/nl/makreel-overbevist-en-vanaf-vandaag-in-het-rood-op-de-viswijzer/",
    leverancier: "FAO-zone 27 · Noordoost Atlantische Oceaan",
  },
  {
    name: "Tonijn AA Chunk",
    badge: "AA",
    badgeColor: "#1a6b8a",
    opAanvraag: false,
    duurzaamheid: "oranje",
    tagline: "Yellowfin tonijn (Thunnus albacares) · Sri Lanka · dikke stukken",
    herkomst:
      "Yellowfin tonijn (Thunnus albacares) uit Sri Lanka — een van de beste tonijnregio's ter wereld. 'AA Chunk' betekent: de allerbeste kwaliteitsklasse, dikke stevige stukken (geen flinters). Sri Lanka heeft een lange traditie in het handmatig vangen van tonijn in de Indische Oceaan. Geïmporteerd via W.G. Den Heijer & Zn in Scheveningen — een familiebedrijf dat al sinds 1946 vis importeert vanuit de Scheveningse vissershaven (Vissershavenweg 50).",
    vangenMethode:
      "Gevangen in de Indische Oceaan door Sri Lankaanse vissers. W.G. Den Heijer is een van de oudste en meest gerespecteerde visgrossiers van Nederland.",
    duurzaamheidNote:
      "Geen MSC-certificaat. Yellowfin tonijn uit de Indische Oceaan staat oranje op de VISwijzer — de populatie staat onder druk, maar niet kritiek. Wij bieden dit als premium product aan en zijn transparant over de status.",
    viswijzerLink: null,
    leverancier: "John Searson & Co Ltd · Sri Lanka via W.G. Den Heijer & Zn, Scheveningen",
  },
  {
    name: "Gerookte Zalm Snippers",
    badge: "ASC",
    badgeColor: "#2e6b5e",
    opAanvraag: false,
    duurzaamheid: "groen",
    tagline: "Atlantische zalm · Noorwegen · gerookt in Urk · 1 kg",
    herkomst:
      "Zalm snippers zijn de royale randstukken die overblijven bij het fileteren van grote zalmen. Niets gaat verloren — en deze stukken zijn vol van smaak, ideaal op de borrelplank, door pasta, scrambled eggs of op toast. Van het merk 'High Seas' — het huismerk van W.G. Den Heijer & Zn in Scheveningen. De zalm is Atlantische kweekzalm van Noorse familiebedrijven, gerookt in Urk. Per kilo verkrijgbaar.",
    vangenMethode:
      "Atlantische kweekzalm (Salmo salar) van Noorse kwekerijen. Gerookt in Urk, het vissersdorp aan het IJsselmeer. ASC gecertificeerd — vergelijkbaar met onze Varlaks zalm maar in een andere kwaliteitsklasse.",
    duurzaamheidNote: "ASC gecertificeerd — verantwoorde kweekvis. Beoordeeld als groene keuze.",
    viswijzerLink: null,
    leverancier: "High Seas · W.G. Den Heijer & Zn, Scheveningen · gerookt in Urk",
  },
];

/** Kleur en woord bij de VISwijzer-status. Rood blijft rood — niet verzachten. */
const STATUS: Record<DuurzaamheidStatus, { label: string; kleur: string }> = {
  groen: { label: "Duurzaam", kleur: "var(--seafoam)" },
  oranje: { label: "Let op", kleur: "var(--gold)" },
  rood: { label: "Overbevist", kleur: "var(--rood)" },
};

const faqByLocale: Record<string, { v: string; a: string }[]> = {
  nl: [
    {
      v: "Wat is biologische vis precies?",
      a: "Biologische vis komt altijd uit gecertificeerde kweek (aquacultuur) — voor het EU-biologisch keurmerk, in Nederland gecontroleerd door Skal, gelden strenge eisen: biologisch voer, lage bezettingsdichtheid, geen preventieve antibiotica, geen synthetische kleurstoffen en aantoonbaar dierenwelzijn. Onze Varlaks zalm voldoet hieraan en is daarnaast ASC-gecertificeerd.",
    },
    {
      v: "Kan wilde vis biologisch zijn?",
      a: "Nee. Het biologische keurmerk gaat over de manier van kweken — voer, leefomgeving en dierenwelzijn. Wilde vis leeft in zee en eet wat hij tegenkomt; daar bestaat geen biologische norm voor. Wilde vis kán wel duurzaam zijn: let dan op het MSC-keurmerk en de VISwijzer. Kortom: biologisch = verantwoorde kweek, MSC = duurzame wildvangst.",
    },
    {
      v: "Is biologische zalm gezonder dan gewone kweekzalm?",
      a: "Biologische zalm bevat, net als andere vette vis, veel omega-3 vetzuren. Het grote verschil zit in wat er níet in zit: geen preventieve antibiotica, geen synthetische astaxanthine en geen GMO-voer. Bij onze Varlaks komt de roze kleur van natuurlijke astaxanthine (Panaferd-AX). Het is daarmee schoner en transparanter geproduceerd dan gangbare kweekzalm.",
    },
    {
      v: "Waar koop ik biologische vis in Leiden?",
      a: "Bij Schaap's Vishandel, Herenstraat 48 in Leiden — dé plek voor biologische vis en biologische Varlaks zalm in Leiden. Ook op de markt (woensdag bij Dille & Camille, zaterdag op de Aalmarkt voor de Waag) en vrijdag bij Hoogvliet in Voorschoten. Bel 071 514 9802 of bestel vooruit.",
    },
  ],
  en: [
    {
      v: "What exactly is organic fish?",
      a: "Organic fish always comes from certified farming (aquaculture). The EU organic label — controlled in the Netherlands by Skal — sets strict requirements: organic feed, low stocking density, no preventive antibiotics, no synthetic colourings and demonstrable animal welfare. Our Varlaks salmon meets these standards and is also ASC-certified.",
    },
    {
      v: "Can wild fish be organic?",
      a: "No. The organic label is about how fish is farmed — feed, environment and animal welfare. Wild fish live in the sea and eat what they find; there is no organic standard for that. Wild fish can be sustainable, though: look for the MSC label and the Dutch VISwijzer guide. In short: organic = responsible farming, MSC = sustainable wild catch.",
    },
    {
      v: "Is organic salmon healthier than regular farmed salmon?",
      a: "Like other oily fish, organic salmon is rich in omega-3. The big difference is what it does not contain: no preventive antibiotics, no synthetic astaxanthine and no GMO feed. In our Varlaks the pink colour comes from natural astaxanthine (Panaferd-AX). It is cleaner and more transparently produced than conventional farmed salmon.",
    },
    {
      v: "Where can I buy organic fish in Leiden?",
      a: "At Schaap's Vishandel, Herenstraat 48 in Leiden — the place for organic fish and organic Varlaks salmon in Leiden. Also at the market (Wednesday at Dille & Camille, Saturday at the Aalmarkt in front of the Waag) and Friday at Hoogvliet in Voorschoten. Call +31 71 514 9802 or pre-order.",
    },
  ],
  de: [
    {
      v: "Was ist Bio-Fisch genau?",
      a: "Bio-Fisch stammt immer aus zertifizierter Zucht (Aquakultur). Für das EU-Bio-Siegel — in den Niederlanden von Skal kontrolliert — gelten strenge Anforderungen: Bio-Futter, geringe Besatzdichte, keine vorbeugenden Antibiotika, keine synthetischen Farbstoffe und nachweisbares Tierwohl. Unser Varlaks-Lachs erfüllt dies und ist zudem ASC-zertifiziert.",
    },
    {
      v: "Kann Wildfisch biologisch sein?",
      a: "Nein. Das Bio-Siegel betrifft die Art der Zucht — Futter, Lebensraum und Tierwohl. Wildfisch lebt im Meer und frisst, was er findet; dafür gibt es keine Bio-Norm. Wildfisch kann aber nachhaltig sein: achten Sie auf das MSC-Siegel und den VISwijzer. Kurz gesagt: Bio = verantwortungsvolle Zucht, MSC = nachhaltiger Wildfang.",
    },
    {
      v: "Ist Bio-Lachs gesünder als normaler Zuchtlachs?",
      a: "Wie anderer fetter Fisch ist Bio-Lachs reich an Omega-3. Der große Unterschied liegt darin, was nicht enthalten ist: keine vorbeugenden Antibiotika, kein synthetisches Astaxanthin und kein GMO-Futter. Bei unserem Varlaks stammt die rosa Farbe von natürlichem Astaxanthin (Panaferd-AX). Er ist sauberer und transparenter produziert als herkömmlicher Zuchtlachs.",
    },
    {
      v: "Wo kann ich in Leiden Bio-Fisch kaufen?",
      a: "Bei Schaap's Vishandel, Herenstraat 48 in Leiden — die Adresse für Bio-Fisch und Bio-Lachs Varlaks in Leiden. Auch auf dem Markt (mittwochs bei Dille & Camille, samstags am Aalmarkt vor der Waag) und freitags bei Hoogvliet in Voorschoten. Rufen Sie +31 71 514 9802 an oder bestellen Sie vor.",
    },
  ],
};

const INTRO: Record<string, string> = {
  nl: "Schaap's Vishandel is hét adres voor biologische vis in Leiden. Onze biologische Varlaks zalm is ASC- én EU-biologisch gecertificeerd. Daarnaast werken we met MSC-gecertificeerde wildvangst en verantwoorde kweek. Hieronder leggen we eerlijk uit wat de keurmerken betekenen — en tonen we per product de herkomst en de VISwijzer-status, ook als die niet perfect is.",
  en: "Schaap's Vishandel is the address for organic fish in Leiden. Our organic Varlaks salmon is both ASC- and EU-organic certified. We also work with MSC-certified wild catch and responsible farming. Below we explain honestly what the labels mean — and for every product we show the origin and the VISwijzer status, even when it is not perfect.",
  de: "Schaap's Vishandel ist die Adresse für Bio-Fisch in Leiden. Unser Bio-Lachs Varlaks ist sowohl ASC- als auch EU-Bio-zertifiziert. Außerdem arbeiten wir mit MSC-zertifiziertem Wildfang und verantwortungsvoller Zucht. Nachfolgend erklären wir ehrlich, was die Siegel bedeuten — und zeigen für jedes Produkt die Herkunft und den VISwijzer-Status, auch wenn er nicht perfekt ist.",
};

const FAQ_KOP: Record<string, string> = {
  nl: "Veelgestelde vragen over biologische vis",
  en: "Frequently asked questions about organic fish",
  de: "Häufige Fragen zu Bio-Fisch",
};

const VISWIJZER: Record<string, { titel: string; tekst: string; link: string }> = {
  nl: {
    titel: "VISwijzer — de Nederlandse gids voor duurzame vis",
    tekst:
      "De VISwijzer van Stichting de Noordzee en het Wereld Natuur Fonds geeft vis een kleur: groen is een verantwoorde keuze, oranje betekent opletten, rood beter vermijden. Hieronder staat bij elk product wat de VISwijzer ervan zegt — ook als dat ons niet uitkomt.",
    link: "Alle vissoorten op goodfish.nl",
  },
  en: {
    titel: "VISwijzer — the Dutch guide to sustainable fish",
    tekst:
      "The VISwijzer, run by the North Sea Foundation and WWF, gives each species a colour: green is a responsible choice, orange means take care, red is better avoided. Below, every product carries its VISwijzer verdict — including the ones that do not suit us.",
    link: "All species on goodfish.nl",
  },
  de: {
    titel: "VISwijzer — der niederländische Ratgeber für nachhaltigen Fisch",
    tekst:
      "Der VISwijzer der Stiftung Nordsee und des WWF gibt jeder Art eine Farbe: Grün ist eine verantwortliche Wahl, Orange heißt aufpassen, Rot besser meiden. Unten steht bei jedem Produkt das Urteil — auch dort, wo es uns nicht passt.",
    link: "Alle Arten auf goodfish.nl",
  },
};

const LABELS: Record<string, { herkomst: string; vangst: string; leverancier: string; opAanvraag: string; meer: string }> = {
  nl: { herkomst: "Herkomst", vangst: "Vangst of teelt", leverancier: "Leverancier", opAanvraag: "Op aanvraag", meer: "Meer hierover" },
  en: { herkomst: "Origin", vangst: "Caught or farmed", leverancier: "Supplier", opAanvraag: "On request", meer: "More on this" },
  de: { herkomst: "Herkunft", vangst: "Fang oder Zucht", leverancier: "Lieferant", opAanvraag: "Auf Anfrage", meer: "Mehr dazu" },
};

const BELOFTE: Record<string, string> = {
  nl: "Wij zijn eerlijk over de duurzaamheidsstatus van elk product — ook als het oordeel oranje of rood is. Vis eten is goed voor u; bewust vis eten is beter. Vraag ons gerust naar een alternatief.",
  en: "We are honest about the sustainability status of every product — including the orange and red verdicts. Eating fish is good for you; eating it consciously is better. Do ask us for an alternative.",
  de: "Wir sind ehrlich über den Nachhaltigkeitsstatus jedes Produkts — auch bei einem orangen oder roten Urteil. Fisch zu essen ist gut; bewusst Fisch zu essen ist besser. Fragen Sie uns gern nach einer Alternative.",
};

export default async function BiologischeVisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "eerlijkeVisPage" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const faq = faqByLocale[locale] ?? faqByLocale.nl;
  const viswijzer = VISWIJZER[locale] ?? VISWIJZER.nl;
  const labels = LABELS[locale] ?? LABELS.nl;

  return (
    <>
      <JsonLd />
      <Schema
        data={[
          vraagSchema(faq),
          kruimelSchema(locale, [
            { naam: BEDRIJF.naamKort, pad: "/" },
            { naam: t("heroTitle"), pad: "/biologische-vis" },
          ]),
        ]}
      />

      <PaginaKop
        kruimels={[
          { naam: BEDRIJF.naamKort, href: `/${locale}` },
          { naam: nav("betereVis") },
        ]}
        label="BIO · ASC · MSC"
        titel={t("heroTitle")}
        intro={t("heroSub")}
        knoppen={[
          { label: t("varlaksLink").replace(" →", ""), href: `/${locale}/varlaks` },
          { label: nav("assortiment"), href: `/${locale}/assortiment`, soort: "lijn" },
        ]}
        feiten={[
          { label: "Biologisch", waarde: "Varlaks — EU-bio en ASC" },
          { label: "Wildvangst", waarde: "MSC waar het kan" },
          { label: "Winkel", waarde: ADRES_REGEL },
        ]}
      />

      {/* ── Waar we voor staan ────────────────────────────────────────────── */}
      <Sectie grond="papier" smal>
        <p className="text-[1.05rem] leading-relaxed mb-9" style={{ color: "var(--charcoal)" }}>
          {INTRO[locale] ?? INTRO.nl}
        </p>
        <Kop label="Onze overtuiging" titel={t("whyTitle")} />
        <div className="lees">
          <p>{t("whyText1")}</p>
          <p>{t("whyText2")}</p>
        </div>
      </Sectie>

      {/* ── Keurmerken ───────────────────────────────────────────────────── */}
      <Sectie grond="zand">
        <Kop
          label="Wat staat er op de verpakking"
          titel={t("certTitle")}
          intro={viswijzer.tekst}
        />
        <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8">
          {KEURMERKEN.map((keurmerk) => (
            <div key={keurmerk.label} className="pt-4" style={{ borderTop: "2px solid var(--seafoam)" }}>
              <p className="kapitaal mb-2" style={{ color: "var(--seafoam)" }}>
                {keurmerk.label}
              </p>
              <dt className="text-[1.1rem] mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
                {t(keurmerk.titel)}
              </dt>
              <dd className="text-[0.95rem] leading-relaxed" style={{ color: "var(--charcoal)" }}>
                {t(keurmerk.uitleg)}
              </dd>
            </div>
          ))}
        </dl>
        <a
          href="https://www.goodfish.nl"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-9 font-semibold underline underline-offset-4"
          style={{ color: "var(--navy)" }}
        >
          {viswijzer.link} &rarr;
        </a>
      </Sectie>

      {/* ── Varlaks ──────────────────────────────────────────────────────── */}
      <Sectie grond="navy">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-end">
          <div>
            <Kop donker label="EU-biologisch · ASC" titel={t("varlaksTitle")} />
            <p className="leading-relaxed mb-4" style={{ color: "rgba(250,246,239,0.82)" }}>
              {t("varlaksText")}
            </p>
            <p className="leading-relaxed" style={{ color: "rgba(250,246,239,0.6)" }}>
              Gekweekt door Wenberg Fiskeoppdrett en Edelfarm in de Skjerstadfjorden, Nordland —
              boven de poolcirkel bij Bodø. De roze kleur komt van Panaferd-AX, natuurlijke
              astaxanthine, en niet uit de petrochemie.
            </p>
          </div>
          <div>
            <Link href={`/${locale}/varlaks`} className="knop knop-rood">
              {t("varlaksLink").replace(" →", "")}
            </Link>
          </div>
        </div>
      </Sectie>

      {/* ── Product voor product ─────────────────────────────────────────── */}
      <Sectie grond="papier">
        <Kop
          label="Product voor product"
          titel={t("listTitle")}
          intro="Waar het vandaan komt, hoe het gevangen of gekweekt wordt, en wat de VISwijzer ervan vindt."
        />
        <div style={{ borderTop: "1px solid var(--linen)" }}>
          {ourFish.map((vis) => {
            const status = STATUS[vis.duurzaamheid];
            return (
              <article
                key={vis.name}
                className="grid lg:grid-cols-[18rem_1fr] gap-x-12 gap-y-4 py-9"
                style={{ borderBottom: "1px solid var(--linen)" }}
              >
                <div>
                  <h3 className="text-[1.3rem] mb-2 leading-snug">{vis.name}</h3>
                  <p className="text-sm italic mb-3" style={{ color: "var(--grijs)" }}>
                    {vis.tagline}
                  </p>
                  <p className="kapitaal" style={{ color: status.kleur }}>
                    {vis.badge} · {status.label}
                  </p>
                  {vis.opAanvraag && (
                    <p className="kapitaal mt-1" style={{ color: "var(--rood)" }}>
                      {labels.opAanvraag}
                    </p>
                  )}
                </div>

                <div className="lees">
                  <p>{vis.herkomst}</p>
                  <p>
                    <span className="kapitaal" style={{ color: "var(--gold)" }}>
                      {labels.vangst}
                    </span>
                    <br />
                    {vis.vangenMethode}
                  </p>
                  <p
                    className="pl-5 mt-4"
                    style={{ borderLeft: `2px solid ${status.kleur}`, color: "var(--charcoal)" }}
                  >
                    <strong style={{ color: status.kleur }}>{status.label}</strong> — {vis.duurzaamheidNote}
                    {vis.viswijzerLink && (
                      <>
                        {" "}
                        <a
                          href={vis.viswijzerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold underline underline-offset-4"
                          style={{ color: status.kleur }}
                        >
                          {labels.meer} ↗
                        </a>
                      </>
                    )}
                  </p>
                  <p className="text-sm" style={{ color: "var(--grijs)" }}>
                    {labels.leverancier}: {vis.leverancier}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <p
          className="mt-9 pl-5 max-w-3xl leading-relaxed"
          style={{ borderLeft: "2px solid var(--seafoam)", color: "var(--charcoal)" }}
        >
          {BELOFTE[locale] ?? BELOFTE.nl}
        </p>
      </Sectie>

      {/* ── Vragen ───────────────────────────────────────────────────────── */}
      <Sectie grond="zand" smal>
        <Kop titel={FAQ_KOP[locale] ?? FAQ_KOP.nl} />
        <Vragen vragen={faq} />
      </Sectie>

      <PaginaSlot
        titel={t("ctaTitle")}
        tekst={t("ctaText")}
        knoppen={[
          { label: nav("bestellen"), href: `/${locale}/bestellen` },
          { label: nav("visschalen"), href: `/${locale}/visschalen`, soort: "lijn" },
          { label: t("ctaButton"), href: `/${locale}/bezoek-ons`, soort: "lijn" },
        ]}
      />
    </>
  );
}
