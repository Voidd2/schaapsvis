# Assortimentcontrole — 29 september 2026

Bron: [volledige eigenaarsinstructies](assortiment-eigenaar-2026-09-29.md).

## Verwerkt

- 128 oorspronkelijke vermeldingen, 64 verwijderd/samengevoegd/verplaatst en 3 toegevoegd: 67 actieve producten.
- Toegevoegd: Black Tiger garnalen, gebakken ansjovis en verse zeekraal. Zeekraal staat bij zeegroenten, niet bij vissalades.
- 40 specifieke voorraadregels van de eigenaar, met Nederlandse, Engelse en Duitse uitleg. Inktvis uitsluitend op aanvraag.
- Kibbeling van pollak; lekkerbek van heek. Ook blogs, kalender en recepten zijn aangepast.
- Garnalencocktail, garnalensalade en zalmpokébowl uitsluitend bij recepten. Een afzonderlijk thuisrecept voor garnalensalade is toegevoegd.
- Eén VÅRLAKS-vermelding voor verse zalm, één kabeljauwfilet en één Zeeuwse-mosselen-vermelding. Verse en gerookte wilde zalm blijven verschillende producten.
- De oude adminlijst volgt nu hetzelfde goedgekeurde assortiment, zonder spookproducten of verzonnen schalen.
- Alle 67 productfoto's lokaal opgeslagen. Geen hotlink naar een concurrent en geen zichtbare concurrentlink in productpagina's.
- 12 echte vervangingen per taal krijgen een permanente 308-redirect. De overige verwijderde producten krijgen 404 en staan niet meer in de sitemap.

## Uitgevoerde controles op de lokale productiebuild

Productiebuild met Next.js/webpack en TypeScript geslaagd.

| Controle | Resultaat |
| --- | --- |
| Productpagina's en voorraadteksten | 201 pagina's, NL/EN/DE |
| Verwijderde productroutes | 192 gecontroleerd: 36 redirects en 156 echte 404's |
| Vertalingen en gerenderde inhoud | 411 pagina's; 532 UI-sleutels gecontroleerd |
| SEO-release en interne links | 411 pagina's en 411 interne linkdoelen; geen fouten of waarschuwingen |
| Receptfoto's | 37 recepten, 37 verschillende gerechtfoto's |
| Mobiel assortiment | 201 afbeeldingen gedecodeerd; 21 overzicht-detailroutes; geen horizontale overflow of browserfouten |
| Overige mobiele flows | 15 homepage/schaal/recept/productflows; geen browserfouten |
| Bestelbeleid | 3 ongeldige niet-visschaalaanvragen op lokale API geweigerd |
| Image sitemap | 366 vermeldingen; 105 unieke afbeeldingsbestanden bereikbaar |
| Zoekmachinevoorzieningen | robots.txt, llms.txt en Search Console-verificatie bereikbaar |

Scripts: `check-owner-assortment.mjs`, `check-translations.mjs`, `check-seo-release.mjs`, `check-product-images.mjs`, `check-catalogue-photo-flows.cjs`, `check-client-flows.cjs`, `check-recipe-images.mjs`, `check-order-policy.mjs`, `check-image-discovery.mjs`, plus inhoudscontroles voor lekkerbek, Voorschoten en blogfoto's.

Geen echte bestelling ingediend en geen WhatsApp-bericht verzonden. Deze automatische controles zijn geen bewijs van een bepaalde Google-ranking, moedertaalreview of de exacte ingrediënten van toekomstige leveringen.

## Openstaande aandachtspunten

- Eigen winkelfoto's volgen nog voor krabsalade, tonijnsalade, zalmsalade en vispotje; tijdelijke foto's zijn illustratief.
- Onafhankelijke fotorechten voor Hartevelt, SOLT-leveranciersbeeld en Zalm van Urk moeten worden bevestigd of vervangen door eigen materiaal. Bron- en licentiegegevens staan intern in het fotomanifest.
- Voorraadteksten zijn gebaseerd op de eigenaarsinstructies, niet op een realtime voorraadkoppeling.
