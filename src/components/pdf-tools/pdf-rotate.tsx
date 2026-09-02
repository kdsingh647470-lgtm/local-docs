import { useCallback, useRef, useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { Loader2, Download, FileText, X, RotateCw, RotateCcw } from "lucide-react";
import { FileDropZone } from "./file-drop-zone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { loadPdfjs } from "@/lib/pdfjs";
import { formatBytes, downloadBlob, isEncryptedError } from "@/lib/pdf-utils";

interface Thumb {
  index: number;
  dataUrl: string;
}

export function PdfRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [loadingThumbs, setLoadingThumbs] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bytesRef = useRef<ArrayBuffer | null>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!(f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))) {
      toast.error("Please select a PDF file");
      return;
    }
    setThumbs([]);
    setRotations({});
    setLoadingThumbs(true);
    try {
      const bytes = await f.arrayBuffer();
      try {
        await PDFDocument.load(bytes.slice(0));
      } catch (err) {
        if (isEncryptedError(err)) {
          toast.error("This PDF is password-protected and can't be processed");
          setLoadingThumbs(false);
          return;
        }
        throw err;
      }
      bytesRef.current = bytes;
      setFile(f);
      const pdfjsLib = await loadPdfjs();
      const pdf = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
      setPageCount(pdf.numPages);
      const collected: Thumb[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;
        collected.push({ index: i - 1, dataUrl: canvas.toDataURL("image/jpeg", 0.7) });
        if (i % 4 === 0 || i === pdf.numPages) setThumbs([...collected]);
      }
      setThumbs(collected);
    } catch (err) {
      console.error(err);
      if (isEncryptedError(err)) toast.error("This PDF is password-protected and can't be processed");
      else toast.error("Couldn't read this PDF — it may be corrupted");
      setFile(null);
      bytesRef.current = null;
    } finally {
      setLoadingThumbs(false);
    }
  }, []);

  const reset = () => {
    setFile(null);
    setThumbs([]);
    setRotations({});
    setPageCount(0);
    bytesRef.current = null;
  };

  const rotatePage = (index: number, delta: number) => {
    setRotations((prev) => ({ ...prev, [index]: (((prev[index] ?? 0) + delta) % 360 + 360) % 360 }));
  };

  const rotateAll = (delta: number) => {
    setRotations((prev) => {
      const next: Record<number, number> = {};
      for (let i = 0; i < pageCount; i++) {
        next[i] = (((prev[i] ?? 0) + delta) % 360 + 360) % 360;
      }
      return next;
    });
  };

  const changedCount = Object.values(rotations).filter((r) => r % 360 !== 0).length;

  const save = async () => {
    if (!bytesRef.current) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(bytesRef.current.slice(0));
      doc.getPages().forEach((page, i) => {
        const extra = rotations[i] ?? 0;
        if (extra % 360 === 0) return;
        const current = page.getRotation().angle;
        page.setRotation(degrees((((current + extra) % 360) + 360) % 360));
      });
      const out = await doc.save();
      const base = file!.name.replace(/\.pdf$/i, "");
      downloadBlob(out, `${base}-rotated.pdf`);
      toast.success("Rotated PDF downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to rotate this PDF");
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
        hint="Turn sideways pages upright, one page at a time or all at once."
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

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => rotateAll(-90)} className="min-h-11">
          <RotateCcw className="mr-2 h-4 w-4" /> Rotate all left
        </Button>
        <Button variant="secondary" onClick={() => rotateAll(90)} className="min-h-11">
          <RotateCw className="mr-2 h-4 w-4" /> Rotate all right
        </Button>
        <Button variant="ghost" onClick={() => setRotations({})} className="min-h-11">
          Reset
        </Button>
      </div>

      {loadingThumbs && thumbs.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Rendering pages…
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {thumbs.map((t) => {
            const angle = rotations[t.index] ?? 0;
            return (
              <div
                key={t.index}
                className={`rounded-lg border-2 overflow-hidden bg-muted ${
                  angle % 360 !== 0 ? "border-primary" : "border-border"
                }`}
              >
                <div className="relative flex h-32 items-center justify-center overflow-hidden">
                  <img
                    src={t.dataUrl}
                    alt={`Page ${t.index + 1}`}
                    className="max-h-full max-w-full transition-transform duration-200"
                    style={{ transform: `rotate(${angle}deg)` }}
                  />
                  <span className="absolute top-1 left-1 rounded-md bg-background/80 px-1.5 py-0.5 text-xs font-medium">
                    {t.index + 1}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1 border-t border-border p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => rotatePage(t.index, -90)}
                    aria-label={`Rotate page ${t.index + 1} left`}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => rotatePage(t.index, 90)}
                    aria-label={`Rotate page ${t.index + 1} right`}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Button onClick={save} disabled={busy || changedCount === 0} size="lg" className="min-h-11 w-full">
        {busy ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
        ) : (
          <><Download className="mr-2 h-4 w-4" /> Download rotated PDF{changedCount > 0 ? ` (${changedCount} page${changedCount === 1 ? "" : "s"})` : ""}</>
        )}
      </Button>
    </div>
  );
}
