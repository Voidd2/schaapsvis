"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { ShoppingBasket, X } from "lucide-react";
import { useCatalogRequest } from "@/lib/catalog-request-store";
import { cartText } from "@/lib/cart-copy";
import { RequestSummary } from "./RequestControls";
import { leesMandje, leesSamenstelling } from "@/lib/mandje";
export function CatalogCart() {
  const pathname = usePathname(), locale = useLocale();
  if (!/^\/(nl|en|de)\/(visschalen|feestdagen)(\/|$)/.test(pathname)) return null;
  return <CartPanel locale={locale} pathname={pathname} />;
}
function CartPanel({ locale, pathname }: { locale:string; pathname:string }) {
  const state = useCatalogRequest(), t = cartText(locale), dialog = useRef<HTMLDialogElement>(null), trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [hasPreviousSelection, setPreviousSelection] = useState(false);
  function showCart() {
    setPreviousSelection(leesMandje().length > 0 || Boolean(leesSamenstelling().schaal));
    dialog.current?.showModal();
    setOpen(true);
  }
  const count = Object.values(state.items).reduce((n, line) => n + line.quantity, 0);
  useEffect(() => { dialog.current?.close(); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = before; };
  }, [open]);
  return <>
    <button ref={trigger} type="button" className="catalog-cart-trigger" disabled={!state.ready} aria-label={`${t.open}: ${count} ${t.count}`} aria-haspopup="dialog" aria-expanded={open} aria-controls="catalog-cart" onClick={showCart}>
      <ShoppingBasket aria-hidden="true" size={27} /><span className="catalog-cart-count" aria-live="polite" aria-atomic="true">{count}</span>
    </button>
    <dialog ref={dialog} id="catalog-cart" className="catalog-cart-dialog" aria-labelledby="cart-title" onClose={() => { setOpen(false); trigger.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="catalog-cart-panel">
        <div className="cart-heading"><h2 id="cart-title">{t.title}</h2><button type="button" aria-label={t.close} onClick={() => dialog.current?.close()}><X aria-hidden="true" /></button></div>
        <RequestSummary locale={locale} hasPreviousSelection={hasPreviousSelection} />
      </div>
    </dialog>
  </>;
}
