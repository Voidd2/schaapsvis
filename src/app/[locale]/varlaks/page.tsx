import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { paginaMetadata, kruimelSchema } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { bestelContact } from "@/lib/bestel-contact";
import { VarlaksFilm } from "@/components/shared/VarlaksFilm";
import { VarlaksLocations } from "@/components/shared/VarlaksLocations";
import { Schema } from "@/components/Schema";

const translations = {
  nl: {
    title: "VÅRLAKS-zalm in Leiden | Herkomst & bereiding",
    headline: "Uit het hoge noorden.\nBij ons in Leiden.",
    intro: "Al sinds 1938 helpen we Leidenaren aan goede vis. Ontdek onze VÅRLAKS-zalm uit Noord-Noorwegen, met een verhaal over de herkomst en persoonlijk advies aan de toonbank.",
    eyebrow: "Schaap’s Vishandel · Leiden sinds 1938",
    nearby: "Herenstraat · Botermarkt · Aalmarkt bij de Waag",
    storyTitle: "Vertrouwd in Leiden. Met oog voor morgen.",
    mission: "Wij willen dat u niet alleen een mooie filet ziet, maar ook weet waar uw vis vandaan komt. Daarom geven we het verhaal achter onze zalm een plek naast ons advies over smaak, porties en bereiding. Zo willen we, als Leidse vishandel sinds 1938, helpen om bewuster vis te kiezen.",
    story: "VÅRLAKS werkt met familiebedrijven in Noord-Noorwegen, boven de poolcirkel. De leverancier beschrijft de zalm als volledig traceerbaar van ei tot eindproduct. Dat verhaal en de smaak zijn waarom wij deze zalm graag in onze toonbank leggen.",
    journey: "Van kwekerij tot aan tafel",
    farm: "Familiebedrijven in Noord-Noorwegen",
    farmText: "VÅRLAKS vertelt over kwekersfamilies en zalmkweek in de koude wateren boven de poolcirkel.",
    fillet: "Van ei tot filet",
    filletText: "De leverancier beschrijft de keten als traceerbaar van ei tot eindproduct.",
    serving: "Een idee voor thuis",
    servingText: "Zalm uit de oven met citroen, dille en seizoensgroenten. Een eenvoudige bereiding waarbij de zalm centraal staat.",
    images: "Herkomst- en productfoto’s: VÅRLAKS.",
    illustration: "Sfeerbeeld · AI-illustratie van zalm",
    servingCaption: "Serveersuggestie · AI-illustratie",
    source: "Lees het verhaal van VÅRLAKS",
    films: "Bekijk de film van de leverancier",
    product: "Bekijk onze VÅRLAKS-zalm",
    recipe: "Bekijk een zalmrecept",
    ask: "Vraag ons om advies",
    visit: "Bekijk onze Leidse locaties",
    local: "Persoonlijk advies aan de toonbank",
    localText: "Over de hoeveelheid, het snijden en de bereiding.",
    availability: "VÅRLAKS-zalm hoort bij ons vaste assortiment. Kom langs aan de Herenstraat of vraag ons om advies over de hoeveelheid en bereiding. Voor een groter gezelschap of een specifieke snit bespreken we graag uw wensen.",
    contactTitle: "Welke zalm past bij uw plannen?",
    contactNote: "Een vraag via WhatsApp is vrijblijvend. Een eventuele bestelling spreken we persoonlijk met u af.",
    questions: "Veelgestelde vragen over onze zalm",
    organicQuestion: "Is VÅRLAKS-zalm biologisch?",
    organicAnswer: "VÅRLAKS noemt op de eigen website ASC-certificering. ASC is geen biologisch keurmerk. We hebben geen bevestiging van biologische certificering voor onze VÅRLAKS-zalm en bieden deze daarom niet als biologische zalm aan. Vraag in de winkel gerust naar het etiket en de herkomst.",
    preparationQuestion: "Hoe kan ik de zalm bereiden?",
    preparationAnswer: "Zalm leent zich goed voor de pan en de oven. Citroen en dille zijn een mooie combinatie. Bekijk ons recept of vertel ons wat u wilt maken; dan adviseren we over een passende portie en bereiding.",
    orderQuestion: "Kan ik zalm voor een diner aanvragen?",
    orderAnswer: "Ja, vertel ons voor hoeveel personen u kookt, welke snit u zoekt en wanneer u wilt afhalen. We bespreken de mogelijkheden, hoeveelheid en prijs voordat u een bestelling bevestigt.",
    sources: "Meer lezen over VÅRLAKS",
    source1: "VÅRLAKS: herkomst en werkwijze",
    source2: "Over VÅRLAKS en de samenwerking met PLUS",
    source3: "PLUS over zalmkwaliteit en certificering",
    source4: "VÅRLAKS-folder (PDF)",
    source5: "VÅRLAKS over herkomst en ASC-certificering",
    altFarm: "Medewerker bij een zalmkweeknet in Noord-Noorwegen, beeld van VÅRLAKS",
    altPack: "VÅRLAKS-zalmfilets in een transportbak",
    altDish: "Ovengebakken zalm met citroen, dille en groenten, serveersuggestie",
    heroAlt: "Sfeerillustratie van een zalmfilet met citroen en dille",
  },
  en: {
    title: "VÅRLAKS salmon in Leiden | Origin & cooking",
    headline: "From the far north.\nHere in Leiden.",
    intro: "Helping people in Leiden choose good fish since 1938. Discover our VÅRLAKS salmon from Northern Norway, with a story about its origin and personal advice at the counter.",
    eyebrow: "Schaap’s Vishandel · In Leiden since 1938",
    nearby: "Herenstraat · Botermarkt · Aalmarkt by De Waag",
    storyTitle: "At home in Leiden. Looking ahead.",
    mission: "We want you to see more than a lovely fillet: we want you to know where your fish comes from. That is why we share the story behind our salmon alongside advice on flavour, portions and cooking. As a Leiden fishmonger since 1938, we want to help people make more informed choices about fish.",
    story: "VÅRLAKS works with family businesses in Northern Norway, above the Arctic Circle. The supplier describes its salmon as traceable from egg to finished product. That story and its flavour are why we like to have this salmon at our counter.",
    journey: "From farm to table",
    farm: "Family businesses in Northern Norway",
    farmText: "VÅRLAKS describes salmon farms run by families in the cold waters above the Arctic Circle.",
    fillet: "From egg to fillet",
    filletText: "The supplier describes its chain as traceable from egg to finished product.",
    serving: "An idea for home",
    servingText: "Oven-baked salmon with lemon, dill and seasonal vegetables. A simple preparation that lets the salmon take centre stage.",
    images: "Farm and product photography: VÅRLAKS.",
    illustration: "Mood image · AI illustration of salmon",
    servingCaption: "Serving suggestion · AI illustration",
    source: "Read VÅRLAKS’ story",
    films: "Watch the supplier’s film",
    product: "Explore our VÅRLAKS salmon",
    recipe: "Explore a salmon recipe",
    ask: "Ask us for advice",
    visit: "Find our Leiden locations",
    local: "Personal advice at the counter",
    localText: "On portions, cuts and cooking.",
    availability: "VÅRLAKS salmon is part of our regular range. Visit us on Herenstraat or ask us for advice on portions and cooking. For a larger gathering or a particular cut, we are happy to discuss your wishes.",
    contactTitle: "What are you planning to cook?",
    contactNote: "A WhatsApp enquiry carries no obligation. We confirm any order with you personally.",
    questions: "Questions about our salmon",
    organicQuestion: "Is VÅRLAKS salmon organic?",
    organicAnswer: "VÅRLAKS states ASC certification on its website. ASC is not an organic certification. We have no confirmation of organic certification for our VÅRLAKS salmon, so we do not offer it as organic salmon. Feel free to ask us about the label and origin in store.",
    preparationQuestion: "How can I cook the salmon?",
    preparationAnswer: "Salmon works well in a pan or in the oven. Lemon and dill make a lovely pairing. Explore our recipe or tell us what you are cooking; we can advise on portions and preparation.",
    orderQuestion: "Can I enquire about salmon for a dinner party?",
    orderAnswer: "Yes. Tell us how many people you are cooking for, the cut you would like and your preferred collection date. We discuss the options, quantity and price before you confirm an order.",
    sources: "Read more about VÅRLAKS",
    source1: "VÅRLAKS: origin and approach",
    source2: "VÅRLAKS and its partnership with PLUS",
    source3: "PLUS on salmon quality and certification",
    source4: "VÅRLAKS brochure (PDF)",
    source5: "VÅRLAKS on origin and ASC certification",
    altFarm: "Worker beside a salmon farm net pen in Northern Norway, image by VÅRLAKS",
    altPack: "VÅRLAKS salmon fillets in a transport box",
    altDish: "Oven-baked salmon with lemon, dill and vegetables, serving suggestion",
    heroAlt: "Illustration of a salmon fillet with lemon and dill",
  },
  de: {
    title: "VÅRLAKS-Lachs in Leiden | Herkunft & Zubereitung",
    headline: "Aus dem hohen Norden.\nBei uns in Leiden.",
    intro: "Seit 1938 helfen wir den Menschen in Leiden, guten Fisch auszuwählen. Entdecken Sie unseren VÅRLAKS-Lachs aus Nordnorwegen mit seiner Herkunftsgeschichte und persönlicher Beratung an der Fischtheke.",
    eyebrow: "Schaap’s Vishandel · In Leiden seit 1938",
    nearby: "Herenstraat · Botermarkt · Aalmarkt bei De Waag",
    storyTitle: "In Leiden verwurzelt. Den Blick nach vorn.",
    mission: "Wir möchten, dass Sie nicht nur ein schönes Filet sehen, sondern auch wissen, woher Ihr Fisch kommt. Deshalb erzählen wir die Geschichte unseres Lachses und beraten zu Geschmack, Portionen und Zubereitung. Als Leidener Fischgeschäft seit 1938 möchten wir so eine bewusstere Auswahl von Fisch ermöglichen.",
    story: "VÅRLAKS arbeitet mit Familienbetrieben in Nordnorwegen oberhalb des Polarkreises. Der Anbieter beschreibt seinen Lachs als vom Ei bis zum Endprodukt rückverfolgbar. Diese Geschichte und der Geschmack sind Gründe, warum wir diesen Lachs gern in unserer Fischtheke anbieten.",
    journey: "Von der Farm bis auf den Tisch",
    farm: "Familienbetriebe in Nordnorwegen",
    farmText: "VÅRLAKS berichtet über Familienbetriebe und Lachszucht in den kalten Gewässern oberhalb des Polarkreises.",
    fillet: "Vom Ei bis zum Filet",
    filletText: "Der Lieferant beschreibt die Lieferkette als vom Ei bis zum Endprodukt rückverfolgbar.",
    serving: "Eine Idee für zu Hause",
    servingText: "Ofenlachs mit Zitrone, Dill und saisonalem Gemüse. Eine einfache Zubereitung, bei der der Lachs im Mittelpunkt steht.",
    images: "Herkunfts- und Produktfotos: VÅRLAKS.",
    illustration: "Stimmungsbild · KI-Illustration von Lachs",
    servingCaption: "Serviervorschlag · KI-Illustration",
    source: "Die Geschichte von VÅRLAKS lesen",
    films: "Film des Lieferanten ansehen",
    product: "Unseren VÅRLAKS-Lachs ansehen",
    recipe: "Ein Lachsrezept ansehen",
    ask: "Lassen Sie sich beraten",
    visit: "Unsere Standorte in Leiden",
    local: "Persönliche Beratung an der Fischtheke",
    localText: "Zu Mengen, Zuschnitten und Zubereitung.",
    availability: "VÅRLAKS-Lachs gehört zu unserem festen Sortiment. Besuchen Sie uns in der Herenstraat oder fragen Sie nach Mengen und Zubereitung. Für größere Gesellschaften oder einen bestimmten Zuschnitt besprechen wir gern Ihre Wünsche.",
    contactTitle: "Welcher Lachs passt zu Ihren Plänen?",
    contactNote: "Eine WhatsApp-Anfrage ist unverbindlich. Eine Bestellung stimmen wir persönlich mit Ihnen ab.",
    questions: "Häufige Fragen zu unserem Lachs",
    organicQuestion: "Ist VÅRLAKS-Lachs biologisch?",
    organicAnswer: "VÅRLAKS nennt auf seiner Website eine ASC-Zertifizierung. ASC ist kein Bio-Siegel. Für unseren VÅRLAKS-Lachs liegt uns keine Bestätigung einer Bio-Zertifizierung vor; deshalb bieten wir ihn nicht als Bio-Lachs an. Fragen Sie uns im Geschäft gern nach dem Etikett und der Herkunft.",
    preparationQuestion: "Wie kann ich den Lachs zubereiten?",
    preparationAnswer: "Lachs eignet sich gut für Pfanne und Ofen. Zitrone und Dill passen wunderbar dazu. Entdecken Sie unser Rezept oder erzählen Sie uns, was Sie kochen möchten. Wir beraten Sie zu Portionen und Zubereitung.",
    orderQuestion: "Kann ich Lachs für ein Abendessen anfragen?",
    orderAnswer: "Ja. Nennen Sie uns die Personenzahl, den gewünschten Zuschnitt und Ihren bevorzugten Abholtermin. Wir besprechen Möglichkeiten, Menge und Preis, bevor Sie die Bestellung bestätigen.",
    sources: "Mehr über VÅRLAKS lesen",
    source1: "VÅRLAKS: Herkunft und Arbeitsweise",
    source2: "VÅRLAKS und die Zusammenarbeit mit PLUS",
    source3: "PLUS zu Lachsqualität und Zertifizierung",
    source4: "VÅRLAKS-Broschüre (PDF)",
    source5: "VÅRLAKS zu Herkunft und ASC-Zertifizierung",
    altFarm: "Mitarbeiter an einem Lachszuchtnetz in Nordnorwegen, Bild von VÅRLAKS",
    altPack: "VÅRLAKS-Lachsfilets in einer Transportbox",
    altDish: "Ofenlachs mit Zitrone, Dill und Gemüse, Serviervorschlag",
    heroAlt: "Illustration eines Lachsfilets mit Zitrone und Dill",
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
    { image: "from-egg-to-plate-2.jpg.webp", title: c.farm, text: c.farmText, alt: c.altFarm },
    { image: "from-egg-to-plate-3.jpg.webp", title: c.fillet, text: c.filletText, alt: c.altPack },
  ];

  const facts = [[c.farm, c.farmText], [c.fillet, c.filletText], [c.local, c.localText]];
  const questions = [[c.organicQuestion, c.organicAnswer], [c.preparationQuestion, c.preparationAnswer], [c.orderQuestion, c.orderAnswer]];

  return <div className="varlaks-page">
    <Schema data={kruimelSchema(lang, [{ naam: BEDRIJF.naamKort, pad: "/" }, { naam: "VÅRLAKS", pad: "/varlaks" }])} />
    <header className="varlaks-hero">
      <div className="section-wrap varlaks-split">
        <div>
          <p className="kapitaal">{c.eyebrow}</p>
          <h1><span className="varlaks-wordmark">VÅRLAKS</span><span className="varlaks-headline">{c.headline}</span></h1>
          <p className="varlaks-lead">{c.intro}</p>
          <p className="varlaks-nearby">{c.nearby}</p>
          <div className="varlaks-actions"><a className="knop varlaks-primary" href="#locaties">{c.visit} ↓</a><a className="knop varlaks-secondary" href={ask.href}>{c.ask} ↗</a></div>
          <Link className="varlaks-text-link" href={`/${lang}/assortiment/varlaks-zalm`}>{c.product} →</Link>
        </div>
        <figure>
          <Image src="/images/editorial/varlaks-zalm-rauw-ai.webp" alt={c.heroAlt} width={1400} height={1050} sizes="(max-width: 800px) 100vw, 50vw" fetchPriority="high" />
          <figcaption>{c.illustration}</figcaption>
        </figure>
      </div>
    </header>
    <div className="section-wrap varlaks-facts">{facts.map(([title, text]) => <div key={title}><strong>{title}</strong><p>{text}</p></div>)}</div>
    <VarlaksLocations locale={lang} />
    <section className="section-wrap varlaks-section varlaks-split" aria-labelledby="varlaks-origin">
      <div>
        <p className="kapitaal">{c.eyebrow}</p><h2 id="varlaks-origin">{c.storyTitle}</h2><p>{c.mission}</p><p className="mt-5">{c.story}</p>
        <a className="varlaks-text-link" href="https://varlaks.no/retail/" target="_blank" rel="noopener noreferrer">{c.source} ↗</a>
      </div>
      <div><p className="kapitaal mb-3">{c.films}</p><VarlaksFilm locale={lang} /></div>
    </section>
    <div className="section-wrap varlaks-origin-photos">
      {cards.map(card => <figure key={card.title}>
        <Image src={`/images/varlaks/${card.image}`} alt={card.alt} width={600} height={600} sizes="(max-width: 800px) 100vw, 50vw" />
        <figcaption>{card.title}</figcaption>
      </figure>)}
      <p>{c.images}</p>
    </div>
    <section className="varlaks-cooking" aria-labelledby="varlaks-cooking">
      <div className="section-wrap varlaks-split">
        <figure><Image src="/images/editorial/varlaks-zalm-serveersuggestie-ai.png" alt={c.altDish} width={1536} height={1024} sizes="(max-width: 800px) 100vw, 50vw" /><figcaption>{c.servingCaption}</figcaption></figure>
        <div><p className="kapitaal">{c.serving}</p><h2 id="varlaks-cooking">{c.recipe}</h2><p>{c.servingText}</p><div className="varlaks-actions"><Link className="knop knop-navy" href={`/${lang}/recepten/zalm-citroen-dille`}>{c.recipe} →</Link></div></div>
      </div>
    </section>
    <section className="section-wrap varlaks-section varlaks-faq" aria-labelledby="varlaks-questions">
      <h2 id="varlaks-questions">{c.questions}</h2>
      {questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
      <details><summary>{c.sources}</summary><ul>{sources.map(([url, key]) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{c[key]} ↗</a></li>)}</ul></details>
    </section>
    <section className="varlaks-contact" aria-labelledby="varlaks-contact">
      <div className="section-wrap varlaks-split">
        <div><p className="kapitaal">{c.eyebrow}</p><h2 id="varlaks-contact">{c.contactTitle}</h2><p>{c.availability}</p></div>
        <div><div className="varlaks-actions"><a className="knop varlaks-primary" href={ask.href}>{c.ask} ↗</a><a className="knop varlaks-secondary" href="#locaties">{c.visit} ↑</a></div><p className="varlaks-contact-note">{c.contactNote}</p></div>
      </div>
    </section>
  </div>;
}
