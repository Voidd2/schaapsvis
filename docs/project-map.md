# Projectkaart — Schaap's Vishandel

Deze kaart is de korte ingang voor vervolgwerk. De code en actuele Cloudflare-status blijven leidend; tijdgebonden bevindingen hieronder zijn expliciet gedateerd.

## Architectuur

- **Website:** Next.js 16 met vinext, pagina's in `src/app/[locale]/`, gedeeld materiaal in `src/components/` en `src/lib/`. Worker `schaapsvis` beheert `schaapsvishandel.nl`; configuratie staat in `cloudflare.config.ts`.
- **Leden en studenten:** Worker `schaapsvis-members` ontvangt `/api/members/*`. Bron: `workers/members/src/index.mjs`; configuratie: `workers/members/wrangler.jsonc`; productiedatabase: D1 `schaapsvis-members`; studentbewijs: private EU-R2-bucket. Schema: `migrations/0001` t/m `0015`.
- **Mail:** de leden-Worker gebruikt Knoth SMTP op poort 587. De host en gebruikersnaam staan in de Worker-config; het wachtwoord en de auth-sleutels staan uitsluitend als Cloudflare-secrets. Knoth blijft domeinregistrar en mailboxprovider; Cloudflare beheert DNS en hosting.
- **Toegang:** de website is nog met een sitewachtwoord afgeschermd. De leden-API controleert daarnaast de sitecookie of het vertrouwde eigenaar-IP. Openbare registratie is nog geen goedgekeurde livegang.

## Vaststaande productkeuzes

- Goedgekeurde studenten krijgen **10% korting op het hele assortiment**, zonder stapeling met andere acties. Een privé-e-mailadres en een apart schooladres worden bevestigd voordat een aanvraag kan worden ingediend. Het schooladres vervangt voortaan de bewijsupload; de aanvraag vraagt wel onderwijsinstelling, niveau en studiestad.
- Aanbiedingen per e-mail gaan over op aantoonbare single opt-in: een duidelijke afzonderlijke keuze wordt direct actief, zonder extra bevestigings- of losse afmeldmail. Iedere campagne houdt een werkende afmeldlink. Accountregistratie alleen is geen marketingtoestemming.
- Campagnes kunnen op regio en op geverifieerde studenten worden gericht. Er is geen automatisch wekelijks aanbod. Bezorging en spaarpunten worden niet op de huidige accountpagina beloofd en vallen buiten de huidige scope.
- Gebruik echte winkel- en kraamfoto's alleen als ze daadwerkelijk van Schaap's zijn. De eigenaar wil visschalen en gourmetschalen qua beeld grotendeels behouden.

## Bewezen status op 27 oktober 2026

- GitHub `main` commit `09dd62d` is in Cloudflare voor beide productie-Workers als **Ready, 100% verkeer** gezien. `https://schaapsvishandel.nl/api/members/health` gaf `{"status":"ok"}`.
- De beheeraanmelding faalde eerder vóór accountopslag: de code vroeg 210.000 PBKDF2-rondes terwijl de productie-Worker maximaal 100.000 toestaat. `09dd62d` past de hash en de integratietest aan. Vóór een nieuwe eigenaarspoging bevatte D1 **nul** beheeraccounts. Verifieer dit opnieuw; het is geen blijvende toestand.
- De directe Knoth SMTP-test kwam bij de eigenaar aan, in Gmail Spam. Op 27 oktober gaf een no-send controle vanuit de live leden-Worker `status: authenticated` (HTTP 200). Daarna accepteerde Knoth ook een echt vanuit die productie-Worker verstuurd diagnostisch bericht (HTTP 202); inboxplaatsing daarvan is niet afzonderlijk gecontroleerd. `SMTP_DIAGNOSTICS` staat weer `off`. Een volledige verificatiemail vanuit een echte registratie moet nog worden bevestigd.
- In Cloudflare zijn voor beide productie-Workers `docs/*`, `README.md`, `AGENTS.md` en `workers/members/README.md` uitgesloten van automatische Git-builds. Codewijzigingen blijven builds starten; dit voorkomt nieuwe builds voor alleen deze projectdocumentatie. [Cloudflare-regels](https://developers.cloudflare.com/workers/ci-cd/builds/build-watch-paths/).
- De aparte `schaapsvis-members-preview` Worker heeft eigen D1/R2 maar staat uit. De afgeschermde hoofdsite wordt momenteel als preview gebruikt. Cloudflare-account **Schaapsvis** is de juiste account; Citywalk Stories hoort bij de andere account.

## Volgende verificatie

1. Laat de eigenaar het al geopende beheerformulier met zijn eigen wachtwoord indienen en de link in `schaapsv@schaapsvishandel.nl` bevestigen. De browserbeveiligingsregel vereist dat hij de definitieve indiening van een nieuw wachtwoord zelf doet. Deel of log het wachtwoord niet.
2. Lees in productie-D1 of `users.email_verified_at` is gezet. Controleer daarna login, beheerpagina en een gecontroleerde studentenregistratie met beide verificatiecodes. Gebruik geen verzonnen adressen in productie.
3. Controleer de aflevering van een echte registratiemail, privacytekst, bewaartermijnen en bewijsverwijdering voordat de toegangspoort voor publiek opengaat.

## Snelle route naar antwoorden

| Vraag | Eerste plek |
| --- | --- |
| Welke pagina of navigatielink? | `src/app/[locale]/`, `src/components/` |
| Welke vis, prijs of beschikbaarheid? | `src/lib/assortiment-data.ts`, `src/lib/product-availability.ts`, `src/lib/prijzen.ts` |
| Welk recept of beeld? | `src/lib/recepten.ts`, `src/lib/recept-fotos.ts` |
| Hoe werken login, korting of nieuwsbrief? | `workers/members/src/index.mjs`, `workers/members/README.md` |
| Wat is het plan voor registratie, pas en Wallet? | `docs/studentenaccount-uitvoerplan.md` |
| Is een databasekolom aanwezig? | `migrations/`; daarna read-only controle in juiste D1-omgeving |
| Is een wijziging live? | GitHub `main`-SHA, vervolgens **beide** Cloudflare Deployments en de echte domeinroute |

Gerichte tests staan in de hoofd-README. Run niet de volledige sitebuild voor een tekst- of documentwijziging zonder concrete reden.

## Tokenzuinige werkroute

1. Lees eerst deze projectkaart en alleen het bestand uit de tabel dat bij de vraag hoort; scan niet standaard de hele repository.
2. Gebruik `rg` op route, component- of foutnaam en open daarna alleen de directe aanroepers. Cloudflare-status wordt pas bekeken als de lokale code of deploystatus daar aanleiding toe geeft.
3. Draai de kleinste passende controle: `npm run check:members` voor accounts/mail, `npm run check:content` voor assortiment/recepten en alleen een volledige Next- plus Cloudflare-build wanneer componenten, routes of runtimecode wijzigen.
4. Controleer livegang altijd in deze vaste volgorde: GitHub `main`-SHA, Worker `schaapsvis-members`, Worker `schaapsvis`, echte domeinroute. Zo wordt Vercel niet ten onrechte als bewijs voor Cloudflare gebruikt.
