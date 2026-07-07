import Link from "next/link";
import { Share2, MapPin, Phone } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const p = (path: string) => `/${locale}${path}`;

  return (
    <footer style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}>
      <div className="max-w-6xl mx-auto px-4 pt-14 pb-8">
        {/* Nieuwsbrief */}
        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-10 mb-10 border-b"
          style={{ borderColor: "rgba(246,250,253,0.15)" }}
        >
          <div>
            <h3
              className="text-xl font-bold mb-1"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Vers van de veiling — in uw inbox
            </h3>
            <p className="text-sm opacity-60 max-w-md leading-relaxed">
              Elke week: wat er vers binnen is, de aanbieding van de week en
              seizoenstips. Geen spam, wel vis.
            </p>
          </div>
          <div className="md:min-w-[320px]">
            <NewsletterSignup />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Schaap&apos;s Vis
            </div>
            <div className="text-xs tracking-widest uppercase opacity-50 mb-4">
              Leiden · Est. 1938
            </div>
            <p className="text-sm opacity-60 leading-relaxed max-w-[200px]">
              Vier generaties vakmanschap. Verse vis van de Herenstraat.
            </p>
            <a
              href="https://www.facebook.com/schaapsvishandel/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              <Share2 size={16} />
              {t("facebook")}
            </a>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase opacity-50 mb-4">
              Pagina&apos;s
            </h4>
            <ul className="space-y-2.5 text-sm opacity-75">
              {[
                { href: p("/"), label: "Home" },
                { href: p("/assortiment"), label: nav("assortiment") },
                { href: p("/biologische-vis"), label: nav("betereVis") },
                { href: p("/marktkraam-leiden"), label: "Marktkramen" },
                { href: p("/recepten"), label: nav("recepten") },
                { href: p("/blog"), label: nav("blog") },
                { href: p("/varlaks"), label: nav("varlaks") },
                { href: p("/ons-verhaal"), label: nav("verhaal") },
                { href: p("/bestellen"), label: nav("bestellen") },
                { href: p("/bezoek-ons"), label: nav("locaties") },
                { href: p("/contact"), label: nav("contact") },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:opacity-100 transition-opacity"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Openingstijden */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase opacity-50 mb-4">
              Openingstijden
            </h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <span className="opacity-60 text-xs block">Winkel</span>
                Maandag t/m zaterdag
              </li>
              <li>
                <span className="opacity-60 text-xs block">
                  Markt Leiden
                </span>
                Woensdag + Zaterdag
              </li>
              <li>
                <span className="opacity-60 text-xs block">Voorschoten</span>
                Vrijdag
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase opacity-50 mb-4">
              Contact
            </h4>
            <address className="not-italic text-sm opacity-75 space-y-2">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 opacity-60" />
                <span>{t("address")}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="flex-shrink-0 opacity-60" />
                <a
                  href="tel:+31715149802"
                  className="hover:opacity-100 transition-opacity"
                >
                  {t("phone")}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div
          className="pt-6 border-t text-xs opacity-40 text-center"
          style={{ borderColor: "rgba(246,250,253,0.15)" }}
        >
          {t("copy")}
        </div>
      </div>
    </footer>
  );
}
