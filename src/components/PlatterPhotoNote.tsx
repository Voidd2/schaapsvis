import { platterPresentation } from "@/lib/platter-presentation";

export function PlatterPhotoNote({ locale }: { locale: string }) {
  const t = platterPresentation(locale);
  return <span className="platter-photo-note"><strong>{t.photoLabel}</strong><span>{t.photoText}</span></span>;
}
