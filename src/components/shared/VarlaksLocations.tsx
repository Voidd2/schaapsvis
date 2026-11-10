import Link from "next/link";
import { StaticResponsiveImage } from "@/components/StaticResponsiveImage";
import { BEELD } from "@/lib/beeld";
import { BEDRIJF, VERKOOPPUNTEN, type VerkooppuntId } from "@/lib/bedrijf";
import { openingRows } from "@/lib/openingHours";

const copy = {
  nl: {
    eyebrow: "Schaap’s Vishandel · Leiden sinds 1938",
    title: "Zalm halen in Leiden en Voorschoten",
    intro: "U vindt ons in de winkel aan de Herenstraat. Op woensdag staan we op de Botermarkt in Leiden, op vrijdag op het parkeerterrein bij Hoogvliet in Voorschoten en op zaterdag bij de Waag in Leiden.",
    shop: "Viswinkel Herenstraat", wednesday: "Woensdag · Botermarkt", saturday: "Zaterdag · bij de Waag",
    route: "Plan uw route", routeTo: "Plan uw route naar", near: "bij", closed: "Zondag en maandag gesloten",
    friday: "Vrijdag · Voorschoten", parking: "Parkeerplaats", all: "Alle locatiegegevens",
  },
  en: {
    eyebrow: "Schaap’s Vishandel · In Leiden since 1938",
    title: "Where to buy our salmon in Leiden and Voorschoten",
    intro: "Visit our Herenstraat shop or find our stall at Botermarkt in Leiden on Wednesdays, in the Hoogvliet car park in Voorschoten on Fridays and by De Waag in Leiden on Saturdays.",
    shop: "Herenstraat fish shop", wednesday: "Wednesday · Botermarkt", saturday: "Saturday · by De Waag",
    route: "Get directions", routeTo: "Get directions to", near: "by", closed: "Closed on Sunday and Monday",
    friday: "Friday · Voorschoten", parking: "Car park", all: "All location details",
  },
  de: {
    eyebrow: "Schaap’s Vishandel · In Leiden seit 1938",
    title: "Unser Lachs in Leiden und Voorschoten",
    intro: "Besuchen Sie unseren Laden in der Herenstraat. Mittwochs finden Sie uns am Botermarkt in Leiden, freitags auf dem Parkplatz bei Hoogvliet in Voorschoten und samstags bei der Waag in Leiden.",
    shop: "Fischgeschäft Herenstraat", wednesday: "Mittwoch · Botermarkt", saturday: "Samstag · bei De Waag",
    route: "Route planen", routeTo: "Route planen nach", near: "bei", closed: "Sonntags und montags geschlossen",
    friday: "Freitag · Voorschoten", parking: "Parkplatz", all: "Alle Standortinformationen",
  },
} as const;

export function VarlaksLocations({ locale }: { locale: keyof typeof copy }) {
  const c = copy[locale];
  const storefront = BEELD.winkelGevel;
  const places: { id: VerkooppuntId; title: string; hours: ReturnType<typeof openingRows> }[] = [
    { id: "winkel", title: c.shop, hours: openingRows("winkel", locale) },
    { id: "markt-woensdag", title: c.wednesday, hours: openingRows("markt", locale).filter(row => row.day === 3) },
    { id: "voorschoten", title: c.friday, hours: openingRows("voorschoten", locale) },
    { id: "markt", title: c.saturday, hours: openingRows("markt", locale).filter(row => row.day === 6) },
  ];
  return <section id="locaties" className="varlaks-locations" aria-labelledby="varlaks-locations-title">
    <div className="section-wrap">
      <p className="kapitaal">{c.eyebrow}</p>
      <h2 id="varlaks-locations-title">{c.title}</h2>
      <p className="varlaks-locations-intro">{c.intro}</p>
      <div className="varlaks-location-grid">{places.map(place => {
        const point = VERKOOPPUNTEN.find(item => item.id === place.id)!;
        const information = <>
          <h3>{place.title}</h3>
          <p>{point.adres.replace(", bij ", `, ${c.near} `).replace("Parkeerplaats", c.parking)}<br />{place.id === "winkel" ? `${BEDRIJF.adres.postcode} ` : ""}{point.plaats}</p>
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
      <div className="varlaks-location-notes"><Link href={`/${locale}/bezoek-ons`}>{c.all} →</Link></div>
    </div>
  </section>;
}
