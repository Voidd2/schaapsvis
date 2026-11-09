"use client";

import { useEffect, useRef, useState } from "react";
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
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", position);
      window.removeEventListener("sv-analytics-consent-change", afterChoice);
      document.removeEventListener("keydown", onEscape);
      if (element.contains(document.activeElement) && previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [open]);

  return <dialog ref={dialog} open={open} data-expanded={expanded || undefined} className={styles.offerDialog} aria-label={copy.offerTitle}>
    <button type="button" className={styles.offerClose} aria-label={copy.closeOffer} onClick={() => setOpen(false)}>
      <X size={22} aria-hidden="true" />
    </button>
    <button type="button" className={styles.offerInvite} onClick={() => {
      setExpanded(true);
      requestAnimationFrame(() => dialog.current?.querySelector("input")?.focus({ preventScroll: true }));
    }}>{copy.offerTitle} <span aria-hidden="true">→</span></button>
    <DiscountSignup locale={locale} varlaksOffer />
  </dialog>;
}
