# Visgeschenken — 5 november 2026

## Uitvoering

- Gedeelde cadeaukaarten op Visschalen en Feestdagen en de bestaande Relatiegeschenken-pagina gebruiken twee nieuwe geoptimaliseerde beelden. De naam is **Schaap’s vispakket**, omdat naast zalm ook paling en eventueel makreel worden aangeboden. Klein, middel en groot zijn aanvraagkeuzes; er zijn geen hoeveelheden of prijzen verzonnen.
- Luxe vistrio gebruikt het bestaande `public/images/dirks/luxe-vistrio.webp`: het echte drievaksbakje, met toestemming van de eigenaar zoals eerder vastgelegd. Klanten kiezen exact drie verschillende soorten uit Hollandse garnalen, gerookte paling, gerookte zalm en gerookte makreel.
- Vaste trio’s behouden bestaande productgegevens, samenstelling, prijs, winkelmand en routes. Een afzonderlijke link vanuit beide trio-kaarten/productdetails leidt naar de maatwerkkeuze. Een aangepaste combinatie krijgt een afzonderlijke prijsbevestiging.
- Nieuwe `GiftRequest` maakt uitsluitend op actie een WhatsApp-concept via het bestaande contactnummer; geen automatische verzending. Vrije tekst blijft in componentgeheugen en komt niet in de website-URL of opslag. Lege optionele wensen worden weggelaten. NL/EN/DE; labels minimaal 48px, grote aanvraagknop, mobiele kaarten in één kolom.
- Nieuwe AI-beelden zijn zichtbaar als verpakkingsvoorbeeld benoemd, niet als exacte vaste productinhoud. Bestaande bestanden blijven bewaard.

## Beelden en prompts

Methode: ingebouwde **image_gen**, geen API/CLI of extra abonnement. Logo-referentie: `public/images/brand/schaapsvis-logo-v2.png`. De rasteruitvoer is alleen verkleind en als WebP opgeslagen (1200 × 800).

1. `public/images/editorial/schaaps-vispakket-v2.webp` — prompt: photorealistic Dutch fishmonger product photo, landscape 3:2, open navy gift box on pale marble in natural daylight. Individually food-safe sealed sliced smoked salmon, golden smoked eel strips and smoked mackerel. Official circular logo on inside lid, restrained gold ribbon and blue linen. No raw salmon steak, prices, size labels, alcohol or large shellfish; illustrative medium box for small/medium/large request options.
2. `public/images/editorial/schaaps-maatwerkpakket-v2.webp` — prompt: photorealistic custom seafood gift, 3:2, navy box with blue tissue/gold ribbon, sealed smoked salmon and eel, clear tub of tiny North Sea shrimp, cream greeting card with official logo. Fish salad and toast beside box to suggest customization; pale marble, soft daylight. No prices/weights, alcohol, raw fillet or oysters; a gift box rather than a serving platter.

## Controle

- `check-shop-navigation`: alle drie talen/formaatkeuzes, exact drie verschillende soorten, ongeldige keuzes geblokkeerd, optionele lege tekst weg, tekst met speciale tekens correct geëncodeerd, bestaande 12 schaalvarianten/routes/mand behouden.
- Inhoudscontrole, gerichte ESLint, Next-productiebouw inclusief TypeScript en Cloudflare/Vite-bouw geslaagd. Een losse TypeScript-run tijdens actieve dev-server zag tijdelijk inconsistente gegenereerde `.next`-types; de aansluitende volledige Next-build vernieuwde en controleerde deze succesvol.
- Chrome: Groot kiezen; vier soorten blokkeert verzending, zalm uitzetten herstelt drie; 390px en desktop zonder horizontale overflow. Duitse Relatiegeschenken-formulieren gecontroleerd. Beelden geladen. Chrome-screenshots waren leeg; visuele controle daarom via de in-app browser. Geen WhatsApp-bericht of echte aanvraag verstuurd.
- Productiecontrole wordt na publicatie hieronder toegevoegd.
