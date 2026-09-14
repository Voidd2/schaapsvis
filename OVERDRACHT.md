# Overdracht — wat je zelf nog moet invullen

Kort overzicht van wat er klaarstaat en wat er van jou nodig is voordat de site
live kan. Alles staat op één plek per onderwerp, dus je hoeft nergens in de code
te zoeken.

---

## 1. Bedragen die nog voorlopig zijn

### De visschaal — `src/lib/visschaal.ts`

Dit is het bestand dat je het vaakst zult openen.

**Drie schalen, elk met een startbedrag.** Ze staan bovenin in `SCHALEN`:

```ts
{
  id: "borrelschaal",
  naam: "Borrelschaal",
  prijs: 55.9,              // ← het startbedrag
  personenVan: 4,
  personenTot: 6,
  omschrijving: "De schaal waar de meeste mensen om vragen. …",
  bevat: ["Gerookte zalm van het mes", "Hollandse garnalen", …],
  foto: "/images/visschalen/borrelschaal.jpg",   // ← nog leeg
}
```

┌─ WAT JIJ NOG MOET DOEN ─────────────────────────────────────────────────────┐
│ Alleen **€ 55,90** is wat je hebt doorgegeven. De namen, de andere twee     │
│ bedragen (€ 89,90 en € 139,90), voor hoeveel personen ze zijn en wat erop   │
│ ligt zijn ingevuld zodat de site te bouwen was. **Vervang ze door je eigen  │
│ schalen.** Bij de twee bedragen staat `// EIGENAAR: jouw bedrag hier`.      │
│                                                                             │
│ En de foto's: zet ze in `public/images/visschalen/` en vul `foto:` in.      │
│ Zolang dat leeg is toont de site een net naamvlak, geen leeg gat.           │
└─────────────────────────────────────────────────────────────────────────────┘

**De extra's** staan in `ONDERDELEN`, in euro per 100 gram:

```ts
{ id: "gerookte-zalm", naam: "Gerookte zalm", prijs: 3.25, groep: "gerookt" }
```

Een paar dingen verkoop je niet op gewicht — een oester is een oester. Die
krijgen `perStuk` mee (`"dozijn"`), en dan is `prijs` de prijs per stuk.

```ts
export const PRIJZEN_DEFINITIEF = false;  // ← op true als de bedragen kloppen
```

Zolang `PRIJZEN_DEFINITIEF` op `false` staat zegt de site erbij dat het
richtprijzen zijn en dat je het definitieve bedrag bevestigt.

**Waar de prijzen van de extra's vandaan komen.** Uitgangspunt was: onder de
markt zitten. Wat andere vishandels rekenen (opgehaald september 2026, staat ook
bovenaan in het bestand):

| Per 100 gram | Concurrentie | Wij |
|---|---|---|
| Gerookte zalm | € 3,50 – € 6,75 | **€ 3,25** |
| Hollandse garnalen | € 4,50 – € 6,49 | **€ 4,25** |
| Gerookte paling | € 5,50 – € 10,50 | **€ 4,95** |
| Gerookte makreelfilet | € 2,75 – € 5,50 | **€ 2,50** |

En complete schotels per persoon: Puurvis in Leidschendam € 14,50 (die zit ín
je bezorggebied), Fieret € 19,95 tot € 33,95, Koelewijn € 28,50 tot € 30.

De configurator rekent uit wat de schaal per persoon kost en zet erbij dat de
klant onder die € 14,50 uitkomt — maar **alleen als dat ook echt zo is**. Met de
huidige voorbeeldbedragen (€ 55,90 voor 4 personen = € 13,98 p.p.) klopt het net;
zet je de prijs hoger of het aantal personen lager, dan verdwijnt die zin
vanzelf. Controleer dat als je de bedragen invult — `MARKT.goedkoopstePerPersoon`
bovenin het bestand is het bedrag waarmee vergeleken wordt.

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

**Let op bij verse vis.** Die gaat op gewicht, dus de site kan niet weten of een
bestelling boven de € 35 uitkomt. De winkelwagen zegt daarom bij verse vis dat de
bezorging vervalt vanaf € 35, en in de bestelling die jij binnenkrijgt staat
`€ 5,99 — vervalt vanaf € 35,-`. Dat reken jij af als je met de dagprijs belt.
Bij een visschaal is het bedrag wél exact en vervalt de bezorging automatisch.

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

- **Een visschaal** is op de cent uit te rekenen, dus die kan de klant meteen
  afrekenen. Hij klikt op bestellen en gaat naar de betaalpagina van SumUp.
- **Verse vis** gaat op gewicht. Wat een kilo kabeljauw kost weet je pas als hij
  op de weegschaal ligt, dus daar valt vooraf niets af te rekenen. Die
  bestellingen komen binnen zoals nu, en je belt met de dagprijs.

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
SITE_PUBLIC=on
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

### En verder: de productfoto's

Er staan 37 echte productfoto's op de site; bij de rest staat alleen de naam en
de omschrijving.

De tekenfilm-illustraties (`public/images/scene-*.svg`) staan nergens meer op
een pagina. Ze zagen eruit als een sjabloon en dat is precies wat we niet
willen. Ze staan nog wel bij de blogartikelen (`src/lib/blog.ts`); vervang die
door echte foto's zodra je ze hebt, dan kan de map weg.

Het meest urgent, op volgorde:

1. **De winkel van buiten en van binnen** (`winkelGevel`, `toonbank`). Eén goede
   foto van de toonbank met vis erop doet meer dan alle tekst eromheen.
2. **De drie visschalen** (`schaalBorrel`, `schaalFamilie`, `schaalFeest`). Die
   staan nu met een naamvlak op de site; met een foto verkopen ze zichzelf.
3. **Negen productfoto's die tegelijk zeventien recepten vullen.** Elk recept
   is gekoppeld aan de vis die je ervoor nodig hebt (`hoofdproduct` in
   `src/lib/recepten.ts`). Staat er een foto bij dat product, dan staat hij
   meteen ook bij het recept. Deze negen ontbreken nog:

   | Product (`slug` in `assortiment-data.ts`) | Vult dit aantal recepten |
   | --- | --- |
   | `varlaks-zalm` | 4 |
   | `tonijnfilet` | 3 |
   | `kibbeling` | 2 |
   | `scholfilet` | 2 |
   | `wijtingfilet` | 2 |
   | `lekkerbek` | 1 |
   | `vissoep` | 1 |
   | `fine-de-claire-oesters` | 1 |
   | `surimisalade` | 1 |

4. **Jij achter de toonbank** (`achterDeToonbank`, `historieNu`). Voor "Ons
   verhaal", en voor Google: foto's van echte mensen doen het aantoonbaar beter
   dan productplaatjes.
5. **De oude foto's voor de tijdlijn** (`historie1938` tot `historieNu`).
6. De overige producten uit het assortiment.

Vier recepten hebben helemaal geen product om aan te koppelen, omdat **gerookte
paling** en **gestoomde makreel** niet in `assortiment-data.ts` staan terwijl je
ze wel verkoopt (ze staan wél bij de visschaal). Zet ze erbij, dan zijn ook die
vier gedekt.

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
- Blog, recepten en de viswijzer staan alleen in het Nederlands en verwijzen
  daar ook naar. Dezelfde tekst onder drie adressen laten staan levert drie
  pagina's op die elkaar wegdrukken.

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

## 6b. Twee dingen die jij moet nakijken

**De woensdagmarkt.** In `src/lib/bedrijf.ts` staat de woensdagkraam *bij Dille
& Camille*. Op een paar oudere pagina's stond *de Vismarkt aan de Nieuwe Rijn*.
Alles verwijst nu naar de bedrijfsgegevens, dus er staat overal hetzelfde — maar
controleer even of het klopt. Twee verschillende adressen voor dezelfde kraam
kost je in Google precies de koppeling die je wilt hebben; één adres, overal
identiek, is wat telt (ook in je Google Bedrijfsprofiel).

**De verhalen bij de vis op `/biologische-vis`.** Die staan alleen in het
Nederlands, ook op de Engelse en Duitse versie van die pagina. Dat was al zo en
is niet erger geworden, maar het is wel een punt om op te lossen als de Duitse
bezoekers gaan komen. Ze staan bovenin `src/app/[locale]/biologische-vis/page.tsx`
in `ourFish`.

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
- **Vaste prijzen bij verse vis.** Vis gaat op gewicht en op dagprijs. De site
  belooft daarom geen bedrag, maar zegt dat je belt. Richtprijzen die je wél
  wilt tonen kun je kwijt in `src/lib/prijzen.ts`.

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
