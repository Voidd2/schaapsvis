import Link from "next/link";
import { BEDRIJF, VERKOOPPUNTEN, type VerkooppuntId } from "@/lib/bedrijf";
import { openingRows } from "@/lib/openingHours";

const copy = {
  nl: {
    eyebrow: "Schaap’s Vishandel · Leiden sinds 1938",
    title: "Ook bij u in de buurt in Leiden",
    intro: "U vindt ons in de Herenstraat en op de Leidse markt. Kies de plek en dag die u uitkomen. We helpen u graag met een mooie portie zalm en advies voor thuis.",
    shop: "Viswinkel Herenstraat", wednesday: "Woensdag · Botermarkt", saturday: "Zaterdag · bij de Waag",
    route: "Plan uw route", routeTo: "Plan uw route naar", near: "bij", closed: "Zondag en maandag gesloten",
    extra: "Ook in Voorschoten", parking: "Parkeerplaats", all: "Alle locatiegegevens", note: "Voor een specifieke snit of een grotere hoeveelheid: vraag ons vooraf wat mogelijk is.",
  },
  en: {
    eyebrow: "Schaap’s Vishandel · In Leiden since 1938",
    title: "Find us near you in Leiden",
    intro: "Visit our shop on Herenstraat or our stalls at Leiden’s market. Choose the place and day that suit you. We are happy to help with salmon portions and cooking advice.",
    shop: "Herenstraat fish shop", wednesday: "Wednesday · Botermarkt", saturday: "Saturday · by De Waag",
    route: "Get directions", routeTo: "Get directions to", near: "by", closed: "Closed on Sunday and Monday",
    extra: "Also in Voorschoten", parking: "Car park", all: "All location details", note: "For a particular cut or larger quantity, please ask us in advance about the options.",
  },
  de: {
    eyebrow: "Schaap’s Vishandel · In Leiden seit 1938",
    title: "Auch in Ihrer Nähe in Leiden",
    intro: "Besuchen Sie unser Geschäft in der Herenstraat oder unsere Stände auf dem Leidener Markt. Wählen Sie den passenden Ort und Tag. Wir beraten Sie gern zu Lachsportionen und zur Zubereitung.",
    shop: "Fischgeschäft Herenstraat", wednesday: "Mittwoch · Botermarkt", saturday: "Samstag · bei De Waag",
    route: "Route planen", routeTo: "Route planen nach", near: "bei", closed: "Sonntags und montags geschlossen",
    extra: "Auch in Voorschoten", parking: "Parkplatz", all: "Alle Standortinformationen", note: "Fragen Sie uns bei einem bestimmten Zuschnitt oder einer größeren Menge vorab nach den Möglichkeiten.",
  },
} as const;

export function VarlaksLocations({ locale }: { locale: keyof typeof copy }) {
  const c = copy[locale];
  const places: { id: VerkooppuntId; title: string; hours: ReturnType<typeof openingRows> }[] = [
    { id: "winkel", title: c.shop, hours: openingRows("winkel", locale) },
    { id: "markt-woensdag", title: c.wednesday, hours: openingRows("markt", locale).filter(row => row.days.includes(3)) },
    { id: "markt", title: c.saturday, hours: openingRows("markt", locale).filter(row => row.days.includes(6)) },
  ];
  const voorschoten = VERKOOPPUNTEN.find(point => point.id === "voorschoten")!;
  return <section id="locaties" className="varlaks-locations" aria-labelledby="varlaks-locations-title">
    <div className="section-wrap">
      <p className="kapitaal">{c.eyebrow}</p>
      <h2 id="varlaks-locations-title">{c.title}</h2>
      <p className="varlaks-locations-intro">{c.intro}</p>
      <div className="varlaks-location-grid">{places.map(place => {
        const point = VERKOOPPUNTEN.find(item => item.id === place.id)!;
        return <article key={place.id} className="varlaks-location-card">
          <h3>{place.title}</h3>
          <p>{point.adres.replace(", bij ", `, ${c.near} `)}<br />{place.id === "winkel" ? `${BEDRIJF.adres.postcode} ` : ""}{point.plaats}</p>
          <ul>{place.hours.map(row => <li key={row.label}><span>{row.label}</span><strong>{row.time}</strong></li>)}</ul>
          {place.id === "winkel" && <p className="varlaks-location-closed">{c.closed}</p>}
          <a className="knop knop-navy" href={point.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`${c.routeTo} ${place.title}`}>{c.route} ↗</a>
        </article>;
      })}</div>
      <div className="varlaks-extra-location">
        <div><h3>{c.extra}</h3><p>{voorschoten.adres.replace("Parkeerplaats", c.parking)} · {voorschoten.plaats}<br />{openingRows("voorschoten", locale).map(row => `${row.label} ${row.time}`).join(" · ")}</p></div>
        <a className="knop knop-lijn" href={voorschoten.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`${c.routeTo} Hoogvliet Voorschoten`}>{c.route} ↗</a>
      </div>
      <div className="varlaks-location-notes"><p>{c.note}</p><Link href={`/${locale}/bezoek-ons`}>{c.all} →</Link></div>
    </div>
  </section>;
}
