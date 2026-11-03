/** Shared client/server reply-address validation; no request is sent by this module. */
export function validEmail(value: string): boolean {
  return value.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
export function validPhone(value: string): boolean {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  return /^[+\d() .-]+$/.test(trimmed) && digits.length >= 7 && digits.length <= 15 && trimmed.length <= 40;
}
export function validContact(email: string, phone: string): boolean {
  return Boolean(email.trim() || phone.trim())
    && (!email.trim() || validEmail(email)) && (!phone.trim() || validPhone(phone));
}
