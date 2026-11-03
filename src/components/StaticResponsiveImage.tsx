import Image, { type ImageProps } from "next/image";
import manifest from "@/lib/static-image-variants.json";

const variants: Record<string, { variants: { src: string; width: number }[] }> = manifest;

/** Existing photo, prebuilt sizes: works without a paid runtime optimizer. */
export function StaticResponsiveImage(props: ImageProps) {
  const entry = typeof props.src === "string" ? variants[props.src] : undefined;
  if (!entry) return <Image {...props} alt={props.alt} />;
  return (
    <picture style={{ display: "contents" }}>
      <source type="image/webp" sizes={props.sizes}
        srcSet={entry.variants.map(image => `${image.src} ${image.width}w`).join(", ")} />
      <Image {...props} alt={props.alt} />
    </picture>
  );
}
