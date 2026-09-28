import { Schema } from "@/components/Schema";
import {
  winkelSchema,
  organisatieSchema,
  websiteSchema,
} from "@/lib/seo";

/**
 * De vaste gegevens die op elke pagina horen: de winkel, de organisatie, de
 * site zelf en de bezorgdienst.
 *
 * Wat er bewust NIET in staat: een aggregateRating met de Google-beoordelingen.
 * Google staat niet toe dat je beoordelingen die op een ándere site zijn
 * achtergelaten op je eigen site als sterrenwaardering markeert — dat levert in
 * het gunstigste geval niets op en in het ongunstigste een handmatige
 * maatregel. De beoordelingen worden wél gewoon getoond, met bronvermelding en
 * een link naar het Google-profiel, want daar mag je klanten prima op wijzen.
 */
export function JsonLd({ locale = "nl" }: { locale?: string }) {
  return (
    <Schema
      data={[
        winkelSchema(locale),
        organisatieSchema(),
        websiteSchema(locale),

      ]}
    />
  );
}
