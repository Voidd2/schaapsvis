"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./footer.module.css";

export function FooterPanel({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    function setLayout() {
      if (ref.current) ref.current.open = wide.matches;
    }
    setLayout();
    wide.addEventListener("change", setLayout);
    return () => wide.removeEventListener("change", setLayout);
  }, []);

  return (
    <details ref={ref} className={styles.panel}>
      <summary>{title}<ChevronDown size={18} aria-hidden="true" /></summary>
      <div className={styles.panelBody}>{children}</div>
    </details>
  );
}
