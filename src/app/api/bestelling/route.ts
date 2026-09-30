import { NextResponse } from "next/server";
import { BEDRIJF } from "@/lib/bedrijf";

/**
 * A visschaalprijs is an average guide, not a confirmed quote. Do not accept
 * an automated order or payment before the shop agrees contents and price.
 */
export async function POST() {
  const bericht = encodeURIComponent(
    "Hallo Schaap’s Vishandel, ik wil graag een visschaal aanvragen. Kunt u met mij meedenken over de samenstelling en de definitieve prijs?"
  );

  return NextResponse.json(
    {
      fout: "Visschalen vraagt u aan via WhatsApp. We stemmen samen de inhoud en definitieve prijs af.",
      whatsapp: `https://wa.me/${BEDRIJF.whatsapp}?text=${bericht}`,
    },
    { status: 410 }
  );
}
