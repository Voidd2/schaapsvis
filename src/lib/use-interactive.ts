"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

/** Keep server-rendered controls inert until their handlers can retain input. */
export function useInteractive() {
  return useSyncExternalStore(subscribe, clientReady, serverReady);
}
