// pdf.js is browser-only (needs DOMMatrix/canvas), so load it lazily on demand.
type PdfjsModule = typeof import("pdfjs-dist");

let pdfjsPromise: Promise<PdfjsModule> | null = null;

export function loadPdfjs(): Promise<PdfjsModule> {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const [lib, worker] = await Promise.all([
        import("pdfjs-dist"),
        import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
      ]);
      lib.GlobalWorkerOptions.workerSrc = (worker as { default: string }).default;
      return lib;
    })();
  }
  return pdfjsPromise;
}
