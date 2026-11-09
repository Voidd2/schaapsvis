import Link from "next/link";
import { StaticResponsiveImage } from "@/components/StaticResponsiveImage";
import { BEELD } from "@/lib/beeld";
import { BEDRIJF, VERKOOPPUNTEN, type VerkooppuntId } from "@/lib/bedrijf";
import { openingRows } from "@/lib/openingHours";

const copy = {
  nl: {
    eyebrow: "Schaap’s Vishandel · Leiden sinds 1938",
    title: "Zalm halen in Leiden",
    intro: "Loop binnen aan de Herenstraat. Liever naar de markt? Woensdag staan we op de Botermarkt, zaterdag bij de Waag.",
    shop: "Viswinkel Herenstraat", wednesday: "Woensdag · Botermarkt", saturday: "Zaterdag · bij de Waag",
    route: "Plan uw route", routeTo: "Plan uw route naar", near: "bij", closed: "Zondag en maandag gesloten",
    extra: "Ook in Voorschoten", parking: "Parkeerplaats", all: "Alle locatiegegevens", note: "Voor een specifieke snit of een grotere hoeveelheid: vraag ons vooraf wat mogelijk is.",
  },
  en: {
    eyebrow: "Schaap’s Vishandel · In Leiden since 1938",
    title: "Where to buy our salmon in Leiden",
    intro: "Visit our Herenstraat shop or find us at Botermarkt on Wednesdays and by De Waag on Saturdays.",
    shop: "Herenstraat fish shop", wednesday: "Wednesday · Botermarkt", saturday: "Saturday · by De Waag",
    route: "Get directions", routeTo: "Get directions to", near: "by", closed: "Closed on Sunday and Monday",
    extra: "Also in Voorschoten", parking: "Car park", all: "All location details", note: "For a particular cut or larger quantity, please ask us in advance about the options.",
  },
  de: {
    eyebrow: "Schaap’s Vishandel · In Leiden seit 1938",
    title: "Hier bekommen Sie unseren Lachs in Leiden",
    intro: "Besuchen Sie uns in der Herenstraat. Auf dem Markt finden Sie uns mittwochs am Botermarkt und samstags bei der Waag.",
    shop: "Fischgeschäft Herenstraat", wednesday: "Mittwoch · Botermarkt", saturday: "Samstag · bei De Waag",
    route: "Route planen", routeTo: "Route planen nach", near: "bei", closed: "Sonntags und montags geschlossen",
    extra: "Auch in Voorschoten", parking: "Parkplatz", all: "Alle Standortinformationen", note: "Fragen Sie uns bei einem bestimmten Zuschnitt oder einer größeren Menge vorab nach den Möglichkeiten.",
  },
} as const;

export function VarlaksLocations({ locale }: { locale: keyof typeof copy }) {
  const c = copy[locale];
  const storefront = BEELD.winkelGevel;
  const places: { id: VerkooppuntId; title: string; hours: ReturnType<typeof openingRows> }[] = [
    { id: "winkel", title: c.shop, hours: openingRows("winkel", locale) },
    { id: "markt-woensdag", title: c.wednesday, hours: openingRows("markt", locale).filter(row => row.day === 3) },
    { id: "markt", title: c.saturday, hours: openingRows("markt", locale).filter(row => row.day === 6) },
  ];
  const voorschoten = VERKOOPPUNTEN.find(point => point.id === "voorschoten")!;
  return <section id="locaties" className="varlaks-locations" aria-labelledby="varlaks-locations-title">
    <div className="section-wrap">
      <p className="kapitaal">{c.eyebrow}</p>
      <h2 id="varlaks-locations-title">{c.title}</h2>
      <p className="varlaks-locations-intro">{c.intro}</p>
      <div className="varlaks-location-grid">{places.map(place => {
        const point = VERKOOPPUNTEN.find(item => item.id === place.id)!;
        const information = <>
          <h3>{place.title}</h3>
          <p>{point.adres.replace(", bij ", `, ${c.near} `)}<br />{place.id === "winkel" ? `${BEDRIJF.adres.postcode} ` : ""}{point.plaats}</p>
          <ul>{place.hours.map(row => <li key={row.label}><span>{row.label}</span><strong>{row.time}</strong></li>)}</ul>
          {place.id === "winkel" && <p className="varlaks-location-closed">{c.closed}</p>}
          <a className="knop knop-navy" href={point.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`${c.routeTo} ${place.title}`}>{c.route} ↗</a>
        </>;
        if (place.id === "winkel") {
          return <article key={place.id} className="varlaks-storefront">
            <div className="varlaks-storefront-view">
              <StaticResponsiveImage
                src={storefront.bestand}
                alt={locale === "nl" ? storefront.alt : storefront.vertalingen[locale].alt}
                width={1320} height={984}
                sizes="(max-width: 699px) 100vw, (max-width: 1199px) 47vw, 34vw"
                className="varlaks-storefront-photo"
              />
            </div>
            <div className="varlaks-location-card">{information}</div>
          </article>;
        }
        return <article key={place.id} className="varlaks-location-card">{information}</article>;
      })}</div>
      <div className="varlaks-extra-location">
        <div><h3>{c.extra}</h3><p>{voorschoten.adres.replace("Parkeerplaats", c.parking)} · {voorschoten.plaats}<br />{openingRows("voorschoten", locale).map(row => `${row.label} ${row.time}`).join(" · ")}</p></div>
        <a className="knop knop-lijn" href={voorschoten.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`${c.routeTo} Hoogvliet Voorschoten`}>{c.route} ↗</a>
      </div>
      <div className="varlaks-location-notes"><p>{c.note}</p><Link href={`/${locale}/bezoek-ons`}>{c.all} →</Link></div>
    </div>
  </section>;
}
