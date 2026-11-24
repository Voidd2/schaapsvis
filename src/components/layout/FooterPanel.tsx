"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function FooterPanel({ title, children, className }: { title: string; children: ReactNode; className: string }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    function setLayout() {
      if (ref.current) ref.current.open = wide.matches;
    }
    // On mobile, a visitor may already have opened the native disclosure.
    if (wide.matches) setLayout();
    wide.addEventListener("change", setLayout);
    return () => wide.removeEventListener("change", setLayout);
  }, []);

  return (
    <details ref={ref} className={className}>
      <summary>{title}<ChevronDown size={18} aria-hidden="true" /></summary>
      <div>{children}</div>
    </details>
  );
}
