import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium tracking-widest uppercase text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
          Your toolkit
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl">
          Considered, <span className="italic text-[color:var(--emerald-mid)]">local-first</span>{" "}
          utilities.
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl">
          A small collection of tools that work entirely on your device. Nothing uploaded, nothing
          tracked.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Link
            to="/pdf-tools"
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-[color:var(--gold)]/60 hover:shadow-md shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-primary text-primary-foreground">
                <Layers className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <h2 className="font-display mt-5 text-xl font-semibold">PDF Tools</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Merge, split, and compress PDFs right in your browser.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-[color:var(--emerald-mid)]" />
              Files never leave your device
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
