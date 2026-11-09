export const SALAD_REQUESTS = [
  { slug: "extra-krabsalade-100g", names: ["Krabsalade", "Crab salad", "Krabbensalat"], image: "/images/editorial/salade-krab-toonbank.webp", productSlug: "krabsalade" },
  { slug: "extra-krab-mangosalade-100g", names: ["Krab-mangosalade", "Crab and mango salad", "Krabben-Mango-Salat"], image: "/images/editorial/salade-krab-mango-toonbank.webp", productSlug: null },
  { slug: "extra-zalm-wasabisalade-100g", names: ["Zalm-wasabisalade", "Salmon and wasabi spread", "Lachs-Wasabi-Salat"], image: "/images/editorial/salade-zalm-wasabi-toonbank.webp", productSlug: null },
  { slug: "extra-tonijnsalade-100g", names: ["Tonijnsalade", "Tuna salad", "Thunfischsalat"], image: "/images/editorial/salade-tonijn-toonbank.webp", productSlug: "tonijnsalade" },
] as const;

export const SALAD_PORTION_CENTS = 350;

// Older carts requested tubs of an unspecified weight. Keep those enquiries intact.
export function saladLine(slug: string) {
  const portion = SALAD_REQUESTS.find(s => s.slug === slug);
  if (portion) return { names: portion.names, cents: SALAD_PORTION_CENTS };
  if (slug === "extra-zalmsalade") return { names: ["Zalmsalade", "Salmon salad", "Lachssalat"], cents: null };
  const previous = SALAD_REQUESTS.find(s => s.slug === slug + "-100g" && s.slug !== "extra-zalm-wasabisalade-100g");
  return previous ? { names: previous.names, cents: null } : undefined;
}
