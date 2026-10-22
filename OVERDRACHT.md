# Overdracht — wat je zelf nog moet invullen

Kort overzicht van wat er klaarstaat en wat er van jou nodig is voordat de site
live kan. Alles staat op één plek per onderwerp, dus je hoeft nergens in de code
te zoeken.

---

## 1. Visschaalprijzen — actuele afspraak (30 september 2026)

De actuele basisprijs voor **iedere visschaal is € 17,50 per persoon**. De
configurator laat het aantal personen kiezen en rekent de basisprijs daarmee
uit. Extra’s en duurdere vissoorten zijn maatwerk: de klant neemt daarvoor
contact op via WhatsApp; bespreek en bevestig de eventuele meerprijs vooraf.
Vertrouw dus niet op oudere schaalbedragen of losse extra-prijzen elders in
oude notities.

Het actuele telefoon- en WhatsApp-nummer is **+31 6 2481 1678** (wa.me-nummer
`31624811678`), centraal ingesteld in `src/lib/bedrijf.ts`.

Zet je een nieuw onderdeel in de lijst, voeg dan ook een vertaling toe onder
`visschaalItems` in `src/messages/nl.json`, `en.json` en `de.json` — met de `id`
als sleutel. Vergeet je dat, dan valt de site terug op het Nederlands.

### Bezorgkosten — `src/lib/bezorging.ts`

```ts
minimumBedrag: 25,        // minimale bestelling
standaardKosten: 5.99,    // één tarief voor het hele gebied
gratisVanaf: 35,          // vanaf dit bedrag gratis
bezorgdagen: [3, 4, 5, 6] // 0 = zondag … 6 = zaterdag
uitersteBesteltijd: "12:00"
```

Eén tarief overal — de rit naar Wassenaar duurt langer dan die naar de
Merenwijk, maar drie tarieven op een site kosten meer uitleg dan ze opleveren.
Wil je toch één gemeente anders, zet dan `kosten:` in dat blok in `GEMEENTEN`;
nu doet geen enkele gemeente dat.

Wijzig je hier iets, dan verandert het meteen op de bezorgpagina's, in het
bestelformulier, in de winkelwagen, in de postcodecheck én in de gegevens die
Google uitleest.

**Let op bij verse vis.** Die kan op gewicht worden verkocht; we hanteren geen
dagprijzen. Spreek de prijs vooraf met de klant af. De winkelwagen legt uit dat
het totaal van het gekozen gewicht afhangt en dat de prijs vooraf wordt bevestigd.
Visschalen zijn maatwerk via WhatsApp: toon geen vaste schaalprijzen, maar vermeld
alleen de gemiddelde richtprijs van ongeveer € 17,50 per persoon.

**Bezorggebied:** Leiden, Leiderdorp, Voorschoten, Wassenaar en Leidschendam,
op postcode. Een gemeente erbij? Voeg een blok toe aan `GEMEENTEN` met de
postcodereeks, de wijken en één eigen zin — en zet de vertaalde introductiezin
onder `gemeenten` in de drie taalbestanden.

---

## 2. Online betalen met SumUp

De koppeling zit erin en is getest tegen de documentatie van SumUp
(hosted checkout). Er is verder niets te programmeren; je hoeft alleen twee
omgevingsvariabelen te zetten in Vercel:

```
SUMUP_API_KEY        de geheime sleutel uit je SumUp-account (begint met sup_sk_)
SUMUP_MERCHANT_CODE  je merchant code, bijvoorbeeld MABC1234
```

Wat er dan gebeurt:

- **Een visschaal** is een aanvraag via WhatsApp; de inhoud en uiteindelijke prijs
  worden vooraf besproken. Er is geen online afrekening voor visschalen.
- **Verse vis** gaat op gewicht. Wat een kilo kabeljauw kost weet je pas als hij
  op de weegschaal ligt, dus daar valt vooraf niets af te rekenen. Die
  bestellingen komen binnen zoals nu; je spreekt de prijs vooraf met de klant af.

Zolang de sleutels ontbreken werkt de site gewoon door en betaalt de klant bij
de bezorger of aan de toonbank. Er verschijnt dus nooit een betaalknop die
stukloopt.

Belangrijk: het bedrag wordt op de server opnieuw uitgerekend uit de gekozen
onderdelen. Wat de browser meestuurt wordt genegeerd — anders kan iemand met de
ontwikkelaarsconsole een schaal van vijf euro afrekenen.

---

## 3. Waar de bestellingen heen gaan

```
BESTELLING_WEBHOOK_URL   bijvoorbeeld https://formspree.io/f/xxxxxxx
```

Ook een omgevingsvariabele in Vercel. Een gratis account op formspree.io
volstaat. Zolang die ontbreekt wordt een bestelling wél netjes bevestigd, maar
nergens heen gestuurd — handig om te testen, niet om mee live te gaan.

Het nieuwsbriefformulier gebruikt nog het losse Formspree-adres in
`src/components/shared/NewsletterSignup.tsx` (zoek op `JOUW_FORMSPREE_ID`).

---

## 4. Het wachtwoord, en live gaan

### Teruglink naar YourLocalCityGuide

Zet pas na keuze van het definitieve cityguide-domein deze servervariabele in
Vercel (zonder slash aan het einde):

```
CITYGUIDE_URL=https://www.jouw-definitieve-cityguide-domein.nl
```

Daarna verschijnt in de footer van alle drie de talen een inhoudelijke link
naar de Schaap's Vis-pagina in de Leidse wandelgids. Laat de variabele leeg bij
preview-deploys en zolang alleen een tijdelijk Vercel-domein beschikbaar is.

### De site zit nu op slot

**Elke pagina vraagt om een wachtwoord.** Dat geldt voor de homepage, het
assortiment, de blog, de sitemap, `/admin` — alles. Ook als iemand rechtstreeks
een adres intikt of vanaf Google binnenkomt.

Het wachtwoord is **`Malaga5010`**. Wijzigen doe je zonder code aan te passen:
zet in Vercel de variabele `SITE_PASSWORD` op iets anders.

Wie het wachtwoord invult krijgt een cookie die dertig dagen meegaat. Wil je
iedereen er in één keer uit gooien (bijvoorbeeld omdat je het wachtwoord aan
iemand gaf die het niet meer hoeft te weten), zet dan `SITE_ACCESS_TOKEN` op een
nieuwe willekeurige waarde — alle bestaande cookies zijn dan meteen ongeldig.

Zelf even controleren of het slot echt werkt? Ga naar `/api/logout`. Dan ben je
uitgelogd en zie je precies wat een bezoeker ziet.

### De site openzetten voor het publiek

Eén variabele in Vercel:

```
SITE_PUBLIC=launch-approved
```

Weghalen, leeglaten of iets anders invullen zet het slot er weer op.

> **Waarom andersom dan eerst?** Het stond zo dat de site standaard zichtbaar
> was, tenzij je `MAINTENANCE_MODE=on` zette. Die variabele was nooit gezet, en
> daardoor stond de hele site zonder enig wachtwoord online. Nu kan dat niet
> meer: vergeet je de variabele, dan zit het slot erop. Vervelender om zelf open
> te moeten zetten, maar dat is de goede kant om het mis te hebben.

### Wat er verder bij live gaan hoort

Preview-adressen (de voorbeeld-URL's die Vercel per wijziging maakt) worden
nooit door Google opgepakt: die geven altijd `Disallow: /`. Alleen de echte
site mag geïndexeerd worden. Controleer na het openzetten even `/robots.txt`:
daar hoort `Allow: /` te staan. Zolang het slot erop zit zie je daar het
wachtwoordscherm — dat klopt.

**Vóór je het domein `schaapsvishandel.nl` eraan hangt**: zet
`BESTELLING_WEBHOOK_URL` (zie punt 3). Zonder die variabele neemt de site geen
bestellingen aan — de klant krijgt dan je telefoonnummer te zien in plaats van
een bevestiging. Dat is met opzet: een bestelling die stilletjes verdwijnt is
erger dan een formulier dat eerlijk zegt dat het nog niet aanstaat.

Zet in Vercel ook de doorverwijzing van `schaapsvishandel.nl` naar
`www.schaapsvishandel.nl` aan, zodat er niet twee versies van de site bestaan.

### Nog één ding: `/admin`

Die pagina controleert het wachtwoord in de browser, met
`NEXT_PUBLIC_ADMIN_WACHTWOORD` — en alles met `NEXT_PUBLIC_` ervoor staat
gewoon in de broncode die iedere bezoeker kan lezen. Dat is dus geen echt slot.
Nu de site als geheel op slot zit is het geen acuut probleem meer, maar gebruik
die pagina niet voor iets wat niemand mag zien zolang dat zo is.

---

## 5. Foto's en het logo

Dit is nu veruit de grootste winst die je nog kunt pakken — en het enige
waarvoor de site echt op jou wacht.

### Het logo

Het ronde logo dat op de gevel en op de kraam staat zit **nog niet in de site**:
het bestand is er niet. Overal waar het hoort te staan — de kop van elke pagina,
de homepage, Ons verhaal en de voet — staat nu de naam in letters. Dat ziet er
verzorgd uit, maar het is niet jullie merk.

Lever aan: het ronde logo vrijstaand (PNG met transparante achtergrond, of een
SVG), en als je hem hebt ook de liggende versie met de vis links en de naam
ernaast. Zet ze in `public/images/` en vul het pad in bij `logoBadge` en
`logoLiggend` in `src/lib/beeld.ts` (zie hieronder).

### Alle fotoplekken op één plek: `src/lib/beeld.ts`

In dat bestand staat **elke plek waar de site een foto wil hebben**, met erbij
wat erop moet staan, welk formaat het is en welke alt-tekst eronder komt. Het
leest als een opdrachtlijst voor een middag fotograferen:

```ts
winkelGevel: {
  waar: "Homepage (de grote foto bovenaan) en Bezoek ons",
  wat: "De winkel van buiten, met de gevel en het uithangbord herkenbaar. …",
  bestand: "",                                     // ← hier vul jij het pad in
  alt: "De winkel van Schaap's Vishandel aan de Herenstraat 48 in Leiden",
  verhouding: "liggend",
  terugval: "Herenstraat 48, Leiden",
}
```

Je hoeft maar één ding te doen: de foto in `public/images/` zetten en `bestand`
invullen. Hij verschijnt dan meteen overal waar die plek gebruikt wordt — je
hoeft geen pagina aan te raken. Zolang `bestand` leeg is toont de site een net
zandvlak met de naam erin; geen gebroken plaatje en geen leeg gat.

De plekken die nu nog leeg zijn:

| Plek in `beeld.ts` | Wat erop moet |
| --- | --- |
| `logoBadge`, `logoLiggend` | Het logo, vrijstaand |
| `winkelGevel` | De winkel van buiten, Herenstraat |
| `toonbank` | De toonbank met vis erop — de belangrijkste foto van de site |
| `achterDeToonbank` | Iemand aan het werk achter de toonbank |
| `gebakkenVis` | Kibbeling of lekkerbek, net uit de pan |
| `marktZaterdag` | De kraam op de Aalmarkt, met de Waag erop |
| `marktWoensdag` | De woensdagkraam |
| `marktVoorschoten` | De kraam bij Hoogvliet in Voorschoten |
| `historie1938` … `historieNu` | Vijf foto's voor de tijdlijn op Ons verhaal |
| `schaalBorrel`, `schaalFamilie`, `schaalFeest` | De drie visschalen |
| `varlaksFilet` | Een Varlaks-filet op jullie eigen toonbank |

Bij de historische foto's zit de meeste winst: **één vergeelde foto uit 1960
doet meer voor de geloofwaardigheid dan twintig keer "sinds 1938" in de tekst.**
Scheef, korrelig of vergeeld mag — dat maakt het juist echt.

### En verder: de productfoto's — status bijgewerkt 18 oktober 2026

De actuele assortimentcontrole vindt 67 producten met 67 verschillende,
lokaal gehoste afbeeldingsbestanden en 67 verschillende afbeeldingsbytes.
Daarmee ontbreken er volgens de productcataloguscontrole geen foto's en worden
productfoto's niet tussen die 67 producten hergebruikt. Dit zegt niet dat elke
foto al een door Schaap's aangeleverde, professionele productfoto is: voor
bronvermelding en gebruiksrechten van extern gevonden beelden, zie
`docs/afbeeldingsbronnen.md`. De test controleert ook de Varlaks-bestanden en
andere gedeclareerde fotoplekken, maar vervangt geen visuele beoordeling op de
site.

De oudere onderstaande checklist was gebaseerd op een eerdere versie en is
niet langer de actuele fotostatus. Controleer echte winkel-, markt- en
familiefoto's in `fotos-aan-te-leveren.md`; die kunnen niet betrouwbaar worden
vervangen door generieke productbeelden.

De oude scène-illustraties (`public/images/scene-*.svg`) staan nog als
legacy-bestanden en fallback in de brondata, maar worden niet getoond op de
blogkaartjes: alle 18 zichtbare blogkaartjes gebruiken een eigen afbeeldingspad.
`node scripts/check-content-updates.mjs http://127.0.0.1:3000` controleert dit
en slaagde op 18 oktober 2026 met 18 unieke blogfoto's. Verwijder de oude SVG's
pas nadat is vastgesteld dat geen andere route of component ze meer gebruikt.

Historische prioriteiten (deze lijst is niet langer een inventaris van ontbrekende assortimentfoto's):

1. **De winkel van buiten en van binnen** (`winkelGevel`, `toonbank`). Eén goede
   foto van de toonbank met vis erop doet meer dan alle tekst eromheen.
2. **Eigen foto's van de visschalen** (`schaalBorrel`, `schaalFamilie`,
   `schaalFeest`). Er staat nu voorbeeldbeeld bij alle drie; echte foto's van
   de schalen die jullie maken sluiten beter aan op wat de klant ontvangt.
3. **Recept- en productfoto's.** De actuele beeldscripts controleren dat elk
   product een afbeelding heeft en dat de recepten unieke afbeeldingen
   gebruiken. De vroegere lijst van negen ontbrekende producten is verouderd:
   controleer de actuele status met `node scripts/check-product-images.mjs` en
   `node scripts/check-recipe-images.mjs`.

   Voor een volledige beeldkwaliteit- en hergebruikcontrole start de site
   lokaal en geef het adres mee aan de scripts; een controle zonder server
   controleert wel de bestanden, maar niet de gerenderde pagina's.

4. **Jij achter de toonbank** (`achterDeToonbank`, `historieNu`). Voor "Ons
   verhaal", en voor Google: foto's van echte mensen doen het aantoonbaar beter
   dan productplaatjes.
5. **De oude foto's voor de tijdlijn** (`historie1938` tot `historieNu`).
6. De drie marktkramen en winkelgevel. De fotoplekken blijven verborgen zolang
   er geen eigen, herkenbare locatiebeelden zijn aangeleverd.

Heb je een foto van het gerecht zélf, dan gaat die vóór de productfoto: zet hem
op `fotoUrl` bij dat recept.

Formaat voor de **producten**: vierkant, minstens 1200 × 1200 pixels, met de
telefoon is prima. De kaarten in het assortiment en bij de recepten zijn
vierkant; een liggende foto krijgt daar witranden. Zet ze in `public/images/` en
verwijs ernaar in `src/lib/assortiment-data.ts` (`photo:`).

Voor de plekken uit `beeld.ts` staat het gewenste formaat er per plek bij onder
`verhouding`: `vierkant`, `liggend` (3:2), `portret` of `breed`. Fotografeer bij
daglicht en ga bij de toonbank staan in plaats van ertegenin.

Maak ook een `public/og-image.png` van 1200×630 met de winkel erop — dat is het
plaatje dat verschijnt als iemand een link naar de site deelt in WhatsApp.

---

## 6. Vindbaarheid: wat de site doet en wat jij moet doen

### Wat er in de site zit

- Een eigen pagina per gemeente (`/bezorgen/leiden`, `/bezorgen/wassenaar`, …)
  met de wijken, het tarief en de rijtijd. Niemand zoekt op "vis bezorgen";
  mensen zoeken op "vis bezorgen Wassenaar".
- Nederlands, Engels en Duits, met kloppende `hreflang`-verwijzingen. De
  taalkeuze is nu een echte link — met de knop die er eerst stond kon een
  zoekmachine de Engelse en Duitse versie helemaal niet bereiken.
- Gestructureerde gegevens: de winkel als `FishStore` met adres, openingstijden
  en de vijf gemeenten waar je bezorgt, de bezorging als aparte dienst met het
  tarief per gemeente, vraag-en-antwoordblokken, kruimelpaden en de visschaal
  als product met een vanaf-prijs.
- De product-, recept- en bloginhoud is beschikbaar in Nederlands, Engels en
  Duits. De lokale vertaalcontrole telt 67 producten, 37 recepten en 18 blogs
  in drie talen en rapporteerde 0 ontbrekende teksten op 18 oktober 2026.

### Wat alleen jij kunt doen

Dit weegt zwaarder dan wat dan ook op de site zelf:

1. **Google Bedrijfsprofiel.** Vul het volledig in: adres exact als op de site
   (`Herenstraat 48, 2313 AL Leiden`), openingstijden, categorie "Viswinkel",
   en zet er elke maand een paar foto's bij. Zet ook de marktdagen en de
   bezorgservice erin.
2. **Reageer op elke beoordeling**, ook de minder goede, binnen een paar dagen.
   Dat weegt mee én het is te zien.
3. **Zorg dat je naam, adres en telefoonnummer overal identiek zijn** — Google,
   Facebook, Instagram, de bedrijvengidsen. Eén keer "Herenstr. 48" in plaats
   van "Herenstraat 48" en het telt als een ander bedrijf.
4. **Koppel Google Search Console** (de verificatiecode staat al in de site).
   Exporteer daar na een paar weken "Pagina's": daar staan de oude adressen van
   de vorige site die nog verkeer krijgen. Die kun je doorverwijzen in
   `next.config.ts`.
5. **Links van lokale sites**: de ondernemersvereniging, Leidse blogs, de
   markt, de leverancier van Varlaks. Eén link van een echte Leidse site doet
   meer dan tien van een linkverzamelaar.

Zie ook `lokale-seo-acties.md` voor de langere lijst.

---

## 6b. Bedrijfsdetails om actueel te houden

**De woensdagmarkt.** In `src/lib/bedrijf.ts` staat de woensdagkraam *bij Dille
& Camille*. Op een paar oudere pagina's stond *de Vismarkt aan de Nieuwe Rijn*.
De website en de Google Maps-link gebruiken dezelfde locatie. Bevestig dat de
kraam daar nog steeds staat voordat je die locatie ook in je Google
Bedrijfsprofiel bijwerkt; houd naam, adres, dag en openingstijden daar gelijk
aan de website.

De keurmerkpagina is in drie talen opgebouwd, gebruikt lokaal gehoste
VÅRLAKS-beelden en vermeldt MSC voor Hollandse garnalen. Houd claims over BIO,
ASC en MSC gekoppeld aan het concrete product en de actuele verpakking; vraag
de eigenaar om bevestiging als levering of certificering verandert.

---

## 7. Wat er bewust *niet* in zit

- **Sterrenwaardering in de zoekresultaten.** De Google-beoordelingen staan wel
  op de site, met bronvermelding en een link. Maar ze zijn níet als
  `aggregateRating` gemarkeerd: beoordelingen die op een andere site zijn
  achtergelaten op je eigen site als sterren markeren mag niet van Google, en
  levert eerder een maatregel op dan sterren.
- **Bezorging van gebakken vis.** Kibbeling en lekkerbek zijn na twintig minuten
  in een doos niet lekker meer. Dat staat ook zo op de site. Wil je het toch,
  zet de categorie dan bij `BEZORGBARE_CATEGORIEEN` in `src/lib/bezorging.ts`.
- **Vaste prijzen bij verse vis.** Vis kan op gewicht worden verkocht, maar er
  zijn geen dagprijzen. De prijs wordt vooraf met de klant afgesproken; toon geen
  onverwachte toeslagen achteraf.

---

## 8. Even snel: waar zit wat?

| Wat je wilt wijzigen | Bestand |
|---|---|
| Adres, telefoon, openingstijden, social media | `src/lib/bedrijf.ts` |
| Bezorgkosten, bezorgdagen, bezorggebied | `src/lib/bezorging.ts` |
| Startbedrag en toevoegingen visschaal | `src/lib/visschaal.ts` |
| Producten en allergenen | `src/lib/assortiment-data.ts` |
| Richtprijzen per product | `src/lib/prijzen.ts` |
| Aanbieding van de week | `src/lib/aanbieding.ts` |
| Google-beoordelingen | `src/lib/reviews.ts` |
| Alle teksten in drie talen | `src/messages/nl.json`, `en.json`, `de.json` |
| Foto's en het logo (elke plek op de site) | `src/lib/beeld.ts` |
| Kleuren | `src/app/globals.css` |
| Lettertypen | `src/lib/fonts.ts` |

Bouwen doe je met `npm run build -- --webpack`.

