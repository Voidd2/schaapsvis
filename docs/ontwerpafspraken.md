# Vormgeving Schaap’s — 2 november 2026

- Bestaande kleurvariabelen in `globals.css` behouden; geen nieuwe merkkleuren. Het bestaande rode feestdagenaccent blijft seizoensgebonden.
- Bitter voor hoofd- en sectiekoppen, Source Sans voor navigatie, tekst en bediening. Knoppen blijven de bestaande `knop`-varianten.
- Homepage: korte introductie, zes bestaande producten, één visschaalblok met feestdagen/gourmetlinks, locaties, familieverhaal, studenten, bestaande reviews, contact.
- Productfoto’s krijgen inhoudelijke bijschriften; geen locatieclaim bij de ovenzalm. De herhaalde keuzerij met kibbeling bij barbecue is verwijderd.
- Menu: vijf hoofdonderwerpen plus Feestdagen; recepten/gourmet onder Assortiment, biologische vis/VÅRLAKS onder Ons verhaal, beide accounts onder Account. Dezelfde routes op mobiel.
- Assortimentfilters vóór de aanvraaguitleg. Visschalen gegroepeerd in klassiek, luxe en hapjes; vaste prijzen blijven bij de bestaande producten, maatwerkrichtbedrag apart. Feestdagenintro vóór de handmatig bediende carousel.

## Controle

- Next-productiebuild: 560 pagina’s, geslaagd. Cloudflare/Vite-build geslaagd (bestaande sourcemap/webpack-compatibiliteitswaarschuwingen).
- TypeScript, ESLint en content-integriteit geslaagd.
- Chrome: alle zes gevraagde pagina’s op werkelijke CSS-breedtes 359, 389 en 1439 px bekeken; geen horizontale pagina-overflow of kapotte geladen hoofdafbeeldingen.
- Zoekterm kabeljauw geeft één resultaat; Gerookte vis geeft twaalf resultaten; alfabetische sortering gecontroleerd; Toon meer vergroot de lijst van 14 naar 32.
- Mobiel menu opent en sluit met Escape. Desktopuitklapmenu opent met Enter en sluit met Escape, met zichtbare focus terug op de trigger.
- Geen aanvraag, bestelling of registratie verstuurd.
- Desktop- en telefoonscreenshots lokaal opgeslagen naast de repository in `../design-preview/`.

## Nog aan te leveren / feitelijke tegenstrijdigheid

- Eigen beelden ontbreken in de beeldregistratie voor de gevel Herenstraat, team/toonbank, historische familie/winkel en de drie kramen (Botermarkt, De Waag, Hoogvliet Voorschoten). Geen vervangende zaak of familie verzonnen.
- Bestaande metatekst `meta.bezoekDesc` en het wachtwoordscherm noemen maandag als winkeldag; het locatieoverzicht zegt dinsdag t/m zaterdag. Openingstijden en metadata in deze ontwerpronde niet stilzwijgend gewijzigd.
- Accountvoorwaarden, backend, routes, productgegevens en toegangsbeveiliging behouden. Wallet-activering blijft uitgesteld volgens de recentste gebruikerskeuze.
