import { useCallback, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  Loader2,
  FileText,
  X,
  Unlock,
  Eye,
  EyeOff,
  Info,
  ShieldCheck,
  LockOpen,
} from "lucide-react";
import { FileDropZone } from "./file-drop-zone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatBytes, downloadBlob, isEncryptedError } from "@/lib/pdf-utils";
import { unlockPdf } from "@/lib/qpdf";

export function PdfUnlock() {
  const [file, setFile] = useState<File | null>(null);
  const [encrypted, setEncrypted] = useState(true);
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ size: number } | null>(null);
  const bytesRef = useRef<Uint8Array | null>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!(f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))) {
      toast.error("Please select a PDF file");
      return;
    }
    setResult(null);
    setError(null);
    setPassword("");
    const buf = await f.arrayBuffer();
    bytesRef.current = new Uint8Array(buf);
    try {
      await PDFDocument.load(buf.slice(0));
      setEncrypted(false);
    } catch (err) {
      if (isEncryptedError(err)) {
        setEncrypted(true);
      } else {
        console.error(err);
        toast.error("Couldn't read this PDF — it may be corrupted");
        bytesRef.current = null;
        return;
      }
    }
    setFile(f);
  }, []);

  const reset = () => {
    setFile(null);
    setPassword("");
    setError(null);
    setResult(null);
    setEncrypted(true);
    bytesRef.current = null;
  };

  const run = async () => {
    if (!bytesRef.current) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await unlockPdf(bytesRef.current.slice(0), password);
      const base = file!.name.replace(/\.pdf$/i, "");
      downloadBlob(out, `${base}-unlocked.pdf`);
      setResult({ size: out.byteLength });
      toast.success("Unlocked PDF downloaded");
    } catch (err) {
      console.error(err);
      if ((err as Error).message === "wrong-password") {
        setError("That password didn't open the document. Check it and try again.");
      } else {
        setError("Couldn't remove the protection — the file may be damaged.");
      }
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
        hint="Only unlock documents you own — the password stays in this tab."
      />
    );
  }

  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-3 p-3">
        <FileText className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(file.size)} · {encrypted ? "Password protected" : "No password detected"}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={reset} aria-label="Remove file">
          <X className="h-4 w-4" />
        </Button>
      </Card>

      <div className="space-y-2 rounded-2xl border border-border p-4">
        <Label htmlFor="unlock-password" className="text-sm">
          Document password
        </Label>
        <div className="relative">
          <Input
            id="unlock-password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !busy) run();
            }}
            placeholder={encrypted ? "Enter the password" : "Leave empty if there is none"}
            className="pr-10"
            disabled={busy}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {encrypted
            ? "Enter the password you normally type to open this file. Owner-only restrictions can often be lifted without one."
            : "This file opens without a password. Running unlock will still strip any owner restrictions such as no-printing."}
        </p>
        {error && (
          <p className="text-xs text-[color:var(--destructive)]" role="alert">
            {error}
          </p>
        )}
      </div>

      <Button onClick={run} disabled={busy} size="lg" className="min-h-11 w-full">
        {busy ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Removing protection…
          </>
        ) : (
          <>
            <Unlock className="mr-2 h-4 w-4" /> Unlock PDF
          </>
        )}
      </Button>

      {result && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <LockOpen className="h-4 w-4 text-[color:var(--emerald-mid)]" />
            <p className="text-sm font-medium">
              Unlocked PDF downloaded · {formatBytes(result.size)}
            </p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            The copy opens without a password and can be merged, split, compressed or converted with
            the other tools.
          </p>
        </Card>
      )}

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--emerald-mid)]" />
        <p className="leading-relaxed">
          Nothing is uploaded and no password is stored. This tool decrypts a document you can
          already open — it cannot guess or crack an unknown password.
        </p>
      </div>
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p className="leading-relaxed">
          Only remove protection from files you own or are allowed to modify.
        </p>
      </div>
    </div>
  );
}
