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

1. Wijzigingen committen, pushen, reviewen en via de bestaande deploymentflow live zetten.
2. Studentenpas verbeteren met naam, Schaap's-logo, korte controlecode, QR en personeelscontrole.
3. Verificatie- en resetmails vormgeven met merkstijl, logo, nuttige links en minder e-mailmomenten.
4. Wachtwoord-resetpagina visueel gelijkmaken aan de rest van de website.
5. Apple Wallet en Google Wallet voorbereiden; echte uitgifte vereist Apple-certificaten en Google Wallet issuer/service-account.
6. Afzenderreputatie onderzoeken en SPF, DKIM, DMARC, PTR/EHLO en inhoud controleren; een nieuw afzenderadres alleen is geen oplossing.
7. Desktop- en mobielmenu inhoudelijk gelijkmaken en account/studentenroutes logisch groeperen.
8. Daarna: cookievoorkeuren, leesbaardere footer/nieuwsbrief-CTA en mobiele lightboxes voor schalen en barbecuefoto's.

## Model- en tokenkeuze

- Gebruik een sterk redeneermodel voor database, authenticatie, beveiliging, deployment en Wallet-ondertekening.
- Luna Medium is voldoende voor afgebakende copy-, CSS- en kleine componenttaken nadat de backend stabiel live staat.
- Combineer controles per werkpakket en gebruik dit bestand als hervatpunt om dubbel onderzoek te voorkomen.

## Bekende externe afhankelijkheden

- Apple Wallet: Apple Developer-account, Pass Type ID, certificaat en ondertekende `.pkpass`-uitgifte nodig.
- Google Wallet: issuer-account, goedgekeurde Generic Pass class en service-account nodig.
- Cloudflare MCP in deze chat is aan het andere Cloudflare-account gekoppeld; voor Schaapsvis is de ingelogde Chrome-tab gebruikt.
