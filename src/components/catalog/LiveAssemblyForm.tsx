"use client";
import { useState } from "react";
import { AssemblyForm, assemblyDefaults } from "./AssemblyFields";
import type { Assembly } from "@/lib/counter-selection";

export function LiveAssemblyForm(props:{locale:string;mode:Assembly;product:string;slug?:string}) {
  const [data,setData] = useState(() => assemblyDefaults(props.mode));
  return <AssemblyForm {...props} live={data} onEdit={form => {
    const values = new URLSearchParams();
    new FormData(form).forEach((value,key) => values.append(key,String(value)));
    setData(values);
  }}/>;
}
