import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/site/legal-layout";

const TITLE = "Cookie Policy — Nesake PDF";
const DESCRIPTION =
  "Which cookies and local storage Nesake PDF uses, why advertising partners may set their own, and how to control all of them from your browser.";
const URL = "https://pdftools.nesake.com/cookies";

export const Route = createFileRoute("/cookies")({
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
  component: CookiePage,
});

function CookiePage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="Nesake PDF uses very little client-side storage of its own. This page lists what may be stored on your device and how to remove it."
      updated="14 August 2026"
    >
      <LegalSection heading="What we store ourselves">
        <ul>
          <li>
            <strong>Preference storage.</strong> Small values such as a chosen compression quality or
            output format may be kept in your browser&rsquo;s local storage so a tool remembers your
            last choice. These never contain document content.
          </li>
          <li>
            <strong>No tracking cookies of our own.</strong> We do not set first-party cookies to
            profile you across the web, and there are no accounts, so there is no session cookie.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Third-party cookies from advertising">
        <p>
          The site may display advertising supplied by Google, including Google AdSense. Google and
          its partners can set cookies or read similar identifiers to serve ads, limit how often you
          see the same ad, and measure performance. Where permitted, this may include personalised
          advertising.
        </p>
        <p>
          These partners cannot see your PDF files. Documents are processed only inside your browser
          tab and are never sent anywhere, so there is nothing for an advertising script to read.
        </p>
      </LegalSection>

      <LegalSection heading="How to control cookies">
        <ul>
          <li>
            Every major browser lets you block or delete cookies for a single site or all sites — look
            for Privacy or Site settings.
          </li>
          <li>
            Google&rsquo;s own Ads Settings page lets you turn off ad personalisation across Google
            services.
          </li>
          <li>
            A content blocker will stop advertising scripts from loading. The PDF tools continue to
            work normally.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Questions">
        <p>
          Email{" "}
          <a className="text-[color:var(--emerald-deep)] hover:underline" href="mailto:support@nesake.com">
            support@nesake.com
          </a>{" "}
          if anything here is unclear, or read the{" "}
          <a className="text-[color:var(--emerald-deep)] hover:underline" href="/privacy">
            Privacy Policy
          </a>{" "}
          for the wider picture.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
