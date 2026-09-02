import { useCallback, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Loader2, Download, FileText, X, FileType2, Info } from "lucide-react";
import { FileDropZone } from "./file-drop-zone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { formatBytes, downloadBlob, isEncryptedError } from "@/lib/pdf-utils";
import { convertPdfToDocx } from "@/lib/pdf-to-docx";

export function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [keepFormatting, setKeepFormatting] = useState(true);
  const [pageBreaks, setPageBreaks] = useState(true);
  const [result, setResult] = useState<{ size: number; empty: number[] } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bytesRef = useRef<ArrayBuffer | null>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!(f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))) {
      toast.error("Please select a PDF file");
      return;
    }
    setResult(null);
    setProgress(0);
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes.slice(0));
      bytesRef.current = bytes;
      setPageCount(doc.getPageCount());
      setFile(f);
    } catch (err) {
      console.error(err);
      if (isEncryptedError(err)) {
        toast.error("This PDF is password-protected and can't be converted");
      } else {
        toast.error("Couldn't read this PDF — it may be corrupted");
      }
      bytesRef.current = null;
    }
  }, []);

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setResult(null);
    setProgress(0);
    bytesRef.current = null;
  };

  const convert = async () => {
    if (!bytesRef.current) return;
    setBusy(true);
    setProgress(0);
    setResult(null);
    try {
      const out = await convertPdfToDocx(bytesRef.current.slice(0), {
        keepFormatting,
        pageBreaks,
        onProgress: (done, total) => {
          setProgress(Math.round((done / total) * 100));
          // Yield to the browser so the progress bar paints on mobile too.
          return undefined;
        },
      });
      const base = file!.name.replace(/\.pdf$/i, "");
      downloadBlob(out.blob, `${base}.docx`);
      setResult({ size: out.blob.size, empty: out.emptyPages });
      if (out.emptyPages.length === out.pageCount) {
        toast.warning("No selectable text found — this looks like a scanned PDF");
      } else {
        toast.success("Word document downloaded");
      }
    } catch (err) {
      console.error(err);
      if (isEncryptedError(err)) toast.error("This PDF is password-protected and can't be converted");
      else toast.error("Conversion failed — the PDF may be corrupted");
    } finally {
      setBusy(false);
    }
  };

  if (!file) {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
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
        <p className="text-xs text-muted-foreground mt-1">
          Text and headings become an editable .docx — all in this tab
        </p>
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

      <div className="space-y-3 rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Label htmlFor="keep-formatting" className="text-sm">
              Keep formatting
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Detect headings, bold and italic text and font sizes.
            </p>
          </div>
          <Switch
            id="keep-formatting"
            checked={keepFormatting}
            onCheckedChange={setKeepFormatting}
            disabled={busy}
          />
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
          <div className="min-w-0">
            <Label htmlFor="page-breaks" className="text-sm">
              One Word page per PDF page
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Insert a page break between pages instead of flowing continuously.
            </p>
          </div>
          <Switch
            id="page-breaks"
            checked={pageBreaks}
            onCheckedChange={setPageBreaks}
            disabled={busy}
          />
        </div>
      </div>

      {busy && (
        <div>
          <Progress value={progress} className="h-2" />
          <p className="mt-2 text-xs text-muted-foreground">Extracting text… {progress}%</p>
        </div>
      )}

      <Button onClick={convert} disabled={busy} size="lg" className="min-h-11 w-full">
        {busy ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting…
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" /> Convert to Word (.docx)
          </>
        )}
      </Button>

      {result && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FileType2 className="h-4 w-4 text-[color:var(--emerald-mid)]" />
            <p className="text-sm font-medium">
              Word document created · {formatBytes(result.size)}
            </p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {result.empty.length === 0
              ? "Every page had selectable text, so the whole document was converted."
              : result.empty.length === pageCount
                ? "None of the pages contain selectable text — this PDF is a scan, so an OCR step is needed before its words can be extracted."
                : `Page${result.empty.length === 1 ? "" : "s"} ${result.empty.join(", ")} had no selectable text and were marked as scanned images in the output.`}
          </p>
        </Card>
      )}

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p className="leading-relaxed">
          Conversion rebuilds text, headings and paragraph flow. Complex layouts — multi-column
          pages, tables and embedded images — are simplified into plain paragraphs.
        </p>
      </div>
    </div>
  );
}
