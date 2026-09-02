import { useCallback, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Loader2, Download, FileText, X, Info } from "lucide-react";
import { FileDropZone } from "./file-drop-zone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { loadPdfjs } from "@/lib/pdfjs";
import { formatBytes, downloadBlob, isEncryptedError, safeRenderScale } from "@/lib/pdf-utils";

type Quality = "low" | "medium" | "high";
const QUALITY_MAP: Record<Quality, { jpeg: number; scale: number; label: string }> = {
  low: { jpeg: 0.4, scale: 0.75, label: "Low (smallest file)" },
  medium: { jpeg: 0.6, scale: 1.0, label: "Medium (balanced)" },
  high: { jpeg: 0.75, scale: 1.25, label: "High (best quality)" },
};

export function PdfCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [quality, setQuality] = useState<Quality>("medium");
  const [method, setMethod] = useState<"original" | "optimized" | "rasterized" | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bytesRef = useRef<ArrayBuffer | null>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!(f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))) {
      toast.error("Please select a PDF file");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      toast.warning(`Large file (${formatBytes(f.size)}) — compression may be slow on this device.`);
    }
    try {
      const bytes = await f.arrayBuffer();
      try {
        await PDFDocument.load(bytes.slice(0));
      } catch (err) {
        if (isEncryptedError(err)) {
          toast.error("This PDF is password-protected and can't be processed");
          return;
        }
        throw err;
      }
      bytesRef.current = bytes;
      setFile(f);
      setOriginalSize(f.size);
      setResultSize(null);
      setResultBytes(null);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't read this PDF — it may be corrupted");
    }
  }, []);

  const reset = () => {
    setFile(null);
    setOriginalSize(0);
    setResultSize(null);
    setResultBytes(null);
    setProgress(0);
    bytesRef.current = null;
  };

  const compress = async () => {
    if (!bytesRef.current || !file) return;
    setBusy(true);
    setProgress(0);
    setResultBytes(null);
    setResultSize(null);
    try {
      const original = new Uint8Array(bytesRef.current.slice(0));
      const candidates: Uint8Array[] = [original];

      // Strategy A: lossless re-save — strip metadata, use object streams.
      try {
        const doc = await PDFDocument.load(bytesRef.current.slice(0), { updateMetadata: false });
        doc.setTitle("");
        doc.setAuthor("");
        doc.setSubject("");
        doc.setKeywords([]);
        doc.setProducer("");
        doc.setCreator("");
        candidates.push(await doc.save({ useObjectStreams: true }));
      } catch (err) {
        if (isEncryptedError(err)) throw err;
        console.error(err);
      }
      setProgress(10);

      // Strategy B: rasterize pages as JPEG (great for scans, bad for text-only).
      try {
        const { jpeg, scale } = QUALITY_MAP[quality];
        const pdfjsLib = await loadPdfjs();
        const pdf = await pdfjsLib.getDocument({ data: bytesRef.current.slice(0) }).promise;
        const out = await PDFDocument.create();
        const total = pdf.numPages;
        // Reuse a single canvas: phones cap how many/how large canvases can exist.
        const canvas = document.createElement("canvas");
        for (let i = 1; i <= total; i++) {
          const page = await pdf.getPage(i);
          const base = page.getViewport({ scale: 1 });
          const safeScale = safeRenderScale(base.width, base.height, scale);
          const viewport = page.getViewport({ scale: safeScale });
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          const ctx = canvas.getContext("2d")!;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;
          const jpgBytes = dataUrlToUint8(canvas.toDataURL("image/jpeg", jpeg));
          const img = await out.embedJpg(jpgBytes);
          const newPage = out.addPage([base.width, base.height]);
          newPage.drawImage(img, { x: 0, y: 0, width: base.width, height: base.height });
          setProgress(10 + Math.round((i / total) * 85));
        }
        canvas.width = 0;
        canvas.height = 0;
        candidates.push(await out.save({ useObjectStreams: true }));
      } catch (err) {
        if (isEncryptedError(err)) throw err;
        console.error(err);
      }

      // Keep whichever result is smallest — never hand back a bigger file.
      const best = candidates.reduce((a, b) => (b.byteLength < a.byteLength ? b : a));
      setProgress(100);
      setResultBytes(best);
      setResultSize(best.byteLength);
      setMethod(best === original ? "original" : best === candidates[1] ? "optimized" : "rasterized");
      if (best === original) {
        toast.info("This PDF is already well optimised — kept the original file.");
      } else {
        toast.success("Compression complete");
      }
    } catch (err) {
      console.error(err);
      if (isEncryptedError(err)) toast.error("This PDF is password-protected and can't be processed");
      else toast.error("Failed to compress PDF");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!resultBytes || !file) return;
    const base = file.name.replace(/\.pdf$/i, "");
    downloadBlob(resultBytes, `${base}-compressed.pdf`);
  };

  const reduction = resultSize !== null && originalSize > 0
    ? Math.round((1 - resultSize / originalSize) * 100)
    : null;

  if (!file) {
    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors min-h-[200px] ${
          dragOver ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50"
        }`}
      >
        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Drop a PDF here or tap to browse</p>
        <p className="text-xs text-muted-foreground mt-1">Reduce file size for sharing and storage</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) loadFile(e.target.files[0]);
            e.target.value = "";
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-3 p-3">
        <FileText className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">Original: {formatBytes(originalSize)}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={reset} aria-label="Remove">
          <X className="h-4 w-4" />
        </Button>
      </Card>

      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Label className="text-sm">Quality</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" aria-label="Quality information" className="text-muted-foreground hover:text-foreground min-h-[24px] min-w-[24px] flex items-center justify-center">
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Results vary by PDF. Text-heavy PDFs won't shrink much — there's little to compress.
                PDFs with large embedded photos or scans see the biggest reductions.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <RadioGroup value={quality} onValueChange={(v) => setQuality(v as Quality)} disabled={busy} className="grid gap-2">
          {(Object.keys(QUALITY_MAP) as Quality[]).map((q) => (
            <label
              key={q}
              htmlFor={`q-${q}`}
              className="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:bg-accent/50 min-h-11"
            >
              <RadioGroupItem value={q} id={`q-${q}`} />
              <span className="text-sm">{QUALITY_MAP[q].label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {resultSize !== null && (
        <Card className="p-4 bg-accent/30">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Compressed size</p>
              <p className="text-lg font-semibold">{formatBytes(resultSize)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Change</p>
              <p className={`text-lg font-semibold ${reduction !== null && reduction > 0 ? "text-primary" : ""}`}>
                {reduction !== null && reduction >= 0 ? `-${reduction}%` : `+${Math.abs(reduction ?? 0)}%`}
              </p>
            </div>
          </div>
          {method === "rasterized" && (
            <p className="mt-2 text-xs text-muted-foreground">
              Pages were re-rendered as images at {quality} quality — try a lower quality for a smaller file.
            </p>
          )}
          {method !== "rasterized" && (
            <p className="mt-2 text-xs text-muted-foreground">
              This PDF is mostly text or already-compressed images, so image quality has no effect on it. We
              stripped metadata and re-packed the file instead — that's the most this PDF can safely shrink.
            </p>
          )}
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={compress} disabled={busy} size="lg" className="min-h-11 flex-1">
          {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compressing {progress}%</> : "Compress PDF"}
        </Button>
        {resultBytes && (
          <Button onClick={download} variant="secondary" size="lg" className="min-h-11 flex-1">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        )}
      </div>
    </div>
  );
}

function dataUrlToUint8(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1];
  const bin = atob(base64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
