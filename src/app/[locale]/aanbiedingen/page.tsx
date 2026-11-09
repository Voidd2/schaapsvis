import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiscountSignup } from "@/components/shared/DiscountSignup";
import { StaticResponsiveImage } from "@/components/StaticResponsiveImage";
import { discountSignupCopy } from "@/lib/discount-signup";
import { paginaMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };
const photo = "/images/schaaps/toonbank-marktkraam.webp";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = discountSignupCopy(locale);
  return paginaMetadata({ locale, pad: "/aanbiedingen", title: t.title + " | Schaap’s Vishandel", description: t.intro, image: photo });
}

export default async function AanbiedingenPage({ params }: Props) {
  const { locale } = await params;
  if (!["nl", "en", "de"].includes(locale)) notFound();
  const t = discountSignupCopy(locale);
  return <section className="discount-landing section-wrap" aria-labelledby="discount-heading">
    <div className="discount-panel">
      <div className="discount-content">
        <h1 id="discount-heading">{t.title}</h1>
        <p className="discount-intro">{t.intro}</p>
        <DiscountSignup locale={locale}/>
      </div>
      <StaticResponsiveImage src={photo} alt={t.photo} width={1200} height={900} sizes="(max-width:760px) 100vw, 50vw" />
    </div>
  </section>;
}
