import { getTranslations } from "next-intl/server";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { Beeld } from "@/components/ui/Beeld";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { OrderLink } from "@/components/shared/OrderLink";
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }) { const {locale}=await params;const t=await getTranslations({locale,namespace:"site"});return paginaMetadata({locale,pad:"/visschalen",title:t("platterTitle"),description:t("platterIntro"),geenIndex:false}); }
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; const t=await getTranslations({locale,namespace:"site"});const nav=await getTranslations({locale,namespace:"nav"});return <><PaginaKop label={t("brand")} titel={t("platterTitle")} intro={t("platterIntro")} kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:t("platterTitle")}]} />
<Sectie grond="papier"><div className="grid md:grid-cols-3 gap-8">{(["schaalBorrel","schaalFamilie","schaalFeest"] as const).map((beeld,i)=><article key={beeld}><Beeld naam={beeld} verhouding="vierkant"/><h2 className="text-xl mt-5 mb-3">{t(`platter${i+1}`)}</h2><p>{t(`platter${i+1}Text`)}</p></article>)}</div></Sectie>
<Sectie grond="zand" id="samenstellen"><Kop titel={t("orderTitle")} intro={t("deliveryDetail")} /><OrderLink locale={locale}/><p className="mt-6 max-w-3xl">{t("terms")}</p></Sectie>
<Sectie grond="papier" smal><Kop titel={t("allergyTitle")} intro={t("allergyText")} /></Sectie><PaginaSlot titel={t("delivery")} tekst={t("deliveryDetail")} knoppen={[{label:nav("bestellen"),href:`/${locale}/bestellen`},{label:t("visit"),href:`/${locale}/bezoek-ons`,soort:"lijn"}]} /></>;}
