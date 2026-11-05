# Visgourmet: prijzen, porties en maatwerk — 5 november 2026

Eigenaar geeft verkoopprijzen (geen inkoop): zalm, tonijn en kabeljauw €3,50/100 g; garnalen €2,75/100 g. Schaal/bereiding circa €5–€15 per schaal. Na verduidelijkingsvraag expliciet gemachtigd om zelf logische gewichten, samenstellingen en prijzen te kiezen en concurrenten te vergelijken. Dit betreft visgourmet; geen nieuwe tarieven afleiden voor gerookte vis/koude visschalen.

## Nieuwe vaste uitvoeringen

| Product / bestaande route | Netto inhoud, zonder marinade | Vis tegen verkoopprijs | Schaal/bereiding | Totaal |
| --- | --- | ---: | ---: | ---: |
| gourmet-trio-1-persoon | 100 g zalm, 100 g tonijn, 100 g kabeljauw = 300 g | €10,50 | €5,00 | €15,50 |
| gourmet-schotel-3-4-pers | 300 g zalm, 200 g tonijn, 300 g kabeljauw, 200 g garnalen = 1 kg | €33,50 | €9,00 | €42,50 |
| gourmetschotel-5-6-pers | 450 g zalm, 300 g tonijn, 450 g kabeljauw, 300 g garnalen = 1,5 kg | €50,25 | €12,25 | €62,50 |

Bij de grootste genoemde gezelschappen is dit 250 g per persoon; bij drie/vijf personen circa 333/300 g. Schaal en bereiding inbegrepen, bijgerechten niet. Eénpersoonstrio behoudt bestaande marinades. Grotere schalen hebben vier concrete soorten; de onbepaalde vijfde 'vis van het moment' is verwijderd. Bestaande foto's blijven voorbeeldopmaak, geen exact portiebewijs. De eigenaar moet deze nieuw aangeboden gewichten bij bereiding aanhouden.

Eén berekeningsbron: `src/lib/gourmet-pricing.ts`; de bestaande productcatalogus, winkelmand, WhatsApp-overzicht, structured data en oudere BBQ-selectie gebruiken deze actuele bedragen. EN/DE-gewichten en eenheden mee aangepast. Prijzen zijn geen berekening van nettowinst, omdat het opgegeven visbedrag al een verkoopprijs is.

De drie losse gourmetvis-kaarten (zalm, tonijn, kabeljauw) gebruiken eveneens €3,50 per 100 g, met de eenheid in de kaart én het WhatsApp-concept. Historische concurrentprijzen blijven alleen in brondata bewaard.

## Vergelijking op 5 november 2026

Dit zijn publiek weergegeven prijzen; niet als garantie voor actuele voorraad of gelijke inhoud gebruiken.

- [Van der Marel, Katwijk/Noordwijk](https://webshop.visspecialistvdmarel.nl/): €64,95 voor 4–5 personen, zalm/kabeljauw/tonijn/gamba's; geen gewicht gevonden. Circa €12,99–€16,24 per persoon, maar geen eerlijke kiloprijsvergelijking mogelijk.
- [Dirks 3–4](https://www.dirksvishandel.nl/product/gourmet-schotel-3-4-pers/) en [5–6](https://www.dirksvishandel.nl/product/gourmetschotel-5-6-pers/): bestaande referentiebedragen €58,99/€76,99; vijf soorten inclusief wisselende vis. Geen gewicht bevestigd. Schaaps gebruikt nu eigen samenstelling/prijzen.
- [Visbezorgd](https://www.visbezorgd.nl/schotels/80-gourmetschotel.html): basis €25 voor twee personen, ongeveer 250 g vis per persoon; andere samenstelling inclusief zwaardvis.
- [De Jong](https://www.dejongvisspecialist.nl/product/vis-gourmet/): €19,50 per persoon, minimaal 300 g, andere mix met victoriabaars en seizoensvis.
- [Suezkanaal, Den Haag](https://vishandel-suezkanaal.nl/gourmetschotels/): vanaf €9 per persoon, vanaf vier personen; gewicht niet gespecificeerd en oudere pagina, daarom alleen globale ondergrens, geen gelijkwaardig prijsanker.

## Samenstellen

Gedeeld formulier op Visschalen, Feestdagen, Barbecue & gourmet en de drie gourmetproductdetails. Personen, één of meer van vier soorten, optionele datum en wensen/allergieën. Ruime klikvlakken, één kolom mobiel. Prijsbasis zichtbaar; geen automatisch berekende offerte zonder gewichten. WhatsApp-concept pas na bewuste klik, niets automatisch verzonden. Vrije tekst blijft in geheugen en verschijnt niet in website-URL of opslag. Volledig NL/EN/DE.

## Controle

Gerichte tests dekken retailberekening, netto gewichten, canonieke catalogusprijzen, ongeldige aantallen/viskeuzes/datums, lege optionele velden en speciale tekens in alle drie talen. Bestaande schaalvarianten/cart/routes blijven onderdeel van de projectcontrole. Geen echte aanvraag of WhatsApp-bericht versturen tijdens UI-controle.

## Publicatiebewijs — 6 november 2026

- `check-shop-navigation`, `check-content-integrity`, gerichte ESLint en `git diff --check` geslaagd. Next/TypeScript-build (572 pagina's) en Cloudflare Vite-build geslaagd.
- Lokale Chrome-formuliervalidatie, Duitse productdetailpagina en mobiele opmaak op 390 px zonder horizontale overflow gecontroleerd. Conceptberichtopbouw in alle talen getest zonder WhatsApp-bericht of echte aanvraag te versturen.
- [PR #110](https://github.com/Voidd2/schaapsvis/pull/110), merge `e8db183736e4bc4b3f6536bddcf11e8b08ff07fc`; GitHub Build275 succesvol, Codex-review zonder bevindingen.
- Cloudflare-dashboard in account Schaapsvis: siteversie `a4df2189`, ledenversie `beeeec23`, beide Ready en 100% actief bij dezelfde merge.
- Live `https://schaapsvishandel.nl/nl/visschalen#gourmet` bevestigt €15,50/300 g, €42,50/1 kg en €62,50/1,5 kg. Samenstelknop na hydratie actief. Detail `gourmet-schotel-3-4-pers?catalog=visschalen` bevestigt prijs, exacte verdeling, voorbeeldfoto-uitleg en terugroute.
- Bewijs buiten Git: `../design-preview/gourmet/live-gourmet.png` en `live-samenstellen.png`. Geen wijzigingen aan toegang, accounts of koude visschaalprijzen.
