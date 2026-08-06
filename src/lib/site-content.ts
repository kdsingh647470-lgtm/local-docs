export interface FaqItem {
  question: string;
  answer: string;
}

/** Single source of truth for FAQ copy — rendered on /pdf-tools and used for FAQPage schema. */
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Are my PDF files uploaded to a server?",
    answer:
      "No. Every tool runs inside your browser tab using JavaScript. The file you pick is read from local disk into memory, edited there, and written back out as a download. Nothing is transmitted, so there is no upload queue and nothing for us to store or delete.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "There is no artificial limit — the practical ceiling is your device's available memory. Files above roughly 50 MB will show a warning because rendering page thumbnails and rewriting the document takes noticeably longer on phones and older laptops.",
  },
  {
    question: "Why can't I open a password-protected PDF?",
    answer:
      "Encrypted PDFs cannot be parsed without the password, so the tools detect the encryption and stop with a clear message instead of failing silently. Remove the password in the application that created the file, then run it through the tool again.",
  },
  {
    question: "How much smaller will my file get after compression?",
    answer:
      "It depends on what is inside the PDF. Scans and photo-heavy documents often drop by half or more because their images are re-encoded at a lower quality. A text-only PDF is already compact, so savings there are small and the output can occasionally be slightly larger.",
  },
  {
    question: "Do I need an account, and is it really free?",
    answer:
      "No account, no email, no trial. Because processing happens on your device there are no per-file server costs, so the tools are free to use as often as you like and the output carries no watermark.",
  },
  {
    question: "Can I convert a PDF to an editable Word document?",
    answer:
      "Yes. The PDF to Word tool extracts the text layer of your PDF and rebuilds it as a .docx file with headings, bold and italic runs and paragraph flow preserved. It runs entirely in your browser, so the document is never uploaded. Complex layouts such as multi-column pages, tables and images are flattened into plain paragraphs, and a scanned PDF has no text layer to extract, so it needs OCR first.",
  },
  {
    question: "Can I turn PDF pages into JPG or PNG images?",
    answer:
      "Yes. The PDF to Image tool renders every page to a JPG, PNG or WEBP file at screen, standard or print quality and lets you download a single page or all of them together in a ZIP archive. Rendering happens on your device, so nothing is uploaded.",
  },
  {
    question: "Can I make a PDF from photos or scans?",
    answer:
      "Yes. Image to PDF accepts JPG, PNG, WEBP, GIF, BMP and AVIF images, lets you reorder them, and writes one page per image. Choose A4 or Letter pages to centre each image with your chosen margin and orientation, or fit-to-image so the page matches the photo's own dimensions.",
  },
  {
    question: "How do I fix a sideways scanned page?",
    answer:
      "Open Rotate PDF, drop the file in, and rotate individual pages left or right from the thumbnail grid — or rotate every page at once. Rotation is stored as page metadata, so text and image quality are untouched.",
  },
  {
    question: "Does it work on a phone or tablet?",
    answer:
      "Yes. The layouts, drop zones, and thumbnail grids are touch-friendly and adapt to small screens. Very large documents will be slower on mobile hardware than on a desktop.",
  },
  {
    question: "Does it work offline?",
    answer:
      "Once the page has loaded, the tools keep working without a connection because the PDF engine is already running in your browser.",
  },
];

export interface DocEntry {
  hash: string;
  title: string;
  summary: string;
}

/** Documentation sections that live on /docs — surfaced as cards on the home page. */
export const DOC_ENTRIES: DocEntry[] = [
  {
    hash: "getting-started",
    title: "Getting started",
    summary: "Pick a tool, add a file, download the result — the whole workflow in three steps.",
  },
  {
    hash: "merge",
    title: "How PDF merge works",
    summary: "Page copying, document order, and what happens to bookmarks and form fields.",
  },
  {
    hash: "split",
    title: "How split & extract works",
    summary: "Selecting pages visually, range syntax like 1-3, 5, and exporting a ZIP of pages.",
  },
  {
    hash: "compression",
    title: "How compression works",
    summary: "Why image re-encoding drives the savings and which quality level to choose.",
  },
  {
    hash: "pdf-to-word",
    title: "How PDF to Word works",
    summary: "Text extraction, heading detection, and why scanned PDFs need OCR first.",
  },
  {
    hash: "pdf-to-jpg",
    title: "How PDF to Image works",
    summary: "Page rendering, JPG/PNG/WEBP output, quality levels, and single vs. ZIP downloads.",
  },
  {
    hash: "jpg-to-pdf",
    title: "How Image to PDF works",
    summary: "Image ordering, A4/Letter versus fit-to-image pages, orientation, margins and formats.",
  },
  {
    hash: "rotate",
    title: "How rotate works",
    summary: "Per-page and whole-document rotation, and why quality is never affected.",
  },
  {
    hash: "privacy",
    title: "Privacy",
    summary: "What leaves your device (nothing) and what we could not collect even if we wanted to.",
  },
  {
    hash: "security",
    title: "Security",
    summary: "Encrypted files, corrupted files, and how errors are surfaced instead of hidden.",
  },
];
