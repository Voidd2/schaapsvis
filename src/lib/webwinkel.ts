/** Public storefront URL only; never an API key or a payment checkout URL. */
export function webwinkelUrl(): string | null {
  const value = process.env.SUMUP_STORE_URL?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}
