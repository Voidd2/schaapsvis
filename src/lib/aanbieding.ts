// ─── Aanbieding van de week ────────────────────────────────────────────────
// Eigenaar: pas dit aan voor een handmatige aanbieding/mededeling. Laat `null`
// staan om automatisch het seizoensbericht (op basis van de viskalender) te tonen.
//
// Voorbeeld:
//   export const aanbiedingVanDeWeek: Aanbieding | null = {
//     titel: "Aanbieding deze week",
//     tekst: "Hollandse garnalen — vers gepeld, deze week extra voordelig.",
//   };

export interface Aanbieding {
  titel: string;
  tekst: string;
}

export const aanbiedingVanDeWeek: Aanbieding | null = null;
