import type { ProductPhoto } from "@/lib/product-beeld";

export function ProductPhotoCredit({ photo, locale = "nl" }: { photo: ProductPhoto | null; locale?: string }) {
  if (!photo?.credit && !photo?.caption) return null;
  const credit = photo.credit;
  return <p className="mt-2 text-xs leading-relaxed text-slate-600">
    {photo.caption && <span className="block">{photo.caption}</span>}
    {credit && <>{locale === "en" ? "Photo" : "Foto"}: <a className="underline" href={credit.source} target="_blank" rel="noopener noreferrer">{credit.author}</a>
    {credit.license && credit.licenseUrl && <>{" · "}<a className="underline" href={credit.licenseUrl} target="_blank" rel="license noopener noreferrer">{credit.license}</a></>}</>}
  </p>;
}
