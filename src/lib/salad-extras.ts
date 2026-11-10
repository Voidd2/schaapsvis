export const SALAD_PORTION_CENTS = 350;
export const SALAD_REQUESTS = [
  { slug: "extra-krabsalade-100g", names: ["Krabsalade", "Crab salad", "Krabbensalat"], cents: SALAD_PORTION_CENTS, image: "/images/editorial/salade-krab-toonbank.webp", productSlug: "krabsalade" },
  { slug: "extra-krab-mangosalade-100g", names: ["Krab-mangosalade", "Crab and mango salad", "Krabben-Mango-Salat"], cents: SALAD_PORTION_CENTS, image: "/images/editorial/salade-krab-mango-toonbank.webp", productSlug: null },
  { slug: "extra-zalm-wasabisalade-100g", names: ["Zalm-wasabisalade", "Salmon and wasabi spread", "Lachs-Wasabi-Salat"], cents: SALAD_PORTION_CENTS, image: "/images/editorial/salade-zalm-wasabi-toonbank.webp", productSlug: null },
  { slug: "extra-tonijnsalade-100g", names: ["Tonijnsalade", "Tuna salad", "Thunfischsalat"], cents: SALAD_PORTION_CENTS, image: "/images/editorial/salade-tonijn-toonbank.webp", productSlug: "tonijnsalade" },
  { slug: "extra-pikante-tonijnsalade-100g", names: ["Pikante tonijnsalade", "Spicy tuna salad", "Pikanter Thunfischsalat"], cents: SALAD_PORTION_CENTS, image: "/images/editorial/salade-pikante-tonijn-toonbank.webp", productSlug: null },
  { slug: "extra-haring-mosterdsalade-100g", names: ["Haring-mosterdsalade", "Herring and mustard salad", "Herings-Senf-Salat"], cents: 250, image: "/images/editorial/salade-haring-mosterd-toonbank.webp", productSlug: null },
] as const;


// Older carts requested tubs of an unspecified weight. Keep those enquiries intact.
export function saladLine(slug: string) {
  const portion = SALAD_REQUESTS.find(s => s.slug === slug);
  if (portion) return { names: portion.names, cents: portion.cents };
  if (slug === "extra-zalmsalade") return { names: ["Zalmsalade", "Salmon salad", "Lachssalat"], cents: null };
  const previous = SALAD_REQUESTS.find(s => s.slug === slug + "-100g" && s.slug !== "extra-zalm-wasabisalade-100g");
  return previous ? { names: previous.names, cents: null } : undefined;
}
