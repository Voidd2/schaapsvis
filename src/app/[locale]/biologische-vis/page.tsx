import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { Beeld } from "@/components/ui/Beeld";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }) { const {locale}=await params;const t=await getTranslations({locale,namespace:"site"});return paginaMetadata({locale,pad:"/biologische-vis",title:t("bioTitle"),description:t("bioIntro"),geenIndex:false}); }
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; const t=await getTranslations({locale,namespace:"site"});const nav=await getTranslations({locale,namespace:"nav"});return <><PaginaKop label={t("brand")} titel={t("bioTitle")} intro={t("bioIntro")} kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:t("bioTitle")}]} />
<Sectie grond="papier"><div className="grid md:grid-cols-3 gap-10">{[1,2,3].map(n=><article className="border-t-2 pt-5" key={n} style={{borderColor:"var(--navy)"}}><h2 className="text-xl mb-4">{t(`bio${n}`)}</h2><p className="leading-relaxed">{t(`bio${n}Text`)}</p></article>)}</div></Sectie>
<Sectie grond="zand"><div className="grid md:grid-cols-2 gap-12 items-center"><Beeld naam="varlaksFilet"/><div><Kop titel={t("varlaksTitle")} intro={t("varlaksIntro")}/><Link className="knop knop-navy" href={`/${locale}/varlaks`}>{t("details")}</Link></div></div></Sectie>
<Sectie grond="papier" smal><Kop titel={t("sources")}/><ul className="space-y-3 underline underline-offset-4"><li><a href="https://agriculture.ec.europa.eu/farming/organic-farming_en" target="_blank" rel="noopener noreferrer">EU — Organic farming</a></li><li><a href="https://www.msc.org/nl/msc-gecertificeerde-vissoorten" target="_blank" rel="noopener noreferrer">Marine Stewardship Council (MSC)</a></li><li><a href="https://asc-aqua.org/" target="_blank" rel="noopener noreferrer">Aquaculture Stewardship Council (ASC)</a></li></ul></Sectie><PaginaSlot titel={t("delivery")} tekst={t("deliveryDetail")} knoppen={[{label:nav("bestellen"),href:`/${locale}/bestellen`},{label:t("visit"),href:`/${locale}/bezoek-ons`,soort:"lijn"}]} /></>;}
