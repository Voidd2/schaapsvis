import { qrMatrix } from "@/lib/qr";

export function PassQrCode({ value, label }: { value: string; label: string }) {
  const matrix = qrMatrix(value);
  const quietZone = 4;
  const size = matrix.length + quietZone * 2;
  const path = matrix.flatMap((row, y) => row.map((dark, x) => dark ? `M${x + quietZone} ${y + quietZone}h1v1h-1z` : "")).join("");
  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges" className="size-36 rounded-xl bg-white p-2 shadow-sm">
      <rect width={size} height={size} fill="white" />
      <path d={path} fill="#073d56" />
    </svg>
  );
}
