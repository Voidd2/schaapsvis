import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { BEDRIJF } from "@/lib/bedrijf";
import { GEMEENTEN } from "@/lib/bezorging";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const p = (pad: string) => `/${locale}${pad}`;

  const jaar = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "var(--navy-dark)", color: "rgba(250,246,239,0.75)" }}>
      {/* ── Nieuwsbrief ──────────────────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid rgba(250,246,239,0.14)" }}>
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-[1fr_auto] gap-6 md:gap-12 md:items-center">
          <div>
            <h2
              className="text-[1.4rem] mb-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
            >
              {t("nieuwsbriefTitel")}
            </h2>
            <p className="text-sm leading-relaxed max-w-lg" style={{ opacity: 0.7 }}>
              {t("nieuwsbriefTekst")}
            </p>
          </div>
          <div className="md:w-[22rem]">
            <NewsletterSignup />
          </div>
        </div>
      </div>

      {/* ── Kolommen ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Adres */}
        <div>
          <h3 className="kapitaal kapitaal-licht mb-4">{t("kopWinkel")}</h3>
          <address className="not-italic text-sm leading-relaxed" style={{ opacity: 0.8 }}>
            <span style={{ color: "var(--cream)", fontWeight: 600 }}>{BEDRIJF.naam}</span>
            <br />
            {BEDRIJF.adres.straat}
            <br />
            {BEDRIJF.adres.postcode} {BEDRIJF.adres.plaats}
            <br />
            <a
              href={`tel:${BEDRIJF.telefoon.e164}`}
              className="hover:text-white transition-colors inline-block mt-2"
            >
              {BEDRIJF.telefoon.weergave}
            </a>
          </address>
          <div className="flex gap-4 mt-4 text-sm" style={{ opacity: 0.65 }}>
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

        {/* Openingstijden */}
        <div>
          <h3 className="kapitaal kapitaal-licht mb-4">{t("kopTijden")}</h3>
          <dl className="text-sm space-y-2" style={{ opacity: 0.8 }}>
            {[
              [t("winkel"), t("winkelTijden")],
              [t("markt"), t("marktTijden")],
              [t("voorschoten"), t("voorschotenTijden")],
            ].map(([wat, wanneer]) => (
              <div key={wat}>
                <dt style={{ color: "var(--cream)", fontWeight: 600 }}>{wat}</dt>
                <dd>{wanneer}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Bezorggebied — ook de weg naar de gemeentepagina's */}
        <div>
          <h3 className="kapitaal kapitaal-licht mb-4">{t("kopBezorgen")}</h3>
          <ul className="text-sm space-y-1.5" style={{ opacity: 0.8 }}>
            {GEMEENTEN.map((g) => (
              <li key={g.slug}>
                <Link
                  href={p(`/bezorgen/${g.slug}`)}
                  className="hover:text-white transition-colors"
                >
                  {t("bezorgenIn", { plaats: g.naam })}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Pagina's */}
        <div>
          <h3 className="kapitaal kapitaal-licht mb-4">{t("kopPaginas")}</h3>
          <ul className="text-sm space-y-1.5" style={{ opacity: 0.8 }}>
            {[
              { href: p("/bestellen"), label: nav("bestellen") },
              { href: p("/visschalen"), label: nav("visschalen") },
              { href: p("/assortiment"), label: nav("assortiment") },
              { href: p("/biologische-vis"), label: nav("betereVis") },
              { href: p("/varlaks"), label: nav("varlaks") },
              { href: p("/viskalender"), label: nav("viswijzer") },
              { href: p("/recepten"), label: nav("recepten") },
              { href: p("/blog"), label: nav("blog") },
              { href: p("/ons-verhaal"), label: nav("verhaal") },
              { href: p("/bezoek-ons"), label: nav("locaties") },
              { href: p("/contact"), label: nav("contact") },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Onderrand ────────────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(250,246,239,0.14)" }}>
        <div
          className="max-w-6xl mx-auto px-4 py-5 text-xs flex flex-wrap gap-x-6 gap-y-2 justify-between"
          style={{ opacity: 0.5 }}
        >
          <span>
            &copy; {jaar} {BEDRIJF.naam} &middot; {BEDRIJF.adres.plaats} &middot;{" "}
            {t("opgericht", { jaar: BEDRIJF.opgericht, oprichter: BEDRIJF.oprichter })}
          </span>
          <span>{t("betalen")}</span>
        </div>
      </div>
    </footer>
  );
}
