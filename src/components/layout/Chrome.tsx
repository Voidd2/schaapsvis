import type { ReactNode } from "react";
/** One consistent identity; checkout is hosted by SumUp. */
export function Chrome({ header, footer, extras, children }: {
  header: ReactNode; footer: ReactNode; extras: ReactNode; children: ReactNode;
}) {
  return <>{header}<main id="inhoud" className="flex-1">{children}</main>{footer}{extras}</>;
}
