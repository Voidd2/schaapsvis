// ─── Kortingsbon-campagne ──────────────────────────────────────────────────
// Eigenaar: stel hier de ACTIEVE kortingsactie in. De unieke codes per klant
// worden door je e-mailprogramma (nieuwsbrief/ESP) gegenereerd en in de mail
// gezet als link: https://www.schaapsvishandel.nl/nl/kortingsbon/<UNIEKE-CODE>
//
// Elke code kan (per apparaat) één keer geactiveerd worden en is daarna
// `geldigheidMinuten` lang geldig — daarna verloopt de bon automatisch.
// Zet `actief: false` om de actie te stoppen.

export interface KortingsCampagne {
  actief: boolean;
  id: string; // verander dit bij een NIEUWE actie (reset alle bonnen)
  titel: string;
  tekst: string;
  voorwaarde?: string;
  geldigheidMinuten: number;
}

export const actieveBon: KortingsCampagne = {
  actief: true,
  id: "welkom-2026",
  titel: "10% korting op verse vis",
  tekst:
    "Bedankt dat u onze nieuwsbrief volgt! Laat deze bon zien aan de kassa en ontvang 10% korting op uw verse vis.",
  voorwaarde:
    "Eén keer geldig per klant, alleen in de winkel of op de markt. Niet geldig in combinatie met andere aanbiedingen. Toon dit scherm live aan de medewerker.",
  geldigheidMinuten: 10,
};
