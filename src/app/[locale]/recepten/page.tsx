import Link from "next/link";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Clock, ShoppingBag, ShoppingCart } from "lucide-react";
import { PhotoPlaceholder } from "@/components/shared/PhotoPlaceholder";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("receptenTitle"),
    description: t("receptenDesc"),
    alternates: {
      canonical: `/${locale}/recepten`,
      languages: {
        nl: "/nl/recepten",
        en: "/en/recepten",
        de: "/de/recepten",
      },
    },
    openGraph: {
      title: t("receptenTitle"),
      description: t("receptenDesc"),
      locale,
      type: "website",
    },
  };
}

type Recept = {
  slug: string;
  title: string;
  subtitle: string;
  tijd: string;
  moeilijkheid: "Makkelijk" | "Gemiddeld" | "Uitdagend";
  fotoLabel: string;
  vanSchaap: string[];
  vanSupermarkt: string[];
  bereidingswijze: string[];
  verhaal: string;
  tag?: string;
};

const recepten: Recept[] = [
  {
    slug: "zalm-citroen-dille",
    title: "Zalm in de oven met citroen en dille",
    subtitle: "Simpel, snel en verrassend lekker",
    tijd: "20 min",
    moeilijkheid: "Makkelijk",
    fotoLabel:
      "FOTO TOEVOEGEN: Garen zalmfilet op bakplaat met citroen en dille, goudbruin",
    vanSchaap: ["Varlaks zalmfilet (ca. 150-200g per persoon)"],
    vanSupermarkt: [
      "1 citroen",
      "Verse dille",
      "Olijfolie",
      "Zout en peper",
      "Optioneel: knoflook, kappertjes",
    ],
    bereidingswijze: [
      "Verwarm de oven voor op 200°C.",
      "Leg de zalmfilet op een stuk bakpapier op de bakplaat.",
      "Besprenkel royaal met olijfolie en bestrooi met zout en peper.",
      "Leg schijfjes citroen op de zalm en strooi verse dille erover.",
      "Bak 12–15 minuten, afhankelijk van de dikte. De zalm is klaar als hij makkelijk uiteen valt met een vork.",
      "Serveer direct met gekookte aardappelen of rijst.",
    ],
    verhaal:
      "Dit is het ideale doordeweekse visgerecht. De Varlaks zalm heeft zo'n rijke smaak dat er eigenlijk weinig bij nodig is. Citroen en dille versterken het zonder te overheersen. Aldert's advies: laat de zalm niet te lang in de oven — iets rosé van binnen is perfect.",
    tag: "Varlaks special",
  },
  {
    slug: "kibbeling-knoflooksaus",
    title: "Kibbeling met zelfgemaakte knoflooksaus",
    subtitle: "De Hollandse klassieker, thuis gemaakt",
    tijd: "30 min",
    moeilijkheid: "Gemiddeld",
    fotoLabel:
      "FOTO TOEVOEGEN: Verse kibbeling op een bord met knoflooksaus en citroenpartje",
    vanSchaap: ["500g kibbeling (kant-en-klaar in beslag)"],
    vanSupermarkt: [
      "Frituurolie of zonnebloemolie",
      "Voor de saus: mayonaise, knoflook, citroen, peterselie",
      "Optioneel: friet of stokbrood erbij",
    ],
    bereidingswijze: [
      "Maak eerst de saus: meng 3 eetlepels mayonaise met 1 geperst teentje knoflook, een scheutje citroensap en gehakte peterselie. Zet in de koelkast.",
      "Verhit olie in een pan tot 180°C.",
      "Frituur de kibbeling in kleine porties: 3–4 minuten totdat ze goudbruin zijn.",
      "Laat uitlekken op keukenpapier.",
      "Serveer direct met de saus en een schijfje citroen.",
    ],
    verhaal:
      "Kibbeling is onze absolute bestseller — elke dag vers gebakken. Maar wist u dat u kibbeling ook gewoon thuis kunt frituren? Haal het rauwe beslag bij ons op, en in 30 minuten staat er een echte Hollandse lekkernij op tafel.",
    tag: "Populairste gerecht",
  },
  {
    slug: "gravlaks",
    title: "Gravlaks van Varlaks zalm",
    subtitle: "Nordisch recept — minstens 48 uur, maar elke minuut waard",
    tijd: "48 uur (+ 15 min bereiding)",
    moeilijkheid: "Uitdagend",
    fotoLabel:
      "FOTO TOEVOEGEN: Dunne plakjes gravlaks op brood met roomkaas, rode ui en dille",
    vanSchaap: [
      "Hele zalmfilet Varlaks (500–800g, met vel, zonder graten)",
    ],
    vanSupermarkt: [
      "200g grof zeezout",
      "150g suiker",
      "Verse dille (1 grote bos)",
      "1 eetlepel grofgemalen zwarte peper",
      "Optioneel: 2 el cognac of wodka",
      "Voor serveren: roggebrood, roomkaas, rode ui, citroen",
    ],
    bereidingswijze: [
      "Meng zout, suiker, peper en gehakte dille. Optioneel: voeg cognac toe.",
      "Leg de zalm met de velzijde naar beneden op een stuk vershoudfolie.",
      "Dek de zalm volledig af met het kruidenmengsel.",
      "Vouw de folie strak dicht en leg in een schaal. Zet een gewicht erop (bijv. een snijplank met blikjes).",
      "Zet 48 uur in de koelkast. Keer halverwege om.",
      "Na 48 uur: spoel de marinade af en dep droog. Snijd in dunne plakjes met een scherp mes.",
      "Serveer op roggebrood met roomkaas, rode ui en dille.",
    ],
    verhaal:
      "Gravlaks is een oud Scandinavisch recept waarbij zalm wordt 'gekookt' door het pekelen — geen hittebron nodig. Het resultaat is zijdezacht, vol van smaak en indrukwekkend als voorgerecht. Voor dit recept is kwaliteit essentieel: gebruik altijd verse Varlaks zalm van Schaap's Vis.",
    tag: "Bijzonder gerecht",
  },
  {
    slug: "haring-salade",
    title: "Haring met appel en rode ui",
    subtitle: "Fris, snel en klassiek Hollands",
    tijd: "15 min",
    moeilijkheid: "Makkelijk",
    fotoLabel:
      "FOTO TOEVOEGEN: Gehalveerde haring met appelstukjes en rode ui op een bord",
    vanSchaap: ["4 verse haringen (schoongemaakt en gefileerd)"],
    vanSupermarkt: [
      "1 zoetzure appel (bijv. Elstar)",
      "1 kleine rode ui",
      "2 el crème fraîche of zure room",
      "1 tl mosterd",
      "Verse bieslook of peterselie",
      "Zout en peper",
      "Optioneel: augurken",
    ],
    bereidingswijze: [
      "Snijd de haring in stukjes van 2–3 cm.",
      "Schil de appel en snijd in kleine blokjes. Snipper de rode ui fijn.",
      "Meng crème fraîche met mosterd, zout en peper.",
      "Voeg haring, appel, ui en kruiden toe.",
      "Laat 10 minuten in de koelkast staan.",
      "Serveer op roggebrood of als salade.",
    ],
    verhaal:
      "Verse haring is het paradepaardje van de Nederlandse vishandel. Rauw, puur, direct van zee. Dit recept combineert de zilte smaak van haring met de frisheid van appel — een klassieke combinatie die nooit verveelt. Haal de haring altijd op de dag zelf: hoe verser, hoe beter.",
  },
  {
    slug: "romige-vissoep",
    title: "Romige vissoep",
    subtitle: "Verwarmend, vol en vol vis",
    tijd: "45 min",
    moeilijkheid: "Gemiddeld",
    fotoLabel:
      "FOTO TOEVOEGEN: Dampende kom vissoep met verse kruiden en brood ernaast",
    vanSchaap: [
      "300g gemengde visfilet (bijv. kabeljauw + zalm)",
      "Optioneel: huisgemaakte vissoep als basis",
    ],
    vanSupermarkt: [
      "1 ui, 2 stengels bleekselderij, 2 wortelen",
      "1 blik gepelde tomaten",
      "200ml slagroom",
      "1L visbouillon",
      "1 dl droge witte wijn",
      "Verse peterselie, laurierblad",
      "Olijfolie, zout, peper",
      "Stokbrood of zuurdesembrood",
    ],
    bereidingswijze: [
      "Snijd ui, selderij en wortel fijn. Fruit ze 5 min in olijfolie.",
      "Voeg wijn toe en laat 2 min inkoken.",
      "Voeg bouillon, tomaten en laurier toe. Kook 15 min.",
      "Voeg de visfilet in stukken toe. Laat 8–10 min zachtjes garen.",
      "Roer de room erdoor en breng op smaak.",
      "Bestrooi met verse peterselie. Serveer met goed brood.",
    ],
    verhaal:
      "Niets gaat boven een zelfgemaakte vissoep op een koude dag. Vraag bij Schaap's Vis naar de dagverse visfilet — Aldert vertelt u welke vis die dag het lekkerst is. U kunt ook onze kant-en-klare vissoep meenemen als snelle basis.",
  },
  {
    slug: "gegrilde-schol",
    title: "Gegrilde scholfilet met groene kruiden",
    subtitle: "Licht, gezond en in 20 minuten klaar",
    tijd: "20 min",
    moeilijkheid: "Makkelijk",
    fotoLabel:
      "FOTO TOEVOEGEN: Gegrilde scholfilet met groene kruiden en citroen op bord",
    vanSchaap: ["Verse scholfilet (ca. 150g per persoon)"],
    vanSupermarkt: [
      "Boter of olijfolie",
      "Sap van 1 citroen",
      "Verse peterselie en bieslook",
      "Zout en peper",
      "Gekookte aardappelen of groene salade erbij",
    ],
    bereidingswijze: [
      "Dep de scholfilet droog met keukenpapier.",
      "Bestrooi aan beide zijden met zout en peper.",
      "Verhit boter in een koekenpan. Bak de schol 2–3 min per kant op middelhoog vuur.",
      "Voeg aan het einde citroensap en kruiden toe.",
      "Serveer direct — schol is op zijn lekkerst recht uit de pan.",
    ],
    verhaal:
      "Schol is een échte Hollandse platvis die veel te weinig thuis bereid wordt. Vers van Schaap's Vis, snel klaargemaakt en gezond. De dunne filet heeft nauwelijks bereidingstijd nodig — overkoken is de enige fout die u kunt maken.",
  },
];

function TijdBadge({ tijd, moeilijkheid }: { tijd: string; moeilijkheid: Recept["moeilijkheid"] }) {
  const color =
    moeilijkheid === "Makkelijk"
      ? "var(--seafoam)"
      : moeilijkheid === "Gemiddeld"
      ? "var(--gold)"
      : "var(--salmon)";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span
        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 text-white"
        style={{ backgroundColor: "var(--navy)" }}
      >
        <Clock size={12} />
        {tijd}
      </span>
      <span
        className="inline-block text-xs font-medium px-2.5 py-1 text-white"
        style={{ backgroundColor: color }}
      >
        {moeilijkheid}
      </span>
    </div>
  );
}

function ReceptCard({ recept, locale }: { recept: Recept; locale: string }) {
  return (
    <article
      className="group"
      style={{ backgroundColor: "white", border: "1px solid rgba(28,53,87,0.08)" }}
    >
      <div className="relative">
        <PhotoPlaceholder label={recept.fotoLabel} aspectRatio="aspect-[16/9]" />
        {recept.tag && (
          <span
            className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 text-white"
            style={{ backgroundColor: "var(--salmon)" }}
          >
            {recept.tag}
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="mb-3">
          <TijdBadge tijd={recept.tijd} moeilijkheid={recept.moeilijkheid} />
        </div>
        <h2
          className="text-xl font-bold mb-1 leading-tight"
          style={{ color: "var(--navy)", fontFamily: "Playfair Display, serif" }}
        >
          {recept.title}
        </h2>
        <p className="text-sm mb-4 opacity-60" style={{ color: "var(--charcoal)" }}>
          {recept.subtitle}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <ShoppingBag size={13} style={{ color: "var(--navy)" }} />
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--navy)" }}>
                Van Schaap&apos;s Vis
              </span>
            </div>
            <ul className="space-y-0.5">
              {recept.vanSchaap.map((item) => (
                <li key={item} className="text-xs opacity-70" style={{ color: "var(--charcoal)" }}>
                  · {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <ShoppingCart size={13} style={{ color: "var(--charcoal)" }} />
              <span className="text-xs font-bold uppercase tracking-wide opacity-60" style={{ color: "var(--charcoal)" }}>
                Van de supermarkt
              </span>
            </div>
            <ul className="space-y-0.5">
              {recept.vanSupermarkt.slice(0, 4).map((item) => (
                <li key={item} className="text-xs opacity-70" style={{ color: "var(--charcoal)" }}>
                  · {item}
                </li>
              ))}
              {recept.vanSupermarkt.length > 4 && (
                <li className="text-xs opacity-40 italic" style={{ color: "var(--charcoal)" }}>
                  + {recept.vanSupermarkt.length - 4} meer
                </li>
              )}
            </ul>
          </div>
        </div>

        <Link
          href={`/${locale}/recepten/${recept.slug}`}
          className="inline-block text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
          style={{ color: "var(--navy)" }}
        >
          Volledig recept lezen &rarr;
        </Link>
      </div>
    </article>
  );
}

function ReceptenContent() {
  const locale = useLocale();

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "var(--navy)" }} className="py-20 px-6 text-center">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-5 opacity-60"
          style={{ color: "var(--sand)" }}
        >
          Schaap&apos;s Vis · Recepten
        </p>
        <h1
          className="text-5xl md:text-6xl font-bold mb-5 leading-tight"
          style={{ color: "var(--cream)", fontFamily: "Playfair Display, serif" }}
        >
          Kook met verse vis
        </h1>
        <p
          className="text-lg max-w-xl mx-auto leading-relaxed"
          style={{ color: "rgba(247,240,227,0.75)" }}
        >
          Onze favoriete visgerechten — met vis van Schaap&apos;s Vis én een boodschappenlijstje voor de supermarkt.
        </p>
      </section>

      {/* Intro */}
      <section style={{ backgroundColor: "var(--cream)" }} className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="leading-relaxed text-base"
            style={{ color: "var(--charcoal)", opacity: 0.8 }}
          >
            Bij elk recept staat precies wat u bij ons haalt en wat u zelf nog nodig heeft. Zo staat u met gemak een heerlijk visgerecht op tafel — van een snelle zalm in de oven in 20 minuten tot een echte gravlaks die 48 uur marinades nodig heeft.
          </p>
          <div
            className="inline-flex items-center gap-3 mt-6 px-5 py-2.5 text-sm font-medium"
            style={{ backgroundColor: "var(--sand)", color: "var(--navy)" }}
          >
            <ShoppingBag size={15} />
            Haal uw vis vers bij Schaap&apos;s Vis — Herenstraat 48, Leiden
          </div>
        </div>
      </section>

      {/* Recipe grid */}
      <section style={{ backgroundColor: "var(--sand)" }} className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recepten.map((recept) => (
              <ReceptCard key={recept.slug} recept={recept} locale={locale} />
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
          Verse vis halen?
        </h2>
        <p
          className="text-sm mb-8 max-w-md mx-auto"
          style={{ color: "rgba(247,240,227,0.7)" }}
        >
          Herenstraat 48, Leiden · Maandag t/m zaterdag · 071 514 9802
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/bestellen`}
            className="inline-block text-white px-8 py-4 font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--salmon)" }}
          >
            Vooruit bestellen &rarr;
          </Link>
          <Link
            href={`/${locale}/bezoek-ons`}
            className="inline-block px-8 py-4 font-medium border transition-opacity hover:opacity-70"
            style={{ color: "var(--cream)", borderColor: "rgba(247,240,227,0.4)" }}
          >
            Route &amp; openingstijden
          </Link>
        </div>
      </section>
    </>
  );
}

export default async function ReceptenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <ReceptenContent />;
}
