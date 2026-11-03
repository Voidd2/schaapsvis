# Masteraudit — 3 november 2026

Deze ronde levert de aangetoonde P0-correcties en belangrijkste P1-verbeteringen. Dit is geen verklaring dat alle SEO, toegankelijkheid of live Core Web Vitals volledig afgerond zijn. Basis: `b60f56e` (main na PR #79/#80), eigen branch `codex/master-seo-design-audit`. Productgegevens en het besloten karakter blijven behouden.

## Live vervolg PR #83 — 3 november 2026

[PR83](https://github.com/Voidd2/schaapsvis/pull/83) is samengevoegd als `d10e4f9238c30d93ee45ce74b3b7967d9343893a`. Cloudflare-build `b9ea130a-fa31-4625-ba20-ba8ce77d791b` is Ready; siteversie `18603304` bedient 100% van het verkeer. Geen leden-Worker, database, secrets of toegang aangepast. De tijdelijke lokale publieke binding is verwijderd.

GitHub Build239 op main slaagt, inclusief Next/Cloudflare-build, content/shop- en beeldintegriteit. Twaalf lokale beeld-browsercombinaties en twintig live route/schermcombinaties slagen; geen pageerrors, overflow of verzonden aanvragen. Originele schaalfotovergroting blijft behouden. Livebewijs: `design-preview/master-audit/live-release-catalog.json`, baseline `live-release.json` en twintig screenshots naast de repo.

Dezelfde ongethrottelde Chrome-routecontrole vóór en na, met verse contexten op het vertrouwde netwerk, meet onderstaande geladen resources. Dit zijn bytes gedurende die test, geen snelheidspercentage, volledige download van elk verborgen product of veld-CWV.

| Pagina | Breedte | Vóór PR83 | Na PR83 | Minder resources |
|---|---:|---:|---:|---:|
| Homepage | 390 | 842.628 B | 689.752 B | 18,1% |
| Assortiment | 390 | 4.939.382 B | 1.059.949 B | 78,5% |
| Visschalen | 390 | 1.068.787 B | 586.395 B | 45,1% |
| Homepage | 1440 | 1.134.907 B | 1.016.317 B | 10,4% |
| Assortiment | 1440 | 5.652.724 B | 1.396.287 B | 75,3% |
| Visschalen | 1440 | 2.096.147 B | 991.862 B | 52,7% |

### Onafhankelijke controle van het sitewachtwoord

GitHub-hosted Ubuntu, zonder cookies/secrets: vijf routes (NL-home, EN-assortiment, DE-feestdagen, account, beheer) tonen het wachtwoordformulier en noindex/no-store; robots blokkeert en sitemap is leeg. [Build239](https://github.com/Voidd2/schaapsvis/actions/runs/41692559624), job126114601503, 18:19:06 UTC, geslaagd. Ook de PR-run slaagde. Deze run startte tijdens de uitrol; het bewijs betreft het live slot, niet een verklaring over de exacte runtimeversie op die seconde. Authenticatie wijzigde niet in PR83.

De nieuwe CI-job `locked-site` herhaalt dit met uitsluitend GET-verzoeken. Repositoryvariabele `SITE_PUBLIC=launch-approved` stopt alleen deze gesloten-siteverwachting bij een apart goedgekeurde openbare lancering en opent de site zelf niet. Actuele eigenaargegevens en veldmetingen blijven afzonderlijke open punten; de eerdere Lighthouse-cijfers zijn van PR81, niet opnieuw gemeten voor PR83.

## Scorecard

Actuele aanvulling PR86: de eigenaar heeft dinsdag09:00 en WhatsApp06 2481 1678 bevestigd en gekozen voor het Google Maps-belnummer. Rechtstreeks Maps-bewijs:071 512 4810. Deze scheiding staat live (main70bc65e, site7b95e527 Ready/100%); tien NL/EN/DE route/schermchecks slagen. NAP-keuze is daarmee afgerond. Externe gidsvermeldingen zijn niet gewijzigd; resterende eigenaargegevens en etiketten blijven apart vermeld. Zie [NAP-controle](nap-controle.md).

Aanvulling C2, PR85: [externe controle](https://github.com/Voidd2/schaapsvis/actions/runs/41695047443) van 3 november18:34UTC slaagt voor vijf routes op ieder van vier bekende hosts: hoofddomein, `schaapsvis.schaapsvis.workers.dev`, `schaapsvis.vercel.app` en `schaapsvis-9sai.vercel.app`. Zonder cookies: wachtwoordformulier, noindex/no-store en geen publiek JSON-LD. De eerste drie hosts geven robots Disallow en een lege XML-sitemap. Het verouderde 9sai-project herschrijft ook robots en sitemap naar het afgeschermde noindex-wachtwoordscherm. Dit is geen geldig robotsbestand, maar er lekt geen productinhoud of sitemap. Geen oude deployment omgezet of beveiliging gewijzigd om de test te laten slagen. Ruwe compacte resultaten: `design-preview/master-audit/preview-host-proof.json` naast de repo. Dit bewijs omvat deze vier bekende hostnamen, niet elk ooit gegenereerd deploymentadres.

| Onderdeel | Status | Bewijs / beperking |
|---|---|---|
| Crawlbaarheid | Gecontroleerd en goed | 507 sitemaproutes, 519 interne doelen en 153 lokale beeldbestanden op Next én lokale Cloudflare/Vinext-runtime. Geen kapotte doelen. |
| Indexeerbaarheid | Gecorrigeerd | Besloten profiel: slot, noindex, robots Disallow, lege sitemap. Extra noindex-header voor toegelaten previewbezoekers. Publieke simulatie uitsluitend lokaal. |
| Canonicals | Gecontroleerd en goed | Eén eigen productiecanonical per sitemaproute, queryparameters uitgesloten. Live HTTP/HTTPS-www naar HTTPS-hoofddomein gecontroleerd, met behoud van pad en query. |
| Hreflang | Gecontroleerd en goed | NL/EN/DE en x-default verwijzen wederkerig naar bestaande canonieke routes. HTML-taal klopt. |
| Sitemap | Gecontroleerd en goed | 507 publieke canonieke routes; account, beheer en bestellen uitgesloten. Datums niet op verzoekmoment gezet. |
| Metadata | Gecorrigeerd | Titels, descriptions, OG en Twitter aanwezig. Metadata staat nu ook in de initiële documentkop op Vinext. Receptdescription noemt het gerecht in NL/EN/DE. Overlapkandidaten beoordeeld; echte productvarianten blijven apart. |
| HTML / headings | Gecontroleerd en goed | 507 server-HTML-outlines: één H1, geen overgeslagen niveaus; inhoud/links/JSON-LD server-side aanwezig. Geen volledige handmatige redactionele keuring van 507 pagina’s geclaimd. |
| Structured data | Gecorrigeerd | Onbewezen voorraad en generiek bezorggebied verwijderd. FAQ-emissie verwijderd, zichtbare antwoorden behouden. Externe codevalidatie geldig; zie afzonderlijk rapport. |
| Interne links / redirects | Gecorrigeerd | Niet-bestaande recepten/blogs geven nu 404. Twaalf onbekende detailroutes, oude Duitse route en negen bezorgredirects gecontroleerd. Bestaande routes behouden. |
| Lokale SEO | Gecorrigeerd / deels eigenaar | Eigenaar bevestigt dinsdag09:00 en aparte WhatsApp; Maps-belnummer071 512 4810 rechtstreeks gecontroleerd en in PR86 verwerkt. Afwijkende externe gidsen en overige GBP-velden nog bijwerken. |
| Contentkwaliteit | Gecorrigeerd / wacht op eigenaar | Broninventaris van 67 producten, 23 vaste producten, 40 recepten en 19 blogs uitgebreid met inhoud, intentie, beeld, allergenen en links. Productcopy en oude EN/DE-schaalblog gecorrigeerd. Actuele leveranciersetiketten blijven nodig; geen culinair of certificeringsbewijs geclaimd. |
| Image SEO | Gecorrigeerd / wacht op eigenaar | 91 bestaande bronnen hebben364 responsive varianten; foto’s en originele vergroting behouden. Drie recepten missen een gerechtfoto, negen taalwaarschuwingen blijven terecht zichtbaar. |
| Performance | Gecorrigeerd / nog open | PR83: mobiele assortimentresources78,5% lager in dezelfde live test. Historische Lighthouse-metingen hieronder; veldmetingen pas na publieke lancering. Zie meetcondities hieronder. |
| Mobiel / tablet / desktop | Gecontroleerd en goed | Acht templates op negen gevraagde afmetingen; formulier, mandje, ankers en taalbediening getest. |
| Toegankelijkheid | Gecorrigeerd | Echte Chrome200%-zoom op acht templates. Vier templates × mobiel/desktop scoren100 in Lighthouse-accessibility na correcties aan contrast, menu-raakvlakken en toegankelijke namen. Geen WCAG-certificering. |

## Gevonden fouten en uitgevoerde correcties

| Ernst | Bevinding | Correctie |
|---|---|---|
| Hoog | Contactaanvraag kon zonder bruikbaar antwoordkanaal worden ingestuurd | Telefoonveld, e-mail OF telefoon verplicht; dezelfde validatie client/server. Negen handlergevallen met mocktransport en drie talen in browser getest. |
| Middel | Onbekende recept-/blogslug leidde naar index in plaats van echte 404 | `notFound()`; bestaande expliciete redirects behouden. |
| Middel | Alle vaste producten kregen onbewezen LimitedAvailability | Weggelaten; echte Offer-prijzen blijven staan en worden met de broninventaris vergeleken. |
| Middel | Schema suggereerde onbevestigde bezorggemeenten | Generieke areaServed verwijderd; winkeladres en tijden behouden. |
| Middel | Previewbezoekers met toegang hadden geen expliciete crawlerheader op alle normale responses | Noindex/nofollow toegevoegd aan de normale middleware-response zolang op slot. Geen authenticatiewijziging. |
| Middel | Witte normale knoptekst op helderblauw had circa 3,48:1 contrast | Bestaande donkerdere kleur: 5,14:1; hover 7,43:1. |
| Middel | Vergrote tekst liet footerlinks overlappen | Kolommen reageren op tekstruimte, links kunnen afbreken, informatiebalk kan omlopen. |
| Middel | Homepage laadde twee zware oorspronkelijke favoriete productbeelden | Bestaande beelden via responsive Next Image; circa 7,37 MB naar 0,62 MB mobiel in lokale meting. |
| Laag | Lange feestdagenpagina had geen compacte categorieoriëntatie | Vijf vertaalde ankerlinks, 44px bediening en scroll-margin. |
| Laag | Kleine categorieën/bijschriften/acties | Grotere, donkerdere ondersteunende tekst met behoud van hiërarchie. |
| Middel | Vinext liet description buiten de documentkop staan | `htmlLimitedBots: /.*/` schakelt metadata-streaming uit; lokale contentmetadata staat nu direct in HEAD. Crawl controleert dit expliciet. |
| Middel | Cloudflare viel bij Next Image terug op zware originelen | 28 lokale WebP-varianten van zeven bestaande homepagefoto’s; browser kiest via picture/srcset. Originele SHA256 gecontroleerd; geen betaalde beeldservice. |
| Middel | Smalle menu-uitklappers en te lichte kruimelpaden | Minimaal28px breed/44px hoog, donker-kruimeltekst opacity0,85. |
| Laag | Zichtbare fotolabels en mobiele beltekst kwamen niet overeen met de toegankelijke naam | Aria-label bevat nu het zichtbare label in alle talen. |
| Laag | Korte receptdescriptions maakten ongerelateerde gerechten nauwelijks onderscheidbaar | Lokale zichtbare gerechtnaam vóór de bestaande ondertitel; geen nieuwe voedingsclaim. |

De gevraagde Bitter-koppen en absolute reviewdatums waren op de actuele main al aanwezig. Daarom niet opnieuw herschreven. Reviewauteurs, beoordelingen, prijzen, porties, ingrediënten, foto's, studenten- en accountlogica zijn niet aangepast. Er zijn geen echte aanvragen of berichten verstuurd.

## Uitgevoerde controles

- Next productiebuild en Cloudflare/Vinext-build slagen. Next genereert 572 routes inclusief private/functionele routes.
- Typegen, TypeScript en gerichte ESLint slagen.
- Contentcheck: 67 producten, 40 recepten, 515 gelijke vertaalkeys. Dit bewijst geen volledige vertaalkwaliteit.
- Shopcheck: twaalf vaste schaalvarianten, 23 productroutes, zes hoofdkeuzes, drie talen, prijs-/selectie-/opslagcontrole en 65 datum-/tijdzonegevallen.
- Bestaande mand-browseracceptatie A–J geslaagd: aantallen, subtotaal, ongeprijsde salades, herladen/terug, datum, maatwerk, vertalingen en focus. Achttien extra route/breedtecombinaties.
- Designbrowser: 72 pagina/schermcombinaties, aanvullend 200% tekstvergroting op 683px. Geen overflow of pageerrors; NL/EN/DE contactvalidatie en vijf feestdagenankers; nul verzonden aanvragen.
- Publieke SEO-simulatie onder Next én Cloudflare: 507 pagina’s, 519 links, 153 bronbeelden, geen fouten; alleen negen bekende ontbrekende gerechtfoto-waarschuwingen.
- Besloten lokale profielen onder Next én Cloudflare: slot/noindex/robots/lege sitemap; ook toegelaten dummy-cookie-response noindex. Dummywaarden blijven lokaal.
- Schema.org en Google Rich Results-codevalidatie daadwerkelijk uitgevoerd; resultaten in [structured-data](structured-data.md).

Compact bewijs en route-inventaris staan ook in `audit-results.json` en `route-inventory.csv` in deze map. Ruwe resultaten staan naast de repository onder `../design-preview/master-audit/`: `seo-public.json`, `seo-cloudflare.json` (route-inventaris met taal/status/title/description/canonical/alternates/H1), `seo-locked.json`, browserresultaten, buildlogs en screenshots. De lokale Cloudflare-simulatie gebruikte alleen een tijdelijke binding in het genegeerde buildartefact. Geen productievariabele of secret aangepast.

## Performance: wat de cijfers wel en niet zeggen

Achttien metingen per ronde: drie samples op home/assortiment/feestdagen, mobiel390 en desktop1440, verse browsercontext, installed Chrome, localhost zonder netwerk-/CPU-throttling. Onder Next ging de homepage mobiel van circa 7,37 MB naar 0,62 MB en desktop van 7,39 MB naar 0,74 MB aan resource-transfers. Geen originele foto vervangen.

De meetmethode registreert LCP en layoutverschuivingen, maar is **geen Lighthouse**, geen echte INP en geen CrUX/GSC-veldmeting. Cold-start en gelijktijdige builds/crawls kunnen lokale timing beïnvloeden. De ruwe samples zijn bewaard; geen mediaan presenteren als garantie voor gebruikers. Een herhaling met layoutattributie gaf homepage/assortiment CLS 0 en feestdagen 0,044 mobiel / 0,009 desktop; de mobiele verschuiving is de bestaande mandknop die plaatsmaakt voor de cookiekeuzebanner. LCP-mediannen in deze laatste localhostronde: home 968/960 ms, assortiment 1104/976 ms, feestdagen 1000/952 ms (mobiel/desktop). Dat is geen bewijs van veldprestaties. De eerdere incidentele hogere uitschieters waren niet reproduceerbaar; herbeoordelen bij geïsoleerde Lighthouse-meting na deploy.

### Belangrijk runtimeverschil bij beelden

De aanvullende mobiele browsercontrole op de gebouwde Cloudflare-runtime slaagt op home/contact/feestdagen (geladen beelden en geen pageerrors). Daarbij is vastgesteld dat `/_next/image` met302 naar het oorspronkelijke bestand doorverwijst: de huidige `vinext()`-configuratie heeft geen optimizeradapter. De geïnstalleerde `vinext/dist/image/image-adapters-virtual.d.ts` en `vinext/dist/check.js` bevestigen dat een IMAGES-binding alleen niet voldoende is. **De 91,6% besparing geldt voor Next, niet als bewezen Cloudflare-winst.**

Dit runtimeverschil is inmiddels voor de homepage opgelost met kostenvrije build-time varianten (`build-static-images.mjs`, manifest en `StaticResponsiveImage`). Zeven originele foto’s leveren28 WebP-bestanden. SHA256 bewaakt ongewijzigde originelen; CI controleert manifest, resolutie en bestanden. De Cloudflare-browser laadt alleen de gekozen varianten: **101.092 bytes mobiel390, 251.948 bytes desktop1440**, tegenover6.965.315 bytes aan dezelfde zeven originelen (**98,5% / 96,4% minder beeldbytes**). Dit betreft beeldbestanden, niet de totale pagina. Bewijs: `static-images-cloudflare.json`; geen betaalde adapter geactiveerd.

### Lighthouse en echte zoom, aanvullende ronde

Lighthouse13.6.0 CLI, geïnstalleerd buiten de repo; Chrome headless, lokale gebouwde Cloudflare-runtime, mobiele standaard simulatie en desktop preset. HTML/JSON-rapporten: `../design-preview/master-audit/lh-final-*.report.*`. Lokale server zonder productiecompressie; CPU- en andere lokale activiteit kunnen timing beïnvloeden. Geen CrUX/INP-veldresultaat.

| Template | Performance mobiel / desktop | Gesimuleerde LCP mobiel / desktop | CLS mobiel / desktop |
|---|---|---|---|
| Home | 76 / 94 | 6,49s / 1,60s | 0 / 0 |
| Assortiment | 73 / 92 | 9,43s / 1,82s | 0 / 0 |
| Visschalen | 72 / 94 | 12,68s / 1,67s | 0,044 / 0,010 |
| Contact | 75 / 93 | 8,17s / 1,72s | 0 / 0 |

Alle acht audits: accessibility100 en best-practices100. SEO92 door productiecanonical versus de lokale testhost, niet door een foutieve productiecanonical; de eigen507-routecontrole valideert canonical/hreflang tegen het echte domein. Back-forward-cache beperkt door huidige frameworkverbindingen. Hero nu eager/high-priority en direct vindbaar in HTML. Restpunten: gedeelde CSS/JS en prestaties op de echte edge, vóór publieke lancering opnieuw meten. Een voldoende mobiele veld-LCP is dus **niet bewezen**.

Echte Chrome-pagezoom200% via nieuw geïsoleerd testprofiel: DPR2, fysiek1366px venster, CSS-viewport675px inclusief scrollbar, ongewijzigd17px rootfont. Acht templates zonder overflow of pageerrors; CDP-screenshots in `zoom/`. Dit vervangt de eerdere beperking van alleen CSS-tekstvergroting.

### Heading- en descriptioncontrole

Alle507 server-outlines bevatten headings, geen sprongen in niveau. Per taal metadata-overlapkandidaten gezocht met token-Jaccard>0,70 (geen SEO-score): kleine/grote trio’s, zalm/tonijn en schaalformaten delen terecht feitelijke samenstellingswoorden. Hun prijzen/hoeveelheden en eigen routes blijven behouden. De generieke EN/DE-taglines voor zalmsalade/schol zijn verholpen door de gerechtnaam in alle receptdescriptions op te nemen. Ruw besluitbewijs: `editorial-outline-review.json`. Dit vervangt geen volledige voedselveiligheids- of vertaalreview.

## Publicatie en live eindcontrole

PR [#81](https://github.com/Voidd2/schaapsvis/pull/81) is samengevoegd als `b13dfee90df8904eaca52b3e73984e1341ec32dd`. GitHub Build site236 en Content integrity69 slaagden op de volledige PR-head `d4b3f46`. De squashboodschap bevatte een oudere documentatievermelding `[skip ci]`, waardoor de eerste main-build werd overgeslagen. Dezelfde main-commit is handmatig opnieuw gebouwd in Cloudflare (build `7e670b3c-f859-4c18-9e99-9d02d8dc57d8`). Site-Worker `schaapsvis` staat als versie `b3f74852-fc47-402c-8888-cfd7c5824fdc` op **Ready, 100% verkeer**. Geen leden-Workerbron, database, secret of toegang ingesteld/veranderd.

Twintig live controles: tien routes op390px en1440px, waaronder home, assortiment, visschalen, feestdagen, locaties, contact, vast product, recept en EN/DE-blog. Status200, één H1, eigen canonical, description in HEAD, noindex en geen overflow/pageerrors. Onbekend recept404; leden-health200/ok. Contact heeft telefoonveld; EN/DE-blog verwijst niet meer naar de oude configurator; alle zeven homepagebeelden gebruiken de responsive bestanden. Geen aanvragen verzonden.

Live robots Disallow, sitemap leeg en wachtwoordformulier bereikbaar. De browser draait op het vertrouwde eigenaarsnetwerk: een geslaagde inhoudscontrole bewijst niet zelfstandig de blokkade buiten die allowlist. De lokale tests zonder toegang slagen; de externe webfetch kon de site niet ophalen en geldt niet als bewijs.

Lighthouse13.6.0 op de echte mobiele homepage: performance81, accessibility100, best-practices100, SEO69. De expliciete noindex/robotsblokkade verklaart de crawlbaarheidsaftrek; die is bewust behouden. LCP4,83s, CLS0, TBT3ms. Dit is één gesimuleerde mobiele labmeting, geen echte INP of veld-CWV. Ongethrottelde Chrome-observaties (niet vergelijkbaar met Lighthouse) gaven home LCP936/760ms en CLS0 op mobiel/desktop; HTML wordt op de edge met zstd gecomprimeerd. Assortiment laadde in die observatie circa4,94/5,65MB resources: verdere catalogusbeeldoptimalisatie blijft nuttig.

Bewijs buiten Git: `live-release.json`, twintig `live-*.png`, `live-home-390-viewport.png`, `live-home-1440-viewport.png`, `lh-live-home-mobile.report.html/json`; bereikbaar via het bijgewerkte voor/na-overzicht.

## Nog open, in volgorde

1. Publicatie afgerond: PR #81, commit `b13dfee`, siteversie `b3f74852`, Ready/100%. Twintig live route/schermcombinaties geslaagd. Het slot blijft aan. Aanvullend: PR83 en externe GitHub-slotcontrole geslaagd; zie actuele vervolgstatus bovenaan.
2. Telefoon en dinsdagopening zijn bevestigd en verwerkt in PR86: bellen0715124810, WhatsApp0624811678, dinsdag09:00. Overige Google Bedrijfsprofielgegevens en drie echte gerechtfoto’s blijven eigenaarafhankelijk; zie [NAP](nap-controle.md) en [recepten](recepten-matrix.md).
3. Search Console: huidige Google-aanmelding toont **“Je hebt geen toegang tot deze property”** voor `sc-domain:schaapsvishandel.nl`. Geen zoekprestaties of indexeringsdata beschikbaar. Toegang regelen vóór lancering; geen nieuwe betaalde dienst nodig.
4. Edge-meting uitgevoerd: mobiele Lighthouse-homepage81, toegankelijkheid100, best-practices100, LCP4,83s, CLS0, TBT3ms. Mobiele LCP blijft optimalisatieruimte; dit is geen veld-CWV-goedkeuring. Catalogusfoto’s zijn inmiddels geoptimaliseerd in PR83; rendervertraging/veld-CWV na publieke lancering beoordelen met representatieve gebruikersdata.
5. Eigenaar: actuele etiketten bij High Seas/gerookte zalm en overige partijen. Drie onbewezen ASC-badges/claims zijn voorlopig verwijderd; dit betekent niet dat de producten ongecertificeerd zijn. Ingrediënten en voedingswaarden zijn niet gewijzigd. Zie de redactionele controle hieronder.
6. Na openbare lancering de [checklist](lancering-checklist.md) en het [90-dagenplan](monitoring-90-dagen.md) uitvoeren. Het slot blijft tot afzonderlijk eigenaarsbesluit aan.

## Aanvullende controle vóór publicatie

De redactionele wijzigingen zijn opnieuw gebouwd onder Next (572 routes) en Cloudflare. De nieuwe volledige Cloudflare-crawl controleerde 507 pagina’s, 519 linkdoelen en 153 beelden zonder fouten, met dezelfde negen bekende fotowaarschuwingen. De twee ongewijzigde Voorschoten-artikelen behouden hun oorspronkelijke wijzigingsdatum. TypeScript, inhoudscontrole en echte NL/EN/DE-localizers slagen.

Live bleek HTTP-www een 522 te geven: de bestaande redirectregel matchte alleen HTTPS-www. In Cloudflare is uitsluitend die bestaande regel aangepast naar host `www.schaapsvishandel.nl`, met 301 naar het HTTPS-hoofddomein en behoud van pad/query. HTTP en HTTPS, taalpad en twee queryparameters zijn daarna read-only gecontroleerd. DNS, sitevariabelen, secrets en leden-Worker zijn niet gewijzigd. De tijdelijke lokale SITE_PUBLIC-testbinding is verwijderd. Robots blijft Disallow en de live sitemap leeg.

## Redactionele controle en grenzen van het bewijs

De broninventaris bevat nu per assortimentproduct naam, beschrijving, categorie/koopintentie, beschikbaarheid, werkelijk gekoppeld beeld, allergenen, certificaatvraag en receptkoppelingen. Voor alle 23 vaste producten zijn naam, prijs, inhoudsaantal, allergenen, formaat en beeld opgenomen. Voor alle 19 blogs staan intentie, data, H2's, recepten en bron-/interne links vast. De echte localizers van alle producten, recepten en blogs zijn voor NL/EN/DE uitgevoerd; ontbrekende inhoud en onjuiste paragraaf-/stapaantallen laten de controle falen.

Handmatig gevonden en gecorrigeerd: roodbaars had onterecht rood vlees; drie spellingfouten (tarbot/heilbot/kokkels); coquilles beloofden universeel twee minuten; tonijn miste in EN/DE de Nederlandse waarschuwing voor rauwe bereiding. De EN/DE-blog over een borrel in Voorschoten beschreef oude niet-bestaande schaalgroepen, personenformaten en een configurator met vanafprijzen. Die beschrijving is vervangen door het huidige onderscheid vaste uitvoering/maatwerk, met het bestaande €17,50 uitsluitend als richtbedrag. Twee daadwerkelijk gewijzigde blogs krijgen wijzigingsdatum 3 november; andere datums blijven behouden.

De 40 recepten zijn in de bron vergeleken op numerieke ingrediënten/stappen in EN/DE: verschillen als `4` tegenover `four`/`vier` zijn gelijkwaardig, geen geconstateerde afwijking in hoeveelheden. Dit is geen proefkoken of garantie dat elke taalkundige nuance perfect is. Blogs blijven onderscheiden naar bezoek, bereiding, portie, herkomst en bewaren; geen nieuwe SEO-URL's toegevoegd.

Bronnen gecontroleerd op 3 november:

- [HANOS roodbaars](https://www.hanos.nl/nl/product/roodbaars-800-1500-gr-38001220): de rode buitenkant rechtvaardigt geen claim over rood visvlees; de fout is verwijderd.
- [Voedingscentrum veilig met vis](https://www.voedingscentrum.nl/nl/thema/5xveilig/vis.aspx): ondersteunt koeling op4°C, hygiëne, volledig verhitten en extra aandacht voor kwetsbare groepen. De bestaande bewaar-/rauwadviesartikelen verwijzen hiernaar. Geen nieuwe medische belofte toegevoegd.
- [VÅRLAKS](https://varlaks.no/): leverancier beschrijft Noord-Noorse familiebedrijven en traceerbaarheid. Dit is geen bewijs van BIO voor de specifieke levering; huidige voorzichtige uitleg behouden.
- [SOLT](https://www.soltmen.com/onze-regels/): beschrijft verwerking/pellen en MSC-garnalenvisserij. Een actuele productpartij blijft aan etiket/leveranciersinformatie gebonden.
- Voor de drie gerookte-zalmproducten is geen actueel ASC-partijbewijs gevonden. De badges en stellige certificeringszinnen zijn weg; de tekst vraagt naar de actuele verpakking. Eigenaar kan gecontroleerde certificering later terugplaatsen. Geen ingrediënten/allergenen gewijzigd.

Een vergelijking met basiscommit `b60f56e` bewijst dat alle67 beschermde productvelden (behalve beschrijving/badge), prijzenbestand, 23 feestdagenproducten, catalogusmapping, beeldmapping, voedingswaarden en seizoensadvies gelijk zijn. Bewijs: `editorial-protected-live.json` naast de repo. Voor exacte voedingswaarden en herkomst per levering is een etiket nodig; bestaande gemiddelde voedingsinformatie blijft als indicatief benoemd.

## Dekking per eis uit de opdracht

| Eis | Uitkomst en bewijs |
|---|---|
| A1–A2 merk en typografie | Bestaand palet, Bitter/Source Sans en1536px behouden; gevraagde grote koppen waren correct. Kleine teksten verbeterd; visuele-eindcontrole + screenshots. |
| A3–A4 contrast/uitlijning | Contrast5,14:1/hover7,43:1, kruimels en footers verbeterd;8 Lighthouse-a11y100-tests en echte200%-zoom. Geen volledige WCAG-certificering. |
| A5 hoofdtemplates/contact/reviews | Acht templates×negen formaten; vijf feestdagenankers, client/server antwoordkanaal; bestaande absolute reviewdatums behouden. |
| B1–B2 research | Primaire Google/Schema-bronnen in structured-data/lancering/monitoring; drie lokale/concurrerende site-indelingen in keyword-map. Geen ranking/volume verzonnen. |
| C1 routes | 507 publieke routes en519 doelen geïnventariseerd; private/account/API/oude routes apart in testprofielen, niet in sitemap. |
| C2 slot/indexatie | Next en Vinext lokale gesloten/openbare simulatie geslaagd; expliciete preview-noindex toegevoegd. Live slot blijft releasevoorwaarde. |
| C3–C6 canonical/taal/meta/HTML |507 echte HTML-responses op beide runtimes: canonicals/hreflang/HEAD/taal/H1 en outline; kopievarianten bewust behouden. Live HTTP/HTTPS-www, pad/query en slashredirect gecontroleerd. |
| C7 schema | Externe validators en bronprijsvergelijking; onbewezen stock/areaServed/FAQ-emissie weg. Drie Recipe-beelden wachten op eigenaar. |
| C8–C9 sitemap/redirect |507 publieke canonicals; gesloten sitemap leeg; oude bezorg-, recept- en aliasroutes getest; onbekende details404. Geen bestaande redirect verwijderd. |
| D1–D4 lokaal | NAP-verschillen met bronlinks en eigenaarsacties; afzonderlijke locatie-intenties en links in keyword-map. Geen GBP-wijzigingen zonder eigenaar. |
| E1–E4 inhoud | Uitgebreide broninventaris, redactionele correcties hierboven,40-receptenmatrix en keywordmap met contentgaten/commerciële waarde/eigenaarsinput. |
| F1 beelden | Bestaande foto's behouden; sinds PR83 364 WebP-varianten/91 bronnen. SHA/dimensies, browserselectie en originele schaalvergroting gecontroleerd; twaalf lokale beeldcombinaties en twintig livechecks. |
| F2 prestaties | Vier templates×twee Lighthouseprofielen; beeldbytes98,5%/96,4% lager. Edge-Lighthouse uitgevoerd (mobiel81); echte veld-CWV nog niet beschikbaar. |
| F3 serverHTML | Publicsim-crawls op beide runtimes; metadata direct in HEAD. |
| G schermen/interactie |72 combinaties+teksttest,8 echte200%-zoom; mand A–J, focus/modal/filter/taal/formulier; geen echte verzending. |
| H1–H3 automatisering | Bestaande scripts uitgebreid,9 geïsoleerde handlercases en twee indexeringsprofielen; CI Build236/Content69 voor de audit en Build239 voor beeldoptimalisatie groen. Externe slotcontrole toegevoegd. |
| I documenten/skill | Acht gevraagde documenten, inventaris/resultaatbestanden en project-SEO-skill aanwezig; geen llms.txt toegevoegd. |
| J monitoring | GSC-account heeft geen propertytoegang; 90-dagenplan en eigenaarstappen staan klaar. Geen data verzonnen. |
| K prioritering | Aangetoonde P0/P1-fouten eerst, daarna beelden/performance en inhoud; geen groot redesign. |
| L oplevering | PR81 en PR83 samengevoegd, Cloudflarecommit/Ready en20 livecontroles per ronde vastgelegd. Voor/na en livebeelden aanwezig; eigenaarafhankelijkheden expliciet behouden. |

## Onderzoeksbronnen

Geraadpleegd 3 november 2026: geïnstalleerde Next16-documentatie voor metadata/sitemap; [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [robots](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions), [titels](https://developers.google.com/search/docs/appearance/title-link), [snippets](https://developers.google.com/search/docs/appearance/snippet), [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) en [lokale Google-resultaten](https://support.google.com/business/answer/7091?hl=nl). Relevantie: feitelijke pagina-inhoud, crawlbare links en eenduidige paginarollen; geen ranggarantie, zoekvolume of kunstmatige AI-optimalisatie.

De specifieke schema-, lokale bron- en concurrentiebevindingen staan in [structured-data](structured-data.md), [NAP-controle](nap-controle.md) en [keywordmap](keyword-map.md).

## Gewijzigde bestanden

De volledige lijst ten opzichte van basis `b60f56e`, inclusief alle gegenereerde beeldvarianten en deze rapportage, staat in [changed-files.txt](changed-files.txt). Historische meetresultaten hierboven blijven gelabeld per ronde.
