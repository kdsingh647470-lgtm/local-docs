import { useCallback, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Loader2, X, ArrowUp, ArrowDown, FileType2 } from "lucide-react";
import { FileDropZone } from "./file-drop-zone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatBytes, downloadBlob } from "@/lib/pdf-utils";

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

const PAGE_SIZES = {
  a4: { label: "A4", width: 595.28, height: 841.89, note: "210 × 297 mm" },
  letter: { label: "Letter", width: 612, height: 792, note: "8.5 × 11 in" },
  fit: { label: "Fit to image", width: 0, height: 0, note: "Page matches image" },
} as const;

type SizeKey = keyof typeof PAGE_SIZES;
type Orientation = "auto" | "portrait" | "landscape";
type MarginKey = "none" | "small" | "large";

const MARGINS: Record<MarginKey, { label: string; value: number }> = {
  none: { label: "None", value: 0 },
  small: { label: "Small", value: 24 },
  large: { label: "Large", value: 48 },
};

const ACCEPTED = /^image\/(jpeg|png|webp|gif|bmp|avif)$/;
const ACCEPTED_EXT = /\.(jpe?g|png|webp|gif|bmp|avif)$/i;

/** pdf-lib only embeds JPEG and PNG, so anything else is re-encoded to PNG via canvas. */
async function toEmbeddable(file: File): Promise<{ bytes: Uint8Array; isPng: boolean }> {
  const isJpg = /^image\/jpeg$/.test(file.type) || /\.jpe?g$/i.test(file.name);
  const isPng = /^image\/png$/.test(file.type) || /\.png$/i.test(file.name);
  if (isJpg || isPng) {
    return { bytes: new Uint8Array(await file.arrayBuffer()), isPng };
  }
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close?.();
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode failed"))), "image/png"),
  );
  return { bytes: new Uint8Array(await blob.arrayBuffer()), isPng: true };
}

export function JpgToPdf() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [size, setSize] = useState<SizeKey>("a4");
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [margin, setMargin] = useState<MarginKey>("small");
  const [busy, setBusy] = useState(false);

  const addFiles = useCallback((files: FileList | File[]) => {
    const accepted: ImageItem[] = [];
    for (const f of Array.from(files)) {
      if (!ACCEPTED.test(f.type) && !ACCEPTED_EXT.test(f.name)) {
        toast.error(`${f.name} is not a supported image`);
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
      const m = MARGINS[margin].value;
      for (const item of items) {
        const { bytes, isPng } = await toEmbeddable(item.file);
        const image = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);

        if (size === "fit") {
          const page = doc.addPage([image.width + m * 2, image.height + m * 2]);
          page.drawImage(image, { x: m, y: m, width: image.width, height: image.height });
          continue;
        }

        const preset = PAGE_SIZES[size];
        const landscape =
          orientation === "landscape" ||
          (orientation === "auto" && image.width > image.height);
        const pw = landscape ? preset.height : preset.width;
        const ph = landscape ? preset.width : preset.height;
        const page = doc.addPage([pw, ph]);
        const maxW = Math.max(pw - m * 2, 1);
        const maxH = Math.max(ph - m * 2, 1);
        const scale = Math.min(maxW / image.width, maxH / image.height);
        const w = image.width * scale;
        const h = image.height * scale;
        page.drawImage(image, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
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
  const optionClass = (active: boolean) =>
    `rounded-xl border-2 p-3 text-left transition-colors min-h-11 ${
      active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
    }`;

  return (
    <div className="space-y-4">
      <FileDropZone
        kind="image"
        multiple
        onFiles={addFiles}
        hint="JPG, PNG, WEBP, GIF, BMP or AVIF — each image becomes one page."
      />

      {items.length > 0 && (
        <>
          <div>
            <Label className="text-xs">Page size</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(Object.keys(PAGE_SIZES) as SizeKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSize(key)}
                  className={optionClass(size === key)}
                >
                  <span className="block text-sm font-semibold">{PAGE_SIZES[key].label}</span>
                  <span className="block text-xs text-muted-foreground">{PAGE_SIZES[key].note}</span>
                </button>
              ))}
            </div>
          </div>

          {size !== "fit" && (
            <div>
              <Label className="text-xs">Orientation</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["auto", "portrait", "landscape"] as Orientation[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setOrientation(key)}
                    className={optionClass(orientation === key)}
                  >
                    <span className="block text-sm font-semibold capitalize">{key}</span>
                    <span className="block text-xs text-muted-foreground">
                      {key === "auto" ? "Match each image" : `Always ${key}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label className="text-xs">Margin</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(Object.keys(MARGINS) as MarginKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMargin(key)}
                  className={optionClass(margin === key)}
                >
                  <span className="block text-sm font-semibold">{MARGINS[key].label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {MARGINS[key].value === 0 ? "Edge to edge" : `${MARGINS[key].value}pt`}
                  </span>
                </button>
              ))}
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
