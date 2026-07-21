import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Your toolkit</h1>
        <p className="mt-3 text-muted-foreground">A simple collection of local-first utilities.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link
            to="/pdf-tools"
            className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <h2 className="mt-4 text-lg font-medium">PDF Tools</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Merge, split, and compress PDFs right in your browser.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-primary" />
              Files never leave your device
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
