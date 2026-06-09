import Link from "next/link";
import { notFound } from "next/navigation";
import { useLocale } from "next-intl";
import type { Metadata } from "next";
import { Clock, ChefHat, ShoppingBag, ShoppingCart, ArrowLeft } from "lucide-react";
import { PhotoPlaceholder } from "@/components/shared/PhotoPlaceholder";

type Recept = {
  slug: string;
  title: string;
  subtitle: string;
  tijd: string;
  porties: number;
  moeilijkheid: "Makkelijk" | "Gemiddeld" | "Uitdagend";
  fotoLabel: string;
  vanSchaap: string[];
  vanSupermarkt: string[];
  bereidingswijze: string[];
  verhaal: string;
  tag?: string;
  seoKeywords?: string;
};

export const recepten: Recept[] = [
  {
    slug: "zalm-citroen-dille",
    title: "Zalm in de oven met citroen en dille",
    subtitle: "Simpel, snel en verrassend lekker",
    tijd: "20 min",
    porties: 2,
    moeilijkheid: "Makkelijk",
    fotoLabel:
      "FOTO TOEVOEGEN: Garen zalmfilet op bakplaat met citroen en dille, goudbruin",
    vanSchaap: ["Varlaks zalmfilet (ca. 150–200g per persoon)"],
    vanSupermarkt: [
      "1 citroen",
      "Verse dille (of gedroogde dille)",
      "Olijfolie",
      "Zout en peper",
      "Optioneel: 1 teentje knoflook, een eetlepel kappertjes",
    ],
    bereidingswijze: [
      "Verwarm de oven voor op 200°C (hetelucht: 180°C).",
      "Leg de zalmfilet op een stuk bakpapier op de bakplaat.",
      "Besprenkel royaal met olijfolie en bestrooi met zout en peper.",
      "Leg schijfjes citroen op de zalm en strooi verse dille erover.",
      "Bak 12–15 minuten, afhankelijk van de dikte. De zalm is klaar als hij makkelijk uiteen valt met een vork maar nog licht rosé van binnen is.",
      "Serveer direct met gekookte aardappelen, rijst of een frisse salade.",
    ],
    verhaal:
      "Dit is het ideale doordeweekse visgerecht. De Varlaks zalm heeft zo'n rijke, volle smaak dat er eigenlijk weinig bij nodig is. Citroen en dille versterken het zonder te overheersen. Aldert's advies: laat de zalm niet te lang in de oven — iets rosé van binnen is perfect en ook zo bedoeld.",
    tag: "Varlaks special",
    seoKeywords: "zalm recept oven citroen dille, zalm bakken oven, Varlaks zalm recept",
  },
  {
    slug: "kibbeling-knoflooksaus",
    title: "Kibbeling met zelfgemaakte knoflooksaus",
    subtitle: "De Hollandse klassieker, thuis gemaakt",
    tijd: "30 min",
    porties: 4,
    moeilijkheid: "Gemiddeld",
    fotoLabel:
      "FOTO TOEVOEGEN: Verse kibbeling op een bord met knoflooksaus en citroenpartje",
    vanSchaap: ["500g kibbeling (kant-en-klaar in beslag)"],
    vanSupermarkt: [
      "Frituurolie of zonnebloemolie (1–1,5 liter)",
      "3 el mayonaise",
      "2 teentjes knoflook",
      "Sap van ½ citroen",
      "Verse peterselie of bieslook",
      "Optioneel: friet of stokbrood erbij",
    ],
    bereidingswijze: [
      "Maak eerst de saus: meng mayonaise met geperste knoflook, citroensap en fijngesneden peterselie. Zet minstens 15 minuten in de koelkast — hoe langer, hoe beter.",
      "Verhit olie in een ruime pan of frituurpan tot 180°C.",
      "Frituur de kibbeling in kleine porties (niet te veel tegelijk) zodat de temperatuur op peil blijft: 3–4 minuten tot goudbruin en knapperig.",
      "Laat uitlekken op keukenpapier en bestrooi direct met een snufje zout.",
      "Serveer direct met de saus, een schijfje citroen en friet.",
    ],
    verhaal:
      "Kibbeling is onze absolute bestseller — elke dag vers gebakken. Maar wist u dat u kibbeling ook gewoon thuis kunt frituren? Haal het rauwe beslag bij ons op, en in 30 minuten staat er een echte Hollandse lekkernij op tafel. De truc zit hem in de olietemperatuur: te koud en het beslag zuigt vet op; precies goed en het wordt perfect knapperig.",
    tag: "Populairste gerecht",
    seoKeywords: "kibbeling recept thuis, kibbeling frituren, knoflooksaus recept vis",
  },
  {
    slug: "gravlaks",
    title: "Gravlaks van Varlaks zalm",
    subtitle: "Nordisch recept — minstens 48 uur, maar elke minuut waard",
    tijd: "48 uur (+ 15 min bereiding)",
    porties: 6,
    moeilijkheid: "Uitdagend",
    fotoLabel:
      "FOTO TOEVOEGEN: Dunne plakjes gravlaks op brood met roomkaas, rode ui en dille",
    vanSchaap: [
      "Hele zalmfilet Varlaks (500–800g, met vel, zonder graten) — vraag Aldert om de graten eruit te halen",
    ],
    vanSupermarkt: [
      "200g grof zeezout",
      "150g fijne suiker",
      "1 grote bos verse dille",
      "1 eetlepel grofgemalen zwarte peper",
      "Optioneel: 2 el cognac of wodka",
      "Voor serveren: roggebrood, roomkaas, rode ui, kappertjes, citroen",
    ],
    bereidingswijze: [
      "Hak de dille fijn. Meng zout, suiker, peper en dille door elkaar. Voeg optioneel de cognac toe.",
      "Leg de zalm met de velzijde naar beneden op een stuk vershoudfolie.",
      "Dek de zalm volledig af met het kruidenmengsel — wees royaal.",
      "Vouw de folie strak dicht en leg in een ondiepe schaal. Zet een gewicht erop: een snijplank met een paar blikjes werkt prima.",
      "Zet 48 uur in de koelkast. Keer de zalm na 24 uur om.",
      "Na 48 uur: spoel de marinade af met koud water en dep droog.",
      "Snijd in dunne plakjes met een lang, scherp mes onder een kleine hoek.",
      "Serveer op roggebrood met een dun laagje roomkaas, rode ui en kappertjes.",
    ],
    verhaal:
      "Gravlaks is een oud Scandinavisch recept waarbij zalm 'gekookt' wordt door het pekelen — geen hittebron nodig. Het resultaat is zijdezacht, vol van smaak en indrukwekkend als voorgerecht bij een feestelijke gelegenheid. Voor dit recept is kwaliteit essentieel: de zalm wordt rauw gegeten, dus gebruik altijd supverse Varlaks zalm van Schaap's Vis.",
    tag: "Bijzonder gerecht",
    seoKeywords: "gravlaks recept, zelf gravlaks maken, gepekelde zalm recept",
  },
  {
    slug: "haring-salade",
    title: "Haring met appel en rode ui",
    subtitle: "Fris, snel en klassiek Hollands",
    tijd: "15 min",
    porties: 2,
    moeilijkheid: "Makkelijk",
    fotoLabel:
      "FOTO TOEVOEGEN: Gehalveerde haring met appelstukjes en rode ui op een bord",
    vanSchaap: ["4 verse haringen (schoongemaakt en gefileerd)"],
    vanSupermarkt: [
      "1 zoetzure appel (bijv. Elstar of Jonagold)",
      "1 kleine rode ui",
      "2 el crème fraîche of zure room",
      "1 tl grove mosterd",
      "Verse bieslook of peterselie",
      "Zout, peper en een scheutje citroensap",
      "Optioneel: augurken in plakjes, roggebrood",
    ],
    bereidingswijze: [
      "Snijd de haring in stukjes van 2–3 cm.",
      "Schil de appel en snijd in kleine blokjes. Snipper de rode ui zo fijn mogelijk.",
      "Meng crème fraîche met mosterd, zout, peper en citroensap.",
      "Voeg haring, appel, ui en gesneden kruiden toe aan de dressing.",
      "Meng voorzichtig zodat de haring niet helemaal uit elkaar valt.",
      "Laat minstens 10 minuten in de koelkast staan zodat de smaken intrekken.",
      "Serveer op roggebrood of als voorgerecht in glaasjes.",
    ],
    verhaal:
      "Verse haring is het paradepaardje van de Nederlandse vishandel — en van Leiden in het bijzonder. Rauw, puur, direct van zee. Dit recept combineert de zilte smaak van haring met de frisheid van appel en de bite van rode ui. Een klassieke combinatie die nooit verveelt. Haal de haring altijd op de dag zelf: hoe verser, hoe beter.",
    seoKeywords: "haring recept, verse haring Leiden, haringschotel met appel",
  },
  {
    slug: "romige-vissoep",
    title: "Romige vissoep",
    subtitle: "Verwarmend, vol en vol vis",
    tijd: "45 min",
    porties: 4,
    moeilijkheid: "Gemiddeld",
    fotoLabel:
      "FOTO TOEVOEGEN: Dampende kom vissoep met verse kruiden en brood ernaast",
    vanSchaap: [
      "300g gemengde visfilet (bijv. kabeljauw + zalm of lekkerbek)",
      "Optioneel: onze kant-en-klare vissoep als smaakrijke basis",
    ],
    vanSupermarkt: [
      "1 ui, 2 stengels bleekselderij, 2 wortelen",
      "1 blik gepelde tomaten (400g)",
      "200ml slagroom",
      "1 liter visbouillon (of kippenbouillon)",
      "1 dl droge witte wijn",
      "Verse peterselie, 1 laurierblad, tijm",
      "Olijfolie, zout, peper",
      "Knapperig stokbrood of zuurdesembrood",
    ],
    bereidingswijze: [
      "Snipper ui fijn. Snijd selderij en wortel in kleine stukjes.",
      "Fruit de groenten 5 minuten in olijfolie op middelhoog vuur.",
      "Voeg witte wijn toe en laat 2 minuten inkoken.",
      "Voeg bouillon, tomaten, laurier en tijm toe. Breng aan de kook en laat 15 minuten sudderen.",
      "Snijd de visfilet in stukken van 3–4 cm. Voeg toe aan de soep.",
      "Laat de vis op laag vuur 8–10 minuten zachtjes garen — niet koken, anders wordt de vis taai.",
      "Roer de slagroom erdoor en breng op smaak met zout en peper.",
      "Strooi verse peterselie erover en serveer direct met goed brood.",
    ],
    verhaal:
      "Niets gaat boven een zelfgemaakte vissoep op een gure dag. Vraag bij Schaap's Vis naar de dagverse visfilet — Aldert vertelt u welke vis die dag het lekkerst is. U kunt ook onze kant-en-klare vissoep meenemen als rijke basis voor dit recept.",
    seoKeywords: "vissoep recept, romige vissoep maken, vissoep met room",
  },
  {
    slug: "gegrilde-schol",
    title: "Gegrilde scholfilet met groene kruiden",
    subtitle: "Licht, gezond en in 20 minuten klaar",
    tijd: "20 min",
    porties: 2,
    moeilijkheid: "Makkelijk",
    fotoLabel:
      "FOTO TOEVOEGEN: Gegrilde scholfilet met groene kruiden en citroen op bord",
    vanSchaap: ["Verse scholfilet (ca. 150g per persoon)"],
    vanSupermarkt: [
      "30g roomboter",
      "Sap van 1 citroen",
      "Verse peterselie en bieslook",
      "Zout en peper",
      "Optioneel: kappertjes, anchovispasta voor extra diepte",
      "Gekookte krieltjes of groene salade erbij",
    ],
    bereidingswijze: [
      "Dep de scholfilet goed droog met keukenpapier — dat zorgt voor een mooi bruin korstje.",
      "Bestrooi aan beide zijden met zout en peper.",
      "Verhit roomboter in een anti-aanbakpan op middelhoog vuur totdat het begint te schuimen.",
      "Leg de scholfilet voorzichtig in de pan. Bak 2–3 minuten per kant tot goudbruin. Ga niet staan roeren: geduld is de sleutel.",
      "Voeg de laatste minuut citroensap toe. Let op: het spettert!",
      "Serveer direct op een warm bord, bestrooid met verse kruiden.",
    ],
    verhaal:
      "Schol is een échte Hollandse platvis die veel te weinig thuis bereid wordt. Vers van Schaap's Vis, snel klaargemaakt en gezond. De dunne filet heeft nauwelijks bereidingstijd nodig — overkoken is eigenlijk de enige fout die u kunt maken. Vraag Aldert altijd om de verste schol van die dag.",
    seoKeywords: "scholfilet recept, schol bakken, platvis recept makkelijk",
  },
];

function ReceptDetailContent({ recept, locale }: { recept: Recept; locale: string }) {
  const moeilijkheidColor =
    recept.moeilijkheid === "Makkelijk"
      ? "var(--seafoam)"
      : recept.moeilijkheid === "Gemiddeld"
      ? "var(--gold)"
      : "var(--salmon)";

  return (
    <>
      {/* Back link */}
      <div style={{ backgroundColor: "var(--cream)", borderBottom: "1px solid rgba(28,53,87,0.1)" }} className="py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/${locale}/recepten`}
            className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "var(--navy)" }}
          >
            <ArrowLeft size={15} />
            Alle recepten
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {recept.tag && (
            <span
              className="inline-block text-xs font-bold px-3 py-1 mb-5 text-white"
              style={{ backgroundColor: "var(--salmon)" }}
            >
              {recept.tag}
            </span>
          )}
          <h1
            className="text-4xl md:text-5xl font-bold mb-3 leading-tight"
            style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
          >
            {recept.title}
          </h1>
          <p className="text-lg mb-8" style={{ color: "rgba(247,240,227,0.7)" }}>
            {recept.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <span
              className="inline-flex items-center gap-2 text-sm px-4 py-2 text-white"
              style={{ backgroundColor: "rgba(247,240,227,0.1)" }}
            >
              <Clock size={15} />
              {recept.tijd}
            </span>
            <span
              className="inline-flex items-center gap-2 text-sm px-4 py-2 text-white"
              style={{ backgroundColor: "rgba(247,240,227,0.1)" }}
            >
              <ChefHat size={15} />
              {recept.moeilijkheid}
            </span>
            <span
              className="inline-flex items-center gap-2 text-sm px-4 py-2 text-white"
              style={{ backgroundColor: "rgba(247,240,227,0.1)" }}
            >
              {recept.porties} personen
            </span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-14 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
          {/* Left: photo + story */}
          <div className="md:col-span-2 space-y-8">
            <PhotoPlaceholder label={recept.fotoLabel} aspectRatio="aspect-[16/9]" />

            {/* Verhaal */}
            <div
              className="p-6"
              style={{ backgroundColor: "var(--sand)", borderLeft: "4px solid var(--navy)" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50"
                style={{ color: "var(--navy)" }}
              >
                Aldert vertelt
              </p>
              <p
                className="leading-relaxed italic"
                style={{ color: "var(--charcoal)", opacity: 0.85 }}
              >
                &ldquo;{recept.verhaal}&rdquo;
              </p>
            </div>

            {/* Bereidingswijze */}
            <div>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
              >
                Bereidingswijze
              </h2>
              <ol className="space-y-4">
                {recept.bereidingswijze.map((stap, i) => (
                  <li key={i} className="flex gap-4">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: "var(--navy)" }}
                    >
                      {i + 1}
                    </span>
                    <p
                      className="leading-relaxed text-sm pt-0.5"
                      style={{ color: "var(--charcoal)", opacity: 0.85 }}
                    >
                      {stap}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right: ingredients */}
          <div className="space-y-6">
            {/* Van Schaap's Vis */}
            <div
              className="p-5"
              style={{ backgroundColor: "var(--navy)", borderTop: "3px solid var(--salmon)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={16} style={{ color: "var(--sand)" }} />
                <h3
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ color: "var(--sand)" }}
                >
                  Van Schaap&apos;s Vis
                </h3>
              </div>
              <ul className="space-y-2">
                {recept.vanSchaap.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-snug"
                    style={{ color: "rgba(247,240,227,0.85)" }}
                  >
                    · {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/bestellen`}
                className="inline-block mt-5 text-xs font-semibold px-4 py-2 text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--salmon)" }}
              >
                Vooruit bestellen
              </Link>
            </div>

            {/* Van de supermarkt */}
            <div
              className="p-5"
              style={{ backgroundColor: "var(--sand)", borderTop: "3px solid var(--charcoal)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart size={16} style={{ color: "var(--charcoal)", opacity: 0.6 }} />
                <h3
                  className="text-sm font-bold uppercase tracking-wide opacity-60"
                  style={{ color: "var(--charcoal)" }}
                >
                  Van de supermarkt
                </h3>
              </div>
              <ul className="space-y-2">
                {recept.vanSupermarkt.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-snug opacity-75"
                    style={{ color: "var(--charcoal)" }}
                  >
                    · {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Moeilijkheid */}
            <div className="p-4" style={{ backgroundColor: "white" }}>
              <div
                className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: moeilijkheidColor }}
              >
                {recept.moeilijkheid}
              </div>
              <p className="text-xs opacity-60" style={{ color: "var(--charcoal)" }}>
                {recept.moeilijkheid === "Makkelijk"
                  ? "Perfect voor doordeweeks"
                  : recept.moeilijkheid === "Gemiddeld"
                  ? "Met een beetje oefening"
                  : "Voor de echte liefhebber"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* More recipes */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-12 px-6 text-center">
        <Link
          href={`/${locale}/recepten`}
          className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
          style={{ color: "var(--sand)" }}
        >
          <ArrowLeft size={15} />
          Meer recepten van Schaap&apos;s Vis
        </Link>
      </section>
    </>
  );
}

export async function generateStaticParams() {
  return recepten.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recept = recepten.find((r) => r.slug === slug);
  if (!recept) return {};

  return {
    title: `${recept.title} | Recepten Schaap's Vis Leiden`,
    description: `${recept.verhaal.slice(0, 155)}...`,
    keywords: recept.seoKeywords,
    openGraph: {
      title: `${recept.title} | Schaap's Vis Leiden`,
      description: recept.subtitle,
      type: "article",
    },
  };
}

export default async function ReceptDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const recept = recepten.find((r) => r.slug === slug);
  if (!recept) notFound();

  return <ReceptDetailWrapper recept={recept} />;
}

function ReceptDetailWrapper({ recept }: { recept: Recept }) {
  const locale = useLocale();
  return <ReceptDetailContent recept={recept} locale={locale} />;
}
