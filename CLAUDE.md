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
- **Bezorgen kost € 5,99**, overal hetzelfde, en is **gratis vanaf € 35**. Eén
  tarief voor het hele gebied; `GEMEENTEN` kán een afwijkend tarief zetten, maar
  doet dat nergens.
- **Afhalen** kan altijd, gratis, in de winkel of aan de kraam.
- **Verse vis gaat op gewicht.** Er staat daarom geen totaalbedrag bij een
  bestelling verse vis: we bellen met de dagprijs voordat we inpakken. Nooit een
  bedrag beloven dat de weegschaal niet kan waarmaken.
- **Een visschaal is een keuze uit drie schalen** (`SCHALEN` in
  `src/lib/visschaal.ts`), elk met een startbedrag; de goedkoopste is € 55,90.
  Daarbovenop legt de klant zelf extra's, **per 100 gram** (`ONDERDELEN`). Een
  paar dingen gaan per stuk (oesters) en hebben `perStuk`. Dit is wél op de cent
  uit te rekenen en kan dus online worden afgerekend.
  Het geheel heet een `Samenstelling`: `{ schaal, extras }`. Zonder gekozen
  schaal is er niets te bestellen — dat controleert de API-route ook.
- **De prijzen zitten bewust onder de markt.** De benchmark staat bovenin
  `visschaal.ts` met bron en datum. Wijzig je een prijs, controleer dan of de
  vergelijking met `MARKT.goedkoopstePerPersoon` nog klopt — die claim staat op
  de site en moet waar blijven.

---

## Twee gezichten: winkelsite en webshop

`schaapsvishandel.nl` is de **winkelsite**: assortiment, waar we staan, ons
verhaal, de blog, de recepten. Klikt iemand op Bestellen, dan komt hij in de
**webshop** — en die hoort er anders uit te zien.

Dat schakelen doet `src/components/layout/Chrome.tsx`, op het pad: alles onder
`/{taal}/bestellen` krijgt `ShopHeader` + `ShopFooter` in plaats van de gewone
`Header` + `Footer`. De webshop heeft een smalle kop met de winkelwagen
rechtsboven, een gouden balk met het bezorgtarief, en geen menu dat wegleidt.

De **winkelwagen** (`src/components/winkel/Winkelwagen.tsx`) staat bóven die
keuze en geldt dus op de hele site. Hij houdt twee dingen vast:

- `regels` — verse vis. **Geen bedragen**: vis gaat op gewicht, dat weten we pas
  op de weegschaal. Er staat dus ook geen voortgangsbalk naar gratis bezorging,
  want die zou nergens op slaan.
- `samenstelling` — de visschaal. Die is wél exact, en dáár staat het balkje
  "nog € X en de bezorging is gratis".

Alles staat in `localStorage` (`sv_bestelling_v2`, `sv_visschaal_v3`), gelezen en
geschreven via `src/lib/mandje.ts` — nergens anders.

---

## Vormgeving

Uitgangspunt: een oude Leidse viswinkel, geen webshopsjabloon. **De kleuren
komen uit het logo**: het diepe blauw van de banner (`--navy`, `#2f3e8f`), het
lichtblauw van de vis (`--lichtblauw`), het zand van de buitenrand (`--sand`,
`--sand-diep`) en het rood van de dubbele lijn (`--rood`, `#c62828`). Warm
papier (`--cream`) is de grond van vrijwel alles.

**De verhouding waarin we ze gebruiken staat bovenin `globals.css` en moet
kloppen blijven:**

```
70%  crème        de achtergrond van vrijwel alles
20%  donkerblauw  koppen, balken, de voet
 8%  lichtblauw en zand   rustige vlakken die een sectie afzetten
 2%  rood         knoppen die tot actie aanzetten, en verder niets
```

Zodra rood meer dan een paar procent van een scherm beslaat gaat het richting
snackbar. Wil je iets laten opvallen zonder knop: neem zand of lichtblauw.

Koppen in **Bitter** (schreefletter met blokvoetjes, zoals op een oud
winkelbord), lopende tekst in **Source Sans 3** — allebei via `next/font` in
`src/lib/fonts.ts`, dus meegebouwd en niet bij Google opgehaald. Dat bestand
bestaat apart omdat `/coming-soon` buiten de taallayout valt en de letters
tóch moet hebben.

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

### Foto's: altijd via `src/lib/beeld.ts`

Er is nog **geen enkele** echte foto en ook geen logobestand; alle `bestand`-
velden staan leeg en wachten op de eigenaar. Daarom staat elke fotoplek op de
site in één bestand, met erbij wat erop moet komen, welk formaat het is en welke
alt-tekst eronder hoort. `<Beeld naam="winkelGevel" />` toont de foto zodra die
er is, en tot die tijd een net zandvlak met de naam erin.

Nieuwe foto nodig op een pagina? **Zet er een plek voor in `beeld.ts` en gebruik
`<Beeld>`** — nooit een los `<Image src="/images/…">`. Anders weet de eigenaar
niet dat er een foto wordt gevraagd, en staat er straks een gebroken plaatje.
`ontbrekendeBeelden()` geeft de lijst van wat nog leeg is.

### De homepage: 1938 eerst, bezorgen later

De volgorde is bewust en niet willekeurig: hero (sinds 1938) → seizoensbanner →
de drie pijlers (gebakken vis, verse vis, visschalen) → **Sinds 1938** met de
oudste foto → **gebakken vis** ("waar Leiden ons van kent") → feitenbalk →
bezorgen → visschalen → assortiment → herkomst → beoordelingen → locaties →
`PaginaSlot`.

Bezorgen stond bovenaan; dat leest als een bezorgdienst die toevallig vis doet.
Wat deze zaak onderscheidt is dat hij er al vier generaties staat en dat half
Leiden er de kibbeling haalt — dus dat komt eerst.

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
  visschaal.ts        de drie schalen, de extra's en de prijsberekening
  mandje.ts           wat er in de winkelwagen zit, en het lezen/schrijven ervan
  betalen.ts          SumUp hosted checkout (alleen serverzijde!)
  seo.ts              metadata, hreflang, alle schema.org-blokken
  beeld.ts            élke fotoplek op de site — logo, winkel, kramen, historie,
                      de drie schalen. Nog allemaal leeg: wacht op de eigenaar.
  fonts.ts            Bitter (koppen) en Source Sans 3 (tekst) via next/font
  siteAccess.ts       het slot: cookie en de SITE_PUBLIC-schakelaar
  assortiment-data.ts 129 producten met allergenen
  prijzen.ts          richtprijzen per product (leeg = op aanvraag)
  reviews.ts          echte Google-beoordelingen — niets verzinnen

src/proxy.ts          zet het wachtwoord op élk pad (heet in Next 16 geen
                      middleware meer)
src/app/api/bestelling/route.ts   neemt bestellingen aan, herberekent het bedrag
                                  op de server en maakt eventueel de SumUp-checkout
src/app/api/unlock/route.ts       hier staat het wachtwoord — serverzijde, en
                                  nergens anders

src/components/
  ui/Sectie.tsx       Sectie, Kop, Vragen, Kruimels — de vaste bouwstenen
  ui/PaginaKop.tsx    PaginaKop en PaginaSlot — de kop en de afsluiting van
                      élke binnenpagina. Nieuwe pagina? Begin hiermee.
  ui/Beeld.tsx        toont een plek uit beeld.ts, of het terugvalvlak
  Schema.tsx          zet JSON-LD in de pagina
  JsonLd.tsx          de vaste blokken (winkel, organisatie, site, bezorgdienst)
  bezorgen/PostcodeCheck.tsx
  visschaal/tekst.ts  vertaalt de onderdelen van een visschaal
  winkel/             de winkelwagen: context, knop en paneel
  layout/Chrome.tsx   kiest tussen winkelsite en webshop
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
7. Een bedrag tonen bij verse vis. Dat kan niet: het gaat op gewicht. Alleen de
   visschaal heeft een hard bedrag.
8. `setState` in een `useEffect` om iets van de klok te tonen (welke maand het
   is, of de winkel open is). Dat wordt door eslint afgekeurd én het geeft een
   flits bij het laden — gebruik `useSyncExternalStore`, zoals `DezeMaand`.
9. Rechtstreeks een `<Image>` naar `/images/…` zetten in plaats van een plek in
   `beeld.ts`. Zie de fotoparagraaf hierboven.

---

## Zichtbaarheid en indexering

**De site zit standaard ACHTER EEN WACHTWOORD, op elk pad.** Openzetten voor het
publiek doe je met één variabele in Vercel:

```
SITE_PUBLIC = on
```

Elke andere waarde — en niets invullen — houdt het slot erop. Dat is met opzet:
het stond andersom (open tenzij `MAINTENANCE_MODE=on`) en toen stond de site
maandenlang zonder enig slot online, omdat die variabele nooit gezet was. Een
slot dat standaard uit staat is geen slot.

Wat het slot precies afdekt, staat in `src/proxy.ts`:

- **Alles** krijgt het wachtwoordscherm, inclusief `/sitemap.xml`, `/robots.txt`
  en `/admin`. De vorige matcher liet `api`, alles met een punt erin en dus ook
  de sitemap ongemoeid.
- **API-routes** krijgen geen scherm maar `503` met een JSON-foutmelding. Een
  bestelling die "gelukt" lijkt terwijl de site op slot staat is erger dan een
  foutmelding.
- Alleen dit blijft open, en dat staat op één plek in `altijdToegestaan()`:
  `/coming-soon`, `/api/unlock`, `/api/logout`, `/_next/`, `/_vercel/` en
  `/favicon.ico`. Het slotscherm heeft verder niets uit `/public` nodig — daarom
  staat daar het woordmerk in letters en geen plaatje.

Het wachtwoord staat in `src/app/api/unlock/route.ts` en is te wijzigen met
`SITE_PASSWORD`, zonder code aan te passen. Met `SITE_ACCESS_TOKEN` maak je in
één klap alle bestaande sessies ongeldig.

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
