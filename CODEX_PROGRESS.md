# Schaap's Vishandel — voortgang

Laatst bijgewerkt: 28 oktober 2026, 06:35 Europe/Amsterdam

## Afgerond en gecontroleerd

- Terugkerende Codex-automatisering actief: iedere 310 minuten in deze chat, zonder duplicaat.
- Studentregistratie vraagt voornaam, achternaam, privé-e-mail en schoolmail.
- Na bevestiging van beide adressen wordt direct een sessie aangemaakt en opent de aanvraagstroom.
- Studentenaanvraag vraagt onderwijsinstelling, opleidingsniveau en studiestad; Leiden is geen vereiste.
- Bevestigde schoolmail vervangt het uploaden van een inschrijfbewijs.
- E-maildeals gebruiken één expliciete inschrijving; er wordt geen extra bevestigings- of losse afmeldmail gestuurd.
- Het blok over toekomstige klantaccounts en spaarpunten is verwijderd.
- Privacy- en begeleidende teksten zijn bijgewerkt in Nederlands, Engels en Duits.
- Productiedatabase is uitgebreid met migratie 0013; gecontroleerd in Cloudflare D1 op 28 oktober 2026.
- Integratietests, TypeScript, inhoudscontrole en volledige productiebuild slagen.

## Eerstvolgende werkpakketten

1. Studentenpas met naam, korte controlecode, lokale QR en personeelscontrole live zetten. *(lokaal gebouwd en getest; productie-uitrol volgt na migratie 0014)*
2. Verificatie- en resetmails vormgeven met merkstijl, logo, nuttige links en minder e-mailmomenten.
3. Wachtwoord-resetpagina visueel gelijkmaken aan de rest van de website. *(lokaal gebouwd en getest; productie-uitrol volgt)*
4. Apple Wallet en Google Wallet uitgeven zodra de vereiste accounts en certificaten beschikbaar zijn; technische eisen staan in `docs/wallet-integratieplan.md`.
5. Afzenderreputatie onderzoeken en SPF, DKIM, DMARC, PTR/EHLO en inhoud controleren; een nieuw afzenderadres alleen is geen oplossing.
6. Desktop- en mobielmenu inhoudelijk gelijkmaken en account/studentenroutes logisch groeperen.
7. Daarna: cookievoorkeuren, leesbaardere footer/nieuwsbrief-CTA en mobiele lightboxes voor schalen en barbecuefoto's.

## Model- en tokenkeuze

- Gebruik een sterk redeneermodel voor database, authenticatie, beveiliging, deployment en Wallet-ondertekening.
- Luna Medium is voldoende voor afgebakende copy-, CSS- en kleine componenttaken nadat de backend stabiel live staat.
- Combineer controles per werkpakket en gebruik dit bestand als hervatpunt om dubbel onderzoek te voorkomen.

## Bekende externe afhankelijkheden

- Apple Wallet: Apple Developer-account, Pass Type ID, certificaat en ondertekende `.pkpass`-uitgifte nodig.
- Google Wallet: issuer-account, goedgekeurde Generic Pass class en service-account nodig.
- Cloudflare MCP in deze chat is aan het andere Cloudflare-account gekoppeld; voor Schaapsvis is de ingelogde Chrome-tab gebruikt.
