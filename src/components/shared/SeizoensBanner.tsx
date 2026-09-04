import Link from "next/link";
import { viskalenderData } from "@/lib/viskalender";
import { aanbiedingVanDeWeek } from "@/lib/aanbieding";

// Server component: bepaalt de maand bij het renderen (pagina's zijn dynamisch),
// dus het bericht is altijd actueel — zonder handwerk. Toont:
//  - een handmatige aanbieding (indien ingesteld in aanbieding.ts), anders
//  - automatisch het seizoenshoogtepunt uit de viskalender, met een
//    feestdagen-/seizoens-CTA in de juiste maanden.
export function SeizoensBanner({ locale }: { locale: string }) {
  const m = new Date().getMonth(); // 0 = januari
  const maand = viskalenderData[m];

  let cta = { label: "Bekijk het assortiment", href: `/${locale}/assortiment` };
  let extra = "";
  if (m === 11) {
    extra = "De feestdagen komen eraan — reserveer op tijd uw feestschotel.";
    cta = { label: "Feestschotel reserveren", href: `/${locale}/bestellen?product=feestschotel` };
  } else if (m >= 4 && m <= 7) {
    extra = "Het is Hollandse Nieuwe-seizoen — vers van de kraam.";
    cta = { label: "Haring bestellen", href: `/${locale}/bestellen?product=haring` };
  } else if (m === 8 || m === 9 || m === 10) {
    extra = "Mosselseizoen — de Zeeuwse mossel is nu op zijn best.";
  }

  const titel = aanbiedingVanDeWeek?.titel ?? "Deze maand op zijn best";
  // Het maandhoogtepunt noemt het seizoen vaak al ("Mosselseizoen start …").
  // Dan de seizoenszin er niet nóg eens achter plakken — dat leest als een
  // machine die twee bronnen aan elkaar knoopt.
  const hoogtepunt = maand?.hoogtepunt ?? "";
  const eersteWoord = hoogtepunt.split(/[\s—·,]/)[0].toLowerCase();
  const dubbelop = eersteWoord.length > 3 && extra.toLowerCase().includes(eersteWoord);
  const tekst =
    aanbiedingVanDeWeek?.tekst ??
    [hoogtepunt, dubbelop ? "" : extra].filter(Boolean).join(" · ");

  return (
    <section style={{ backgroundColor: "var(--gold)" }} className="px-6 py-3.5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <p className="text-[11px] uppercase tracking-widest font-bold" style={{ color: "var(--navy-dark)" }}>
            {titel}
          </p>
          <p className="text-sm font-medium" style={{ color: "var(--navy-dark)" }}>
            {tekst}
          </p>
        </div>
        <Link
          href={cta.href}
          className="flex-shrink-0 text-sm font-semibold px-5 py-2.5 text-white whitespace-nowrap transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--navy)" }}
        >
          {cta.label} &rarr;
        </Link>
      </div>
    </section>
  );
}
