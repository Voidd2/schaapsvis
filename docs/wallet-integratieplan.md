# Studentenpas in Apple Wallet en Google Wallet

## Wat nu al klaarstaat

- De digitale studentenpas bevat naam, geldigheid, 10% korting, een korte controlecode en een lokale QR-code.
- De QR-code bevat alleen de korte controlecode (`SV-XXXX-XXXX`), geen e-mailadres of sessiesleutel.
- Alleen een ingelogde beheerder op het toegestane netwerk kan de code controleren.
- Dezelfde pas-id, naam, vervaldatum en controlecode kunnen later als bron voor beide Wallet-passen dienen.

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
2. Logo- en icoonbestanden in de vereiste Wallet-formaten maken.
3. Wallet-endpoints in de leden-Worker bouwen met dezelfde actieve-pascontrole als de website.
4. Secrets via Cloudflare instellen en testpassen uitsluitend voor het beheerdersaccount uitgeven.
5. Vervallen of ingetrokken passen aan beide Wallets doorgeven.
6. Pas na echte installatie- en intrekkingstests de twee Wallet-knoppen tonen.
