/** Switch on to reopen the seasonal pages, their links and their order forms. */
export const seasonalCatalogOpen = false;

const seasonalPath = /^\/(?:(?:nl|en|de)\/)?(?:feestdagen|barbecue-gourmet|gourmetschotel|visschalen|relatiegeschenken|bestellen|bezorgen)(?:[/?#.]|$)/i;
export function seasonalPathPaused(path: string) {
  return !seasonalCatalogOpen && seasonalPath.test(path);
}

export function publicLink(link: { href: string }) {
  return !seasonalPathPaused(link.href);
}
