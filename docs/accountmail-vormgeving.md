# Vormgeving accountmails — 5 november 2026

De gedeelde HTML-presentatie staat in `workers/members/src/email-templates.mjs`.
Deze module genereert HTML en de persoonlijke tekstversie: mailtransport, tokens, vervaltijden,
inschrijving en accounttoegang blijven in de bestaande leden-Worker.

- Bestaand rond logo (192px PNG, 80px weergegeven; 64px mobiel) via de reeds
  publieke assetroute. Live HTTP200/image/png gecontroleerd zonder cookie.
- Donkerblauw, zachtblauwe achtergrond, wit berichtvlak, subtiel goudaccent;
  serif-koppen en goed leesbare Arial-tekst. Bedrijfsnaam blijft tekst wanneer
  een mailprogramma afbeeldingen niet laadt.
- NL/EN/DE-header, verificatiecode-label, hulptekst en footer met winkeladres.
- Grote actieknop en leesbare alternatieve link met exact hetzelfde token.
  Verificatiecodes staan als selecteerbare tekst, nooit in een afbeelding.
- Tabelindeling, inline basisstijlen, Outlook-breedtefallback en mobiele
  padding. Geen externe fonts, scripts, trackingpixels of nieuwe advertentieblokken.
- De campagnes delen de vormgeving, maar blijven uitgeschakeld.

## Controle

Ledenintegratietests en SMTP-protocoltest geslaagd. Extra controles bewijzen
HTML-escaping en identieke knop-/fallbacklinks in drie talen. De bestaande
afmeldtest kiest nu specifiek de afmeldlink, niet de eerste URL (dat is nu het
logo). Wrangler 4.151.1 production dry-run bundelt de nieuwe module succesvol.

Chrome-preview met fictieve code/link: Nederlandse code en reset, Engelse code
en Duitse reset. Geen horizontale overflow op smalle weergave; actieknop circa
54px hoog. Het logo laadt. Screenshots buiten Git:
`../design-preview/cloudflare-email/design-verification.png` en
`design-reset-mobile.png`. Browserweergave is geen volledige Outlook/Gmail-clienttest.

Geen nieuwe echte mail verzonden. De Inbox/PASS-test van PR #105 bewijst het
Cloudflare-transport vóór deze vormgevingswijziging, niet deze nieuwe HTML-layout.
Gepubliceerd via PR #106 als `3a76654`: Build267 en Member161 geslaagd,
Codex-review zonder bevindingen. Cloudflare leden `9212717d` en site `1e80625c`
beide 100% Ready; live leden-health HTTP200/status ok. Het ontwerp geldt voor
volgende mails; reeds ontvangen berichten veranderen niet.

## Persoonlijke aanhef en footer

Accountmails gebruiken de opgeslagen voornaam, met volledige naam als fallback
voor oudere accounts en beheeraccounts. Ontbreekt beide, dan volgt een neutrale
aanhef. Verificatie bij registratie gebruikt de gevalideerde registratienaam;
herverzending, reset en inloglinks halen de naam uit de database. Beheermeldingen
gebruiken de naam van de ontvanger, niet van de betreffende student.

NL/EN/DE en de tekstversie bevatten website, privacyverklaring en een duidelijk
benoemde link naar de bestaande voorwaarden voor studentenkorting. Het anker
`studentenkorting#voorwaarden` opent de bestaande voorwaarden; er zijn geen
algemene voorwaarden verzonnen. De dubbele verborgen intro is verwijderd.

Tests controleren namen, accents/compound names, lege en historische namen,
HTML-escaping, locale-links en opgeslagen namen bij reset/resend/inloggen.
Personalisatie is geen garantie tegen spam: Google benadrukt authenticatie,
reputatie en spamklachten, niet de aanwezigheid van de voornaam.
Bron: https://support.google.com/mail/answer/81126?hl=en.
Geen nieuwe echte testmail verstuurd; de eerdere Inbox-test blijft afzonderlijk.
