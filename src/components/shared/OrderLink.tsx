import { getTranslations } from "next-intl/server";
import { BEDRIJF } from "@/lib/bedrijf";
import { webwinkelUrl } from "@/lib/webwinkel";

export async function OrderLink({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "site" });
  const url = webwinkelUrl();
  return <div className="max-w-2xl">
    <p className="mb-5 leading-relaxed">{url ? t("shopExplain") : t("pending")}</p>
    <a className="knop knop-rood" href={url ?? `tel:${BEDRIJF.telefoon.e164}`}>
      {url ? t("shop") : `${t("call")} ${BEDRIJF.telefoon.weergave}`}
    </a>
  </div>;
}
