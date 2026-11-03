import { cartText } from "@/lib/cart-copy";
import { BEDRIJF, whatsappLink } from "@/lib/bedrijf";
export function CatalogHelp({ locale }: { locale:string }) {
  const t = cartText(locale);
  return <p className="catalog-help">{t.helpBefore}<a href={`tel:${BEDRIJF.telefoon.e164}`}>{BEDRIJF.telefoon.weergave}</a>{t.helpOr}<a href={whatsappLink(t.helpMessage)} target="_blank" rel="noopener noreferrer">{t.helpLink}</a>{t.helpAfter}</p>;
}
