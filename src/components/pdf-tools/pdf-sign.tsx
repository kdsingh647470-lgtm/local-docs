import { useCallback, useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  Loader2,
  Download,
  FileText,
  FileUp as FileUpIcon,
  X,
  PenLine,
  Type,
  Image as ImageIcon,
  Eraser,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FileDropZone } from "./file-drop-zone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { loadPdfjs } from "@/lib/pdfjs";
import { formatBytes, downloadBlob, isEncryptedError, safeRenderScale } from "@/lib/pdf-utils";

/** Signature placement, stored as page-relative fractions so it survives preview resizes. */
interface Placement {
  /** 0-1 fraction of page width for the signature's left edge. */
  x: number;
  /** 0-1 fraction of page height for the signature's top edge. */
  y: number;
  /** 0-1 fraction of page width for the signature's width. */
  width: number;
}

const SIGNATURE_FONTS = [
  { label: "Flowing", css: "'Segoe Script', 'Brush Script MT', cursive" },
  { label: "Classic", css: "'Palatino Linotype', 'Times New Roman', serif" },
  { label: "Simple", css: "'DM Sans', system-ui, sans-serif" },
];

/** Trim transparent padding so the placed signature hugs the ink. */
function trimTransparent(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const { data } = ctx.getImageData(0, 0, width, height);
  let top = height;
  let left = width;
  let right = 0;
  let bottom = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  if (right < left || bottom < top) return canvas;
  const pad = 6;
  left = Math.max(0, left - pad);
  top = Math.max(0, top - pad);
  right = Math.min(width - 1, right + pad);
  bottom = Math.min(height - 1, bottom + pad);
  const out = document.createElement("canvas");
  out.width = right - left + 1;
  out.height = bottom - top + 1;
  out
    .getContext("2d")!
    .drawImage(canvas, left, top, out.width, out.height, 0, 0, out.width, out.height);
  return out;
}

export function PdfSign() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [signature, setSignature] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [fontIndex, setFontIndex] = useState(0);
  const [placement, setPlacement] = useState<Placement>({ x: 0.55, y: 0.75, width: 0.3 });

  const inputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const bytesRef = useRef<ArrayBuffer | null>(null);
  const padRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const hasInkRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const sigRatioRef = useRef(0.3);

  const loadFile = useCallback(async (f: File) => {
    if (!(f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))) {
      toast.error("Please select a PDF file");
      return;
    }
    setPreview(null);
    setPreviewLoading(true);
    try {
      const bytes = await f.arrayBuffer();
      try {
        await PDFDocument.load(bytes.slice(0));
      } catch (err) {
        if (isEncryptedError(err)) {
          toast.error("This PDF is password-protected — unlock it first");
          setPreviewLoading(false);
          return;
        }
        throw err;
      }
      bytesRef.current = bytes;
      const pdfjsLib = await loadPdfjs();
      const pdf = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
      setPageCount(pdf.numPages);
      setPageIndex(0);
      setFile(f);
    } catch (err) {
      console.error(err);
      if (isEncryptedError(err)) toast.error("This PDF is password-protected — unlock it first");
      else toast.error("Couldn't read this PDF — it may be corrupted");
      setFile(null);
      bytesRef.current = null;
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  // Render the selected page as the placement backdrop.
  useEffect(() => {
    if (!file || !bytesRef.current) return;
    let cancelled = false;
    (async () => {
      setPreviewLoading(true);
      try {
        const pdfjsLib = await loadPdfjs();
        const pdf = await pdfjsLib.getDocument({ data: bytesRef.current!.slice(0) }).promise;
        const page = await pdf.getPage(pageIndex + 1);
        const base = page.getViewport({ scale: 1 });
        const scale = safeRenderScale(base.width, base.height, 1.5);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;
        if (!cancelled) setPreview(canvas.toDataURL("image/jpeg", 0.85));
      } catch (err) {
        console.error(err);
        if (!cancelled) toast.error("Couldn't render this page");
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file, pageIndex]);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setPageCount(0);
    setPageIndex(0);
    bytesRef.current = null;
  };

  /* ---------------- Draw pad ---------------- */

  const padPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = padRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = padRef.current!;
    const ctx = canvas.getContext("2d")!;
    drawingRef.current = true;
    const { x, y } = padPoint(e);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const moveDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = padRef.current!.getContext("2d")!;
    const { x, y } = padPoint(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    hasInkRef.current = true;
  };

  const endDraw = () => {
    drawingRef.current = false;
  };

  const clearPad = () => {
    const canvas = padRef.current;
    if (!canvas) return;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    hasInkRef.current = false;
  };

  const useDrawnSignature = () => {
    const canvas = padRef.current;
    if (!canvas || !hasInkRef.current) {
      toast.error("Draw your signature first");
      return;
    }
    const trimmed = trimTransparent(canvas);
    sigRatioRef.current = trimmed.height / trimmed.width;
    setSignature(trimmed.toDataURL("image/png"));
    toast.success("Signature ready — drag it into place");
  };

  const useTypedSignature = () => {
    const text = typed.trim();
    if (!text) {
      toast.error("Type your name first");
      return;
    }
    const font = SIGNATURE_FONTS[fontIndex]!.css;
    const measure = document.createElement("canvas");
    const mctx = measure.getContext("2d")!;
    const size = 96;
    mctx.font = `${size}px ${font}`;
    const width = Math.ceil(mctx.measureText(text).width) + 40;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(width, 80);
    canvas.height = Math.ceil(size * 1.8);
    const ctx = canvas.getContext("2d")!;
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = "#0f172a";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 20, canvas.height / 2);
    const trimmed = trimTransparent(canvas);
    sigRatioRef.current = trimmed.height / trimmed.width;
    setSignature(trimmed.toDataURL("image/png"));
    toast.success("Signature ready — drag it into place");
  };

  const useImageSignature = async (f: File) => {
    if (!f.type.startsWith("image/")) {
      toast.error("Please pick an image file");
      return;
    }
    try {
      const url = URL.createObjectURL(f);
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("bad-image"));
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      const maxDim = 1200;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      sigRatioRef.current = canvas.height / canvas.width;
      setSignature(canvas.toDataURL("image/png"));
      toast.success("Signature image ready — drag it into place");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't read that image");
    }
  };

  /* ---------------- Placement dragging ---------------- */

  const pointToPlacement = (clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const fx = (clientX - rect.left) / rect.width;
    const fy = (clientY - rect.top) / rect.height;
    setPlacement((p) => {
      const hFrac = (p.width * rect.width * sigRatioRef.current) / rect.height;
      return {
        ...p,
        x: Math.min(Math.max(fx - p.width / 2, 0), Math.max(0, 1 - p.width)),
        y: Math.min(Math.max(fy - hFrac / 2, 0), Math.max(0, 1 - hFrac)),
      };
    });
  };

  const onStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!signature) return;
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    pointToPlacement(e.clientX, e.clientY);
  };

  const onStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    pointToPlacement(e.clientX, e.clientY);
  };

  const onStagePointerUp = () => {
    draggingRef.current = false;
  };

  /* ---------------- Export ---------------- */

  const sign = async () => {
    if (!bytesRef.current || !signature) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(bytesRef.current.slice(0));
      const pngBytes = Uint8Array.from(
        atob(signature.split(",")[1]!),
        (c) => c.charCodeAt(0),
      );
      const png = await doc.embedPng(pngBytes);
      const page = doc.getPages()[pageIndex]!;
      const { width: pw, height: ph } = page.getSize();
      const w = placement.width * pw;
      const h = w * sigRatioRef.current;
      page.drawImage(png, {
        x: placement.x * pw,
        // pdf-lib origin is bottom-left; placement.y is measured from the top.
        y: ph - placement.y * ph - h,
        width: w,
        height: h,
      });
      const out = await doc.save();
      const base = file!.name.replace(/\.pdf$/i, "");
      downloadBlob(out, `${base}-signed.pdf`);
      toast.success("Signed PDF downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign this PDF");
    } finally {
      setBusy(false);
    }
  };

  if (!file) {
    return (
      <FileDropZone
        kind="pdf"
        loading={previewLoading}
        onFiles={(files) => {
          const first = Array.from(files)[0];
          if (first) loadFile(first);
        }}
        hint="Draw, type or upload a signature and place it on the page."
      />
    );
  }

  const heightFrac = placement.width * sigRatioRef.current;

  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-3 p-3">
        <FileText className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {pageCount} page{pageCount === 1 ? "" : "s"} · {formatBytes(file.size)}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={reset} aria-label="Remove file">
          <X className="h-4 w-4" />
        </Button>
      </Card>

      {/* Signature builder */}
      <div className="rounded-2xl border border-border p-4">
        <p className="text-sm font-semibold mb-3">1. Create your signature</p>
        <Tabs defaultValue="draw">
          <TabsList className="w-full">
            <TabsTrigger value="draw" className="flex-1">
              <PenLine className="mr-1.5 h-4 w-4" /> Draw
            </TabsTrigger>
            <TabsTrigger value="type" className="flex-1">
              <Type className="mr-1.5 h-4 w-4" /> Type
            </TabsTrigger>
            <TabsTrigger value="image" className="flex-1">
              <ImageIcon className="mr-1.5 h-4 w-4" /> Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-3 pt-4">
            <canvas
              ref={padRef}
              width={640}
              height={200}
              onPointerDown={startDraw}
              onPointerMove={moveDraw}
              onPointerUp={endDraw}
              onPointerLeave={endDraw}
              className="w-full h-[160px] rounded-xl border-2 border-dashed border-border bg-muted/40 touch-none"
              aria-label="Signature drawing area"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={useDrawnSignature} className="min-h-11">
                Use this signature
              </Button>
              <Button variant="ghost" onClick={clearPad} className="min-h-11">
                <Eraser className="mr-2 h-4 w-4" /> Clear
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="type" className="space-y-3 pt-4">
            <div className="space-y-1.5">
              <Label htmlFor="sign-name">Your name</Label>
              <Input
                id="sign-name"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Jane Doe"
                className="min-h-11"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {SIGNATURE_FONTS.map((f, i) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => setFontIndex(i)}
                  className={`rounded-xl border px-4 py-2 text-lg transition-colors ${
                    fontIndex === i
                      ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10"
                      : "border-border hover:bg-accent/50"
                  }`}
                  style={{ fontFamily: f.css }}
                  aria-label={`Signature style ${f.label}`}
                >
                  {typed.trim() || f.label}
                </button>
              ))}
            </div>
            <Button onClick={useTypedSignature} className="min-h-11">
              Use this signature
            </Button>
          </TabsContent>

          <TabsContent value="image" className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">
              Upload a photo or scan of your signature. A transparent PNG works best.
            </p>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) useImageSignature(e.target.files[0]);
                e.target.value = "";
              }}
            />
            <Button
              variant="secondary"
              onClick={() => imageInputRef.current?.click()}
              className="min-h-11"
            >
              <FileUpIcon className="mr-2 h-4 w-4" /> Choose image
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Placement */}
      <div className="rounded-2xl border border-border p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold">2. Place it on the page</p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
              disabled={pageIndex === 0}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums">
              Page {pageIndex + 1} / {pageCount}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPageIndex((i) => Math.min(pageCount - 1, i + 1))}
              disabled={pageIndex >= pageCount - 1}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={stageRef}
          onPointerDown={onStagePointerDown}
          onPointerMove={onStagePointerMove}
          onPointerUp={onStagePointerUp}
          onPointerCancel={onStagePointerUp}
          className={`relative mx-auto max-w-md overflow-hidden rounded-xl border border-border bg-muted ${
            signature ? "cursor-crosshair touch-none" : ""
          }`}
        >
          {preview ? (
            <img src={preview} alt={`Page ${pageIndex + 1} preview`} className="block w-full" />
          ) : (
            <div className="flex h-72 items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Rendering page…
            </div>
          )}

          {signature && preview && (
            <img
              src={signature}
              alt="Signature preview"
              draggable={false}
              className="pointer-events-none absolute select-none"
              style={{
                left: `${placement.x * 100}%`,
                top: `${placement.y * 100}%`,
                width: `${placement.width * 100}%`,
              }}
            />
          )}
        </div>

        {signature ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sign-size">Signature size</Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {Math.round(placement.width * 100)}% of page width
              </span>
            </div>
            <Slider
              id="sign-size"
              min={5}
              max={80}
              step={1}
              value={[Math.round(placement.width * 100)]}
              onValueChange={([v]) =>
                setPlacement((p) => ({
                  ...p,
                  width: (v ?? 30) / 100,
                  x: Math.min(p.x, Math.max(0, 1 - (v ?? 30) / 100)),
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Tap or drag on the page to move the signature. Height is {Math.round(heightFrac * 100)}%
              of the page.
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Create a signature above, then tap the page to position it.
          </p>
        )}
      </div>

      <Button
        onClick={sign}
        disabled={busy || !signature}
        size="lg"
        className="min-h-11 w-full"
      >
        {busy ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing…
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" /> Download signed PDF
          </>
        )}
      </Button>
    </div>
  );
}
