import { useCallback, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { Loader2, Download, FileText, X, Images } from "lucide-react";
import { FileDropZone } from "./file-drop-zone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { loadPdfjs } from "@/lib/pdfjs";
import { formatBytes, downloadBlob, isEncryptedError, safeRenderScale } from "@/lib/pdf-utils";

const QUALITY = {
  low: { scale: 1, jpeg: 0.7, label: "Screen" },
  medium: { scale: 1.5, jpeg: 0.85, label: "Standard" },
  high: { scale: 2.2, jpeg: 0.92, label: "Print" },
} as const;

type QualityKey = keyof typeof QUALITY;

const FORMATS = {
  jpg: { mime: "image/jpeg", ext: "jpg", label: "JPG", note: "Smallest files", lossy: true },
  png: { mime: "image/png", ext: "png", label: "PNG", note: "Lossless, sharp text", lossy: false },
  webp: { mime: "image/webp", ext: "webp", label: "WEBP", note: "Modern, compact", lossy: true },
} as const;

type FormatKey = keyof typeof FORMATS;

interface PageImage {
  index: number;
  dataUrl: string;
  blob: Blob;
  ext: string;
}

export function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [quality, setQuality] = useState<QualityKey>("medium");
  const [format, setFormat] = useState<FormatKey>("jpg");
  const [images, setImages] = useState<PageImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const bytesRef = useRef<ArrayBuffer | null>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!(f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))) {
      toast.error("Please select a PDF file");
      return;
    }
    setImages([]);
    try {
      const bytes = await f.arrayBuffer();
      try {
        const doc = await PDFDocument.load(bytes.slice(0));
        setPageCount(doc.getPageCount());
      } catch (err) {
        if (isEncryptedError(err)) {
          toast.error("This PDF is password-protected and can't be processed");
          return;
        }
        throw err;
      }
      bytesRef.current = bytes;
      setFile(f);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't read this PDF — it may be corrupted");
    }
  }, []);

  const reset = () => {
    setFile(null);
    setImages([]);
    setPageCount(0);
    setProgress(0);
    bytesRef.current = null;
  };

  const convert = async () => {
    if (!bytesRef.current) return;
    setBusy(true);
    setProgress(0);
    setImages([]);
    try {
      const pdfjsLib = await loadPdfjs();
      const pdf = await pdfjsLib.getDocument({ data: bytesRef.current.slice(0) }).promise;
      const { scale: wanted, jpeg } = QUALITY[quality];
      const target = FORMATS[format];
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const out: PageImage[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const base = page.getViewport({ scale: 1 });
        const scale = safeRenderScale(base.width, base.height, wanted);
        const viewport = page.getViewport({ scale });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;
        const blob = await new Promise<Blob>((resolve, reject) =>
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("encode failed"))),
            target.mime,
            target.lossy ? jpeg : undefined,
          ),
        );
        out.push({
          index: i - 1,
          dataUrl: canvas.toDataURL("image/jpeg", 0.6),
          blob,
          ext: target.ext,
        });
        setProgress(Math.round((i / pdf.numPages) * 100));
        setImages([...out]);
        await new Promise((r) => setTimeout(r, 0));
      }
      setImages(out);
      toast.success(`Converted ${out.length} page${out.length === 1 ? "" : "s"} to ${target.label}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to convert this PDF to images");
    } finally {
      setBusy(false);
    }
  };

  const baseName = file ? file.name.replace(/\.pdf$/i, "") : "pages";

  const downloadOne = (img: PageImage) => {
    downloadBlob(img.blob, `${baseName}-page-${img.index + 1}.${img.ext}`);
  };

  const downloadZip = async () => {
    setBusy(true);
    try {
      const zip = new JSZip();
      for (const img of images) {
        zip.file(`${baseName}-page-${img.index + 1}.${img.ext}`, img.blob);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, `${baseName}-${images[0]?.ext ?? "images"}.zip`);
      toast.success("ZIP of images downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to build the ZIP archive");
    } finally {
      setBusy(false);
    }
  };

  if (!file) {
    return (
      <FileDropZone
        kind="pdf"
        onFiles={(files) => {
          const first = Array.from(files)[0];
          if (first) loadFile(first);
        }}
        hint="Every page becomes a JPG, PNG or WEBP image."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-3 p-3">
        <FileText className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {pageCount} page{pageCount === 1 ? "" : "s"} · {formatBytes(file.size)}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={reset} aria-label="Remove">
          <X className="h-4 w-4" />
        </Button>
      </Card>

      <div>
        <Label className="text-xs">Image format</Label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(Object.keys(FORMATS) as FormatKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFormat(key)}
              className={`rounded-xl border-2 p-3 text-left transition-colors min-h-11 ${
                format === key
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span className="block text-sm font-semibold">{FORMATS[key].label}</span>
              <span className="block text-xs text-muted-foreground">{FORMATS[key].note}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs">
          {FORMATS[format].lossy ? "Image quality" : "Resolution (PNG is always lossless)"}
        </Label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(Object.keys(QUALITY) as QualityKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setQuality(key)}
              className={`rounded-xl border-2 p-3 text-left transition-colors min-h-11 ${
                quality === key
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span className="block text-sm font-semibold capitalize">{key}</span>
              <span className="block text-xs text-muted-foreground">{QUALITY[key].label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={convert} disabled={busy} size="lg" className="min-h-11 flex-1">
          {busy ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting… {progress}%</>
          ) : (
            <><Images className="mr-2 h-4 w-4" /> Convert to {FORMATS[format].label}</>
          )}
        </Button>
        {images.length > 0 && (
          <Button onClick={downloadZip} disabled={busy} variant="secondary" size="lg" className="min-h-11 flex-1">
            <Download className="mr-2 h-4 w-4" /> Download all ({images.length}) as .zip
          </Button>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.index} className="rounded-lg border border-border overflow-hidden bg-muted">
              <img src={img.dataUrl} alt={`Page ${img.index + 1}`} className="w-full h-auto block" />
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="text-xs text-muted-foreground">
                  {img.index + 1} · {formatBytes(img.blob.size)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => downloadOne(img)}
                  aria-label={`Download page ${img.index + 1} as ${img.ext.toUpperCase()}`}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
