"use client";

import { isOpenNow } from "@/lib/openingHours";

export function OpenStatusBar() {
  const winkel = isOpenNow("winkel");
  const markt = isOpenNow("markt");
  const voorschoten = isOpenNow("voorschoten");

  return (
    <div
      className="text-xs py-2 px-4 text-center"
      style={{ backgroundColor: "#111c2a", color: "#e8d5b0" }}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap gap-x-8 gap-y-1 justify-center items-center">
        <span className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              winkel.open ? "bg-green-400" : "bg-red-400"
            }`}
          />
          <span>
            Winkel Herenstraat:{" "}
            <strong>
              {winkel.open
                ? `Open · sluit ${winkel.closesAt}`
                : "Gesloten"}
            </strong>
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              markt.open ? "bg-green-400" : "bg-gray-500"
            }`}
          />
          <span>
            Markt Leiden:{" "}
            <strong>
              {markt.open ? "Open nu" : "Woensdag & Zaterdag"}
            </strong>
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              voorschoten.open ? "bg-green-400" : "bg-gray-500"
            }`}
          />
          <span>
            Hoogvliet Voorschoten:{" "}
            <strong>
              {voorschoten.open ? "Open nu" : "Vrijdag"}
            </strong>
          </span>
        </span>
      </div>
    </div>
  );
}
