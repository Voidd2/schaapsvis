import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { BEDRIJF } from "@/lib/bedrijf";
import { GEMEENTEN } from "@/lib/bezorging";

/**
 * De footer.
 *
 * Kort gehouden. Hij besloeg eerst een half scherm: een nieuwsbriefblok over de
 * volle breedte, daaronder vier kolommen met elf links, en daaronder nog een
 * balk. Wie zover scrollt zoekt het adres, de tijden of één pagina — niet een
 * tweede navigatie. Nu: drie kolommen, één regel links, klaar.
 *
 * De gemeentelinks blijven staan. Die zijn geen sier: ze zijn de interne weg
 * naar /bezorgen/wassenaar en dergelijke, en dat is precies waarop gezocht wordt.
 */
export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const p = (pad: string) => `/${locale}${pad}`;

  const jaar = new Date().getFullYear();

  const links = [
    { href: p("/bestellen"), label: nav("bestellen") },
    { href: p("/visschalen"), label: nav("visschalen") },
    { href: p("/assortiment"), label: nav("assortiment") },
    { href: p("/biologische-vis"), label: nav("betereVis") },
    { href: p("/varlaks"), label: nav("varlaks") },
    // De viswijzer, de recepten en de blog bestaan alleen in het Nederlands,
    // dus verwijzen we daar rechtstreeks naartoe in plaats van naar een /en/-
    // of /de/-adres met Nederlandse tekst erop.
    { href: "/nl/viskalender", label: nav("viswijzer") },
    { href: "/nl/recepten", label: nav("recepten") },
    { href: "/nl/blog", label: nav("blog") },
    { href: p("/ons-verhaal"), label: nav("verhaal") },
    { href: p("/bezoek-ons"), label: nav("locaties") },
    { href: p("/contact"), label: nav("contact") },
    ...GEMEENTEN.map((g) => ({
      href: p(`/bezorgen/${g.slug}`),
      label: t("bezorgenIn", { plaats: g.naam }),
    })),
  ];

  return (
    <footer style={{ backgroundColor: "var(--navy-dark)", color: "rgba(250,246,239,0.75)" }}>
      <div className="max-w-6xl mx-auto px-4 py-9 grid gap-8 md:grid-cols-[1.1fr_1fr] lg:grid-cols-[1fr_1fr_20rem]">
        {/* ── Waar we zijn ──────────────────────────────────────────────── */}
        <div>
          <address className="not-italic text-sm leading-relaxed" style={{ opacity: 0.85 }}>
            <span style={{ color: "var(--cream)", fontWeight: 600 }}>{BEDRIJF.naam}</span>
            <br />
            {BEDRIJF.adres.straat}, {BEDRIJF.adres.postcode} {BEDRIJF.adres.plaats}
            <br />
            <a href={`tel:${BEDRIJF.telefoon.e164}`} className="hover:text-white transition-colors">
              {BEDRIJF.telefoon.weergave}
            </a>
          </address>
          <div className="flex gap-4 mt-3 text-sm" style={{ opacity: 0.65 }}>
            <a
              href={BEDRIJF.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline underline-offset-4"
            >
              Facebook
            </a>
            <a
              href={BEDRIJF.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline underline-offset-4"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* ── Wanneer we er zijn ────────────────────────────────────────── */}
        <dl className="text-sm space-y-1" style={{ opacity: 0.85 }}>
          {[
            [t("winkel"), t("winkelTijden")],
            [t("markt"), t("marktTijden")],
            [t("voorschoten"), t("voorschotenTijden")],
          ].map(([wat, wanneer]) => (
            <div key={wat} className="flex flex-wrap gap-x-2">
              <dt style={{ color: "var(--cream)", fontWeight: 600 }}>{wat}</dt>
              <dd>{wanneer}</dd>
            </div>
          ))}
        </dl>

        {/* ── Nieuwsbrief ───────────────────────────────────────────────── */}
        <div>
          <p className="kapitaal kapitaal-licht mb-2">{t("nieuwsbriefTitel")}</p>
          <NewsletterSignup compact />
        </div>
      </div>

      {/* ── Alle pagina's op één regel ────────────────────────────────────── */}
      <nav
        aria-label={t("kopPaginas")}
        style={{ borderTop: "1px solid rgba(250,246,239,0.14)" }}
      >
        <ul
          className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.8rem]"
          style={{ opacity: 0.7 }}
        >
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="hover:text-white transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Onderrand ────────────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(250,246,239,0.14)" }}>
        <div
          className="max-w-6xl mx-auto px-4 py-4 text-xs flex flex-wrap gap-x-6 gap-y-2 justify-between"
          style={{ opacity: 0.5 }}
        >
          <span>
            &copy; {jaar} {BEDRIJF.naam} &middot;{" "}
            {t("opgericht", { jaar: BEDRIJF.opgericht, oprichter: BEDRIJF.oprichter })}
          </span>
          <span>{t("betalen")}</span>
        </div>
      </div>
    </footer>
  );
}
