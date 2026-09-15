import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Beeld } from "@/components/ui/Beeld";
import { Sectie, Kop } from "@/components/ui/Sectie";

export async function Recommendations({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "site" });
  const items = [
    { name: "vispotje", text: "vispotjeText", photo: "aanraderVispotje" as const, path: "/assortiment/vispotje", delivery: false },
    { name: "salads", text: "saladsText", photo: "aanraderSalade" as const, path: "/assortiment?categorie=vissalades", delivery: true },
    { name: "platters", text: "plattersText", photo: "schaalBorrel" as const, path: "/visschalen", delivery: true },
  ];
  return <Sectie grond="zand" id="aanraders">
    <Kop label={t("recommendLabel")} titel={t("recommendTitle")} intro={t("recommendIntro")} />
    <div className="grid md:grid-cols-3 gap-8">
      {items.map(item => <article key={item.name}>
        <Link href={`/${locale}${item.path}`}><Beeld naam={item.photo} verhouding="vierkant" /></Link>
        <h3 className="text-xl mt-5 mb-3"><Link href={`/${locale}${item.path}`}>{t(item.name)}</Link></h3>
        <p className="leading-relaxed mb-4">{t(item.text)}</p>
        <p className="text-sm mb-4" style={{ color: "var(--grijs)" }}>{t(item.delivery ? "onlineEligible" : "storeOnly")}</p>
        <Link href={`/${locale}${item.path}`} className="font-semibold underline underline-offset-4">{t("details")} →</Link>
      </article>)}
    </div>
  </Sectie>;
}
