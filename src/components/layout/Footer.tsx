import { publicLink } from "@/lib/seasonal-availability";
import { discountSignupCopy } from "@/lib/discount-signup";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { AnalyticsConsent } from "@/components/shared/AnalyticsConsent";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { ADRES_REGEL, BEDRIJF } from "@/lib/bedrijf";
import { BEELD } from "@/lib/beeld";
import { ShopHours } from "@/components/shared/ShopHours";
import { FooterPanel } from "./FooterPanel";
import styles from "./footer.module.css";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const shared = useTranslations("gedeeld");
  const locale = useLocale();
  const p = (pad: string) => `/${locale}${pad}`;
  const jaar = new Date().getFullYear();
  const cityGuideUrl = process.env.CITYGUIDE_URL?.replace(/\/$/, "");
  const cityGuideCopy = {
    nl: "Ontdek Schaap's Vis in de wandelroute langs de Leidse markt",
    en: "Find Schaap's Vis on the Leiden market walking route",
    de: "Schaap's Vis auf der Leidener Marktroute entdecken",
  }[locale] ?? "Ontdek Schaap's Vis in de wandelroute langs de Leidse markt";

  const groepen = [
    {
      kop: nav("assortiment"),
      links: [
        { href: p("/feestdagen"), label: locale === "de" ? "Festtage 2026" : locale === "en" ? "Festive season 2026" : "Feestdagen 2026" },
        { href: p("/relatiegeschenken"), label: locale === "de" ? "Firmengeschenke" : locale === "en" ? "Business gifts" : "Relatiegeschenken" },
        { href: p("/visschalen"), label: nav("visschalen") },
        { href: p("/assortiment"), label: nav("assortiment") },
        { href: p("/aanbiedingen"), label: discountSignupCopy(locale).title },
      ],
    },
    {
      kop: nav("verhaal"),
      links: [
        { href: p("/ons-verhaal"), label: nav("verhaal") },
        { href: p("/biologische-vis"), label: nav("betereVis") },
        { href: p("/studentenkorting"), label: locale === "de" ? "Studentenrabatt" : locale === "en" ? "Student discount" : "Studentenkorting" },
        { href: p("/account"), label: locale === "de" ? "Studentenkonto" : locale === "en" ? "Student account" : "Studentenaccount" },
        { href: p("/recepten"), label: nav("recepten") },
        { href: p("/blog"), label: nav("blog") },
        { href: p("/beeldverantwoording"), label: locale === "de" ? "Bildnachweise" : locale === "en" ? "Image credits" : "Beeldverantwoording" },
      ],
    },
    {
      kop: nav("locaties"),
      links: [
        { href: p("/bezoek-ons"), label: nav("locaties") },
        { href: p("/contact"), label: nav("contact") },
        { href: p("/too-good-to-go"), label: "Too Good To Go" },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`site-container ${styles.grid}`}>
        <address className={styles.contact}>
          <div className={styles.identity}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BEELD.logoBadge.bestand} width={58} height={58} alt="" loading="lazy" />
            <div>
              <strong>{BEDRIJF.naam}</strong>
              <a className={styles.address} href={BEDRIJF.maps.route} aria-label={`${shared("route")} · ${ADRES_REGEL}`}>
                {ADRES_REGEL}<ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className={styles.contactActions}>
            <a className={styles.phone} href={`tel:${BEDRIJF.telefoon.e164}`} aria-label={shared("bellen", { nummer: BEDRIJF.telefoon.weergave })}>
              <Phone size={16} aria-hidden="true" />{BEDRIJF.telefoon.weergave}
            </a>
            <WhatsAppButton />
          </div>
        </address>

        <FooterPanel title={t("kopTijden")}>
          <dl className={styles.hours}>
            <div><dt>{t("winkel")}</dt><dd><ShopHours locale={locale} /></dd></div>
            {[
              [t("markt"), t("marktTijden")],
              [t("voorschoten"), t("voorschotenTijden")],
            ].map(([place, hours]) => (
              <div key={place}><dt>{place}</dt><dd>{hours}</dd></div>
            ))}
          </dl>
          <p className={styles.payment}>{t("betalen")}</p>
        </FooterPanel>

        <FooterPanel title={t("kopNieuwsbrief")}>
          <NewsletterSignup compact locale={locale} />
        </FooterPanel>

        <div className={styles.directory}>
          <FooterPanel title={t("kopPaginas")}>
            <nav className={styles.groups} aria-label={t("kopPaginas")}>
              {groepen.map((groep) => (
                <div key={groep.kop}>
                  <h2>{groep.kop}</h2>
                  <ul>
                    {groep.links.filter(publicLink).map(({ href, label }) => <li key={href}><Link href={href}>{label}</Link></li>)}
                  </ul>
                </div>
              ))}
            </nav>
            <div className={styles.socials}>
              <a href={BEDRIJF.socials.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href={BEDRIJF.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
              {cityGuideUrl && <a href={`${cityGuideUrl}/${locale}/leiden/schaapsvishandel`}>{cityGuideCopy}</a>}
            </div>
          </FooterPanel>
        </div>

        <div className={styles.bottom}>
          <small>© {jaar} {BEDRIJF.naam}<span> · {t("opgericht", { jaar: BEDRIJF.opgericht, oprichter: BEDRIJF.oprichter })}</span></small>
          <div className={styles.privacy}>
            <Link href={p("/privacyverklaring")}>{t("privacy")}</Link>
            <AnalyticsConsent locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  );
}


