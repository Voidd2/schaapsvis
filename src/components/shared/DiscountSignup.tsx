"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { recordPopupStage, type PopupExperiment, type PopupMeasurement } from "@/lib/discount-popup";
import { discountConsentVersion, discountSignupCopy } from "@/lib/discount-signup";
import { SignupFacebookFollow } from "./SignupFacebookFollow";

type Offer = { experiment: PopupExperiment; headline: string; getMeasurement: () => PopupMeasurement | null };
export function DiscountSignup({ locale, offer }: { locale: string; offer?: Offer }) {
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
          email: form.get("email"), locale, form: offer?.experiment ?? "discounts",
          ...(offer
            ? { consentVersion: offer.experiment === "locations" ? "locations-weekly-offers-v1" : "varlaks-weekly-offers-v3", measurement: offer.getMeasurement() }
            : { consentVersion: discountConsentVersion }),
          // The offer's submit button explicitly requests marketing emails.
          consent: Boolean(offer) || form.get("consent") === "on",
        }),
      });
      if (response.status === 429) { setState("limited"); return; }
      if (!response.ok || (await response.json()).ok !== true) throw new Error("signup");
      try { localStorage.setItem("sv-discounts-subscribed", "1"); } catch { /* Storage is optional. */ }
      setState("success");
    } catch { setState("error"); }
  }

  return <div className="discount-signup">
    {state === "success" ? <div>
      <div><h2 tabIndex={-1} ref={node => { node?.focus(); }}>{t.success}</h2><p>{t.next}</p></div>
      <SignupFacebookFollow locale={locale} />
      <Link href={`/${locale}/assortiment`} className="collection-text-link">{t.range} →</Link>
    </div> : <>
      {offer && <><h2>{offer.headline}</h2><p>{t.offerIntro}</p></>}
      <form onSubmit={subscribe} method="post" aria-label={offer?.headline ?? t.title}>
        <label className="discount-email">{t.email}
          <input required name="email" type="email" autoComplete="email" maxLength={254} onBlur={event => {
            if (!event.currentTarget.value || !event.currentTarget.validity.valid) return;
            const measurement = offer?.getMeasurement();
            if (offer && measurement) recordPopupStage(offer.experiment, measurement, "filled");
          }} disabled={state === "sending"} />
        </label>
        {!offer && <label className="discount-consent"><input name="consent" type="checkbox" required disabled={state === "sending"} /><span>{t.consent}</span></label>}
        <button className="knop knop-navy" type="submit" disabled={state === "sending"}>{state === "sending" ? t.sending : offer ? t.offerSubmit : t.submit}</button>
        {state === "error" || state === "limited" ? <p role="alert">{state === "limited" ? t.limited : t.retry}</p> : null}
      </form>
      <noscript><style>{".discount-signup form{display:none}"}</style><p>{t.js}</p></noscript>
      <p className="discount-privacy">{offer ? t.offerUnsubscribe : t.unsubscribe} <Link href={`/${locale}/privacyverklaring#emailaanbiedingen`}>{offer ? t.offerPrivacy : t.privacy}</Link></p>
    </>}
  </div>;
}
