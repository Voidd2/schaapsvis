@AGENTS.md

# Schaap's Vis — projectbriefing

## Wat is dit?
De website van **Schaap's Vishandel**, een viswinkel aan de Herenstraat 48 in
Leiden. Opgericht in 1938 door Gerrit Schaap, nu de vierde generatie. Eigenaar:
Aldert Haasnoot, in de buurt gewoon "Schaap" genoemd. Telefoon 071 514 9802.

De site heeft drie taken: gevonden worden in Leiden en omgeving (in het
Nederlands, Engels én Duits), bestellingen aannemen, en e-mailadressen
verzamelen.

**Lees `OVERDRACHT.md` voordat je aan bedragen, bezorging of betalen werkt.**
Daar staat wat er nog voorlopig is en wat de eigenaar zelf invult.

---

## Hoe de zaak werkt (bepaalt de hele site)

- **Bezorgen** doen we alleen van **verse vis** en **visschalen**, in Leiden,
  Leiderdorp, Voorschoten, Wassenaar en Leidschendam. Gebakken vis (kibbeling,
  lekkerbek) gaat níet mee de weg op — dat is na twintig minuten in een doos
  niet lekker meer. Dat staat ook zo op de site; niet wegpoetsen.
- **Afhalen** kan altijd, gratis, in de winkel of aan de kraam.
- **Verse vis gaat op gewicht.** Er staat daarom geen totaalbedrag bij een
  bestelling verse vis: we bellen met de dagprijs voordat we inpakken. Nooit een
  bedrag beloven dat de weegschaal niet kan waarmaken.
- **Een visschaal** heeft géén startbedrag en géén vaste samenstelling. De klant
  kiest zelf wat erop komt en hoeveel, **per 100 gram** (`ONDERDELEN` in
  `src/lib/visschaal.ts`). Een paar dingen gaan per stuk (oesters, kreeft) en
  hebben `perStuk`. Dit is wél op de cent uit te rekenen en kan dus online
  worden afgerekend.
- **De prijzen zitten bewust onder de markt.** De benchmark staat bovenin
  `visschaal.ts` met bron en datum. Wijzig je een prijs, controleer dan of de
  vergelijking met `MARKT.goedkoopstePerPersoon` nog klopt — die claim staat op
  de site en moet waar blijven.

---

## Vormgeving

Uitgangspunt: een oude Leidse viswinkel, geen webshopsjabloon. Warm papier
(`--cream`), diep marineblauw uit het logo (`--navy`), messing (`--gold`) en een
dof winkelrood (`--rood`). Koppen in Libre Caslon Text, lopende tekst in Source
Sans 3 — allebei via `next/font`, dus meegebouwd en niet bij Google opgehaald.

Rechte hoeken, dunne lijnen, kapitaaltjes-labels, weinig schaduw.

Elke binnenpagina heeft hetzelfde ritme, en dat komt uit twee componenten in
`src/components/ui/PaginaKop.tsx`:

- **`PaginaKop`** — marineblauw vlak met kruimelpad, kapitaaltjes-label, kop,
  inleiding en optioneel knoppen plus een rechterkolom (`feiten`, één groot
  `cijfer`, of iets eigens via `zijkant`).
- **`PaginaSlot`** — het afsluitende blok. Elke pagina moet eindigen bij één van
  de drie dingen die we willen: een visschaal samenstellen, verse vis bestellen,
  of langskomen. Geen enkele pagina houdt zomaar op.

Daartussen wisselen `Sectie`-blokken elkaar af: papier, zand, papier. Bouw geen
eigen `<section style={{ backgroundColor: … }}>` — dan loopt de opmaak binnen een
paar pagina's weer uit elkaar.

**Wat we bewust niet doen**, omdat het een site er meteen als sjabloon laat
uitzien:
- secties die één voor één omhoog schuiven bij het scrollen (`framer-motion`
  staat er daarom niet meer in)
- symmetrische rijen kaartjes met ronde icoontjes erboven
- emoji in de interface
- verlopen, zwevende kaarten met schaduw, doorzichtige balken met vervaging
- marketingtaal zonder feiten ("beleef", "ontdek onze passie", drie
  bijvoeglijke naamwoorden achter elkaar)

Schrijf in plaats daarvan concreet: adres, tijden, bedragen, rijtijden,
wijknamen. Korte zinnen, "u"-vorm, en durf te zeggen wat we níet doen.

---

## Tech stack
- **Next.js 16** (App Router) — `params` is een `Promise`, dus altijd `await params`
- **next-intl v4** — nl/en/de, teksten in `src/messages/*.json`
- **Tailwind CSS v4** — `@import "tailwindcss"`, geen configbestand
- **Bouwen:** `npm run build -- --webpack` (Turbopack werkt hier niet)

### CSS-lagen — hier ging het eerder mis
`globals.css` zet basisstijlen in `@layer base` en eigen klassen (`.knop`,
`.veld`, `.kapitaal`, …) in `@layer components`. Dat moet zo blijven:

- Stond `a { color: inherit }` buiten een laag, dan won het van élke klasse die
  een linkkleur zet — met donkerblauwe tekst op donkerblauwe knoppen als
  gevolg.
- Stond `.knop { display: inline-flex }` buiten een laag, dan won het van
  `hidden sm:inline-flex` en stond een knop die alleen op mobiel hoort ook op de
  desktop.

Kleuren altijd via `var(--navy)` en dergelijke, nooit een losse hexcode.

---

## Bestanden die je het eerst moet kennen

```
src/lib/
  bedrijf.ts          NAP, openingstijden, verkooppunten, betaalmethodes, euro()
  bezorging.ts        gemeenten, postcodes, tarieven, bezorgdagen, postcodecheck
  visschaal.ts        startbedrag + toevoegingen + prijsberekening
  betalen.ts          SumUp hosted checkout (alleen serverzijde!)
  seo.ts              metadata, hreflang, alle schema.org-blokken
  assortiment-data.ts 129 producten met allergenen
  prijzen.ts          richtprijzen per product (leeg = op aanvraag)
  reviews.ts          echte Google-beoordelingen — niets verzinnen

src/app/api/bestelling/route.ts   neemt bestellingen aan, herberekent het bedrag
                                  op de server en maakt eventueel de SumUp-checkout

src/components/
  ui/Sectie.tsx       Sectie, Kop, Vragen, Kruimels — de vaste bouwstenen
  ui/PaginaKop.tsx    PaginaKop en PaginaSlot — de kop en de afsluiting van
                      élke binnenpagina. Nieuwe pagina? Begin hiermee.
  Schema.tsx          zet JSON-LD in de pagina
  JsonLd.tsx          de vaste blokken (winkel, organisatie, site, bezorgdienst)
  bezorgen/PostcodeCheck.tsx
  visschaal/tekst.ts  vertaalt de onderdelen van een visschaal
```

---

## Vindbaarheid — de regels die gelden

1. **Elke pagina gebruikt `paginaMetadata()` of `eenTaalMetadata()`** uit
   `src/lib/seo.ts`. Zelf canonicals en hreflang schrijven leidt gegarandeerd
   tot verschillen tussen pagina's.
2. **hreflang alleen naar taalversies die echt bestaan.** Blog, recepten en de
   viswijzer staan alleen in het Nederlands: die krijgen één canonical naar
   `/nl/…`. Verwijzen naar een Duitse versie die er niet is kost je de koppeling
   tussen de versies die er wél zijn.
3. **Nieuwe pagina toevoegen = ook in `src/app/sitemap.ts`.** Meertalig in
   `MEERTALIG`, in één taal in `EENTALIG`.
4. **Geen `aggregateRating`** op basis van Google-beoordelingen. Zie
   `OVERDRACHT.md` waarom.
5. **Nieuwe tekst hoort in alle drie de taalbestanden.** Ze hebben nu volledige
   pariteit; controleer dat met een sleuteltelling voordat je commit.
6. **Alt-teksten beschrijvend en lokaal**: "Gerookte heilbot bij Schaap's
   Vishandel in Leiden", niet "vis".

---

## Veelgemaakte fouten
1. `params` vergeten te awaiten.
2. `"use client"` op paginaniveau — gebruik een apart client-subcomponent.
3. `useSearchParams` buiten een `<Suspense>`.
4. Een bedrag uit de browser vertrouwen in de API-route. Altijd herberekenen.
5. `betalen.ts` importeren in een client component. Daar staat de geheime
   sleutel; die hoort nooit in de browser.
6. Bouwen zonder `--webpack`.

---

## Zichtbaarheid en indexering
- De site is standaard zichtbaar. `MAINTENANCE_MODE=on` zet het "binnenkort
  online"-scherm ervoor; alles anders (of niets) betekent zichtbaar.
- Preview-deploys (`VERCEL_ENV === "preview"`) geven altijd `Disallow: /`. Een
  voorbeeld-adres in Google wordt een tweede versie van de site die met de
  echte concurreert.
- Zonder `BESTELLING_WEBHOOK_URL` neemt `/api/bestelling` géén bestellingen aan
  en toont het telefoonnummer. Nooit "ok" teruggeven voor iets wat nergens
  aankomt.

---

## Git
Werkbranch: `claude/schaapsvis-website-remake-yfhbfu`

```bash
npm run build -- --webpack
npx eslint src
git add -A && git commit -m "…"
git push -u origin claude/schaapsvis-website-remake-yfhbfu
```
