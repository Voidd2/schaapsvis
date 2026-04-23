export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Schaap's Vishandel",
    alternateName: "Schaaps Vis",
    description:
      "Verse vis, kibbeling en biologische zalm in Leiden. Al 86 jaar op de Herenstraat.",
    url: "https://schaapsvis.nl",
    telephone: "+31715149802",
    foundingDate: "1938",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Herenstraat 48",
      addressLocality: "Leiden",
      postalCode: "2313 AL",
      addressCountry: "NL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 52.1595,
      longitude: 4.494,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "€€",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
