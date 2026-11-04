# Projectkaart — Schaap's Vishandel

Deze kaart is de korte ingang voor vervolgwerk. De code en actuele Cloudflare-status blijven leidend; tijdgebonden bevindingen hieronder zijn expliciet gedateerd.

## Architectuur

- **Website:** Next.js 16 met vinext, pagina's in `src/app/[locale]/`, gedeeld materiaal in `src/components/` en `src/lib/`. Worker `schaapsvis` beheert `schaapsvishandel.nl`; configuratie staat in `cloudflare.config.ts`.
- **Leden en studenten:** Worker `schaapsvis-members` ontvangt `/api/members/*`. Bron: `workers/members/src/index.mjs`; configuratie: `workers/members/wrangler.jsonc`; productiedatabase: D1 `schaapsvis-members`; historisch studentbewijs: private EU-R2-bucket. Schema: `migrations/0001` t/m `0017`.
- **Mail:** productie gebruikt sinds PR #105 Cloudflare Email Sending via de EMAIL-binding, vanaf `account@berichten.schaapsvishandel.nl`, met antwoorden naar de zakelijke Knoth-mailbox. Campagneverzending staat uit; inschrijvingen/toestemming blijven behouden voor een latere marketingdienst. Knoth blijft inkomende mailboxprovider en SMTP-configuratie blijft alleen voor expliciete rollback/preview behouden. Auth-sleutels en bestaande SMTP-wachtwoorden blijven secrets. Details en echte Gmail-Inbox-test van 5 november: `docs/cloudflare-accountmail.md`.
- **Toegang:** de website is nog met een sitewachtwoord afgeschermd. De leden-API controleert daarnaast de sitecookie of het vertrouwde eigenaar-IP. Openbare registratie is nog geen goedgekeurde livegang.

## Vaststaande productkeuzes

- Goedgekeurde studenten krijgen **10% korting op het hele assortiment**, zonder stapeling met andere acties. Een privé-e-mailadres en een apart schooladres worden bevestigd voordat een aanvraag kan worden ingediend. Het schooladres vervangt voortaan de bewijsupload; de aanvraag vraagt wel onderwijsinstelling, niveau en studiestad.
- Aanbiedingen per e-mail gaan over op aantoonbare single opt-in: een duidelijke afzonderlijke keuze wordt direct actief, zonder extra bevestigings- of losse afmeldmail. Iedere campagne houdt een werkende afmeldlink. Accountregistratie alleen is geen marketingtoestemming.
- Campagnes kunnen op regio en op geverifieerde studenten worden gericht. Er is geen automatisch wekelijks aanbod. Bezorging en spaarpunten worden niet op de huidige accountpagina beloofd en vallen buiten de huidige scope.
- Gebruik echte winkel- en kraamfoto's alleen als ze daadwerkelijk van Schaap's zijn. De eigenaar wil visschalen en gourmetschalen qua beeld grotendeels behouden.

## Bewezen status

- **3 november, late acceptatie:** echte eigenaarstestpas via beheer geblokkeerd, na herladen bevestigd en weer actief gemaakt; verse login bevestigt herstel en correcte blokkadefiltering. Eén nieuw goedgekeurde Knoth-mail is in Gmail Spam bezorgd ondanks SPF/DKIM/DMARC PASS. De test gebruikt de actuele MIME/template vanaf de lokale machine; geen bewijs van de volledige Worker-registratiestroom. Zie `studenten-eindcontrole-2026-11-03.md` en `email-bezorging-audit.md`. Geen nieuwe verzending zonder nieuwe toestemming; inboxacceptatie blijft open.

- Actuele vervolgstatus staat bovenaan `CODEX_PROGRESS.md`. De historische mailnotitie hieronder is ingehaald door `docs/email-bezorging-audit.md`: echte Gmail-headers bevestigden SPF/DKIM/DMARC PASS en een resetmail kwam in Postvak IN. Dit bewijst niet dat iedere nieuwe registratiemail na latere mailwijzigingen in de inbox komt. Wallet-activering is op eigenaarsverzoek uitgesteld; niet opnieuw als open implementatie oppakken.

- Op 1 november 2026 is PR #61 samengevoegd en door Cloudflare gebouwd: leden-Worker `4b09794c` en site-Worker `fdbe4698` stonden op Ready. De live healthcheck gaf `{"status":"ok"}`. Preview-D1 bevat migraties 0013 t/m 0017 en productie-D1 bevat aantoonbaar 0017.
- De studentenpasbeveiliging is live met herroepbare langlopende sessies, willekeurige gehashte installatiekenmerken, uitlegbare risicosignalen, auditlog, extra verificatie en eenmalige dynamische QR-codes. De live beheerroute weigert zonder toegestaan account én netwerk terecht met `forbidden`.

- GitHub `main` commit `09dd62d` is in Cloudflare voor beide productie-Workers als **Ready, 100% verkeer** gezien. `https://schaapsvishandel.nl/api/members/health` gaf `{"status":"ok"}`.
- De beheeraanmelding faalde eerder vóór accountopslag: de code vroeg 210.000 PBKDF2-rondes terwijl de productie-Worker maximaal 100.000 toestaat. `09dd62d` past de hash en de integratietest aan. Vóór een nieuwe eigenaarspoging bevatte D1 **nul** beheeraccounts. Verifieer dit opnieuw; het is geen blijvende toestand.
- De directe Knoth SMTP-test kwam bij de eigenaar aan, in Gmail Spam. Op 27 oktober gaf een no-send controle vanuit de live leden-Worker `status: authenticated` (HTTP 200). Daarna accepteerde Knoth ook een echt vanuit die productie-Worker verstuurd diagnostisch bericht (HTTP 202); inboxplaatsing daarvan is niet afzonderlijk gecontroleerd. `SMTP_DIAGNOSTICS` staat weer `off`. Een volledige verificatiemail vanuit een echte registratie moet nog worden bevestigd.
- In Cloudflare zijn voor beide productie-Workers `docs/*`, `README.md`, `AGENTS.md` en `workers/members/README.md` uitgesloten van automatische Git-builds. Codewijzigingen blijven builds starten; dit voorkomt nieuwe builds voor alleen deze projectdocumentatie. [Cloudflare-regels](https://developers.cloudflare.com/workers/ci-cd/builds/build-watch-paths/).
- De aparte `schaapsvis-members-preview` Worker heeft eigen D1/R2 maar staat uit. De afgeschermde hoofdsite wordt momenteel als preview gebruikt. Cloudflare-account **Schaapsvis** is de juiste account; Citywalk Stories hoort bij de andere account.

## Volgende verificatie

1. Test op een echt iOS-toestel normale Safari, PWA-installatie, uitloggen/intrekken en opnieuw aanmelden.
2. Echte beheerintrek/herstel is afgetekend op de bestaande eigenaarstestpas; een fysieke kassascan blijft open. De onbevoegde route is al fail-closed getest.
3. Controleer vóór het publiek openen opnieuw echte registratiemail, privacytekst, bewaartermijnen en verwijderprocedure. Gebruik geen verzonnen adressen of echte bewijsstukken in productie.

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
