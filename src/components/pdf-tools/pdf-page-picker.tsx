import { useCallback, useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Loader2, Download, FileText, X } from "lucide-react";
import { FileDropZone } from "./file-drop-zone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { loadPdfjs } from "@/lib/pdfjs";
import { formatBytes, downloadBlob, parsePageRange, isEncryptedError } from "@/lib/pdf-utils";

interface Thumb {
  index: number;
  dataUrl: string;
}

export type PickerMode = "delete" | "extract";

/**
 * Shared visual page picker used by Delete Pages and Extract Pages.
 * Selection semantics change per mode: "delete" removes the selected pages,
 * "extract" keeps only the selected pages.
 */
export function PdfPagePicker({ mode }: { mode: PickerMode }) {
  const isDelete = mode === "delete";
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingThumbs, setLoadingThumbs] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bytesRef = useRef<ArrayBuffer | null>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!(f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))) {
      toast.error("Please select a PDF file");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      toast.warning(`Large file (${formatBytes(f.size)}) — thumbnails may take a moment.`);
    }
    setFile(f);
    setSelected(new Set());
    setThumbs([]);
    setLoadingThumbs(true);
    try {
      const bytes = await f.arrayBuffer();
      bytesRef.current = bytes;
      try {
        await PDFDocument.load(bytes.slice(0));
      } catch (err) {
        if (isEncryptedError(err)) {
          toast.error("This PDF is password-protected and can't be processed");
          setFile(null);
          bytesRef.current = null;
          setLoadingThumbs(false);
          return;
        }
        throw err;
      }
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

  const toggleSelect = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  useEffect(() => {
    if (!rangeInput.trim()) return;
    try {
      setSelected(new Set(parsePageRange(rangeInput, pageCount)));
    } catch {
      /* ignore while typing */
    }
  }, [rangeInput, pageCount]);

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setThumbs([]);
    setSelected(new Set());
    setRangeInput("");
    bytesRef.current = null;
  };

  const selectAll = () => setSelected(new Set(thumbs.map((t) => t.index)));
  const clearAll = () => {
    setSelected(new Set());
    setRangeInput("");
  };

  const keptCount = isDelete ? pageCount - selected.size : selected.size;

  const run = async () => {
    if (!bytesRef.current || selected.size === 0) {
      toast.error("Select at least one page");
      return;
    }
    if (keptCount === 0) {
      toast.error("You can't remove every page — leave at least one.");
      return;
    }
    setBusy(true);
    try {
      const src = await PDFDocument.load(bytesRef.current.slice(0));
      const out = await PDFDocument.create();
      const all = Array.from({ length: src.getPageCount() }, (_, i) => i);
      const indexes = isDelete ? all.filter((i) => !selected.has(i)) : [...selected].sort((a, b) => a - b);
      const pages = await out.copyPages(src, indexes);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const base = file!.name.replace(/\.pdf$/i, "");
      downloadBlob(bytes, `${base}-${isDelete ? "pages-removed" : "extracted"}.pdf`);
      toast.success(
        isDelete
          ? `Removed ${selected.size} page${selected.size === 1 ? "" : "s"} — download started`
          : `Extracted ${selected.size} page${selected.size === 1 ? "" : "s"} — download started`,
      );
    } catch (err) {
      console.error(err);
      toast.error(isDelete ? "Failed to delete pages" : "Failed to extract pages");
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
        hint={isDelete ? "Select the pages you want removed." : "Select the pages you want to keep in a new PDF."}
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
        <Label htmlFor="picker-range" className="text-xs">
          Or enter page numbers {isDelete ? "to remove" : "to keep"}
        </Label>
        <Input
          id="picker-range"
          placeholder='e.g. "1-3, 5, 8-10"'
          value={rangeInput}
          onChange={(e) => setRangeInput(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {selected.size} selected · {keptCount} page{keptCount === 1 ? "" : "s"} in the result
        </span>
        <span className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll} disabled={thumbs.length === 0}>
            Select all
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll} disabled={selected.size === 0}>
            Clear
          </Button>
        </span>
      </div>

      {loadingThumbs && thumbs.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Rendering pages…
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {thumbs.map((t) => {
            const isSel = selected.has(t.index);
            const highlight = isDelete
              ? "border-destructive ring-2 ring-destructive/30"
              : "border-primary ring-2 ring-primary/30";
            return (
              <button
                key={t.index}
                type="button"
                aria-pressed={isSel}
                onClick={() => toggleSelect(t.index)}
                className={`group relative rounded-lg border-2 overflow-hidden bg-muted transition-all min-h-[44px] ${
                  isSel ? highlight : "border-border hover:border-primary/50"
                }`}
              >
                <img
                  src={t.dataUrl}
                  alt={`Page ${t.index + 1}`}
                  className={`w-full h-auto block transition-opacity ${
                    isDelete && isSel ? "opacity-40" : ""
                  }`}
                />
                <div
                  className={`absolute top-1 left-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${
                    isSel
                      ? isDelete
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-primary text-primary-foreground"
                      : "bg-background/80 text-foreground"
                  }`}
                >
                  {t.index + 1}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Button
        onClick={run}
        disabled={busy || selected.size === 0}
        size="lg"
        variant={isDelete ? "destructive" : "default"}
        className="min-h-11 w-full"
      >
        {busy ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Working…
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            {isDelete
              ? `Remove ${selected.size} page${selected.size === 1 ? "" : "s"} & download`
              : `Extract ${selected.size} page${selected.size === 1 ? "" : "s"} & download`}
          </>
        )}
      </Button>
    </div>
  );
}
