"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  bewaarMandje,
  bewaarSamenstelling,
  leesSamenstelling,
  type MandjeRegel,
} from "@/lib/mandje";
import {
  LEGE_SAMENSTELLING,
  totaal as schaalTotaalVan,
  type Samenstelling,
} from "@/lib/visschaal";
import { BEZORGING, tekortVoorGratis } from "@/lib/bezorging";

interface WinkelwagenWaarde {
  regels: MandjeRegel[];
  samenstelling: Samenstelling;
  /** Aantal dingen in de wagen: de verse-visregels plus de schaal. */
  aantal: number;
  /** Het bedrag dat we hard kunnen maken — dus alleen de visschaal. */
  afrekenbaarBedrag: number;
  /** Wat er nog bij moet voor gratis bezorging. 0 = gehaald. */
  tekortGratis: number;
  /** Zit er verse vis in? Dan kan er geen totaalbedrag staan. */
  heeftWeegvis: boolean;
  open: boolean;
  zetOpen: (open: boolean) => void;

  verwijder: (slug: string) => void;
  wijzig: (slug: string, velden: Partial<MandjeRegel>) => void;
  zetRegels: Dispatch<SetStateAction<MandjeRegel[]>>;
  zetSamenstelling: Dispatch<SetStateAction<Samenstelling>>;
  leeg: () => void;
}

const Context = createContext<WinkelwagenWaarde | null>(null);

/**
 * De winkelwagen.
 *
 * Eén plek waar staat wat iemand wil bestellen, zodat de knop rechtsboven, het
 * paneel en het bestelformulier hetzelfde weten. Alles staat ook in
 * `localStorage`: wie de configurator invult, een dag later terugkomt en dan pas
 * bestelt, hoeft niet opnieuw te beginnen.
 */
export function WinkelwagenProvider({ children }: { children: ReactNode }) {
  const [regels, setRegels] = useState<MandjeRegel[]>([]);
  const [samenstelling, setSamenstelling] = useState<Samenstelling>(LEGE_SAMENSTELLING);
  const [open, zetOpen] = useState(false);
  const geladen = useRef(false);

  // De opslag bestaat op de server niet, dus dit kan pas na de eerste render.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRegels([]);
    setSamenstelling(leesSamenstelling());
    geladen.current = true;
  }, []);

  useEffect(() => {
    if (!geladen.current) return;
    bewaarMandje(regels);
  }, [regels]);

  useEffect(() => {
    if (!geladen.current) return;
    bewaarSamenstelling(samenstelling);
  }, [samenstelling]);

  const verwijder = useCallback((slug: string) => {
    setRegels((vorige) => vorige.filter((r) => r.slug !== slug));
  }, []);

  const wijzig = useCallback((slug: string, velden: Partial<MandjeRegel>) => {
    setRegels((vorige) =>
      vorige.map((r) => (r.slug === slug ? { ...r, ...velden } : r))
    );
  }, []);

  const leeg = useCallback(() => {
    setRegels([]);
    setSamenstelling(LEGE_SAMENSTELLING);
  }, []);

  const waarde = useMemo<WinkelwagenWaarde>(() => {
    const afrekenbaarBedrag = samenstelling.schaal ? schaalTotaalVan(samenstelling) : 0;
    return {
      regels,
      samenstelling,
      aantal: regels.length + (samenstelling.schaal ? 1 : 0),
      afrekenbaarBedrag,
      tekortGratis: afrekenbaarBedrag > 0 ? tekortVoorGratis(afrekenbaarBedrag) : BEZORGING.gratisVanaf,
      heeftWeegvis: regels.length > 0,
      open,
      zetOpen,
      verwijder,
      wijzig,
      zetRegels: setRegels,
      zetSamenstelling: setSamenstelling,
      leeg,
    };
  }, [regels, samenstelling, open, verwijder, wijzig, leeg]);

  return <Context.Provider value={waarde}>{children}</Context.Provider>;
}

export function useWinkelwagen(): WinkelwagenWaarde {
  const waarde = useContext(Context);
  if (!waarde) {
    throw new Error("useWinkelwagen moet binnen <WinkelwagenProvider> staan");
  }
  return waarde;
}
