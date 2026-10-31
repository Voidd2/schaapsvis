# Studentenpas in Apple Wallet en Google Wallet

## Wat nu al klaarstaat

- De digitale studentenpas bevat naam, geldigheid, 10% korting, een korte controlecode en een lokale QR-code.
- De QR-code bevat alleen de korte controlecode (`SV-XXXX-XXXX`), geen e-mailadres of sessiesleutel.
- Alleen een ingelogde beheerder op het toegestane netwerk kan de code controleren.
- Dezelfde pas-id, naam, vervaldatum en controlecode kunnen later als bron voor beide Wallet-passen dienen.
- Migratie `0015_student_wallet_passes.sql` bewaart per interne pas het platform,
  externe object-id en de intrekstatus zonder persoonsgegevens in de QR-code te
  zetten.
- De leden-Worker kan een kort geldige, met RS256 ondertekende Google
  Save-to-Wallet-link maken. De pas bevat de volledige naam, 10%, geldigheid,
  korte controlecode, QR-code en links naar Account en Locaties.
- De Google Wallet-knop verschijnt uitsluitend wanneer alle issuer-variabelen
  en de versleutelde privésleutel aanwezig zijn. Zonder configuratie faalt het
  endpoint gesloten met HTTP 503; een actieve goedgekeurde studentenpas blijft
  altijd vereist.
- De leden-Worker kan ook een ondertekend Apple `.pkpass`-bestand maken. De
  store card bevat de volledige naam, 10%, geldigheid, korte controlecode,
  QR-code en een Schaap's-icoon. De download gebruikt het officiële
  `application/vnd.apple.pkpass`-MIME-type en wordt niet gecachet.
- Ook de Apple Wallet-knop verschijnt pas bij een actieve goedgekeurde pas én
  een volledige certificaatconfiguratie. Zonder die configuratie blijft de knop
  verborgen en retourneert het endpoint veilig HTTP 503.
- Migratie `0016_apple_wallet_updates.sql` voegt het officiële Apple
  Wallet-updateprotocol toe. Een geïnstalleerde pas kan zich registreren,
  gewijzigde serienummers opvragen, een opnieuw ondertekende pas downloaden en
  zich afmelden. De device library identifier wordt alleen als keyed hash
  bewaard en de APNs-pushtoken versleuteld. De authentication token is stabiel
  per pas, maar staat niet leesbaar in D1.

## Apple Wallet

De servercode en interface staan klaar. Apple vereist voor daadwerkelijke
activatie nog:

1. Een Apple Developer-account met de rol Account Holder of Admin.
2. Een geregistreerde Pass Type ID.
3. Een Pass Type ID Certificate met bijbehorende privé-sleutel.
4. Het Apple WWDR-intermediaire certificaat dat bij het Pass Type-certificaat hoort.
5. Een echte installatie- en intrekkingstest op een Apple-apparaat.

De implementatie gebruikt een store card. De ondertekeningssleutel en
certificaten mogen nooit in de browser of GitHub staan; ze horen als
versleutelde Cloudflare-secrets in de Worker. De tests gebruiken uitsluitend
een herkenbare lokale TEST ONLY-certificaatketen. Een ingetrokken studentenpas
wordt bij controle van de QR-code geweigerd en de update-service retourneert
hem als `voided`. Registreren, gewijzigde serienummers opvragen, opnieuw
downloaden, `If-Modified-Since` en afmelden zijn geautomatiseerd getest. Voor
een onmiddellijke update op het toestel moet productie later nog een lege APNs-
push versturen met het echte Pass Type-certificaat; tot die configuratie er is,
worden geregistreerde pushtokens alleen versleuteld bewaard.

Officiële documentatie:

- https://developer.apple.com/help/account/capabilities/create-wallet-identifiers-and-certificates
- https://developer.apple.com/documentation/walletpasses/building-a-pass
- https://developer.apple.com/documentation/walletpasses/distributing-and-updating-a-pass
- https://developer.apple.com/documentation/walletpasses/adding-a-web-service-to-update-passes

### Wat de eigenaar concreet moet doen

1. Schrijf Schaap's Vishandel in voor het Apple Developer Program. Voor een
   organisatie vraagt Apple onder meer de wettelijke entiteit, een D‑U‑N‑S-
   nummer, een zakelijk e-mailadres op het eigen domein en een publieke website.
   Een organisatie-account heeft de voorkeur, zodat de bedrijfsnaam bij de
   uitgever hoort. Het programma kost volgens Apple **USD 99 per jaar** (of het
   lokale equivalent waar Apple dat aanbiedt).
2. Open na goedkeuring **Certificates, Identifiers & Profiles → Identifiers →
   Pass Type IDs** en registreer bijvoorbeeld
   `pass.nl.schaapsvishandel.student`.
3. Maak voor die Pass Type ID een **Pass Type ID Certificate**. Apple laat
   hiervoor een Certificate Signing Request uploaden. Bewaar de bijbehorende
   privésleutel op een vertrouwde computer en exporteer certificaat plus
   privésleutel als beveiligd `.p12`-bestand.
4. Noteer de **Team ID** en **Pass Type ID**. Die twee waarden zijn geen geheim.
   Het `.p12`-bestand, het exportwachtwoord en de privésleutel zijn dat wel:
   plaats die nooit in chat, Git of een e-mailbijlage.
5. Download het actuele Apple WWDR-intermediaire certificaat. Daarna kunnen de
   Pass Type ID, Team ID, het signer-certificaat, WWDR-certificaat en de
   privésleutel via Cloudflare-secrets aan de leden-Worker worden gekoppeld.
6. Installeer één testpas op een echte iPhone, trek de studentenpas in via
   beheer en controleer vervolgens zowel de QR-status als de Wallet-update.

Apple-bronnen voor inschrijving en kosten:

- https://developer.apple.com/programs/enroll/
- https://developer.apple.com/help/account/membership/program-enrollment/

## Google Wallet

Google vereist voordat een echte knop kan werken:

1. Een Google Wallet API Issuer-account.
2. Een Google Cloud-project met de Google Wallet API ingeschakeld.
3. Een serviceaccount dat aan de issuer is gekoppeld.
4. Een Generic Pass Class en per student een Generic Pass Object.
5. Een door de server ondertekende “Save to Google Wallet”-link/JWT.
6. Publicatietoegang; nieuwe issuer-accounts starten in demo-modus.

De serviceaccount-sleutel mag alleen als versleuteld Cloudflare-secret worden opgeslagen. Omdat de pas een naam bevat, controleren we bij onboarding ook of Google hiervoor de gewone Generic Pass of de vooraf goed te keuren Generic Private Pass verlangt.

Officiële documentatie:

- https://developers.google.com/wallet/generic
- https://developers.google.com/wallet/generic/getting-started/issuer-onboarding

### Wat de eigenaar concreet moet doen

1. Open de Google Pay & Wallet Console en maak een Wallet-issuer voor
   Schaap's Vishandel. Een nieuwe issuer start in demo-modus.
2. Kies of maak een Google Cloud-project en schakel de Google Wallet API in.
3. Maak in dat project een serviceaccount en download een JSON-sleutel.
4. Voeg het e-mailadres van dat serviceaccount in de Wallet-console toe met de
   rol **Developer**.
5. Maak een Generic Pass Class voor de Schaap's-studentenpas. Noteer issuer-ID,
   class-ID en serviceaccount-e-mailadres; bewaar de private key uit het
   JSON-bestand uitsluitend als geheim.
6. Vul het Business Profile in en vraag publishing access aan. Tot goedkeuring
   blijven testpassen als `TEST ONLY` zichtbaar.
7. Koppel de drie openbare identifiers en de private key via Cloudflare-vars en
   -secrets, installeer één testpas en controleer daarna intrekking.

Google noemt in de officiële onboardingdocumentatie geen afzonderlijk
abonnementstarief voor een Wallet-issuer. Dat is geen garantie dat andere
Google Cloud- of betaalprofielkosten nooit kunnen gelden; controleer daarom het
Cloud-project en de factureringsinstellingen voordat productie wordt geopend.

Aanvullende Google-bronnen:

- https://developers.google.com/wallet/generic/getting-started/auth/rest
- https://developers.google.com/wallet/generic/test-and-go-live/request-publishing-access

## Uitvoervolgorde zodra de accounts beschikbaar zijn

1. Apple Pass Type ID/certificaat en Google issuer/serviceaccount aanmaken.
2. In Google een Generic Pass Class maken en de waarden
   `GOOGLE_WALLET_ISSUER_ID`, `GOOGLE_WALLET_CLASS_ID` en
   `GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL` instellen; zet de PKCS#8-sleutel
   uitsluitend als Cloudflare-secret `GOOGLE_WALLET_PRIVATE_KEY`.
3. Voor Apple `APPLE_WALLET_PASS_TYPE_ID` en `APPLE_WALLET_TEAM_ID` als
   Worker-variabelen instellen. Zet `APPLE_WALLET_SIGNER_CERT`,
   `APPLE_WALLET_WWDR_CERT` en `APPLE_WALLET_PRIVATE_KEY` uitsluitend als
   versleutelde Cloudflare-secrets. Het Apple Wallet-icoon staat al klaar.
4. Het officiële Google-knopbeeld gebruiken vóór publieke activatie.
5. Eén Google-testpas voor het beheerdersaccount installeren en intrekken; pas
   daarna de Google-configuratie in productie laten staan.
6. Eén Apple-testpas op een echt Apple-apparaat installeren en de QR-code na
   intrekking controleren; laat de configuratie pas daarna in productie staan.
7. Voor Apple de APNs-updatepush activeren en voor Google de objectstatus via de
   officiële API synchroniseren. Pas na echte installatie- en
   intrekkingstests beide Wallet-knoppen tonen.
