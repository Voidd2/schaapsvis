import Image, { type ImageProps } from "next/image";
import manifest from "@/lib/static-image-variants.json";

type Variant = { src: string; width: number };
const variants: Record<string, { variants: Variant[]; heroAvif?: Variant[] }> = manifest;
const toSrcSet = (images: Variant[]) => images.map(image => `${image.src} ${image.width}w`).join(", ");

/** Existing photos in prebuilt sizes. The storefront hero also has a landscape AVIF crop. */
export function StaticResponsiveImage({ storefrontHero = false, ...props }: ImageProps & { storefrontHero?: boolean }) {
  const entry = typeof props.src === "string" ? variants[props.src] : undefined;
  if (!entry) return <Image {...props} alt={props.alt} />;
  const heroSet = storefrontHero && entry.heroAvif ? toSrcSet(entry.heroAvif) : undefined;
  return <>
    {heroSet && <link rel="preload" as="image" type="image/avif" href={entry.heroAvif?.[0].src} imageSrcSet={heroSet}
      imageSizes={props.sizes} fetchPriority="high" />}
    <picture style={{ display: "contents" }}>
      {heroSet && <source type="image/avif" sizes={props.sizes} srcSet={heroSet} />}
      <source type="image/webp" sizes={props.sizes} srcSet={toSrcSet(entry.variants)} />
      <Image {...props} alt={props.alt} />
    </picture>
  </>;
}
