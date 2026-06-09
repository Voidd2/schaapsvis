// Recepten met dank aan visrecepten.nl — overgenomen met toestemming
// prettier-ignore
export const receptenVisrecepten: {
  slug: string;
  title: string;
  subtitle: string;
  tijd: string;
  moeilijkheid: "Makkelijk" | "Gemiddeld" | "Uitdagend";
  tags: ("Snel" | "Met de kids" | "Zomers" | "Bijzonder" | "Makkelijk" | "Gezond")[];
  fotoUrl?: string;
  fotoLabel: string;
  vanSchaap: string[];
  vanSupermarkt: string[];
  bereidingswijze: string[];
  verhaal: string;
  highlight?: string;
  seoKeywords?: string;
}[] = [];
