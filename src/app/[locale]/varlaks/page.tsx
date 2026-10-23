import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { bestelContact } from "@/lib/bestel-contact";
import { VarlaksFilm } from "@/components/shared/VarlaksFilm";
import { Schema } from "@/components/Schema";

const translations = {
  nl: {
    title: "VÅRLAKS-zalm: zalm uit Noord-Noorwegen",
    intro: "Onze zalm komt van VÅRLAKS. We vertellen u graag wat de leverancier deelt over de herkomst, de kwekersfamilies en de reis van ei tot filet.",
    eyebrow: "Onze zalm · Schaap’s Vishandel Leiden",
    storyTitle: "Een zalm met een herkomstverhaal",
    story: "VÅRLAKS werkt met familiebedrijven in Noord-Noorwegen, boven de poolcirkel. De leverancier beschrijft de zalm als volledig traceerbaar van ei tot eindproduct. Dat verhaal en de smaak zijn waarom wij deze zalm graag in onze toonbank leggen.",
    distinction: "VÅRLAKS vermeldt dat de zalm ASC-gecertificeerd is. ASC staat voor verantwoorde aquacultuur; het is niet hetzelfde als het biologische keurmerk. We vertellen u graag meer over de herkomst en de kweek.",
    journey: "Van kwekerij tot aan tafel",
    farm: "Familiebedrijven in Noord-Noorwegen",
    farmText: "VÅRLAKS vertelt over kwekersfamilies en zalmkweek in de koude wateren boven de poolcirkel.",
    fillet: "Van ei tot filet",
    filletText: "De leverancier beschrijft de keten als traceerbaar van ei tot eindproduct.",
    serving: "Een idee voor thuis",
    servingText: "Zalm uit de oven met citroen, dille en seizoensgroenten. Een eenvoudige bereiding waarbij de zalm centraal staat.",
    images: "Kwekerij- en productbeelden: VÅRLAKS. Serveersuggestie: Schaap’s Vishandel.",
    source: "Lees het verhaal van VÅRLAKS",
    films: "Bekijk de film van de leverancier",
    product: "Bekijk onze VÅRLAKS-zalm",
    recipe: "Bekijk een zalmrecept",
    ask: "Vraag naar de zalm in de winkel",
    availability: "We hebben VÅRLAKS-zalm regelmatig in de winkel. Wilt u weten of er vandaag zalm ligt, of zoekt u een specifieke snit? Stuur ons gerust een WhatsApp-bericht.",
    sources: "Meer lezen over VÅRLAKS",
    source1: "VÅRLAKS: herkomst en werkwijze",
    source2: "Over VÅRLAKS en de samenwerking met PLUS",
    source3: "PLUS over zalmkwaliteit en certificering",
    source4: "VÅRLAKS-folder (PDF)",
    source5: "VÅRLAKS over herkomst en ASC-certificering",
    labels: "BIO, ASC en GlobalG.A.P. zijn niet hetzelfde",
    labelsText: "VÅRLAKS vermeldt ASC-certificering voor zijn zalm. ASC gaat over verantwoorde aquacultuur en is niet hetzelfde als biologisch. Een biologisch keurmerk gebruiken we alleen voor producten die daarvoor gecertificeerd zijn.",
    altFarm: "Medewerker bij een zalmkweeknet in Noord-Noorwegen, beeld van VÅRLAKS",
    altPack: "VÅRLAKS-zalmfilets in een transportbak",
    altDish: "Ovengebakken zalm met citroen, dille en groenten, serveersuggestie",
    heroAlt: "Rauwe VÅRLAKS-zalmfilet met citroen en dille",
  },
  en: {
    title: "VÅRLAKS salmon: salmon from Northern Norway",
    intro: "Our salmon comes from VÅRLAKS. We are happy to share what the supplier says about its origin, farming families and journey from egg to fillet.",
    eyebrow: "Our salmon · Schaap’s Fishmonger Leiden",
    storyTitle: "Salmon with a story of origin",
    story: "VÅRLAKS works with family businesses in Northern Norway, above the Arctic Circle. The supplier describes its salmon as traceable from egg to finished product. That story and its flavour are why we like to have this salmon at our counter.",
    distinction: "VÅRLAKS states that its salmon is ASC-certified. ASC concerns responsible aquaculture; it is not the same as organic certification. We are happy to tell you more about the salmon’s origin and farming.",
    journey: "From farm to table",
    farm: "Family businesses in Northern Norway",
    farmText: "VÅRLAKS describes salmon farms run by families in the cold waters above the Arctic Circle.",
    fillet: "From egg to fillet",
    filletText: "The supplier describes its chain as traceable from egg to finished product.",
    serving: "An idea for home",
    servingText: "Oven-baked salmon with lemon, dill and seasonal vegetables. A simple preparation that lets the salmon take centre stage.",
    images: "Farm and product images: VÅRLAKS. Serving suggestion: Schaap’s Vishandel.",
    source: "Read VÅRLAKS’ story",
    films: "Watch the supplier’s film",
    product: "Explore our VÅRLAKS salmon",
    recipe: "Explore a salmon recipe",
    ask: "Ask us about the salmon",
    availability: "We regularly have VÅRLAKS salmon in store. Want to know what is available today or looking for a particular cut? Send us a WhatsApp message.",
    sources: "Read more about VÅRLAKS",
    source1: "VÅRLAKS: origin and approach",
    source2: "VÅRLAKS and its partnership with PLUS",
    source3: "PLUS on salmon quality and certification",
    source4: "VÅRLAKS brochure (PDF)",
    source5: "VÅRLAKS on origin and ASC certification",
    labels: "BIO, ASC and GlobalG.A.P. are different",
    labelsText: "VÅRLAKS states that its salmon is ASC-certified. ASC concerns responsible aquaculture and is not the same as organic certification. We use ‘organic’ only for products certified under organic rules.",
    altFarm: "Worker beside a salmon farm net pen in Northern Norway, image by VÅRLAKS",
    altPack: "VÅRLAKS salmon fillets in a transport box",
    altDish: "Oven-baked salmon with lemon, dill and vegetables, serving suggestion",
    heroAlt: "Raw VÅRLAKS salmon fillet with lemon and dill",
  },
  de: {
    title: "VÅRLAKS-Lachs aus Nordnorwegen",
    intro: "Unser Lachs stammt von VÅRLAKS. Gern erzählen wir, was der Lieferant über Herkunft, Familienbetriebe und den Weg vom Ei bis zum Filet berichtet.",
    eyebrow: "Unser Lachs · Schaap’s Vishandel Leiden",
    storyTitle: "Lachs mit einer Herkunftsgeschichte",
    story: "VÅRLAKS arbeitet mit Familienbetrieben in Nordnorwegen oberhalb des Polarkreises. Der Anbieter beschreibt seinen Lachs als vom Ei bis zum Endprodukt rückverfolgbar. Diese Geschichte und der Geschmack sind Gründe, warum wir diesen Lachs gern in unserer Fischtheke anbieten.",
    distinction: "VÅRLAKS gibt an, dass sein Lachs ASC-zertifiziert ist. ASC steht für verantwortungsvolle Aquakultur und ist nicht dasselbe wie eine Bio-Zertifizierung. Gern erzählen wir mehr über Herkunft und Aufzucht.",
    journey: "Von der Farm bis auf den Tisch",
    farm: "Familienbetriebe in Nordnorwegen",
    farmText: "VÅRLAKS berichtet über Familienbetriebe und Lachszucht in den kalten Gewässern oberhalb des Polarkreises.",
    fillet: "Vom Ei bis zum Filet",
    filletText: "Der Lieferant beschreibt die Lieferkette als vom Ei bis zum Endprodukt rückverfolgbar.",
    serving: "Eine Idee für zu Hause",
    servingText: "Ofenlachs mit Zitrone, Dill und saisonalem Gemüse. Eine einfache Zubereitung, bei der der Lachs im Mittelpunkt steht.",
    images: "Farm- und Produktbilder: VÅRLAKS. Serviervorschlag: Schaap’s Vishandel.",
    source: "Die Geschichte von VÅRLAKS lesen",
    films: "Film des Lieferanten ansehen",
    product: "Unseren VÅRLAKS-Lachs ansehen",
    recipe: "Ein Lachsrezept ansehen",
    ask: "In der Fischtheke nachfragen",
    availability: "VÅRLAKS-Lachs haben wir regelmäßig im Geschäft. Möchten Sie wissen, was heute verfügbar ist, oder suchen Sie einen bestimmten Zuschnitt? Schreiben Sie uns per WhatsApp.",
    sources: "Mehr über VÅRLAKS lesen",
    source1: "VÅRLAKS: Herkunft und Arbeitsweise",
    source2: "VÅRLAKS und die Zusammenarbeit mit PLUS",
    source3: "PLUS zu Lachsqualität und Zertifizierung",
    source4: "VÅRLAKS-Broschüre (PDF)",
    source5: "VÅRLAKS zu Herkunft und ASC-Zertifizierung",
    labels: "BIO, ASC und GlobalG.A.P. sind nicht dasselbe",
    labelsText: "VÅRLAKS gibt für seinen Lachs eine ASC-Zertifizierung an. ASC steht für verantwortungsvolle Aquakultur und ist nicht dasselbe wie Bio. Als biologisch bezeichnen wir nur Produkte mit entsprechender Zertifizierung.",
    altFarm: "Mitarbeiter an einem Lachszuchtnetz in Nordnorwegen, Bild von VÅRLAKS",
    altPack: "VÅRLAKS-Lachsfilets in einer Transportbox",
    altDish: "Ofenlachs mit Zitrone, Dill und Gemüse, Serviervorschlag",
    heroAlt: "Rohes VÅRLAKS-Lachsfilet mit Zitrone und Dill",
  },
} as const;

type Locale = keyof typeof translations;
const sources = [
  ["https://www.freshlyfish.nl/onze-vissers/varlaks-johannes-korf/", "source1"],
  ["https://urkseafood.nl/blog/nieuws/varlaks-en-plus-bundelen-krachten-voor-premium-zalm-van-topkwaliteit/", "source2"],
  ["https://www.plus.nl/goed-eten/kwaliteit/duurzame-zalm", "source3"],
  ["https://dijkshoornvisspecialiteiten.nl/wp-content/uploads/2021/12/varlaks-flyer-nederlands.pdf", "source4"],
  ["https://varlaks.no/retail/", "source5"],
] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = translations[locale as Locale] ?? translations.nl;
  return paginaMetadata({ locale, pad: "/varlaks", title: `${c.title} | Schaap’s Vishandel`, description: c.intro, image: "/images/varlaks/from-egg-to-plate-3.jpg.webp" });
}

export default async function VarlaksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = (locale in translations ? locale : "nl") as Locale;
  const c = translations[lang];
  const ask = bestelContact(lang, lang === "de" ? "VÅRLAKS-Lachs" : lang === "en" ? "VÅRLAKS salmon" : "VÅRLAKS-zalm");
  const cards = [
    { image: "from-egg-to-plate-2.jpg.webp", title: c.farm, text: c.farmText, alt: c.altFarm, generated: false },
    { image: "from-egg-to-plate-3.jpg.webp", title: c.fillet, text: c.filletText, alt: c.altPack, generated: false },
    { image: "../editorial/varlaks-zalm-serveersuggestie-ai.png", title: c.serving, text: c.servingText, alt: c.altDish, generated: true },
  ];

  return <>
    <Schema data={kruimelSchema(lang, [{ naam: BEDRIJF.naamKort, pad: "/" }, { naam: "VÅRLAKS", pad: "/varlaks" }])} />
    <header className="fresh-hero"><div className="section-wrap fresh-hero-grid">
      <div><p className="kapitaal">{c.eyebrow}</p><h1>{c.title}</h1><p className="fresh-intro">{c.intro}</p><div className="mt-7 flex flex-wrap gap-3"><Link className="knop knop-navy" href={`/${lang}/assortiment/varlaks-zalm`}>{c.product}</Link><a className="knop knop-lijn" href={ask.href}>{c.ask}</a></div></div>
      <figure className="overflow-hidden rounded-2xl"><Image src="/images/editorial/varlaks-zalm-rauw-ai.webp" alt={c.heroAlt} width={1400} height={1050} sizes="(max-width: 800px) 100vw, 50vw" className="w-full aspect-[4/3] object-cover" fetchPriority="high" /><figcaption className="bg-white px-4 py-3 text-sm text-slate-600">{c.heroAlt}</figcaption></figure>
    </div></header>
    <section className="story-section section-wrap"><div className="story-grid"><div><p className="kapitaal">VÅRLAKS · {lang === "nl" ? "Noord-Noorwegen" : lang === "de" ? "Nordnorwegen" : "Northern Norway"}</p><h2>{c.storyTitle}</h2><p>{c.story}</p><p className="mt-5 rounded-xl border border-sky-200 bg-sky-50 p-5 leading-relaxed">{c.distinction}</p><a className="mt-5 inline-block underline font-semibold" href="https://varlaks.no/retail/" target="_blank" rel="noopener noreferrer">{c.source} ↗</a></div><div><p className="kapitaal mb-3">{c.films}</p><VarlaksFilm locale={lang} /></div></div></section>
    <section className="section-wrap py-16 md:py-20"><div className="mb-8"><p className="kapitaal">{c.eyebrow}</p><h2 className="text-3xl md:text-4xl">{c.journey}</h2></div><div className="grid gap-6 md:grid-cols-3">{cards.map((card) => <article key={card.title} className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm"><Image src={card.generated ? "/images/editorial/varlaks-zalm-serveersuggestie-ai.png" : `/images/varlaks/${card.image}`} alt={card.alt} width={1200} height={800} sizes="(max-width: 768px) 100vw, 33vw" className="aspect-[4/3] w-full object-cover" /><div className="p-5"><h3 className="mb-2 text-xl">{card.title}</h3><p className="leading-relaxed">{card.text}</p></div></article>)}</div><p className="mt-4 text-sm text-slate-600">{c.images}</p></section>
    <section className="fresh-contact"><div className="section-wrap grid gap-10 lg:grid-cols-[1fr_0.8fr]"><div><p className="kapitaal">{c.sources}</p><h2 className="mb-5">{c.labels}</h2><p className="max-w-3xl leading-relaxed">{c.labelsText}</p></div><ul className="divide-y divide-sky-200 border-y border-sky-200">{sources.map(([url, key]) => <li key={url}><a className="block py-4 font-semibold underline" href={url} target="_blank" rel="noopener noreferrer">{c[key]} ↗</a></li>)}</ul></div></section>
    <section className="story-section section-wrap"><div className="grid items-center gap-10 lg:grid-cols-2"><div><p className="kapitaal">{c.availability.split(".")[0]}</p><h2>{c.product}</h2><p className="mt-3 max-w-xl leading-relaxed">{c.availability}</p><div className="mt-6 flex flex-wrap gap-3"><Link className="knop knop-navy" href={`/${lang}/assortiment/varlaks-zalm`}>{c.product} →</Link><Link className="knop knop-lijn" href={`/${lang}/recepten/zalm-citroen-dille`}>{c.recipe} →</Link></div></div><div className="overflow-hidden rounded-2xl"><Image src="/images/editorial/varlaks-zalm-serveersuggestie-ai.png" alt={c.altDish} width={1536} height={1024} sizes="(max-width: 800px) 100vw, 50vw" className="aspect-[4/3] w-full object-cover" /></div></div></section>
  </>;
}

