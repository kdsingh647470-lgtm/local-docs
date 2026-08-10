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
  Images,
  ImagePlus,
  RotateCw,
  Target,
  Users,
  Lock,
  Unlock,
  Mail,
  HelpCircle,
  Scale,
  FileText,
  Trash2,
} from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ToolCard, type ToolCardProps } from "@/components/site/tool-card";
import { DOC_ENTRIES, FAQ_ITEMS } from "@/lib/site-content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TITLE = "Nesake PDF — Free Online PDF Tools | Merge, Split, Compress";
const DESCRIPTION =
  "Free PDF tools by Nesake: merge, split, delete and extract pages, compress, convert to Word, convert to and from images, rotate, protect and unlock — all locally in your browser. Private, fast, no watermark, no account.";
const URL = "https://pdftools.nesake.com/";

const HOME_FAQ = FAQ_ITEMS.slice(0, 6);

const FAQPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

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
          featureList: [
            "Merge PDF files",
            "Split and extract PDF pages",
            "Delete PDF pages",
            "Extract PDF pages",
            "Compress PDF files",
            "Convert PDF to Word",
            "Convert PDF to JPG, PNG or WEBP",
            "Convert images to PDF",
            "Rotate PDF pages",
            "Protect PDF with a password",
            "Unlock password-protected PDF",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Nesake PDF",
          url: URL,
          description: "Free browser-based PDF tools built for privacy and speed.",
          sameAs: [],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(FAQPageSchema),
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

const SOFTWARE_CATEGORIES = [
  {
    icon: FileText,
    title: "Document tools",
    text: "PDF utilities that merge, split, compress, rotate, convert to Word and exchange pages with images.",
    href: "/pdf-tools",
  },
  {
    icon: Target,
    title: "Privacy-first design",
    text: "Every app is built so your data stays on your device. No cloud processing means nothing to leak or retain.",
    href: "/docs",
    hash: "privacy",
  },
  {
    icon: Zap,
    title: "Speed by default",
    text: "No upload queues, no sign-up friction, no server round-trips. The work starts the moment you pick a file.",
    href: "/docs",
    hash: "getting-started",
  },
];

const TRUST_POINTS = [
  {
    icon: Lock,
    title: "Local processing",
    text: "Your PDF never leaves the browser tab. There is no server-side endpoint that receives the file, and closing the tab discards it completely.",
  },
  {
    icon: ShieldCheck,
    title: "No account required",
    text: "We do not ask for your email, payment details or social login. There is no identity to associate with a document.",
  },
  {
    icon: Scale,
    title: "Clear terms and limits",
    text: "The tools are provided as-is for lawful use. Errors are surfaced visibly, and the limits of each conversion are explained in the documentation.",
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
            Merge, split, delete, extract, compress, convert, rotate, protect and unlock PDFs
            securely in your browser. No installation. Fast. Private. Free.
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
          text="Seven tools cover the tasks people reach for most. Each one runs locally and downloads straight back to your device."
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
          <ToolCard
            icon={<Images className="h-6 w-6" />}
            title="PDF to Image"
            description="Turn each page into a JPG, PNG or WEBP image at screen, standard or print quality — one page or a ZIP of all."
            tool="pdf-to-jpg"
          />
          <ToolCard
            icon={<ImagePlus className="h-6 w-6" />}
            title="Image to PDF"
            description="Bundle JPG, PNG, WEBP, GIF, BMP or AVIF images into one PDF, reordered how you like, on A4, Letter or image-sized pages."
            tool="jpg-to-pdf"
            accent="gold"
          />
          <ToolCard
            icon={<RotateCw className="h-6 w-6" />}
            title="Rotate PDF"
            description="Straighten sideways scans from a thumbnail grid, page by page or the whole document at once."
            tool="rotate"
          />
          <ToolCard
            icon={<Lock className="h-6 w-6" />}
            title="Protect PDF"
            description="Add a password with AES-256 or AES-128 encryption and decide whether printing and copying stay allowed."
            tool="protect"
            accent="gold"
          />
          <ToolCard
            icon={<Unlock className="h-6 w-6" />}
            title="Unlock PDF"
            description="Remove the password from a document you can already open and save an unrestricted copy."
            tool="unlock"
          />
          <ToolCard
            icon={<Trash2 className="h-6 w-6" />}
            title="Delete Pages"
            description="Tick the pages you don't need in the thumbnail grid and download a clean PDF without them."
            tool="delete-pages"
            accent="gold"
          />
          <ToolCard
            icon={<Scissors className="h-6 w-6" />}
            title="Extract Pages"
            description="Choose pages visually or by range and save just those pages as a brand new PDF."
            tool="extract-pages"
          />
        </div>
      </section>

      {/* About / What is Nesake */}
      <section id="about" className="scroll-mt-24 border-y border-border bg-[color:var(--cream-warm)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                eyebrow="About Nesake"
                title="What is Nesake?"
                text="Nesake is a small product studio building free, browser-based utilities that treat your privacy as a feature, not an afterthought."
              />
              <div className="mt-6 space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  We started with a simple frustration: most online PDF tools force you to upload
                  sensitive documents to a distant server before you can do anything with them. That
                  means waiting, trusting a third party, and hoping the file is deleted afterwards.
                </p>
                <p>
                  Nesake PDF proves there is a better way. The PDF engine — merging, splitting,
                  compression, conversion and rotation — runs entirely inside your browser tab using
                  JavaScript. The file you pick is read from your local disk, edited in memory, and
                  written back out as a download. Nothing is transmitted, queued or stored by us.
                </p>
                <p>
                  Because there is no server-side processing, we can offer the tools free of charge,
                  without asking for an account, and without adding watermarks to your output. The
                  trade-off is honesty: we tell you clearly what each tool can and cannot do, and we
                  document the real limits in our knowledge base.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[color:var(--emerald-mid)]/10 text-[color:var(--emerald-mid)]">
                  <Target className="h-5 w-5" />
                </div>
                <p className="font-display text-lg font-semibold">Our mission</p>
              </div>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Make everyday document tasks fast, private and accessible to everyone. We believe
                the best tools are the ones that get out of your way: open the page, do the job,
                close the tab. No account, no upload, no surveillance.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {[
                  "Build utilities that run on the user's device, not our servers.",
                  "Never require an account, email or payment to use the core product.",
                  "Explain the limits of every tool so users can make informed choices.",
                  "Keep the interface clean, modern and accessible across devices.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--emerald-mid)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Software categories */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <SectionHeading
          eyebrow="What we build"
          title="Categories of software we build"
          text="Nesake focuses on lightweight, browser-based productivity tools. PDF utilities are our first category, designed as a reference for how every future app should behave."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {SOFTWARE_CATEGORIES.map(({ icon: Icon, title, text, href, hash }) => (
            <Link
              key={title}
              to={href}
              hash={hash}
              className="group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[color:var(--gold)]/60 hover:shadow-md"
            >
              <div className="w-fit p-2.5 rounded-xl bg-[color:var(--emerald-mid)]/10 text-[color:var(--emerald-mid)]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-display mt-4 font-semibold">{title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed flex-1">{text}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--emerald-deep)]">
                Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
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

      {/* Trust & quality */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <SectionHeading
          eyebrow="Trust & quality"
          title="Why you can trust our apps"
          text="We treat your files with the same caution we would want for our own. That means no cloud dependency, no hidden data collection, and no misleading promises."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="w-fit p-2.5 rounded-xl bg-[color:var(--gold)]/15 text-[color:var(--emerald-deep)]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-display mt-4 font-semibold">{title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link
            to="/docs"
            hash="privacy"
            className="inline-flex items-center gap-1.5 font-semibold text-[color:var(--emerald-deep)] underline underline-offset-4"
          >
            Read our privacy policy <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/docs"
            hash="security"
            className="inline-flex items-center gap-1.5 font-semibold text-[color:var(--emerald-deep)] underline underline-offset-4"
          >
            Read our security practices <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Documentation */}
      <section className="border-y border-border bg-[color:var(--cream-warm)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
        </div>
      </section>

      {/* Learning center */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 border-y border-border bg-[color:var(--cream-warm)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            text="Quick answers to the questions that matter most for privacy, limits and getting started."
          />
          <Accordion type="single" collapsible className="mt-8 w-full">
            {HOME_FAQ.map((item, i) => (
              <AccordionItem key={item.question} value={`home-q${i}`}>
                <AccordionTrigger className="text-left font-display">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-6 text-sm text-muted-foreground text-center">
            Have a different question?{" "}
            <Link to="/docs" hash="faq" className="font-semibold text-[color:var(--emerald-deep)] underline underline-offset-4">
              Read the full FAQ
            </Link>{" "}
            or{" "}
            <Link to="/docs" hash="contact" className="font-semibold text-[color:var(--emerald-deep)] underline underline-offset-4">
              contact us
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-[color:var(--cream-warm)] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <Mail className="h-3 w-3" />
                Contact
              </div>
              <h2 className="font-display mt-4 text-2xl sm:text-3xl font-bold">Get in touch</h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Found a bug, have a feature request, or want to report a file that did not process
                correctly? We read every message. The most useful details are the tool name, browser,
                device, file size and page count, and the exact error message shown.
              </p>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-[color:var(--cream-warm)] p-4">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--emerald-mid)]" />
                <div>
                  <p className="font-semibold text-foreground">Support & bug reports</p>
                  <p className="mt-1 text-muted-foreground">
                    Start with the{" "}
                    <Link to="/docs" hash="troubleshooting" className="font-semibold text-[color:var(--emerald-deep)] underline underline-offset-4">
                      troubleshooting guide
                    </Link>
                    {" "}or send a note through the contact channel listed below.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-[color:var(--cream-warm)] p-4">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--emerald-mid)]" />
                <div>
                  <p className="font-semibold text-foreground">Partners & press</p>
                  <p className="mt-1 text-muted-foreground">
                    For business or media enquiries, use the same contact route and we will route your
                    message to the right person.
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Contact channel: <span className="font-semibold text-foreground">support@nesake.com</span>
              </p>
            </div>
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

import { ToolCard, type ToolCardProps } from "@/components/site/tool-card";

// ...

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
  cta: { label: string; tool: ToolCardProps["tool"] };
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
