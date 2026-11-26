# Lokale SEO — 26 november 2026

## Uitgangspunt

Search Console, Web, Nederland, 28 oktober t/m 24 november 2026:

| Zoekterm | Klikken | Vertoningen | Gemiddelde positie |
|---|---:|---:|---:|
| viswinkel leiden | 6 | 199 | 2,6 |
| visboer voorschoten | 0 | 13 | 8,9 |

De homepage draagt de meeste Leidse resultaten. De locatiepagina Leiden had slechts 5 vertoningen en positie 22,2. Behoud de homepage en versterk de locatiepagina met relevante links. Voorschoten vertoont zowel de kale URL als /nl/viswinkel-voorschoten. Paginarijen zijn niet optelbaar tot het zoektermtotaal.

## Website

- Publieke GET/HEAD-adressen `/`, `/viswinkel-leiden`, `/viswinkel-voorschoten` en `/marktkraam-leiden`: 308 naar hun bestaande Nederlandse bestemming. Queryparameters blijven behouden. De slotcontrole staat ervoor; seizoensredirects, account/API-routes blijven ongewijzigd.
- Assortiment en reguliere productpagina's: directe locatielinks bij bezoek/advies, in NL/EN/DE. Geen claim over permanente productvoorraad.
- Bestaande artikelen en VÅRLAKS-pagina hebben al relevante locatielinks; geen opvulartikelen toegevoegd.
- Google-score Leiden bijgewerkt van 4,6 / 116 naar 4,7 / 123. Individuele reviewcitaten blijven ongewijzigd.
- Exacte zichtbare teksten: `tekstwijzigingen.md`.

## Google Bedrijfsprofielen

Beide profielen zijn geverifieerd. Gecontroleerd via het beheerscherm; geen onnodige wijziging van naam of categorie.

| | Leiden | Voorschoten |
|---|---|---|
| Naam | Schaap’s Vishandel | Schaaps Vis voorschoten |
| Primaire categorie | Viswinkel | Viswinkel |
| Adres | Herenstraat 48, 2313 AL Leiden | Veurseweg 18, 2252 AA Voorschoten |
| Website | /nl/viswinkel-leiden | /nl/viswinkel-voorschoten |
| Uren | di–vr 09:00–18:00, za 09:00–17:00 | vr 08:30–17:30 |
| Reviews | 4,7 / 123 | Nog geen reviews getoond |

Reviewlinks door Google zelf geleverd:
- Leiden: https://g.page/r/CfVTJeXmSzYLEBM/review
- Voorschoten: https://g.page/r/CcOyV0R2CLF4EBM/review

Printbare QR-kaarten staan buiten de website bij het bewijsrapport. Vraag klanten van de betreffende locatie om hun eigen ervaring, zonder beloning of selectie op tevredenheid. Niets naar klanten verstuurd. Feestdaguren niet ingevuld zonder bevestigde opening.

## Lokale vermeldingen: voorbereide acties

1. **Winkelen Leiden**: adres correct, linkt Facebook maar geen zichtbare websiteknop. Vraag link naar /nl/viswinkel-leiden en vervang 'dagelijks' door werkelijke openingsdagen. Beide vaste nummers werken volgens Lucas; 071 514 9802 is niet als fout aangemerkt. https://www.winkelenleiden.nl/winkels-overzicht/34/vishandel-schaap-leiden
2. **Liever in Leiden**: bestaande websitevermelding behouden. Zoekbron toont dinsdag 11:00–18:00; eigen site en Google geven 09:00–18:00. Laat beheerder dinsdaguren controleren/bijwerken. https://lieverinleiden.nl/ondernemers/schaaps-vishandel/
3. **Hoogvliet Voorschoten**: vraag de bestaande locatiepartner of de vrijdagkraam op de winkelpagina of lokale informatiepagina kan worden genoemd met link /nl/viswinkel-voorschoten. Kans, geen toegezegde plaatsing. Hoogvliet bevestigt Veurseweg 18, 2252 AA. https://hoogvliet.nl/winkels/voorschoten
4. **Viswinkels.info / MapQuest**: Google toont Zuiderzichtlaan 6. Eerst nagaan of dit een administratieadres is; klanten moeten de vrijdagkraam aan Veurseweg 18 kunnen vinden. Niet blind als verhuisd of gesloten markeren. https://www.viswinkels.info/voorschoten/schaap-s-vis en https://www.mapquest.com/nl/zuid-holland/schaaps-vis-807592526
5. **Visboeren.nl**: aparte Voorschotense vermelding aan Veurseweg 18 bestaat al; controleren/verrijken, geen duplicaat aanmaken. https://visboeren.nl/vishandel/schaaps-vis-voorschoten-voorschoten/

Externe correcties en links zijn voorbereid, niet verzonden/geplaatst. Beheerders beslissen over plaatsing. Geen betaalde linkpakketten of willekeurige gidsen aanmelden.

## Meting en rollback

Vergelijk perioden van 28 dagen, per zoekterm én per pagina. Houd organische zoekresultaten en lokale Maps-resultaten apart. Twee dagen en 13 vertoningen zijn onvoldoende voor een betrouwbare conclusie. Nieuwe meting over circa vier weken; geen automatische taak aangemaakt.

Uitgangscommit `40d89fdf5d77e044be6e8dbb2321484429cad339`. Branch `codex/lokale-seo-26-nov`. Revert de bijbehorende merge/commit via GitHub, controleer beide Cloudflare-deploys en live routes. Permanente redirects kunnen nog gecachet zijn. Niet terugdraaien uitsluitend op een paar dagen positieruis.

Bron permanente redirects: https://developers.google.com/search/docs/crawling-indexing/301-redirects

Bron lokale rankingfactoren: https://support.google.com/business/answer/7091?hl=nl
