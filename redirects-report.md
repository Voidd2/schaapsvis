# Redirect-rapport — oude → nieuwe URL's

Technische-SEO audit voor **Schaap's Vishandel** (https://www.schaapsvishandel.nl).
Doel: de oude (pre-rebuild, vermoedelijk WordPress) URL-structuur achterhalen en 301-redirects
voorstellen naar de nieuwe Next.js path-based i18n routes (`/nl`, `/en`, `/de`), zodat
SEO-autoriteit en backlinks behouden blijven.

Datum onderzoek: 2026-06-16. Status: **research-only** (geen code gewijzigd).

---

## Methode & bronnen

| Bron / tool | Resultaat |
|---|---|
| `WebSearch` (site:, keyword) | **Werkte.** Leverde alleen vermeldingen op externe sites (Too Good To Go, devishandel.nl, lieverinleiden.nl, viswinkelkeuze.nl, Facebook, Instagram), géén oude interne URL's. |
| `WebFetch` huidige `sitemap.xml` | **Werkte.** Volledige lijst van de nieuwe routes opgehaald (zie onder). |
| `WebFetch` `robots.txt` | **Werkte.** Verwijst alleen naar `https://www.schaapsvishandel.nl/sitemap.xml`; `Disallow: /admin`, `/api/`. Geen oude sitemap-referentie. |
| `WebFetch` Wayback `available`-API (`archive.org/wayback/available`) | Werkte, maar gaf **`archived_snapshots: {}`** terug (leeg — deze endpoint is notoir onbetrouwbaar, dus niet conclusief). |
| `WebFetch` Wayback **CDX** API (`web.archive.org/cdx/...`) | **Geblokkeerd** — "Claude Code is unable to fetch from web.archive.org". |
| `WebFetch` Wayback mirror + `timetravel.mementoweb.org` | **Geblokkeerd / onbereikbaar** (503 resp. ECONNREFUSED). |
| `WebFetch` `sitemap_index.xml`, `wp-sitemap.xml` | **404** — bestaan niet (meer). |
| `WebFetch` `wp-login.php`, `/feed/` | **404** — **WordPress draait niet meer**; de site is volledig de nieuwe Next.js-app. Er zijn dus geen live oude URL's meer te scrapen. |
| `WebFetch` live gedrag van losse paden | Zie tabel hieronder — gebruikt om te bepalen welke redirects écht nog ontbreken. |

**Belangrijkste beperking:** de Wayback Machine (de enige betrouwbare bron voor de
exacte 10 jaar oude WordPress-URL's) is **niet bereikbaar** vanuit deze omgeving, en de oude
WordPress-installatie is offline. De onderstaande oude URL's zijn daarom **gebaseerd op
standaard WordPress-conventies + Nederlandse vishandel-naamgeving**, niet op een bevestigde
crawl. Definitieve verificatie moet via **Google Search Console → "Pagina's"-export** (zie laatste sectie).

### Live gedrag huidige site (relevant voor redirects)
| Pad getest | HTTP-status | Betekenis |
|---|---|---|
| `/` | 307 → `/nl` | tijdelijke redirect (zie `vercel.json`) — **zou 301 moeten zijn** |
| `/contact` (zonder locale) | 200 | next-intl serveert NL-content op prefixloos pad (default locale `as-needed`) |
| `/assortiment` (zonder locale) | 200 | idem |
| `/over-ons` | **404** | geen route in welke vorm dan ook → **redirect ontbreekt** |
| `/?page_id=2` | 200 (homepage) | catch-all rendert home; oude WP query-strings worden NIET 301-geredirect |
| `/wp-login.php`, `/feed/`, `/sitemap_index.xml`, `/wp-sitemap.xml` | 404 | WordPress is volledig verdwenen |

**Bestaande redirect-config in de repo:** `vercel.json` bevat enkel
`{ "source": "/", "destination": "/nl", "permanent": false }`. `next.config.ts` heeft
(nog) **géén** `redirects()`-functie. De voorgestelde snippet hieronder is dus volledig additief.

### Nieuwe routes (uit live sitemap.xml — incl. één niet in CLAUDE.md genoemde)
`/nl`, `/nl/assortiment`, `/nl/eerlijke-vis`, `/nl/varlaks`, `/nl/viskalender`, `/nl/blog`,
`/nl/ons-verhaal`, `/nl/bezoek-ons`, `/nl/bestellen`, `/nl/contact`, `/nl/viswinkel-leiden`,
`/nl/frischer-fisch-leiden` (+ identieke `/en/*` en `/de/*` varianten).

> Let op: de opdracht noemde `/nl/biologische-vis` (was `/nl/eerlijke-vis`). De **live sitemap
> gebruikt nog `/nl/eerlijke-vis`** — `biologische-vis` bestaat (nog) niet online. Mappings
> hieronder wijzen daarom naar `/nl/eerlijke-vis`; pas aan zodra de slug daadwerkelijk hernoemd is.

---

## Gevonden oude URL's

Er zijn **geen oude interne URL's hard bevestigd** (Wayback geblokkeerd, WP offline, Google
toont geen oude paden meer in de index). Onderstaande paden zijn **kandidaten** op basis van
standaard WordPress + branche-conventies, niet op bewijs uit een archief.

| Oud pad (kandidaat) | Bron | Bewijs / onderbouwing |
|---|---|---|
| `/` | live | Bevestigd actief; nu 307→`/nl`. |
| `/over-ons` | conventie | Standaard NL "about"-slug; geeft nu 404 → redirect nodig. |
| `/contact` | conventie | Universele WP contactpagina-slug. |
| `/assortiment` | conventie + extern | Vishandel-standaard; term komt terug op externe vermeldingen. |
| `/producten` of `/product` | conventie | Alternatief voor assortiment (WooCommerce-achtig). |
| `/winkel` of `/shop` | conventie | WooCommerce default `/shop`; NL `/winkel`. |
| `/openingstijden` | conventie + extern | Externe sites benadrukken openingstijden; veelvoorkomende losse WP-pagina. |
| `/bestellen` of `/afhalen` | conventie | Afhaal/bestel-pagina. |
| `/nieuws` of `/blog` | conventie | WP-nieuws/blog sectie. |
| `/recepten` | conventie | Vishandels publiceren vaak recepten. |
| `/home` | conventie | Soms expliciete WP-homepagina-slug. |
| `/index.php` | WP-conventie | Oude permalink-fallback. |
| `/?page_id=N` | WP-conventie | Default WP zonder pretty permalinks; rendert nu (verkeerd) als homepage. |
| `/?p=N` | WP-conventie | Default WP post-permalink. |
| `/wp-content/uploads/...` | WP-conventie | Oude media-URL's (afbeeldingen) — kunnen externe backlinks/embeds hebben. |

---

## Voorgestelde 301-mapping

Confidence = inschatting dat het oude pad (a) echt bestond én (b) naar de juiste nieuwe
pagina wijst. Alles is "needs verification via Search Console / Wayback".

| Oud pad | Nieuw pad | Confidence |
|---|---|---|
| `/` | `/nl` | **high** (bestaat live; verander 307→301) |
| `/over-ons` | `/nl/ons-verhaal` | medium |
| `/over_ons` | `/nl/ons-verhaal` | low |
| `/onze-geschiedenis` | `/nl/ons-verhaal` | low |
| `/contact` | `/nl/contact` | medium |
| `/contactgegevens` | `/nl/contact` | low |
| `/assortiment` | `/nl/assortiment` | medium |
| `/producten` | `/nl/assortiment` | medium |
| `/product` | `/nl/assortiment` | low |
| `/winkel` | `/nl/assortiment` | low |
| `/shop` | `/nl/assortiment` | low |
| `/openingstijden` | `/nl/bezoek-ons` | medium |
| `/locatie` | `/nl/bezoek-ons` | low |
| `/route` | `/nl/bezoek-ons` | low |
| `/adres` | `/nl/bezoek-ons` | low |
| `/bestellen` | `/nl/bestellen` | medium |
| `/afhalen` | `/nl/bestellen` | low |
| `/online-bestellen` | `/nl/bestellen` | low |
| `/nieuws` | `/nl/blog` | medium |
| `/blog` | `/nl/blog` | medium |
| `/recepten` | `/nl/blog` | low (geen recepten-route meer; blog is dichtstbij) |
| `/zalm` | `/nl/varlaks` | low |
| `/varlaks` | `/nl/varlaks` | low |
| `/duurzame-vis` | `/nl/eerlijke-vis` | low |
| `/home` | `/nl` | medium |
| `/index.php` | `/nl` | low |

> Bewust **weggelaten** uit het kant-en-klare snippet: `/?page_id=N` / `/?p=N`
> (query-string redirects kunnen niet betrouwbaar in `next.config.ts` `redirects()` op alleen
> een `source`-pad — die vereisen `has: [{ type: 'query', key: 'page_id' }]` met de exacte
> numerieke waarden, en die nummers kennen we niet zonder de Search-Console-export). Idem
> `/wp-content/uploads/*` (media — pas mappen als je 404's op afbeeldingen ziet in GSC).

---

## Next.config.js redirects() snippet

Kant-en-klaar voor de HIGH/MEDIUM-confidence mappings. Plak de `async redirects()` in
`next.config.ts` (of voeg de objecten toe aan `vercel.json` → `redirects`). `permanent: true`
= 308/301. **Verifieer eerst tegen de Search-Console "Pagina's"-export** voordat je dit live zet.

```js
// In next.config.ts, binnen het nextConfig-object:
async redirects() {
  return [
    // Homepage: zet de bestaande tijdelijke (307) om naar permanent.
    { source: "/", destination: "/nl", permanent: true },

    // Over / verhaal
    { source: "/over-ons", destination: "/nl/ons-verhaal", permanent: true },
    { source: "/home", destination: "/nl", permanent: true },

    // Contact
    { source: "/contact", destination: "/nl/contact", permanent: true },

    // Assortiment / producten
    { source: "/assortiment", destination: "/nl/assortiment", permanent: true },
    { source: "/producten", destination: "/nl/assortiment", permanent: true },

    // Bezoek / openingstijden
    { source: "/openingstijden", destination: "/nl/bezoek-ons", permanent: true },

    // Bestellen
    { source: "/bestellen", destination: "/nl/bestellen", permanent: true },

    // Nieuws / blog
    { source: "/nieuws", destination: "/nl/blog", permanent: true },
    { source: "/blog", destination: "/nl/blog", permanent: true },
  ];
},
```

> Let op 1: `source: "/contact"`, `/assortiment` en `/blog` geven nu al **HTTP 200** (next-intl
> serveert de NL-content op het prefixloze pad). Een 301 hierheen forceert de canonical naar de
> `/nl/`-variant — meestal SEO-wenselijk, maar controleer dat dit niet botst met de gewenste
> canonical/hreflang-opzet. Wil je dat liever niet, laat die drie dan weg.
>
> Let op 2: Volgens AGENTS.md kan deze Next.js-versie afwijkende API's hebben — controleer
> `node_modules/next/dist/docs/` of `redirects()` nog de juiste signatuur is vóór implementatie.

---

## Openstaand voor Lucas

1. **Definitieve lijst hoort uit Google Search Console.** Open Search Console voor
   `schaapsvishandel.nl` → **Indexering → Pagina's** (en/of het oude **Sitemaps**-rapport en
   **Prestaties → Pagina's** van vóór de rebuild) en exporteer alle bekende oude URL's. Niet
   alle oude paden zijn via Wayback of Google-zoeken te ontdekken; GSC kent de werkelijk
   geïndexeerde URL's met hun klikgeschiedenis — dát is de bron van waarheid.
2. **Wayback hier geblokkeerd.** Draai zelf in een browser:
   `https://web.archive.org/web/*/schaapsvishandel.nl/*` (toont alle gearchiveerde paden) en
   `http://web.archive.org/cdx/search/cdx?url=schaapsvishandel.nl*&output=text&fl=original&collapse=urlkey`.
   Vul de tabel "Gevonden oude URL's" aan met wat daar staat en verhoog de confidence.
3. **Query-string redirects (`?page_id=`, `?p=`).** Nu rendert `/?page_id=2` (verkeerd) de
   homepage met status 200. Zodra je de echte oude page-IDs uit Wayback/GSC hebt, voeg
   redirects toe met `has: [{ type: "query", key: "page_id", value: "2" }]` → juiste nieuwe URL.
4. **Oude media (`/wp-content/uploads/...`).** Check in GSC op 404's; externe sites kunnen nog
   naar oude afbeeldings-URL's linken.
5. **`vercel.json` vs `next.config.ts`.** Kies één plek voor redirects om dubbele/conflicterende
   regels te voorkomen. De huidige `vercel.json`-regel `/ → /nl` staat op `permanent: false`
   (307) — zet die op `true` (301) of vervang door de `next.config.ts`-variant hierboven.
6. **`eerlijke-vis` vs `biologische-vis`.** De opdracht ging uit van een hernoemde slug
   `/nl/biologische-vis`, maar de live sitemap gebruikt nog `/nl/eerlijke-vis`. Stem af welke
   canoniek is en pas de redirect-bestemmingen daarop aan.
