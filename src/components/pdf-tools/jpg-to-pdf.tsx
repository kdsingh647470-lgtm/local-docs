import { useCallback, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Loader2, Download, X, ArrowUp, ArrowDown, FileType2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatBytes, downloadBlob } from "@/lib/pdf-utils";

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 24;

type Layout = "fit" | "a4";

export function JpgToPdf() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [layout, setLayout] = useState<Layout>("a4");
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const accepted: ImageItem[] = [];
    for (const f of Array.from(files)) {
      if (!/^image\/(jpeg|png)$/.test(f.type) && !/\.(jpe?g|png)$/i.test(f.name)) {
        toast.error(`${f.name} is not a JPG or PNG image`);
        continue;
      }
      accepted.push({
        id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2)}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
      });
    }
    if (accepted.length) setItems((prev) => [...prev, ...accepted]);
  }, []);

  const remove = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const move = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const build = async () => {
    if (items.length === 0) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.create();
      for (const item of items) {
        const bytes = new Uint8Array(await item.file.arrayBuffer());
        const isPng = /^image\/png$/.test(item.file.type) || /\.png$/i.test(item.file.name);
        const image = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);

        if (layout === "fit") {
          const page = doc.addPage([image.width, image.height]);
          page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        } else {
          const landscape = image.width > image.height;
          const pw = landscape ? A4.height : A4.width;
          const ph = landscape ? A4.width : A4.height;
          const page = doc.addPage([pw, ph]);
          const maxW = pw - MARGIN * 2;
          const maxH = ph - MARGIN * 2;
          const scale = Math.min(maxW / image.width, maxH / image.height);
          const w = image.width * scale;
          const h = image.height * scale;
          page.drawImage(image, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
        }
      }
      const out = await doc.save();
      downloadBlob(out, "images.pdf");
      toast.success(`PDF with ${items.length} page${items.length === 1 ? "" : "s"} downloaded`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to build the PDF — one of the images may be unsupported");
    } finally {
      setBusy(false);
    }
  };

  const totalSize = items.reduce((sum, i) => sum + i.file.size, 0);

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors min-h-[160px] ${
          dragOver ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50"
        }`}
      >
        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Drop JPG or PNG images here or tap to browse</p>
        <p className="text-xs text-muted-foreground mt-1">Each image becomes one page</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {items.length > 0 && (
        <>
          <div>
            <Label className="text-xs">Page size</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLayout("a4")}
                className={`rounded-xl border-2 p-3 text-left transition-colors min-h-11 ${
                  layout === "a4" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <span className="block text-sm font-semibold">A4 pages</span>
                <span className="block text-xs text-muted-foreground">Centred with a margin</span>
              </button>
              <button
                type="button"
                onClick={() => setLayout("fit")}
                className={`rounded-xl border-2 p-3 text-left transition-colors min-h-11 ${
                  layout === "fit" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <span className="block text-sm font-semibold">Fit to image</span>
                <span className="block text-xs text-muted-foreground">Page matches image size</span>
              </button>
            </div>
          </div>

          <ul className="space-y-2">
            {items.map((item, i) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5"
              >
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="h-12 w-12 rounded-lg object-cover bg-muted shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Page {i + 1} · {formatBytes(item.file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label={`Move ${item.file.name} up`}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  aria-label={`Move ${item.file.name} down`}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>

          <p className="text-xs text-muted-foreground">
            {items.length} image{items.length === 1 ? "" : "s"} · {formatBytes(totalSize)}
          </p>

          <Button onClick={build} disabled={busy} size="lg" className="min-h-11 w-full">
            {busy ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Building PDF…</>
            ) : (
              <><FileType2 className="mr-2 h-4 w-4" /> Create PDF</>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
