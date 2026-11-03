"use client";
import { useSyncExternalStore } from "react";
import { normalizeRequest, type CatalogRequest } from "./catalog-request";

const key = "schaapsvis-product-request-v1";
const empty = { items: {}, date: "", ready: false } as CatalogRequest & { ready: boolean };
let snapshot = empty;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!snapshot.ready) {
    let saved: unknown;
    try { saved = JSON.parse(sessionStorage.getItem(key) ?? "null"); } catch { /* Storage can be unavailable; keep an in-memory list. */ }
    snapshot = { ...normalizeRequest(saved), ready: true };
  }
  return () => { listeners.delete(listener); };
}
export function useCatalogRequest() { return useSyncExternalStore(subscribe, () => snapshot, () => empty); }
export function updateCatalogRequest(update: (current: CatalogRequest) => CatalogRequest) {
  if (!snapshot.ready) return;
  snapshot = { ...normalizeRequest(update(snapshot)), ready: true };
  try { sessionStorage.setItem(key, JSON.stringify({ items: snapshot.items, date: snapshot.date })); } catch { /* In-memory navigation still works. */ }
  listeners.forEach(listener => listener());
}
