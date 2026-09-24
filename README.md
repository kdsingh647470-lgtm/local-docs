# PDF Magic Box

Generate a "PDF Tools" feature to the app: a page where users can merge, split, and 

compress PDF files entirely in the browser — no files are ever uploaded to a 

server. Everything happens locally on the user's device for privacy and speed.

ROUTE & NAVIGATION

- New route: /pdf-tools

- Add an entry point from the main navigation/dashboard, icon: FileText or Layers

- Page title: "PDF Tools" with subtitle "Merge, split, and compress PDFs — 

  processed locally on your device, never uploaded."

LIBRARY

- Use pdf-lib for merging, splitting, and page manipulation (loads/writes PDFs 

  entirely client-side)

- Use pdf.js (pdfjs-dist) for rendering page thumbnails/previews

- No server functions, no API calls, no upload step for any of these three tools

LAYOUT

Three tabs or cards: "Merge", "Split", "Compress" — consistent with the app's 

existing design system (same surface colors, border radius, spacing, and 

typography already used elsewhere in the app; support both light and dark theme).

1) MERGE

- Drag-and-drop or tap-to-browse multi-file picker, accepts only .pdf

- Show each uploaded file as a card with filename, page count, and file size

- Let users drag to reorder files before merging

- Allow removing a file from the list before merging

- "Merge PDFs" button combines them in the chosen order using pdf-lib's 

  copyPages, and triggers a download of the merged file (default name: 

  merged.pdf, editable)

- Show a progress indicator during merge for large files

2) SPLIT

- Single PDF upload

- Show a thumbnail grid of every page (via pdf.js rendering to canvas)

- Let the user select pages to extract in two modes:

  a. Tap individual thumbnails to select/deselect specific pages

  b. Enter a page range (e.g. "1-3, 5, 8-10")

- "Split / Extract" button generates a new PDF from the selected pages via 

  pdf-lib and downloads it

- Also offer "Split into individual pages" — generates a separate one-page PDF 

  per page, zipped together (use jszip) as one download

3) COMPRESS

- Single PDF upload

- Show original file size before processing

- Compression should:

  - Strip unnecessary metadata via pdf-lib

  - Re-render each page's embedded images through canvas at a reduced JPEG 

    quality (offer a quality slider: Low / Medium / High, mapped to canvas 

    export quality ~0.5/0.7/0.85), then re-embed the recompressed images into 

    a new PDF via pdf-lib

  - Show the resulting file size next to the original, with % reduction, 

    before the user downloads

- Be upfront in the UI that compression results vary — PDFs that are mostly 

  text see little size reduction (there's not much to compress); PDFs with 

  large embedded photos/scans see the biggest gains. Add a small info tooltip 

  explaining this so expectations are set correctly.

GENERAL REQUIREMENTS

- All processing must block the UI thread minimally — use a loading spinner / 

  progress bar during processing, especially for large files or many pages

- Handle errors gracefully: corrupted PDF, password-protected PDF (detect and 

  show "This PDF is password-protected and can't be processed" rather than 

  crashing), non-PDF files

- Mobile-friendly: this app runs inside a Capacitor Android wrapper too, so 

  touch targets should be large enough for mobile, and file picking should use 

  the standard <input type="file"> (works in both web and the wrapped app)

- No file size hard-limit imposed by the app itself, but show a soft warning 

  above ~50MB that processing may be slow on lower-end devices, since it all 

  happens on-device

- Respect the app's existing privacy positioning — add a short line of copy 

  reinforcing "Files never leave your device" somewhere visible on the page, 

  since this is a genuine differentiator worth surfacing to users

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://local-docs.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/52fd258d-4ce0-40c0-9150-28e828cb2fe3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
