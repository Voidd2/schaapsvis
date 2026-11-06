"use client";

import { useId, useState, type FormEvent } from "react";
import { giftRequestCopy, giftRequestLink, giftPackageContents, giftVoucherCents, type GiftRequest as Request } from "@/lib/gift-request";
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
  const contents = giftPackageContents(locale, size)!;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const href = giftRequestLink(locale, { product, kind, size, fish, wishes, voucher, voucherAmount });
    if (!href) { setError(true); return; }
    setError(false);
    window.location.assign(href);
  }
  return <form onSubmit={submit} className="gift-request mt-5 border-t border-[#bfd6df] pt-4" aria-label={product}>
    {kind === "package" && <fieldset><legend className="mb-2 font-semibold">{t.size}</legend><div className="grid grid-cols-3 gap-2">
      {t.sizes.map((label, index) => <label key={label} className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border px-2 py-3 text-sm font-semibold ${size === index ? "border-[#075b82] bg-[#eaf7fc]" : "border-[#bfd6df] bg-white"}`}>
        <input type="radio" name={`${id}-size`} checked={size === index} onChange={() => setSize(index)} className="accent-[#075b82]" />{label}
      </label>)}
    </div><div className="mt-3 rounded-lg bg-white p-3" aria-live="polite"><p className="font-semibold">{t.contents}</p><ul className="mt-2 space-y-1 text-sm">{contents.lines.map(line => <li key={line}>{line}</li>)}</ul><p className="mt-2 font-semibold">{t.total}: {contents.total} g</p><p className="mt-2 text-sm leading-6">{t.net}</p></div></fieldset>}
    {kind === "trio" && <fieldset aria-describedby={`${id}-count`}><legend className="mb-2 font-semibold">{t.fish}</legend><div className="grid gap-2">
      {t.choices.map((label, index) => <label key={label} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 ${fish.includes(index) ? "border-[#075b82] bg-[#eaf7fc]" : "border-[#bfd6df] bg-white"}`}>
        <input type="checkbox" checked={fish.includes(index)} onChange={() => { setFish(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]); setError(false); }} className="h-4 w-4 accent-[#075b82]" />{label}
      </label>)}
    </div><p id={`${id}-count`} className="mt-2 text-sm" aria-live="polite">{fish.length} {t.selected}</p></fieldset>}
    <label className="mt-4 flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-[#bfd6df] bg-white p-3 font-semibold"><input type="checkbox" checked={voucher} onChange={event => { setVoucher(event.target.checked); setError(false); }} className="h-4 w-4 accent-[#075b82]" />{t.voucher}</label>
    {voucher && <div className="mt-3"><label htmlFor={`${id}-voucher`} className="block font-semibold">{t.voucherAmount}</label><input id={`${id}-voucher`} inputMode="decimal" type="text" value={voucherAmount} onChange={event => { setVoucherAmount(event.target.value); setError(false); }} maxLength={9} required aria-describedby={`${id}-voucher-hint`} className="mt-2 min-h-12 w-full rounded-lg border border-[#bfd6df] bg-white p-3 text-base" /><p id={`${id}-voucher-hint`} className="mt-2 text-sm leading-6">{t.voucherHint}</p></div>}
    <label htmlFor={`${id}-wishes`} className="mt-4 block font-semibold">{t.wishes}</label>
    <textarea id={`${id}-wishes`} value={wishes} onChange={event => setWishes(event.target.value)} maxLength={700} rows={2} placeholder={t.placeholder} className="mt-2 w-full rounded-lg border border-[#bfd6df] bg-white p-3 text-base" />
    {error && <p role="alert" className="mt-2 font-semibold text-[#a61f2b]">{voucher && giftVoucherCents(voucherAmount) === null ? t.voucherError : t.error}</p>}
    <button type="submit" disabled={!ready} className="knop knop-navy mt-3 min-h-12 w-full whitespace-normal">{t.button} →</button>
    <p className="mt-3 text-sm leading-6">{t.note}</p>
  </form>;
}
