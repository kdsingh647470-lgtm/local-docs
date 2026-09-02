import { useRef, useState } from "react";
import { Upload, Loader2, ShieldCheck, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const PDF_ACCEPT = "application/pdf,.pdf";
const IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif";

export interface FileDropZoneProps {
  /** Which family of files this tool accepts — drives all wording. */
  kind: "pdf" | "image";
  /** Allow picking several files at once. */
  multiple?: boolean;
  /** Called with the chosen files (already non-empty). */
  onFiles: (files: FileList | File[]) => void;
  /** One short line under the headline explaining what the tool does. */
  hint: string;
  /** Show a spinner instead of the upload icon while a file is being read. */
  loading?: boolean;
  /** Optional soft size guidance, e.g. "Files over 50 MB may be slow". */
  sizeNote?: string;
  className?: string;
}

/**
 * Shared upload / drop zone used by every PDF tool so the first step of each
 * workflow looks and behaves the same. The visible button opens the native
 * picker, while the surrounding group also accepts dragged files.
 */
export function FileDropZone({
  kind,
  multiple = false,
  onFiles,
  hint,
  loading = false,
  sizeNote = "Best results with files under 50 MB",
  className = "",
}: FileDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPdf = kind === "pdf";
  const noun = isPdf ? (multiple ? "PDFs" : "PDF") : multiple ? "images" : "image";
  const headline = isPdf
    ? multiple
      ? "Drop your PDFs here"
      : "Drop your PDF here"
    : multiple
      ? "Drop your images here"
      : "Drop your image here";
  const buttonLabel = isPdf ? (multiple ? "Choose PDFs" : "Choose PDF") : multiple ? "Choose Images" : "Choose Image";
  const types = isPdf ? "PDF documents (.pdf)" : "JPG, PNG, WEBP, GIF, BMP or AVIF";

  const open = () => inputRef.current?.click();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${headline}. ${hint}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
      }}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--emerald-mid)] focus-visible:ring-offset-2 ${
        dragOver ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50"
      } ${className}`}
    >
      <span className="mb-3 rounded-2xl bg-primary/10 p-3 text-primary">
        {loading ? (
          <Loader2 aria-hidden className="h-6 w-6 animate-spin" />
        ) : (
          <Upload aria-hidden className="h-6 w-6" />
        )}
      </span>
      <p className="font-display text-base sm:text-lg font-bold">{headline}</p>
      <p className="mt-1 max-w-md text-xs sm:text-sm text-muted-foreground">{hint}</p>

      <Button
        type="button"
        size="lg"
        className="mt-4 min-h-11"
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
      >
        <FileUp className="mr-2 h-4 w-4" /> {buttonLabel}
      </Button>

      <p className="mt-3 text-xs text-muted-foreground">
        {types} · {sizeNote}
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck aria-hidden className="h-3.5 w-3.5 text-[color:var(--emerald-mid)]" />
        Your {noun} {multiple ? "are" : "is"} processed locally on your device.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={isPdf ? PDF_ACCEPT : IMAGE_ACCEPT}
        multiple={multiple}
        className="hidden"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => {
          if (e.target.files?.length) onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
