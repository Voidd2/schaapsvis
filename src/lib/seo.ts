import type { Metadata } from "next";
import { BEDRIJF, ADRES_REGEL } from "@/lib/bedrijf";
import { BEZORGING, GEMEENTEN, kostenVoor } from "@/lib/bezorging";

/**
 * Eén plek voor alles wat zoekmachines van een pagina moeten weten.
 *
 * Waarom dit bestand bestaat: elke pagina schreef zijn eigen canonical- en
 * hreflang-regels, en overal stond net iets anders. Eén fout in die gegevens en
 * Google kiest zelf welke taalversie hij toont — precies het probleem dat je
 * niet wilt als je in het Nederlands, Engels én Duits gevonden wilt worden.
 */

export const LOCALES = ["nl", "en", "de"] as const;
export type Locale = (typeof LOCALES)[number];

/** Canonical + hreflang voor een pad dat in alle drie de talen bestaat. */
export function alternates(locale: string, pad: string) {
  const schoon = pad === "/" ? "" : pad;
  const talen: Record<string, string> = {};
  for (const taal of LOCALES) talen[taal] = `/${taal}${schoon}`;
  talen["x-default"] = `/nl${schoon}`;
  return {
    canonical: `/${locale}${schoon}`,
    languages: talen,
  };
}

interface PaginaSeo {
  locale: string;
  /** Pad zonder taalvoorvoegsel, bijvoorbeeld "/bezorgen/leiden". */
  pad: string;
  title: string;
  description: string;
  image?: string;
  /** Zet op true voor pagina's die niet in de zoekresultaten horen. */
  geenIndex?: boolean;
}

export function paginaMetadata({
  locale,
  pad,
  title,
  description,
  image = "/og-image.png",
  geenIndex,
}: PaginaSeo): Metadata {
  return {
    title,
    description,
    alternates: alternates(locale, pad),
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: `${BEDRIJF.domein}${image}`, alt: title }],
      url: `${BEDRIJF.domein}/${locale}${pad === "/" ? "" : pad}`,
    },
    ...(geenIndex ? { robots: { index: false, follow: true } } : {}),
    twitter: { card: "summary_large_image", title, description, images: [`${BEDRIJF.domein}${image}`] },
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   schema.org
   ───────────────────────────────────────────────────────────────────────────
   Gestructureerde gegevens zijn wat Google en de AI-antwoorden bovenaan de
   zoekresultaten uitlezen. Voor een winkel met een fysiek adres is dat het
   verschil tussen "een site over vis" en "de viswinkel op de Herenstraat 48 in
   Leiden, open tot 18:00, die ook in Wassenaar bezorgt".
   ═══════════════════════════════════════════════════════════════════════════ */

const ADRES = {
  "@type": "PostalAddress",
  streetAddress: BEDRIJF.adres.straat,
  addressLocality: BEDRIJF.adres.plaats,
  addressRegion: BEDRIJF.adres.provincie,
  postalCode: BEDRIJF.adres.postcode,
  addressCountry: BEDRIJF.adres.land,
} as const;

const GEO = {
  "@type": "GeoCoordinates",
  latitude: BEDRIJF.geo.lat,
  longitude: BEDRIJF.geo.lng,
} as const;

const OPENINGSTIJDEN = [
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
];

/** De winkel zelf. Eén @id, zodat alle andere blokken ernaar kunnen verwijzen. */
export function winkelSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "@id": `${BEDRIJF.domein}/#winkel`,
    name: BEDRIJF.naam,
    alternateName: [...BEDRIJF.ookBekendAls],
    description:
      locale === "de"
        ? "Familienfischhandlung in der Herenstraat 48 in Leiden, seit 1938. Frischer und geräucherter Fisch, Fischplatten und persönliche Beratung."
        : locale === "en"
          ? "Family fishmonger at Herenstraat 48 in Leiden, trading since 1938. Fresh and smoked fish, seafood platters and personal advice."
          : "Viswinkel aan de Herenstraat 48 in Leiden, sinds 1938. Verse en gerookte vis, visschalen en persoonlijk advies over herkomst en bereiding.",
    url: `${BEDRIJF.domein}/${locale}`,
    telephone: BEDRIJF.telefoon.e164,
    address: ADRES,
    geo: GEO,
    hasMap: BEDRIJF.maps.profiel,
    image: `${BEDRIJF.domein}/og-image.png`,
    logo: `${BEDRIJF.domein}/og-image.png`,
    foundingDate: BEDRIJF.opgericht,
    founder: { "@type": "Person", name: BEDRIJF.oprichter },
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Contant, Pin, Maestro, V Pay",
    openingHoursSpecification: OPENINGSTIJDEN,
    sameAs: [BEDRIJF.socials.facebook, BEDRIJF.socials.instagram, BEDRIJF.maps.profiel],
    // Elke gemeente waar we bezorgen apart benoemen: zo weet Google dat deze
    // winkel ook relevant is voor iemand die in Wassenaar zoekt.
    areaServed: GEMEENTEN.map((g) => ({
      "@type": "City",
      name: g.naam,
      address: { "@type": "PostalAddress", addressLocality: g.naam, addressCountry: "NL" },
    })),
    knowsLanguage: ["nl", "en", "de"],
  };
}

/** De bezorgdienst als aparte dienst, met tarief per gemeente. */
export function bezorgdienstSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BEDRIJF.domein}/#bezorgdienst`,
    serviceType:
      locale === "de"
        ? "Fischplatten auf Anfrage"
        : locale === "en"
          ? "Seafood platter enquiries"
          : "Visschalen op aanvraag",
    provider: { "@id": `${BEDRIJF.domein}/#winkel` },
    areaServed: GEMEENTEN.map((g) => ({ "@type": "City", name: g.naam })),
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${BEDRIJF.domein}/${locale}/visschalen`,
      servicePhone: BEDRIJF.telefoon.e164,
      serviceLocation: { "@type": "Place", address: ADRES },
    },
    offers: GEMEENTEN.map((g) => ({
      "@type": "Offer",
      name: `Bezorging ${g.naam}`,
      priceSpecification: {
        "@type": "DeliveryChargeSpecification",
        price: kostenVoor(g),
        priceCurrency: "EUR",
        eligibleTransactionVolume: {
          "@type": "PriceSpecification",
          minPrice: BEZORGING.minimumBedrag,
          priceCurrency: "EUR",
        },
        eligibleRegion: { "@type": "City", name: g.naam },
      },
    })),
  };
}

export function organisatieSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BEDRIJF.domein}/#organisatie`,
    name: BEDRIJF.naam,
    alternateName: BEDRIJF.naamKort,
    url: BEDRIJF.domein,
    logo: `${BEDRIJF.domein}/og-image.png`,
    foundingDate: BEDRIJF.opgericht,
    address: ADRES,
    telephone: BEDRIJF.telefoon.e164,
    sameAs: [BEDRIJF.socials.facebook, BEDRIJF.socials.instagram],
  };
}

export function websiteSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BEDRIJF.domein}/#website`,
    url: BEDRIJF.domein,
    name: BEDRIJF.naam,
    inLanguage: locale,
    publisher: { "@id": `${BEDRIJF.domein}/#organisatie` },
  };
}

/** Kruimelpad. Google toont dit als het pad onder de zoekresultaattitel. */
export function kruimelSchema(
  locale: string,
  kruimels: { naam: string; pad: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: kruimels.map((k, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: k.naam,
      item: `${BEDRIJF.domein}/${locale}${k.pad === "/" ? "" : k.pad}`,
    })),
  };
}

/** Vraag-en-antwoordblok. Wordt uitgelezen door zowel Google als AI-antwoorden. */
export function vraagSchema(vragen: { v: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: vragen.map((q) => ({
      "@type": "Question",
      name: q.v,
      acceptedAnswer: { "@type": "Answer", text: q.a },
    })),
  };
}

export { ADRES_REGEL };

/* ═══════════════════════════════════════════════════════════════════════════
   Pagina's die maar in één taal bestaan
   ───────────────────────────────────────────────────────────────────────────
   Sommige pagina's zijn er alleen in het Nederlands (de blog, de recepten, de
   marktkraam) of alleen in het Duits (de landingspagina voor Duitse
   bezoekers). Die zijn wél bereikbaar onder /nl/, /en/ én /de/, en dan staat
   dezelfde tekst dus op drie adressen. Google ziet dan drie pagina's die
   elkaar beconcurreren en kiest er zelf één — meestal niet degene die je
   bedoelde.

   Met één canonical naar de taal waarin de pagina echt geschreven is, komt
   alle waarde op dat ene adres terecht. `paren` koppelt daarnaast pagina's die
   elkaars vertaling zijn onder een ánder pad — bijvoorbeeld de Nederlandse
   /viswinkel-leiden en de Duitse /frischer-fisch-leiden.
   ═══════════════════════════════════════════════════════════════════════════ */

interface EenTaalSeo {
  /** De taal waarin deze pagina geschreven is. */
  taal: Locale;
  /** Pad zonder taalvoorvoegsel. */
  pad: string;
  title: string;
  description: string;
  image?: string;
  /** Vertalingen die onder een ander pad staan, als { taal: pad }. */
  paren?: Partial<Record<Locale, string>>;
}

export function eenTaalMetadata({
  taal,
  pad,
  title,
  description,
  paren,
  image = "/og-image.png",
}: EenTaalSeo): Metadata {
  const talen: Record<string, string> = { [taal]: `/${taal}${pad}` };
  for (const [andereTaal, anderPad] of Object.entries(paren ?? {})) {
    talen[andereTaal] = `/${andereTaal}${anderPad}`;
  }
  talen["x-default"] = talen.nl ?? `/${taal}${pad}`;

  return {
    title,
    description,
    alternates: { canonical: `/${taal}${pad}`, languages: talen },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: `${BEDRIJF.domein}${image}`, alt: title }],
      url: `${BEDRIJF.domein}/${taal}${pad}`,
    },
    twitter: { card: "summary_large_image", title, description, images: [`${BEDRIJF.domein}${image}`] },
  };
}
