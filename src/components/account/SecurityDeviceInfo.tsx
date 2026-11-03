export type SecurityDevice = { id: string; device_type: string; operating_system: string; browser: string; device_model?: string | null; access_context: string };

const texts = {
  nl: { smartphone: "Telefoon", tablet: "Tablet", desktop: "Computer", unknown: "Niet bekend", browser: "Webbrowser", standalone: "Vanaf beginscherm", missing: "Apparaatgegevens zijn bij deze oudere sessie niet vastgelegd.", note: "Nieuwe aanmeldingen registreren browser, besturingssysteem en apparaattype voor accountbeveiliging. Dit zijn door de browser verstrekte gegevens, geen bewijs van een fysieke identiteit." },
  en: { smartphone: "Phone", tablet: "Tablet", desktop: "Computer", unknown: "Not known", browser: "Web browser", standalone: "From home screen", missing: "Device details were not recorded for this older session.", note: "New sign-ins record browser, operating system and device type for account security. These details are supplied by the browser and do not prove a physical identity." },
  de: { smartphone: "Telefon", tablet: "Tablet", desktop: "Computer", unknown: "Nicht bekannt", browser: "Webbrowser", standalone: "Vom Startbildschirm", missing: "Für diese ältere Sitzung wurden keine Gerätedaten erfasst.", note: "Neue Anmeldungen erfassen Browser, Betriebssystem und Gerätetyp zur Kontosicherheit. Diese Angaben stammen vom Browser und belegen keine physische Identität." },
};
export function deviceCopy(locale: string) { return texts[locale === "en" || locale === "de" ? locale : "nl"]; }
export function contextLabel(context: string, locale: string) {
  const t = deviceCopy(locale);
  return context === "standalone" ? t.standalone : context === "browser" ? t.browser : t.unknown;
}
export function SecurityDeviceInfo({ device, locale }: { device?: SecurityDevice; locale: string }) {
  const t = deviceCopy(locale);
  if (!device) return <p className="text-sm text-slate-600">{t.missing}</p>;
  const type = device.device_type === "smartphone" || device.device_type === "tablet" || device.device_type === "desktop" ? t[device.device_type] : t.unknown;
  const known = (value: string) => !value || /^(unknown|onbekend)$/i.test(value) ? t.unknown : value;
  return <p className="font-semibold">{type} · {known(device.browser)} · {known(device.operating_system)}{device.device_model ? ` · ${device.device_model}` : ""}</p>;
}
