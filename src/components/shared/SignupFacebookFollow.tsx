import { BEDRIJF } from "@/lib/bedrijf";

const copy = {
  nl: ["Blijf ook via Facebook op de hoogte van onze aanbiedingen en het nieuws uit de winkel.", "Volg ons op Facebook"],
  en: ["Follow us on Facebook for offers and news from the shop.", "Follow us on Facebook"],
  de: ["Auf Facebook finden Sie unsere Angebote und Neuigkeiten aus dem Laden.", "Auf Facebook folgen"],
} as const;

export function SignupFacebookFollow({ locale, compact = false }: { locale: string; compact?: boolean }) {
  const [invitation, button] = copy[locale === "en" || locale === "de" ? locale : "nl"];
  return <div className="my-3 grid justify-items-start gap-2">
    <p>{invitation}</p>
    <a href={BEDRIJF.socials.facebook} rel="noreferrer" className={compact ? "knop bg-white text-slate-900 hover:bg-sky-100" : "knop knop-navy"}>{button}</a>
  </div>;
}
