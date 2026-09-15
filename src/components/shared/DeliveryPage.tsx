import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Sectie, Kop, Vragen } from "@/components/ui/Sectie";
import { Schema } from "@/components/Schema";
import { PostcodeCheck } from "@/components/bezorgen/PostcodeCheck";
import { OrderLink } from "./OrderLink";
import { BEDRIJF } from "@/lib/bedrijf";
import { GEMEENTEN, type Gemeente } from "@/lib/bezorging";
import { vraagSchema, kruimelSchema } from "@/lib/seo";

export async function DeliveryPage({ locale, gemeente }: { locale: string; gemeente?: Gemeente }) {
  const t = await getTranslations({ locale, namespace: "site" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const places = await getTranslations({ locale, namespace: "gemeenten" });
  const title = gemeente ? t("deliveryPlace", { plaats: gemeente.naam }) : t("deliveryTitle");
  const faq = ["Day", "Products", "Cost", "Pickup"].map(k=>({v:t(`faq${k}`),a:t(`faq${k}Text`)}));
  return <>
    <Schema data={[vraagSchema(faq), kruimelSchema(locale,[{naam:BEDRIJF.naam,pad:"/"},{naam:nav("bezorgen"),pad:"/bezorgen"},...(gemeente?[{naam:gemeente.naam,pad:`/bezorgen/${gemeente.slug}`}]:[])])]} />
    <PaginaKop label={t("brand")} titel={title} intro={gemeente ? t("placeIntro",{plaats:gemeente.naam}) : t("deliveryIntro")}
      kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:nav("bezorgen"),...(gemeente?{href:`/${locale}/bezorgen`}:{})},...(gemeente?[{naam:gemeente.naam}]:[])]}
      knoppen={[{label:nav("bestellen"),href:`/${locale}/bestellen`},{label:t("visit"),href:`/${locale}/bezoek-ons`,soort:"lijn"}]}
      feiten={[{label:nav("bezorgen"),waarde:t("delivery")},{label:nav("assortiment"),waarde:`${t("fresh")} · ${t("salads")} · ${t("platters")}`}]} />
    <Sectie grond="papier"><div className="grid lg:grid-cols-2 gap-12"><div><Kop titel={t("areaTitle")} intro={gemeente ? places(`${gemeente.slug}Intro`) : t("areaIntro")} /><p className="leading-relaxed">{t("terms")}</p></div><div><h2 className="text-2xl mb-5">{t("delivery")}</h2><PostcodeCheck /></div></div></Sectie>
    <Sectie grond="zand"><Kop titel={t("stepsTitle")} /><ol className="grid md:grid-cols-3 gap-8">{[1,2,3].map(n=><li key={n} className="pt-4 border-t-2" style={{borderColor:"var(--navy)"}}><span className="kapitaal">0{n}</span><h3 className="text-xl my-3">{t(`step${n}`)}</h3><p className="leading-relaxed">{t(`step${n}Text`)}</p></li>)}</ol></Sectie>
    <Sectie grond="papier" smal><Kop titel={t("faqTitle")} /><Vragen vragen={faq} /></Sectie>
    <Sectie grond="zand"><Kop titel={t("nearby")} /><ul className="flex flex-wrap gap-x-8 gap-y-4">{GEMEENTEN.filter(g=>g.slug!==gemeente?.slug).map(g=><li key={g.slug}><Link href={`/${locale}/bezorgen/${g.slug}`} className="font-semibold underline underline-offset-4">{g.naam}</Link></li>)}</ul></Sectie>
    <Sectie grond="papier"><Kop titel={t("orderTitle")} /><OrderLink locale={locale} /></Sectie>
    <PaginaSlot titel={t("pickup")} tekst={t("pickupText")} knoppen={[{label:t("visit"),href:`/${locale}/bezoek-ons`}]} />
  </>;
}
