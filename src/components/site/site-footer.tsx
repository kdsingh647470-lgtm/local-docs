import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[color:var(--cream-warm)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-base font-bold">Nesake PDF</p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
            Browser-based PDF tools. Your documents are processed on your device and never uploaded
            to a server.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--emerald-mid)]" />
            Private by default
          </p>
        </div>

        <FooterCol title="Products">
          <FooterLink to="/pdf-tools" search={{ tool: "merge" }}>Merge PDF</FooterLink>
          <FooterLink to="/pdf-tools" search={{ tool: "split" }}>Split PDF</FooterLink>
          <FooterLink to="/pdf-tools" search={{ tool: "compress" }}>Compress PDF</FooterLink>
          <FooterLink to="/pdf-tools">All tools</FooterLink>
        </FooterCol>

        <FooterCol title="Documentation">
          <FooterLink to="/docs" hash="getting-started">Getting started</FooterLink>
          <FooterLink to="/docs" hash="merge">How merging works</FooterLink>
          <FooterLink to="/docs" hash="compression">How compression works</FooterLink>
          <FooterLink to="/docs" hash="faq">FAQs</FooterLink>
        </FooterCol>

        <FooterCol title="Company">
          <FooterLink to="/docs" hash="privacy">Privacy</FooterLink>
          <FooterLink to="/docs" hash="security">Security</FooterLink>
          <FooterLink to="/docs" hash="terms">Terms</FooterLink>
          <FooterLink to="/docs" hash="contact">Contact</FooterLink>
        </FooterCol>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nesake PDF. All processing happens locally in your browser.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({
  children,
  ...props
}: React.ComponentProps<typeof Link> & { children: React.ReactNode }) {
  return (
    <li>
      <Link
        {...(props as never)}
        className="text-muted-foreground transition-colors hover:text-[color:var(--emerald-deep)]"
      >
        {children}
      </Link>
    </li>
  );
}
