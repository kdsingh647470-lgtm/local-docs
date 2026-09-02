import { useCallback, useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
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

export function PdfSplit() {
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
      // Detect encryption early via pdf-lib
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
        if (i % 4 === 0 || i === pdf.numPages) {
          setThumbs([...collected]);
        }
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
      const indexes = parsePageRange(rangeInput, pageCount);
      setSelected(new Set(indexes));
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

  const extract = async () => {
    if (!bytesRef.current || selected.size === 0) {
      toast.error("Select at least one page");
      return;
    }
    setBusy(true);
    try {
      const src = await PDFDocument.load(bytesRef.current.slice(0));
      const out = await PDFDocument.create();
      const indexes = [...selected].sort((a, b) => a - b);
      const pages = await out.copyPages(src, indexes);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const base = file!.name.replace(/\.pdf$/i, "");
      downloadBlob(bytes, `${base}-extracted.pdf`);
      toast.success("Extracted PDF downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to extract pages");
    } finally {
      setBusy(false);
    }
  };

  const splitAll = async () => {
    if (!bytesRef.current) return;
    setBusy(true);
    try {
      const src = await PDFDocument.load(bytesRef.current.slice(0));
      const zip = new JSZip();
      const total = src.getPageCount();
      const base = file!.name.replace(/\.pdf$/i, "");
      for (let i = 0; i < total; i++) {
        const out = await PDFDocument.create();
        const [p] = await out.copyPages(src, [i]);
        out.addPage(p);
        const bytes = await out.save();
        zip.file(`${base}-page-${i + 1}.pdf`, bytes);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, `${base}-pages.zip`);
      toast.success("Zip of individual pages downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to split PDF");
    } finally {
      setBusy(false);
    }
  };

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
        <p className="text-xs text-muted-foreground mt-1">Preview pages and extract what you need</p>
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
          <p className="text-xs text-muted-foreground">
            {pageCount} page{pageCount === 1 ? "" : "s"} · {formatBytes(file.size)}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={reset} aria-label="Remove">
          <X className="h-4 w-4" />
        </Button>
      </Card>

      <div>
        <Label htmlFor="range" className="text-xs">Or enter a page range</Label>
        <Input
          id="range"
          placeholder='e.g. "1-3, 5, 8-10"'
          value={rangeInput}
          onChange={(e) => setRangeInput(e.target.value)}
          className="mt-1"
        />
      </div>

      {loadingThumbs && thumbs.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Rendering pages…
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {thumbs.map((t) => {
            const isSel = selected.has(t.index);
            return (
              <button
                key={t.index}
                type="button"
                onClick={() => toggleSelect(t.index)}
                className={`group relative rounded-lg border-2 overflow-hidden bg-muted transition-all min-h-[44px] ${
                  isSel ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"
                }`}
              >
                <img src={t.dataUrl} alt={`Page ${t.index + 1}`} className="w-full h-auto block" />
                <div className={`absolute top-1 left-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${
                  isSel ? "bg-primary text-primary-foreground" : "bg-background/80 text-foreground"
                }`}>
                  {t.index + 1}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={extract}
          disabled={busy || selected.size === 0}
          size="lg"
          className="min-h-11 flex-1"
        >
          {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Working…</> : <><Download className="mr-2 h-4 w-4" /> Extract {selected.size} page{selected.size === 1 ? "" : "s"}</>}
        </Button>
        <Button onClick={splitAll} disabled={busy || pageCount === 0} variant="secondary" size="lg" className="min-h-11 flex-1">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Split into individual pages (.zip)
        </Button>
      </div>
    </div>
  );
}
