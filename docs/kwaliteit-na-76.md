# Kwaliteitsronde na PR #76

Basis: main `2d671a1`. Branch `codex/quality-after-76`. Geen aanvullend auditbestand of SEO-ZIP gevonden in repository/attachments. De aangeleverde opdracht is de checklist.

## Gebruikersroutes en opslag

- `/assortiment` en details zijn informatie/WhatsApp-contact; voegen momenteel geen verse vis toe aan een webshop. Geen automatische bestelling.
- `/visschalen`, `/feestdagen` en schaalproductdetails delen catalog-request-store: 23 vaste producten + 4 ongeprijsde saladewensen, sessionStorage, geen backendbestelling.
- `/bestellen` toont de oude maatwerkaanvraag. De nog aanwezige provider/paneel waren niet verwijderd. Voorheen ging opgeslagen inhoud verloren. Nu wordt deze eerst ingelezen en pas daarna teruggeschreven. Bestaande localStorage-selecties worden één keer na succesvolle opslag naar het tabblad overgezet; bewust lege sessionStorage wint boven oude gegevens. Een nieuw tabblad krijgt geen meegedeelde mutaties; gegevens worden nooit op de server of aan klantaccounts gekoppeld. Bij gedupliceerde tabbladen kan de browser initieel een kopie maken, daarna zijn ze onafhankelijk. Gedeelde apparatuur vereist zoals steeds zelf leegmaken/sluiten, het systeem identificeert geen personen achter één browser.
- Oude verse-visregels zijn weer zichtbaar op `/bestellen`, inclusief verwijderen/leegmaken; niet stilzwijgend weg uit WhatsApp-concept. Oude maatwerkprijzen worden niet met canonieke nieuwe productprijzen gemengd. Beide overzichten wijzen bij bestaande oude inhoud expliciet naar elkaar. Geen grote data- of bestelmigratie.

## Auditstatus (implementatie; releasebewijs volgt)

| Bevinding | Status / bewijs |
|---|---|
| Leeg mandje overschrijft opslag | Hersteld met geladen-statebarrière; echte helpers + Playwright herladen/verwijderen/leegmaken |
| Ongeldige producten/waarden | Verwijderde slugs, null, dubbele slugs, niet-string invoer gefilterd; huidige productdata opnieuw opgehaald |
| Account/Meer/buitenklik/Escape/focus | Centrale sluitlogica, één details tegelijk, route- en resize-sluiting; Playwright interacties |
| Desktop te smal | Gedeeld canvas 1536 px inclusief padding; oude homepage buitenmaat 1224 px bij 1920, nieuwe 1536; leeskolommen 72ch/max-w-3xl blijven |
| Laptopnavigatie | Vanaf 1280 volledige navigatie op twee rijen t/m 1599; vanaf 1600 één rij; onder 1280 mobielmenu |
| Twee winkelwagens | Bewust gescheiden en benoemd, zie routes hierboven |
| Kerstgeschenken te diep | Drie bestaande ideeën direct na zes hoofdschalen, gedeelde bron gift-copy, concrete ankers, prijs na overleg |
| Catalogus | Naamhoogte/prijsuitlijning, korte fotolabels + één sectie-uitleg, volledige uitleg in vergroting; geen beeld- of prijswijzigingen |
| Datums | Exacte kalenderdatum, min in Europe/Amsterdam, verleden blokkeert conceptknop; middernacht/zomertijd/schrikkeljaar-tests |
| Account te druk | Eén zichtbaar hoofdformulier; herstel/e-maillink achter secundaire uitklappers; register behouden; klantaccountstatus expliciet |
| Authentieke beelden | docs/beeldplan.md + alleen besloten eigenaarpreview; echte aanlevering nog nodig |
| Tijdlijn/taal | Eigen plek historie2018; koppen NL/EN/DE; veilige taalfilterkeys behouden, geen tokens/vrije tekst |
| Historieblogfoto | Kabeljauw verwijderd; eerlijk typografisch vlak totdat eigenaarfoto beschikbaar is |
| Footer | Minder overlappende sublinks; essentiële routes blijven via bovenliggende pagina bereikbaar |
| SEO-skill | `.agents/skills/schaaps-seo/SKILL.md` aangemaakt vanuit huidige projectrichtlijnen en toegepast |
| Sitemap | Werkelijke release/contentdatums; onbekende datum weggelaten; slot/noindex behouden |

## Inhoudsmatrix

Geteld op gerecht/vissoort én productverwijzingen (makreel is niet als actief product geregistreerd, daarom geen verzonnen productlink).

| Vissoort | Voor | Na | Keuze |
|---|---:|---:|---|
| Haring | 1 | 3 | Bestaand broodje + appel-bietsalade + komkommer-borrelhapjes |
| Schol | 3 | 3 | Grill, tomaat/olijf, ovenpakketje; geen duplicaat |
| Wijting | 3 | 3 | Pan, ovenpakketje, viskoekjes |
| Makreel | 2 | 3 | Bestaande puree en broodsalade + aardappel/prei-ovenschotel; al gegaarde vis |
| Tonijn | 3 | 3 | Grill, pasta, tartaar; rauw-advies bestaand behouden |
| Zalm | 9 | 9 | Ruim voldoende variatie |
| Kabeljauw | 6 | 6 | Ruim voldoende variatie |
| Hollandse garnalen | 5 | 5 | Voldoende koude bereidingen |

40 recepten totaal. Drie nieuwe recepten met hoeveelheden, porties, bereiding en veiligheidsadvies in NL/EN/DE; geen oneigenlijke gerechtfoto verzonnen. Receptfallback blijft tekst. Eén nieuw blog: `visgeschenk-geven-koelen-en-afhalen` (drie talen), gericht op ontvanger, planning, gekoeld vervoer en overdracht; overlapt niet de bestaande algemene bewaartips.

Voedselveiligheidsbronnen gecontroleerd 2026-11-03:
- https://www.voedingscentrum.nl/encyclopedie/vis — koelketen en 4°C.
- https://www.voedingscentrum.nl/5xveiligvoorzwangeren — rauwe/gerookte vis en kwetsbare groepen.
Geen nieuwe medische claim of houdbaarheidsgarantie; productspecifiek advies bij aankoop blijft leidend.

## Controle

Playwright: `scripts/check-quality-browser.mjs`, geïsoleerde lokale Chrome, geen persoonlijke browserdata; externe requests en alle niet-GET-aanvragen geblokkeerd. Vooraf gebouwde site op localhost:3035, uitsluitend lokaal SITE_PUBLIC=launch-approved. Productie-instellingen blijven intact.

Eerste volledige matrix: 12 routes × 8 breedtes = 96; 360/390/768/1024/1366/1440/1728/1920. Geen horizontale overflow of pageerrors. Dropdown, toetsenbord/focus, mobielmenu, oude opslag, nieuwe lijst, fotovergroting, datum en terugroute geslaagd. Verdere screenshot-/touch-/taalcontrole en releasebewijs worden hieronder aangevuld.

Screenshots en machineleesbaar bewijs: `../design-preview/quality-76/`. Geen echte aanvragen, WhatsApp-berichten, e-mails of registraties verstuurd.
## Definitieve lokale controles — 3 november 2026

- Playwright: 96 NL route/breedte-combinaties + 16 EN/DE-routes, muis/toetsenbord/touch, nul pageerrors en nul verzendpogingen. Screenshots wachten op gedecodeerde beelden; een te vroege lege screenshot is opnieuw gemaakt.
- Accountweergave lokaal getest met een lege, gesimuleerde `/api/members/me`-respons; geen login, registratie of e-mail aangeroepen. De echte API wordt afzonderlijk read-only live gecontroleerd.
- Besloten preview afzonderlijk getest: anoniem blijft toegang gesloten/noindex, robots disallow en lege sitemap; alleen geldige lokale sitecookie toont VIDEO-01 en overige media-aanwijzingen. Publieke lokale uitvoering toont die niet.
- TypeScript en gerichte ESLint: geslaagd. Next-build: 572 routes. Cloudflare/Vite-build: geslaagd; bestaande waarschuwingen over gedeeltelijke webpack-ondersteuning en sourcemaps blijven, geen buildfouten.
- Contentcheck: 67 producten, 40 recepten, 513 vertaalde UI-keys; oude 37 receptfotokoppelingen verplicht behouden, drie expliciete tekstfallbacks. Shopcheck: 12 schalen, 23 productroutes, canonieke bedragen in drie talen, 65 tijdzone/grensgevallen, herstel/verwijdering/lege sessie en Amsterdam-datumgrenzen.
- Diffcontrole: geen wijzigingen aan productdata, prijzen, public-afbeeldingen, leden-Worker of Cloudflare-configuratie. `git diff --check` schoon.

Bewijsbestanden in `../design-preview/quality-76/`:
- `home-before-1920.jpg` (live basis, 1224 px canvas) en `home-after-1920.jpg` (1536 px canvas).
- `home-after-390.jpg`, `visschalen-after-390.jpg`, `feestdagen-after-390.jpg`, `account-after-390.jpg`.
- `account-dropdown-open.jpg`, `account-dropdown-outside-closed.jpg`, `legacy-cart-restored.jpg`, `owner-media-plan.jpg`, `browser-results.json`.

Nog aan te leveren door eigenaar: authentieke media volgens beeldplan. De voorbereide plaatsen en veilige publieke fallback zijn afgerond. Publicatie/Cloudflare-bewijs volgt na PR-controle.
