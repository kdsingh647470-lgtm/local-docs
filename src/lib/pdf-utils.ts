export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export function downloadBlob(data: Uint8Array | Blob, filename: string) {
  const blob = data instanceof Blob ? data : new Blob([data as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Parse a page range string like "1-3, 5, 8-10" into 0-based page indexes.
 * Throws on invalid input.
 */
export function parsePageRange(input: string, totalPages: number): number[] {
  const result = new Set<number>();
  const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) throw new Error("Enter at least one page or range");
  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (start < 1 || end < 1 || start > totalPages || end > totalPages) {
        throw new Error(`Range "${part}" is out of bounds (1-${totalPages})`);
      }
      const [lo, hi] = start <= end ? [start, end] : [end, start];
      for (let i = lo; i <= hi; i++) result.add(i - 1);
    } else if (/^\d+$/.test(part)) {
      const n = parseInt(part, 10);
      if (n < 1 || n > totalPages) {
        throw new Error(`Page ${n} is out of bounds (1-${totalPages})`);
      }
      result.add(n - 1);
    } else {
      throw new Error(`"${part}" is not a valid page or range`);
    }
  }
  return [...result].sort((a, b) => a - b);
}

export function isEncryptedError(err: unknown): boolean {
  const msg = (err as Error)?.message?.toLowerCase() ?? "";
  const name = (err as Error)?.name ?? "";
  return (
    name === "PasswordException" ||
    msg.includes("encrypted") ||
    msg.includes("password")
  );
}

/**
 * Mobile browsers (iOS Safari especially) silently degrade or blank out canvases
 * above a memory budget, which made rasterised output look worse on phones than
 * in the desktop preview. Cap every render to the same pixel budget on all
 * devices so results are identical everywhere.
 */
export const MAX_CANVAS_AREA = 2048 * 2048;
export const MAX_CANVAS_DIM = 2048;

export function safeRenderScale(baseWidth: number, baseHeight: number, wanted: number): number {
  let scale = wanted;
  const maxDimScale = MAX_CANVAS_DIM / Math.max(baseWidth, baseHeight);
  const maxAreaScale = Math.sqrt(MAX_CANVAS_AREA / (baseWidth * baseHeight));
  scale = Math.min(scale, maxDimScale, maxAreaScale);
  return Math.max(scale, 0.1);
}
