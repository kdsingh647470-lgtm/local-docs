// qpdf compiled to WebAssembly. Runs fully in the browser — no uploads.
// Loaded lazily because the wasm binary is ~1.3 MB and needs a browser runtime.
interface QpdfFS {
  writeFile(path: string, data: Uint8Array): void;
  readFile(path: string): Uint8Array;
  unlink(path: string): void;
}

interface QpdfInstance {
  callMain(args: string[]): number;
  FS: QpdfFS;
}

type QpdfFactory = (opts: { locateFile: () => string }) => Promise<QpdfInstance>;

let loader: Promise<{ factory: QpdfFactory; wasmUrl: string }> | null = null;

// Served as a static asset from public/wasm so the binary never enters a bundle.
const WASM_URL = "/wasm/qpdf.wasm";

function loadQpdf() {
  if (!loader) {
    loader = (async () => {
      const mod = await import("@neslinesli93/qpdf-wasm");
      const factory = ((mod as unknown as { default: unknown }).default ??
        mod) as unknown as QpdfFactory;
      return { factory, wasmUrl: WASM_URL };
    })();
  }
  return loader;
}

export interface QpdfRun {
  /** qpdf process exit code: 0 = success, 2 = error (e.g. wrong password), 3 = warnings. */
  code: number;
  /** Output file bytes, when the command produced /out.pdf. */
  output?: Uint8Array;
}

/**
 * Run a qpdf command against a single input file.
 * The input is mounted at /in.pdf and the output is read back from /out.pdf.
 */
export async function runQpdf(input: Uint8Array, args: string[]): Promise<QpdfRun> {
  const { factory, wasmUrl } = await loadQpdf();
  // A fresh instance per run keeps the virtual filesystem and exit state clean.
  const qpdf = await factory({ locateFile: () => wasmUrl });
  qpdf.FS.writeFile("/in.pdf", input);

  let code: number;
  try {
    code = qpdf.callMain(args);
  } catch {
    code = 2;
  }

  let output: Uint8Array | undefined;
  try {
    const bytes = qpdf.FS.readFile("/out.pdf");
    if (bytes && bytes.length > 0) output = new Uint8Array(bytes);
  } catch {
    output = undefined;
  }

  return { code, output };
}

export type EncryptionStrength = "128" | "256";

export interface ProtectOptions {
  userPassword: string;
  ownerPassword?: string;
  bits?: EncryptionStrength;
  allowPrinting?: boolean;
  allowCopying?: boolean;
  allowModifying?: boolean;
  allowAnnotating?: boolean;
}

/** Add a password (standard PDF encryption) to a PDF. */
export async function protectPdf(input: Uint8Array, opts: ProtectOptions): Promise<Uint8Array> {
  const owner = opts.ownerPassword?.trim() ? opts.ownerPassword : opts.userPassword;
  const bits = opts.bits ?? "256";
  const args = [
    "/in.pdf",
    "/out.pdf",
    "--encrypt",
    opts.userPassword,
    owner,
    bits,
    `--print=${opts.allowPrinting === false ? "none" : "full"}`,
    `--modify=${opts.allowModifying === false ? "none" : "all"}`,
    `--extract=${opts.allowCopying === false ? "n" : "y"}`,
    `--annotate=${opts.allowAnnotating === false ? "n" : "y"}`,
    "--",
  ];
  const { code, output } = await runQpdf(input, args);
  if (!output) throw new Error(code === 2 ? "encryption-failed" : "qpdf-failed");
  return output;
}

/** Remove password protection from a PDF you can open. */
export async function unlockPdf(input: Uint8Array, password: string): Promise<Uint8Array> {
  const args = ["--decrypt", `--password=${password}`, "/in.pdf", "/out.pdf"];
  const { code, output } = await runQpdf(input, args);
  if (!output) throw new Error(code === 2 ? "wrong-password" : "qpdf-failed");
  return output;
}
