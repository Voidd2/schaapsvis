export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Schaap's Vishandel",
    alternateName: ["Schaaps Vis", "Vishandel Schaap Leiden"],
    description:
      "Verse vis, kibbeling, haring en biologische Varlaks zalm in Leiden. Al 86 jaar op de Herenstraat.",
    url: "https://schaapsvis.nl",
    telephone: "+31715149802",
    foundingDate: "1938",
    servesCuisine: "Seafood",
    priceRange: "€€",
    sameAs: ["https://www.facebook.com/schaapsvishandel/"],
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
        ],
        opens: "08:30",
        closes: "17:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "08:00",
        closes: "16:00",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
