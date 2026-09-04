// Alleen serverzijde: dit bestand gebruikt de geheime SumUp-sleutel en mag nooit
// in een client component belanden. Wordt uitsluitend aangeroepen vanuit
// route handlers onder src/app/api/.

/**
 * Online afrekenen via SumUp.
 *
 * ┌─ EIGENAAR ────────────────────────────────────────────────────────────────┐
 * │ Zodra je SumUp-account klaarstaat zet je in Vercel twee omgevings-        │
 * │ variabelen:                                                               │
 * │                                                                           │
 * │   SUMUP_API_KEY        de geheime sleutel (begint met sup_sk_…)           │
 * │   SUMUP_MERCHANT_CODE  je merchant code (bijv. MABC1234)                  │
 * │                                                                           │
 * │ Meer is niet nodig. Zolang die twee ontbreken werkt de site gewoon door:  │
 * │ de klant bestelt, en betaalt bij de bezorger of aan de toonbank. Er komt  │
 * │ dus nooit een betaalknop in beeld die stukloopt.                          │
 * │                                                                           │
 * │ Sleutel NOOIT in de code zetten — die hoort in de omgevingsvariabelen.    │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Werking: onze server maakt een checkout aan bij SumUp en krijgt een URL van
 * een betaalpagina terug. De klant rekent daar af; kaartgegevens komen dus
 * nooit langs onze eigen server.
 */

const SUMUP_API = "https://api.sumup.com/v0.1";

export function sumupBeschikbaar(): boolean {
  return Boolean(process.env.SUMUP_API_KEY && process.env.SUMUP_MERCHANT_CODE);
}

export interface CheckoutVerzoek {
  /** Bedrag in euro's, met twee decimalen. */
  bedrag: number;
  /** Ons eigen bestelnummer — koppelt de betaling aan de bestelling. */
  referentie: string;
  /** Wat de klant op zijn afschrift ziet. */
  omschrijving: string;
  /** Waar SumUp de klant na afloop heen stuurt. */
  retourUrl: string;
  email?: string;
}

export interface CheckoutResultaat {
  id: string;
  betaalUrl: string;
}

/**
 * Maakt een SumUp-checkout aan en geeft de betaalpagina terug.
 * Gooit een fout als SumUp niet is ingesteld of het verzoek mislukt — de
 * aanroeper vangt dat op en laat de bestelling doorgaan zonder online betaling.
 */
export async function maakCheckout(verzoek: CheckoutVerzoek): Promise<CheckoutResultaat> {
  if (!sumupBeschikbaar()) {
    throw new Error("SumUp is nog niet ingesteld");
  }

  const response = await fetch(`${SUMUP_API}/checkouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUMUP_API_KEY}`,
    },
    body: JSON.stringify({
      amount: Number(verzoek.bedrag.toFixed(2)),
      currency: "EUR",
      checkout_reference: verzoek.referentie,
      merchant_code: process.env.SUMUP_MERCHANT_CODE,
      description: verzoek.omschrijving,
      redirect_url: verzoek.retourUrl,
      pay_to_email: verzoek.email,
      hosted_checkout: { enabled: true },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const tekst = await response.text().catch(() => "");
    throw new Error(`SumUp gaf ${response.status}: ${tekst.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    id?: string;
    hosted_checkout_url?: string;
  };

  if (!data.hosted_checkout_url) {
    throw new Error("SumUp gaf geen betaalpagina terug");
  }

  return { id: data.id ?? verzoek.referentie, betaalUrl: data.hosted_checkout_url };
}

export type BetaalStatus = "PENDING" | "PAID" | "FAILED" | "ONBEKEND";

/** Haalt de status van een checkout op — voor de bedanktpagina en controles. */
export async function checkoutStatus(checkoutId: string): Promise<BetaalStatus> {
  if (!sumupBeschikbaar()) return "ONBEKEND";

  const response = await fetch(`${SUMUP_API}/checkouts/${encodeURIComponent(checkoutId)}`, {
    headers: { Authorization: `Bearer ${process.env.SUMUP_API_KEY}` },
    cache: "no-store",
  });

  if (!response.ok) return "ONBEKEND";

  const data = (await response.json()) as { status?: string };
  switch (data.status) {
    case "PAID":
      return "PAID";
    case "FAILED":
      return "FAILED";
    case "PENDING":
      return "PENDING";
    default:
      return "ONBEKEND";
  }
}

/** Bestelnummer: SV-<jaar><maand><dag>-<vier tekens>. Kort genoeg om voor te lezen. */
export function nieuweReferentie(): string {
  const nu = new Date();
  const datum = [
    nu.getFullYear(),
    String(nu.getMonth() + 1).padStart(2, "0"),
    String(nu.getDate()).padStart(2, "0"),
  ].join("");
  const staart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SV-${datum}-${staart}`;
}
