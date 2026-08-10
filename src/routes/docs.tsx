import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Search, UserRound } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import {
  CHANGELOG,
  DOC_AUTHOR,
  FAQ_ITEMS,
  TROUBLESHOOTING,
} from "@/lib/site-content";

const TITLE = "Nesake PDF Docs — Guides, troubleshooting & reference";
const DESCRIPTION =
  "Complete Nesake PDF knowledge base: step-by-step guides for merge, split, delete and extract pages, compress, protect, unlock, PDF to Word, PDF to Image, Image to PDF and rotate, plus troubleshooting, FAQs, privacy details and the product changelog.";
const URL = "https://pdftools.nesake.com/docs";

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
          "@type": "TechArticle",
          headline: "Nesake PDF documentation",
          description: DESCRIPTION,
          url: URL,
          inLanguage: "en",
          dateModified: "2026-08-08",
          author: { "@type": "Organization", name: DOC_AUTHOR.name },
          publisher: { "@type": "Organization", name: "Nesake PDF" },
          articleSection: [
            "Getting started",
            "Tool guides",
            "Troubleshooting",
            "Privacy and security",
            "Changelog",
          ],
        }),
      },
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
              item: "https://pdftools.nesake.com/",
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

type Tool =
  | "merge"
  | "split"
  | "delete-pages"
  | "extract-pages"
  | "compress"
  | "pdf-to-word"
  | "pdf-to-jpg"
  | "jpg-to-pdf"
  | "rotate"
  | "protect"
  | "unlock";

interface Section {
  hash: string;
  title: string;
  group: string;
  keywords: string;
  body: React.ReactNode;
}

function useSections(): Section[] {
  return useMemo(
    () => [
      {
        hash: "getting-started",
        title: "Getting started",
        group: "Basics",
        keywords: "start upload download workflow steps first time no account",
        body: (
          <>
            <p>
              There is no sign-up and no upload step. Every tool runs inside the browser tab: the
              file you pick is read from local disk into memory, edited there, and written back out
              as a download.
            </p>
            <Steps
              items={[
                "Open the tools hub and pick the operation you need — merge, split, compress, convert or rotate.",
                "Drop your file onto the dashed area, or tap it to browse. Nothing is transmitted at this point.",
                "Adjust the options for that tool: page selection, quality, page size, rotation.",
                "Press the action button. The rewritten document is handed to your browser as a normal download, named after the original.",
              ]}
            />
            <Callout title="Before you start">
              Keep the original file until you have opened and checked the result. Because the work
              happens on your device, we cannot recover an input you have already replaced.
            </Callout>
            <Related
              links={[
                { hash: "merge", label: "How PDF merge works" },
                { hash: "troubleshooting", label: "Troubleshooting common errors" },
                { hash: "privacy", label: "Privacy: what leaves your device" },
              ]}
            />
            <ToolLink tool="merge">Start with merge</ToolLink>
          </>
        ),
      },
      {
        hash: "merge",
        title: "How PDF merge works",
        group: "Tool guides",
        keywords: "merge combine join order bookmarks forms multiple files",
        body: (
          <>
            <p>
              Merging creates a brand-new empty document and copies every page of every input into
              it, in the order shown in the file list. Drag the grip handle on a row to change that
              order — the list is the export order, top to bottom.
            </p>
            <Steps
              items={[
                "Add two or more PDFs; each row shows its page count and size so you can confirm the right file.",
                "Drag rows into the order you want, or remove a file you added by mistake.",
                "Press Merge. Pages are copied in list order into a single document.",
                "Check the merged download: page count should equal the sum of the inputs.",
              ]}
            />
            <Example
              title="Example: assembling a signed contract"
              text="Cover letter (1 page) + contract body (12 pages) + a scanned signature page (1 page) merges into a single 14-page file, with the scan last because it sits last in the list."
            />
            <p>
              Page content, embedded fonts and images are carried across as-is, so text stays
              selectable and quality is unchanged. Document-level extras such as bookmarks,
              attachments and interactive form fields are not copied; if you need them, keep the
              original file alongside the merged one.
            </p>
            <Related
              links={[
                { hash: "split", label: "How split & extract works" },
                { hash: "rotate", label: "Fixing a sideways page after merging" },
                { hash: "troubleshooting", label: "Merged file lost bookmarks?" },
              ]}
            />
            <ToolLink tool="merge">Open PDF merge</ToolLink>
          </>
        ),
      },
      {
        hash: "split",
        title: "How split and extract works",
        group: "Tool guides",
        keywords: "split extract pages range zip thumbnails select delete pages",
        body: (
          <>
            <p>
              After you add a file, every page is rendered to a small thumbnail so you can see what
              you are selecting. Tap a thumbnail to include or exclude that page. For long
              documents, type a range instead — <code>1-3, 5, 8-10</code> selects pages one to
              three, five, and eight to ten. Out-of-range numbers are rejected rather than silently
              ignored.
            </p>
            <Steps
              items={[
                "Add one PDF and wait for the thumbnail grid to finish rendering.",
                "Select pages by tapping thumbnails, or type a range such as 2, 5-9.",
                "Choose Extract to get one PDF with just those pages, in ascending order.",
                "Or choose Split into individual pages to get every page as its own PDF inside a ZIP.",
              ]}
            />
            <Example
              title="Example: pulling one invoice out of a monthly batch"
              text="A 60-page batch where each invoice is two pages: typing 23-24 extracts a clean two-page invoice you can send on its own."
            />
            <Related
              links={[
                { hash: "merge", label: "Recombining extracted pages" },
                { hash: "pdf-to-jpg", label: "Exporting pages as images instead" },
                { hash: "troubleshooting", label: "Thumbnails stay blank" },
              ]}
            />
          <ToolLink tool="split">Open PDF split</ToolLink>
          </>
        ),
      },
      {
        hash: "delete-pages",
        title: "How Delete Pages works",
        group: "Tool guides",
        keywords: "delete pages remove unwanted pages thumbnail range pdf locally",
        body: (
          <>
            <p>
              Delete Pages lets you remove the pages you do not want from a PDF and download a clean
              copy. The file is rendered to a thumbnail grid so you can see exactly what you are
              removing, and you can also type a page range like <code>1-3, 5, 8-10</code> to select
              pages in bulk.
            </p>
            <Steps
              items={[
                "Add a PDF and wait for the thumbnail grid to render.",
                "Tap the thumbnails you want to remove, or type a range in the input box.",
                "Review the live counter showing how many pages will remain in the result.",
                "Press the remove button and download the trimmed PDF.",
              ]}
            />
            <Example
              title="Example: removing blank pages from a scan"
              text="A 12-page scan where pages 3, 7 and 11 are blank can be reduced to a clean 9-page document by selecting those three thumbnails and downloading."
            />
            <Callout title="Cannot remove every page">
              The tool refuses to delete every page in the document because a PDF must have at least
              one page. If you need to discard the whole file, you can simply delete the local file
              instead.
            </Callout>
            <Related
              links={[
                { hash: "extract-pages", label: "Keeping only the pages you want" },
                { hash: "split", label: "Splitting a PDF into pieces" },
                { hash: "troubleshooting", label: "Thumbnails stay blank" },
              ]}
            />
            <ToolLink tool="delete-pages">Open Delete Pages</ToolLink>
          </>
        ),
      },
      {
        hash: "extract-pages",
        title: "How Extract Pages works",
        group: "Tool guides",
        keywords: "extract pages keep selected range new pdf thumbnail pages",
        body: (
          <>
            <p>
              Extract Pages is the opposite of Delete Pages: you select the pages you want to keep,
              and the tool writes those pages into a brand-new PDF in the order you selected them.
              Pages are picked visually or by range, and the live counter shows how many pages will
              be in the output.
            </p>
            <Steps
              items={[
                "Add a PDF and wait for thumbnails to render.",
                "Tap the pages you want to keep, or type a range such as 2, 5-9.",
                "Confirm the selected count and the number of pages in the result.",
                "Download the new PDF containing only the chosen pages.",
              ]}
            />
            <Example
              title="Example: pulling a chapter from a long report"
              text="A 40-page report where pages 12-19 form a self-contained chapter can be extracted as an 8-page PDF you can share on its own."
            />
            <Related
              links={[
                { hash: "delete-pages", label: "Removing pages instead of keeping them" },
                { hash: "split", label: "Splitting into a ZIP of individual pages" },
                { hash: "troubleshooting", label: "Thumbnails stay blank" },
              ]}
            />
            <ToolLink tool="extract-pages">Open Extract Pages</ToolLink>
          </>
        ),
      },
      {
        hash: "compression",
        title: "How compression works",
        group: "Tool guides",
        keywords: "compress reduce size shrink quality jpeg rasterise email attachment limit",
        body: (
          <>
            <p>
              Compression tries two strategies and keeps whichever produces the smaller file, so the
              output can never be larger than the input. The first is a lossless re-save: unused
              metadata is dropped and the document is repacked with object streams. The second
              rasterises each page — it is rendered and re-encoded as a JPEG at the quality you pick,
              then embedded into a fresh document.
            </p>
            <Steps
              items={[
                "Add the PDF; the original size is shown for comparison.",
                "Pick High for print or close reading, Medium for email and general sharing, Low when size is all that matters.",
                "Press Compress and read the reported change and which method won.",
                "If the saving is small, the lossless path won — that file is already efficient.",
              ]}
            />
            <table className="not-prose w-full text-left text-sm">
              <caption className="sr-only">Expected savings by document type</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                    Document type
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                    Typical result
                  </th>
                  <th scope="col" className="py-2 font-semibold text-foreground">
                    Recommended quality
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Phone scans / photo pages", "50-80% smaller", "Medium"],
                  ["Slide decks with images", "30-60% smaller", "Medium or High"],
                  ["Text-only reports", "0-10% smaller (lossless path)", "Any"],
                  ["Already-compressed exports", "A few percent, or unchanged", "Any"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-border/60">
                    <td className="py-2 pr-4">{row[0]}</td>
                    <td className="py-2 pr-4">{row[1]}</td>
                    <td className="py-2">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Callout title="Trade-off to know">
              When the rasterise path wins, pages become images: text in the output is no longer
              selectable or searchable. Keep the original whenever searchable text matters.
            </Callout>
            <Related
              links={[
                { hash: "pdf-to-jpg", label: "Rendering pages as images deliberately" },
                { hash: "troubleshooting", label: "Compression returned the same size" },
              ]}
            />
            <ToolLink tool="compress">Open PDF compress</ToolLink>
          </>
        ),
      },
      {
        hash: "pdf-to-word",
        title: "How PDF to Word works",
        group: "Tool guides",
        keywords: "pdf to word docx convert editable text extraction headings ocr scanned",
        body: (
          <>
            <p>
              A PDF stores glyphs at fixed coordinates rather than paragraphs, so conversion
              reconstructs the document. Every text run on a page is read with its position, size and
              font name; runs sharing a baseline become a line, wrapped lines are rejoined into a
              paragraph, and an isolated line noticeably larger than the body text is promoted to a
              heading. The result is written out as a real <strong>.docx</strong> package you can
              edit in Word, Google Docs or LibreOffice.
            </p>
            <Steps
              items={[
                "Add a PDF that has a real text layer — if you can select text in a reader, you are fine.",
                "Leave Keep formatting on to carry bold, italic and font sizes across; turn it off for a uniformly styled document.",
                "Turn on One Word page per PDF page if you need explicit page breaks instead of continuous flow.",
                "Convert, then open the .docx and fix any table or multi-column area that was flattened.",
              ]}
            />
            <Callout title="What does not survive">
              Multi-column layouts, tables and images are simplified into plain paragraphs. Scanned
              pages have no text layer at all — those pages are flagged in the output and need OCR
              before their words can be recovered.
            </Callout>
            <Related
              links={[
                { hash: "troubleshooting", label: "Empty output from a scanned PDF" },
                { hash: "split", label: "Converting only part of a long document" },
              ]}
            />
            <ToolLink tool="pdf-to-word">Open PDF to Word</ToolLink>
          </>
        ),
      },
      {
        hash: "pdf-to-jpg",
        title: "How PDF to Image works",
        group: "Tool guides",
        keywords: "pdf to image jpg png webp render export pages zip dpi quality screenshot",
        body: (
          <>
            <p>
              Each page is drawn onto a canvas at the resolution implied by the quality you pick —
              <strong> low</strong> for screen sharing, <strong>medium</strong> for everyday use and{" "}
              <strong>high</strong> when the image will be printed or cropped — then encoded as a
              JPG, PNG or WEBP file. PNG stays lossless for sharp text, while JPG and WEBP apply the
              quality setting to keep files small. Rendering is capped to a fixed pixel budget, so a
              phone produces the same image as a desktop instead of silently degrading large pages.
            </p>
            <Steps
              items={[
                "Add a PDF and pick an output format: PNG for crisp text, JPG for small photos, WEBP for the best of both.",
                "Choose the quality level; higher means more pixels per page and a bigger file.",
                "Watch thumbnails appear as pages finish rendering.",
                "Download a single page, or take every page at once in one ZIP archive.",
              ]}
            />
            <Example
              title="Example: a slide for a presentation"
              text="Export page 4 as PNG at print quality, then paste it into your deck — text edges stay sharp because PNG does not re-compress them."
            />
            <Related
              links={[
                { hash: "jpg-to-pdf", label: "Going the other way: Image to PDF" },
                { hash: "compression", label: "Why rasterising affects text" },
              ]}
            />
            <ToolLink tool="pdf-to-jpg">Open PDF to Image</ToolLink>
          </>
        ),
      },
      {
        hash: "jpg-to-pdf",
        title: "How Image to PDF works",
        group: "Tool guides",
        keywords: "image to pdf jpg png webp gif bmp avif a4 letter margin orientation photos scans",
        body: (
          <>
            <p>
              Add as many JPG, PNG, WEBP, GIF, BMP or AVIF images as you like (anything other than
              JPG or PNG is re-encoded losslessly to PNG before embedding); each one becomes a single
              page in a new document, in the order shown in the list. Use the arrows on a row to move
              an image up or down before exporting — the list order is the page order.
            </p>
            <Steps
              items={[
                "Add your images and reorder them with the row arrows.",
                "Pick A4 or Letter to centre each image on a standard page, or Fit to image for borderless pages.",
                "For standard pages, set the margin and force portrait or landscape if the automatic choice is wrong.",
                "Export; the images are embedded as-is, so no quality is lost.",
              ]}
            />
            <Example
              title="Example: turning phone photos of receipts into one file"
              text="Six photos on A4 with a 24 pt margin become a tidy six-page PDF you can attach to an expense claim."
            />
            <Related
              links={[
                { hash: "pdf-to-jpg", label: "Extracting images back out of a PDF" },
                { hash: "compression", label: "Shrinking a photo-heavy result" },
              ]}
            />
            <ToolLink tool="jpg-to-pdf">Open Image to PDF</ToolLink>
          </>
        ),
      },
      {
        hash: "rotate",
        title: "How rotate works",
        group: "Tool guides",
        keywords: "rotate turn sideways landscape upside down scan orientation 90 degrees",
        body: (
          <>
            <p>
              Every page is rendered to a thumbnail so you can see which ones are sideways. Rotate a
              single page 90° left or right with the buttons under its thumbnail, or use the
              rotate-all controls to turn the whole document at once; changed pages are outlined so
              the pending edits are easy to review, and Reset clears them.
            </p>
            <Steps
              items={[
                "Add the PDF and scan the thumbnail grid for pages facing the wrong way.",
                "Rotate individual pages, or use rotate-all when the whole scan came in sideways.",
                "Review the outlined pages — outlines mark pending, unsaved rotations.",
                "Download. The button unlocks once at least one page has been turned.",
              ]}
            />
            <p>
              Rotation is written as the page's own rotation attribute rather than by redrawing the
              content, so text stays selectable, images keep their original resolution and the file
              size barely changes.
            </p>
            <Related
              links={[
                { hash: "split", label: "Removing a page instead of rotating it" },
                { hash: "troubleshooting", label: "Download button stays disabled" },
              ]}
            />
            <ToolLink tool="rotate">Open Rotate PDF</ToolLink>
          </>
        ),
      },
      {
        hash: "troubleshooting",
        title: "Troubleshooting",
        group: "Support",
        keywords:
          "troubleshooting error problem fix encrypted password blank slow crash download blocked failed",
        body: (
          <>
            <p>
              Every failure is surfaced with a message rather than a partially written download. The
              table below covers the errors people actually hit, what causes them and the fix.
            </p>
            <div className="not-prose overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <caption className="sr-only">Common problems, causes and fixes</caption>
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                      Problem
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold text-foreground">
                      Cause
                    </th>
                    <th scope="col" className="py-2 font-semibold text-foreground">
                      Fix
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {TROUBLESHOOTING.map((t) => (
                    <tr key={t.problem} className="border-b border-border/60 align-top">
                      <td className="py-3 pr-4 font-medium text-foreground">{t.problem}</td>
                      <td className="py-3 pr-4">{t.cause}</td>
                      <td className="py-3">{t.fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Related
              links={[
                { hash: "security", label: "How errors are surfaced" },
                { hash: "faq", label: "Frequently asked questions" },
              ]}
            />
          </>
        ),
      },
      {
        hash: "privacy",
        title: "Privacy",
        group: "Trust",
        keywords: "privacy gdpr data retention upload server account tracking confidential",
        body: (
          <>
            <p>
              Your file never leaves the browser tab. There is no upload endpoint, no temporary
              storage bucket and no processing queue, which means there is nothing for us to retain,
              inspect or delete on your behalf. Closing the tab discards everything.
            </p>
            <p>
              We do not ask for an account, an email address or a payment method, so no document is
              ever associated with an identity. If your organisation forbids sending documents to
              third-party services, this model keeps the work inside your own machine.
            </p>
            <Callout title="How to verify it yourself">
              Open your browser's developer tools, switch to the Network tab, and run any tool. You
              will see the page and script loads, and no request carrying your document.
            </Callout>
            <Related
              links={[
                { hash: "security", label: "Security: encrypted and damaged files" },
                { hash: "terms", label: "Terms of use" },
              ]}
            />
          </>
        ),
      },
      {
        hash: "security",
        title: "Security",
        group: "Trust",
        keywords: "security encryption password protected corrupted malformed limits memory offline",
        body: (
          <>
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
            <p>
              Because the engine runs locally, an offline machine is fully supported once the page
              has loaded — useful for handling documents on an air-gapped or restricted network.
            </p>
            <Related
              links={[
                { hash: "privacy", label: "Privacy model" },
                { hash: "troubleshooting", label: "Password-protected file errors" },
              ]}
            />
          </>
        ),
      },
      {
        hash: "changelog",
        title: "Changelog and version history",
        group: "Reference",
        keywords: "changelog release notes version history updates new features",
        body: (
          <>
            <p>
              Every release that changed behaviour you can observe, newest first. Documentation is
              updated in the same release as the change it describes.
            </p>
            <ol className="not-prose space-y-5">
              {CHANGELOG.map((entry) => (
                <li key={entry.version} className="border-l-2 border-border pl-4">
                  <p className="font-display text-sm font-bold text-foreground">
                    v{entry.version}{" "}
                    <span className="font-sans font-normal text-muted-foreground">
                      · {entry.date}
                    </span>
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {entry.changes.map((c) => (
                      <li key={c} className="flex gap-2">
                        <span aria-hidden="true" className="text-[color:var(--gold)]">
                          •
                        </span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </>
        ),
      },
      {
        hash: "faq",
        title: "Frequently asked questions",
        group: "Support",
        keywords: "faq questions answers limits free account offline mobile size",
        body: (
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
        ),
      },
      {
        hash: "terms",
        title: "Terms of use",
        group: "Trust",
        keywords: "terms licence liability as-is lawful use",
        body: (
          <>
            <p>
              The tools are provided free of charge and as-is, for lawful use with documents you have
              the right to modify. Because processing happens entirely on your device, you remain in
              control of the input and the output — always keep the original file until you have
              checked the result.
            </p>
            <p>
              No warranty is offered as to fitness for a particular purpose, and the maintainers are
              not liable for loss arising from use of the output. Nothing here creates an obligation
              to retain your data, because none is collected.
            </p>
          </>
        ),
      },
      {
        hash: "contact",
        title: "Contact and roadmap",
        group: "Reference",
        keywords: "contact support roadmap request feature bug report protect unlock ocr watermark",
        body: (
          <>
            <p>
              Found a document that will not process, or want a tool that is not here yet? The
              roadmap on the tools hub lists what is planned next, including protect, unlock, OCR and
              watermark. When reporting a problem, the useful details are: the tool, the browser and
              device, the file size and page count, and the exact message shown.
            </p>
            <Link
              to="/pdf-tools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--emerald-deep)]"
            >
              See the roadmap <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        ),
      },
    ],
    [],
  );
}

function DocsPage() {
  const sections = useSections();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = q
    ? sections.filter((s) =>
        `${s.title} ${s.group} ${s.keywords}`.toLowerCase().includes(q),
      )
    : sections;

  const groups = Array.from(new Set(sections.map((s) => s.group)));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground" aria-current="page">
              Documentation
            </li>
          </ol>
        </nav>

        <h1 className="font-display mt-5 text-3xl sm:text-4xl font-bold max-w-2xl">
          Nesake PDF documentation
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">
          A complete reference for the browser-based PDF engine: step-by-step guides for every tool,
          what each one can and cannot do, troubleshooting for real errors, and the release history.
          The tools themselves live in the{" "}
          <Link
            to="/pdf-tools"
            className="font-semibold text-[color:var(--emerald-deep)] underline underline-offset-4"
          >
            tools hub
          </Link>
          .
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="h-3.5 w-3.5 text-[color:var(--emerald-mid)]" />
            {DOC_AUTHOR.name} — {DOC_AUTHOR.role}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-[color:var(--emerald-mid)]" />
            Last updated {DOC_AUTHOR.updated} · v{CHANGELOG[0]?.version}
          </span>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-24 h-fit">
            <label htmlFor="docs-search" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Search docs
            </label>
            <div className="relative mt-2">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="docs-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="merge, password, changelog…"
                className="pl-9"
              />
            </div>
            <p aria-live="polite" className="mt-2 text-xs text-muted-foreground">
              {q
                ? `${visible.length} of ${sections.length} article${visible.length === 1 ? "" : "s"} match`
                : `${sections.length} articles`}
            </p>

            <nav aria-label="Documentation contents" className="mt-6 space-y-5">
              {groups.map((group) => {
                const items = visible.filter((s) => s.group === group);
                if (items.length === 0) return null;
                return (
                  <div key={group}>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {group}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm">
                      {items.map((item) => (
                        <li key={item.hash}>
                          <Link
                            to="/docs"
                            hash={item.hash}
                            className="text-muted-foreground hover:text-[color:var(--emerald-deep)]"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </nav>
          </aside>

          <div className="space-y-6">
            {visible.map((section) => (
              <DocSection
                key={section.hash}
                id={section.hash}
                title={section.title}
                group={section.group}
              >
                {section.body}
              </DocSection>
            ))}
            {visible.length === 0 && (
              <p className="rounded-3xl border border-border bg-card p-8 text-sm text-muted-foreground">
                Nothing matches “{query}”. Try a tool name, an error message, or a word like privacy
                or changelog.
              </p>
            )}
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
  group,
  children,
}: {
  id: string;
  title: string;
  group: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--emerald-mid)]">
        {group}
      </p>
      <h2 id={`${id}-heading`} className="font-display mt-1.5 text-xl sm:text-2xl font-bold">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="not-prose space-y-3 text-sm">
      {items.map((item, i) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--emerald-deep)] text-[11px] font-bold text-white"
          >
            {i + 1}
          </span>
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="not-prose rounded-2xl border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 p-4">
      <p className="font-display text-sm font-bold text-foreground">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

function Example({ title, text }: { title: string; text: string }) {
  return (
    <div className="not-prose rounded-2xl border border-border bg-[color:var(--cream-warm)] p-4">
      <p className="font-display text-sm font-bold text-foreground">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function Related({ links }: { links: { hash: string; label: string }[] }) {
  return (
    <div className="not-prose border-t border-border pt-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Related articles
      </p>
      <ul className="mt-2.5 space-y-1.5 text-sm">
        {links.map((l) => (
          <li key={l.hash + l.label}>
            <Link
              to="/docs"
              hash={l.hash}
              className="inline-flex items-center gap-1.5 font-medium text-[color:var(--emerald-deep)] hover:underline underline-offset-4"
            >
              {l.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ToolLink({ tool, children }: { tool: Tool; children: React.ReactNode }) {
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
