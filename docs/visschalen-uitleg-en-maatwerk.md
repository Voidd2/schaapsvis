# Visschalen: voorbeeldfoto, totaalprijs en maatwerk

2 november 2026 — uitgevoerd, gecontroleerd en live afgerond.

## Uitvoering per eis

1. Gedeelde voorbeeldfotovermelding in NL/EN/DE op de drie familiekaarten, productdetails, fotovergroting, homepage, feestdagencarousel en productrasters. Alternatieve teksten beschrijven de familie als voorbeeld; geen aanspraak op een exact personenformaat. Bestaande beelden behouden.
2. Prijsregels gebruiken de bestaande cents en prijsformatter: per schaal / per platter / pro Platte, gevolgd door het personenbereik. Alle twaalf bestaande uitvoeringen, bedragen, ingrediënten en allergenen ongewijzigd.
3. Afzonderlijke aanvraaghulp onder de families: voorkeur, personen, gebruik, datum of onbekend, optioneel budget en wensen/allergieën. Twee kolommen op desktop, één op mobiel. Alleen bewuste formulierinzending opent een WhatsApp-concept via het bestaande contact. Geen backend, opslag of vrije tekst in de pagina-URL; lege optionele velden ontbreken in het bericht. Geen prijsberekening of beschikbaarheidsbelofte.
4. Drie gedeelde stappen leggen persoonlijke afstemming en definitief akkoord uit. Details houden de vaste samenstelling en verwijzen apart naar maatwerk. Bestaande circa €17,50 per persoon blijft uitsluitend een maatwerkrichtbedrag.
5. Alle nieuwe teksten volledig NL/EN/DE. Selectie-URL’s en terugroutes behouden. Accounts, toegang, productbron en afbeeldingen niet gewijzigd.

## Bewijs

- Chrome: alle twaalf formaatkeuzes gecontroleerd tegen de canonieke foto, prijs, detail- en WhatsApp-koppeling.
- Chrome: alle 36 schaalproductdetails (12 × NL/EN/DE) gecontroleerd op teksten, bedragen, personenbereik, ingrediënten/allergenen, metadata, schema, gerelateerde links en WhatsApp-concept. Geen horizontale overflow op 390px.
- Terugroute en herladen behouden klassiek 3–5, luxe 10–14 en hapjes 6–10.
- Aanvraag: volledig fictief concept met eigen combinatie, 8 personen, maaltijd, 24 december 2026, budget en meerdere regels wensen; lege optionele velden weggelaten. Onbekende datum negeert eerder ingevulde datum. Pagina-URL bevat geen vrije tekst. Geen WhatsApp-knop aangeklikt, geen echte aanvraag of bericht verstuurd.
- Mobiel 390px: alle drie taalversies één kolom zonder overflow. Desktop 1440px: twee formulierkolommen. Fotovergroting toont de volledige uitleg; Escape sluit en herstelt focus.
- Homepage en feestdagen gecontroleerd op dezelfde fotobetekenis; vaste prijs met personenbereik op feestdagen.
- ESLint en TypeScript geslaagd. Next-productiebuild met 560 routes geslaagd. Inhoudscontrole: 67 producten, 37 recepten, 513 overeenkomstige vertaalsleutels. Shopchecks: 12 varianten, 36 gerenderde details, 3-talige concepten, URL-rondes en 65 tijdzonecases.
- Lokale bewijsbestanden buiten Git: `../design-preview/platter-inquiry/` (12-variants.json, 36-details.json, draft-check.json, mobile-locales.json, mobile-lightbox.png).

## Publicatie

- Cloudflare/Vinext-productiebuild geslaagd. PR #73: beide GitHub-controles groen en Codex-review voltooid zonder bevindingen.
- Samengevoegd als `345e6a08a1425ea90db0725ac84206c63d84b449`.
- Cloudflare site-Worker `fd4d198c` en leden-Worker `9bb08db0`: beide Ready met 100% verkeer voor deze commit. Ledenbron niet gewijzigd; bestaande automatische Git-build opnieuw gecontroleerd.
- Live `https://schaapsvishandel.nl/nl/visschalen`: concept met luxe en 6 personen klopt, lege optionele velden ontbreken, URL bevat geen aanvraagtekst. Geen WhatsApp-bericht geopend of verzonden.
- Live productdetail 3–5 personen toont €73,50 per schaal en voorbeeldfoto-uitleg. Maatwerklink keert terug naar het formulier met behoud van de gekozen klassieke variant.
- Live 1440px desktop: twee formulierkolommen; 390px mobiel: één kolom, geen overflow. Fotovergroting bevat de volledige voorbeeldverklaring. Screenshots: `live-desktop.png`, `live-mobile-photo.png` in de bewijsmap.
- Leden-healthcheck na uitrol: `{"status":"ok"}`. Alle vijf onderdelen van deze opdracht afgerond.
