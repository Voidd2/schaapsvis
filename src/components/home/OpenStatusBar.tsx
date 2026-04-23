"use client";

import { getLocationStatus } from "@/lib/openingHours";

export function OpenStatusBar() {
  const winkel = getLocationStatus("winkel");
  const markt = getLocationStatus("markt");

  return (
    <div
      className="text-xs py-2 px-4 text-center"
      style={{ backgroundColor: "#111c2a", color: "#e8d5b0" }}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap gap-x-8 gap-y-1 justify-center items-center">
        <span className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              winkel.isOpen ? "bg-green-400" : "bg-amber-400"
            }`}
          />
          <span>
            Winkel Herenstraat: <strong>{winkel.label}</strong>
          </span>
        </span>

        <span className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              markt.isOpen ? "bg-green-400" : "bg-amber-400"
            }`}
          />
          <span>
            Markt Leiden: <strong>{markt.label}</strong>
          </span>
        </span>

        <span className="flex items-center gap-2 opacity-70">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-amber-400" />
          <span>
            Voorschoten (Hoogvliet): <strong>Elke vrijdag</strong>
          </span>
        </span>
      </div>
    </div>
  );
}
