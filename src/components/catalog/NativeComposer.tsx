import type { ReactNode } from "react";
import { BedieningSlot } from "./BedieningSlot";
import { WhatsAppBestelknop } from "./WhatsAppBestelknop";
import { gourmetFish, gourmetLanguage, gourmetRequestCopy } from "@/lib/gourmet-request";
import { inquiryText } from "@/lib/platter-inquiry";
import { giftQuote, giftRequestCopy, type GiftRequest } from "@/lib/gift-request";
import { deliGroups, deliLanguage, initialSlots } from "@/lib/deli-trio";
import { feestdagenBedrag } from "@/lib/feestdagen-producten";

type Props = { locale: string; kind: "gourmet" | "platter" | "deli" | GiftRequest["kind"]; product?: string; slug?: string };
export function ComposerSlot({ children, ...props }: Props & { children: ReactNode }) {
  const fallback = <NativeComposer {...props} />;
  return <div className="composer-slot">
    <div className="composer-enhanced"><BedieningSlot fallback={fallback}>{children}</BedieningSlot></div>
    <noscript><style>{".composer-enhanced{display:none}"}</style>{fallback}</noscript>
  </div>;
}

function GourmetFields({ locale }: { locale: string }) {
  const t = gourmetRequestCopy(locale);
  return <>
    <label>{t.people}<input required name="people" type="number" min="1" max="200" /></label>
    <fieldset><legend>{t.fish}</legend><div className="composer-fish">
      {gourmetFish.map(fish => <div key={fish.id} className="composer-fish-row">
        <label><input type="checkbox" name="fish" value={fish.id} />{fish[gourmetLanguage(locale)]} <small>{feestdagenBedrag(fish.rate,locale)} {t.unit}</small></label>
        <label className="composer-weight">{t.grams}<input name={fish.id} type="number" min="1" step="1" defaultValue="100" /></label>
      </div>)}
    </div></fieldset>
    <label>{t.packaging}<select name="packaging"><option value="standard">{t.standard} · {t.free}</option><option value="premium">{t.premium}</option></select></label>
    <small>{t.customNote}</small><label>{t.date}<input name="date" type="date" /></label>
    <label>{t.wishes}<textarea name="wishes" maxLength={700} /></label>
  </>;
}

function PlatterFields({ locale }: { locale: string }) {
  const t = inquiryText(locale);
  return <>
    <label>{t.kind}<select name="selection" defaultValue="platter">{Object.entries(t.kinds).map(([id,name]) => <option value={id} key={id}>{name}</option>)}</select></label>
    <fieldset className="composer-for-fish"><legend>{t.fish}</legend><div className="composer-options">{Object.entries(t.fishes).map(([id,name]) => <label key={id}><input type="checkbox" name="fish" value={id} />{name}</label>)}</div></fieldset>
    <label className="composer-for-fish">{t.excluded}<input name="excluded" maxLength={300} /></label>
    <label>{t.presentation}<select name="presentation" defaultValue="advice">{Object.entries(t.presentations).map(([id,name]) => <option key={id} value={id}>{name}</option>)}</select></label>
    <label className="composer-for-fish">{t.people}<input name="people" type="number" min="1" /></label>
    <label className="composer-for-salad">{t.amount}<input name="amount" maxLength={120} placeholder={t.amountHint} /></label>
    <label>{t.date}<input name="date" type="date" /><small>{t.unknown}</small></label>
    <label>{t.budget}<input type="number" min="0" step=".01" name="budget" /></label>
    <label>{t.remarks}<textarea name="wishes" maxLength={1000} /></label>
    <label>{t.allergies}<textarea name="allergies" maxLength={500} /><small>{t.allergyNote}</small></label>
  </>;
}

function TrioFields({ locale, slug }: { locale: string; slug: string }) {
  const lang = deliLanguage(locale);
  return <>{initialSlots(slug).map((slot,i) => <fieldset key={i}>
    <legend>{["Vakje", "Compartment", "Fach"][lang]} {i+1}</legend>
    <label>{["Kies een soort","Choose a variety","Sorte wählen"][lang]}
      <select required name={`choice${i}`} defaultValue={slot.choice}><option value="">—</option>
        {deliGroups.flat().map(item => <option key={item.id} value={item.id}>{item.names[lang]} · {feestdagenBedrag(item.rate,locale)} / 100 g</option>)}
      </select></label>
    <label>{["Gram","Grams","Gramm"][lang]}<input type="number" name={`grams${i}`} required min="1" defaultValue={slot.grams} /></label>
  </fieldset>)}</>;
}

function GiftFields({ locale, kind }: { locale: string; kind: GiftRequest["kind"] }) {
  const t = giftRequestCopy(locale);
  return <>
    {kind !== "custom" && <label>{t.format}<select name="size" defaultValue="1">{t.sizes.map((size,i) => {
      const quote = giftQuote(locale,{kind,size:i,fish:[0,1,2]});
      return <option value={i} key={size}>{size}{quote && kind === "package" ? " · " + feestdagenBedrag(quote.price,locale) : ""}</option>;
    })}</select></label>}
    {kind === "package" && <fieldset><legend>{t.extras}</legend>{t.extraFish.map((name,i) => <label key={name}><input type="checkbox" name="extra" value={i} />{name}</label>)}</fieldset>}
    {kind === "trio" && <fieldset><legend>{t.fish}</legend>{t.choices.map((name,i) => <label key={name}><input type="checkbox" name="fish" value={i} defaultChecked={i<3} />{name}</label>)}</fieldset>}
    <label>{t.voucherAmount}<input name="voucher" type="number" min="0.01" step="0.01" /></label>
  </>;
}

function NativeComposer({locale,kind,product,slug}: Props) {
  const lang = deliLanguage(locale);
  const t = giftRequestCopy(locale);
  const title = kind === "gourmet" ? gourmetRequestCopy(locale).title : kind === "platter"
    ? ["Stel uw visschaal samen","Create your fish platter","Fischplatte zusammenstellen"][lang]
    : kind === "deli" ? ["Stel uw eigen trio samen","Create your own trio","Eigenes Trio zusammenstellen"][lang] : product;
  const form = <form action="/api/samenstellen" method="post" target="_blank" rel="noopener noreferrer" className="native-composer-form">
      <input type="hidden" name="locale" value={locale} /><input type="hidden" name="kind" value={kind} />
      {slug && <input type="hidden" name="slug" value={slug} />}
      {kind === "gourmet" ? <GourmetFields locale={locale} /> : kind === "platter" ? <PlatterFields locale={locale} /> : <>
        {kind === "deli" ? <TrioFields locale={locale} slug={slug!} /> : <GiftFields locale={locale} kind={kind} />}
        <label>{t.wishes}<textarea name="wishes" maxLength={700} /></label>
      </>}
      <button className="knop knop-navy" type="submit">{["Bekijk mijn WhatsApp-concept","Review my WhatsApp draft","WhatsApp-Entwurf ansehen"][lang]} →</button>
    </form>;
  if (kind === "gourmet" || kind === "platter") return form;
  return <><details className="native-composer"><summary>{title}</summary>{form}</details>
    {kind === "deli" && <div className="composer-standard mt-3"><WhatsAppBestelknop locale={locale} product={product} /></div>}</>;
}
