# Assortimentsfoto’s — 29 september 2026

Alle 128 producten hebben een afbeelding via de gedeelde functie `productPhoto`. Deze bron wordt gebruikt door het overzicht, de detailpagina, metadata en de image-sitemap. De 75 eerder ontbrekende afbeeldingen zijn met internetfoto’s aangevuld. Bestaande foto’s van de overige 53 producten zijn behouden.

## Herkomst en presentatie

- 56 nieuwe foto's komen van Wikimedia Commons, met een Creative Commons-licentie of publieke-domeinstatus. Fotograaf, bronpagina en licentielink staan bij de foto op de website.
- 19 nieuwe foto's komen van de door de website-eigenaar expliciet toegestane Hartevelt-bron. Er is geen onafhankelijke schriftelijke licentiebevestiging van Hartevelt gevonden. De toestemming van de gebruiker is de basis; dit is geen bewijs van toestemming van de fotograaf. Laat deze toestemming bevestigen of vervang de betreffende foto's door eigen/freely licensed foto's wanneer die toestemming ontbreekt.
- Alle originele bestanden worden lokaal geleverd; geen hotlinks naar webwinkels. De foto's zijn niet door ons bewerkt of kunstmatig opgewaardeerd. Next/Image maakt responsieve versies voor de bezoeker.
- 30 nieuwe foto's tonen het product, 30 een serveervoorbeeld en 15 het hoofdingrediënt/de vissoort in een andere snit of toestand. De laatste twee groepen zijn **geen exacte foto's van de aangeboden winkelbereiding**. Dat staat expliciet in een onderschrift in NL, EN en DE. Voorbeelden: hele zeebrasem bij zeebrasemfilet, kabeljauwkoppen bij kabeljauwwangen, verse zeekraal bij zeekraalsalade en levende Europese kreeften vóór het koken.
- De complete bronlijst, licenties, downloads en gekozen presentatie staan in `scripts/internet-product-sources.json`. De daar vermelde API-afmetingen zijn bronmetadata; de tests controleren de werkelijke bestandspixels. Kleine portretoriginals worden niet kunstmatig vergroot.

## Gecontroleerd vóór publicatie

- Productfoto's: 128/128; nieuwe unieke internetbestanden: 75/75; geen ontbrekende bestanden.
- Alle 384 productdetailpagina's (128 × NL/EN/DE): HTTP 200 en juiste gedeelde fotobron.
- Echte browser: 384 assortimentsfoto's gedecodeerd; 15 klikroutes van overzicht naar detail; geen browserfouten of mobiele horizontale overflow.
- Vertalingen: 591 pagina's, 532 UI-sleutels; geen geconstateerde regressies.
- Image-sitemap: 546 afbeeldingsvermeldingen; 161 unieke bronafbeeldingen met HTTP 200 en afbeeldings-MIME.
- Alleen visschalen online bestelbaar: 591 pagina's en 194 beeld-URL's gecontroleerd; drie ongeldige/niet-visschaal-aanvragen alleen lokaal afgewezen. Geen echte bestelling of WhatsApp-bericht verstuurd.
- Productiebuild en TypeScript geslaagd.

De aanwezigheid van foto's is volledig; dit is geen bevestiging dat alle producten dagelijks op voorraad zijn of dat elke foto de exacte winkelpresentatie laat zien. Eigen foto's van de winkelbereidingen blijven de beste vervanging voor de illustratieve beelden.
