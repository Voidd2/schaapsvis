export const PAGE_SIZE = 9;
export function listPage(value: string | string[] | undefined, count: number) {
  const last = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const n = typeof value === "string" && /^[1-9]\d*$/.test(value) ? Number(value) : 1;
  return { page: Math.min(n, last), last };
}
export function pagePath(path: string, n: number) { return n > 1 ? path + "?pagina=" + n : path; }
