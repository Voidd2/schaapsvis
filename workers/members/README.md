# Schaap's account- en studenten-API

Deze Worker is de serverkant voor algemene accounts, e-mailbevestiging, wachtwoordherstel, studentenaanvragen, beoordeling, de kortingspas en expliciete inschrijving voor e-mailaanbiedingen. De site blijft eigenaar van de pagina's; de Worker verwerkt de gevoelige gegevens.

## Account hervatten en ander opleidingsniveau

- Een herhaalde registratie met een bestaand privé- of schooladres geeft HTTP 409 `account_exists`. Het oorspronkelijke account en wachtwoord blijven intact; er wordt geen extra mail verstuurd. De site verwijst naar inloggen en wachtwoordherstel.
- Een geldig wachtwoord voor een nog onbevestigd account geeft `email_unverified` met de opgeslagen bewijsroute. De site opent daarmee de juiste verificatievelden. Pas na verificatie ontstaat een ingelogde sessie. Nieuwe codes worden op verzoek verstuurd.
- Wachtwoordherstel werkt ook voor actieve, onbevestigde accounts. Het bevestigt de e-mailadressen niet en omzeilt de studentencontrole niet.
- Opleidingsniveau `other` vereist een toelichting van 2–120 tekens, opgeslagen als `education_level_other` en zichtbaar in beide beheerschermen. De aanvraag blijft in afwachting van beoordeling.
- Pas migratie `0020_student_education_other.sql` toe vóór uitrol van deze Worker. Zij behoudt de bestaande aanvragen, pasverwijzingen en auditverwijzingen. De bestaande Cloudflare-build voert D1-migraties vóór de productie-uitrol uit.
- `node workers/members/test.mjs` test beide bewijsroutes met tijdelijke data en opgevangen e-mails. `scripts/check-student-portal-flows.cjs` controleert de schermen met onderschepte API-verzoeken; er worden geen echte accounts of mails gemaakt.

## Mailmigratie — 5 november 2026

Cloudflare Email Sending is geactiveerd op `berichten.schaapsvishandel.nl`. De
nieuwe productieconfig selecteert expliciet `MAIL_TRANSPORT=cloudflare`; Knoth
blijft inkomende mailboxhost en expliciete rollbackmogelijkheid. Campagneverzending
staat standaard uit; inschrijvingen en afmeldingen blijven werken. Actuele
uitrol-/bezorgstatus en rollback staan in `../../docs/cloudflare-accountmail.md`.

## Historische basisstatus

- Gecontroleerd op 26 oktober 2026 in account **Schaapsvis**: `schaapsvis-members` is gedeployed op de productieroute `schaapsvishandel.nl/api/members/*`. De website zelf blijft een besloten preview; bezoekers zonder geldige toegang zien de binnenkort-pagina.
- Productie `MEMBERS_ENABLED=on` is bedoeld voor deze afgeschermde preview. De Worker eist daarnaast de site-unlock-cookie of het door Cloudflare vastgestelde IP op de allowlist; bezoekers kunnen niet alleen door de API-URL te kennen registreren. Zet de toegangspoort niet open als onderdeel van deze preview.
- De productie-Worker heeft D1 `schaapsvis-members` en de private EU-R2-bucket `schaapsvis-student-proofs`; migraties 0001 t/m 0017 zijn toegepast en rechtstreeks in productie geverifieerd. Preview-D1 is eveneens gecontroleerd en van 0013 t/m 0017 bijgewerkt. De R2-bucket blijft privé. Nieuwe aanvragen gebruiken de bevestigde schoolmail als bewijs en uploaden geen bestand meer; de bucket blijft alleen bestaan voor het opruimen van oudere bewijsbestanden.
- Cloudflare bevat de mailhost `khsm1.khsmserver1.nl`, poort 587, mailboxgebruiker `schaapsv` en een versleuteld `SMTP_PASSWORD`; ook auth-, ondertekenings- en site-access-secrets zijn ingesteld. Een rechtstreekse testmail via Knoth is op 27 oktober 2026 bij de eigenaar in Gmail aangekomen, maar in Spam geplaatst. Die dag bevestigde een no-send controle vanuit de gedeployde Worker de SMTP-aanmelding (`status: authenticated`, HTTP 200). De tijdelijke diagnostiek staat weer uit. Een volledige registratiemail is nog niet getest.
- Beheerdermail en IP-allowlist zijn ingesteld voor `schaapsv@schaapsvishandel.nl` en de door de eigenaar opgegeven IP-adressen. De beheer-API blijft bovendien achter de site-access-gate.
- De aparte Worker `schaapsvis-members-preview` met eigen D1/R2 bestaat nog, maar `preview.schaapsvishandel.nl` heeft geen DNS-record en die Worker staat uit. De actieve besloten preview gebruikt daarom de hoofdsitehost, zoals de eigenaar heeft toegestaan.
- De Worker begrenst bewijsopslag per omgeving tot 4 GB, 400.000 uploads en 4 miljoen bewijslezingen per maand (plus daglimieten van 10.000 uploads en 50.000 lezingen). Dit zijn applicatielimieten, geen harde accountbrede factuurstop. Cloudflare biedt hier geen harde limiet van €10 per maand. De Worker Paid-upgrade is op 5 november 2026 na expliciet checkout-akkoord geactiveerd.
- Studentbewijs wordt na beoordeling verwijderd; bij een fout probeert de cron dit opnieuw. Er is geen automatische bewaartermijn voor aanvraagmetadata vastgesteld. Laat echte openbare registratie daarom dicht totdat de privacyinformatie, bewaartermijnen en daadwerkelijke e-mailaflevering zijn bevestigd.
- Login-, wachtwoordreset-, bevestigingsmail- en nieuwsbriefverzoeken hebben afzonderlijke limieten per IP-adres en per e-mailadres. Accountgerichte tellers zijn HMAC-gehasht met `AUTH_PEPPER`.
- De nieuwsbrief-cron blijft alleen actief zolang `MEMBERS_ENABLED=on`; alleen adressen met een afzonderlijk vastgelegde expliciete inschrijving mogen campagnes ontvangen. Er wordt geen extra bevestigingsmail meer gestuurd. De toestemming voor marketing blijft vrijwillig en los van studentenkorting.
- Sessiecookies zijn host-only; productie en de losse preview-Worker delen geen accountsessie.

## Resterende controles vóór publieke registratie

1. Houd de website en account-API achter de bestaande site-access-gate. De leden-API staat aan voor de besloten preview; bezoekers zonder site-unlock-cookie of het vertrouwde eigenaar-IP worden door de Worker geweigerd.
2. Test met een gecontroleerd persoonlijk en schooladres de volledige registratie en beoordeling. De volledige stroom is op 27 oktober 2026 door de eigenaar doorlopen; controleer na iedere mailwijziging opnieuw aflevering en spamplaatsing. Deel of log geen mailboxwachtwoord, verificatiecode of echte gebruikersgegevens.
3. Controleer privacyverklaring, verwerkingsverantwoordelijke, grondslagen, verwerkers, bewaartermijnen en verwijderprocedure vóór publieke registratie.
4. `ANALYTICS_ENABLED=on` is op verzoek van de eigenaar voor productie vastgelegd; preview blijft standaard uit. De privacytekst en cookiekeuze beschrijven de meting. Statistieken zijn geaggregeerd en bevatten geen individuele funnels of exacte uitvalmomenten.
5. Houd bewijsbuckets privé; activeer geen `r2.dev`-URL of custom domain. R2-limieten in de Worker zijn geen harde accountbrede maandelijkse factuurstop. Zie [Cloudflare R2-jurisdicties](https://developers.cloudflare.com/r2/reference/data-location/#jurisdictional-restrictions) en [Wrangler R2-commando's](https://developers.cloudflare.com/r2/reference/data-location/).

## Lokale checks

```powershell
npm run check:members
npx wrangler d1 migrations apply schaapsvis-members-preview --config workers/members/wrangler.jsonc --env preview --local --persist-to workers/members/.wrangler-preview
npx wrangler dev --config workers/members/wrangler.jsonc --env preview --local --persist-to workers/members/.wrangler-preview
```

De `--local`-vlag is essentieel: de previewconfiguratie bevat een remote Email Service-binding. Met `--local` blijven D1 en R2 lokaal en wordt e-mail alleen gesimuleerd; zonder die vlag kan e-mail echt worden verstuurd. De twee commando's gebruiken dezelfde lokale opslagmap, los van de Cloudflare-databases.

Maak voor handmatige lokale tests een niet-gecommitte `workers/members/.dev.vars.preview` met `MEMBERS_ENABLED="on"`, `SITE_ORIGIN="http://localhost:8787"`, `MAIL_FROM`, `ADMIN_EMAILS`, `AUTH_PEPPER` en `PASS_SIGNING_KEY`. Gebruik alleen aparte testwaarden, nooit productiegeheimen. De productiewaarde `MEMBERS_ENABLED="on"` hoort bij de password-gated preview; open de websitepoort niet zonder expliciete go-live-beslissing. Gebruik geen echte studentbewijzen of persoonsgegevens in fixtures.

## Google Wallet activeren

De Google Wallet-knop blijft standaard volledig verborgen. Hij wordt pas beschikbaar voor een goedgekeurde, geldige studentenpas wanneer alle onderstaande waarden aanwezig en geldig zijn:

- `GOOGLE_WALLET_ISSUER_ID`: de numerieke issuer-id uit Google Wallet Business Console.
- `GOOGLE_WALLET_CLASS_ID`: de vooraf aangemaakte Generic Pass-class, beginnend met dezelfde issuer-id.
- `GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL`: het e-mailadres van het geautoriseerde serviceaccount.
- `GOOGLE_WALLET_PRIVATE_KEY`: de PKCS#8 private key van dat serviceaccount, uitsluitend als versleuteld Cloudflare-secret.

Migratie `0015_student_wallet_passes.sql` is in productie al toegepast; pas haar ook toe op iedere andere omgeving voordat daar Wallet-credentials worden ingesteld. Migratie `0016_apple_wallet_updates.sql` bouwt daarop voort en moet vanaf de Apple-update-uitrol eveneens in elke omgeving staan. Stel daarna de eerste drie waarden in als gewone Worker-variabelen en de private key als secret. De Worker maakt vervolgens per aanvraag een tien minuten geldige, RS256-ondertekende officiële Save-to-Google-Wallet-link. Zonder volledige configuratie retourneert het endpoint veilig HTTP 503 en wordt geen knop getoond. Commit of log de private key nooit.

## Apple Wallet activeren

De Apple Wallet-knop blijft eveneens verborgen totdat een goedgekeurde,
geldige studentenpas én alle onderstaande waarden aanwezig en geldig zijn:

- `APPLE_WALLET_PASS_TYPE_ID`: de bij Apple geregistreerde identifier die met
  `pass.` begint.
- `APPLE_WALLET_TEAM_ID`: de tien tekens lange Apple Developer Team ID.
- `APPLE_WALLET_SIGNER_CERT`: het PEM-gecodeerde Pass Type ID-certificaat,
  uitsluitend als versleuteld Cloudflare-secret.
- `APPLE_WALLET_WWDR_CERT`: het bijbehorende PEM-gecodeerde Apple WWDR-
  intermediaire certificaat, uitsluitend als versleuteld Cloudflare-secret.
- `APPLE_WALLET_PRIVATE_KEY`: de bij het Pass Type ID-certificaat horende
  onversleutelde PKCS#8 PEM-private key, uitsluitend als versleuteld
  Cloudflare-secret.

De Worker maakt op verzoek een getekende Apple store card met naam, 10%,
geldigheid, korte controlecode, QR-code en het Schaap's-icoon. De `.pkpass`
wordt met het officiële MIME-type en `Cache-Control: private, no-store`
gedownload. Certificaten of sleutels mogen nooit in Git, logs of screenshots
terechtkomen. Test eerst installatie én een daarna ingetrokken QR-code op een
echt Apple-apparaat. Zonder complete configuratie blijft het endpoint gesloten
met HTTP 503.

De `.pkpass` bevat een `webServiceURL` en een stabiele per-pas
`authenticationToken`. Onder die URL implementeert de Worker de officiële
registratie-, update-, download-, afmeld- en logroutes. Device identifiers staan
alleen als keyed hash in D1; APNs-tokens zijn AES-GCM-versleuteld. Pas migratie
`0016_apple_wallet_updates.sql` toe vóór deze versie van de leden-Worker wordt
uitgerold. Een onmiddellijke update op een echt toestel vraagt daarnaast nog
een productie-APNs-configuratie met het Apple Pass Type-certificaat.

De integratietest met `npm run check:members` gebruikt eigen tijdelijke database- en e-mailmocks; daarvoor zijn geen Cloudflare-account, remote bindings of `.dev.vars` nodig.

## Studentenpasbeveiliging uitrollen

Uitrolstatus 1 november 2026: migratie 0017 staat in preview- en productie-D1,
PR #61 is samengevoegd, de productieleden-Worker `4b09794c` en site-Worker
`fdbe4698` stonden op Ready en de live healthcheck gaf `{"status":"ok"}`.
De onderstaande volgorde blijft gelden voor toekomstige omgevingen en updates.

Migratie `0017_student_pass_security.sql` voegt herroepbare langlopende sessies,
gehashte installatiekenmerken, uitlegbare beveiligingsgebeurtenissen,
verificatieverzoeken, beheer-audit en eenmalige twee-minuten-QR-codes toe. De
migratie is achterwaarts compatibel met de huidige Worker; de nieuwe Worker is
zonder deze tabellen niet compatibel. Volg daarom altijd deze volgorde:

1. voer alle lokale integratiechecks en de volledige sitebuild uit;
2. pas 0017 eerst toe op `schaapsvis-members-preview` en controleer tabellen,
   kolommen en standaarddrempels;
3. deploy de preview-Worker en test login, eenmalige inloglink, dynamische QR,
   intrekken, schorsen, extra verificatie en onbevoegde beheertoegang;
4. pas daarna 0017 toe op `schaapsvis-members` productie;
5. deploy de productie-Worker en controleer de echte healthcheck en één
   gecontroleerde accountstroom.

Gebruik bij een aangemelde Wrangler-installatie de expliciete omgeving:

```powershell
npx wrangler d1 migrations apply schaapsvis-members-preview --remote --config workers/members/wrangler.jsonc --env preview
npx wrangler deploy --config workers/members/wrangler.jsonc --env preview
npx wrangler d1 migrations apply schaapsvis-members --remote --config workers/members/wrangler.jsonc --env production
npx wrangler deploy --config workers/members/wrangler.jsonc --env production
```

De beheerpagina staat op `/<taal>/beheer/beveiliging` en blijft dubbel
afgeschermd door de bestaande beheer-e-maillijst én IP-allowlist. Een
waarschuwing blokkeert nooit automatisch. Een ingetrokken installatie wordt bij
een latere geldige login niet heractiveerd, maar vervangen door een nieuw
installatiekenmerk. De browser ontvangt geen permanent ondertekend pastoken;
alleen de dynamische QR of de zichtbare handmatige korte code wordt geaccepteerd.
Gezichts- en identiteitsfoto's zijn bewust niet geïmplementeerd.

## Open bedrijfs- en privacykeuzes

- De 10% studentenkorting geldt na goedkeuring voor het hele assortiment en is niet te combineren met nieuwsbriefkortingen of andere acties.
- De eigenaar heeft aangegeven reclame via het persoonlijke e-mailadres verplicht te willen stellen voor studentenkorting. De huidige pagina beschrijft nieuwsbriefdeelname juist als vrijwillig en apart. Maak marketingtoestemming niet verplicht voordat dit juridisch is getoetst: AVG artikel 7(4) vraagt extra aandacht wanneer een dienst afhankelijk wordt gemaakt van toestemming voor verwerking die niet nodig is voor die dienst. De Autoriteit Persoonsgegevens zegt dat toestemming niet vrijelijk is gegeven als iemand wordt benadeeld bij weigering. Bronnen: [AVG artikel 7](https://eur-lex.europa.eu/eli/reg/2016/679/oj#d1e2024-1-1) en [Autoriteit Persoonsgegevens: grondslag toestemming](https://autoriteitpersoonsgegevens.nl/themas/basis-avg/avg-algemeen/grondslag-toestemming). Houd aanmelding daarom optioneel totdat een privacyjurist/controller dit heeft beoordeeld.
- De formele bewaartermijn voor aanvraagmetadata en procedure voor inzage/verwijdering.
- De uiteindelijke privacyverklaring, verantwoordelijke beoordelaars en geverifieerde afzender.

Een goedgekeurde pas geeft 10% korting op het hele assortiment en is één studiejaar geldig; daarna kan de student verlenging aanvragen met schoolmail of inschrijvingsbewijs.

## Studentenaanmelding en beheer (9 november 2026)

De studentenregistratie vraagt het persoonlijke e-mailadres en een wachtwoord. Bij de schoolmailroute bevestigt de student twee codes. Zonder schoolmail bevestigt de student één persoonlijke code en uploadt daarna een actueel inschrijvingsbewijs (PDF, JPG of PNG, maximaal 8 MB). Beide routes vragen onderwijsinstelling, opleidingsniveau en studiestad. Bewijsuploads gebruiken de afgeschermde R2-bucket, opslaglimieten en verwijderwachtrij. Alleen apart gegeven reclametoestemming geldt voor het persoonlijke adres. Het beheeronderdeel E-mailadressen toont de account- en nieuwsbriefadressen met hun toestemmingsstatus. Migraties tot en met 0017 zijn vereist. De verificatiecodes zijn eenmalig, worden HMAC-gehasht en verlopen na tien minuten.

Na ‘Verder’ bewaart de klanteninschrijving eerst tijdelijk een e-maildraft.
Een regiokeuze werkt ditzelfde record direct bij via `PATCH /api/members/newsletter/draft`.
Hiervoor is het willekeurige drafttoken nodig; het endpoint wijzigt geen bestaande
nieuwsbriefinschrijving en verstuurt geen mail. Bij toestemming en ‘Schrijf mij in’
wordt de gekozen regio bij de actieve inschrijving opgeslagen en de draft verwijderd.
Drafts verlopen na 30 minuten en worden door scheduled cleanup verwijderd;
een regiowijziging verlengt deze termijn niet. Migratie `0021_newsletter_draft_region.sql`
voegt alleen de regiokolom aan de tijdelijke tabel toe. Regio-tags: Leiden, Voorschoten, Wassenaar,
Leidschendam, elders in regio 071 en elders. Leeftijd/geboortedatum wordt niet
verzameld.

Klaviyo is nog niet gekoppeld. Bij een latere koppeling blijven bevestigde
toestemming en afmelding in deze Worker leidend. De site-, account- en
studenten-Workers zijn gedeployed; klantaccounts voor bezorging en spaarpunten
blijven toekomstige ontwikkeling.

