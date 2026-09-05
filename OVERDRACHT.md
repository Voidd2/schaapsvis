# Overdracht — wat je zelf nog moet invullen

Kort overzicht van wat er klaarstaat en wat er van jou nodig is voordat de site
live kan. Alles staat op één plek per onderwerp, dus je hoeft nergens in de code
te zoeken.

---

## 1. Bedragen die nog voorlopig zijn

### De visschaal — `src/lib/visschaal.ts`

Dit is het bestand dat je het vaakst zult openen.

Er is **geen startbedrag en geen vast pakket** meer. De klant kiest zelf wat er
op de schaal komt en hoeveel, **per 100 gram**. Alle prijzen staan in de lijst
`ONDERDELEN`, in euro per 100 gram:

```ts
{ id: "gerookte-zalm", naam: "Gerookte zalm", prijs: 3.25, groep: "gerookt" }
```

Een paar dingen verkoop je niet op gewicht — een oester is een oester. Die
krijgen `perStuk` mee (`"dozijn"`, `"halve kreeft"`), en dan is `prijs` de prijs
per stuk.

```ts
export const PRIJZEN_DEFINITIEF = false;  // ← op true als de bedragen kloppen
export const MINIMUM_BEDRAG = 25;         // ← daaronder is het geen schaal
```

Zolang `PRIJZEN_DEFINITIEF` op `false` staat zegt de site erbij dat het
richtprijzen zijn en dat je het definitieve bedrag bevestigt.

**Waar de prijzen vandaan komen.** Uitgangspunt was: overal iets onder de markt
zitten. Wat andere vishandels rekenen (opgehaald september 2026, staat ook
bovenaan in het bestand):

| Per 100 gram | Concurrentie | Wij |
|---|---|---|
| Gerookte zalm | € 3,50 – € 6,75 | **€ 3,25** |
| Hollandse garnalen | € 4,50 – € 6,49 | **€ 4,25** |
| Gerookte paling | € 5,50 – € 10,50 | **€ 4,95** |
| Gerookte makreelfilet | € 2,75 – € 5,50 | **€ 2,50** |

En complete schotels per persoon: Puurvis in Leidschendam € 14,50 (die zit ín
je bezorggebied), Fieret € 19,95 tot € 33,95, Koelewijn € 28,50 tot € 30.

Daarom rekent de configurator ook uit wat de schaal per persoon kost, en zet
hij er zwart-op-wit bij dat de klant onder die € 14,50 uitkomt. Verhoog je een
prijs, controleer dan even of dat nog klopt — `MARKT.goedkoopstePerPersoon`
bovenin het bestand is het bedrag waarmee vergeleken wordt.

Zet je een nieuw onderdeel in de lijst, voeg dan ook een vertaling toe onder
`visschaalItems` in `src/messages/nl.json`, `en.json` en `de.json` — met de `id`
als sleutel. Vergeet je dat, dan valt de site terug op het Nederlands.

### Bezorgkosten — `src/lib/bezorging.ts`

```ts
minimumBedrag: 25,        // minimale bestelling
standaardKosten: 5.95,    // standaardtarief
gratisVanaf: 60,          // vanaf dit bedrag gratis
bezorgdagen: [3, 4, 5, 6] // 0 = zondag … 6 = zaterdag
uitersteBesteltijd: "12:00"
```

Per gemeente kun je een afwijkend tarief zetten (`kosten:` bij Leiden, Wassenaar
en Leidschendam staat dat al). Wijzig je hier iets, dan verandert het meteen op
de bezorgpagina's, in het bestelformulier, in de postcodecheck én in de
gegevens die Google uitleest.

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

## 4. Live gaan

De site is gewoon zichtbaar zodra hij is uitgerold — daar hoef je niets voor te
doen. Wil je hem tijdelijk achter het "binnenkort online"-scherm zetten
(verbouwing, vakantie, of even niets kunnen leveren), zet dan in Vercel:

```
MAINTENANCE_MODE=on
```

Weghalen of op iets anders zetten maakt hem weer zichtbaar. Dit stond eerder
andersom — het slot zat er standaard op — waardoor een deploy zonder de juiste
variabele voor iedereen, jou incluis, de "binnenkort"-pagina liet zien.

Preview-adressen (de voorbeeld-URL's die Vercel per wijziging maakt) worden
nooit door Google opgepakt: die geven altijd `Disallow: /`. Alleen de echte
site mag geïndexeerd worden. Controleer dat na de eerste keer even op
`/robots.txt`: daar hoort `Allow: /` te staan.

**Vóór je het domein `schaapsvishandel.nl` eraan hangt**: zet
`BESTELLING_WEBHOOK_URL` (zie punt 3). Zonder die variabele neemt de site geen
bestellingen aan — de klant krijgt dan je telefoonnummer te zien in plaats van
een bevestiging. Dat is met opzet: een bestelling die stilletjes verdwijnt is
erger dan een formulier dat eerlijk zegt dat het nog niet aanstaat.

Zet in Vercel ook de doorverwijzing van `schaapsvishandel.nl` naar
`www.schaapsvishandel.nl` aan, zodat er niet twee versies van de site bestaan.

---

## 5. Foto's

Dit is nu de grootste winst die je nog kunt pakken. Er staan 37 echte
productfoto's op de site; bij de rest staat alleen de naam en de omschrijving.
Dat leest netjes, maar een foto verkoopt beter.

De tekenfilm-illustraties (`public/images/scene-*.svg`) staan nergens meer op
een pagina. Ze zagen eruit als een sjabloon en dat is precies wat we niet
willen. Ze staan nog wel bij de blogartikelen (`src/lib/blog.ts`); vervang die
door echte foto's zodra je ze hebt, dan kan de map weg.

Het meest urgent, op volgorde:

1. **De winkel van buiten en van binnen.** Eén goede foto van de toonbank met
   vis erop doet meer dan alle tekst eromheen.
2. **Een visschaal**, zoals je hem echt maakt. Die hoort op de homepage én op de
   visschaalpagina.
3. **Jij achter de toonbank.** Voor de pagina "Ons verhaal", en voor Google:
   foto's van echte mensen doen het aantoonbaar beter dan productplaatjes.
4. De ontbrekende producten uit het assortiment.

Formaat: liggend, minstens 1200 pixels breed, gewoon met de telefoon is prima.
Zet ze in `public/images/` en verwijs ernaar in `src/lib/assortiment-data.ts`
(`photo:`) of rechtstreeks in de pagina.

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
| Kleuren en lettertypen | `src/app/globals.css` |

Bouwen doe je met `npm run build -- --webpack`.
