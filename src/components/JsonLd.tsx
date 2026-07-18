import { googleReviews, googleRating, googleReviewCount } from "@/lib/reviews";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "@id": "https://www.schaapsvishandel.nl",
    name: "Schaap's Vishandel",
    alternateName: ["Schaaps Vis", "Schaaps Vis Leiden", "Vishandel Schaap Leiden", "Schaap de visboer"],
    description:
      "Schaap's Vishandel in Leiden verkoopt verse vis, kibbeling, haring, biologische Varlaks zalm en duurzame vis. Al 86 jaar op de Herenstraat 48 in Leiden — de beste viswinkel van Leiden.",
    url: "https://www.schaapsvishandel.nl",
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
      "https://www.instagram.com/schaapsvishandel/",
      "https://maps.google.com/?q=Herenstraat+48,+2313+AL+Leiden",
    ],
    hasMap: "https://www.google.com/maps/place/Schaap%27s+Vishandel/@52.1517798,4.4891644,17z/data=!4m6!3m5!1s0x47c5c68b327c5b31:0xb364be6e52553f5!8m2!3d52.1517798!4d4.4891644!16s%2Fg%2F1ptw4b069",
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
      latitude: 52.1517798,
      longitude: 4.4891644,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: googleRating,
      reviewCount: googleReviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    review: googleReviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: String(r.stars), bestRating: "5" },
      reviewBody: r.text,
      datePublished: r.datePublished,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "17:00",
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
            opens: "08:30",
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
            closes: "17:30",
          },
        ],
      },
    ],
    menu: "https://www.schaapsvishandel.nl/nl/assortiment",
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
        item: "https://www.schaapsvishandel.nl",
      },
    ],
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.schaapsvishandel.nl/#organization",
    name: "Schaap's Vishandel",
    alternateName: "Schaap's Vis Leiden",
    url: "https://www.schaapsvishandel.nl",
    logo: "https://www.schaapsvishandel.nl/og-image.png",
    foundingDate: "1938",
    sameAs: [
      "https://www.facebook.com/schaapsvishandel/",
      "https://www.instagram.com/schaapsvishandel/",
    ],
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Schaap's Vishandel Leiden",
    "@id": "https://www.schaapsvishandel.nl/#localbusiness",
    url: "https://www.schaapsvishandel.nl",
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
      latitude: 52.1517798,
      longitude: 4.4891644,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
    </>
  );
}
