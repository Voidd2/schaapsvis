import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const prefix = (path: string) =>
    locale === "nl" ? path : `/${locale}${path}`;

  return (
    <footer className="bg-[#1A1A1A] text-white/80 pt-12 pb-6 mt-0">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Brand */}
        <div>
          <h3
            className="text-white text-xl font-bold mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Schaap&apos;s Vis
          </h3>
          <p className="text-sm leading-relaxed text-white/60">{t("tagline")}</p>
          <p className="text-xs mt-3 text-white/40">
            Herenstraat 48 · 2313 AL Leiden
          </p>
          <a
            href="tel:+31715149802"
            className="text-xs text-[#E8A87C] hover:text-white transition-colors mt-1 block"
          >
            071 514 9802
          </a>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
            {t("links")}
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href={prefix("/")}
                className="hover:text-[#E8A87C] transition-colors"
              >
                {nav("home")}
              </Link>
            </li>
            <li>
              <Link
                href={prefix("/ons-verhaal")}
                className="hover:text-[#E8A87C] transition-colors"
              >
                {nav("verhaal")}
              </Link>
            </li>
            <li>
              <Link
                href={prefix("/varlaks-biologische-zalm")}
                className="hover:text-[#E8A87C] transition-colors"
              >
                {nav("varlaks")}
              </Link>
            </li>
            <li>
              <Link
                href={prefix("/assortiment")}
                className="hover:text-[#E8A87C] transition-colors"
              >
                {nav("assortiment")}
              </Link>
            </li>
            <li>
              <Link
                href={prefix("/bezoek-ons")}
                className="hover:text-[#E8A87C] transition-colors"
              >
                {nav("bezoek")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
            {t("contact")}
          </h4>
          <address className="not-italic text-sm space-y-1 text-white/60">
            <p>Herenstraat 48</p>
            <p>2313 AL Leiden</p>
            <p>
              <a
                href="tel:+31715149802"
                className="hover:text-[#E8A87C] transition-colors"
              >
                071 514 9802
              </a>
            </p>
          </address>
          <div className="mt-4 flex gap-3">
            <span className="text-xs bg-[#2D6A4F] text-white px-2 py-1 rounded">
              Since 1938
            </span>
            <span className="text-xs bg-[#1B4F72] text-white px-2 py-1 rounded">
              4 generaties
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 border-t border-white/10 text-center text-xs text-white/40">
        {t("copyright")}
      </div>
    </footer>
  );
}
