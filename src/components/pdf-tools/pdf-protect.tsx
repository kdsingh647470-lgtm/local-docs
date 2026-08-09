import { useCallback, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  Upload,
  Loader2,
  Download,
  FileText,
  X,
  Lock,
  Eye,
  EyeOff,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { formatBytes, downloadBlob, isEncryptedError } from "@/lib/pdf-utils";
import { protectPdf, type EncryptionStrength } from "@/lib/qpdf";

export function PdfProtect() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [bits, setBits] = useState<EncryptionStrength>("256");
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);
  const [result, setResult] = useState<{ size: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bytesRef = useRef<Uint8Array | null>(null);

  const loadFile = useCallback(async (f: File) => {
    if (!(f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))) {
      toast.error("Please select a PDF file");
      return;
    }
    setResult(null);
    try {
      const buf = await f.arrayBuffer();
      const doc = await PDFDocument.load(buf.slice(0));
      bytesRef.current = new Uint8Array(buf);
      setPageCount(doc.getPageCount());
      setFile(f);
    } catch (err) {
      console.error(err);
      if (isEncryptedError(err)) {
        toast.error("This PDF already has a password — remove it with Unlock PDF first");
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
    setPassword("");
    setConfirm("");
    bytesRef.current = null;
  };

  const weak = password.length > 0 && password.length < 6;
  const mismatch = confirm.length > 0 && confirm !== password;
  const canRun = !!bytesRef.current && password.length >= 4 && confirm === password && !busy;

  const run = async () => {
    if (!bytesRef.current) return;
    setBusy(true);
    setResult(null);
    try {
      const out = await protectPdf(bytesRef.current.slice(0), {
        userPassword: password,
        bits,
        allowPrinting,
        allowCopying,
        allowModifying: false,
        allowAnnotating: allowCopying,
      });
      const base = file!.name.replace(/\.pdf$/i, "");
      downloadBlob(out, `${base}-protected.pdf`);
      setResult({ size: out.byteLength });
      toast.success("Password-protected PDF downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't protect this PDF — the file may be damaged");
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
          Encryption happens in this tab — your password is never sent anywhere
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

      <div className="space-y-4 rounded-2xl border border-border p-4">
        <div className="space-y-2">
          <Label htmlFor="protect-password" className="text-sm">
            Password
          </Label>
          <div className="relative">
            <Input
              id="protect-password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
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
          {weak && (
            <p className="text-xs text-muted-foreground">
              Short passwords are easy to guess — 8 characters or more is safer.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="protect-confirm" className="text-sm">
            Confirm password
          </Label>
          <Input
            id="protect-confirm"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat the password"
            disabled={busy}
          />
          {mismatch && <p className="text-xs text-[color:var(--destructive)]">Passwords don't match.</p>}
        </div>

        <div className="border-t border-border pt-4">
          <Label className="text-sm">Encryption strength</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["256", "128"] as EncryptionStrength[]).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBits(b)}
                disabled={busy}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  bits === b
                    ? "border-[color:var(--emerald-mid)] bg-[color:var(--emerald-mid)]/10"
                    : "border-border hover:bg-accent/50"
                }`}
              >
                <p className="text-sm font-semibold">AES-{b}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {b === "256" ? "Strongest — modern readers" : "Wider compatibility with old readers"}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <div className="min-w-0">
            <Label htmlFor="allow-print" className="text-sm">
              Allow printing
            </Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Readers who know the password can print the document.
            </p>
          </div>
          <Switch
            id="allow-print"
            checked={allowPrinting}
            onCheckedChange={setAllowPrinting}
            disabled={busy}
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <div className="min-w-0">
            <Label htmlFor="allow-copy" className="text-sm">
              Allow copying text
            </Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Turn off to discourage text selection and annotations.
            </p>
          </div>
          <Switch
            id="allow-copy"
            checked={allowCopying}
            onCheckedChange={setAllowCopying}
            disabled={busy}
          />
        </div>
      </div>

      <Button onClick={run} disabled={!canRun} size="lg" className="min-h-11 w-full">
        {busy ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Encrypting…
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" /> Protect PDF
          </>
        )}
      </Button>

      {result && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[color:var(--emerald-mid)]" />
            <p className="text-sm font-medium">
              Protected PDF downloaded · {formatBytes(result.size)}
            </p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Opening the file now requires the password you chose. Store it somewhere safe — the
            document cannot be recovered without it.
          </p>
        </Card>
      )}

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p className="leading-relaxed">
          Encryption uses the standard PDF security handler, so any PDF reader will ask for the
          password. Permissions are honoured by well-behaved readers, but they are not a substitute
          for the password itself.
        </p>
      </div>
    </div>
  );
}
