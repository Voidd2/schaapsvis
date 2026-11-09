"use client";
import { Component, type ReactNode } from "react";

/** A failed optional import must not replace the server-rendered catalogue. */
export class BedieningSlot extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? (this.props.fallback ?? null) : this.props.children; }
}
