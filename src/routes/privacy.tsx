import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/site/legal-layout";

const TITLE = "Privacy Policy — Nesake PDF";
const DESCRIPTION =
  "How Nesake PDF handles your data: PDF files are processed locally in your browser and never uploaded. Read what we do and do not collect.";
const URL = "https://pdftools.nesake.com/privacy";

export const Route = createFileRoute("/privacy")({
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
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="Nesake PDF is built so that your documents stay on your device. This page explains exactly what that means in practice, and what limited information is handled when you visit the site."
      updated="14 August 2026"
    >
      <LegalSection heading="Your PDF files are never uploaded">
        <p>
          Every tool on this site — merge, split, compress, delete pages, extract pages, rotate,
          sign, protect, unlock, PDF to Word, PDF to Image and Image to PDF — runs entirely inside
          your browser tab using JavaScript and WebAssembly.
        </p>
        <p>
          When you pick a file, the browser reads it from local disk into memory. All editing happens
          in that memory, and the result is written back out as a download. <strong>No copy of your
          document is transmitted to us or to any third party</strong>, which means there is no
          upload queue, no server-side storage, and nothing for us to retain, share or delete.
        </p>
        <p>
          The same applies to passwords you type into Protect PDF or Unlock PDF, and to signatures
          you draw, type or upload in Sign PDF. They are used in-page and discarded when you close or
          reload the tab. Because there is no server-side copy, a forgotten PDF password cannot be
          recovered by us.
        </p>
      </LegalSection>

      <LegalSection heading="Information handled when you visit">
        <ul>
          <li>
            <strong>Standard request data.</strong> Like any website, our hosting provider processes
            technical request information such as IP address, user agent and requested URL in order
            to deliver pages and protect against abuse.
          </li>
          <li>
            <strong>No accounts.</strong> We do not offer sign-up, so we do not hold names, email
            addresses or passwords unless you choose to email us.
          </li>
          <li>
            <strong>Local browser storage.</strong> Tools may keep small preferences (for example a
            chosen quality level) in your browser. This never includes document content and never
            leaves your device.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Advertising and third parties">
        <p>
          This site may display advertising supplied by Google, including Google AdSense. Google and
          its partners may use cookies or similar identifiers to serve and measure ads, which can
          include personalised advertising where permitted. You can review and change your choices in
          Google&rsquo;s Ads Settings, and you can control cookies through your browser.
        </p>
        <p>
          Advertising is only ever placed around content. It is never injected into a file-picking or
          processing interface, and advertising partners have no access to your documents because
          those documents never leave your device.
        </p>
      </LegalSection>

      <LegalSection heading="Children">
        <p>
          The tools are general-purpose utilities and are not directed at children under 13. We do
          not knowingly collect personal information from children.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices">
        <ul>
          <li>Block or clear cookies at any time in your browser settings.</li>
          <li>Use the tools without ads by enabling a content blocker; functionality is unaffected.</li>
          <li>
            Ask us anything about this policy at{" "}
            <a className="text-[color:var(--emerald-deep)] hover:underline" href="mailto:support@nesake.com">
              support@nesake.com
            </a>
            .
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <p>
          If the way the site works changes in a way that affects your privacy, this page is updated
          and the date at the top changes with it.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
