"use client";

import { useEffect, useRef } from "react";
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
        element.showModal();
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

  return <dialog ref={dialog} className={styles.offerDialog} aria-label={copy.offerTitle}>
    <button type="button" className={styles.offerClose} aria-label={copy.closeOffer} onClick={() => dialog.current?.close()}>
      <X size={22} aria-hidden="true" />
    </button>
    <DiscountSignup locale={locale} varlaksOffer />
  </dialog>;
}
