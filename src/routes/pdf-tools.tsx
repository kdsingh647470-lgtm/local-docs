import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FilePlus2,
  Scissors,
  FileArchive,
  FileType2,
  RotateCw,
  Unlock,
  Lock,
  MousePointerClick,
  Upload,
  Download,
  Zap,
  Globe,
  ServerOff,
  Gift,
  Smartphone,
  Check,
  X,
  BookOpen,
  Images,
  ImagePlus,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PdfMerge } from "@/components/pdf-tools/pdf-merge";
import { PdfSplit } from "@/components/pdf-tools/pdf-split";
import { PdfCompress } from "@/components/pdf-tools/pdf-compress";
import { PdfToWord } from "@/components/pdf-tools/pdf-to-word";
import { PdfToJpg } from "@/components/pdf-tools/pdf-to-jpg";
import { JpgToPdf } from "@/components/pdf-tools/jpg-to-pdf";
import { PdfRotate } from "@/components/pdf-tools/pdf-rotate";
import { PdfProtect } from "@/components/pdf-tools/pdf-protect";
import { PdfUnlock } from "@/components/pdf-tools/pdf-unlock";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ToolCard } from "@/components/site/tool-card";
import { FAQ_ITEMS } from "@/lib/site-content";

type Tool =
  | "merge"
  | "split"
  | "compress"
  | "pdf-to-word"
  | "pdf-to-jpg"
  | "jpg-to-pdf"
  | "rotate"
  | "protect"
  | "unlock";

const TOOLS: Tool[] = [
  "merge",
  "split",
  "compress",
  "pdf-to-word",
  "pdf-to-jpg",
  "jpg-to-pdf",
  "rotate",
  "protect",
  "unlock",
];

const TITLE = "Free PDF Tools — Merge, Split, Compress, Convert | Nesake";
const DESCRIPTION =
  "The Nesake PDF tools hub: merge, split, compress, rotate, convert PDF to Word, PDF to Image and Image to PDF locally in your browser — nothing is uploaded.";
const URL = "https://pdftools.nesake.com/pdf-tools";

export const Route = createFileRoute("/pdf-tools")({
  validateSearch: (search: Record<string, unknown>): { tool?: Tool } => {
    const tool = search.tool;
    return TOOLS.includes(tool as Tool) ? { tool: tool as Tool } : {};
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Nesake PDF Tools",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any (web browser)",
            url: URL,
            description: DESCRIPTION,
            featureList: [
              "Merge PDF",
              "Split PDF",
              "Extract pages",
              "Compress PDF",
              "Convert PDF to Word",
              "Convert PDF to Image",
              "Convert Image to PDF",
              "Rotate PDF",
              "Protect PDF with a password",
              "Unlock password-protected PDF",
            ],
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://pdftools.nesake.com/",
              },
              { "@type": "ListItem", position: 2, name: "PDF Tools", item: URL },
            ],
          },
        ]),
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
  "pdf-to-word": {
    title: "PDF to Word",
    blurb: "Turn a PDF into an editable .docx document, converted right here in your browser.",
  },
  "pdf-to-jpg": {
    title: "PDF to Image",
    blurb: "Render every page as a JPG, PNG or WEBP image and download one page or all as a ZIP.",
  },
  "jpg-to-pdf": {
    title: "Image to PDF",
    blurb: "Turn JPG, PNG, WEBP, GIF, BMP or AVIF images into a single PDF, one page per image.",
  },
  protect: {
    title: "Protect PDF",
    blurb:
      "Add a password with AES encryption before sharing a sensitive document — done in your browser.",
  },
  unlock: {
    title: "Unlock PDF",
    blurb:
      "Remove the password from a document you can open, so it can be edited and converted again.",
  },
  rotate: {
    title: "Rotate PDF",
    blurb: "Turn sideways pages upright — one page at a time or the whole document at once.",
  },
};


const STEPS = [
  {
    icon: MousePointerClick,
    title: "Choose a tool",
    text: "Pick merge, split or compress. Each opens a focused workspace with nothing else in the way.",
  },
  {
    icon: Upload,
    title: "Add your PDF",
    text: "Drop a file in or tap to browse. It is read into your browser's memory — never sent to a server.",
  },
  {
    icon: Download,
    title: "Download the result",
    text: "Press the action button and the rewritten document saves straight to your device.",
  },
];

const BENEFITS = [
  { icon: ShieldCheck, title: "Privacy first", text: "No account, no tracking of your documents." },
  { icon: Globe, title: "Browser processing", text: "The PDF engine runs inside the page itself." },
  { icon: Lock, title: "Secure", text: "Encrypted or damaged files are rejected with a clear reason." },
  { icon: ServerOff, title: "No upload storage", text: "There is no bucket holding your file afterwards." },
  { icon: Gift, title: "Free", text: "Unlimited runs, no watermark on the output." },
  { icon: Zap, title: "Fast", text: "Work starts immediately — no upload or queue." },
  { icon: Smartphone, title: "Responsive", text: "Touch-friendly layouts on phones and tablets." },
];

function PdfToolsPage() {
  const { tool } = Route.useSearch();
  const navigate = useNavigate({ from: "/pdf-tools" });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {tool ? (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <ActiveTool tool={tool} onBack={() => navigate({ to: "/pdf-tools", search: {} })} />
        </div>
      ) : (
        <ToolsHub />
      )}

      <SiteFooter />
      <Toaster richColors position="top-center" />
    </div>
  );
}

function ToolsHub() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--gold) 28%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">PDF Tools</span>
          </nav>
          <h1 className="font-display mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.08] max-w-2xl">
            Free PDF tools,{" "}
            <span className="italic text-[color:var(--emerald-mid)]">on your device</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            A dedicated workspace for every PDF task — open a tool, work on your file locally, and
            download the result in seconds.
          </p>
          <div className="mt-8 max-w-md">
            <CompressionBar />
          </div>
        </div>
      </section>

      {/* Tool grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <SectionHeading eyebrow="Available now" title="Pick a tool" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ToolCard
            icon={<FilePlus2 className="h-6 w-6" />}
            title="PDF Merge"
            description="Add several PDFs, drag them into the order you want, and export one combined document."
            tool="merge"
          />
          <ToolCard
            icon={<Scissors className="h-6 w-6" />}
            title="PDF Split"
            description="Select pages from a thumbnail grid or by range, then extract them or split every page into a ZIP."
            tool="split"
            accent="gold"
          />
          <ToolCard
            icon={<FileArchive className="h-6 w-6" />}
            title="PDF Compress"
            description="Re-encode page images at low, medium or high quality and see exactly how much you saved."
            tool="compress"
          />
          <ToolCard
            icon={<FileType2 className="h-6 w-6" />}
            title="PDF to Word"
            description="Convert a PDF into an editable .docx, keeping headings, bold text and paragraph flow."
            tool="pdf-to-word"
            accent="gold"
          />
          <ToolCard
            icon={<Images className="h-6 w-6" />}
            title="PDF to Image"
            description="Render each page as JPG, PNG or WEBP at screen, standard or print quality — download one or all as a ZIP."
            tool="pdf-to-jpg"
          />
          <ToolCard
            icon={<ImagePlus className="h-6 w-6" />}
            title="Image to PDF"
            description="Combine JPG, PNG, WEBP, GIF, BMP or AVIF images into one PDF with A4, Letter or fit-to-image pages."
            tool="jpg-to-pdf"
            accent="gold"
          />
          <ToolCard
            icon={<RotateCw className="h-6 w-6" />}
            title="Rotate PDF"
            description="Turn sideways pages upright from a thumbnail grid — per page or the whole document."
            tool="rotate"
          />
          <ToolCard
            icon={<Lock className="h-6 w-6" />}
            title="Protect PDF"
            description="Lock a document with a password using AES-256 or AES-128 encryption, and choose whether printing and copying stay allowed."
            tool="protect"
            accent="gold"
          />
          <ToolCard
            icon={<Unlock className="h-6 w-6" />}
            title="Unlock PDF"
            description="Enter the password of a file you own to save an unrestricted copy you can merge, split, compress or convert."
            tool="unlock"
          />
        </div>

      </section>

      {/* How it works */}
      <section className="border-y border-border bg-[color:var(--cream-warm)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <SectionHeading eyebrow="How it works" title="Three steps, start to finish" />
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className="relative rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display text-sm font-bold">
                    {i + 1}
                  </span>
                  <Icon className="h-5 w-5 text-[color:var(--emerald-mid)]" />
                </div>
                <p className="font-display mt-4 text-lg font-semibold">{title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{text}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="hidden sm:block absolute -right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--gold)]" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <SectionHeading eyebrow="Why our tools" title="Built around your file staying put" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="w-fit p-2.5 rounded-xl bg-[color:var(--emerald-mid)]/10 text-[color:var(--emerald-mid)]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-display mt-4 font-semibold">{title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="border-y border-border bg-[color:var(--cream-warm)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <SectionHeading
            eyebrow="Comparison"
            title="Desktop software vs. Nesake PDF"
            text="The same edits, without the install, the licence key or the update prompts."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 items-start">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <p className="font-display text-lg font-semibold text-muted-foreground">
                Traditional software
              </p>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {[
                  "Requires installation",
                  "Large downloads",
                  "Platform dependent",
                  "Updates required",
                  "Often paid or watermarked",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--destructive)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-primary text-primary-foreground p-6 sm:p-8 shadow-[0_18px_40px_-24px_rgba(6,78,59,0.55)]">
              <p className="font-display text-lg font-bold">Nesake PDF tools</p>
              <ul className="mt-5 space-y-3 text-sm text-primary-foreground/85">
                {[
                  "Browser based",
                  "Instant — nothing to download",
                  "Works everywhere",
                  "Always up to date",
                  "Free, with no watermarks",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold-soft)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <SectionHeading eyebrow="FAQs" title="Common questions" />
        <Accordion type="single" collapsible className="mt-8 w-full">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.question} value={`q${i}`}>
              <AccordionTrigger className="text-left font-display">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-[color:var(--emerald-mid)]">
            <BookOpen className="h-5 w-5" />
            <p className="font-display font-semibold text-foreground">Go deeper in the docs</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            The documentation covers page copying, range syntax, compression trade-offs, privacy and
            security in detail — no repeated content, just the reference.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <DocLink hash="merge">How merge works</DocLink>
            <DocLink hash="split">How split works</DocLink>
            <DocLink hash="compression">How compression works</DocLink>
            <DocLink hash="privacy">Privacy</DocLink>
            <DocLink hash="security">Security</DocLink>
          </div>
        </div>
      </section>
    </>
  );
}

function DocLink({ hash, children }: { hash: string; children: React.ReactNode }) {
  return (
    <Link
      to="/docs"
      hash={hash}
      className="inline-flex items-center gap-1.5 text-[color:var(--emerald-deep)]"
    >
      {children} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="font-display mt-3 text-2xl sm:text-3xl font-bold">{title}</h2>
      {text && (
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{text}</p>
      )}
    </div>
  );
}

function CompressionBar() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-baseline justify-between mb-2 text-xs">
        <span className="font-medium text-muted-foreground">Typical scan compression</span>
        <span className="font-display font-semibold text-[color:var(--emerald-deep)]">-64%</span>
      </div>
      <div className="h-2 rounded-full bg-[color:var(--muted)] overflow-hidden">
        <div
          className="h-full rounded-full"
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
        {tool === "pdf-to-word" && <PdfToWord />}
        {tool === "pdf-to-jpg" && <PdfToJpg />}
        {tool === "jpg-to-pdf" && <JpgToPdf />}
        {tool === "rotate" && <PdfRotate />}
        {tool === "protect" && <PdfProtect />}
        {tool === "unlock" && <PdfUnlock />}
      </section>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--emerald-mid)]" />
          Files never leave your device
        </div>
        <DocLink
          hash={
            tool === "compress"
              ? "compression"
              : tool === "protect" || tool === "unlock"
                ? "security"
                : tool
          }
        >
          Read how this works
        </DocLink>
      </div>
    </div>
  );
}
