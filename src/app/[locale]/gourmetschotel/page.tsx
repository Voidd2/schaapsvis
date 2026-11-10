import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GourmetRequest } from "@/components/catalog/GourmetRequest";
import { StaticResponsiveImage } from "@/components/StaticResponsiveImage";
import { Kruimels } from "@/components/ui/Sectie";
import { feestdagenBedrag, feestdagenProduct } from "@/lib/feestdagen-producten";
import { MARINADE_CENTS_PER_100G } from "@/lib/gourmet-pricing";
import { gourmetRequestCopy } from "@/lib/gourmet-request";
import { paginaMetadata } from "@/lib/seo";

type Props = {params:Promise<{locale:string}>; searchParams:Promise<{formaat?:string | string[]}>};
const image = "/images/editorial/gourmet-3-4-studio.webp";

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = gourmetRequestCopy(locale);
  return paginaMetadata({locale,pad:"/gourmetschotel",title:t.title+" | Schaap’s Vishandel Leiden",description:t.intro,image});
}

export default async function GourmetPage({params,searchParams}: Props) {
  const {locale} = await params;
  if (!["nl","en","de"].includes(locale)) notFound();
  const {formaat} = await searchParams;
  const product = typeof formaat === "string" ? feestdagenProduct(formaat) : undefined;
  const t = gourmetRequestCopy(locale);
  return <div className="gourmet-order-page section-wrap">
    <Kruimels items={[{naam:"Schaap’s Vishandel",href:`/${locale}`},{naam:t.summary}]}/>
    <header className="gourmet-order-header">
      <div><h1>{t.title}</h1><p>{t.intro}</p><p>{t.marinade} +{feestdagenBedrag(MARINADE_CENTS_PER_100G,locale)} {t.unit}.</p></div>
      <StaticResponsiveImage src={product?.categorie === "gourmet" ? product.afbeelding : image} alt="" width={900} height={600} sizes="(max-width:760px) 40vw, 25vw"/>
    </header>
    <GourmetRequest key={String(formaat)} locale={locale} preset={typeof formaat === "string" ? formaat : ""}/>
  </div>;
}
