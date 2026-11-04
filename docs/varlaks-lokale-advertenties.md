# VÅRLAKS — lokale landingspagina en campagnevoorbereiding

Onderzoek en uitvoering: 4 november 2026. Vervolg op `varlaks-landingspagina.md`.

## Doel en bevinding

Een Leidenaar die vanuit een advertentie binnenkomt moet direct herkennen wat Schaap verkoopt, waarom het verhaal relevant is en waar hij terechtkan. De bestaande pagina legde de herkomst al uit, maar stuurde voor locaties naar een andere pagina. Het lokale onderscheid en de geschiedenis waren te weinig verbonden met het product.

Google adviseert een duidelijke overeenkomst tussen advertentie, landingspagina en vervolgstap, belangrijke informatie bovenaan en eenvoudige mobiele navigatie. Dit is bruikbare ontwerpgrond voor deze pagina; geen garantie voor meer verkopen of een uitspraak over Meta's advertentiebeoordeling. [Google Ads: landingspagina optimaliseren](https://support.google.com/google-ads/answer/6238826?hl=nl).

## Nu uitgevoerd

- Introductie met Leiden sinds 1938 en Herenstraat, Botermarkt en Aalmarkt bij de Waag. Eerste bezoekknop springt naar locaties op dezelfde pagina.
- Drie Leidse locatiekaarten direct na de introductie/voordelen: winkel Herenstraat, woensdag Botermarkt en zaterdag bij de Waag. Openingstijden en routebestemmingen uit de bestaande centrale bedrijfsgegevens; Voorschoten apart eronder.
- Grote routeknoppen, drie kolommen op desktop en één op mobiel. Geen zware kaartembed of extra externe scripts.
- Veranderverhaal: vertrouwd in Leiden, met aandacht voor herkomst en bewuster kiezen. Dit is een ambitie en servicebelofte, geen onbewezen milieuvergelijking.
- Alle nieuwe inhoud in NL, EN en DE. Bestaande producten, foto's, recepten, contactnummer en toegangsbeveiliging behouden.

## Claim die nog niet gebruikt kan worden

De officiële leverancier noemt ASC en traceerbaarheid, maar bevestigt op de geraadpleegde pagina geen biologische certificering voor jullie product. Daarom blijft de verkoopnaam **VÅRLAKS-zalm**. ASC is geen bewijs voor de claim biologisch. Voor een biologische advertentie is een passend productspecifiek bewijs nodig. [VÅRLAKS retail](https://varlaks.no/retail/). RVO beschrijft dat de biologische aanduiding ook in reclame aan regels is gebonden. [RVO: communiceren over biologische producten](https://www.rvo.nl/onderwerpen/biologisch-ondernemen/communiceren/regels).

## Advies voor de latere advertentie

Gebruik na publieke lancering `https://schaapsvishandel.nl/nl/varlaks` als bestemming. De Workers-URL is de preview. De site is nu nog besloten; start geen betaald verkeer zolang bezoekers een wachtwoordscherm zien.

Twee mogelijke invalshoeken voor een latere vergelijking:

1. Lokaal en vertrouwd: “VÅRLAKS-zalm in Leiden. Persoonlijk advies bij Schaap’s, sinds 1938.”
2. Herkomst en keuze: “Ontdek het verhaal achter onze VÅRLAKS-zalm. Kom langs in Leiden.”

Gebruik per advertentie één duidelijke vervolgstap: bekijk waar en wanneer u kunt langskomen. WhatsApp blijft een tweede optie voor porties, snit of grotere hoeveelheden. Noem geen prijs of korting die de eigenaar niet heeft bevestigd. Echte winkel-, team- en marktfoto's kunnen de lokale herkenning later verder versterken; de huidige AI-sfeerbeelden blijven als illustratie gelabeld.

## Meten zonder te veel te beloven

De bestaande eigen statistieken tellen na toestemming paginaweergaven en linkklikken. Route- en WhatsApp-klikken zijn interessesignalen, geen bewezen winkelbezoeken of verkopen. Externe kaartlinks worden op hostniveau samengevat; dit geeft nog geen betrouwbare uitsplitsing per locatie. UTM-toeschrijving, Meta-conversies en ROAS worden momenteel niet door dit dashboard geleverd. Geen nieuwe trackers of campagnekoppelingen toegevoegd. Leg pas voor een echte campagne de benodigde meting en succescriteria vast.

## Controle en publicatie

- Inhoudscontrole, catalogus-/navigatiechecks, gerichte ESLint, Next-build (572 pagina's), Cloudflare/Vite-build en `git diff --check` geslaagd. Vite heeft de bekende niet-blokkerende sourcemap-/configwaarschuwingen.
- Chrome: drie desktopkolommen; op 390px inhoudsbreedte één kolom zonder horizontale overflow; routeknoppen minimaal 52px. NL/EN/DE-locaties, dagen, tijden en linkdoelen gecontroleerd. Geen WhatsApp-bericht verstuurd.
- Publicatiebewijs volgt na de Cloudflare-uitrol.
