# Structured data: waarheid vóór extra velden

Gecontroleerd 3 november 2026 op de gerenderde lokale productiebuild.

| Type | Beoordeling / implementatie |
|---|---|
| GroceryStore | Bestaand geldig type, stabiel `/#winkel`, centrale adres-/tijdenbron. Onbevestigde generieke bezorggemeenten als `areaServed` verwijderd. |
| Organization / WebSite | Bestaande ids en publisherkoppeling behouden. Geen zelf toegekende reviewsterren. |
| Voorschoten | Eigen kraam-id, beschrijving als wekelijkse kraam, vrijdaguren en parentOrganization. Geen extra onafhankelijk bedrijf verzonnen. |
| Product | 23 vaste aanbiedingen behouden hun echte centenprijs, EUR, URL en beeld. Hardcoded `LimitedAvailability` verwijderd: er is geen voorraadfeed. Assortiment zonder prijs krijgt geen verzonnen Offer. |
| Recipe | 40 recepten, ingrediënten/stappen/porties/tijd en taal aanwezig. 37 hebben een gerechtbeeld; 3 hebben een tekstfallback en voldoen daarmee niet aan Googles vereiste beeldveld. Zie matrix. |
| Article | Auteur is de echte organisatie; bestaande publicatie-/wijzigingsdatum en gelokaliseerde inhoud behouden. Geen datum van het huidige verzoek toegevoegd. |
| BreadcrumbList | Taalgebonden URL en positie; gecontroleerd in echte HTML. |
| FAQ | Vragen en antwoorden blijven zichtbaar. FAQPage-emissie verwijderd: geen nutteloze rich-resultbelofte. |

## Externe validatie

De JSON-LD-blokken uit de lokale productpagina `visschotel-klein-3-5-pers` en receptpagina `zalm-citroen-dille` zijn als gecombineerd codefragment getest. Dit is een schematest, geen bewijs dat Google een afgeschermde live URL kan crawlen.

- Schema.org Validator: **0 fouten, 0 waarschuwingen, 6 items**.
- Google Rich Results Test: **9 geldige onderdelen**, met niet-kritieke meldingen bij product/merchant/bedrijf/recept. [Testresultaat](https://search.google.com/test/rich-results/result?id=3bI-zCi2_ZTFsaWIBKWCYA).
- Screenshots en exacte extractie: `design-preview/master-audit/schema-validator.png`, `google-rich-results.png`, `schema-extract.html` (naast de repository).
- Een groene merchant-detectie in een syntactische test is geen bewijs dat de aanvraagwebsite aan alle merchant-programma-eisen voldoet. Geen shipping-, retour- of voorraadclaims toevoegen om waarschuwingen te laten verdwijnen.

## Primaire bronnen en beslissingen

- [Product snippets](https://developers.google.com/search/docs/appearance/structured-data/product-snippet): voorraad is aanbevolen, geen reden een status te verzinnen. Vaste zichtbare prijs moet overeenkomen met Offer.
- [Recipe](https://developers.google.com/search/docs/appearance/structured-data/recipe): afbeelding van het bereide gerecht is verplicht voor rich-resultgeschiktheid. Een rauwe visfoto is geen vervanging.
- [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business): feitelijke zaakgegevens en consistente entiteit; markup geeft geen garantie op vertoning.
- [Google documentatie-updates](https://developers.google.com/search/updates): FAQ-rich-results worden sinds **7 mei 2026** niet meer getoond. Dit is in de actuele bron geverifieerd, niet overgenomen als onbewezen aanname uit de opdracht.
- [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): Google gebruikt llms.txt niet voor ranking. Geen nieuw bestand of kunstmatige AI-teksten toegevoegd.

Na publicatie opnieuw URL-tests uitvoeren op de daadwerkelijke deployment, en na openbare lancering controleren of afbeeldingen crawlbaar zijn. Nooit de site openen om een validator groen te maken.
