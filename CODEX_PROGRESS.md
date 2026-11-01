# Schaap's Vishandel — voortgang

Laatst bijgewerkt: 1 november 2026, Europe/Amsterdam

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
- PR #57 is samengevoegd naar `main`. Migratie `0016_apple_wallet_updates.sql` staat aantoonbaar in productie-D1: de locale-kolom, versleutelde device-opslag, registratietabel en statusindex zijn aanwezig en de migratiehistorie bevat 0016. Het officiële Apple Wallet-updateprotocol is live met registratie, veilige device-/pushtokenopslag, gewijzigde-serienummeropvraag, opnieuw ondertekende of `voided` pas, `If-Modified-Since` en afmelding. De site-Worker draait versie `8449ea44`, de leden-Worker versie `39ba8046`; beide staan op 100% Ready. De live healthcheck geeft `{"status":"ok"}`.
- PR #58 is samengevoegd naar `main`. De homepage bevat nu Feestdagen 2026 in Schaap's-huisstijl, met duidelijke routes naar visschalen, gourmet en relatiegeschenken. Er zijn aparte gelokaliseerde pagina's voor `/feestdagen` en `/relatiegeschenken`, plus navigatie-, footer-, seizoensbanner- en sitemapkoppelingen. De opbouw gebruikt bruikbare categorie- en servicemodellen uit de markt, maar alle teksten zijn origineel en alle beelden komen uit de eigen projectbibliotheek; concurrentenmateriaal is niet gekopieerd.
- De nieuwe homepage en beide pagina's zijn op desktop en 390×844 mobiel gecontroleerd. ESLint, contentintegriteit, de volledige productiebuild en GitHub main-build #198 slagen. De echte homepage, Feestdagen-route, navigatie, footer en productlinks zijn na de uitrol op `schaapsvishandel.nl` gecontroleerd.
- `docs/wallet-integratieplan.md` bevat nu de concrete stappen voor Apple- en Google-onboarding, de veilige overdracht van certificaten/sleutels en de actuele kostencontext. Apple vermeldt USD 99 per jaar; Google vermeldt in de Wallet-onboarding geen afzonderlijk issuer-abonnement.
- PR #60 is samengevoegd naar `main`. De Feestdagenpagina heeft een mobiele uitgelicht-carousel, compact productraster, een luxe vistrio zonder sushi, herstelde garnalen- en warmgerookte-zalmbeelden en een duidelijk seizoensaccent in desktop- en mobiele navigatie. Exacte verkoopprijzen blijven bewust voorlopig totdat de eigenaar ze aanlevert.
- De relatiegeschenkenpagina is live uitgebreid met zes originele geschenkideeën, aanvraagroutes en een project-eigen AI-voorbeeldbeeld van een Schaap's-zalmpakket met het echte ronde logo. Prompt, bronbeeld en beperkingen zijn vastgelegd in `docs/image-generation-2026-09-29.md`. De echte routes `/nl/feestdagen` en `/nl/relatiegeschenken` zijn na de uitrol op `schaapsvishandel.nl` gecontroleerd.

## Eerstvolgende werkpakketten

1. De studentenpas-fraudebeveiliging staat lokaal compleet op branch `codex/studentenpas-fraudebeveiliging`: migratie 0017, 365-dagen-capabele herroepbare sessies, privacyvriendelijke apparaatherkenning, transparante risicosignalen, gegroepeerde meldingen, beheeracties met auditlog, extra verificatie, dynamische eenmalige twee-minuten-QR, handmatige code, beheerpagina en privacytekst. De integratietest dekt Safari/PWA-opslag, cookieverwijdering/nieuwe installatie, meerdere apparaten die de pas openen, ingetrokken sessie en installatie, schorsen/herstellen, e-mail- en schoolmailcontrole, rate limiting, verlopen/gekopieerde QR en onbevoegde beheertoegang. Fotoverificatie is bewust niet gebouwd.
2. Voor uitrol eerst de volledige build en laatste codecontrole afronden, daarna migratie 0017 op preview-D1 toepassen, preview-Worker deployen en live testen. Pas daarna 0017 op productie-D1 toepassen en de productie-Worker deployen. De Cloudflare-MCP-koppeling in deze chat heeft nog geen toegang tot account Schaapsvis; gebruik de geautoriseerde Schaapsvis-dashboard/CLI-sessie en nooit het andere account.
3. Google Wallet issuer/serviceaccount en Generic Pass Class door de eigenaar aanmaken, de vier vereiste waarden als Cloudflare-vars/secrets instellen en één echte installatie- en intrekkingstest uitvoeren.
4. Apple Wallet activeren zodra het Apple Developer-account, Pass Type ID, certificaat, privésleutel en WWDR-certificaat beschikbaar zijn; daarna APNs-updatepush en één echte installatie- en intrekkingstest uitvoeren. De servercode en het updateprotocol staan klaar; de exacte eigenaarstappen staan in `docs/wallet-integratieplan.md`.

## Model- en tokenkeuze

- Gebruik een sterk redeneermodel voor database, authenticatie, beveiliging, deployment en Wallet-ondertekening.
- Luna Medium is voldoende voor afgebakende copy-, CSS- en kleine componenttaken nadat de backend stabiel live staat.
- Combineer controles per werkpakket en gebruik dit bestand als hervatpunt om dubbel onderzoek te voorkomen.

## Bekende externe afhankelijkheden

- Apple Wallet: Apple Developer-account, Pass Type ID, certificaat en ondertekende `.pkpass`-uitgifte nodig.
- Google Wallet: issuer-account, goedgekeurde Generic Pass class en service-account nodig.
- Cloudflare MCP in deze chat is aan het andere Cloudflare-account gekoppeld; voor Schaapsvis is de ingelogde Chrome-tab gebruikt.
