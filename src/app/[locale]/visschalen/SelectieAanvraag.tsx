import { DIRKS_BARBECUE, DIRKS_VISSCHALEN, selectieNaam, type SelectieItem } from "@/lib/dirks-selectie";
import { euro, whatsappLink } from "@/lib/bedrijf";
import { SelectieGalerij, type SelectieGalerijKaart } from "./SelectieGalerij";

const EIGEN_SCHAAL_NAMEN = {
  borrelschaal: { nl: "Borrelschaal", en: "Seafood sharing platter", de: "Fischplatte zum Teilen" },
  familieschaal: { nl: "Familieschaal", en: "Family seafood platter", de: "Fischplatte für die Familie" },
  feestschaal: { nl: "Feestschaal", en: "Celebration seafood platter", de: "Fischplatte für Feiern" },
} as const;

const EIGEN_SCHALEN: SelectieItem[] = [
  { slug: "borrelschaal", groep: "klassiek", naam: "Borrelschaal", foto: "/images/dirks/visschotel-hapjes-3-5-pers.webp", prijs: 0, bronPrijs: 0 },
  { slug: "familieschaal", groep: "klassiek", naam: "Familieschaal", foto: "/images/dirks/visschotel-middel-5-8-pers.webp", prijs: 0, bronPrijs: 0 },
  { slug: "feestschaal", groep: "klassiek", naam: "Feestschaal", foto: "/images/dirks/visschotel-luxe-10-14-pers.webp", prijs: 0, bronPrijs: 0 },
];

const TEKST = {
  nl: {
    kop: "Ook voor barbecue en gourmet",
    intro: "Vispakketten, gourmet en losse spiesjes vraagt u rechtstreeks bij ons aan. We bevestigen beschikbaarheid, samenstelling en de definitieve prijs voordat we iets voor u klaarmaken.",
    bbq: "Barbecuepakketten", gourmet: "Visgourmet", los: "Losse vis voor barbecue en gourmet", speciaal: "Bijzondere wensen",
    speciaalIntro: "Een visschotel met kreeft of voor iemand met coeliakie bereiden we op afspraak. We stemmen de samenstelling, bereidingsdag en veilige werkwijze vooraf met u af. Een foto is een serveervoorbeeld.",
    prijs: "Richtprijs", stuk: "per stuk", vraag: "Vraag via WhatsApp", foto: "Bekijk de schaal als inspiratie voor uw eigen samenstelling.", open: "Vergroot foto", sluiten: "Sluiten", vorige: "Vorige foto", volgende: "Volgende foto", teller: "Foto {current} van {total}",
    schaalBeschrijving: (naam: string) => `Bekijk ${naam} van dichtbij. De foto geeft een duidelijk beeld van deze schaal; de definitieve samenstelling stemmen we vooraf met u af.`,
    productBeschrijving: (naam: string) => `Bekijk ${naam} van dichtbij. De foto toont dit product als inspiratie; de samenstelling en beschikbaarheid bevestigen we vooraf.`,
    visschalen: "Visschalen voor borrel, feest en evenement", visschalenIntro: "De foto’s geven inspiratie voor verschillende mogelijkheden. We denken met u mee over uw smaak, het gezelschap en de gelegenheid. Gemiddeld rekenen we circa € 17,50 per persoon. Extra’s of duurdere vis kunnen de prijs verhogen; we stemmen de samenstelling en prijs vooraf via WhatsApp af.",
    waarschuwing: "Voor mensen met coeliakie stemmen we de glutenvrije visschaal en werkwijze vooraf via WhatsApp af. Op onze vaste glutenvrije dag garanderen we ook glutenvrije kibbeling en gebakken garnalen; app ons vooraf om de eerstvolgende dag te bevestigen.",
    bericht: "Hallo Schaap’s Vishandel, ik wil graag informeren naar", bevestig: "Kunt u de beschikbaarheid en mogelijkheden bevestigen?",
  },
  en: {
    kop: "Seafood for barbecue and tabletop grilling",
    intro: "Ask us directly about seafood packs, gourmet platters and individual skewers. We confirm availability, contents and the final price before preparing anything.",
    bbq: "Barbecue packs", gourmet: "Seafood gourmet platters", los: "Individual seafood for the grill", speciaal: "Special requests",
    speciaalIntro: "We prepare lobster platters and meals for people with coeliac disease by arrangement. We agree the contents, preparation day and safe handling with you in advance. The photo is a serving suggestion.",
    prijs: "Guide price", stuk: "each", vraag: "Ask on WhatsApp", foto: "Use this platter as inspiration for your own selection.", open: "Enlarge photo", sluiten: "Close", vorige: "Previous photo", volgende: "Next photo", teller: "Photo {current} of {total}",
    schaalBeschrijving: (naam: string) => `See ${naam} up close. The photo gives a clear view of this platter; we agree the final selection with you in advance.`,
    productBeschrijving: (naam: string) => `See ${naam} up close. The photo shows this product as inspiration; we confirm the contents and availability in advance.`,
    visschalen: "Seafood platters for parties and events", visschalenIntro: "The photos offer inspiration for different options. We will help you choose based on your preferences, guests and occasion. Our average is around €17.50 per person. Extras or more expensive fish may increase the price; we agree the contents and price with you in advance via WhatsApp.",
    waarschuwing: "For guests with coeliac disease, we agree the gluten-free platter and handling with you in advance on WhatsApp. On our regular gluten-free day, we also guarantee gluten-free kibbeling and fried prawns; message us to confirm the next date.",
    bericht: "Hello Schaap’s Vishandel, I would like to ask about", bevestig: "Could you confirm availability and the options?",
  },
  de: {
    kop: "Fisch für Grill und Tischgrill",
    intro: "Fragen Sie uns direkt nach Grillpaketen, Gourmetplatten und einzelnen Spießen. Wir bestätigen Verfügbarkeit, Inhalt und Endpreis, bevor wir etwas vorbereiten.",
    bbq: "Grillpakete", gourmet: "Fisch-Gourmetplatten", los: "Fisch für den Grill", speciaal: "Besondere Wünsche",
    speciaalIntro: "Hummerplatten und Gerichte für Menschen mit Zöliakie bereiten wir nach Absprache zu. Inhalt, Zubereitungstag und sichere Handhabung stimmen wir vorher mit Ihnen ab. Das Foto ist ein Servierbeispiel.",
    prijs: "Richtpreis", stuk: "pro Stück", vraag: "Per WhatsApp anfragen", foto: "Lassen Sie sich von dieser Platte für Ihre eigene Auswahl inspirieren.", open: "Foto vergrößern", sluiten: "Schließen", vorige: "Vorheriges Foto", volgende: "Nächstes Foto", teller: "Foto {current} von {total}",
    schaalBeschrijving: (naam: string) => `Sehen Sie ${naam} aus der Nähe. Das Foto zeigt diese Platte deutlich; die endgültige Zusammenstellung stimmen wir vorher mit Ihnen ab.`,
    productBeschrijving: (naam: string) => `Sehen Sie ${naam} aus der Nähe. Das Foto dient als Inspiration; Inhalt und Verfügbarkeit bestätigen wir vorher.`,
    visschalen: "Fischplatten für Feiern und Veranstaltungen", visschalenIntro: "Die Fotos dienen als Inspiration für verschiedene Möglichkeiten. Wir beraten Sie passend zu Ihrem Geschmack, der Gästezahl und dem Anlass. Im Durchschnitt rechnen wir mit etwa 17,50 € pro Person. Extras oder teurere Fischsorten können den Preis erhöhen; Inhalt und Preis stimmen wir vorab per WhatsApp mit Ihnen ab.",
    waarschuwing: "Für Gäste mit Zöliakie stimmen wir die glutenfreie Fischplatte und die Zubereitung vorab per WhatsApp ab. An unserem festen glutenfreien Tag garantieren wir außerdem glutenfreien Kibbeling und gebratene Garnelen; schreiben Sie uns, um den nächsten Termin zu bestätigen.",
    bericht: "Hallo Schaap’s Vishandel, ich möchte fragen nach", bevestig: "Können Sie Verfügbarkeit und Möglichkeiten bestätigen?",
  },
} as const;

function Kaarten({ items, locale, showPrice = true, photoCaption }: { items: SelectieItem[]; locale: keyof typeof TEKST; showPrice?: boolean; photoCaption?: string }) {
  const t = TEKST[locale];
  const kaarten: SelectieGalerijKaart[] = items.map((item) => {
      const naam = EIGEN_SCHAAL_NAMEN[item.slug as keyof typeof EIGEN_SCHAAL_NAMEN]?.[locale] ?? selectieNaam(item.slug, locale);
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
      <Kaarten items={[...EIGEN_SCHALEN, ...DIRKS_VISSCHALEN]} locale={taal} showPrice={false} photoCaption={photoCaption} />
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
