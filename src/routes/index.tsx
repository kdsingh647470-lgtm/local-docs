import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FilePlus2,
  Scissors,
  FileArchive,
  FileType2,
  ShieldCheck,
  Zap,
  Globe,
  Gift,
  MonitorSmartphone,
  Sparkles,
  Droplets,
  Check,
  BookOpen,
} from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ToolCard } from "@/components/site/tool-card";
import { DOC_ENTRIES } from "@/lib/site-content";

const TITLE = "Free PDF Tools Online — Merge, Split & Compress | Nesake";
const DESCRIPTION =
  "Merge, split and compress PDF files securely in your browser. No installation, no registration, no uploads — your documents stay on your device.";
const URL = "https://local-docs.lovable.app/";

export const Route = createFileRoute("/")({
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
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Nesake PDF Tools",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any (web browser)",
          url: URL,
          description: DESCRIPTION,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: Home,
});

const BADGES = [
  "Browser based",
  "Secure processing",
  "No registration",
  "Free forever",
  "Mobile friendly",
];

const REASONS = [
  {
    icon: Globe,
    title: "Browser based",
    text: "Nothing to install or update. Open the page and the tools are ready.",
  },
  {
    icon: ShieldCheck,
    title: "Private",
    text: "Files are read into memory on your device and never sent anywhere.",
  },
  {
    icon: Zap,
    title: "Fast",
    text: "No upload or queue time — work starts the moment you pick a file.",
  },
  { icon: Gift, title: "Free", text: "Unlimited use with no account, trial period or credits." },
  {
    icon: MonitorSmartphone,
    title: "Cross platform",
    text: "Same experience on Windows, macOS, Linux, Android and iOS.",
  },
  {
    icon: Sparkles,
    title: "Modern interface",
    text: "Visual page thumbnails, drag-to-reorder lists and clear progress.",
  },
  {
    icon: Droplets,
    title: "No watermarks",
    text: "Output files contain your content only — nothing is stamped on top.",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--gold) 30%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16 relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
            Nesake PDF platform
          </div>
          <h1 className="font-display mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] max-w-3xl">
            Free PDF tools{" "}
            <span className="italic text-[color:var(--emerald-mid)]">online</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Merge, split and compress PDFs securely in your browser. No installation. Fast. Private.
            Free.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/pdf-tools"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[color:var(--emerald-mid)]"
            >
              Explore PDF tools <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold transition-colors hover:border-[color:var(--gold)]/60"
            >
              <BookOpen className="h-4 w-4" /> Documentation
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {BADGES.map((b) => (
              <li key={b} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-[color:var(--emerald-mid)]" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured tools */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <SectionHeading
          eyebrow="Featured tools"
          title="Everything you need for everyday PDFs"
          text="Three tools cover the tasks people reach for most. Each one runs locally and downloads straight back to your device."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ToolCard
            icon={<FilePlus2 className="h-6 w-6" />}
            title="PDF Merge"
            description="Combine several documents into one file and drag them into the exact order you want before exporting."
            tool="merge"
          />
          <ToolCard
            icon={<Scissors className="h-6 w-6" />}
            title="PDF Split"
            description="Preview every page as a thumbnail, pick the pages you need, or break one PDF into a ZIP of single pages."
            tool="split"
            accent="gold"
          />
          <ToolCard
            icon={<FileArchive className="h-6 w-6" />}
            title="PDF Compress"
            description="Shrink large scans and photo-heavy files by re-encoding their images and stripping unused metadata."
            tool="compress"
          />
          <ToolCard
            icon={<FileType2 className="h-6 w-6" />}
            title="PDF to Word"
            description="Convert a PDF into an editable .docx with headings, bold text and paragraph flow rebuilt for you."
            tool="pdf-to-word"
            accent="gold"
          />
        </div>

      </section>

      {/* Why choose */}
      <section className="border-y border-border bg-[color:var(--cream-warm)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <SectionHeading
            eyebrow="Why Nesake"
            title="Why choose Nesake PDF tools"
            text="A local-first approach removes the two things people dislike most about online PDF services: waiting for uploads and wondering where the file went."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="w-fit p-2.5 rounded-xl bg-[color:var(--emerald-mid)]/10 text-[color:var(--emerald-mid)]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-display mt-4 font-semibold">{title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <SectionHeading
          eyebrow="Documentation"
          title="Read how each tool behaves"
          text="Short, practical reference pages that explain what happens to your file — written for people, not for a changelog."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOC_ENTRIES.map((entry) => (
            <Link
              key={entry.hash}
              to="/docs"
              hash={entry.hash}
              className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[color:var(--gold)]/60 hover:shadow-md"
            >
              <p className="font-display text-base font-semibold">{entry.title}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{entry.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--emerald-deep)]">
                Read
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Looking for answers instead?{" "}
          <Link to="/docs" hash="faq" className="font-semibold text-[color:var(--emerald-deep)] underline underline-offset-4">
            Browse the FAQs
          </Link>{" "}
          or open the{" "}
          <Link to="/pdf-tools" className="font-semibold text-[color:var(--emerald-deep)] underline underline-offset-4">
            tools hub
          </Link>
          .
        </p>
      </section>

      {/* Learning center */}
      <section className="border-t border-border bg-[color:var(--cream-warm)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <SectionHeading
            eyebrow="Learning center"
            title="Guides built from the documentation"
            text="Task-shaped walkthroughs that point at the relevant reference section instead of repeating it."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <ArticleCard
              hash="merge"
              kicker="4 min read"
              title="Combine scanned pages into one report"
              text="Order matters more than anything when merging. This walkthrough covers picking multiple files, reordering them by drag, and naming the export so the finished report is easy to find later."
              cta={{ label: "Open merge", tool: "merge" }}
            />
            <ArticleCard
              hash="split"
              kicker="3 min read"
              title="Pull a signature page out of a contract"
              text="Instead of guessing page numbers, use the thumbnail grid to click the pages you want, or type a range like 1-3, 8. The extracted pages become a fresh PDF containing nothing else."
              cta={{ label: "Open split", tool: "split" }}
            />
            <ArticleCard
              hash="compression"
              kicker="4 min read"
              title="Get a scan under an email size limit"
              text="Compression gains come from images, so scans respond best. Start at medium quality, check the reported reduction, and step down only if the file still exceeds the limit you are working against."
              cta={{ label: "Open compress", tool: "compress" }}
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="font-display mt-3 text-2xl sm:text-3xl font-bold">{title}</h2>
      <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function ArticleCard({
  hash,
  kicker,
  title,
  text,
  cta,
}: {
  hash: string;
  kicker: string;
  title: string;
  text: string;
  cta: { label: string; tool: "merge" | "split" | "compress" };
}) {
  return (
    <article className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--emerald-mid)]">
        {kicker}
      </p>
      <h3 className="font-display mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold">
        <Link to="/pdf-tools" search={{ tool: cta.tool }} className="text-[color:var(--emerald-deep)] inline-flex items-center gap-1.5">
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/docs" hash={hash} className="text-muted-foreground hover:text-foreground">
          Reference
        </Link>
      </div>
    </article>
  );
}
