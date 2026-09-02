import { useCallback, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileText, GripVertical, X, Loader2, Download } from "lucide-react";
import { FileDropZone } from "./file-drop-zone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatBytes, downloadBlob, isEncryptedError } from "@/lib/pdf-utils";

interface PdfEntry {
  id: string;
  file: File;
  pageCount: number;
  encrypted?: boolean;
}

export function PdfMerge() {
  const [entries, setEntries] = useState<PdfEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filename, setFilename] = useState("merged.pdf");
  const dragIndex = useRef<number | null>(null);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (list.length === 0) {
      toast.error("Please select PDF files only");
      return;
    }
    const newEntries: PdfEntry[] = [];
    for (const file of list) {
      if (file.size > 50 * 1024 * 1024) {
        toast.warning(`${file.name} is large (${formatBytes(file.size)}) — processing may be slow.`);
      }
      try {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: false });
        newEntries.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          pageCount: doc.getPageCount(),
        });
      } catch (err) {
        if (isEncryptedError(err)) {
          toast.error(`${file.name} is password-protected and can't be processed`);
        } else {
          toast.error(`Failed to read ${file.name} — the file may be corrupted`);
        }
      }
    }
    setEntries((prev) => [...prev, ...newEntries]);
  }, []);

  const removeEntry = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const onDragStart = (index: number) => (e: React.DragEvent) => {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOverItem = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    setEntries((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex.current!, 1);
      next.splice(index, 0, moved);
      dragIndex.current = index;
      return next;
    });
  };

  const merge = async () => {
    if (entries.length < 2) {
      toast.error("Add at least 2 PDFs to merge");
      return;
    }
    setBusy(true);
    setProgress(0);
    try {
      const output = await PDFDocument.create();
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const bytes = await entry.file.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const pages = await output.copyPages(src, src.getPageIndices());
        pages.forEach((p) => output.addPage(p));
        setProgress(Math.round(((i + 1) / entries.length) * 100));
      }
      const outBytes = await output.save();
      downloadBlob(outBytes, filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
      toast.success("Merged PDF downloaded");
    } catch (err) {
      if (isEncryptedError(err)) toast.error("One of the PDFs is password-protected");
      else toast.error("Failed to merge PDFs");
      console.error(err);
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <FileDropZone
        kind="pdf"
        multiple
        onFiles={addFiles}
        hint="Add two or more PDFs, then drag them into the order you want."
      />

      {entries.length > 0 && (
        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <Card
              key={entry.id}
              draggable
              onDragStart={onDragStart(idx)}
              onDragOver={onDragOverItem(idx)}
              className="flex items-center gap-3 p-3"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{entry.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.pageCount} page{entry.pageCount === 1 ? "" : "s"} · {formatBytes(entry.file.size)}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeEntry(entry.id)} aria-label="Remove">
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {entries.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div className="flex-1">
            <Label htmlFor="merge-name" className="text-xs">Output filename</Label>
            <Input
              id="merge-name"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              disabled={busy}
              className="mt-1"
            />
          </div>
          <Button onClick={merge} disabled={busy || entries.length < 2} size="lg" className="min-h-11">
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Merging {progress}%</> : <><Download className="mr-2 h-4 w-4" /> Merge PDFs</>}
          </Button>
        </div>
      )}
    </div>
  );
}
