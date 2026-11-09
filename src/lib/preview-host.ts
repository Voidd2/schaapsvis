export function isWorkerPreview(host:string|null) {
  const hostname = (host ?? "").toLowerCase().split(":")[0];
  return hostname.endsWith(".workers.dev") || hostname === "preview.schaapsvishandel.nl";
}
