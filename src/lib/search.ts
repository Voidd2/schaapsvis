// Slimme productzoek voor assortiment + bestelformulier.
// Doel: klanten vinden hun vis ook bij een tikfout ("kibbeing"), een afkorting
// ("kibb"), of een andere/anderstalige naam ("salmon", "maatjes", "gambas").
//
// Drie lagen:
//   1. substring        → dekt volledige én prefix-/afkortingsmatches
//   2. synoniemen       → kruistaal (NL/EN/DE) en spreektaal
//   3. tikfout-tolerantie (Levenshtein) op losse woorden

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // diacritische tekens verwijderen
    .replace(/[^a-z0-9\s'&-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Synoniemgroepen — alle termen binnen één groep matchen elkaar.
// Afkortingen die een prefix zijn ("kibb" ⊂ "kibbeling") worden al door de
// substring-laag afgevangen; deze lijst voegt vooral kruistaal en alternatieve
// namen toe.
const SYNONYM_GROUPS: string[][] = [
  ["zalm", "salmon", "lachs", "lax"],
  ["haring", "herring", "hering", "maatjes", "maatjesharing", "nieuwe haring", "hollandse nieuwe"],
  ["garnalen", "garnaal", "shrimp", "shrimps", "prawns", "gamba", "gambas", "gamba's", "crevettes"],
  ["tong", "sole", "zeetong", "tongfilet"],
  ["kabeljauw", "cod", "skrei", "kabeljauwfilet"],
  ["mosselen", "mossel", "mossels", "mussels", "muscheln"],
  ["oesters", "oester", "oyster", "oysters", "austern"],
  ["kreeft", "lobster", "hummer", "langoustine", "langoustines"],
  ["krab", "crab", "krabben", "noordzeekrab"],
  ["forel", "trout", "forelle", "zalmforel", "zeeforel"],
  ["inktvis", "calamares", "calamari", "squid", "pijlinktvis"],
  ["schol", "plaice", "scholle"],
  ["coquilles", "coquille", "scallops", "sint-jakobsschelp", "jakobsschelp", "st jacques"],
  ["heilbot", "halibut", "heilbutt"],
  ["makreel", "mackerel", "makrele"],
  ["sushi", "poke", "poke bowl"],
  ["vis", "fish", "fisch"],
  ["gerookt", "gerookte", "smoked", "gerauchert"],
  ["rog", "skate", "vleugelrog", "roggevleugel"],
  ["dorade", "goudbrasem", "zeebrasem", "sea bream"],
  ["tarbot", "turbot"],
  ["griet", "brill"],
  ["kibbeling", "kibbelingen"],
  ["lekkerbek", "lekkerbekje", "lekkerbekjes"],
  ["zeebaars", "sea bass", "wolfsbarsch"],
  ["tonijn", "tuna", "thunfisch"],
  ["paling", "aal", "eel"],
  ["sardines", "sardientjes", "sardine"],
  ["ansjovis", "anchovis", "anchovy"],
];

// Damerau-Levenshtein-afstand (met transposities) voor tikfout-tolerantie.
// Transposities meetellen vangt de meest voorkomende tikfout af: omgewisselde
// letters ("hairng" → "haring").
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  // Drie rijen bijhouden voor de transpositiestap.
  let prev2: number[] = [];
  let prev: number[] = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      cur[j] = v;
    }
    prev2 = prev;
    prev = cur;
  }
  return prev[n];
}

// Hoeveel tikfouten we tolereren, afhankelijk van de woordlengte.
// Korte woorden alleen exact/substring — anders te veel ruis.
function fuzzyThreshold(len: number): number {
  if (len >= 7) return 2;
  if (len >= 5) return 1;
  return 0;
}

// Snelle lookup: genormaliseerde term → alle (genormaliseerde) groepgenoten.
const SYN_INDEX = new Map<string, string[]>();
for (const group of SYNONYM_GROUPS) {
  const normGroup = group.map(normalize);
  for (const term of normGroup) {
    SYN_INDEX.set(term, normGroup);
  }
}

function expandToken(token: string): string[] {
  const syns = SYN_INDEX.get(token);
  return syns ? Array.from(new Set([token, ...syns])) : [token];
}

// Matcht één querytoken tegen een tekst (substring → synoniem → tikfout).
function tokenMatches(token: string, text: string, words: string[]): boolean {
  for (const variant of expandToken(token)) {
    if (text.includes(variant)) return true;
  }
  const thr = fuzzyThreshold(token.length);
  if (thr > 0) {
    for (const w of words) {
      if (Math.abs(w.length - token.length) > thr) continue;
      if (levenshtein(token, w) <= thr) return true;
    }
  }
  return false;
}

export interface SearchFields {
  naam: string;
  desc?: string;
  categorie?: string;
  extra?: string;
}

// Relevantiescore: > 0 als ÁLLE querytokens matchen (AND), anders 0.
// Een treffer in de naam weegt zwaarder dan in de omschrijving.
export function searchScore(fields: SearchFields, rawQuery: string): number {
  const q = normalize(rawQuery);
  if (!q) return 0;
  const tokens = q.split(" ").filter(Boolean);
  if (tokens.length === 0) return 0;

  const naam = normalize(fields.naam);
  const rest = normalize(
    [fields.desc, fields.categorie, fields.extra].filter(Boolean).join(" ")
  );
  const naamWords = naam.split(" ").filter(Boolean);
  const restWords = rest.split(" ").filter(Boolean);

  let score = 0;
  for (const token of tokens) {
    if (tokenMatches(token, naam, naamWords)) {
      score += naam.startsWith(token) ? 6 : 4;
      continue;
    }
    if (tokenMatches(token, rest, restWords)) {
      score += 1;
      continue;
    }
    return 0; // token matcht nergens → product valt af
  }

  // Bonus voor een (bijna) volledige naam-match.
  if (naam === q) score += 10;
  else if (naam.includes(q)) score += 3;
  return score;
}

export function matchesQuery(fields: SearchFields, rawQuery: string): boolean {
  return searchScore(fields, rawQuery) > 0;
}
