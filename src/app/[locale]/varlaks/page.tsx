import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { Beeld } from "@/components/ui/Beeld";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { OrderLink } from "@/components/shared/OrderLink";
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }) { const {locale}=await params;const t=await getTranslations({locale,namespace:"site"});return paginaMetadata({locale,pad:"/varlaks",title:t("varlaksTitle"),description:t("varlaksIntro"),geenIndex:false}); }
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; const t=await getTranslations({locale,namespace:"site"});const nav=await getTranslations({locale,namespace:"nav"});return <><PaginaKop label={t("brand")} titel={t("varlaksTitle")} intro={t("varlaksIntro")} kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:t("varlaksTitle")}]} />
<Sectie grond="papier"><div className="grid md:grid-cols-2 gap-12 items-center"><Beeld naam="varlaksFilet"/><div><Kop titel={t("ingredients")} intro={t("varlaksText")}/><Link href={`/${locale}/biologische-vis`} className="font-semibold underline underline-offset-4">{t("bioTitle")} →</Link></div></div></Sectie>
<Sectie grond="zand"><Kop titel={t("orderTitle")} intro={t("deliveryDetail")}/><OrderLink locale={locale}/></Sectie><PaginaSlot titel={t("delivery")} tekst={t("deliveryDetail")} knoppen={[{label:nav("bestellen"),href:`/${locale}/bestellen`},{label:t("visit"),href:`/${locale}/bezoek-ons`,soort:"lijn"}]} /></>;}
