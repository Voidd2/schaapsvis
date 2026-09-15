/**
 * Alle bedrijfsgegevens op één plek.
 *
 * Staat een adres, telefoonnummer of openingstijd verkeerd? Pas het hier aan en
 * het klopt overal: op de pagina's, in de footer, in de sitemap én in de
 * schema.org-gegevens die Google uitleest. Voor lokale vindbaarheid is het
 * cruciaal dat naam, adres en telefoonnummer (NAP) overal identiek zijn — ook
 * met je Google Bedrijfsprofiel en de vermeldingen op andere sites.
 */

export const BEDRIJF = {
  naam: "Schaap's Vishandel",
  naamKort: "Schaap's Vis",
  /** Zoals mensen de zaak in Leiden noemen — gebruikt in schema.org alternateName. */
  ookBekendAls: [
    "Schaaps Vis",
    "Schaaps Vis Leiden",
    "Vishandel Schaap",
    "Vishandel Schaap Leiden",
    "Schaap de visboer",
    "Visboer Herenstraat",
  ],
  opgericht: "1938",
  oprichter: "Gerrit Schaap",
  eigenaar: "Aldert Haasnoot",

  adres: {
    straat: "Herenstraat 48",
    postcode: "2313 AL",
    plaats: "Leiden",
    provincie: "Zuid-Holland",
    land: "NL",
  },

  geo: { lat: 52.1517798, lng: 4.4891644 },

  telefoon: {
    weergave: "071 514 9802",
    /** E.164 — voor tel:-links en schema.org. */
    e164: "+31715149802",
  },

  /** Zelfde nummer, zonder plus — voor wa.me-links. */
  whatsapp: "31715149802",

  /** EIGENAAR: vul hier je e-mailadres in; zolang dit null is toont de site geen e-mail. */
  email: null as string | null,

  domein: "https://www.schaapsvishandel.nl",

  socials: {
    facebook: "https://www.facebook.com/schaapsvishandel/",
    instagram: "https://www.instagram.com/schaapsvishandel/",
  },

  maps: {
    route: "https://maps.google.com/?q=Herenstraat+48,+2313+AL+Leiden",
    profiel:
      "https://www.google.com/maps/place/Schaap%27s+Vishandel/@52.1517798,4.4891644,17z/data=!4m6!3m5!1s0x47c5c68b327c5b31:0xb364be6e52553f5!8m2!3d52.1517798!4d4.4891644!16s%2Fg%2F1ptw4b069",
  },
} as const;

/** "Herenstraat 48, 2313 AL Leiden" */
export const ADRES_REGEL = `${BEDRIJF.adres.straat}, ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats}`;

/* ═══════════════════════════════════════════════════════════════════════════
   Betaalmethodes
   ───────────────────────────────────────────────────────────────────────────
   Online afrekenen loopt straks via SumUp. Zolang de sleutels nog niet in de
   omgevingsvariabelen staan (zie src/lib/betalen.ts) toont de site eerlijk dat
   je bij de bezorger of in de winkel betaalt — er wordt dus nooit een
   betaalknop getoond die niet werkt.
   ═══════════════════════════════════════════════════════════════════════════ */

export const BETAALMETHODES = {
  /** Nu al mogelijk, aan de deur of aan de toonbank. */
  nu: ["Pinnen", "Contant"],
  /** Komt met SumUp — wordt op de site aangekondigd als "binnenkort". */
  binnenkort: ["iDEAL", "Bancontact", "Creditcard", "Apple Pay", "Google Pay"],
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   Verkooppunten
   ═══════════════════════════════════════════════════════════════════════════ */

export type VerkooppuntId = "winkel" | "markt" | "markt-woensdag" | "voorschoten";

export interface Verkooppunt {
  id: VerkooppuntId;
  naam: string;
  adres: string;
  plaats: string;
  dagen: string;
  mapsUrl: string;
}

export const VERKOOPPUNTEN: Verkooppunt[] = [
  {
    id: "winkel",
    naam: "De winkel",
    adres: BEDRIJF.adres.straat,
    plaats: "Leiden",
    dagen: "dinsdag t/m vrijdag 09:00–18:00, zaterdag tot 17:00",
    mapsUrl: BEDRIJF.maps.route,
  },
  {
    id: "markt",
    naam: "Zaterdagmarkt",
    adres: "Aalmarkt, bij de Waag",
    plaats: "Leiden",
    dagen: "zaterdag 08:30–17:00",
    mapsUrl: "https://maps.google.com/?q=Aalmarkt+Leiden",
  },
  {
    id: "markt-woensdag",
    naam: "Woensdagmarkt",
    adres: "Woensdagmarkt Leiden — standplaats op aanvraag",
    plaats: "Leiden",
    dagen: "woensdag 08:30–17:00",
    mapsUrl: "https://maps.google.com/?q=Woensdagmarkt+Leiden",
  },
  {
    id: "voorschoten",
    naam: "Bij Hoogvliet",
    adres: "Parkeerplaats Hoogvliet",
    plaats: "Voorschoten",
    dagen: "vrijdag 08:30–17:30",
    mapsUrl: "https://maps.google.com/?q=Hoogvliet+Voorschoterweg+Voorschoten",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   WhatsApp
   ═══════════════════════════════════════════════════════════════════════════ */

export function whatsappLink(bericht: string): string {
  return `https://wa.me/${BEDRIJF.whatsapp}?text=${encodeURIComponent(bericht)}`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Bedragen
   ═══════════════════════════════════════════════════════════════════════════ */

/** 12.5 → "€ 12,50" — Nederlands decimaalteken, altijd twee decimalen. */
export function euro(bedrag: number): string {
  return `€ ${bedrag.toFixed(2).replace(".", ",")}`;
}
