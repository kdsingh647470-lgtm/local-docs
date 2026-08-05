import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { DOC_ENTRIES, FAQ_ITEMS } from "@/lib/site-content";

const TITLE = "Nesake PDF Documentation — How the browser PDF tools work";
const DESCRIPTION =
  "Reference documentation for Nesake PDF: getting started, how merge, split, compress, convert and rotate behave, privacy, security and answers to common questions.";
const URL = "https://local-docs.lovable.app/docs";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://local-docs.lovable.app/",
            },
            { "@type": "ListItem", position: 2, name: "Documentation", item: URL },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }),
      },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Documentation</span>
        </nav>

        <h1 className="font-display mt-5 text-3xl sm:text-4xl font-bold max-w-2xl">
          Nesake PDF documentation
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
          How each tool treats your file, what it can and cannot do, and where the limits are. The
          tools themselves live in the{" "}
          <Link
            to="/pdf-tools"
            className="font-semibold text-[color:var(--emerald-deep)] underline underline-offset-4"
          >
            tools hub
          </Link>
          .
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-24 h-fit">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              On this page
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[...DOC_ENTRIES.map((d) => ({ hash: d.hash, title: d.title })), { hash: "faq", title: "FAQs" }, { hash: "terms", title: "Terms" }, { hash: "contact", title: "Contact" }].map(
                (item) => (
                  <li key={item.hash}>
                    <Link
                      to="/docs"
                      hash={item.hash}
                      className="text-muted-foreground hover:text-[color:var(--emerald-deep)]"
                    >
                      {item.title}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </aside>

          <div className="space-y-6">
            <DocSection id="getting-started" title="Getting started">
              <p>
                There is no sign-up and no upload step. Open the tools hub, choose the operation you
                need, and drop a file onto the dashed area (or tap it to browse). The tool reads the
                document straight from disk into your browser's memory.
              </p>
              <p>
                When you are happy with the selection, press the action button. The rewritten
                document is handed to your browser as a normal download, named after the original so
                it is easy to spot in your downloads folder.
              </p>
              <ToolLink tool="merge">Start with merge</ToolLink>
            </DocSection>

            <DocSection id="merge" title="How PDF merge works">
              <p>
                Merging creates a brand-new empty document and copies every page of every input into
                it, in the order shown in the file list. Drag the grip handle on a row to change that
                order — the list is the export order, top to bottom.
              </p>
              <p>
                Page content, embedded fonts and images are carried across as-is, so text stays
                selectable and quality is unchanged. Document-level extras such as bookmarks,
                attachments and interactive form fields are not copied; if you need them, keep the
                original file alongside the merged one.
              </p>
              <ToolLink tool="merge">Open PDF merge</ToolLink>
            </DocSection>

            <DocSection id="split" title="How split and extract works">
              <p>
                After you add a file, every page is rendered to a small thumbnail so you can see what
                you are selecting. Tap a thumbnail to include or exclude that page. For long
                documents, type a range instead — <code>1-3, 5, 8-10</code> selects pages one to
                three, five, and eight to ten. Out-of-range numbers are rejected rather than
                silently ignored.
              </p>
              <p>
                "Extract" produces one PDF containing only the selected pages in ascending order.
                "Split into individual pages" ignores the selection and writes every page as its own
                PDF inside a single ZIP archive, which is the quicker option when you need all of
                them separately.
              </p>
              <ToolLink tool="split">Open PDF split</ToolLink>
            </DocSection>

            <DocSection id="compression" title="How compression works">
              <p>
                Compression works in two ways. First, unused metadata is dropped. Second — and this
                is where the real savings come from — each page is rendered and re-encoded as a JPEG
                at the quality level you pick, then embedded back into a fresh document.
              </p>
              <p>
                Choose <strong>High</strong> when the file will be printed or read closely,{" "}
                <strong>Medium</strong> for email and general sharing, and <strong>Low</strong> when
                size is the only thing that matters. Because pages become images, text in the output
                is no longer selectable or searchable — keep the original if you need that. Text-only
                PDFs are already efficient, so expect modest gains there and large ones on scans.
              </p>
              <ToolLink tool="compress">Open PDF compress</ToolLink>
            </DocSection>

            <DocSection id="pdf-to-word" title="How PDF to Word works">
              <p>
                A PDF stores glyphs at fixed coordinates rather than paragraphs, so conversion
                reconstructs the document. Every text run on a page is read with its position, size
                and font name; runs sharing a baseline become a line, wrapped lines are rejoined into
                a paragraph, and an isolated line noticeably larger than the body text is promoted to
                a heading. The result is written out as a real <strong>.docx</strong> package you can
                edit in Word, Google Docs or LibreOffice.
              </p>
              <p>
                <strong>Keep formatting</strong> carries bold, italic and font sizes across; turning
                it off produces a clean, uniformly styled document. <strong>One Word page per PDF
                page</strong> inserts explicit page breaks instead of letting text flow continuously.
                Multi-column layouts, tables and images are simplified into plain paragraphs, and a
                scanned PDF has no text layer at all — those pages are flagged in the output and need
                OCR before their words can be recovered.
              </p>
              <ToolLink tool="pdf-to-word">Open PDF to Word</ToolLink>
            </DocSection>

            <DocSection id="pdf-to-jpg" title="How PDF to JPG works">
              <p>
                Each page is drawn onto a canvas at the resolution implied by the quality you pick —
                <strong>low</strong> for screen sharing, <strong>medium</strong> for everyday use and{" "}
                <strong>high</strong> when the image will be printed or cropped — then encoded as a
                JPEG. Rendering is capped to a fixed pixel budget so a phone produces the same image
                as a desktop instead of silently degrading large pages.
              </p>
              <p>
                Thumbnails of the results appear as they finish, so you can download a single page
                straight away or take every page at once inside one ZIP archive. Images are named
                after the source document with the page number appended, keeping the original order
                obvious in your downloads folder.
              </p>
              <ToolLink tool="pdf-to-jpg">Open PDF to JPG</ToolLink>
            </DocSection>

            <DocSection id="jpg-to-pdf" title="How JPG to PDF works">
              <p>
                Add as many JPG or PNG images as you like; each one becomes a single page in a new
                document, in the order shown in the list. Use the arrows on a row to move an image up
                or down before exporting — the list order is the page order.
              </p>
              <p>
                <strong>A4 pages</strong> places every image centred on a standard page with a small
                margin, switching to landscape automatically for wide images, which is the right
                choice for printing. <strong>Fit to image</strong> instead sizes each page to the
                image itself, giving a borderless result that suits photo albums and screenshots. The
                images are embedded as-is, so no quality is lost in the conversion.
              </p>
              <ToolLink tool="jpg-to-pdf">Open JPG to PDF</ToolLink>
            </DocSection>

            <DocSection id="rotate" title="How rotate works">
              <p>
                Every page is rendered to a thumbnail so you can see which ones are sideways. Rotate
                a single page 90° left or right with the buttons under its thumbnail, or use the
                rotate-all controls to turn the whole document at once; changed pages are outlined so
                the pending edits are easy to review, and Reset clears them.
              </p>
              <p>
                Rotation is written as the page's own rotation attribute rather than by redrawing the
                content, so text stays selectable, images keep their original resolution and the file
                size barely changes. The download button stays disabled until at least one page has
                actually been turned.
              </p>
              <ToolLink tool="rotate">Open Rotate PDF</ToolLink>
            </DocSection>




            <DocSection id="privacy" title="Privacy">
              <p>
                Your file never leaves the browser tab. There is no upload endpoint, no temporary
                storage bucket and no processing queue, which means there is nothing for us to
                retain, inspect or delete on your behalf. Closing the tab discards everything.
              </p>
              <p>
                We do not ask for an account, an email address or a payment method, so no document is
                ever associated with an identity. If your organisation forbids sending documents to
                third-party services, this model keeps the work inside your own machine.
              </p>
            </DocSection>

            <DocSection id="security" title="Security">
              <p>
                Password-protected PDFs are detected before any work begins and rejected with an
                explanation, because an encrypted document cannot be parsed without its password.
                Remove the protection in the application that created the file, then try again.
              </p>
              <p>
                Damaged or non-PDF files fail the same way: with a visible message rather than a
                partially written download. Very large documents show a size warning first, since
                thumbnail rendering and rewriting are limited by the memory your device can spare.
              </p>
            </DocSection>

            <DocSection id="faq" title="Frequently asked questions">
              <Accordion type="single" collapsible className="w-full not-prose">
                {FAQ_ITEMS.map((item, i) => (
                  <AccordionItem key={item.question} value={`q${i}`}>
                    <AccordionTrigger className="text-left font-display">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </DocSection>

            <DocSection id="terms" title="Terms">
              <p>
                The tools are provided free of charge and as-is, for lawful use with documents you
                have the right to modify. Because processing happens entirely on your device, you
                remain in control of the input and the output — always keep the original file until
                you have checked the result.
              </p>
            </DocSection>

            <DocSection id="contact" title="Contact">
              <p>
                Found a document that will not process, or want a tool that is not here yet? The
                roadmap on the tools hub lists what is planned next, including protect, unlock,
                OCR and watermark.
              </p>
              <Link
                to="/pdf-tools"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--emerald-deep)]"
              >
                See the roadmap <ArrowRight className="h-4 w-4" />
              </Link>
            </DocSection>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm"
    >
      <h2 className="font-display text-xl sm:text-2xl font-bold">{title}</h2>
      <div className="mt-4 space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function ToolLink({
  tool,
  children,
}: {
  tool: "merge" | "split" | "compress" | "pdf-to-word" | "pdf-to-jpg" | "jpg-to-pdf" | "rotate";
  children: React.ReactNode;
}) {
  return (
    <Link
      to="/pdf-tools"
      search={{ tool }}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--emerald-deep)]"
    >
      {children} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
