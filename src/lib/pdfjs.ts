import * as pdfjsLib from "pdfjs-dist";
// Vite will bundle the worker as a URL asset
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export { pdfjsLib };
