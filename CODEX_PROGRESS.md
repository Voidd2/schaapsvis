# Schaap's Vishandel — voortgang

Laatst bijgewerkt: 29 oktober 2026, 03:13 Europe/Amsterdam

## Afgerond en gecontroleerd

- Terugkerende Codex-automatisering actief: iedere 310 minuten in deze chat, zonder duplicaat.
- Studentregistratie vraagt voornaam, achternaam, privé-e-mail en schoolmail.
- Na bevestiging van beide adressen wordt direct een sessie aangemaakt en opent de aanvraagstroom.
- Studentenaanvraag vraagt onderwijsinstelling, opleidingsniveau en studiestad; Leiden is geen vereiste.
- Bevestigde schoolmail vervangt het uploaden van een inschrijfbewijs.
- E-maildeals gebruiken één expliciete inschrijving; er wordt geen extra bevestigings- of losse afmeldmail gestuurd.
- Het blok over toekomstige klantaccounts en spaarpunten is verwijderd.
- Privacy- en begeleidende teksten zijn bijgewerkt in Nederlands, Engels en Duits.
- Productiedatabase is uitgebreid met migraties 0013 en 0014; gecontroleerd in Cloudflare D1 op 28 oktober 2026.
- De studentenpas toont live de naam, een korte controlecode en een lokaal gegenereerde QR-code; beheer kan zowel de korte als de bestaande ondertekende code controleren.
- De wachtwoord-resetpagina is live vormgegeven in dezelfde Schaap's-huisstijl als de rest van de website.
- PR #50 is samengevoegd naar `main`; de site-Worker en leden-Worker zijn op Cloudflare uitgerold. De leden-Worker draait als versie `74051d04` en de live healthcheck geeft `{"status":"ok"}`.
- Integratietests, TypeScript, inhoudscontrole en volledige productiebuild slagen.
- Transactionele account- en resetmails hebben een herkenbare Schaap's-huisstijl; campagnemails hebben daarnaast een zichtbare afmeldlink en RFC 8058 one-click afmelding.
- De resetpagina vraagt en controleert nu tweemaal het nieuwe wachtwoord, bevat toon/verberg en gebruikt een nonce voor het kleine script.
- Echte Gmail-headers zijn gecontroleerd: SPF, DKIM en DMARC slagen. De latere resetmail kwam in Postvak IN; de eerdere snelle reeks kale berichten kwam in Spam. De volledige diagnose staat in `docs/email-bezorging-audit.md`.
- PR #51 is samengevoegd naar `main`. De site-Worker draait versie `82b9f1dc`, de leden-Worker versie `0609c49d`; beide staan op 100% en de live healthcheck geeft `{"status":"ok"}`.
- PR #52 is samengevoegd naar `main`. Desktop en mobiel gebruiken dezelfde inhoudelijke groepen: de primaire routes blijven zichtbaar, `Account` bevat studenten- en klantaccount en `Meer` bevat Ons verhaal en Contact. De site-Worker draait versie `2d6ebdb0`, de leden-Worker versie `e66f77c3`; beide builds staan op Ready en de live healthcheck geeft `{"status":"ok"}`.
- PR #53 is samengevoegd naar `main`. De eenvoudige cookiekeuze met `Weigeren`, `Accepteren` en `Lees hier meer`, grotere footertekst en de nieuwsbrief-CTA `Korting in uw inbox` zijn live gecontroleerd. De site-Worker draait versie `6ce41de5`, de leden-Worker versie `26e866e6`; beide staan op 100% en de live healthcheck geeft `{"status":"ok"}`.
- PR #54 is samengevoegd naar `main`. Iedere foto op Visschalen en Barbecue & gourmet opent live groot met gelokaliseerde titel en beschrijving, teller, sluiten en vorige/volgende. Escape, pijltjestoetsen, focuslus en focusherstel werken; desktop en 390×844 zijn gecontroleerd. De site-Worker draait versie `a7f0763a`, de leden-Worker versie `cce064da`; beide staan op 100% Ready. De live pagina's en `{"status":"ok"}` van de leden-API zijn na de uitrol opnieuw gecontroleerd.
- PR #55 is samengevoegd naar `main`. Migratie 0015 bewaart Wallet-platformobjecten; de leden-Worker maakt alleen bij een volledige issuerconfiguratie een kort geldige RS256 Save-to-Wallet-link en de accountpagina toont de knop uitsluitend voor een actieve goedgekeurde pas. De testpas bevat naam, 10%, geldigheid, Schaap's-brandbeeld, QR-code en de bestaande korte controlecode. Zonder secrets blijft alles verborgen en faalt uitgifte gesloten. Integratietests, SMTP-test, ESLint en de productiebuild met 482 routes slagen.
- Productie-D1 bevat migratie `0015_student_wallet_passes.sql`, de tabel met 10 kolommen en de statusindex; dit is rechtstreeks in Cloudflare D1 geverifieerd. De site- en leden-Worker hebben commit `8e109b4` succesvol gebouwd en de live healthcheck geeft `{"status":"ok"}`.
- PR #56 is samengevoegd naar `main`. De leden-Worker maakt met een volledige certificaatconfiguratie een ondertekende Apple store-card `.pkpass` met naam, 10%, geldigheid, zichtbaar Schaap's-logo, QR-code en korte controlecode. Zonder echte Apple-configuratie blijft de knop verborgen en faalt uitgifte gesloten. De integratietest valideert ZIP-inhoud, CMS-handtekening, velden en databaseledger met een uitsluitend lokale TEST ONLY-certificaatketen. GitHub Build site en Member worker tests zijn groen. De site-Worker draait versie `c118858f`, de leden-Worker versie `a8459ea2`; beide staan op 100% Ready. De live healthcheck geeft `{"status":"ok"}`.

## Eerstvolgende werkpakketten

1. Google Wallet issuer/serviceaccount en Generic Pass Class aanmaken, de vier vereiste waarden als Cloudflare-vars/secrets instellen en één echte installatie- en intrekkingstest uitvoeren.
2. Apple Wallet activeren zodra het Apple Developer-account, Pass Type ID, certificaat, privésleutel en WWDR-certificaat beschikbaar zijn; daarna één echte installatie- en intrekkingstest uitvoeren. De servercode staat klaar; technische eisen staan in `docs/wallet-integratieplan.md`.

## Model- en tokenkeuze

- Gebruik een sterk redeneermodel voor database, authenticatie, beveiliging, deployment en Wallet-ondertekening.
- Luna Medium is voldoende voor afgebakende copy-, CSS- en kleine componenttaken nadat de backend stabiel live staat.
- Combineer controles per werkpakket en gebruik dit bestand als hervatpunt om dubbel onderzoek te voorkomen.

## Bekende externe afhankelijkheden

- Apple Wallet: Apple Developer-account, Pass Type ID, certificaat en ondertekende `.pkpass`-uitgifte nodig.
- Google Wallet: issuer-account, goedgekeurde Generic Pass class en service-account nodig.
- Cloudflare MCP in deze chat is aan het andere Cloudflare-account gekoppeld; voor Schaapsvis is de ingelogde Chrome-tab gebruikt.
