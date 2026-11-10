"use client";

import { useEffect, useRef, useState } from "react";
import { allowsPopupAnalytics, popupHeadline, recordPopupStage, type PopupMeasurement, type PopupVariant } from "@/lib/varlaks-popup";
import { X } from "lucide-react";
import { DiscountSignup } from "@/components/shared/DiscountSignup";
import { discountSignupCopy } from "@/lib/discount-signup";
import styles from "./campaign.module.css";

const shownKey = "sv-varlaks-discount-shown";
let shownOnThisPage = false;

function alreadyShown() {
  if (shownOnThisPage) return true;
  try { return localStorage.getItem(shownKey) === "1"; }
  catch { return false; }
}

export function VarlaksDiscountOffer({ locale }: { locale: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [variant, setVariant] = useState<PopupVariant>("a");
  const measurement = useRef<PopupMeasurement | null>(null);
  const headline = popupHeadline(locale, variant);
  function getMeasurement(): PopupMeasurement | null {
    if (!open || !allowsPopupAnalytics() || document.hidden || !dialog.current?.open) return null;
    return measurement.current ??= { consent: true, id: crypto.randomUUID(), variant };
  }
  const copy = discountSignupCopy(locale);

  useEffect(() => {
    const element = dialog.current;
    if (!element || alreadyShown()) return;
    let timer: number;

    function schedule() {
      window.clearTimeout(timer);
      if (document.hidden || alreadyShown()) return;
      // Give people arriving via the film link a chance to start watching.
      // Starting the embedded film unmounts this offer and cancels its timer.
      timer = window.setTimeout(() => {
        if (!element?.isConnected || document.hidden || alreadyShown()) return;
        if (document.fullscreenElement || document.querySelector("dialog[open]") ||
            document.activeElement?.matches("input, textarea, select, #film button")) {
          schedule();
          return;
        }
        setVariant(crypto.getRandomValues(new Uint8Array(1))[0] < 128 ? "a" : "b");
        setOpen(true);
        shownOnThisPage = true;
        try { localStorage.setItem(shownKey, "1"); } catch { /* Still once during this page session. */ }
      }, location.hash === "#film" ? 10000 : 5000);
    }

    schedule();
    document.addEventListener("visibilitychange", schedule);
    window.addEventListener("hashchange", schedule);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    const recordShown = () => {
      if (!document.hidden && element.getBoundingClientRect().height > 0 && allowsPopupAnalytics()) {
        measurement.current ??= { consent: true, id: crypto.randomUUID(), variant };
        recordPopupStage(measurement.current, "shown");
      }
    };
    recordShown();
    document.addEventListener("visibilitychange", recordShown);
    window.addEventListener("storage", recordShown);
    window.addEventListener("sv-analytics-consent-change", recordShown);
    const previousFocus = document.activeElement;
    const observer = new ResizeObserver(position);
    let frame = 0;
    function position() {
      const banner = document.querySelector(".cookie-choice-banner");
      const offset = banner ? window.innerHeight - banner.getBoundingClientRect().top : 0;
      element?.style.setProperty("--cookie-space", Math.max(0, offset) + "px");
      if (banner) observer.observe(banner);
    }
    function afterChoice() { frame = requestAnimationFrame(position); }
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !document.querySelector("dialog:modal")) setOpen(false);
    }
    position();
    window.addEventListener("resize", position);
    window.addEventListener("sv-analytics-consent-change", afterChoice);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("visibilitychange", recordShown);
      window.removeEventListener("storage", recordShown);
      window.removeEventListener("sv-analytics-consent-change", recordShown);
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", position);
      window.removeEventListener("sv-analytics-consent-change", afterChoice);
      document.removeEventListener("keydown", onEscape);
      if (element.contains(document.activeElement) && previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [open, variant]);

  return <dialog ref={dialog} open={open} data-expanded={expanded || undefined} className={styles.offerDialog} aria-label={headline}>
    <button type="button" className={styles.offerClose} aria-label={copy.closeOffer} onClick={() => setOpen(false)}>
      <X size={22} aria-hidden="true" />
    </button>
    <button type="button" className={styles.offerInvite} onClick={() => {
      setExpanded(true);
      requestAnimationFrame(() => dialog.current?.querySelector("input")?.focus({ preventScroll: true }));
    }}>{headline} <span aria-hidden="true">→</span></button>
    <DiscountSignup locale={locale} offer={{ headline, getMeasurement }} />
  </dialog>;
}
