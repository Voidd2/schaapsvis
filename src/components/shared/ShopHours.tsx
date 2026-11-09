import { openingRows } from "@/lib/openingHours";

export function ShopHours({ locale }: { locale: string }) {
  return (
    <dl className="shop-week">
      {openingRows("winkel", locale).map(({ day, label, time }) => (
        <div key={day}><dt>{label}</dt><dd>{time}</dd></div>
      ))}
    </dl>
  );
}
