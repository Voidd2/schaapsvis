import { DIRKS_BARBECUE, DIRKS_VISSCHALEN, selectieNaam, type SelectieItem } from "@/lib/dirks-selectie";
import { euro, whatsappLink } from "@/lib/bedrijf";
import { SelectieGalerij, type SelectieGalerijKaart } from "./SelectieGalerij";
import { feestdagenProduct } from "@/lib/feestdagen-producten";

const TEKST = {
  nl: {
    kop: "Ook voor barbecue en gourmet",
    intro: "Vispakketten, gourmet en losse spiesjes vraagt u rechtstreeks bij ons aan. We bevestigen beschikbaarheid, samenstelling en de definitieve prijs voordat we iets voor u klaarmaken.",
    bbq: "Barbecuepakketten", gourmet: "Visgourmet", los: "Losse vis voor barbecue en gourmet", speciaal: "Bijzondere wensen",
    speciaalIntro: "Een visschotel met kreeft of voor iemand met coeliakie bereiden we op afspraak. We stemmen de samenstelling, bereidingsdag en veilige werkwijze vooraf met u af. Een foto is een serveervoorbeeld.",
    prijs: "Prijs", stuk: "per stuk", vraag: "Vraag via WhatsApp", details: "Bekijk product", foto: "Bekijk de schaal als inspiratie voor uw eigen samenstelling.", open: "Vergroot foto", sluiten: "Sluiten", vorige: "Vorige foto", volgende: "Volgende foto", teller: "Foto {current} van {total}",
    schaalBeschrijving: (naam: string) => `Bekijk ${naam} van dichtbij. De foto geeft een duidelijk beeld van deze schaal; de definitieve samenstelling stemmen we vooraf met u af.`,
    productBeschrijving: (naam: string) => `Bekijk ${naam} van dichtbij. De foto toont dit product als inspiratie; de samenstelling en beschikbaarheid bevestigen we vooraf.`,
    visschalen: "Kies uw visschaal", visschalenIntro: "Alle formaten met volledige prijs. Bekijk per schaal de samenstelling en allergenen.",
    waarschuwing: "Voor mensen met coeliakie stemmen we de glutenvrije visschaal en werkwijze vooraf via WhatsApp af. Op onze vaste glutenvrije dag garanderen we ook glutenvrije kibbeling en gebakken garnalen; app ons vooraf om de eerstvolgende dag te bevestigen.",
    bericht: "Hallo Schaap’s Vishandel, ik wil graag informeren naar", bevestig: "Kunt u de beschikbaarheid en mogelijkheden bevestigen?",
  },
  en: {
    kop: "Seafood for barbecue and tabletop grilling",
    intro: "Ask us directly about seafood packs, gourmet platters and individual skewers. We confirm availability, contents and the final price before preparing anything.",
    bbq: "Barbecue packs", gourmet: "Seafood gourmet platters", los: "Individual seafood for the grill", speciaal: "Special requests",
    speciaalIntro: "We prepare lobster platters and meals for people with coeliac disease by arrangement. We agree the contents, preparation day and safe handling with you in advance. The photo is a serving suggestion.",
    prijs: "Price", stuk: "each", vraag: "Ask on WhatsApp", details: "View product", foto: "Use this platter as inspiration for your own selection.", open: "Enlarge photo", sluiten: "Close", vorige: "Previous photo", volgende: "Next photo", teller: "Photo {current} of {total}",
    schaalBeschrijving: (naam: string) => `See ${naam} up close. The photo gives a clear view of this platter; we agree the final selection with you in advance.`,
    productBeschrijving: (naam: string) => `See ${naam} up close. The photo shows this product as inspiration; we confirm the contents and availability in advance.`,
    visschalen: "Seafood platters for parties and events", visschalenIntro: "Explore the listed platters with their full price. ‘View product’ shows contents, size and allergens. We confirm availability and any changes with you on WhatsApp.",
    waarschuwing: "For guests with coeliac disease, we agree the gluten-free platter and handling with you in advance on WhatsApp. On our regular gluten-free day, we also guarantee gluten-free kibbeling and fried prawns; message us to confirm the next date.",
    bericht: "Hello Schaap’s Vishandel, I would like to ask about", bevestig: "Could you confirm availability and the options?",
  },
  de: {
    kop: "Fisch für Grill und Tischgrill",
    intro: "Fragen Sie uns direkt nach Grillpaketen, Gourmetplatten und einzelnen Spießen. Wir bestätigen Verfügbarkeit, Inhalt und Endpreis, bevor wir etwas vorbereiten.",
    bbq: "Grillpakete", gourmet: "Fisch-Gourmetplatten", los: "Fisch für den Grill", speciaal: "Besondere Wünsche",
    speciaalIntro: "Hummerplatten und Gerichte für Menschen mit Zöliakie bereiten wir nach Absprache zu. Inhalt, Zubereitungstag und sichere Handhabung stimmen wir vorher mit Ihnen ab. Das Foto ist ein Servierbeispiel.",
    prijs: "Preis", stuk: "pro Stück", vraag: "Per WhatsApp anfragen", details: "Produkt ansehen", foto: "Lassen Sie sich von dieser Platte für Ihre eigene Auswahl inspirieren.", open: "Foto vergrößern", sluiten: "Schließen", vorige: "Vorheriges Foto", volgende: "Nächstes Foto", teller: "Foto {current} von {total}",
    schaalBeschrijving: (naam: string) => `Sehen Sie ${naam} aus der Nähe. Das Foto zeigt diese Platte deutlich; die endgültige Zusammenstellung stimmen wir vorher mit Ihnen ab.`,
    productBeschrijving: (naam: string) => `Sehen Sie ${naam} aus der Nähe. Das Foto dient als Inspiration; Inhalt und Verfügbarkeit bestätigen wir vorher.`,
    visschalen: "Fischplatten für Feiern und Veranstaltungen", visschalenIntro: "Entdecken Sie die festen Ausführungen mit vollständigem Preis. Unter ‘Produkt ansehen’ finden Sie Inhalt, Größe und Allergene. Verfügbarkeit und Änderungen bestätigen wir per WhatsApp.",
    waarschuwing: "Für Gäste mit Zöliakie stimmen wir die glutenfreie Fischplatte und die Zubereitung vorab per WhatsApp ab. An unserem festen glutenfreien Tag garantieren wir außerdem glutenfreien Kibbeling und gebratene Garnelen; schreiben Sie uns, um den nächsten Termin zu bestätigen.",
    bericht: "Hallo Schaap’s Vishandel, ich möchte fragen nach", bevestig: "Können Sie Verfügbarkeit und Möglichkeiten bestätigen?",
  },
} as const;

function Kaarten({ items, locale, showPrice = true, photoCaption }: { items: SelectieItem[]; locale: keyof typeof TEKST; showPrice?: boolean; photoCaption?: string }) {
  const t = TEKST[locale];
  const kaarten: SelectieGalerijKaart[] = items.map((item) => {
      const naam = selectieNaam(item.slug, locale);
      const bericht = showPrice
        ? `${t.bericht} ${naam} (${t.prijs.toLowerCase()} ${euro(item.prijs)}${item.perStuk ? ` ${t.stuk}` : ""}). ${t.bevestig}`
        : `${t.bericht} ${naam}. ${t.bevestig}`;
      return {
        slug: item.slug,
        naam,
        foto: item.foto,
        fotoBijschrift: photoCaption ?? t.foto,
        beschrijving: showPrice ? t.productBeschrijving(naam) : t.schaalBeschrijving(naam),
        prijsTekst: showPrice ? `${t.prijs} ${euro(item.prijs)}${item.perStuk ? ` ${t.stuk}` : ""}` : undefined,
        whatsappHref: whatsappLink(bericht),
        whatsappLabel: t.vraag,
        detailsHref: feestdagenProduct(item.slug) ? `/${locale}/feestdagen/${item.slug}` : undefined,
        detailsLabel: feestdagenProduct(item.slug) ? t.details : undefined,
      };
    });
  return <SelectieGalerij kaarten={kaarten} tekst={{ open: t.open, close: t.sluiten, previous: t.vorige, next: t.volgende, counter: t.teller }} />;
}

export function SelectieAanvraag({ locale, showSpecial = true, showBarbecue = true, showPlatters = false, heading, intro, photoCaption }: { locale: string; showSpecial?: boolean; showBarbecue?: boolean; showPlatters?: boolean; heading?: string; intro?: string; photoCaption?: string }) {
  const taal = locale === "en" || locale === "de" ? locale : "nl";
  const t = TEKST[taal];
  const speciaal = DIRKS_VISSCHALEN.filter((item) => item.alleenAanvraag);
  return <div className="space-y-14">
    {showPlatters && <section id="visschaal-inspiratie">
      <h2 className="text-[1.8rem] mb-2">{t.visschalen}</h2>
      <p className="max-w-3xl mb-8 text-[#4d6370]">{t.visschalenIntro}</p>
      <nav className="bbq-category-links mb-8" aria-label={t.visschalen}>{["klassiek", "luxe", "hapjes"].map((group, i) => <a href={`#schalen-${group}`} key={group}>{(taal === "nl" ? ["Klassiek", "Luxe", "Hapjesschalen"] : taal === "de" ? ["Klassisch", "Deluxe", "Häppchenplatten"] : ["Classic", "Deluxe", "Bite-sized"])[i]}</a>)}</nav>
      {["klassiek", "luxe", "hapjes"].map((group, i) => <section className="platter-family" id={`schalen-${group}`} key={group}>
        <h3>{(taal === "nl" ? ["Klassieke visschalen", "Luxe visschalen", "Hapjesschalen"] : taal === "de" ? ["Klassische Fischplatten", "Deluxe Fischplatten", "Häppchenplatten"] : ["Classic seafood platters", "Deluxe seafood platters", "Bite-sized platters"])[i]}</h3>
        <Kaarten items={DIRKS_VISSCHALEN.filter(item => feestdagenProduct(item.slug)?.categorie === "visschalen" && (item.slug.includes("luxe") ? "luxe" : item.slug.includes("hapjes") ? "hapjes" : "klassiek") === group)} locale={taal} photoCaption={photoCaption} />
      </section>)}
      <p className="mt-6 max-w-3xl text-sm text-[#4d6370]">{t.waarschuwing}</p>
    </section>}
    {showSpecial && <section id="bijzondere-visschalen">
      <h2 className="text-[1.8rem] mb-2">{t.speciaal}</h2>
      <p className="max-w-3xl mb-6 text-[#4d6370]">{t.speciaalIntro}</p>
      <Kaarten items={speciaal} locale={taal} showPrice={false} />
      <p className="mt-4 text-sm text-[#4d6370]">{t.waarschuwing}</p>
    </section>}
    {showBarbecue && <section id="barbecue-gourmet">
      <h2 className="text-[1.8rem] mb-2">{heading ?? t.kop}</h2>
      <p className="max-w-3xl mb-8 text-[#4d6370]">{intro ?? t.intro}</p>
      <nav aria-label={t.kop} className="bbq-category-links mb-9">
        {(["barbecue", "gourmet", "los"] as const).map((groep) => <a key={groep} href={`#${groep}`}>{groep === "barbecue" ? t.bbq : t[groep]}</a>)}
      </nav>
      {(["barbecue", "gourmet", "los"] as const).map((groep) => <div id={groep} key={groep} className="mb-12 last:mb-0 scroll-mt-32">
        <h3 className="text-[1.45rem] mb-5">{groep === "barbecue" ? t.bbq : t[groep]}</h3>
        <Kaarten items={DIRKS_BARBECUE.filter((item) => item.groep === groep)} locale={taal} photoCaption={photoCaption} />
      </div>)}
    </section>}
  </div>;
}
