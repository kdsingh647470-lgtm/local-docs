import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/site/legal-layout";

const TITLE = "Terms of Use — Nesake PDF";
const DESCRIPTION =
  "The terms that apply when you use the free browser-based PDF tools on Nesake PDF: acceptable use, ownership of your files, and limits of liability.";
const URL = "https://pdftools.nesake.com/terms";

export const Route = createFileRoute("/terms")({
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
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Use"
      subtitle="Plain-language terms covering your use of the Nesake PDF tools and documentation. By using the site you agree to what follows."
      updated="14 August 2026"
    >
      <LegalSection heading="The service">
        <p>
          Nesake PDF provides free, browser-based PDF utilities and accompanying documentation. No
          account is required and there is no paid tier. Tools run on your own device, so their speed
          and success depend on your browser and available memory.
        </p>
      </LegalSection>

      <LegalSection heading="Your files remain yours">
        <p>
          We claim no rights over any document you open with these tools. Because processing is local,
          we never receive a copy, and we cannot access, restore or moderate your files.
        </p>
        <p>
          You are responsible for having the legal right to edit, convert, sign, encrypt or decrypt
          any document you process, and for keeping your own backups before running a tool.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <ul>
          <li>Do not use the tools to remove protection from documents you are not authorised to open.</li>
          <li>Do not use the site to create forged or misleading signed documents.</li>
          <li>Do not attempt to disrupt the site, its hosting, or other visitors&rsquo; use of it.</li>
          <li>Do not republish the site&rsquo;s written guides as your own content.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="No warranty">
        <p>
          The tools are provided &ldquo;as is&rdquo;. PDF files vary enormously, and some documents —
          scans without a text layer, unusual fonts, damaged files, very large documents on mobile
          hardware — will not convert or compress well, or at all. We make no guarantee of fitness for
          a particular purpose, uninterrupted availability, or a specific output size or quality.
        </p>
        <p>
          Visible signatures added with Sign PDF are images placed on the page. They are not
          cryptographic digital signatures and do not by themselves prove document integrity.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          To the fullest extent permitted by law, we are not liable for lost data, lost profits, or
          any indirect or consequential loss arising from use of the site. Always keep the original
          file until you have checked the output.
        </p>
      </LegalSection>

      <LegalSection heading="Advertising">
        <p>
          The site may display advertising to cover hosting costs. Advertising appears alongside
          content only, never inside a tool&rsquo;s file-picking or processing area.
        </p>
      </LegalSection>

      <LegalSection heading="Changes and contact">
        <p>
          These terms may be updated as the product changes; the date above reflects the latest
          revision. Questions can go to{" "}
          <a className="text-[color:var(--emerald-deep)] hover:underline" href="mailto:support@nesake.com">
            support@nesake.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
