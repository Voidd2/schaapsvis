"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { feestdagenBedrag } from "@/lib/feestdagen-producten";
import { useInteractive } from "@/lib/use-interactive";
import { platterFamily, platterFamilies, platterLabels, platterSizeLabel, platterDetailHref, platterOverviewHref } from "@/lib/platter-families";

export function PlatterNavigation({ locale, slug, mode }: { locale: "nl" | "en" | "de"; slug: string; mode: "back" | "size" }) {
  const params = useSearchParams();
  const router = useRouter();
  const interactive = useInteractive();
  const family = platterFamily(slug);
  if (!family) return null;
  const t = platterLabels[locale];
  if (mode === "back") return <Link className="platter-back-link" href={platterOverviewHref(locale, slug, params.toString())}>{t.back}</Link>;
  return <label className="platter-size" htmlFor="product-platter-size">{t.size}
    <select id="product-platter-size" value={slug} disabled={!interactive} onChange={event => router.push(platterDetailHref(locale, event.target.value, params.toString()))}>
      {platterFamilies[family].map(item => <option key={item.slug} value={item.slug}>{platterSizeLabel(item.slug, locale)} · {feestdagenBedrag(Math.round(item.prijs * 100), locale)}</option>)}
    </select>
  </label>;
}
