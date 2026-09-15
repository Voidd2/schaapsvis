import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { paginaMetadata } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { OrderLink } from "@/components/shared/OrderLink";
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }) { const {locale}=await params;const t=await getTranslations({locale,namespace:"site"});return paginaMetadata({locale,pad:"/bestellen",title:t("orderTitle"),description:t("deliveryIntro"),geenIndex:false}); }
export default async function Page({params}:{params:Promise<{locale:string}>}) { const {locale}=await params; const t=await getTranslations({locale,namespace:"site"});const nav=await getTranslations({locale,namespace:"nav"});return <><PaginaKop label={t("brand")} titel={t("orderTitle")} intro={t("orderIntro")} kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:t("orderTitle")}]} />
<Sectie grond="papier"><p className="kapitaal mb-3">{t("delivery")}</p><p className="text-xl max-w-3xl mb-8">{t("deliveryDetail")}</p><OrderLink locale={locale} /></Sectie>
<Sectie grond="zand"><div className="grid md:grid-cols-3 gap-8">{["fresh","salads","platters"].map(k=><div key={k}><h2 className="text-xl mb-3">{t(k)}</h2><p>{t(k+"Text")}</p></div>)}</div><p className="mt-8 max-w-3xl leading-relaxed">{t("terms")}</p></Sectie>
<Sectie grond="papier" smal><Kop titel={t("allergyTitle")} intro={t("allergyText")} /><Link href={`/${locale}/bezorgen`} className="font-semibold underline underline-offset-4">{nav("bezorgen")} →</Link></Sectie>
<PaginaSlot titel={t("delivery")} tekst={t("deliveryDetail")} knoppen={[{label:nav("bestellen"),href:`/${locale}/bestellen`},{label:t("visit"),href:`/${locale}/bezoek-ons`,soort:"lijn"}]} /></>;}
