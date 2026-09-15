"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { products, CATEGORIE_LABELS, type Categorie } from "@/lib/assortiment-data";
import { isProductBezorgbaar } from "@/lib/bezorging";

export function AssortimentFilter() {
  const locale=useLocale();const t=useTranslations("site");const p=useTranslations("producten");
  const params=useSearchParams();
  const initial=params.get("categorie");
  const [category,setCategory]=useState(initial && initial in CATEGORIE_LABELS ? initial : "alle");
  const [query,setQuery]=useState("");
  const matches=products.filter(product=>(category==="alle" || product.categorie===category) && `${p(`${product.slug}.naam`)} ${p(`${product.slug}.desc`)} ${product.naam}`.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale)));
  return <>
    <label className="block max-w-lg mb-6"><span className="veld-label">{t("search")}</span><input className="veld" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t("searchPlaceholder")}/></label>
    <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label={t("catalogTitle")}>
      {["alle",...Object.keys(CATEGORIE_LABELS)].map(c=><button key={c} type="button" onClick={()=>setCategory(c)} aria-pressed={category===c} className={`knop ${category===c?"knop-navy":"knop-lijn"} !px-4 !py-2 !text-sm`}>{c==="alle"?t("all"):t(`categories.${c}`)}</button>)}
    </div>
    <p role="status" className="mb-7 text-sm">{t("resultCount",{count:matches.length})}</p>
    {matches.length===0 && <p>{t("noResults")}</p>}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">{matches.map(product=>{
      const name=p(`${product.slug}.naam`);const detail=`/${locale}/assortiment/${product.slug}`;
      return <article key={product.slug} className="flex flex-col border" style={{borderColor:"var(--linen)"}}>
        <Link href={detail} className="aspect-square flex items-center justify-center p-5" style={{background:product.photo?"white":"var(--sand)"}}>
          {product.photo ? /* eslint-disable-next-line @next/next/no-img-element */
            <img src={product.photo} width="400" height="400" alt={`${name} — Schaap’s Vishandel, Leiden`} loading="lazy" className="w-full h-full object-contain"/>
            : <span className="text-center"><span className="block text-xl">{name}</span><span className="block text-xs mt-3">{t("photo")}</span></span>}
        </Link>
        <div className="p-5 flex flex-col flex-1"><p className="kapitaal mb-2">{t(`categories.${product.categorie as Categorie}`)}</p><h2 className="text-xl mb-3"><Link href={detail}>{name}</Link></h2><p className="mb-4 flex-1">{p(`${product.slug}.desc`)}</p><p className="text-sm mb-4">{t(isProductBezorgbaar(product)?"onlineEligible":"storeOnly")}</p><Link href={detail} className="font-semibold underline underline-offset-4">{t("details")} →</Link></div>
      </article>;
    })}</div>
  </>;
}
