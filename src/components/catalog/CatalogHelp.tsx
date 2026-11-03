import { cartText } from "@/lib/cart-copy";
import { whatsappLink } from "@/lib/bedrijf";
export function CatalogHelp({ locale }: { locale:string }) {
  const t = cartText(locale);
  return <p className="catalog-help">{t.helpBefore}<a href={whatsappLink(t.helpMessage)} target="_blank" rel="noopener noreferrer">{t.helpLink}</a>{t.helpAfter}</p>;
}
