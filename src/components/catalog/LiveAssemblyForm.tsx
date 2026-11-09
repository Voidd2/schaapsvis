"use client";
import { addCartSelection, useCatalogRequest } from "@/lib/catalog-request-store";
import { useState } from "react";
import { AssemblyForm, assemblyDefaults } from "./AssemblyFields";
import type { Assembly } from "@/lib/counter-selection";

export function LiveAssemblyForm(props:{locale:string;mode:Assembly;product:string;slug?:string}) {
  const [data,setData] = useState(() => assemblyDefaults(props.mode));
  const { ready } = useCatalogRequest();
  const [error, setError] = useState(false);
  function readForm(form: HTMLFormElement) {
    const values = new URLSearchParams();
    new FormData(form).forEach((value, key) => values.append(key, String(value)));
    return values;
  }
  return <AssemblyForm {...props} live={data} ready={ready} error={error}
    onEdit={form => { setData(readForm(form)); setError(false); }}
    onAdd={form => {
      const values = readForm(form);
      setError(!addCartSelection(values, props.locale, values.get("wishes") ?? ""));
    }} />;
}
