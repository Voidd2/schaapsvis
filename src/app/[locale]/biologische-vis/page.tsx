import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("eerlijkeVisTitle"),
    description: t("eerlijkeVisDesc"),
    alternates: {
      canonical: `/${locale}/biologische-vis`,
      languages: {
        nl: "/nl/biologische-vis",
        en: "/en/biologische-vis",
        de: "/de/biologische-vis",
        "x-default": "/nl/biologische-vis",
      },
    },
    openGraph: {
      title: t("eerlijkeVisTitle"),
      description: t("eerlijkeVisDesc"),
      locale,
      type: "website",
    },
  };
}

// Keurmerken in volgorde van de biologische positionering: BIO eerst, dan ASC, MSC, traceerbaarheid.
const certifications = [
  {
    key: "cert3" as const,
    label: "BIO",
    color: "#3a6b2e",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22V12" />
        <path d="M5 12C5 7 8 4 12 4c4 0 7 3 7 8s-3 7-7 7" />
        <path d="M5 12h7" />
      </svg>
    ),
  },
  {
    key: "cert2" as const,
    label: "ASC",
    color: "#2e6b5e",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    key: "cert1" as const,
    label: "MSC",
    color: "#1a6b8a",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12a9 9 0 1 0 18 0A9 9 0 0 0 3 12z" />
        <path d="M8 12c0-2.5 1.5-4 4-4s4 1.5 4 4-1.5 4-4 4" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "cert4" as const,
    label: "100%",
    color: "#8b5e14",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
];

type DuurzaamheidStatus = "groen" | "oranje" | "rood";

interface FishCard {
  name: string;
  badge: string;
  badgeColor: string;
  opAanvraag: boolean;
  duurzaamheid: DuurzaamheidStatus;
  foto: string;
  fotoAlt: string;
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
    foto: "/images/scene-schaaldier.svg",
    fotoAlt: "Hollandse garnalen — MSC-gecertificeerd, bij Schaap's Vishandel Leiden",
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
    foto: "/images/scene-schaaldier.svg",
    fotoAlt: "Fine de Claire oesters uit Marennes-Oléron, bij Schaap's Vishandel Leiden",
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
    badgeColor: "#b8832e",
    opAanvraag: false,
    duurzaamheid: "rood",
    foto: "/images/scene-vis.svg",
    fotoAlt: "Gestoomde makreel — eerlijk over de VISwijzer-status, bij Schaap's Vishandel Leiden",
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
    foto: "/images/scene-vis.svg",
    fotoAlt: "Yellowfin tonijn AA Chunk uit Sri Lanka, bij Schaap's Vishandel Leiden",
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
    foto: "/images/scene-zalm.svg",
    fotoAlt: "Gerookte zalm snippers — ASC-gecertificeerd, bij Schaap's Vishandel Leiden",
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

const duurzaamheidConfig: Record<DuurzaamheidStatus, { label: string; color: string; bg: string }> = {
  groen: { label: "✓ Duurzaam", color: "#2e6b5e", bg: "rgba(46,107,94,0.08)" },
  oranje: { label: "◐ Let op", color: "#b8832e", bg: "rgba(184,131,46,0.08)" },
  rood: { label: "⚠ Overbevist", color: "#c8604a", bg: "rgba(200,96,74,0.08)" },
};

// FAQ — inhoud in de pagina (gespiegeld in FAQPage JSON-LD hieronder).
const faqByLocale: Record<string, { q: string; a: string }[]> = {
  nl: [
    {
      q: "Wat is biologische vis precies?",
      a: "Biologische vis komt altijd uit gecertificeerde kweek (aquacultuur) — voor het EU-biologisch keurmerk, in Nederland gecontroleerd door Skal, gelden strenge eisen: biologisch voer, lage bezettingsdichtheid, geen preventieve antibiotica, geen synthetische kleurstoffen en aantoonbaar dierenwelzijn. Onze Varlaks zalm voldoet hieraan en is daarnaast ASC-gecertificeerd.",
    },
    {
      q: "Kan wilde vis biologisch zijn?",
      a: "Nee. Het biologische keurmerk gaat over de manier van kweken — voer, leefomgeving en dierenwelzijn. Wilde vis leeft in zee en eet wat hij tegenkomt; daar bestaat geen biologische norm voor. Wilde vis kán wel duurzaam zijn: let dan op het MSC-keurmerk en de VISwijzer. Kortom: biologisch = verantwoorde kweek, MSC = duurzame wildvangst.",
    },
    {
      q: "Is biologische zalm gezonder dan gewone kweekzalm?",
      a: "Biologische zalm bevat, net als andere vette vis, veel omega-3 vetzuren. Het grote verschil zit in wat er níet in zit: geen preventieve antibiotica, geen synthetische astaxanthine en geen GMO-voer. Bij onze Varlaks komt de roze kleur van natuurlijke astaxanthine (Panaferd-AX). Het is daarmee schoner en transparanter geproduceerd dan gangbare kweekzalm.",
    },
    {
      q: "Waar koop ik biologische vis in Leiden?",
      a: "Bij Schaap's Vishandel, Herenstraat 48 in Leiden — dé plek voor biologische vis en biologische Varlaks zalm in Leiden. Ook op de markt (woensdag bij de Vismarkt aan de Nieuwe Rijn, zaterdag op de Aalmarkt voor de Waag) en vrijdag bij Hoogvliet in Voorschoten. Bel 071 514 9802 of bestel vooruit.",
    },
  ],
  en: [
    {
      q: "What exactly is organic fish?",
      a: "Organic fish always comes from certified farming (aquaculture). The EU organic label — controlled in the Netherlands by Skal — sets strict requirements: organic feed, low stocking density, no preventive antibiotics, no synthetic colourings and demonstrable animal welfare. Our Varlaks salmon meets these standards and is also ASC-certified.",
    },
    {
      q: "Can wild fish be organic?",
      a: "No. The organic label is about how fish is farmed — feed, environment and animal welfare. Wild fish live in the sea and eat what they find; there is no organic standard for that. Wild fish can be sustainable, though: look for the MSC label and the Dutch VISwijzer guide. In short: organic = responsible farming, MSC = sustainable wild catch.",
    },
    {
      q: "Is organic salmon healthier than regular farmed salmon?",
      a: "Like other oily fish, organic salmon is rich in omega-3. The big difference is what it does not contain: no preventive antibiotics, no synthetic astaxanthine and no GMO feed. In our Varlaks the pink colour comes from natural astaxanthine (Panaferd-AX). It is cleaner and more transparently produced than conventional farmed salmon.",
    },
    {
      q: "Where can I buy organic fish in Leiden?",
      a: "At Schaap's Vishandel, Herenstraat 48 in Leiden — the place for organic fish and organic Varlaks salmon in Leiden. Also at the market (Wednesday at the Vismarkt on the Nieuwe Rijn, Saturday at the Aalmarkt in front of the Waag) and Friday at Hoogvliet in Voorschoten. Call +31 71 514 9802 or pre-order.",
    },
  ],
  de: [
    {
      q: "Was ist Bio-Fisch genau?",
      a: "Bio-Fisch stammt immer aus zertifizierter Zucht (Aquakultur). Für das EU-Bio-Siegel — in den Niederlanden von Skal kontrolliert — gelten strenge Anforderungen: Bio-Futter, geringe Besatzdichte, keine vorbeugenden Antibiotika, keine synthetischen Farbstoffe und nachweisbares Tierwohl. Unser Varlaks-Lachs erfüllt dies und ist zudem ASC-zertifiziert.",
    },
    {
      q: "Kann Wildfisch biologisch sein?",
      a: "Nein. Das Bio-Siegel betrifft die Art der Zucht — Futter, Lebensraum und Tierwohl. Wildfisch lebt im Meer und frisst, was er findet; dafür gibt es keine Bio-Norm. Wildfisch kann aber nachhaltig sein: achten Sie auf das MSC-Siegel und den VISwijzer. Kurz gesagt: Bio = verantwortungsvolle Zucht, MSC = nachhaltiger Wildfang.",
    },
    {
      q: "Ist Bio-Lachs gesünder als normaler Zuchtlachs?",
      a: "Wie anderer fetter Fisch ist Bio-Lachs reich an Omega-3. Der große Unterschied liegt darin, was nicht enthalten ist: keine vorbeugenden Antibiotika, kein synthetisches Astaxanthin und kein GMO-Futter. Bei unserem Varlaks stammt die rosa Farbe von natürlichem Astaxanthin (Panaferd-AX). Er ist sauberer und transparenter produziert als herkömmlicher Zuchtlachs.",
    },
    {
      q: "Wo kann ich in Leiden Bio-Fisch kaufen?",
      a: "Bei Schaap's Vishandel, Herenstraat 48 in Leiden — die Adresse für Bio-Fisch und Bio-Lachs Varlaks in Leiden. Auch auf dem Markt (mittwochs am Vismarkt an der Nieuwe Rijn, samstags am Aalmarkt vor der Waag) und freitags bei Hoogvliet in Voorschoten. Rufen Sie +31 71 514 9802 an oder bestellen Sie vor.",
    },
  ],
};

const introByLocale: Record<string, string> = {
  nl: "Schaap's Vishandel is hét adres voor biologische vis in Leiden. Onze biologische Varlaks zalm is ASC- én EU-biologisch gecertificeerd. Daarnaast werken we met MSC-gecertificeerde wildvangst en verantwoorde kweek. Hieronder leggen we eerlijk uit wat de keurmerken betekenen — en tonen we per product de herkomst en de VISwijzer-status, ook als die niet perfect is.",
  en: "Schaap's Vishandel is the address for organic fish in Leiden. Our organic Varlaks salmon is both ASC- and EU-organic certified. We also work with MSC-certified wild catch and responsible farming. Below we explain honestly what the labels mean — and for every product we show the origin and the VISwijzer status, even when it is not perfect.",
  de: "Schaap's Vishandel ist die Adresse für Bio-Fisch in Leiden. Unser Bio-Lachs Varlaks ist sowohl ASC- als auch EU-Bio-zertifiziert. Außerdem arbeiten wir mit MSC-zertifiziertem Wildfang und verantwortungsvoller Zucht. Nachfolgend erklären wir ehrlich, was die Siegel bedeuten — und zeigen für jedes Produkt die Herkunft und den VISwijzer-Status, auch wenn er nicht perfekt ist.",
};

const faqHeading: Record<string, string> = {
  nl: "Veelgestelde vragen over biologische vis",
  en: "Frequently asked questions about organic fish",
  de: "Häufige Fragen zu Bio-Fisch",
};

const moneyLinks: Record<string, { varlaks: string; assortiment: string }> = {
  nl: { varlaks: "Bekijk de biologische Varlaks zalm", assortiment: "Naar ons assortiment" },
  en: { varlaks: "See the organic Varlaks salmon", assortiment: "Browse our products" },
  de: { varlaks: "Zum Bio-Lachs Varlaks", assortiment: "Zu unserem Sortiment" },
};

function BiologischeVisContent() {
  const t = useTranslations("eerlijkeVisPage");
  const locale = useLocale();
  const faq = faqByLocale[locale] ?? faqByLocale.nl;

  return (
    <>
      {/* Hero */}
      <section
        className="relative py-28 px-6 text-center overflow-hidden"
        style={{ backgroundColor: "#0f2218" }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 25% 60%, #2e8b57 0%, transparent 55%), radial-gradient(ellipse at 75% 40%, #1a6b8a 0%, transparent 55%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p
            className="text-xs uppercase tracking-[0.35em] mb-6 font-medium"
            style={{ color: "#6ec89a" }}
          >
            Schaap&apos;s Vis · Leiden · Biologisch &amp; duurzaam
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white"
            style={{ fontFamily: "Playfair Display, serif", letterSpacing: "-0.02em" }}
          >
            {t("heroTitle")}
          </h1>
          <p
            className="text-lg md:text-xl font-light max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {t("heroSub")}
          </p>
        </div>
      </section>

      {/* Intro + money-page links */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(246,250,253,0.85)" }}>
            {introByLocale[locale] ?? introByLocale.nl}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={`/${locale}/varlaks`}
              className="inline-block text-sm font-semibold px-6 py-3 text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--seafoam)" }}
            >
              {(moneyLinks[locale] ?? moneyLinks.nl).varlaks} →
            </Link>
            <Link
              href={`/${locale}/assortiment`}
              className="inline-block text-sm font-semibold px-6 py-3 transition-colors border"
              style={{ borderColor: "rgba(246,250,253,0.4)", color: "var(--cream)" }}
            >
              {(moneyLinks[locale] ?? moneyLinks.nl).assortiment} →
            </Link>
          </div>
        </div>
      </section>

      {/* Waarom */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase mb-4 font-semibold opacity-50"
              style={{ color: "var(--navy)" }}
            >
              Onze overtuiging
            </p>
            <h2
              className="text-4xl font-bold mb-6 leading-tight"
              style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
            >
              {t("whyTitle")}
            </h2>
            <p className="leading-relaxed mb-4" style={{ color: "var(--charcoal)", opacity: 0.8 }}>
              {t("whyText1")}
            </p>
            <p className="leading-relaxed font-medium" style={{ color: "var(--charcoal)", opacity: 0.9 }}>
              {t("whyText2")}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/scene-vis.svg"
            alt="Verse, duurzame en biologische vis bij Schaap's Vishandel Leiden"
            className="w-full aspect-[4/3] object-cover"
          />
        </div>
      </section>

      {/* Keurmerken uitgelegd — BIO eerst */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-3"
            style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
          >
            {t("certTitle")}
          </h2>
          <p className="text-center text-sm mb-12 opacity-60" style={{ color: "var(--charcoal)" }}>
            Wat betekenen die keurmerken op de verpakking eigenlijk?
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map(({ key, label, color, icon }) => (
              <div
                key={key}
                className="p-6 bg-white"
                style={{ borderTop: `4px solid ${color}` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ color }}>{icon}</div>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color }}
                  >
                    {label}
                  </span>
                </div>
                <h3
                  className="font-bold text-base mb-2"
                  style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                >
                  {t(key)}
                </h3>
                <p className="text-xs leading-relaxed opacity-70" style={{ color: "var(--charcoal)" }}>
                  {t(`${key}desc` as Parameters<typeof t>[0])}
                </p>
              </div>
            ))}
          </div>

          {/* VISwijzer uitleg */}
          <div
            className="mt-8 p-6 bg-white"
            style={{ borderTop: "4px solid var(--navy)" }}
          >
            <h3
              className="font-bold text-base mb-2"
              style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
            >
              VISwijzer — de Nederlandse gids voor duurzame vis
            </h3>
            <p className="text-xs leading-relaxed opacity-70 mb-2" style={{ color: "var(--charcoal)" }}>
              De VISwijzer (van Stichting de Noordzee en het Wereld Natuur Fonds) geeft vis een kleurcode:
              groen = verantwoorde keuze, oranje = let op, rood = beter vermijden. Op deze pagina laten
              wij voor elk product de VISwijzer-status zien — ook als die niet gunstig is.
            </p>
            <a
              href="https://www.goodfish.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
              style={{ color: "var(--navy)" }}
            >
              Bekijk alle vissoorten op goodfish.nl ↗
            </a>
          </div>
        </div>
      </section>

      {/* Varlaks — biologische zalm */}
      <section style={{ backgroundColor: "#0a1628" }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/scene-zalm.svg"
            alt="Varlaks biologische zalm uit de Skjerstadfjorden, Noorwegen — bij Schaap's Vishandel Leiden"
            className="w-full aspect-square object-cover"
          />
          <div>
            <span
              className="inline-block text-xs tracking-widest uppercase font-semibold px-3 py-1 mb-2 text-white"
              style={{ backgroundColor: "#2e6b5e" }}
            >
              EU-biologisch · ASC gecertificeerd
            </span>
            <h2
              className="text-4xl font-bold mb-5 leading-tight text-white"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {t("varlaksTitle")}
            </h2>
            <p className="leading-relaxed mb-4 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              {t("varlaksText")}
            </p>
            <p className="leading-relaxed mb-8 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Gekweekt door Wenberg Fiskeoppdrett en Edelfarm in de Skjerstadfjorden, Nordland —
              boven de poolcirkel, nabij Bodø. ASC gecertificeerd. Panaferd-AX: natuurlijke
              astaxanthine — de roze kleur is echt, niet kunstmatig.
            </p>
            <Link
              href={`/${locale}/varlaks`}
              className="text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: "#7ec8d4" }}
            >
              {t("varlaksLink")}
            </Link>
          </div>
        </div>
      </section>

      {/* Ons aanbod — echte viskaarten met herkomstverhalen */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-3"
            style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
          >
            {t("listTitle")}
          </h2>
          <p
            className="text-center text-sm mb-14 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--charcoal)", opacity: 0.7 }}
          >
            Elk product met zijn eigen verhaal — waar het vandaan komt, hoe het gevangen of gekweekt
            wordt, en wat het VISwijzer-oordeel is. We zijn eerlijk, ook als het verhaal niet perfect is.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ourFish.map((fish) => {
              const ds = duurzaamheidConfig[fish.duurzaamheid];
              return (
                <article
                  key={fish.name}
                  className="bg-white flex flex-col"
                  style={{ border: "1px solid rgba(26,53,48,0.08)" }}
                >
                  {/* Foto */}
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fish.foto}
                      alt={fish.fotoAlt}
                      className="w-full aspect-[4/3] object-cover"
                      loading="lazy"
                    />
                    <span
                      className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 text-white"
                      style={{ backgroundColor: fish.badgeColor }}
                    >
                      {fish.badge}
                    </span>
                    {fish.opAanvraag && (
                      <span
                        className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 text-white"
                        style={{ backgroundColor: "var(--salmon)" }}
                      >
                        Op aanvraag
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3
                      className="text-xl font-bold mb-1 leading-tight"
                      style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                    >
                      {fish.name}
                    </h3>
                    <p
                      className="text-xs italic mb-4"
                      style={{ color: "var(--charcoal)", opacity: 0.5 }}
                    >
                      {fish.tagline}
                    </p>

                    {/* Herkomst */}
                    <p
                      className="text-xs leading-relaxed mb-3"
                      style={{ color: "var(--charcoal)", opacity: 0.75 }}
                    >
                      {fish.herkomst}
                    </p>

                    {/* Vangstmethode */}
                    <p
                      className="text-xs leading-relaxed mb-4 flex-1"
                      style={{ color: "var(--charcoal)", opacity: 0.55 }}
                    >
                      <strong style={{ opacity: 1 }}>Vangst/teelt:</strong> {fish.vangenMethode}
                    </p>

                    {/* VISwijzer / Duurzaamheid */}
                    <div
                      className="p-3 text-xs leading-relaxed mb-3"
                      style={{ backgroundColor: ds.bg, borderLeft: `3px solid ${ds.color}` }}
                    >
                      <span className="font-bold" style={{ color: ds.color }}>
                        {ds.label}
                      </span>
                      {" — "}
                      <span style={{ color: "var(--charcoal)", opacity: 0.75 }}>
                        {fish.duurzaamheidNote}
                      </span>
                      {fish.viswijzerLink && (
                        <>
                          {" "}
                          <a
                            href={fish.viswijzerLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:opacity-70 transition-opacity"
                            style={{ color: ds.color }}
                          >
                            Meer info ↗
                          </a>
                        </>
                      )}
                    </div>

                    {/* Leverancier */}
                    <div
                      className="pt-3 text-xs"
                      style={{
                        borderTop: "1px solid var(--sand)",
                        color: "var(--navy)",
                        opacity: 0.45,
                      }}
                    >
                      {fish.leverancier}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div
            className="mt-12 p-8"
            style={{ backgroundColor: "var(--sand)", borderLeft: "4px solid var(--seafoam)" }}
          >
            <p
              className="text-sm leading-relaxed max-w-2xl"
              style={{ color: "var(--charcoal)", opacity: 0.85 }}
            >
              <strong>Onze belofte:</strong> wij zijn transparant over de duurzaamheidsstatus van
              elk product — ook als dat een rood of oranje oordeel is. Vis eten is goed voor u;
              bewust vis eten is nog beter. Vraag ons gerust naar alternatieven.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-10"
            style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
          >
            {faqHeading[locale] ?? faqHeading.nl}
          </h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details
                key={item.q}
                className="group bg-white p-5"
                style={{ border: "1px solid rgba(0,0,0,0.07)" }}
              >
                <summary
                  className="flex items-center justify-between gap-3 cursor-pointer select-none font-bold"
                  style={{ listStyle: "none", color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
                >
                  {item.q}
                  <svg
                    className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-180"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--charcoal)", opacity: 0.8 }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16 px-6 text-center">
        <h2
          className="text-3xl font-bold mb-4 text-white"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {t("ctaTitle")}
        </h2>
        <p
          className="text-sm mb-8 max-w-md mx-auto leading-relaxed"
          style={{ color: "rgba(246,250,253,0.7)" }}
        >
          Herenstraat 48, Leiden · Dinsdag t/m zaterdag · 071 514 9802
        </p>
        <Link
          href={`/${locale}/bezoek-ons`}
          className="inline-block text-white px-8 py-4 tracking-wide font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--salmon)" }}
        >
          {t("ctaButton")} &rarr;
        </Link>
      </section>
    </>
  );
}

export default async function BiologischeVisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const faq = faqByLocale[locale] ?? faqByLocale.nl;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://www.schaapsvishandel.nl/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Biologische vis",
        item: `https://www.schaapsvishandel.nl/${locale}/biologische-vis`,
      },
    ],
  };

  return (
    <>
      <JsonLd />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BiologischeVisContent />
    </>
  );
}
