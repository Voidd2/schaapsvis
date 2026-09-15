import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PaginaKop, PaginaSlot } from "@/components/ui/PaginaKop";
import { Sectie, Kop } from "@/components/ui/Sectie";
import { Beeld } from "@/components/ui/Beeld";
import { Schema } from "@/components/Schema";
import { paginaMetadata, kruimelSchema, LOCALES } from "@/lib/seo";
import { BEDRIJF } from "@/lib/bedrijf";
import { products, getProduct } from "@/lib/assortiment-data";
import { isProductBezorgbaar } from "@/lib/bezorging";
type Props={params:Promise<{locale:string;slug:string}>};
export function generateStaticParams(){return LOCALES.flatMap(locale=>products.map(p=>({locale,slug:p.slug})));}
export async function generateMetadata({params}:Props){const {locale,slug}=await params;if(!getProduct(slug))notFound();const t=await getTranslations({locale,namespace:"site"});const p=await getTranslations({locale,namespace:"producten"});return paginaMetadata({locale,pad:`/assortiment/${slug}`,title:t("productTitle",{name:p(`${slug}.naam`)}),description:p(`${slug}.desc`)+" — Schaap’s Vishandel, Leiden."});}
export default async function Page({params}:Props){const {locale,slug}=await params;const product=getProduct(slug);if(!product)notFound();const t=await getTranslations({locale,namespace:"site"});const p=await getTranslations({locale,namespace:"producten"});const nav=await getTranslations({locale,namespace:"nav"});const name=p(`${slug}.naam`);const desc=p(`${slug}.desc`);const delivery=isProductBezorgbaar(product);
return <>
<Schema data={[{"@context":"https://schema.org","@type":"Product",name,description:desc,category:t(`categories.${product.categorie}`),url:`${BEDRIJF.domein}/${locale}/assortiment/${slug}`,...(product.photo?{image:`${BEDRIJF.domein}${product.photo}`}:{})},kruimelSchema(locale,[{naam:BEDRIJF.naamKort,pad:"/"},{naam:nav("assortiment"),pad:"/assortiment"},{naam:name,pad:`/assortiment/${slug}`}])]}/>
<PaginaKop label={t(`categories.${product.categorie}`)} titel={name} intro={desc} kruimels={[{naam:BEDRIJF.naamKort,href:`/${locale}`},{naam:nav("assortiment"),href:`/${locale}/assortiment`},{naam:name}]} knoppen={[{label:delivery?nav("bestellen"):t("visit"),href:`/${locale}/${delivery?"bestellen":"bezoek-ons"}`}]} />
<Sectie grond="papier"><div className="grid md:grid-cols-2 gap-12"><div>{slug==="vispotje"?<Beeld naam="aanraderVispotje"/>:product.photo? /* eslint-disable-next-line @next/next/no-img-element */
<img src={product.photo} width="600" height="600" alt={`${name} — Schaap’s Vishandel, Leiden`} className="w-full aspect-square object-contain bg-white"/>:<div className="aspect-square flex items-center justify-center p-8 text-center" style={{background:"var(--sand)"}}><div><p className="text-2xl">{name}</p><p className="mt-3 text-sm">{t("photo")}</p></div></div>}</div><div><Kop titel={delivery?t("delivery"):t("pickup")} intro={t(delivery?"onlineEligible":"storeOnly")}/><p className="mb-8">{t("productAvailability")}</p><Kop titel={t("ingredients")} intro={t("ingredientsText")}/><p>{t("allergyText")}</p></div></div></Sectie>
<Sectie grond="zand"><Kop titel={t("inspiration")} intro={t("inspirationText")}/><Link href="/nl/recepten" hrefLang="nl" className="font-semibold underline underline-offset-4">{t("recipesNl")} →</Link><Link href={`/${locale}/assortiment`} className="block mt-6 underline underline-offset-4">← {t("backCatalog")}</Link></Sectie>
<PaginaSlot titel={delivery?t("orderTitle"):t("pickup")} tekst={t(delivery?"deliveryDetail":"pickupText")} knoppen={[{label:delivery?nav("bestellen"):t("visit"),href:`/${locale}/${delivery?"bestellen":"bezoek-ons"}`},{label:`${t("call")} ${BEDRIJF.telefoon.weergave}`,href:`tel:${BEDRIJF.telefoon.e164}`,extern:true,soort:"lijn"}]}/>
</>;}
