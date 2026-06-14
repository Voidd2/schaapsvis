@AGENTS.md

# Schaap's Vis — Project Briefing voor Claude

## Wat is dit project?
Website voor **Schaap's Vishandel**, een fysieke viswinkel in Leiden (Herenstraat 48). Opgericht in 1938, nu vierde generatie. Doel van de site: SEO-klanten trekken, online afhaalbestellingen verwerken, en e-mailadressen verzamelen via nieuwsbrief.

**Eigenaar:** Aldert Haasnoot ("Schaap")
**Contactnummer:** 071 514 9802 / +31715149802
**GitHub repo:** voidd2/schaapsvis
**Werkbranch:** `claude/schaaps-vis-website-seo-AGG5T`

---

## Tech stack
- **Next.js 16** (App Router) — `params` is altijd `Promise<{locale, slug}>`, gebruik `await params`
- **next-intl v4** — `useTranslations`, `useLocale` werken server-side; vertalingen in `src/messages/{nl,en,de}.json`
- **Tailwind CSS v4** — `@import "tailwindcss"` (geen config file nodig)
- **CSS custom properties** — gebruik ALTIJD `var(--navy)` etc., nooit hardcoded hex
- **Build commando:** `npm run build -- --webpack` (geen Turbopack op dit platform)
- **Formspree** voor formulieren — placeholder `JOUW_FORMSPREE_ID` (eigenaar vult zelf in)

### Kleurpalet (logo-kleuren)
```css
--navy: #1d2472        /* primair blauw */
--navy-dark: #14194f
--cream: #f7fbfe
--sand: #d4e8f5
--lichtblauw: #a8d8f0
--salmon: #c0392b      /* CTA-rood */
--gold: #b8832e
--charcoal: #252a3a
--seafoam: #2e8b6e
```

---

## Bestandsstructuur (belangrijk)
```
src/
  app/
    [locale]/
      page.tsx              ← homepage (HeroSection, AanbiedingSection, etc.)
      assortiment/page.tsx  ← productgrid met EU-allergeneninformatie
      bestellen/
        page.tsx            ← wraps BestellenForm in Suspense
        BestellenForm.tsx   ← client component, Formspree, verrassingspakket
      blog/
        page.tsx            ← blogoverzicht
        [slug]/page.tsx     ← blogdetail met Article JSON-LD
      eerlijke-vis/page.tsx ← herkomstverhalen per product
      recepten/
        ReceptenClient.tsx  ← client zoekfilter
        [slug]/page.tsx     ← recept detail met Recipe JSON-LD
      varlaks/page.tsx      ← premium zalm pagina
      ons-verhaal/page.tsx  ← tijdlijn 1938-heden
      bezoek-ons/page.tsx   ← locaties + openingstijden
      contact/page.tsx
      layout.tsx            ← bevat WhatsAppButton
    globals.css             ← kleurpalet + fonts
    sitemap.ts              ← inclusief blog + recepten
  components/
    layout/
      Header.tsx            ← navigatie (nl/en/de switcher)
      Footer.tsx            ← nieuwsbrief + links
    shared/
      NewsletterSignup.tsx  ← client component, compact prop
      WhatsAppButton.tsx    ← floating groen WhatsApp knop
    JsonLd.tsx              ← LocalBusiness schema.org
  lib/
    blog.ts                 ← 8 blogartikelen (BlogPost type)
    recepten.ts             ← merge origineel + praktisch
    recepten-praktisch.ts   ← 25 eigen recepten
    products.ts             ← CATALOG (bestelformulier zoekfunctie)
  messages/
    nl.json / en.json / de.json
```

---

## Wat al gedaan is
- Kleurpalet naar logo-blauw (#1d2472)
- Blog pagina + 8 artikelen met Article JSON-LD
- 25 praktische recepten (1112 gescrapete recepten verwijderd)
- Verrassingspakket (5,99 euro, max 2/dag) op homepage + bestelformulier
- Nieuwsbrief: footer + prominente homepage sectie (salmon) + bestelformulier opt-in
- WhatsApp floating button op alle pagina's
- Aanbieding van de week banner op homepage
- EU-allergeneninformatie per assortiment-product (uitklapbaar, VIS/GLUTEN/MELK/EIEREN/MOSTERD/SELDERIJ/SCHAALDIEREN/WEEKDIEREN)
- "Bestel dit" knoppen per product op assortiment
- Google Reviews badge (4.8 sterren) op homepage
- Nep-reviews + aggregateRating verwijderd (SEO-risico)
- Sitemap uitgebreid (blog + recepten detail-URLs)
- Recipe + Article JSON-LD schema
- 301 permanentRedirect voor onbekende slugs

---

## Wat nog gedaan kan worden
- Formspree-ID invullen (zoek op JOUW_FORMSPREE_ID) — eigenaar maakt gratis account op formspree.io
- Echte productfoto's: lekkerbek, broodje haring, vissoep, vispotje, feestschotel
- Weekaanbieding updaten (in src/app/[locale]/page.tsx, zoek "Hollandse garnalen")
- Google Search Console koppelen (verificatiecode in layout.tsx, verification.google)
- Prijzen toevoegen (nu: "wij bellen terug met prijs")
- Instagram feed integreren (Facebook: facebook.com/schaapsvishandel)
- Meer blogartikelen (lib/blog.ts, type BlogPost)
- Meer recepten (lib/recepten-praktisch.ts, type Recept)
- Haringparty / feestcatering pagina (zoals concurrent Dirks Vishandel)
- Klantenreviews systeem (bijv. Google Reviews embed of Trustpilot)

---

## Veelgemaakte fouten — voorkom ze
1. `params` altijd awaiten: `const { locale } = await params;`
2. Nooit `"use client"` op pagina-niveau — gebruik aparte client sub-components
3. `useSearchParams` altijd in Suspense — zie bestellen/page.tsx
4. Kleuren altijd via CSS vars: `style={{ color: "var(--navy)" }}`
5. Build: `npm run build -- --webpack` (niet zonder --webpack)
6. Nieuwe pagina's ook toevoegen aan src/app/sitemap.ts
7. Vertalingen voor nieuwe teksten toevoegen aan alle drie messages-bestanden

---

## Concurrentiecontext
- **Hartevelt** (vishandelklaashartevelt.nl): webshop met prijzen, gratis bezorging boven 75 euro, 4.9 ster op Google (92 reviews), WhatsApp
- **Dirks** (dirksvishandel.nl): sushi workshops, haringparty, weekaanbiedingen, 9.5 ster (370 reviews)
- **Onderscheidend voor Schaapsvis**: 4 generaties verhaal (1938), Varlaks biologische zalm, Eerlijke Vis pagina, blog

---

## Git workflow
```bash
# Altijd op deze branch werken:
git checkout claude/schaaps-vis-website-seo-AGG5T

# Bouwen (verplicht --webpack):
npm run build -- --webpack

# Committen en pushen:
git add -A
git commit -m "beschrijving van de wijziging"
git push -u origin claude/schaaps-vis-website-seo-AGG5T
```
