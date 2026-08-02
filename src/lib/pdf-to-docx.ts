import { loadPdfjs } from "@/lib/pdfjs";

export interface ConvertOptions {
  /** Keep one Word page per PDF page by inserting explicit page breaks. */
  pageBreaks: boolean;
  /** Try to keep detected headings, bold runs and sizes. */
  keepFormatting: boolean;
  onProgress?: (done: number, total: number) => void;
}

export interface ConvertResult {
  blob: Blob;
  pageCount: number;
  /** Pages that yielded no extractable text (likely scanned images). */
  emptyPages: number[];
  characters: number;
}

interface Piece {
  text: string;
  size: number;
  bold: boolean;
  italic: boolean;
}

interface Line {
  pieces: Piece[];
  y: number;
  x: number;
  size: number;
}

interface Block {
  lines: Line[];
}

const SENTENCE_END = /[.!?:;”"')\]]\s*$/;

function isBoldName(name: string) {
  return /bold|black|heavy|semib|demi/i.test(name);
}
function isItalicName(name: string) {
  return /italic|oblique/i.test(name);
}

/** Group pdf.js text items into visual lines, then lines into paragraphs. */
function buildBlocks(
  items: Array<{
    str: string;
    transform: number[];
    width: number;
    height: number;
    fontName: string;
    hasEOL?: boolean;
  }>,
  styles: Record<string, { fontFamily?: string }>,
): Block[] {
  const lines: Line[] = [];

  for (const item of items) {
    if (!item.str) continue;
    const x = item.transform[4];
    const y = item.transform[5];
    const size = Math.abs(item.transform[3]) || item.height || 12;
    const fontRef = styles?.[item.fontName]?.fontFamily ?? item.fontName ?? "";
    const nameHint = `${item.fontName ?? ""} ${fontRef}`;
    const piece: Piece = {
      text: item.str,
      size,
      bold: isBoldName(nameHint),
      italic: isItalicName(nameHint),
    };

    const last = lines[lines.length - 1];
    const sameLine = last && Math.abs(last.y - y) <= Math.max(2, size * 0.4);
    if (sameLine) {
      const prev = last.pieces[last.pieces.length - 1];
      // pdf.js splits runs mid-word; only add a space when the glyphs are apart.
      const needsSpace =
        prev &&
        !/\s$/.test(prev.text) &&
        !/^\s/.test(item.str) &&
        x - last.x > size * 0.25;
      if (needsSpace) last.pieces.push({ ...piece, text: ` ${item.str}` });
      else last.pieces.push(piece);
      last.x = x + item.width;
      last.size = Math.max(last.size, size);
    } else {
      lines.push({ pieces: [piece], y, x: x + item.width, size });
    }
  }

  // Merge wrapped lines into paragraphs.
  const blocks: Block[] = [];
  let current: Line[] = [];
  let prevLine: Line | null = null;

  for (const line of lines) {
    const text = line.pieces.map((p) => p.text).join("").trim();
    if (!text) continue;
    if (!prevLine) {
      current = [line];
      prevLine = line;
      continue;
    }
    const gap = prevLine.y - line.y;
    const prevText = prevLine.pieces.map((p) => p.text).join("").trim();
    const wrapped =
      gap > 0 &&
      gap < line.size * 1.9 &&
      Math.abs(line.size - prevLine.size) < 1.5 &&
      !SENTENCE_END.test(prevText) &&
      !/^[•\-–*\d]+[.)]?\s/.test(text);
    if (wrapped) {
      current.push(line);
    } else {
      blocks.push({ lines: current });
      current = [line];
    }
    prevLine = line;
  }
  if (current.length) blocks.push({ lines: current });

  return blocks;
}

function medianSize(blocks: Block[]): number {
  const sizes: number[] = [];
  for (const b of blocks) for (const l of b.lines) sizes.push(l.size);
  if (!sizes.length) return 12;
  sizes.sort((a, b) => a - b);
  return sizes[Math.floor(sizes.length / 2)];
}

export async function convertPdfToDocx(
  data: ArrayBuffer,
  options: ConvertOptions,
): Promise<ConvertResult> {
  const [pdfjsLib, docxMod] = await Promise.all([loadPdfjs(), import("docx")]);
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    PageBreak,
    HeadingLevel,
    AlignmentType,
  } = docxMod;

  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const total = pdf.numPages;
  const children: InstanceType<typeof Paragraph>[] = [];
  const emptyPages: number[] = [];
  let characters = 0;

  for (let pageNum = 1; pageNum <= total; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const blocks = buildBlocks(
      content.items as never,
      content.styles as never,
    );
    const body = medianSize(blocks);
    let pageHasText = false;

    for (const block of blocks) {
      const runs: InstanceType<typeof TextRun>[] = [];
      block.lines.forEach((line, i) => {
        if (i > 0) runs.push(new TextRun({ text: " " }));
        for (const piece of line.pieces) {
          if (!piece.text) continue;
          characters += piece.text.length;
          runs.push(
            new TextRun({
              text: piece.text,
              bold: options.keepFormatting ? piece.bold : false,
              italics: options.keepFormatting ? piece.italic : false,
              size: options.keepFormatting
                ? Math.round(Math.min(Math.max(piece.size, 7), 36) * 2)
                : 24,
            }),
          );
        }
      });
      if (!runs.length) continue;
      pageHasText = true;

      const blockSize = Math.max(...block.lines.map((l) => l.size));
      const isHeading =
        options.keepFormatting &&
        block.lines.length === 1 &&
        blockSize > body * 1.18;
      const heading = isHeading
        ? blockSize > body * 1.5
          ? HeadingLevel.HEADING_1
          : HeadingLevel.HEADING_2
        : undefined;

      children.push(
        new Paragraph({
          children: runs,
          heading,
          alignment: AlignmentType.LEFT,
          spacing: { after: isHeading ? 160 : 120 },
        }),
      );
    }

    if (!pageHasText) {
      emptyPages.push(pageNum);
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[Page ${pageNum} contains no selectable text — it is likely a scanned image.]`,
              italics: true,
              color: "888888",
              size: 20,
            }),
          ],
          spacing: { after: 120 },
        }),
      );
    }

    if (options.pageBreaks && pageNum < total) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    options.onProgress?.(pageNum, total);
    page.cleanup?.();
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: "Calibri", size: 24 } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return { blob, pageCount: total, emptyPages, characters };
}
