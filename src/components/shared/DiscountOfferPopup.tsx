"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { allowsPopupAnalytics, popupHeadline, recordPopupStage, type PopupExperiment, type PopupMeasurement, type PopupVariant } from "@/lib/discount-popup";
import { X } from "lucide-react";
import { DiscountSignup } from "@/components/shared/DiscountSignup";
import { discountSignupCopy } from "@/lib/discount-signup";
import styles from "./DiscountOfferPopup.module.css";

const shownInSession = new Set<PopupExperiment>();
const popupCooldownMs = 7 * 24 * 60 * 60 * 1000;
const excludedPath = /\/(?:account|beheer|studentenkorting|kortingsbon|bestellen)(?:\/|$)/;

function alreadyShown(experiment: PopupExperiment) {
  if (shownInSession.has(experiment)) return true;
  try {
    if (localStorage.getItem("sv-discounts-subscribed") === "1") return true;
    const timestamp = Number(localStorage.getItem(`sv-${experiment}-discount-shown-at`));
    return Number.isFinite(timestamp) && Date.now() - timestamp < popupCooldownMs;
  } catch { return false; }
}

function randomVariant(): PopupVariant {
  const value = crypto.getRandomValues(new Uint8Array(1))[0] % 3;
  return value === 0 ? "a" : value === 1 ? "b" : "c";
}

export function DiscountOfferPopup({ locale, experiment, enabled = true }: { locale: string; experiment: PopupExperiment; enabled?: boolean }) {
  const pathname = usePathname() || `/${locale}`;
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<PopupVariant>("a");
  const measurement = useRef<PopupMeasurement | null>(null);
  const headline = popupHeadline(experiment, locale, variant);
  const copy = discountSignupCopy(locale);

  function getMeasurement(): PopupMeasurement | null {
    if (!open || !allowsPopupAnalytics() || document.hidden || !dialog.current?.open) return null;
    return measurement.current ??= { consent: true, id: crypto.randomUUID(), variant };
  }

  useEffect(() => {
    const element = dialog.current;
    if (!element || !enabled || excludedPath.test(pathname) || alreadyShown(experiment)) return;
    let timer = 0;

    function schedule() {
      window.clearTimeout(timer);
      if (document.hidden || excludedPath.test(pathname) || alreadyShown(experiment)) return;
      timer = window.setTimeout(() => {
        if (!element?.isConnected || document.hidden || excludedPath.test(pathname) || alreadyShown(experiment)) return;
        if (document.fullscreenElement || document.querySelector('dialog[open], .cookie-choice-banner[data-customizing], .cookie-choice-banner[aria-busy="true"]') ||
            document.activeElement?.matches("input, textarea, select, #film button")) {
          schedule();
          return;
        }
        setVariant(randomVariant());
        measurement.current = null;
        setOpen(true);
        shownInSession.add(experiment);
        try { localStorage.setItem(`sv-${experiment}-discount-shown-at`, String(Date.now())); } catch { /* Still once per page session. */ }
      }, 12000);
    }

    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [enabled, experiment, pathname]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element?.open) return;
    const recordShown = () => {
      if (!document.hidden && element.getBoundingClientRect().height > 0 && allowsPopupAnalytics()) {
        measurement.current ??= { consent: true, id: crypto.randomUUID(), variant };
        recordPopupStage(experiment, measurement.current, "shown");
      }
    };
    recordShown();
    document.addEventListener("visibilitychange", recordShown);
    window.addEventListener("storage", recordShown);
    window.addEventListener("sv-analytics-consent-change", recordShown);
    return () => {
      document.removeEventListener("visibilitychange", recordShown);
      window.removeEventListener("storage", recordShown);
      window.removeEventListener("sv-analytics-consent-change", recordShown);
    };
  }, [open, variant, experiment]);

  return <dialog ref={dialog} className={styles.offerDialog} aria-label={headline} onClose={() => setOpen(false)}>
    <div className={styles.offerImageFrame}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.offerImage} src="/images/newsletter-signup-popup.png" alt={copy.popupImageAlt} width={852} height={480} />
      <button type="button" className={styles.offerClose} aria-label={copy.closeOffer} onClick={() => setOpen(false)}>
        <X size={22} aria-hidden="true" />
      </button>
    </div>
    <div className={styles.offerBody}>
      <DiscountSignup locale={locale} offer={{
        experiment,
        headline,
        getMeasurement,
      }} />
    </div>
  </dialog>;
}
