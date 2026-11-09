"use client";

import { useId, useState, type FormEvent } from "react";
import { giftRequestCopy, giftRequestLink, giftQuote, giftVoucherCents, type GiftRequest as Request } from "@/lib/gift-request";
import { feestdagenBedrag } from "@/lib/feestdagen-producten";
import { PACKAGE_EXTRAS } from "@/lib/gift-pricing";
import { useInteractive } from "@/lib/use-interactive";

export function GiftRequest({ locale, product, kind }: { locale: string; product: string; kind: Request["kind"] }) {
  const t = giftRequestCopy(locale), id = useId();
  const ready = useInteractive();
  const [size, setSize] = useState(1);
  const [fish, setFish] = useState([0, 1, 2]);
  const [wishes, setWishes] = useState("");
  const [voucher, setVoucher] = useState(false);
  const [voucherAmount, setVoucherAmount] = useState("");
  const [error, setError] = useState(false);
  const [extras, setExtras] = useState<number[]>([]);
  const selection = { kind, size, fish, extras };
  const quote = giftQuote(locale, selection);
  const voucherCents = voucher ? giftVoucherCents(voucherAmount) : null;
  const money = (cents: number) => feestdagenBedrag(cents, locale);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const href = giftRequestLink(locale, { product, ...selection, wishes, voucher, voucherAmount });
    if (!href) { setError(true); return; }
    setError(false);
    window.location.assign(href);
  }
  return <form onSubmit={submit} className="gift-request mt-5 border-t border-[#bfd6df] pt-4" aria-label={product}>
    {kind !== "custom" && <fieldset><legend className="mb-2 font-semibold">{t.format}</legend><div className="grid grid-cols-3 gap-2">
      {t.sizes.map((label, index) => {
        const option = giftQuote(locale, { ...selection, size: index });
        return <label key={label} className={`flex min-h-12 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border px-2 py-3 text-sm font-semibold ${size === index ? "border-[#075b82] bg-[#eaf7fc]" : "border-[#bfd6df] bg-white"}`}>
        <span className="flex items-center gap-1"><input type="radio" name={`${id}-size`} checked={size === index} onChange={() => setSize(index)} aria-label={label} className="accent-[#075b82]" />{label}</span>
        {option && <span className="tabular-nums">{money(option.price)}</span>}
      </label>; })}
    </div></fieldset>}
    {kind === "package" && <fieldset className="mt-4">
      <legend className="mb-2 font-semibold">{t.extras}</legend>
      {t.extraFish.map((name, i) => <label key={name} className="flex min-h-12 cursor-pointer items-center gap-2 border-b border-[#bfd6df] py-2">
        <input type="checkbox" checked={extras.includes(i)} onChange={event => {
          setExtras(event.target.checked ? [...extras, i] : extras.filter(item => item !== i));
        }} className="h-4 w-4 accent-[#075b82]" />
        <span>{name}</span><span className="ml-auto whitespace-nowrap font-semibold">+{money(PACKAGE_EXTRAS[i])}</span>
      </label>)}
      <p className="mt-2 text-sm">{t.availability}</p>
    </fieldset>}
    {kind === "trio" && <fieldset aria-describedby={`${id}-count`}><legend className="mb-2 font-semibold">{t.fish}</legend><div className="grid gap-2">
      {t.choices.map((label, index) => <label key={label} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 ${fish.includes(index) ? "border-[#075b82] bg-[#eaf7fc]" : "border-[#bfd6df] bg-white"}`}>
        <input type="checkbox" checked={fish.includes(index)} onChange={() => { setFish(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]); setError(false); }} className="h-4 w-4 accent-[#075b82]" />{label}
      </label>)}
    </div><p id={`${id}-count`} className="mt-2 text-sm" aria-live="polite">{fish.length} {t.selected}</p></fieldset>}
    <label className="mt-4 flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-[#bfd6df] bg-white p-3 font-semibold"><input type="checkbox" checked={voucher} onChange={event => { setVoucher(event.target.checked); setError(false); }} className="h-4 w-4 accent-[#075b82]" />{t.voucher}</label>
    {voucher && <div className="mt-3"><label htmlFor={`${id}-voucher`} className="block font-semibold">{t.voucherAmount}</label><input id={`${id}-voucher`} inputMode="decimal" type="text" value={voucherAmount} onChange={event => { setVoucherAmount(event.target.value); setError(false); }} maxLength={9} required aria-describedby={`${id}-voucher-hint`} className="mt-2 min-h-12 w-full rounded-lg border border-[#bfd6df] bg-white p-3 text-base" /><p id={`${id}-voucher-hint`} className="mt-2 text-sm leading-6">{t.voucherHint}</p></div>}
    {kind !== "custom" && <div className="gift-price-summary" aria-live="polite">
      {quote ? <>
        <div className="flex flex-wrap items-baseline justify-between gap-2"><strong>{t.price}</strong><strong className="text-2xl tabular-nums">{money(quote.price)}</strong></div>
        <p>{t.packaging}</p>
        <ul className="my-3 space-y-1">{quote.lines.map(line => <li key={line}>{line}</li>)}</ul>
        <p className="font-semibold">{t.total}: {quote.total} g</p>
        {voucherCents !== null && <p className="mt-3 border-t pt-2 font-bold">{t.grandTotal}: {money(quote.price + voucherCents)}</p>}
      </> : <p>{t.chooseThree}</p>}
    </div>}
    <label htmlFor={`${id}-wishes`} className="mt-4 block font-semibold">{t.wishes}</label>
    <textarea id={`${id}-wishes`} value={wishes} onChange={event => setWishes(event.target.value)} maxLength={700} rows={2} placeholder={t.placeholder} className="mt-2 w-full rounded-lg border border-[#bfd6df] bg-white p-3 text-base" />
    {error && <p role="alert" className="mt-2 font-semibold text-[#a61f2b]">{voucher && giftVoucherCents(voucherAmount) === null ? t.voucherError : t.error}</p>}
    <button type="submit" disabled={!ready} className="knop knop-navy mt-3 min-h-12 w-full whitespace-normal">{t.button} →</button>
    <p className="mt-3 text-sm leading-6">{kind === "custom" || wishes.trim() ? t.customCost : t.note}</p>
  </form>;
}
