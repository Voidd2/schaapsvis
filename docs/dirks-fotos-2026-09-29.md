# Tijdelijke voorbeeldfoto's van Dirks Vishandel

Onderzoek op 29 september 2026: de publieke webshop bevatte 309 unieke productkaarten, waaronder 21 in de rubriek visschotels/boxen en 13 in barbecue/gourmet. De eigenaar vroeg om tijdelijk de relevante product- en schaalfoto's te gebruiken. De site importeert **geen** producten, prijzen of bestelmethoden uit die webshop.

- `scripts/dirks-photo-sources.json` bewaart de originele bron-URL en afmetingen voor elk van de 309 gevonden foto's. Dit is een intern auditbestand, geen publieke link op de website.
- `src/lib/dirks-photo-map.json` legt 42 overeenkomende, al bestaande Schaap-producten vast. `src/lib/product-beeld.ts` bevat dezelfde actieve mapping voor de website.
- `public/images/dirks/*.webp` bevat 72 lokaal gehoste voorbeeldfoto's, inclusief alle 13 foto's in barbecue/gourmet en alle 17 visgerelateerde foto's in visschotels/boxen. Vier vleesschotels uit die laatste rubriek horen niet bij ons assortiment en zijn niet overgenomen. De beelden zijn uit de originele bestanden naar 1600 px WebP omgezet. De originele JPEG's blijven lokaal als genegeerde downloadcache (`.gitignore`) en gaan niet mee in de deploy.
- De drie bestelbare visschalen gebruiken aparte voorbeeldfoto's. De configurator vermeldt dat formaat en inhoud per wensen en budget verschillen. De barbecuebeelden zijn uitsluitend inspiratie en leveren geen online bestelfunctie of vast aangeboden pakket op.
- Specifieke merk- of herkomstclaims (zoals VÅRLAKS en SOLT) volgen uit de bestaande eigenaarsteksten, **niet** uit deze voorbeeldfoto's. Niet-passende producten zijn niet toegevoegd.

**Belangrijk: publicatie- en hergebruikrechten van deze foto's zijn niet geverifieerd.** Een gedownloade foto is niet automatisch vrij van auteursrecht, en een latere vervanging is geen toestemming voor de tussenliggende periode. Regel schriftelijke toestemming bij de rechthebbende of vervang de voorbeeldfoto's zo snel mogelijk door eigen/licentiegeschikte beelden. De bron-URL's staan in het genoemde JSON-bestand om dat per foto eenvoudig te doen. Verwijder of overschrijf geen zichtbare bronvermelding/watermark zonder rechtencheck.

Controleer vóór definitieve publicatie ook of elke afgebeelde bereiding en schaalsamenstelling voldoende representatief is voor wat de klant werkelijk van Schaap's ontvangt.
