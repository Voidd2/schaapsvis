# Overdracht — wat je zelf nog moet invullen

Kort overzicht van wat er klaarstaat en wat er van jou nodig is voordat de site
live kan. Alles staat op één plek per onderwerp, dus je hoeft nergens in de code
te zoeken.

---

## 1. Bedragen die nog voorlopig zijn

### De visschaal — `src/lib/visschaal.ts`

Dit is het bestand dat je het vaakst zult openen.

```ts
export const PRIJZEN_DEFINITIEF = false;   // ← op true zetten als de bedragen kloppen
export const STARTBEDRAG = 42.5;           // ← jouw startbedrag
```

Zolang `PRIJZEN_DEFINITIEF` op `false` staat, zet de site er bij het totaal:
*"Deze bedragen zijn richtprijzen. We bevestigen het definitieve bedrag voordat
we beginnen."* Zo staat er nooit een bedrag op de site waar je aan vastzit.

Daaronder staat `BASISSCHAAL.bevat` (wat er standaard op ligt) en de lijst
`EXTRAS`: elke toevoeging met een eigen prijs. Een toevoeging weghalen of
toevoegen kan gewoon in die lijst; de configurator, het bestelformulier en de
prijsberekening lopen automatisch mee.

Zet je nieuwe toevoegingen erbij, voeg dan ook een vertaling toe onder
`visschaalItems` in `src/messages/nl.json`, `en.json` en `de.json` — met de `id`
als sleutel. Vergeet je dat, dan valt de site terug op de Nederlandse naam; niet
fout, wel jammer voor een Duitse klant.

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

De site staat achter een slot. In Vercel:

```
MAINTENANCE_MODE=off
```

Tot dat gezet is, ziet iedereen de "binnenkort online"-pagina **en weren we alle
zoekmachines** (`robots.txt` staat op disallow). Dat is met opzet: je wilt niet
dat Google de site indexeert terwijl hij nog niet af is.

Zet daarna in Vercel ook de doorverwijzing van `schaapsvishandel.nl` naar
`www.schaapsvishandel.nl` aan, zodat er niet twee versies van de site bestaan.

---

## 5. Foto's

Dit is nu de grootste winst die je nog kunt pakken. Er staan 37 echte
productfoto's op de site; de rest van de producten toont een rustig vlak met de
naam erin. Dat oogt netjes, maar een foto verkoopt beter.

Het meest urgent, op volgorde:

1. **De winkel van buiten en van binnen** — staat nu op de homepage als
   illustratie. Eén goede foto van de toonbank met vis erop doet meer dan alle
   tekst eromheen.
2. **Een visschaal**, zoals je hem echt maakt. Staat op de homepage én op de
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
