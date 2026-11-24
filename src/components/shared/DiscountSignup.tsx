"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { recordPopupStage, type PopupExperiment, type PopupMeasurement } from "@/lib/discount-popup";
import { discountConsentVersion, discountSignupCopy, newsletterLandingConsentVersion, popupConsentVersions } from "@/lib/discount-signup";
import { SignupFacebookFollow } from "./SignupFacebookFollow";
import { signupVisitComplete, visitAtSignup } from "@/lib/signup-visit";
import { recordJourneyStep } from "@/lib/visitor-journey.mjs";

type Offer = { experiment: PopupExperiment; headline: string; intro?: string; getMeasurement: () => PopupMeasurement | null };
export function DiscountSignup({ locale, offer, newsletterLanding = false }: { locale: string; offer?: Offer; newsletterLanding?: boolean }) {
  const t = discountSignupCopy(locale);
  const formName = offer?.experiment ?? (newsletterLanding ? "newsletter-landing" : "discounts");
  const consentByButton = Boolean(offer) || newsletterLanding;
  const submitText = newsletterLanding ? t.landingSubmit : offer ? t.offerSubmit : t.submit;
  const [state, setState] = useState<"idle" | "sending" | "success" | "error" | "limited">("idle");

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = new FormData(event.currentTarget);
    setState("sending");
    try {
      const visit = await visitAtSignup();
      const response = await fetch("/api/members/newsletter/subscribe", {
        method: "POST", credentials: "same-origin", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: form.get("email"), locale, form: formName, visit,
          ...(offer
            ? { consentVersion: popupConsentVersions[offer.experiment], measurement: offer.getMeasurement() }
            : { consentVersion: newsletterLanding ? newsletterLandingConsentVersion : discountConsentVersion }),
          consent: consentByButton || form.get("consent") === "on",
        }),
      });
      if (response.status === 429) { recordJourneyStep("signupError"); setState("limited"); return; }
      if (!response.ok || (await response.json()).ok !== true) throw new Error("signup");
      signupVisitComplete(visit);
      recordJourneyStep("subscribed");
      try { localStorage.setItem("sv-discounts-subscribed", "1"); } catch { /* Storage is optional. */ }
      setState("success");
    } catch { recordJourneyStep("signupError"); setState("error"); }
  }

  return <div className="discount-signup">
    {state === "success" ? <div>
      <div><h2 tabIndex={-1} ref={node => { node?.focus(); }}>{t.success}</h2><p>{t.next}</p></div>
      {!newsletterLanding && <SignupFacebookFollow locale={locale} />}
      <Link href={`/${locale}/assortiment`} className="collection-text-link">{t.range} →</Link>
    </div> : <>
      {offer && <><h2>{offer.headline}</h2>{offer.intro ? <p>{offer.intro}</p> : null}</>}
      <form data-newsletter-form={formName} onSubmit={subscribe} method="post" aria-label={offer?.headline ?? (newsletterLanding ? t.landingSubmit : t.title)}>
        <label className="discount-email">{t.email}
          <input required name="email" type="email" autoComplete="email" maxLength={254} onBlur={event => {
            if (!event.currentTarget.value || !event.currentTarget.validity.valid) return;
            const measurement = offer?.getMeasurement();
            if (offer && measurement) recordPopupStage(offer.experiment, measurement, "filled");
          }} disabled={state === "sending"} />
        </label>
        {!consentByButton && <label className="discount-consent"><input name="consent" type="checkbox" required disabled={state === "sending"} /><span>{t.consent}</span></label>}
        <button className="knop knop-navy" type="submit" disabled={state === "sending"}>{state === "sending" ? t.sending : submitText}</button>
        {state === "error" || state === "limited" ? <p role="alert">{state === "limited" ? t.limited : t.retry}</p> : null}
      </form>
      <noscript><style>{".discount-signup form{display:none}"}</style><p>{t.js}</p></noscript>
      <p className="discount-privacy">{consentByButton ? t.offerUnsubscribe : t.unsubscribe} <Link href={`/${locale}/privacyverklaring#emailaanbiedingen`}>{consentByButton ? t.offerPrivacy : t.privacy}</Link></p>
    </>}
  </div>;
}
