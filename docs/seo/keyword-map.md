# Zoekintenties en paginarollen

Onderzocht 3 november 2026. Kwalitatieve prioriteiten; geen zoekvolumes, rangposities of conversies verzonnen. De zoekopdrachten zijn gedaan zonder vastgezette zoeklocatie. Zoekresultaten zijn dus geen lokale rankingmeting.

| Intentie / zoekfamilie | Primaire pagina | Ondersteuning, zonder kopiepagina | Prioriteit |
|---|---|---|---|
| Schaap’s Vishandel / Schaaps Vis | `/nl` | Ons verhaal, contact | Hoog |
| viswinkel / visboer Leiden, Herenstraat | `/nl/viswinkel-leiden` | Home verwijst naar winkel; bezoek-ons geeft praktische route | Hoog |
| openingstijden, adres, marktdagen Schaap | `/nl/bezoek-ons` | Contact, footer met dezelfde brondata | Hoog |
| visboer Voorschoten / Hoogvliet vrijdag | `/nl/viswinkel-voorschoten` | Wekelijkse kraam, nooit een dagelijkse winkel suggereren | Hoog |
| viskraam markt Leiden | `/nl/marktkraam-leiden` | Botermarkt/De Waag bij bezoek-ons | Middel |
| visschaal / visschotel Leiden | `/nl/visschalen` | Feestdagen en productdetails ondersteunen, geen losse synoniemroutes | Hoog |
| kerst visschotel, gourmet feestdagen | `/nl/feestdagen` | De vaste 23 productdetails; seizoensintro en categorielinks | Hoog, seizoensgebonden |
| specifieke schaal + aantal personen | `/nl/feestdagen/[slug]` | Vaste prijs per schaal; keuzecontext niet canoniek | Hoog |
| visgourmet / barbecuevis | `/nl/barbecue-gourmet` | Feestdagen en relevante producten | Middel |
| relatiegeschenk vis | `/nl/relatiegeschenken` | Persoonlijke aanvraag, geen ongekende prijzen/voorraad | Middel |
| kabeljauwfilet, tonijn, garnalen kopen Leiden | `/nl/assortiment/[slug]` | Assortimentindex, bereidingsrecepten | Hoog |
| zalm oven citroen dille / concrete bereiding | `/nl/recepten/[slug]` | Hoofdproduct en werkelijk andere bereidingswijze | Middel |
| biologische vis, keurmerken, VÅRLAKS | `/nl/biologische-vis`, merkintentie `/nl/varlaks` | Geen ongecontroleerde BIO/ASC-claim | Middel |
| studenten viskorting Leiden | `/nl/studentenkorting` | Accountpagina blijft noindex | Middel |

EN/DE gebruiken de bestaande vertaalde routes en wederkerige hreflang. De oude Duitse `/frischer-fisch-leiden` verwijst naar de vertaalde winkelpagina; maak er geen tweede landingspagina van.

## Concurrentieobservaties

- [J. Hartevelt locaties](https://vishandeljhartevelt.nl/locaties/): scheidt assortiment, gourmet, visschotels en standplaatsen. Relevante les: laat plaats- en productintentie apart vindbaar zijn.
- [Schuitemaker](https://www.schuitemaker-vis.nl/): onderscheidt winkelbezoek, bestellen, recepten en zakelijke vragen. Niet hun restaurant-, bezorg- of sushiaanbod op Schaap toepassen.
- [Dirks feestdagen](https://www.dirksvishandel.nl/webshop/feestdagen/): categorieën en concrete producten helpen vergelijken. Schaap behoudt de compactere selectie en persoonlijke bevestiging; geen checkoutbelofte kopiëren.

Nieuwe content pas na GSC-gegevens en eigenaarinformatie. De [product-, blog- en receptenmatrix](content-inventory.json) bevat 67 assortimentproducten, 23 feestdagenproducten, 40 recepten en 19 blogs. Niet ieder product hoeft een recept te krijgen: sauzen, kant-en-klaarproducten en specifieke delicatessen rechtvaardigen geen generieke opvultekst.

## Contentgaten en commerciële afweging

De prioriteit hierboven is een kwalitatieve inschatting op basis van bezoek-/aanvraagintentie, geen geschat zoekvolume. Onderstaande aanvullingen gelden voor de bijbehorende zoekfamilies.

| Doelpagina / bestaande inhoud | Ontbrekende informatie | Belangrijkste interne koppelingen | Commerciële waarde / eigenaar nodig |
|---|---|---|---|
| Home en winkel Leiden: merk, winkel en producten | Echte winkel-/teambeelden; eenduidig primair telefoonnummer en dinsdagtijd | Assortiment, locaties, verhaal, schalen | Hoog: winkelbezoek; eigenaar bevestigt NAP en foto's |
| Bezoek-ons, markt Leiden, Voorschoten: eigen locaties en dagen | Actuele Google-profielgegevens en echte kraamfoto's | Naar specifieke locatie, relevante producten en route | Hoog voor bezoek, middel voor informatieve marktvraag; eigenaar bevestigt uitzonderingsdagen |
| Visschalen en 12 vaste schaalvarianten | Geen extra synoniemroutes nodig; nieuwe formaten alleen na bevestiging | Vast product ↔ schalen, maatwerk, feestdagen | Hoog: concrete aanvraag; huidige bedragen behouden, geen nieuwe input voor deze ronde |
| Feestdagen en 23 vaste producten | Feestdagafhaaltijden zodra vastgesteld | Vijf categorieankers, details, geschenken | Hoog in seizoen; eigenaar bepaalt afhaaltijden |
| Barbecue/gourmet | Actuele grote-groepafspraken | Gourmetdetails, vissoorten, recepten | Middel/seizoensgebonden; eigenaar bij nieuw aanbod |
| Relatiegeschenken | Definitieve verpakkingsfoto's en werkelijk beschikbare pakketten | Cadeauvragen, koeltransportblog, contact | Middel, mogelijk grotere aanvraag; eigenaar bevestigt concrete uitvoeringen |
| 67 assortimentdetails | Etiket-/leveringsbewijs bij certificering en exacte voedingsinformatie | Eigen categorie, passende recepten, locaties | Hoog bij koopintentie; eigenaar levert actuele etiketten |
| 40 recepten | Drie ontbrekende gerechtfoto's; geen nieuwe tekstvariant nodig | Recept ↔ hoofdproduct, andere bereidingswijze | Middel: helpt productkeuze; eigenaar/fotografie voor drie beelden |
| Biologische vis / VÅRLAKS | Certificaat van de daadwerkelijk geleverde partij | Keurmerkenblog, leverancier, zalmproduct | Middel: vertrouwen; merkverhaal is geen BIO-bewijs |
| Studentenkorting | Geen nieuwe SEO-content nodig | Uitleg → besloten account | Middel: terugkeer; geen indexering van accounts |

## Concrete vergelijking met primaire concurrentensites

Op 3 november opnieuw rechtstreeks gelezen, zonder rankingclaims: Hartevelt maakt per marktdag en plaats duidelijk waar de verkoopwagen staat. Schaap gebruikt hiervoor één centraal locatieoverzicht met aparte winkel-/kraamrollen. Schuitemaker scheidt online bestellen, winkel/restaurant, zakelijk en recepten; Schaap behoudt dezelfde heldere taakverdeling zonder restaurant- of bezorgbeloften. Dirks gebruikt zoekfunctie, categorieën en uitgelichte producten met een prijs-eenheid; Schaap heeft daarvoor filters, vaste productprijzen en vijf feestdagenankers. Bronnen zijn de drie links hierboven. Dit zijn praktische structuurvergelijkingen, geen bewijs dat deze sites beter ranken.
