export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "@id": "https://schaapsvis.nl",
    name: "Schaap's Vishandel",
    alternateName: ["Schaaps Vis", "Schaaps Vis Leiden", "Vishandel Schaap Leiden", "Schaap de visboer"],
    description:
      "Schaap's Vishandel in Leiden verkoopt verse vis, kibbeling, haring, biologische Varlaks zalm en duurzame vis. Al 86 jaar op de Herenstraat 48 in Leiden — de beste viswinkel van Leiden.",
    url: "https://schaapsvis.nl",
    telephone: "+31715149802",
    foundingDate: "1938",
    founder: {
      "@type": "Person",
      name: "Gerrit Schaap",
    },
    employee: {
      "@type": "Person",
      name: "Aldert Haasnoot",
      jobTitle: "Eigenaar",
    },
    servesCuisine: ["Seafood", "Dutch", "Vis"],
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Credit Card, Pin",
    areaServed: [
      { "@type": "City", name: "Leiden" },
      { "@type": "City", name: "Voorschoten" },
    ],
    keywords:
      "viswinkel Leiden, verse vis Leiden, kibbeling Leiden, haring Leiden, biologische zalm Leiden, Varlaks zalm, duurzame vis Leiden, visboer Leiden, vishandel Leiden, Herenstraat Leiden, schaapsvis",
    sameAs: [
      "https://www.facebook.com/schaapsvishandel/",
      "https://maps.google.com/?q=Herenstraat+48,+2313+AL+Leiden",
    ],
    hasMap: "https://maps.google.com/?q=Herenstraat+48,+2313+AL+Leiden",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Herenstraat 48",
      addressLocality: "Leiden",
      addressRegion: "Zuid-Holland",
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
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
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
    location: [
      {
        "@type": "LocalBusiness",
        name: "Schaap's Vis — Markt Leiden",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Nieuwe Rijn",
          addressLocality: "Leiden",
          addressCountry: "NL",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Wednesday", "Saturday"],
            opens: "09:00",
            closes: "17:00",
          },
        ],
      },
      {
        "@type": "LocalBusiness",
        name: "Schaap's Vis — Hoogvliet Voorschoten",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Bij Hoogvliet",
          addressLocality: "Voorschoten",
          addressCountry: "NL",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Friday"],
            opens: "08:30",
            closes: "16:00",
          },
        ],
      },
    ],
    menu: "https://schaapsvis.nl/nl/assortiment",
    acceptsReservations: false,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Schaap's Vis assortiment",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Kibbeling" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Haring" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Lekkerbek" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Varlaks biologische zalm" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "Vissoep" } },
      ],
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Schaap's Vis Leiden",
        item: "https://schaapsvis.nl",
      },
    ],
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Schaap's Vishandel Leiden",
    "@id": "https://schaapsvis.nl/#localbusiness",
    url: "https://schaapsvis.nl",
    telephone: "+31715149802",
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
    priceRange: "€€",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
    </>
  );
}
