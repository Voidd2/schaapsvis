export function isWorkerPreview(host:string|null) {
  return (host??"").toLowerCase().split(":")[0].endsWith(".workers.dev");
}
