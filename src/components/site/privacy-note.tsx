import { ShieldCheck } from "lucide-react";

/** Compact, consistent privacy indicator shown next to file drop zones. */
export function PrivacyNote({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-center gap-2 rounded-xl border border-border bg-[color:var(--cream-warm)] px-3 py-2 text-xs text-muted-foreground ${className}`}
    >
      <ShieldCheck
        aria-hidden
        className="h-4 w-4 shrink-0 text-[color:var(--emerald-mid)]"
      />
      <span>
        <span className="font-semibold text-foreground">Processed locally in your browser.</span>{" "}
        Your file is not uploaded to a server, and no account is required.
      </span>
    </p>
  );
}
