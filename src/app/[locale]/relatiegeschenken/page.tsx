import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Kop, Sectie } from "@/components/ui/Sectie";
import { bestelContact } from "@/lib/bestel-contact";
import { paginaMetadata } from "@/lib/seo";

const COPY = {
  nl: {
    home: "Home", feast: "Feestdagen 2026", label: "Voor klanten, collega’s en relaties", title: "Relatiegeschenken uit de viswinkel", intro: "Een smaakvol bedankje hoeft niet uit een standaarddoos te komen. Kies een richting en laat ons een gekoeld visgeschenk samenstellen dat past bij de ontvanger en uw budget.", ask: "Vraag een voorstel aan", back: "Bekijk Feestdagen 2026", options: "Cadeau-ideeën", optionsTitle: "Kies een richting, wij maken het passend", note: "De verpakkingen en foto’s zijn voorbeelden. We bevestigen inhoud, houdbaarheid, aantal, verpakking en eindprijs vooraf; afhalen gebeurt gekoeld in Leiden.", priceNote: "Prijs na overleg", view: "Vraag dit geschenk aan", items: [
      ["Schaap’s zalmpakket", "Gerookte zalm, een passende smaakmaker en een kaart in een feestelijke Schaap’s-verpakking.", "/images/editorial/schaaps-relatiegeschenk-zalmpakket-v1.png", "Donkerblauw Schaap’s-relatiegeschenk met zalm en het ronde logo", "op maat samengesteld"],
      ["Gerookte zalm als geschenk", "Een mooie portie of zalmzijde voor iemand die graag goed eet. Hoeveelheid en verpakking spreken we vooraf af.", "/images/editorial/gerookte-zalm-serveervoorbeeld.png", "Gerookte zalm als cadeau-idee", "hoeveelheid naar wens"],
      ["Luxe vistrio", "Een voorbeeldcombinatie van gerookte zalm, Hollandse garnalen en gerookte paling, feestelijk verpakt.", "/images/editorial/visschaal-inspiratie.webp", "Luxe trio van gerookte vis en garnalen", "samenstelling naar wens"],
      ["Pakket op maat", "Combineer vis en passende producten binnen een afgesproken budget, voor één ontvanger of een heel team.", "/images/editorial/feestschaal-voorbeeld.webp", "Feestelijke visselectie als inspiratie voor een pakket", "voor kleine en grote aantallen"],
      ["Warm gerookte zalm", "Een ambachtelijke blikvanger voor de feesttafel, gekoeld meegegeven met serveer- en bewaartip.", "/images/editorial/gerookte-zalmmoot-eigen-product.png", "Warm gerookte zalm met citroen en dille", "portie of groter stuk"],
      ["Tegoed voor de winkel", "Wilt u de ontvanger zelf laten kiezen? Vraag naar een persoonlijk winkeltegoed met een feestelijke kaart.", "/images/editorial/schaaps-relatiegeschenk-zalmpakket-v1.png", "Schaap’s-geschenkverpakking als inspiratie voor een winkeltegoed", "bedrag naar keuze"],
    ] as const,
    howLabel: "Aanvragen", howTitle: "Wat we van u nodig hebben", how: ["Het aantal geschenken", "Uw budget per persoon of pakket", "Gewenste afhaaldatum", "Voorkeuren, allergieën en verpakkingswensen"],
    honestTitle: "Eerst afstemmen, dan pas beloven", honestText: "Verse vis en ambachtelijke producten vragen om goede planning. Daarom tonen we geen verzonnen voorraad of standaardprijzen: u krijgt na overleg een duidelijk voorstel met inhoud, prijs en afhaalmoment.", slotTitle: "Een passend geschenk laten samenstellen?", slotText: "Stuur aantallen, budget en gewenste datum via WhatsApp. We reageren met de mogelijkheden.",
  },
  en: {
    home: "Home", feast: "Festive season 2026", label: "For customers, colleagues and partners", title: "Business gifts from the fish shop", intro: "Choose a direction and let us prepare a chilled seafood gift that suits the recipient and your budget.", ask: "Request a proposal", back: "Explore festive season 2026", options: "Gift ideas", optionsTitle: "Choose a direction, we will tailor it", note: "Packaging and photos are examples. Contents, shelf life, quantity, packaging and final price are confirmed in advance; collection is chilled in Leiden.", priceNote: "Price after consultation", view: "Request this gift", items: [["Schaap’s salmon package", "Smoked salmon, a suitable seasoning and a card in festive Schaap’s packaging.", "/images/editorial/schaaps-relatiegeschenk-zalmpakket-v1.png", "Navy Schaap’s seafood gift with salmon and round logo", "tailored package"], ["Smoked salmon gift", "A portion or side of smoked salmon for someone who enjoys good food.", "/images/editorial/gerookte-zalm-serveervoorbeeld.png", "Smoked salmon gift idea", "quantity to suit"], ["Luxury fish trio", "An example combination of smoked salmon, Dutch shrimp and smoked eel, packed for the occasion.", "/images/editorial/visschaal-inspiratie.webp", "Luxury trio of smoked fish and shrimp", "contents to suit"], ["Custom package", "Combine fish and suitable products within an agreed budget, for one recipient or a whole team.", "/images/editorial/feestschaal-voorbeeld.webp", "Festive fish selection as gift inspiration", "small or large quantities"], ["Hot-smoked salmon", "A centrepiece for the festive table, collected chilled with serving and storage advice.", "/images/editorial/gerookte-zalmmoot-eigen-product.png", "Hot-smoked salmon with lemon and dill", "portion or larger piece"], ["Shop credit", "Let the recipient choose with personal shop credit and a festive card.", "/images/editorial/schaaps-relatiegeschenk-zalmpakket-v1.png", "Schaap’s gift package as shop-credit inspiration", "amount of your choice"]] as const, howLabel: "Request", howTitle: "What we need from you", how: ["Number of gifts", "Budget per person or package", "Preferred collection date", "Preferences, allergies and packaging wishes"], honestTitle: "Agree first, promise second", honestText: "Fresh fish and artisan products require planning. We therefore do not show invented stock or standard prices; after consultation you receive a clear proposal.", slotTitle: "Shall we create a suitable gift?", slotText: "Send quantities, budget and date on WhatsApp. We will reply with the options.",
  },
  de: {
    home: "Startseite", feast: "Festtage 2026", label: "Für Kunden, Kollegen und Geschäftspartner", title: "Firmengeschenke aus dem Fischgeschäft", intro: "Wählen Sie eine Richtung; wir stellen ein gekühltes Fischgeschenk passend zu Empfänger und Budget zusammen.", ask: "Vorschlag anfragen", back: "Festtage 2026 ansehen", options: "Geschenkideen", optionsTitle: "Richtung wählen, persönlich abstimmen", note: "Verpackung und Fotos sind Beispiele. Inhalt, Haltbarkeit, Anzahl, Verpackung und Endpreis bestätigen wir vorab; die Abholung erfolgt gekühlt in Leiden.", priceNote: "Preis nach Absprache", view: "Geschenk anfragen", items: [["Schaap’s Lachspaket", "Räucherlachs, eine passende Würze und eine Karte in festlicher Schaap’s-Verpackung.", "/images/editorial/schaaps-relatiegeschenk-zalmpakket-v1.png", "Dunkelblaues Schaap’s-Fischgeschenk mit Lachs und rundem Logo", "individuell zusammengestellt"], ["Räucherlachs als Geschenk", "Eine Portion oder Lachsseite für Menschen, die gutes Essen schätzen.", "/images/editorial/gerookte-zalm-serveervoorbeeld.png", "Räucherlachs als Geschenkidee", "Menge nach Wunsch"], ["Luxus-Fischtrio", "Eine Beispielkombination aus Räucherlachs, holländischen Garnelen und Räucheraal.", "/images/editorial/visschaal-inspiratie.webp", "Luxus-Trio aus Räucherfisch und Garnelen", "Inhalt nach Wunsch"], ["Individuelles Paket", "Kombinieren Sie Fisch und passende Produkte im vereinbarten Budget, einzeln oder für ein ganzes Team.", "/images/editorial/feestschaal-voorbeeld.webp", "Festliche Fischauswahl als Geschenkidee", "kleine und große Mengen"], ["Warm geräucherter Lachs", "Ein Blickfang für die Festtafel, gekühlt mit Servier- und Aufbewahrungshinweis.", "/images/editorial/gerookte-zalmmoot-eigen-product.png", "Warm geräucherter Lachs mit Zitrone und Dill", "Portion oder größeres Stück"], ["Guthaben für das Geschäft", "Lassen Sie den Empfänger mit einem persönlichen Guthaben und einer festlichen Karte selbst wählen.", "/images/editorial/schaaps-relatiegeschenk-zalmpakket-v1.png", "Schaap’s-Geschenkverpackung als Inspiration", "Betrag nach Wahl"]] as const, howLabel: "Anfragen", howTitle: "Was wir von Ihnen benötigen", how: ["Anzahl der Geschenke", "Budget pro Person oder Paket", "Gewünschter Abholtermin", "Vorlieben, Allergien und Verpackungswünsche"], honestTitle: "Erst abstimmen, dann versprechen", honestText: "Frischer Fisch und handwerkliche Produkte brauchen Planung. Deshalb zeigen wir keine erfundenen Bestände oder Standardpreise; nach Absprache erhalten Sie einen klaren Vorschlag.", slotTitle: "Ein passendes Geschenk zusammenstellen lassen?", slotText: "Senden Sie Anzahl, Budget und Termin per WhatsApp. Wir antworten mit den Möglichkeiten.",
  },
} as const;

function copy(locale: string) { return COPY[(locale in COPY ? locale : "nl") as keyof typeof COPY]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const c = copy(locale);
  return paginaMetadata({ locale, pad: "/relatiegeschenken", title: `${c.title} | Schaap’s Vishandel`, description: c.intro, image: "/images/editorial/schaaps-relatiegeschenk-zalmpakket-v1.png" });
}

export default async function RelatiegeschenkenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const c = copy(locale);
  const contact = bestelContact(locale, c.title);
  return <>
    <PaginaKop kruimels={[{ naam: c.home, href: `/${locale}` }, { naam: c.feast, href: `/${locale}/feestdagen` }, { naam: c.title }]} label={c.label} titel={c.title} intro={c.intro} knoppen={[{ label: c.ask, href: contact.href, extern: true }, { label: c.back, href: `/${locale}/feestdagen`, soort: "lijn" }]} zijkant={<div className="overflow-hidden rounded-2xl border border-white/20 shadow-xl"><Image src="/images/editorial/schaaps-relatiegeschenk-zalmpakket-v1.png" alt={c.items[0][3]} width={1536} height={1024} priority className="aspect-[3/2] w-full object-cover" /></div>} uitgelijnd="boven" />
    <Sectie grond="papier" id="mogelijkheden">
      <Kop label={c.options} titel={c.optionsTitle} intro={c.note} />
      <ul className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10">
        {c.items.map(([titel, tekst, beeld, alt, detail], index) => <li key={titel} className="group flex min-w-0 flex-col overflow-hidden rounded-lg border bg-white" style={{ borderColor: "var(--linen)" }}>
          <div className="overflow-hidden"><Image src={beeld} alt={alt} width={1000} height={700} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]" /></div>
          <div className="flex flex-1 flex-col p-4 sm:p-6"><p className="kapitaal mb-2">{String(index + 1).padStart(2, "0")}</p><h2 className="text-[1.05rem] leading-tight sm:text-[1.35rem]">{titel}</h2><p className="mt-2 hidden leading-relaxed sm:block" style={{ color: "var(--charcoal)" }}>{tekst}</p><p className="mt-3 text-[0.78rem] font-bold sm:text-sm" style={{ color: "#a61f2b" }}>{c.priceNote} · {detail}</p><a href={contact.href} className="mt-auto inline-block pt-4 text-[0.78rem] font-semibold underline underline-offset-4 sm:text-sm" style={{ color: "var(--navy)" }}>{c.view} →</a></div>
        </li>)}
      </ul>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl px-5 py-5 sm:px-7" style={{ backgroundColor: "#eaf7fc" }}><p className="max-w-2xl font-semibold" style={{ color: "var(--navy-dark)" }}>{c.note}</p><Link href={`/${locale}/feestdagen`} className="knop knop-lijn">{c.back}</Link></div>
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
