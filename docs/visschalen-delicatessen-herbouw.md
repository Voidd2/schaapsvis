# Visschalen & delicatessen — 3 november 2026

## Uitvoering

De twee aangeleverde AI-mockups zijn uitsluitend indelingsreferenties. Het bestaande logo, Bitter/Source Sans, kleuren, navigatie, routes, twaalf schaalvarianten en vaste productgegevens blijven behouden. Er is geen betaalcheckout of nieuwe backend.

`seafood-catalog.ts` bepaalt de zichtbare selectie en vertalingen. Prijzen, foto's, porties en samenstellingen komen uit `feestdagen-producten.ts`. `SeafoodCatalog` wordt door beide overzichtspagina's gebruikt. Productdetails gebruiken dezelfde presentatiebron en aanvraaglijst.

| Hoofdkeuze | Bestaande route onder /feestdagen/ | Prijs per volledige schaal |
| --- | --- | --- |
| Klassiek klein, 2–3 | visschotel-klein-2-3-pers | €59,50 |
| Klassiek middelgroot, 3–5 | visschotel-klein-3-5-pers | €73,50 |
| Klassiek groot, 5–8 | visschotel-middel-5-8-pers | €98,50 |
| Rond luxe, **10–14** | visschotel-luxe-10-14-pers | **€160,00** |
| Hapjes, 3–5 | visschotel-hapjes-3-5-pers | €67,50 |
| Grote hapjes, 6–10 | visschotel-hapjes-6-10-pers | €85,50 |

De zes andere schalen en vier overige feestdagenproducten blijven in het uitklapbare secundaire overzicht bereikbaar. Alle 23 detailroutes blijven bestaan. Oude familieparameters worden als eerdere formaatkeuzes getoond; de oude familieankers en formaatwissel op details blijven behouden.

Volgorde Visschalen: zes hoofdkeuzes → uitgelicht zalmslaatje (€15,99) → drie gourmetproducten (€18,99/€58,99/€76,99) → drie delicatessen (€15,99/€31,99/€11,99) → vier salades → secundaire selectie → aanvraagoverzicht → maatwerk. Feestdagen plaatst de feestelijke introductie, afhaalinformatie en favoriet vóór de zes hoofdkeuzes. De geschenkenroute en praktische informatie blijven bereikbaar.

De zes gourmet-/trioprijzen zijn op 3 november nogmaals via de zichtbare Dirks-productpagina's in Chrome vergeleken; gelijk aan de bestaande bron. Er zijn geen bedragen gewijzigd. De afbeeldingen met voorbeeldprijzen zijn geen prijsbron.

## Aanvraag en gegevensopslag

- Eén gedeelde lijst op beide pagina's en alle feestdagendetails, met aantallen van 1–99. Minder tot nul verwijdert de regel.
- Canonieke gehele eurocenten worden vermenigvuldigd. Twee klassieke schalen 5–8 zijn €197,00. Geen maatwerkrichtbedrag wordt vermenigvuldigd.
- Verdeling over twee serveerschalen betreft de inhoud **per volledige schaal**; geen extra vis. Eventuele kosten blijven uitgesloten en moeten persoonlijk worden bevestigd.
- Salades zijn ongeprijsde wensen: hoeveelheid bakjes gewenst, portie nog te bevestigen. Ze tellen niet mee in het bekende subtotaal.
- WhatsApp bevat product, personenbereik, aantallen, bekende bedragen, verdeelwens, extra's, optionele datum en de persoonlijke bevestiging. Alleen een bewuste klik opent een concept; niets wordt automatisch verstuurd.
- `sessionStorage` bewaart uitsluitend toegestane product-ID's, aantallen, verdeelvlaggen en datum in hetzelfde browsertabblad. Ongeldige opgeslagen waarden worden weggefilterd. Bij geblokkeerde opslag blijft een lijst in het geheugen bruikbaar.
- Het bestaande maatwerkformulier blijft apart voor afwijkende wensen. Vrije tekst wordt niet in de pagina-URL of deze opslag bewaard. Lege optionele velden verdwijnen uit het concept.

## Foto-audit en herkomst

De originele foto's zijn visueel in een contactblad en met SHA-256 vergeleken. Klassiek 2–3 en 3–5 hebben exact dezelfde bestaande foto; er is geen unieke passende bronfoto in deze collectie. Klassiek 5–8, luxe 10–14 en de twee grote hapjeskeuzes hebben andere bestaande beelden. De hergebruikte beelden dragen een leesbaar voorbeeldlabel; de algemene toelichting en vergroting leggen uit dat de hoeveelheid bij het gekozen formaat hoort. Altteksten claimen geen exacte portiegrootte.

De bestaande krab-, zalm- en tonijnsaladefoto's komen uit `public/images/dirks`; de beeldverantwoording is aangevuld met deze bronnen en de eerder door de eigenaar verklaarde toestemming. Er zijn geen nieuwe concurrentenfoto's overgenomen. De krab-mango-afbeelding is uitdrukkelijk illustratief en maakt het product niet definitief bestelbaar.

### Gegenereerd beeld

- Tool: ingebouwde imagegen, geen externe betaalde API ingesteld.
- Output: `public/images/editorial/krab-mango-illustratief.webp` (geoptimaliseerde afgeleide, maximaal 900×675).
- Origineel PNG: in de lokale Codex-map `generated_images/01a0e51c-fd2d-7b83-9e36-00589bff4475/exec-abfffd08-0fae-48e0-9a17-54afc174cdad.png`.
- Exacte prompt:

> Create one editorial food illustration photograph for a Dutch fishmonger's website: a small plain round dark bowl containing a creamy crab-and-mango style salad, subtle pale pink shreds and a few soft yellow mango pieces, photographed from a high three-quarter angle on a clean light marble surface. Minimal composition, no props or garnish, soft daylight, appetizing natural texture, landscape 4:3. This is explicitly an illustrative mood image, not an exact product or portion photograph. Do not add other ingredients, text, logo, packaging, pricing, people or a collage.

## Bewijs en controles

- Gerichte ESLint, TypeScript, Next-productiebuild met 560 routes, inhoudscontrole en shop/integriteitschecks geslaagd.
- Nieuwe domeinchecks: zes hoofdkeuzes, 23 behouden routes, prijzen/foto's in drie talen, alle vertaalde samenstellingen/allergenen aanwezig, hoeveelheden, ongeprijsde extra's, verdeelwens, opgeslagen waarden.
- Chrome: kleine schaal ×2 (€119) + luxe trio klein (€15,99) + krabsalade = bekend subtotaal €134,99. Detail openen, teruggaan en herladen bewaren selectie en aantallen.
- Chrome: grote klassieke schaal toevoegen, verdeelwens aanvinken en 24 december kiezen: prijs onveranderd door verdelen, datum/verdeeluitleg zichtbaar in het echte WhatsApp-linkconcept.
- Chrome: maatwerk eigen combinatie, 12 personen, datum onbekend en vrije wens; geen leeg budget in het concept, geen vrije tekst in de pagina-URL.
- Fotovergroting opent, Escape sluit en focus keert terug naar de fotoknop.
- NL-desktop op 1440 CSS-pixels: drie kolommen. NL/EN/DE op 390 CSS-pixels: één productkolom, geen horizontale overflow. Geen kapotte geladen catalogusbeelden of consolefouten aangetroffen.
- Screenshots/contactblad lokaal: `../design-preview/catalog-rebuild/` (beide pagina's, mobiel, volledig overzicht en beeldvergelijking). De screenshots worden niet als nieuwe website-assets gepubliceerd.
- Tijdens alle tests is geen WhatsApp-bericht of echte aanvraag verzonden.

## Nog door de eigenaar te bevestigen

1. Indien gewenst: werkelijk personenbereik en inhoud van een nieuwe ronde luxe uitvoering voor 8–12. Tot die tijd blijft de bestaande 10–14 / €160 staan.
2. Verkoopprijs, portie/gewicht, samenstelling en allergenen van de vier losse salades. Krab-mango ook als leverbaar product bevestigen; momenteel alleen een wens op aanvraag.
3. Eventueel tarief en praktische mogelijkheden voor verdeling over twee serveerschalen.
4. Unieke echte foto's voor klassieke 2–3 en 3–5 en een echte krab-mangofoto zodra beschikbaar.

## Publicatie

Branch: `codex/platters-delicatessen-catalog`. PR en daadwerkelijke Cloudflare-uitrol worden na de laatste controles hieronder vastgelegd; een lokale build is geen live-bewijs.
