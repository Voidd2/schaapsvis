import { AssemblyForm } from "./AssemblyFields";
import { LiveAssemblyForm } from "./LiveAssemblyForm";
import { BedieningSlot } from "./BedieningSlot";
import type { Assembly } from "@/lib/counter-selection";

export function CustomAssembly(props:{mode:Assembly;locale:string;product:string;slug?:string}) {
  const form = <AssemblyForm {...props}/>;
  return <div>
    <div className="composer-enhanced"><BedieningSlot fallback={form}><LiveAssemblyForm {...props}/></BedieningSlot></div>
    <noscript><style>{".composer-enhanced{display:none}"}</style>{form}</noscript>
  </div>;
}
