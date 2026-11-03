"use client";
import { useEffect, useState } from "react";
import { amsterdamToday } from "./pickup-date";
export function usePickupToday() {
  const [today, setToday] = useState("");
  useEffect(() => {
    const refresh = () => setToday(amsterdamToday());
    refresh();
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, []);
  return today;
}
