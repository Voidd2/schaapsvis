import type { ProductPhoto } from "@/lib/product-beeld";

export function ProductPhotoCredit({ photo }: { photo: ProductPhoto | null }) {
  if (!photo?.credit) return null;
  const credit = photo.credit;
  return <p className="mt-2 text-xs leading-relaxed text-slate-600">
    Foto: © <a className="underline" href={credit.source} target="_blank" rel="noopener noreferrer">{credit.author}</a>
    {" · "}<a className="underline" href={credit.licenseUrl} target="_blank" rel="license noopener noreferrer">{credit.license}</a>
  </p>;
}
