import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, LifeBuoy, Bug } from "lucide-react";
import { LegalLayout, LegalSection } from "@/components/site/legal-layout";

const TITLE = "Contact & About — Nesake PDF";
const DESCRIPTION =
  "Who builds Nesake PDF, how to reach the team at support@nesake.com, and what to include when reporting a problem with a PDF tool.";
const URL = "https://pdftools.nesake.com/contact";

export const Route = createFileRoute("/contact")({
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
          "@type": "Organization",
          name: "Nesake PDF",
          url: "https://pdftools.nesake.com/",
          email: "support@nesake.com",
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: "support@nesake.com",
              availableLanguage: "English",
            },
          ],
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <LegalLayout
      title="Contact & About"
      subtitle="Nesake PDF is a small, independent project building PDF utilities that run entirely in the browser. We read every message sent to support@nesake.com."
      updated="14 August 2026"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <ContactCard
          icon={<Mail className="h-4 w-4" />}
          title="General enquiries"
          body="Questions about the tools, the documentation, or this site."
        />
        <ContactCard
          icon={<Bug className="h-4 w-4" />}
          title="Bug reports"
          body="Tell us the tool, your browser and device, and what you expected to happen."
        />
        <ContactCard
          icon={<LifeBuoy className="h-4 w-4" />}
          title="Feature requests"
          body="Tell us the job you are trying to finish — that shapes the roadmap."
        />
      </div>

      <LegalSection heading="Email us">
        <p>
          The fastest route is{" "}
          <a
            className="font-semibold text-[color:var(--emerald-deep)] hover:underline"
            href="mailto:support@nesake.com"
          >
            support@nesake.com
          </a>
          . We usually reply within a couple of working days.
        </p>
        <p>
          <strong>Please never attach the PDF you had trouble with.</strong> We cannot receive your
          documents through the tools, and we would rather not receive them by email either. A
          description of the file — roughly how many pages, whether it is a scan, whether it is
          password protected — is far more useful.
        </p>
      </LegalSection>

      <LegalSection heading="About the project">
        <p>
          Most online PDF services work by uploading your document to a server, converting it there,
          and sending a file back. That is convenient, but it means contracts, invoices, medical
          letters and ID scans end up on someone else&rsquo;s infrastructure.
        </p>
        <p>
          Nesake PDF takes the opposite approach: the PDF engine ships to your browser and the
          document never moves. That single decision shapes everything else — no accounts, no upload
          queues, no per-file server costs, and therefore no paywall or watermark.
        </p>
      </LegalSection>

      <LegalSection heading="Before you write in">
        <p>
          Many issues already have an answer in the documentation, including encrypted files, blank
          thumbnails, blocked downloads and disappointing compression on text-only PDFs.
        </p>
        <p>
          <Link to="/docs" className="font-semibold text-[color:var(--emerald-deep)] hover:underline">
            Read the troubleshooting guide
          </Link>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

function ContactCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <span className="inline-flex p-2 rounded-xl bg-[color:var(--emerald-mid)]/10 text-[color:var(--emerald-mid)]">
        {icon}
      </span>
      <p className="font-display mt-3 text-sm font-bold">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
