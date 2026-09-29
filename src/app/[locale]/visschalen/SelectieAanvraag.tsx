import Image from "next/image";
import { DIRKS_BARBECUE, DIRKS_VISSCHALEN, selectieNaam, type SelectieItem } from "@/lib/dirks-selectie";
import { euro, whatsappLink } from "@/lib/bedrijf";

const TEKST = {
  nl: {
    kop: "Ook voor barbecue en gourmet",
    intro: "Vispakketten, gourmet en losse spiesjes vraagt u rechtstreeks bij ons aan. We bevestigen beschikbaarheid, samenstelling en de definitieve prijs voordat we iets voor u klaarmaken.",
    bbq: "Barbecuepakketten", gourmet: "Visgourmet", los: "Losse vis voor barbecue en gourmet", speciaal: "Bijzondere wensen",
    speciaalIntro: "Een visschotel met kreeft of voor iemand met coeliakie bereiden we op afspraak. We stemmen de samenstelling, bereidingsdag en veilige werkwijze vooraf met u af. Een foto is een serveervoorbeeld.",
    prijs: "Richtprijs", stuk: "per stuk", vraag: "Vraag via WhatsApp", foto: "Serveervoorbeeld; inhoud en formaat kunnen afwijken.",
    waarschuwing: "Wij bereiden ook glutenvrije visgerechten voor mensen met coeliakie. Vraag vooraf naar de geschikte dag; pas na bevestiging staat uw glutenvrije bestelling vast.",
    bericht: "Hallo Schaap’s Vishandel, ik wil graag informeren naar", bevestig: "Kunt u de beschikbaarheid en mogelijkheden bevestigen?",
  },
  en: {
    kop: "Seafood for barbecue and tabletop grilling",
    intro: "Ask us directly about seafood packs, gourmet platters and individual skewers. We confirm availability, contents and the final price before preparing anything.",
    bbq: "Barbecue packs", gourmet: "Seafood gourmet platters", los: "Individual seafood for the grill", speciaal: "Special requests",
    speciaalIntro: "We prepare lobster platters and meals for people with coeliac disease by arrangement. We agree the contents, preparation day and safe handling with you in advance. The photo is a serving suggestion.",
    prijs: "Guide price", stuk: "each", vraag: "Ask on WhatsApp", foto: "Serving suggestion; contents and size may vary.",
    waarschuwing: "We also prepare gluten-free fish dishes for people with coeliac disease. Ask us about the designated day; your gluten-free order is confirmed only after we agree the details.",
    bericht: "Hello Schaap’s Vishandel, I would like to ask about", bevestig: "Could you confirm availability and the options?",
  },
  de: {
    kop: "Fisch für Grill und Tischgrill",
    intro: "Fragen Sie uns direkt nach Grillpaketen, Gourmetplatten und einzelnen Spießen. Wir bestätigen Verfügbarkeit, Inhalt und Endpreis, bevor wir etwas vorbereiten.",
    bbq: "Grillpakete", gourmet: "Fisch-Gourmetplatten", los: "Fisch für den Grill", speciaal: "Besondere Wünsche",
    speciaalIntro: "Hummerplatten und Gerichte für Menschen mit Zöliakie bereiten wir nach Absprache zu. Inhalt, Zubereitungstag und sichere Handhabung stimmen wir vorher mit Ihnen ab. Das Foto ist ein Servierbeispiel.",
    prijs: "Richtpreis", stuk: "pro Stück", vraag: "Per WhatsApp anfragen", foto: "Servierbeispiel; Inhalt und Größe können abweichen.",
    waarschuwing: "Wir bereiten auch glutenfreie Fischgerichte für Menschen mit Zöliakie zu. Fragen Sie nach dem geeigneten Tag; Ihre glutenfreie Bestellung gilt erst nach unserer Bestätigung.",
    bericht: "Hallo Schaap’s Vishandel, ich möchte fragen nach", bevestig: "Können Sie Verfügbarkeit und Möglichkeiten bestätigen?",
  },
} as const;

function Kaarten({ items, locale }: { items: SelectieItem[]; locale: keyof typeof TEKST }) {
  const t = TEKST[locale];
  return <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((item) => {
      const naam = selectieNaam(item.slug, locale);
      const bericht = `${t.bericht} ${naam} (${t.prijs.toLowerCase()} ${euro(item.prijs)}${item.perStuk ? ` ${t.stuk}` : ""}). ${t.bevestig}`;
      return <li id={item.slug} key={item.slug} className="flex flex-col overflow-hidden border border-[#d9e7ee] bg-white rounded-lg">
        <figure>
          <div className="relative aspect-[4/3] bg-[#f2f8fb]"><Image src={item.foto} alt={`${naam} — ${t.foto}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div>
          <figcaption className="px-5 py-2 text-xs text-[#547080]">{t.foto}</figcaption>
        </figure>
        <div className="p-5 pt-3 flex flex-col flex-1">
          <h3 className="text-[1.25rem] mb-2">{naam}</h3>
          <p className="mb-5 text-[#4d6370]">{t.prijs} <strong className="text-[#004f70]">{euro(item.prijs)}</strong>{item.perStuk ? ` ${t.stuk}` : ""}</p>
          <a className="knop knop-rood mt-auto" target="_blank" rel="noopener noreferrer" href={whatsappLink(bericht)}>{t.vraag}</a>
        </div>
      </li>;
    })}
  </ul>;
}

export function SelectieAanvraag({ locale, showSpecial = true, showBarbecue = true }: { locale: string; showSpecial?: boolean; showBarbecue?: boolean }) {
  const taal = locale === "en" || locale === "de" ? locale : "nl";
  const t = TEKST[taal];
  const speciaal = DIRKS_VISSCHALEN.filter((item) => item.alleenAanvraag);
  return <div className="space-y-14">
    {showSpecial && <section id="bijzondere-visschalen">
      <h2 className="text-[1.8rem] mb-2">{t.speciaal}</h2>
      <p className="max-w-3xl mb-6 text-[#4d6370]">{t.speciaalIntro}</p>
      <Kaarten items={speciaal} locale={taal} />
      <p className="mt-4 text-sm text-[#4d6370]">{t.waarschuwing}</p>
    </section>}
    {showBarbecue && <section id="barbecue-gourmet">
      <h2 className="text-[1.8rem] mb-2">{t.kop}</h2>
      <p className="max-w-3xl mb-8 text-[#4d6370]">{t.intro}</p>
      {(["barbecue", "gourmet", "los"] as const).map((groep) => <div key={groep} className="mb-12 last:mb-0">
        <h3 className="text-[1.45rem] mb-5">{groep === "barbecue" ? t.bbq : t[groep]}</h3>
        <Kaarten items={DIRKS_BARBECUE.filter((item) => item.groep === groep)} locale={taal} />
      </div>)}
    </section>}
  </div>;
}
