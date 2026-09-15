import { NextResponse } from "next/server";
/** Retired custom checkout: orders belong in the SumUp store. */
export async function POST() {
  return NextResponse.json({ code: "ORDERING_MOVED", message: "Please use the store linked on /nl/bestellen." }, { status: 410 });
}
