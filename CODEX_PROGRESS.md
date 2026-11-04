# Schaap's Vishandel — voortgang

## Cloudflare-accountmail — 5 november 2026

- Eigenaar koos Cloudflare voor account-/verificatiemails; reclame later via een andere dienst. Lijst en expliciete toestemmingen behouden.
- Workers Paid na expliciet checkout-akkoord geactiveerd ($5/maand plus meerverbruik). Verzenddomein `berichten.schaapsvishandel.nl` toont Enabled / DNS Configured. Root-onboarding met p=reject is door auto-review geblokkeerd; veilig alternatief wijzigt alleen een nieuw subdomein.
- Branch `codex/cloudflare-account-email`: expliciete providerkeuze, herkenbare accountafzender, geen automatische SMTP-fallback, campagneverzending en cron gepauzeerd met NL/EN/DE-beheeruitleg. Accounts/consents/afmeldingen behouden, geen migratie.
- Leden- en SMTP-tests, TypeScript, gerichte ESLint, contentcontrole, Next-build (572 pagina’s), Cloudflare-build en Wrangler production dry-run geslaagd. Details: `docs/cloudflare-accountmail.md`.
- Nog te doen: commit/PR, productie-uitrol, live mailcontrole en inboxbewijs. Toestemming voor één nieuwe testmail gevraagd; nog geen echte mail verzonden.
- Google Postmaster-domein is geverifieerd; nog onvoldoende volume voor reputatierapport.

Laatst bijgewerkt: 4 november 2026, Europe/Amsterdam

## Studentenkorting als advertentielandingspagina

- Gepubliceerd via PR #104 als `b76a036`, Cloudflare `6c192cfa` 100% Ready. Nieuwe NL/EN/DE-opbouw met duidelijk 10%-aanbod, voorwaarden, aanmeldstappen, voorbeeldpas/logo, lokale bezoekinformatie, FAQ en herhaalde aanvraagknop. Aanvraaglink opent alleen het bestaande registratietabblad; normale accountlinks blijven login. Geen account-/mail-/kortingsregels veranderd. Lokale read-only browsertest, inhoud/lint, Next/Vite-builds en Build263 geslaagd; Codex-review zonder bevindingen. Inhoud op Workers en hoofddomein bevestigd. Live CTA bewaart bestaande beheersessie; anonieme tab lokaal getest zonder aanvragen/mails. Details: `docs/studentenkorting-landingspagina.md`; screenshot buiten Git: `../design-preview/student-landing/live-page.png`.

## Zelfstandige VÅRLAKS-landingspagina

- Lokale campagnevervolgronde gepubliceerd via PR #103 als `0f353ad`: Leiden sinds 1938 nadrukkelijk in intro en verhaal, drie Leidse locaties met centrale openingstijden/routeknoppen en Voorschoten apart op de pagina. NL/EN/DE, mobiel 390px zonder overflow en knoppen vanaf 52px gecontroleerd; Next/Vite-builds, gerichte checks en Build261 geslaagd; Codex-review zonder bevindingen. Cloudflare `0a32e34d` 100% Ready, nieuwe inhoud op Workers-URL én .nl live bevestigd. Onderzoek, claimbeperking en toekomstige advertentie-/meetkeuzes: `docs/varlaks-lokale-advertenties.md`. Screenshot buiten Git: `../design-preview/varlaks/live-local-locations.png`.
- PR #102 gepubliceerd als `a5a1b43`; Build259 groen, Codex-review zonder bevindingen. Cloudflare site `396d1958` Ready/100%. Live `/nl/varlaks` met nieuw hoofdmenu-item en vier geladen foto's bevestigd.
- VÅRLAKS-zalm rechtstreeks in desktop- en mobielmenu, eigen NL/EN/DE-landingspagina met herkomst, leveranciersfilm, recept, FAQ en grote bezoek-/adviesknoppen. Bestaande route behouden voor toekomstige advertenties en QR-codes; niets gelanceerd en website blijft besloten.
- Officiële bron noemt ASC, geen biologische certificering bevestigd: geen biologische verkoopclaim toegevoegd. Bestaande AI-beelden herkenbaar gelabeld. Details, controles en screenshotlocatie in `docs/varlaks-landingspagina.md`.

## Statistieken en rapportbronnen

- PR #101 gepubliceerd als `92f3b21`; Build257/Member157 groen, Codex-review zonder bevindingen. Cloudflare site `474ad18c` en leden `316dc564` beide 100% Ready.
- Eigen analytics nu aan in productie, uitsluitend na cookie-toestemming. Dashboard heeft 7/30/90 dagen, totalen, daggrafiek/tabel, top-pagina's en klikdoelen. WhatsApp/bellen/e-mail zonder inhoud/contactgegevens; private bestelroutes nu ook server-side uitgesloten. Aggregatie vóór ranglijstlimieten, geen afgekapt totaal boven 2.000 rijen. NL/EN/DE en privacytekst bijgewerkt.
- Live test: weigeren → nul tellers; accepteren → homepage + Feestdagen + interne klik zichtbaar; beheerverversing telt niet. Gehele site blijft besloten. Screenshot: `../design-preview/analytics/live-dashboard.png`. Lokale synthetische data zijn niet naar productie verstuurd.
- GSC en Cloudflare via correcte directe rapportlinks vanuit beheer. Dit is geen automatische externe API-import: daarvoor is aparte beperkte API-autorisatie nodig. Bestaande GSC-rapporten werken; nog geen ingediende sitemap (pas bij publieke lancering). Cloudflare Web Analytics sluit EU-bezoekers uit; ongewijzigd, geen extra tracker toegevoegd. De eigen D1-meting werkt wel na toestemming. Details en bronmomentopname: `docs/statistieken-2026-11-04.md`.

## Beheernavigatie, sessiegegevens en catalogusbediening

- Gepubliceerd via PR #100 als `3b83ab0`. GitHub Build255 en Member155 geslaagd; Codex-review zonder bevindingen. Cloudflare site `dbf93012` en leden `5ac07517` beide Ready, 100% verkeer. Live Chrome bevestigt navigatie Studentenaanvragen → Pasbeveiliging → Statistieken, correcte actieve pagina, uitleg bij de drie historische sessies zonder apparaat en cadeau-ideeën via de nieuwe Visschalen-knop. Geen consolefouten op de gecontroleerde catalogus. Bewijs buiten Git: `../design-preview/admin-navigation/live-admin.png` en `live-gifts.png`. Analytics stond bij PR #100 nog uit; de opvolgende PR #101 activeert uitsluitend de bestaande toestemmingsmeting.

- Gedeeld NL/EN/DE-beheermenu toegevoegd aan alle beheerpagina’s, met actieve pagina, statistieken, aanvragen, pasbeveiliging, e-mailaanbiedingen, klantaccounts en terug naar de website. Dubbele losse navigatieregels verwijderd.
- Desktopgroepen zijn over hun volledige label klikbaar en toetsenbordbedienbaar. Recepten staat zelfstandig; Visschalen bevat Feestdagen en Relatiegeschenken; Assortiment bevat barbecue/gourmet en herkomst. Mobiel gebruikt dezelfde indeling. Visschalen heeft grote sectieknoppen en bestaande cadeau-ideeën; product-/mandknoppen en hoeveelheidsbediening vergroot. Geen prijzen, foto's, routes of toegangsregels gewijzigd.
- Bestaande apparaatregistratie gekoppeld aan de zichtbare sessiekaarten: apparaattype, browser, besturingssysteem, beschikbare modelhint, context en tijdstippen. Oude sessies zonder opgeslagen apparaat worden eerlijk toegelicht. UA-herkenning verfijnd voor Edge op iOS/Android, Samsung Internet, Opera en ChromeOS; geen ruwe UA of hardwarefingerprint opgeslagen. Geen migratie nodig.
- Lokale controles: ledenintegratietests inclusief 8 browserfixtures en databasekoppeling bij login, SMTP-test zonder echte mail, inhoudscontrole, catalogus/selectiebehoud, QR, build-target, gerichte ESLint, Next- en Cloudflare-build. Chrome: hele desktopknop opent submenu; mobiele menu-indeling en 54px catalogusknoppen; alle vijf beheerbestemmingen en EN/DE gecontroleerd. Lokale beheer-API is niet gekoppeld aan productie; geen aanvragen, e-mails of beheeracties uitgevoerd. Publicatiebewijs volgt na uitrol.

## Nieuwe mailboxen gecontroleerd

- Vervolg op expliciet verzoek van de eigenaar: op 3 november 22:31 UTC exact één testmail per nieuwe mailbox naar het bekende Gmail-testadres gestuurd. Beide SMTP-geaccepteerd en in Gmail als **Spam** waargenomen. De nieuwe mailboxnaam alleen loste het dus in deze test niet op. Beide gebruikten dezelfde actuele transactionele projecttemplate, zonder account, campagne of inschrijving aan te maken. Dit is geen volledige Worker-registratie- of marketingcampagnetest. Bewijs: ../design-preview/student-admin/new-mailbox-delivery/ (twee EML's, sendguards, IDs en gmail-results.png). Geen labels/filters gewijzigd; deze twee verzendingen zijn uitgevoerd, niet automatisch herhalen.

- Eigenaar heeft account@schaapsvishandel.nl en aanbiedingen@schaapsvishandel.nl aangemaakt. Op 3 november 22:29 UTC beide via khsm1.khsmserver1.nl:587 getest met certificaatvalidatie, TLS1.3 en AUTH PLAIN: SMTP235 voor aanmelding en SMTP250 voor eigen MAIL FROM. Daarna RSET/QUIT; geen RCPT of DATA, nul berichten verzonden.
- Technisch bruikbaar als afzonderlijke SMTP-afzenders. Website is hiermee nog niet omgeschakeld: huidige sendMail gebruikt één SMTP-configuratie. Koppeling vereist aparte campagnecredentials/selectie en versleutelde Worker-secrets; bestaande beheeridentiteit moet gelijk blijven. Inboxplaatsing is met deze no-send test niet bewezen. Geen nieuwe abonnementen, DNS-wijzigingen of wachtwoorden in Git. Geschoond bewijs buiten Git: ../design-preview/student-admin/check-new-mailboxes.json.

## Search Console-toegang hersteld

- Na bericht van de eigenaar de bestaande Chrome-aanmelding read-only gecontroleerd: domeinproperty schaapsvishandel.nl is nu toegankelijk. De eerdere GSC-toegangsblokkade is vervallen; zie docs/seo/monitoring-90-dagen.md voor URL en eerste overzicht. Geen instellingen of publieke toegang veranderd.
- Mail blijft een afzonderlijk open punt: laatste echte test Spam ondanks SPF/DKIM/DMARC PASS en correct gedecodeerde headers. Exacte classificatieoorzaak niet bekend; Search Console lost e-mailreputatie niet op. Geen nieuwe testmail of bericht aan Knoth verstuurd.

## Herkenbare inhoud van aanbiedingen

- Vervolgcontrole van het studentenuitvoerplan vond dat campagnes in de HTML nog het label ACCOUNT kregen. De gedeelde template onderscheidt nu accountberichten en aanbiedingen; de bestaande Nederlandstalige campagnes tonen AANBIEDINGEN. EN/DE-labels zijn opgenomen voor gelokaliseerd templategebruik.
- Volledige leden- en SMTP-tests slagen: verificatie houdt ACCOUNT, campagnes tonen AANBIEDINGEN en de bestaande afmeldroutes blijven werken. PR98 gepubliceerd als `6917034`, Build253/run41727118189 en Member153/run41727118305 groen, Codex-review zonder bevindingen. Cloudflare leden `9e29d388` en site `fc0d5396` Ready/100%; health HTTP200/status ok.
- Nieuwe expliciete toestemming voor één testmail verbruikt op 3 november 22:11:06 UTC: SMTP geaccepteerd, Gmail om22:11:07 in **Spam**. Gewijzigde afzendernaam en Unicode-onderwerp correct zichtbaar, SPF/DKIM/DMARC alle PASS. Onafhankelijke Python MIME-parser rapporteert geen defects en exacte terugdecodering. Geen Gmail-labels veranderd. Test lokaal via Knoth met actuele bron-MIME/template, geen volledige Worker-registratie. Bewijs buiten Git: `../design-preview/student-admin/mail-after-header-fix/` (EML, guard/report, Gmail-screenshots). Geen verdere verzending zonder nieuw akkoord; geen bericht aan Knoth.
- Volgende acceptatie vereist externe input: fysieke iOS/beginscherm- en kassascancontrole, een opnieuw toegestane echte mailcontrole, actuele eigenaarfoto's/etiketten en GSC/GBP-toegang. Knoth uitsluitend als lokaal concept; Wallet blijft uitgesteld en de publieke sitepoort blijft gesloten.

## Herkenbare mailafzender

- PR95 gepubliceerd als a9f0143: vaste SMTP-afzendernamen `Schaap’s Vishandel – Accounts` en `Schaap’s Vishandel – Aanbiedingen`, met dezelfde geauthenticeerde mailbox. Build249/Member149 groen en Codex-review zonder bevindingen. Cloudflare leden8f697caa en sitea720cb6d beide Ready/100%. Geen nieuwe echte mail verstuurd; inboxacceptatie blijft open.

## Eigen mailformaat verder onderzocht

- Eigenaar wil geen contact met Knoth; supportconcept uitsluitend bewaard. Geen supportmail of nieuwe testmail verstuurd.
- Reproductie vond een eigen RFC2047-fout: het Nederlandse verificatieonderwerp bevatte één encoded-word van92 tekens (maximaal75); de headerregel101 (maximaal76 bij encoded-words). De nieuwe From-regel uit PR95 was93 tekens en moet eveneens gevouwen worden. Dit verklaart niet zelfstandig de Spam-uitkomst van de eerdere ASCII-testmail.
- Headerencoder splitst nu op Unicode-codepuntgrenzen in 39 UTF-8-bytes en vouwt met CRLF+spatie; het ongewijzigde mailboxadres staat op een continuation line. Tests dekken NL/EN/DE, lange aanbiedingen, emoji/CJK, exacte terugdecodering en headerinjectie. SMTP- en volledige ledenintegratietests slagen.
- PR96 gepubliceerd als `2dd048b`: Build251/run41725790173 en Member151/run41725790169 groen, Codex-review zonder bevindingen. Cloudflare leden `a8a2b2e9` Ready41s/100%, site `3b8085d3` Ready1m1s/100%; leden-health HTTP200/status ok. Geen echte verzending na deze correctie; betrouwbare inboxplaatsing blijft open. Het Knoth-concept staat uitsluitend lokaal buiten Git in `../design-preview/student-admin/knoth-mailonderzoek-concept.md`.

## Echte beheeractie en eenmalige mailcontrole — 22:40 CET

- De eerdere Chrome-dialoogblokkade is opgelost met de toegestane geïsoleerde browsertest. Alleen de bestaande eigenaarstestpas tijdelijk geblokkeerd en hersteld. Blokkade bleef na herladen bestaan en het blokkadefilter toonde de pas. Nieuwe aanmelding bevestigde daarna actief en afwezig uit het blokkadefilter. Beheersessies uitgelogd; geen andere studenten gewijzigd of verificatiemails via beheer verstuurd.
- De testharness verwachtte na herstel ten onrechte een actieve pas in het nog geselecteerde blokkadefilter. Herstel is daarna afzonderlijk read-only gecontroleerd. Bewijs buiten Git: `../design-preview/student-admin/admin-acceptance.json`, `admin-restored-check.json`, `restored-pass.png`.
- Eén nieuw expliciet goedgekeurd testbericht via bestaande Knoth STARTTLS met de actuele project-MIME en HTML-template: SMTP accepteerde het om 21:38:42 UTC. Gmail ontving het in **Spam**, ondanks SPF/DKIM/DMARC PASS. Geen DNS, secrets, abonnementen of appcode veranderd. De toestemming voor deze ene mail is verbruikt; niet automatisch opnieuw sturen.
- Dit bewijst Knoth-bezorging met de actuele opmaak, niet de volledige Worker-registratiestroom of betrouwbare inboxplaatsing. Gmail noemt overeenkomst met eerder als spam herkende berichten; de precieze oorzaak is onbekend. Mailacceptatie blijft open; zie `docs/email-bezorging-audit.md`.
- Resterend: fysieke iOS/beginschermcontrole, fysieke kassascan, mailacceptatie en de eerder vastgelegde eigenaarinput/lanceringsbeslissing. Herhaal voltooide beheer- of bouwtests niet zonder nieuwe aanleiding.

## Geblokkeerde en verlopen studentenpas onderscheiden

- Echte eigenaarstoegang tot studentenbeheer bevestigd. Native bevestigingsdialoog blokkeert de Chrome-extensie; intrekken/herstellen daarom nog niet afgetekend. Verse tab bevestigt dat de bekende testpas actief is gebleven. Geen mails of aanvragen verstuurd.
- UI-fout opgelost: geschorste pas toonde verlopen-tekst en een door de server geweigerde heraanvraag. NL/EN/DE met mobiele kaartkop; zes lokale en zes live-assetbrowserflows slagen, inclusief geschorst/verlopen. TypeScript en gerichte ESLint groen. PR92 samengevoegd als3a1ba27; Build247/run41720766667 groen, Codex-review zonder bevindingen. Cloudflare cf5fec4d Ready59s/actieve versie, build93fd4368-4537-4e3b-9726-6aa47c20e188. Geen API-, database- of toegangsbeleidswijziging. Bewijs: ../design-preview/student-inactive, waaronder live-assets/student-portal-acceptance.json en screenshots. Echte telefooncontrole aan eigenaar gevraagd; niet vervangen door emulatie.

## Studenten-eindcontrole en QR-renderfout

- PR90 live: main8407edc, Cloudflare df337971 Ready/100%, build9575e9c6-52e2-444b-b04e-f14510ec31a0. Build245/Member147 groen. Zes extra controles met de werkelijke live sitebestanden en volledig onderschepte API slagen; leden-health200/ok. Zie docs/studenten-eindcontrole-2026-11-03.md voor bewijs per eis en resterende echte apparaat/account/mailacceptatie. Geen echte mails of aanvragen verstuurd.

- De uitgestelde eindcontrole vond een echte UI-regressie: de handgeschreven versie1-L-encoder accepteerde17 bytes, terwijl de leden-Worker lange ondertekende SVQ1-tokens uitgeeft. De pas crashte zodra de QR-respons arriveerde. Vervangen door lokale qrcode1.5.4 met automatische capaciteit, foutcorrectie M en een grotere QR. Serverondertekening, vervaltijd, database en authenticatie blijven gelijk. Het oorspronkelijke logo vervangt de letters SV op de pas.
- Onafhankelijke jsQR-decoder leest korte code, productiegetrouw SVQ1-token en500-byte-payload exact terug. Zes Chromegevallen NL/EN/DE op390/1440px controleren registratie, twee codes, directe login, Utrecht/MBO-aanvraag zonder upload, pas/naam/logo/korte code, daadwerkelijke SVG-decodering, verborgen Wallet en uitloggen. Alle API-verzoeken onderschept; nul echte verzendingen. Backend- en SMTP-integratietests, TypeScript en gerichte ESLint slagen. Bewijs naast de repo: design-preview/student-final. Publicatiecontrole volgt.
- Wallet-activering is door de eigenaar uitgesteld en is geen huidig uitvoeringswerk. Fysieke iOS-installatie, echte nieuwe mailontvangst na de laatste mailwijziging en beheerintrek/herstel met het echte account blijven afzonderlijke acceptatiepunten; lokale tests bewijzen die niet.

## Eigen logo als favicon en footerbadge

- Nieuwe eigenaarupload ongewijzigd bewaard als public/images/brand/schaapsvis-logo-original.png. Afgeleide browsericonen32/192px, Apple180px en ICO; oude favicon.svg blijft hetzelfde logo tonen. Footerbadge88px met vaste afmetingen en lazy loading, bestaande tekstheader behouden.
- Alleen de exacte icoonpaden zijn bereikbaar buiten het sitewachtwoord; geen bredere asset- of authenticatie-uitzondering. Gerichte ESLint, typegen/TypeScript en inhoudscontrole slagen. GitHub Build242/run41714649863: Next/Cloudflare-build en externe slotcontrole geslaagd.
- PR88 samengevoegd als 5b8d781; Cloudflare a45bb9ca Ready/100%, build876703bb-0024-4bbb-a54e-5d85646e1efd. Vijf live icoonbestanden komen overeen met de bron (SVG alleen LF/CRLF genormaliseerd). Geisoleerde Chromecontrole lokaal en live op390/1440px: icoonmetadata correct, footerlogo88x88 geladen, geen overflow of pageerrors. Lokaal gesloten profiel houdt pagina en oorspronkelijke bronfoto afgeschermd. Geen berichten/formulieren verstuurd. Bewijs: ../design-preview/master-audit/brand-icons-live.json en logo-live-390.png/logo-live-1440.png. Werkelijk toevoegen op een fysieke telefoon is niet getest.

## Masteraudit SEO en afwerking — vervolgcontrole en PR #81

- Eigenaar bevestigt 3 november: WhatsApp 06 2481 1678, belnummer van Google Maps, dinsdag 09:00. Maps rechtstreeks geopend: 071 512 4810 bij Herenstraat 48. PR86 samengevoegd als 70bc65e; siteversie 7b95e527 Ready/100%, Cloudflare-build267042a9-8988-4e2d-b574-6c80c6411752. Build240/Content70, inhoud/winkel en9 geïsoleerde contactcases groen. Tien live route/breedtecombinaties: alle tel-links naar +31715124810, alle WhatsApp-links naar31624811678, schema/contactmetadata NL/EN/DE correct, geen overflow/pageerrors/verzendingen. Dinsdag09:00 stond al correct. Screenshots en live-contact-confirmed.json naast de repo. NAP-keuze is afgerond; externe gidsen, overige GBP-velden, etiketten, gerechtfoto's en GSC-toegang blijven eigenaarafhankelijk.

- Aanvullende externe previewcontrole PR85: GitHub-run41695047443/job126123239847 op c852159 slaagt (3 november18:34UTC). Hoofddomein, workers.dev en beide Vercel-hosts: twintig routes tonen slot/noindex/no-store zonder cookies. Actuele hosts robots Disallow/lege XML-sitemap; het oude 9sai-project schermt ook die twee routes af met het noindex-wachtwoordscherm. Geen openbare productinhoud aangetroffen; geen runtime/secrets gewijzigd. Nieuwe smalle CI-workflow voorkomt een volledige appbuild bij alleen een controlemutatie. Primaire telefoon en dinsdagtijd expliciet aan eigenaar gevraagd; overige eigenaar-/GSC-/beeldinput blijft open.

- PR83 live afgerond: 91 bronnen/364 varianten; originele fotovergroting behouden. Main d10e4f9, Cloudflare 18603304 Ready/100%. Build239 groen, twaalf lokale beeldcombinaties en twintig live checks geslaagd. Mobiele assortimentresources 4.939.382 → 1.059.949 B (78,5% minder in dezelfde test). Externe GitHub-run zonder cookies bevestigt slot/noindex/no-store/robots/lege sitemap op vijf routes. Zie docs/seo/catalogus-beeldoptimalisatie.md. Geen geld of echte aanvragen; tijdelijke lokale publieke binding verwijderd.

- Basis main `b60f56e` na #79/#80; eigen branch `codex/master-seo-design-audit`, geen oude auditbranch overgenomen.
- Contactantwoordkanaal client/server, echte recept/blog404, onbewezen voorraad/bezorgschema verwijderd, preview-noindex, contrast/leesbaarheid/footerreflow en vijf feestdagenankers. Homepagefavorieten via responsive Image; foto's/prijzen/porties/auth behouden.
- Next- en Cloudflare-build, TypeScript, ESLint, content/shopchecks, negen geïsoleerde contactcases en mandacceptatie A–J slagen. Next én lokale Cloudflare:507 pagina's/519 linkdoelen/153 beelden, geen fouten; negen waarschuwingen voor drie ontbrekende gerechtfoto's. Beide runtimes ook met slotprofiel getest.
- Browser:72 pagina/schermcombinaties + tekstvergroting, NL/EN/DE contact, vijf ankers; geen pageerrors/overflow/berichten. Externe Schema.org-codevalidatie 0 fouten/waarschuwingen; Google9 geldige onderdelen met niet-kritieke meldingen.
- Bewijs en scope: `docs/seo/technische-audit.md`, `docs/design/visuele-eindcontrole.md`, acht auditdocumenten plus inventaris/resultaten; screenshots/voor-na `../design-preview/master-audit/overzicht.html`. SEO-skill bijgewerkt.
- PR #81: https://github.com/Voidd2/schaapsvis/pull/81. Eerste codecommit `efc662d` had groene CI en Codex-review zonder bevindingen; nieuwe vervolgwijzigingen moeten opnieuw door CI/review.
- Gratis build-time beeldvarianten uitgevoerd: 28 WebP’s van zeven ongewijzigde homepagefoto’s. Next én Cloudflare-browser laden101.092 bytes mobiel/251.948 desktop i.p.v.6.965.315 bytes originelen (98,5%/96,4% minder beeldbytes). Manifest/SHA/dimensies gecontroleerd, CI-check toegevoegd. Geen nieuwe dienst of dependency nodig in het project.
- Echte Chromezoom200% op acht templates geslaagd. Nieuwe Cloudflare-matrix73 controles, drie talen contact, vijf ankers zonder fouten of verzendingen. Lighthouse13.6.0 vier templates × mobiel/desktop: accessibility100, best-practices100; performance72–76 mobiel/92–94 desktop. Mobiele veld-LCP is niet bewezen. Kruimelcontrast, fotolabelnamen, Bellen-label en menu-raakvlak gecorrigeerd; hero eager/high-priority.
- Metadata staat met `htmlLimitedBots` nu in initiële HEAD op beide runtimes. Crawl test dit. Alle507 headingoutlines gecontroleerd zonder niveausprongen; description-overlap beoordeeld. Receptmetadata noemt de gelokaliseerde gerechtnaam, echte productvarianten blijven apart.
- Nieuwe Next/Cloudflare-builds, TypeScript, ESLint, inhoud/shopchecks en mandacceptatie A–J slagen. Beschadigd lokaal gegenereerd `.next/dev/types`-bestand apart gezet en opnieuw gegenereerd; geen sourcefout. Definitieve crawls/slotresultaten in audit-results.json; ruwe logs/screenshots/Lighthouse buiten repo in master-audit.
- Redactionele ronde afgerond: 67 productbeschrijvingen geïnventariseerd, 23 vaste producten/40 recepten/19 blogs gekoppeld; NL/EN/DE-localizers en aantallen getest. Oude EN/DE-schaalblog en richtbedragen gecorrigeerd. Drie onbewezen ASC-badges wachten op actueel etiket; ingrediënten/voedingswaarden/prijzen/foto’s ongewijzigd vergeleken met basis. Requirementmatrix A–L toegevoegd. Next/Cloudflare-builds en volledige Cloudflare-crawl opnieuw geslaagd.
- Live HTTP-www gaf 522. De bestaande Cloudflare-www-regel matcht nu beide protocollen; 301 naar HTTPS-hoofddomein behoudt pad en query, live getest. Geen DNS/secrets/leden-Worker gewijzigd. Tijdelijke lokale SITE_PUBLIC-binding opgeruimd.
- PR81 afgerond en live: CI Build236/Content69 groen op d4b3f46; merge b13dfee. Cloudflare sloeg de squashboodschap met oudere [skip ci] over; dezelfde commit via Retry build uitgevoerd. Siteversie b3f74852-fc47-402c-8888-cfd7c5824fdc staat Ready/100%. Twintig live checks geslaagd, noindex/canonical/HEAD/404/nieuwe copy/beelden bevestigd, leden-health ok. Geen aanvragen verzonden.
- Live Lighthouse mobiel: performance81, accessibility100, best-practices100, SEO69 door bewust indexeringsslot; LCP4,83s, CLS0, TBT3ms. Geen veld-CWV/INP-claim. Catalogusbeeldbytes en mobiele rendervertraging zijn toekomstige optimalisatieruimte.
- Masteraudit en uitvoerbare correcties opgeleverd. Eigenaarafhankelijk: primaire telefoon/dinsdagtijd/GBP, actuele keurmerketiketten, drie gerechtfoto’s en GSC-toegang. Externe slotcontrole buiten de IP-allowlist is inmiddels geslaagd via GitHub Build239; vóór een latere openbare lancering opnieuw volgens de checklist. De site is niet openbaar gemaakt. Alle bewijslinks en requirementmatrix staan in docs/seo/technische-audit.md en het voor/na-overzicht. Geen geld uitgegeven.

## Bestelproces vaste visschalen — live afgerond

- Branch `codex/catalog-cart-simplification`, basis `ac05aac`. Eén gedeelde toegankelijke mand-drawer; oude split verwijderd/migreert weg; vaste details zonder formaatdropdown; 23 routes/12 schalen/prijzen/foto’s behouden; trio klein/groot NL/EN/DE.
- Maatwerk met visvoorkeuren, presentatie, hoeveelheid/bakjes, apart allergieveld en Amsterdam-datumvalidatie. Vrije tekst alleen in geheugen; klikstatistieken zonder query/fragment.
- Playwright A–J geslaagd, 18 catalogus/detail-breedtecombinaties plus bestaande 96 regressiecombinaties en 16 EN/DE-routes. Geen berichten of echte aanvragen. Next 572 routes, Cloudflare-build, gerichte ESLint, shop- en inhoudscontrole geslaagd.
- Mapping vijf gewenste formaten en bewijs: `docs/bestelproces-vaste-visschalen.md`. Verse-visfunctie alleen roadmap. Eén illustratief klein-fotoconcept in `../design-preview/cart-79/`, nog niet live; eerst eigenaarbeoordeling.
- PR #79 na expliciet publicatieakkoord samengevoegd als `be86bed`. GitHub-build groen, Codex-review op de hoofdwijziging zonder bevindingen. Cloudflare siteversie `0342b64f` staat 100% Ready (1m 6s). Live €147 voor twee middelgrote, gedeeld mandje op Feestdagen, kleine detail zonder dropdown en €59,50 bevestigd; testselectie weer leeg. Leden-health ok, robots Disallow en lege sitemap behouden. Geen berichten verzonden.
- Visueel opleveroverzicht inclusief voor/na, WhatsApp-demonstraties en oude/nieuwe conceptfoto: `../design-preview/cart-79/overzicht.html`. Vijf nieuwe personenformaten blijven te bevestigen; de conceptfoto wacht op eigenaarbeoordeling.

## Kwaliteitsronde na PR #76 — live afgerond

- Eigen branch `codex/quality-after-76`, basis `2d671a1`. Mandje hersteld met inleesbarrière, validatie en eenmalige migratie naar tabbladsessie; dropdowns sluiten bij buitenklik/Escape/navigatie/resize en zijn wederzijds uitsluitend.
- Gedeeld 1536px-canvas, laptopnavigatie op twee rijen, drie geschenken na hoofdschalen, rustiger account, Amsterdam-datumcontrole. Bestaande prijs/foto/auth/backend behouden.
- Beeldplan alleen server-gevalideerde besloten preview; historie2018, historieblog zonder misleidend productbeeld. SEO-skill, matrix, 3 recepten en 1 blog in NL/EN/DE; sitemapdatums gecorrigeerd.
- Definitief lokaal: 96 pagina/breedte-combinaties + 16 EN/DE-routes; accountmenu/focus, opslag/herladen/verwijderen, catalogus/detail/terug, modaal, datum en touch geslaagd. Besloten media/slot/noindex getest. TypeScript, gerichte ESLint, content/shopchecks, Next-build (572 routes) en Cloudflare-build geslaagd. Screenshots opgeslagen. PR #77 samengevoegd als `67875df`; GitHub groen en Codex zonder bevindingen. Cloudflare site `7ccc829e` en leden `af50a880` beide 100% Ready. Live canvas/dropdown/account/geschenken/herladen/datum gecontroleerd; testlijst weer leeg. API-health ok; anoniem slot/robots/lege sitemap behouden.
- Zie `docs/kwaliteit-na-76.md`, `docs/beeldplan.md` en `../design-preview/quality-76/`. Geen berichten of registraties verzonden; geen geld uitgegeven.

## Visschalen & delicatessen — herbouw live afgerond

- Branch `codex/platters-delicatessen-catalog`: zes hoofdschalen, favoriet, gourmet, delicatessen, vier ongeprijsde saladewensen en één gedeelde aanvraaglijst op beide overzichten en details. Bestaande 23 routes, twaalf schalen en canonieke prijzen behouden; luxe blijft 10–14 / €160.
- NL/EN/DE, desktop/mobiel, hoeveelheden/bedragen, detail/terug/herladen, datum, verdeelwens en maatwerkconcept gecontroleerd zonder verzending. Fotovergroting/Escape/focus en geen overflow bevestigd.
- Next-build (560 routes), Cloudflare-build, TypeScript, gerichte ESLint, content- en shopchecks geslaagd. PR #75 samengevoegd als `f2b11f0`; GitHub-build groen en Codex-review zonder bevindingen. Site-Worker `610dd007` en leden-Worker `a0d3fa61` beide 100% Ready.
- Live op schaapsvishandel.nl: zes kaarten, €134,99 bekend subtotaal voor twee kleine schalen + trio, ongeprijsde krab-mangowens, detail/terug/Feestdagen behouden selectie; alle vier saladebeelden laden. Leden-healthcheck `{"status":"ok"}`. Testselectie daarna via de bediening leeggemaakt, niets verzonden.
- Bewijs, ontbrekende eigenaargegevens en beeldprompt: `docs/visschalen-delicatessen-herbouw.md`. Screenshots: `../design-preview/catalog-rebuild/`.

## Visschalen: uitleg en maatwerkaanvraag — live afgerond

- Gedeelde fotovermelding en familie-altteksten, vaste totaalprijs per schaal met personenbereik, aparte compacte WhatsApp-aanvraag en drie stappen in NL/EN/DE.
- Alle twaalf variantkeuzes en 36 gerenderde details tegen de productbron gecontroleerd; terug/herladen behoudt de drie keuzes. Formulier mobiel/desktop, datum, optionele velden en concept gecontroleerd zonder iets te verzenden.
- Next- en Cloudflare-build, TypeScript, ESLint, inhouds- en shopchecks geslaagd. PR #73 samengevoegd als `345e6a0`; Codex-review zonder bevindingen. Site-Worker `fd4d198c` en leden-Worker `9bb08db0` beide 100% Ready. Live formulier/concept, €73,50 voor 3–5, maatwerkterugroute, mobiele fotovergroting en leden-healthcheck gecontroleerd. Alle vijf eisen afgerond. Bewijs per eis: `docs/visschalen-uitleg-en-maatwerk.md`.

## Afronding schaalselectie en vertalingen — live afgerond

- Gerelateerde schaalroutes behouden nu alle geselecteerde families via de bestaande URL-helper. Alle twaalf productdetails hebben een gedeelde EN/DE tekstlaag; bedragen, inhoud en allergenen behouden. Gevelteksten voorbereid in drie talen.
- Volledige gerelateerde-route gereproduceerd en hersteld; 36 gerenderde pagina’s en 9 mobiele taal/familiecombinaties gecontroleerd. Gerichte tests en beide builds geslaagd.
- PR #72 samengevoegd als `79673b0`; site-Worker `d4ddeb66` en leden-Worker `39f835f7` beide 100% Ready. Live gerelateerde-route plus herladen bevestigt klassiek 3–5, luxe 10–14 en hapjes 6–10. EN/DE drie families op 390/1440 zonder overflow of Nederlandse productteksten. Beide FAQ-prijsantwoorden behouden.
- Alle drie onderdelen afgerond; details en bewijs: `docs/afronding-schaalselectie-vertalingen.md`.

## Derde verbeteringsronde — live afgerond

- Compacte visschalenpagina met foto vóór formaatkeuze en URL-behoud per familie; detailteruglink en formaten delen één mapping van twaalf bestaande producten.
- Homepage wit/lichtblauw, vaste prijzen versus maatwerk in NL/EN/DE, prijsfallback/bijschriften, eigen gevel-fallback en Europe/Amsterdam-status uitgevoerd.
- 12 varianten + 65 tijdzonecases slagen; Chrome terug/herladen/formaatwissel, kabeljauwzoekterugroute en vier breedtes gecontroleerd. Eerste schaalfoto lokaal y560 tegenover live vóór y929.
- PR #71 samengevoegd als `c4573f8`; Cloudflare site-Worker `2eb3e9ab` staat op 100% Ready. Alle CI-controles slagen. Live 390×844 inclusief previewbalk begint eerste foto op y607 (voorheen y929). Vier pagina’s × vier breedtes zonder overflow; formaatkeuzes, detailterugroute, herladen en kabeljauwzoekterugroute live bevestigd.
- Alle acht eisen afgerond. Voor-/na-overzicht: `../design-preview/round-three/overzicht.html`; bewijs per eis: `docs/derde-verbeteringsronde.md`. Eigen foto’s blijven een externe aanlevering. Geen backend-/accountwijzigingen of transacties.

## Tweede verbeteringsronde — live afgerond

- Branch `codex/shop-round-two`: URL-gebaseerde assortimentfilters met browser-terugherstel, compacte productintro met directe contactactie, header zonder tweede rij, homepage met drie productkolommen en geïntegreerd familieverhaal, drie visschaalfamilies met twaalf gekoppelde formaatkeuzes, bezoekgerichte locatiepagina.
- Lucas bevestigde maandag gesloten; winkeluren zijn gekoppeld aan de centrale bron voor status, metadata, schema, footer en locatieoverzicht.
- Functionele browsercontrole en vergelijking van alle twaalf formaten met de productbron geslaagd. Geen echte aanvragen verstuurd. Details en ontbrekende echte foto's: `docs/tweede-verbeteringsronde.md`.
- PR #69 (`488b0f6`) en de gerichte laadinvoercorrectie #70 (`f549649`) zijn samengevoegd. Cloudflare site-Worker versie `68822bfc` staat op **100% Ready**. Zoekopdracht → product → terug en categorie/sortering/Toon meer → product → terug zijn op de echte site gecontroleerd; 25 verse-visresultaten blijven behouden. Geen consolefouten in de gecontroleerde live routes.
- Voor-/na-overzicht: `../design-preview/round-two/overzicht.html`. TypeScript, ESLint, inhoudscontrole, productiebuild en Cloudflare/Vinext-build slagen. Echte winkel-, team-, kraam- en historische beelden blijven een externe aanlevering; deze ronde is daarop niet blijven wachten.

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
- PR #61 is samengevoegd naar `main`. De studentenpasbeveiliging staat live met herroepbare langlopende sessies, privacyvriendelijke apparaatherkenning, uitlegbare risicosignalen, gegroepeerde meldingen, beheeracties met auditlog, extra e-mail- en schoolmailverificatie, eenmalige inloglinks en dynamische twee-minuten-QR-codes. Fotoverificatie is bewust niet gebouwd zonder afzonderlijke juridische en privacybeoordeling.
- Preview-D1 is gecontroleerd en aangevuld met migraties 0013 t/m 0017; productie-D1 bevat aantoonbaar `0017_student_pass_security.sql`. De leden-Worker bouwde commit `2b10e70` als versie `4b09794c`, de site-Worker als versie `fdbe4698`; beide stonden na de uitrol op Ready. De live healthcheck geeft `{"status":"ok"}`.
- De live accountpagina toont wachtwoordlogin, eenmalige inloglink en wachtwoordherstel. De live beheerroute `/nl/beheer/beveiliging` is bereikbaar, maar weigert zonder zowel toegestaan beheerdersaccount als vertrouwd netwerk terecht met `forbidden`. GitHub Member worker tests en Build site zijn groen; de volledige productiebuild bevat 491 pagina's.
- PR #63 is samengevoegd naar `main`. De Feestdagenpagina bevat nu 23 door de eigenaar geselecteerde producten met de op 1 november gecontroleerde namen, volledige prijzen en originele, lokaal gecomprimeerde productbeelden. Ieder product heeft een eigen detailroute met samenstelling, allergenenwaarschuwing, besteltermijn/formaat waar van toepassing en drie gerelateerde producten. Visschalen toont de twaalf bijbehorende schalen met volledige prijs en een link naar de detailpagina. De sitemap, Product-schema en beeldverantwoording zijn bijgewerkt; de verklaarde toestemming van Dirks en bronmomentopname staan in `docs/feestdagen-productcatalogus-2026-11-01.md`.
- De productiebuild bevat 560 pagina's en slaagt samen met TypeScript, ESLint en de inhoudscontrole. Cloudflare heeft main als versie `8737ce49` op 100% Ready uitgerold. De live Feestdagenpagina, productdetail voor `visschotel-luxe-8-10-pers`, allergenenblok, gerelateerde producten en de twaalf Visschalen-links zijn in Chrome gecontroleerd; er zijn geen consolefouten gevonden.
- Homepage-visuele ronde gestart op `codex/homepage-visual-polish`: de hero heeft nu een duidelijkere entree, feitenbalk en beeldlabel; daaronder staat een compacte, responsive keuzerij voor verse vis, visschalen, barbecue/gourmet en feestdagen. TypeScript, ESLint, inhoudscontrole en de productiebuild (560 pagina's) slagen; lokaal geeft `/nl` HTTP 200.
- E-mailbezorging verder aangescherpt op de leden-Worker: transactionele berichten dragen nu expliciete `Auto-Submitted`/`X-Auto-Response-Suppress`-headers, de platte verificatietekst bevat herkenbare Schaap’s-context en de twee registratiecodes worden met 1,5 seconde tussenruimte verzonden in plaats van als SMTP-burst. `workers/members/test.mjs`, `smtp-test.mjs` en inhoudscontrole slagen. Dit verbetert classificatie en burstgedrag, maar vervangt geen mailboxreputatie of een echte inbox/spam-acceptatietest.

## Eerstvolgende werkpakketten

- 2 november: ontwerpronde via PR #68 samengevoegd als `2c5ffad`. Site-Worker `5cf0b65f` is 100% Ready; nieuwe homepage en navigatie op schaapsvishandel.nl bevestigd. Homepage, menu, assortiment, gegroepeerde visschalen, feestdagenvolgorde, locaties en studententypografie behouden het bestaande palet. Details, screenshots en controles: `docs/ontwerpafspraken.md`. Recente gebruikerskeuze: Wallet-activering uitstellen, volledige accountacceptatietest aan het einde.

1. Voer voor de studentenpas nog één acceptatietest uit op een echt iOS-toestel: normale Safari, PWA-installatie, uitloggen/intrekken en opnieuw aanmelden. De server-, database- en browsertests zijn afgerond; deze fysieke apparaattest kan alleen met een eigenaarstoestel worden afgetekend.
2. Echte intrek-/herstelactie op de eigenaarstestpas is op 3 november afgetekend; de fysieke kassascan blijft open. De onbevoegde route is al aantoonbaar fail-closed getest.
3. Google en Apple Wallet-activering zijn op verzoek van de eigenaar uitgesteld; geen accounts, certificaten of abonnementen aanmaken. De eerdere voorbereidingen blijven bewaard in `docs/wallet-integratieplan.md` en zijn geen huidig uitvoeringswerk.

## Model- en tokenkeuze

- Gebruik een sterk redeneermodel voor database, authenticatie, beveiliging, deployment en Wallet-ondertekening.
- Luna Medium is voldoende voor afgebakende copy-, CSS- en kleine componenttaken nadat de backend stabiel live staat.
- Combineer controles per werkpakket en gebruik dit bestand als hervatpunt om dubbel onderzoek te voorkomen.

## Bekende externe afhankelijkheden

- Apple Wallet: Apple Developer-account, Pass Type ID, certificaat en ondertekende `.pkpass`-uitgifte nodig.
- Google Wallet: issuer-account, goedgekeurde Generic Pass class en service-account nodig.
- Cloudflare MCP in deze chat is aan het andere Cloudflare-account gekoppeld; voor Schaapsvis is de ingelogde Chrome-tab gebruikt.
