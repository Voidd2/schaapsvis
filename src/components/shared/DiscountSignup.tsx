"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { discountSignupCopy } from "@/lib/discount-signup";

export function DiscountSignup({ locale, varlaksOffer = false }: {locale: string; varlaksOffer?: boolean}) {
  const t = discountSignupCopy(locale);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error" | "limited">("idle");

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = new FormData(event.currentTarget);
    setState("sending");
    try {
      const response = await fetch("/api/members/newsletter/subscribe", {
        method: "POST", credentials: "same-origin", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: form.get("email"), locale, form: varlaksOffer ? "varlaks" : "discounts",
          // The offer's submit button explicitly requests marketing emails.
          consent: varlaksOffer || form.get("consent") === "on",
        }),
      });
      if (response.status === 429) { setState("limited"); return; }
      if (!response.ok || (await response.json()).ok !== true) throw new Error("signup");
      setState("success");
    } catch { setState("error"); }
  }

  return <div className="discount-signup">
    {state === "success" ? <div>
      <div><h2 tabIndex={-1} ref={node => { node?.focus(); }}>{t.success}</h2><p>{t.next}</p></div>
      <Link href={`/${locale}/assortiment`} className="collection-text-link">{t.range} →</Link>
    </div> : <>
      {varlaksOffer && <><h2>{t.offerTitle}</h2><p>{t.offerIntro}</p></>}
      <form onSubmit={subscribe} method="post" aria-label={varlaksOffer ? t.offerTitle : t.title}>
        <label className="discount-email">{t.email}
          <input required name="email" type="email" autoComplete="email" maxLength={254} disabled={state === "sending"} />
        </label>
        {!varlaksOffer && <label className="discount-consent"><input name="consent" type="checkbox" required disabled={state === "sending"} /><span>{t.consent}</span></label>}
        <button className="knop knop-navy" type="submit" disabled={state === "sending"}>{state === "sending" ? t.sending : varlaksOffer ? t.offerSubmit : t.submit}</button>
        {state === "error" || state === "limited" ? <p role="alert">{state === "limited" ? t.limited : t.retry}</p> : null}
      </form>
      <noscript><style>{".discount-signup form{display:none}"}</style><p>{t.js}</p></noscript>
      <p className="discount-privacy">{t.unsubscribe} <Link href={`/${locale}/privacyverklaring#emailaanbiedingen`}>{t.privacy}</Link></p>
    </>}
  </div>;
}
