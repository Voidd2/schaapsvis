import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import assortmentDecisions from "./src/lib/assortiment-besluiten.json";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Alle afbeeldingen worden lokaal in /public geserveerd — geen externe
  // remotePatterns meer (geen hotlinks naar concurrenten of stockfoto's).
  async redirects() {
    return [
      // Only aliases/recipes with a real replacement redirect. Other removed
      // products return a genuine 404 and are excluded from the sitemap.
      ...["nl", "en", "de"].flatMap(locale => Object.entries(assortmentDecisions.aliases).map(([slug,destination]) => ({
        source: `/${locale}/assortiment/${slug}`, destination: `/${locale}${destination}`, permanent: true,
      }))),
      ...["nl", "en", "de"].map((locale) => ({
        source: `/${locale}/assortiment/koolvis`,
        destination: `/${locale}/assortiment`,
        permanent: true,
      })),
      ...["nl", "en", "de"].map((locale) => ({
        source: `/${locale}/recepten/kibbeling-knoflooksaus-salade`,
        destination: `/${locale}/recepten/kibbeling-ravigotesaus-salade`,
        permanent: true,
      })),
      // Vervallen haringgerechten verwijzen naar het klassieke broodje haring.
      ...["nl", "en", "de"].flatMap((locale) =>
        ["haring-salade", "krieltjessalade-haring", "hollandse-bowl"].map((slug) => ({
          source: `/${locale}/recepten/${slug}`,
          destination: `/${locale}/recepten/broodje-haring-uitjes`,
          permanent: true,
        })),
      ),
      // Algemene bezorgpagina's zijn vervallen: alleen visschalen zijn online te bestellen.
      ...["nl", "en", "de"].map((locale) => ({
        source: `/${locale}/bezorgen/:pad*`,
        destination: `/${locale}/visschalen`,
        permanent: true,
      })),
      { source: "/bezorgen/:pad*", destination: "/nl/visschalen", permanent: true },
      // ── "Eerlijke Vis" is geherpositioneerd naar "Biologische Vis" ──
      { source: "/nl/eerlijke-vis", destination: "/nl/biologische-vis", permanent: true },
      { source: "/en/eerlijke-vis", destination: "/en/biologische-vis", permanent: true },
      { source: "/de/eerlijke-vis", destination: "/de/biologische-vis", permanent: true },
      { source: "/eerlijke-vis", destination: "/nl/biologische-vis", permanent: true },

      // ── Oude (pre-rebuild) URL's → nieuwe structuur ──
      // Definitieve lijst: exporteer "Pagina's" uit Google Search Console.
      { source: "/over-ons", destination: "/nl/ons-verhaal", permanent: true },
      { source: "/over", destination: "/nl/ons-verhaal", permanent: true },
      { source: "/producten", destination: "/nl/assortiment", permanent: true },
      { source: "/openingstijden", destination: "/nl/bezoek-ons", permanent: true },
      { source: "/winkel", destination: "/nl/bezoek-ons", permanent: true },
      { source: "/locatie", destination: "/nl/bezoek-ons", permanent: true },
      { source: "/nieuws", destination: "/nl/blog", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
