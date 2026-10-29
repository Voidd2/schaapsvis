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

## Apple Wallet

Apple vereist voordat een echte knop kan werken:

1. Een Apple Developer-account met de rol Account Holder of Admin.
2. Een geregistreerde Pass Type ID.
3. Een Pass Type ID Certificate met bijbehorende privé-sleutel.
4. Servercode die een manifest en PKCS #7-handtekening maakt en een ondertekend `.pkpass`-bestand levert.
5. Een downloadendpoint met het juiste Wallet MIME-type en een officiële “Add to Apple Wallet”-knop.

De pas past inhoudelijk het best als een generic pass of store card. De ondertekeningssleutel mag nooit in de browser of GitHub staan; die hoort als versleuteld Cloudflare-secret in de Worker.

Officiële documentatie:

- https://developer.apple.com/help/account/capabilities/create-wallet-identifiers-and-certificates
- https://developer.apple.com/documentation/walletpasses/building-a-pass
- https://developer.apple.com/documentation/walletpasses/distributing-and-updating-a-pass

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

## Uitvoervolgorde zodra de accounts beschikbaar zijn

1. Apple Pass Type ID/certificaat en Google issuer/serviceaccount aanmaken.
2. In Google een Generic Pass Class maken en de waarden
   `GOOGLE_WALLET_ISSUER_ID`, `GOOGLE_WALLET_CLASS_ID` en
   `GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL` instellen; zet de PKCS#8-sleutel
   uitsluitend als Cloudflare-secret `GOOGLE_WALLET_PRIVATE_KEY`.
3. Logo- en icoonbestanden in de vereiste Wallet-formaten maken en het officiële
   Google-knopbeeld gebruiken vóór publieke activatie.
4. Eén Google-testpas voor het beheerdersaccount installeren en intrekken; pas
   daarna de Google-configuratie in productie laten staan.
5. Het Apple `.pkpass`-endpoint bouwen zodra het certificaat beschikbaar is en
   dezelfde actieve-pascontrole als Google gebruiken.
6. Vervallen of ingetrokken passen aan beide Wallets doorgeven en pas na echte
   installatie- en intrekkingstests beide Wallet-knoppen tonen.
