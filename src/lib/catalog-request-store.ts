"use client";
import { cartOptions, selectionQuote } from "./cart-selection";
import { useSyncExternalStore } from "react";
import { normalizeRequest, type CatalogRequest } from "./catalog-request";

const key = "schaapsvis-product-request-v1";
const empty = { items: {}, date: "", ready: false } as CatalogRequest & { ready: boolean };
let snapshot = empty;
const listeners = new Set<() => void>();
function persist() {
  const selections = snapshot.selections?.map(({ id, options, note, needsNote }) => ({
    id, options, ...(note || needsNote ? { needsNote: true } : {}),
  }));
  try { sessionStorage.setItem(key, JSON.stringify({ items: snapshot.items, reselect: snapshot.reselect, date: snapshot.date, selections })); } catch { /* Storage optional. */ }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!snapshot.ready) {
    let saved: unknown;
    try { saved = JSON.parse(sessionStorage.getItem(key) ?? "null"); } catch { /* Storage can be unavailable; keep an in-memory list. */ }
    const clean = normalizeRequest(saved);
    snapshot = { items: clean.items, reselect:clean.reselect, date: clean.date, selections: clean.selections?.map(line => ({ id: line.id, options: line.options, needsNote: line.needsNote })), ready: true };
    // Migrate older split flags away; never restore or persist free-text wishes.
    persist();
  }
  return () => { listeners.delete(listener); };
}
export function useCatalogRequest() { return useSyncExternalStore(subscribe, () => snapshot, () => empty); }
export function updateCatalogRequest(update: (current: CatalogRequest) => CatalogRequest) {
  if (!snapshot.ready) return;
  snapshot = { ...normalizeRequest(update(snapshot)), ready: true };
  persist();
  listeners.forEach(listener => listener());
}

export const OPEN_CATALOG_CART = "schaapsvis:open-catalog-cart";
let pendingCartOpen = false;
export function takeCartOpenRequest() {
  const requested = pendingCartOpen;
  pendingCartOpen = false;
  return requested;
}
export function addCartSelection(data: URLSearchParams, locale: string, note = "") {
  if (!snapshot.ready || !selectionQuote(data, locale)) return false;
  const options = cartOptions(data);
  if (!selectionQuote(new URLSearchParams(options), locale)) return false;
  updateCatalogRequest(current => ({ ...current, reselect:false, selections: [
    ...(current.selections ?? []), { id: crypto.randomUUID(), options, note },
  ] }));
  pendingCartOpen = true;
  window.dispatchEvent(new Event(OPEN_CATALOG_CART));
  return true;
}
