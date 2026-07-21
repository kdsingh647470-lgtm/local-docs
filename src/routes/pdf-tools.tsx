import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FilePlus2,
  Scissors,
  FileArchive,
  Layers,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { PdfMerge } from "@/components/pdf-tools/pdf-merge";
import { PdfSplit } from "@/components/pdf-tools/pdf-split";
import { PdfCompress } from "@/components/pdf-tools/pdf-compress";

type Tool = "merge" | "split" | "compress";

export const Route = createFileRoute("/pdf-tools")({
  head: () => ({
    meta: [
      { title: "PDF Tools — Merge, split, and compress PDFs locally" },
      {
        name: "description",
        content:
          "Merge, split, and compress PDF files right in your browser. Files never leave your device.",
      },
      { property: "og:title", content: "PDF Tools — Merge, split, and compress PDFs locally" },
      {
        property: "og:description",
        content:
          "Merge, split, and compress PDF files right in your browser. Files never leave your device.",
      },
    ],
  }),
  component: PdfToolsPage,
});

const TOOL_META: Record<Tool, { title: string; blurb: string }> = {
  merge: {
    title: "Merge PDFs",
    blurb: "Combine multiple documents into a single, organized file.",
  },
  split: {
    title: "Split & Extract",
    blurb: "Pick pages visually or by range and pull them into a new PDF.",
  },
  compress: {
    title: "Compress PDF",
    blurb: "Trim file size for easier sharing without losing readability.",
  },
};

function PdfToolsPage() {
  const [tool, setTool] = useState<Tool | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {tool ? (
          <ActiveTool tool={tool} onBack={() => setTool(null)} />
        ) : (
          <BentoLanding onOpen={setTool} />
        )}
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
}

function BentoLanding({ onOpen }: { onOpen: (t: Tool) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 md:auto-rows-[minmax(0,1fr)] gap-4">
      {/* Hero */}
      <section className="md:col-span-4 md:row-span-2 rounded-3xl border border-border bg-card p-8 sm:p-10 flex flex-col justify-center shadow-sm relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--gold) 30%, transparent), transparent 70%)" }}
        />
        <div className="flex items-center gap-3 mb-5 relative">
          <div className="p-2 rounded-xl bg-primary text-primary-foreground">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            PDF Tools
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.05] max-w-xl">
          Fast, simple, <span className="italic text-[color:var(--emerald-mid)]">private</span> PDF management.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
          Powerful document tools that run entirely in your browser. No uploads, no waiting, complete
          privacy.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
            100% on-device
          </div>
          <div className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
            No account
          </div>
          <div className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
            Works offline
          </div>
        </div>
      </section>

      {/* Privacy tile */}
      <section className="md:col-span-2 md:row-span-2 rounded-3xl p-8 flex flex-col justify-between bg-primary text-primary-foreground shadow-[0_18px_40px_-24px_rgba(6,78,59,0.55)] relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full"
          style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--gold) 40%, transparent), transparent 70%)" }}
        />
        <div className="w-fit p-3 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm ring-1 ring-primary-foreground/20 relative">
          <ShieldCheck className="h-6 w-6 text-[color:var(--gold-soft)]" />
        </div>
        <div className="relative">
          <h2 className="font-display text-xl font-bold mb-2">Secure by design</h2>
          <p className="text-sm text-primary-foreground/75 leading-relaxed">
            Files never leave your device. Every merge, split, and compress happens locally in your
            browser.
          </p>
        </div>
      </section>

      {/* Merge — tall */}
      <ToolTile
        variant="feature"
        icon={<FilePlus2 className="h-7 w-7" />}
        title={TOOL_META.merge.title}
        blurb="Combine multiple documents into a single, organized file. Drag to reorder before you export."
        cta="Open merge"
        onClick={() => onOpen("merge")}
        className="md:col-span-3 md:row-span-3"
        accent="emerald"
      >
        <PageStackVisual />
      </ToolTile>

      {/* Split — short wide */}
      <ToolTile
        variant="row"
        icon={<Scissors className="h-6 w-6" />}
        title={TOOL_META.split.title}
        blurb="Extract specific pages or break one PDF into many."
        onClick={() => onOpen("split")}
        className="md:col-span-3 md:row-span-1"
        accent="gold"
      />

      {/* Compress */}
      <ToolTile
        variant="feature"
        icon={<FileArchive className="h-6 w-6" />}
        title={TOOL_META.compress.title}
        blurb="Reduce file size for easier sharing. Best gains on PDFs with photos and scans."
        cta="Open compressor"
        onClick={() => onOpen("compress")}
        className="md:col-span-3 md:row-span-2"
        accent="emerald"
        badge="Optimizer"
      >
        <CompressionBar />
      </ToolTile>
    </div>
  );
}

function ToolTile({
  icon,
  title,
  blurb,
  cta,
  onClick,
  className = "",
  variant,
  accent,
  badge,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  blurb: string;
  cta?: string;
  onClick: () => void;
  className?: string;
  variant: "feature" | "row";
  accent: "emerald" | "gold";
  badge?: string;
  children?: React.ReactNode;
}) {
  const iconClass =
    accent === "emerald"
      ? "bg-[color:var(--emerald-mid)]/10 text-[color:var(--emerald-mid)] group-hover:bg-[color:var(--emerald-mid)]/15"
      : "bg-[color:var(--gold)]/15 text-[color:var(--emerald-deep)] group-hover:bg-[color:var(--gold)]/25";

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group rounded-3xl border border-border bg-card px-6 sm:px-8 py-6 flex items-center gap-5 text-left transition-all hover:border-[color:var(--gold)]/60 hover:-translate-y-0.5 hover:shadow-sm shadow-sm min-h-[96px] ${className}`}
      >
        <div className={`p-3 rounded-2xl transition-colors ${iconClass}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground truncate">{blurb}</p>
        </div>
        <div className="text-muted-foreground group-hover:text-[color:var(--emerald-deep)] transition-colors shrink-0">
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-3xl border border-border bg-card p-7 sm:p-8 flex flex-col text-left transition-all hover:border-[color:var(--gold)]/60 hover:-translate-y-0.5 hover:shadow-md shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl transition-colors ${iconClass}`}>{icon}</div>
        {badge && (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[color:var(--gold)]/20 text-[color:var(--emerald-deep)]">
            {badge}
          </span>
        )}
      </div>

      {children && <div className="my-6">{children}</div>}

      <div className="mt-auto">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{blurb}</p>
        {cta && (
          <span className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-colors group-hover:bg-[color:var(--emerald-mid)]">
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </button>
  );
}

function PageStackVisual() {
  return (
    <div className="relative h-24 sm:h-28">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute left-1/2 top-0 h-24 sm:h-28 w-16 sm:w-20 rounded-lg border border-border bg-[color:var(--paper)] shadow-sm"
          style={{
            transform: `translateX(calc(-50% + ${(i - 1) * 22}px)) rotate(${(i - 1) * 4}deg)`,
            zIndex: 3 - i,
          }}
        >
          <div className="p-2 space-y-1">
            <div className="h-1 rounded-full bg-[color:var(--emerald-mid)]/30 w-3/4" />
            <div className="h-1 rounded-full bg-[color:var(--muted-foreground)]/20" />
            <div className="h-1 rounded-full bg-[color:var(--muted-foreground)]/20 w-5/6" />
            <div className="h-1 rounded-full bg-[color:var(--muted-foreground)]/20 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CompressionBar() {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2 text-xs">
        <span className="font-medium text-muted-foreground">Original</span>
        <span className="font-display font-semibold text-[color:var(--emerald-deep)]">-64%</span>
      </div>
      <div className="h-2 rounded-full bg-[color:var(--muted)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: "36%",
            background: `linear-gradient(90deg, var(--emerald-deep), var(--gold))`,
          }}
        />
      </div>
    </div>
  );
}

function ActiveTool({ tool, onBack }: { tool: Tool; onBack: () => void }) {
  const meta = TOOL_META[tool];
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All tools
      </button>
      <header className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">{meta.title}</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">{meta.blurb}</p>
      </header>
      <section className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm">
        {tool === "merge" && <PdfMerge />}
        {tool === "split" && <PdfSplit />}
        {tool === "compress" && <PdfCompress />}
      </section>
      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--emerald-mid)]" />
        Files never leave your device
      </div>
    </div>
  );
}
