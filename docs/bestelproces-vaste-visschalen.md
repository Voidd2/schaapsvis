# Bestelproces en vaste visschalen — uitvoering 3 november 2026

## Resultaat

Eén catalogusmandje rechtsonder gebruikt de bestaande tabbladopslag op Visschalen, Feestdagen en alle productdetails. De oude webshop blijft afzonderlijk bereikbaar. Het paneel toont aantallen, eenheids- en regelprijzen, onbekende prijzen, datum, wensen en het bekende subtotaal. WhatsApp opent alleen een concept na een bewuste klik. Er wordt niets automatisch verzonden.

Opgelost: verdeelcheckbox en verdeelteksten verwijderd; oude `split`-velden worden bij inlezen weggefilterd en schoon opgeslagen; geen dubbele formaatkeuze/hoofdactie op productdetails; naam en prijs staan op mobiel vóór de foto. Maatwerk onderscheidt samengestelde schaal, luxe vis, salades en combinaties, met aparte allergieën. De twee trio's heten consequent klein en groot in NL/EN/DE, inclusief metadata/schema.

Vrije tekst blijft uitsluitend in geheugen, niet in pagina-URL of sessionStorage. Een bewuste WhatsApp-actie gebruikt wel de vereiste WhatsApp-concept-URL. Klikstatistieken sturen alleen de bestemming zonder query/fragment. De datumcontrole gebruikt Europe/Amsterdam. Een datum is een voorkeur, geen beschikbaarheidsbevestiging.

## Acceptatiebewijs

Werkelijk uitgevoerd met lokaal geïsoleerde Playwright/Chrome tegen de productiebuild. Alle externe aanvragen en alle niet-GET-verzoeken werden geblokkeerd; geen echte berichten, bestellingen of registraties. Resultaten en screenshots staan in `../design-preview/cart-79/`.

| Eis | Bewijs |
|---|---|
| A twee middelgrote schalen | €73,50 per schaal; aantal 2; regel en bekend subtotaal €147,00; personenbereik eenmaal in concept |
| B vaste productdetail | kleine schaal direct bereikbaar; geen formaatselect; toevoegen en paneel openen |
| C aantallen | vier kleine €238,00; drie €178,50; opnieuw vier; verwijderen naar lege staat |
| D combinatie | middelgrote + klein trio + ongeprijsde zalmsalade: €89,49 bekend; salade uitgesloten van som |
| E wensen | geen paling/extra zalm eenmaal; definitieve prijs nog te bevestigen; tekst niet opgeslagen |
| F maatwerk | zalm + paling, mooi op een schaal, zes personen; salades schakelen naar hoeveelheid/bakjes; apart allergieveld |
| G navigatie | detail, terug, herladen en Feestdagen behouden mandje; vrije tekst vervalt bij herladen |
| H schermen | 360/390/768/1366/1440/1920 op beide catalogi en detail: geen overflow, checkout bereikbaar; cookie/menu en vaste mandknop botsen niet |
| I talen | bediening/concepten/namen NL/EN/DE; groot trio in titel en schema €31,99 |
| J veiligheid | oude split genegeerd, geen externe verzending of schrijfactie, geen browserfouten |

Daarnaast: 96 pagina/breedte-combinaties uit de vorige regressiesuite, 16 EN/DE-routes, accountmenu/Escape/focus/touch, oude winkelwagen migratie/herladen/verwijderen, selectiebehoud, foto's, datum, filters en veilige taalwisseling. TypeScript, ESLint, inhoudscontrole, shopchecks, Next-build (572 routes) en Cloudflare/Vite-build slagen. De Cloudflare-build geeft bestaande sourcemap/partiële Next-configwaarschuwingen maar eindigt succesvol.

Testcommando's: `node scripts/check-cart-browser.mjs`, `node scripts/check-quality-browser.mjs`, `node scripts/check-shop-navigation.mjs`, `node scripts/check-content-integrity.mjs`. Voor browsertests verwijst `PLAYWRIGHT_MODULE` naar de reeds geïnstalleerde Playwright-module; geen nieuwe dependency. Lokale server op 3035 met alleen voor dat proces `SITE_PUBLIC=launch-approved`.

### Voor en na

- [Catalogus vóór, 390px](../../design-preview/cart-79/catalog-before-390.png)
- [Catalogus na, 390px](../../design-preview/cart-79/catalog-after-390.png)
- [Detail vóór, 390px](../../design-preview/cart-79/detail-before-390.png)
- [Detail na, 390px](../../design-preview/cart-79/detail-after-390.png)
- [Mandje met meerdere producten](../../design-preview/cart-79/cart-multiple-390.png)
- [Maatwerkformulier](../../design-preview/cart-79/bespoke-390.png)
- [Volledig WhatsApp-concept met meerdere producten](../../design-preview/cart-79/whatsapp-multiple-products.txt)
- [Maatwerkconcept zalm/paling voor zes](../../design-preview/cart-79/whatsapp-bespoke.txt)

## Gewenste vijf personenformaten: voorbereiding, geen live herprijzing

De onderstaande referenties zijn bestaande producten, geen vastgestelde prijzen voor de nieuwe formaten. Alle twaalf schaalroutes blijven bestaan met hun huidige samenstelling, porties en prijs. Geen prijs of gewicht wordt omgerekend.

| Gewenst | Bestaande klassieke referentie | Nog door eigenaar vast te stellen |
|---|---|---|
| 1–2 personen | geen exacte; huidige 2–3, `visschotel-klein-2-3-pers`, €59,50, ovaal circa 34 × 25 cm | werkelijk aanbod, vis-/saladehoeveelheid per soort, schaalmaat, definitieve prijs, allergenen en foto |
| 2–4 personen | geen exacte; huidige 2–3 (€59,50) en 3–5 (€73,50) | welke samenstelling/hoeveelheid deze tussenvorm krijgt, schaalmaat en eigen prijs; geen gemiddelde berekenen |
| 4–6 personen | geen exacte; huidige 3–5 (€73,50) en 5–8 (€98,50) | porties/samenstelling, schaalmaat en definitieve prijs; huidig beeld bewijst geen hoeveelheid |
| 6–8 personen | geen exacte; huidige 5–8, `visschotel-middel-5-8-pers`, €98,50, ovaal circa 44 × 30 cm | bevestigen of inhoud werkelijk geschikt blijft voor 6–8; zo nodig nieuwe hoeveelheden, prijs en tekst |
| 8–10 personen | exacte bereikmatch: `visschotel-groot-8-10-pers`, €115,50, ovaal circa 54 × 34 cm | alleen bevestigen dat deze klassieke uitvoering de bedoelde vijfde hoofdkeuze is; data kan dan ongewijzigd hergebruikt |

Luxe en hapjes zijn andere samenstellingen, geen alternatieve prijs voor de klassieke uitvoeringen. De ronde luxe 10–14 blijft apart €160,00. Voor afwijkende/grotere aantallen wordt maatwerk besproken. Wijzigingen aan porties vereisen ook actuele ingrediënten/allergenen; geen automatisch vervangingsrecht.

## Kleinste foto — uitsluitend illustratief voorstel, nog niet live

Geen aantoonbaar afzonderlijke eigen foto gevonden in de bestaande productbibliotheek voor deze kleine uitvoering. Daarom is één concept gemaakt met de toegestane bestaande foto als referentie. Alle productafbeeldingen in de live code zijn ongewijzigd.

- [Huidige foto](../public/images/dirks/visschotel-klein-2-3-pers.webp)
- [Illustratief AI-concept](../../design-preview/cart-79/kleine-schaal-illustratief-concept.png)

Generatie: imagegen, één edit. Bron `public/images/dirks/visschotel-klein-2-3-pers.webp`. Opdracht: maak de bestaande zwarte ovale schaal zichtbaar kleiner, compacter en minder gevuld; behoud dezelfde vissoorten, garnalen en centrale zalmsalade, realistische presentatie, camerahoek, licht en marmeren ondergrond. Geen nieuwe ingrediënten, sushi, logo's, tekst, prijs of personenclaims. Niet slechts bijsnijden/schalen. Concept voor beoordeling, geen exacte portieweergave.

De eigenaar moet dit voorstel beoordelen voordat het een productbeeld vervangt. Een echte foto van de feitelijke kleine uitvoering blijft het sterkste bewijs. Bij eventuele inzet moet het als illustratief beeld herkenbaar blijven.

## Publicatie

Branch `codex/catalog-cart-simplification`, basis `ac05aac` (na PR #77/#78). PR en echte Cloudflare-versie worden na merge hieronder geregistreerd. Niet afgeleid uit een Vercel-build. Accountbackend, routes en site-toegangsbeveiliging zijn niet aangepast.
