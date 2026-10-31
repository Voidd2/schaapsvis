import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Kop, Sectie } from "@/components/ui/Sectie";
import { bestelContact } from "@/lib/bestel-contact";
import { paginaMetadata } from "@/lib/seo";

const COPY = {
  nl: {
    home: "Home", feast: "Feestdagen 2026", label: "Voor klanten, collega’s en relaties", title: "Relatiegeschenken uit de viswinkel", intro: "Een smaakvol bedankje hoeft niet uit een standaarddoos te komen. We denken mee over gerookte zalm, een pakket op maat of een tegoed voor de winkel.", ask: "Vraag een voorstel aan", back: "Bekijk Feestdagen 2026", options: "Mogelijkheden", optionsTitle: "Persoonlijk samengesteld, passend bij uw budget", note: "Dit zijn ideeën, geen vaste voorraadproducten. We bevestigen pas na overleg wat we kunnen leveren, hoe het wordt verpakt en wat het kost.", items: [
      ["Gerookte zalm als geschenk", "Een mooie zalmzijde of portie gerookte zalm voor iemand die graag goed eet. Hoeveelheid en verpakking spreken we vooraf af.", "/images/editorial/gerookte-zalm-serveervoorbeeld.png", "Gerookte zalm als cadeau-idee"],
      ["Pakket op maat", "Combineer vis en bijpassende producten binnen een afgesproken budget. Geschikt voor een klein team of meerdere zakelijke relaties.", "/images/editorial/feestschaal-voorbeeld.webp", "Feestelijke visselectie als inspiratie voor een pakket"],
      ["Tegoed voor de winkel", "Wilt u de ontvanger zelf laten kiezen? Vraag ons naar een persoonlijk tegoed of cadeaumogelijkheid voor de winkel.", "/images/editorial/visschaal-inspiratie.webp", "Visselectie als inspiratie voor een winkeltegoed"],
    ] as const,
    howLabel: "Aanvragen", howTitle: "Wat we van u nodig hebben", how: ["Het aantal geschenken", "Uw budget per persoon of pakket", "Gewenste afhaaldatum", "Voorkeuren, allergieën en verpakkingswensen"],
    honestTitle: "Eerst afstemmen, dan pas beloven", honestText: "Verse vis en ambachtelijke producten vragen om goede planning. Daarom tonen we geen verzonnen voorraad of standaardprijzen: u krijgt na overleg een duidelijk voorstel met inhoud, prijs en afhaalmoment.", slotTitle: "Een passend geschenk laten samenstellen?", slotText: "Stuur aantallen, budget en gewenste datum via WhatsApp. We reageren met de mogelijkheden.",
  },
  en: {
    home: "Home", feast: "Festive season 2026", label: "For customers, colleagues and partners", title: "Business gifts from the fish shop", intro: "A thoughtful thank-you does not have to come from a standard box. We can discuss smoked salmon, a custom package or shop credit.", ask: "Request a proposal", back: "Explore festive season 2026", options: "Options", optionsTitle: "Tailored to your recipient and budget", note: "These are ideas, not guaranteed stock. We confirm availability, packaging and price after discussing your request.", items: [["Smoked salmon gift", "A side or portion of smoked salmon for someone who enjoys good food. Quantity and packaging are agreed in advance.", "/images/editorial/gerookte-zalm-serveervoorbeeld.png", "Smoked salmon gift idea"], ["Custom package", "Combine fish and suitable products within an agreed budget, for a small team or several partners.", "/images/editorial/feestschaal-voorbeeld.webp", "Festive fish selection as gift inspiration"], ["Shop credit", "Want the recipient to choose? Ask about personal credit or another gift option for the shop.", "/images/editorial/visschaal-inspiratie.webp", "Fish selection as inspiration for shop credit"]] as const, howLabel: "Request", howTitle: "What we need from you", how: ["Number of gifts", "Budget per person or package", "Preferred collection date", "Preferences, allergies and packaging wishes"], honestTitle: "Agree first, promise second", honestText: "Fresh fish and artisan products require planning. We therefore do not show invented stock or standard prices; after consultation you receive a clear proposal.", slotTitle: "Shall we create a suitable gift?", slotText: "Send quantities, budget and date on WhatsApp. We will reply with the options.",
  },
  de: {
    home: "Startseite", feast: "Festtage 2026", label: "Für Kunden, Kollegen und Geschäftspartner", title: "Firmengeschenke aus dem Fischgeschäft", intro: "Ein persönliches Dankeschön muss nicht aus einer Standardbox kommen. Wir beraten zu Räucherlachs, individuellen Paketen oder einem Guthaben.", ask: "Vorschlag anfragen", back: "Festtage 2026 ansehen", options: "Möglichkeiten", optionsTitle: "Persönlich zusammengestellt, passend zum Budget", note: "Dies sind Ideen, keine garantierten Lagerartikel. Verfügbarkeit, Verpackung und Preis bestätigen wir nach Absprache.", items: [["Räucherlachs als Geschenk", "Eine Lachsseite oder Portion Räucherlachs für Menschen, die gutes Essen schätzen. Menge und Verpackung stimmen wir vorher ab.", "/images/editorial/gerookte-zalm-serveervoorbeeld.png", "Räucherlachs als Geschenkidee"], ["Individuelles Paket", "Kombinieren Sie Fisch und passende Produkte in einem vereinbarten Budget, für Teams oder mehrere Geschäftspartner.", "/images/editorial/feestschaal-voorbeeld.webp", "Festliche Fischauswahl als Geschenkidee"], ["Guthaben für das Geschäft", "Soll der Empfänger selbst wählen? Fragen Sie nach einem persönlichen Guthaben oder einer anderen Geschenkmöglichkeit.", "/images/editorial/visschaal-inspiratie.webp", "Fischauswahl als Inspiration für ein Guthaben"]] as const, howLabel: "Anfragen", howTitle: "Was wir von Ihnen benötigen", how: ["Anzahl der Geschenke", "Budget pro Person oder Paket", "Gewünschter Abholtermin", "Vorlieben, Allergien und Verpackungswünsche"], honestTitle: "Erst abstimmen, dann versprechen", honestText: "Frischer Fisch und handwerkliche Produkte brauchen Planung. Deshalb zeigen wir keine erfundenen Bestände oder Standardpreise; nach Absprache erhalten Sie einen klaren Vorschlag.", slotTitle: "Ein passendes Geschenk zusammenstellen lassen?", slotText: "Senden Sie Anzahl, Budget und Termin per WhatsApp. Wir antworten mit den Möglichkeiten.",
  },
} as const;

function copy(locale: string) { return COPY[(locale in COPY ? locale : "nl") as keyof typeof COPY]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const c = copy(locale);
  return paginaMetadata({ locale, pad: "/relatiegeschenken", title: `${c.title} | Schaap’s Vishandel`, description: c.intro, image: "/images/editorial/gerookte-zalm-serveervoorbeeld.png" });
}

export default async function RelatiegeschenkenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const c = copy(locale);
  const contact = bestelContact(locale, c.title);
  return <>
    <PaginaKop kruimels={[{ naam: c.home, href: `/${locale}` }, { naam: c.feast, href: `/${locale}/feestdagen` }, { naam: c.title }]} label={c.label} titel={c.title} intro={c.intro} knoppen={[{ label: c.ask, href: contact.href, extern: true }, { label: c.back, href: `/${locale}/feestdagen`, soort: "lijn" }]} />
    <Sectie grond="papier">
      <Kop label={c.options} titel={c.optionsTitle} intro={c.note} />
      <ul className="grid md:grid-cols-3 gap-8">
        {c.items.map(([titel, tekst, beeld, alt]) => <li key={titel} className="bg-white border" style={{ borderColor: "var(--linen)" }}>
          <Image src={beeld} alt={alt} width={1000} height={700} className="aspect-[4/3] w-full object-cover" />
          <div className="p-6"><h2 className="text-[1.35rem] mb-3">{titel}</h2><p className="leading-relaxed" style={{ color: "var(--charcoal)" }}>{tekst}</p></div>
        </li>)}
      </ul>
    </Sectie>
    <Sectie grond="zand">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
        <Kop label={c.howLabel} titel={c.howTitle} />
        <ol className="grid sm:grid-cols-2 gap-x-8">
          {c.how.map((item, index) => <li key={item} className="flex gap-4 py-5" style={{ borderTop: "1px solid var(--linen)" }}><span className="bedrag font-semibold" style={{ color: "var(--gold)" }}>{String(index + 1).padStart(2, "0")}</span><span className="font-semibold" style={{ color: "var(--navy)" }}>{item}</span></li>)}
        </ol>
      </div>
    </Sectie>
    <Sectie grond="navy" smal><Kop titel={c.honestTitle} donker /><p className="lees" style={{ color: "rgba(250,246,239,0.82)" }}>{c.honestText}</p></Sectie>
    <PaginaSlot titel={c.slotTitle} tekst={c.slotText} knoppen={[{ label: c.ask, href: contact.href, extern: true }, { label: c.back, href: `/${locale}/feestdagen`, soort: "lijn" }]} />
  </>;
}
