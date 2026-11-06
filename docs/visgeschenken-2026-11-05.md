# Visgeschenken — 5 november 2026

## Filets, gewichten en cadeaubon — 6 november 2026

De eigenaar vroeg nette gefileerde vis in de beelden, een mooiere palingfilet, gewichten per pakket en een optionele cadeaubon met eigen bedrag. De onderstaande hoeveelheden zijn voorgestelde netto visgewichten, geen bestaande bewezen productspecificatie; daarom toont de site expliciet 'Voorgestelde inhoud' en persoonlijke bevestiging. Prijzen blijven na overleg.

| Pakket | Gerookte zalmfilet | Palingfilet | Makreelfilet zonder huid | Gerookte zalmbuikjes | Totaal circa |
| --- | ---: | ---: | ---: | ---: | ---: |
| Klein | 150 g | 75 g | 75 g | — | 300 g |
| Middel | 200 g | 150 g | 150 g | — | 500 g |
| Groot | 300 g | 200 g | 200 g | 100 g | 800 g |

De geselecteerde samenstelling en het totaal gaan mee in het WhatsApp-concept. Zalmbuikjes alleen in Groot. Een apart aanvinkvak maakt een zelfgekozen positief eurobedrag mogelijk, ook bij het trio en pakket op maat. Komma/punt en maximaal twee decimalen worden ondersteund; uitvinken laat het bedrag volledig weg. Geen cadeaubon uitgegeven, saldo aangemaakt, betaling of bericht verstuurd: eerst persoonlijk afstemmen. Vrije tekst blijft buiten de website-URL/opslag. NL/EN/DE en bestaande contactnummer/routes behouden.

Referenties voor het filetbeeld: [Jan van As, palingfilet in tray](https://www.janvanas.nl/nl_NL/p/spakenburg-palingfilet-gerookt-500-gr-zav/3309/), [Boschypaling, handgefileerde paling](https://boschypaling.nl/product/gerookte-palingfilet/) en [Boel, gerookte makreelfilet zonder vel](https://vishandelboel-shop.be/index.php/product/gerookte-makreelfilet-zonder-vel/). Alleen anatomie/presentatie als referentie; geen externe productfoto gekopieerd naar de site.

Twee gerichte edits via ingebouwde image_gen, daarna uitsluitend verkleind naar 1200×800 WebP. Oude v2-assets behouden. Nieuwe bronnen:
- `public/images/editorial/schaaps-vispakket-v3.webp`
- `public/images/editorial/schaaps-maatwerkpakket-v3.webp`

Prompt pakket: 'Preserve navy box, exact Schaap’s lid logo, marble, daylight, gold ribbon, blue linen, angle and 3:2 framing. Keep thin overlapping cold-smoked salmon slices. Replace dark eel strips with premium hand-filleted smoked eel: broad flat gently tapered ivory/pale-pink smooth pearly flesh, fine central seam, neatly parallel, no brown skin or salmon belly. Replace skin-on mackerel with skinless boneless smoked mackerel loins, ivory beige flaky flesh and subtle central line. Individually sealed clear food-safe packs. Medium package only; no belly, weights or prices.'

Prompt maatwerk: 'Preserve composition, navy gift box, ribbon, exact logo on cream card, salmon, shrimp, toast, salad, linen and daylight. Replace ONLY dark eel strips in vacuum packet with broad flat elongated tapered ivory/pale-pink skinless hand-filleted eel, smooth pearly flesh and delicate central seam. No leathery skin, orange salmon belly or whole fish. Keep sealed packaging, 3:2 photo, no new text or price.'

Validatie/publicatie: catalogus- en inhoudstests, gerichte ESLint, Next/TypeScript en Cloudflare-build geslaagd; desktop en 390px met keuze- en bedragvalidatie gecontroleerd. PR #111 / `2568658`, Build277 geslaagd, Codex-review zonder bevindingen. Cloudflare site `fa84e793` en leden `0c1234e6` beide 100% Ready. Nieuwe foto en interactieve inhoud/cadeaubon op hoofddomein bevestigd. Geen bericht verstuurd. Bewijsbeeld: `../design-preview/gifts/live-filets-gewichten.jpg`.

De historische uitvoering hieronder beschrijft de eerdere versie; 'geen hoeveelheden' en v2-beelden zijn met deze ronde vervangen.

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
- PR #109 samengevoegd als `652b766`; Build273 geslaagd, Codex-review zonder bevindingen. Cloudflare site `97292724` en leden `199aa2f6` beide **100% Ready**. Live Visschalen en Relatiegeschenken tonen de nieuwe formulieren; alle drie cadeaubeelden geladen in de ingelogde preview, zonder overflow. Anonieme rechtstreekse afbeeldingverzoeken blijven door het bestaande siteslot afgeschermd; geen anonieme bestandhash-vergelijking geclaimd. Live screenshot buiten Git: `../design-preview/gifts/live-cadeaukaarten.png`.
