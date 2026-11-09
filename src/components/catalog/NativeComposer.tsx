import type { ReactNode } from "react";
import { CounterFields } from "./AssemblyFields";
import { platterFish, saladCounter, language } from "@/lib/counter-selection";
import { BedieningSlot } from "./BedieningSlot";
import { inquiryText } from "@/lib/platter-inquiry";

type Props = { locale: string; kind: "platter" };
export function ComposerSlot({ children, ...props }: Props & { children: ReactNode }) {
  const fallback = <NativeComposer {...props} />;
  return <div className="composer-slot">
    <div className="composer-enhanced"><BedieningSlot fallback={fallback}>{children}</BedieningSlot></div>
    <noscript><style>{".composer-enhanced{display:none}"}</style>{fallback}</noscript>
  </div>;
}

function PlatterFields({ locale }: { locale: string }) {
  const t = inquiryText(locale);
  return <>
    <label>{t.kind}<select name="selection" defaultValue="platter">{Object.entries(t.kinds).map(([id,name]) => <option value={id} key={id}>{name}</option>)}</select></label>
    <CounterFields locale={locale} items={platterFish} label={t.fish} group="composer-for-fish"/>
    <CounterFields locale={locale} items={saladCounter} label={["Vissalades naar keuze","Choose seafood salads","Fischsalate wählen"][language(locale)]}/>
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

function NativeComposer({locale,kind}: Props) {
  return <form action="/api/samenstellen" method="post" target="_blank" rel="noopener noreferrer" className="native-composer-form">
    <input type="hidden" name="locale" value={locale} /><input type="hidden" name="kind" value={kind} />
    <PlatterFields locale={locale} />
    <button className="knop knop-navy" type="submit">{["Aanvraag zonder winkelwagen bekijken","Review request without the basket","Anfrage ohne Warenkorb prüfen"][language(locale)]} →</button>
  </form>;
}
