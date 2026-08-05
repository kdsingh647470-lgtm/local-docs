import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

const linkClass = "text-muted-foreground transition-colors hover:text-[color:var(--emerald-deep)]";

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
          <li>
            <Link to="/pdf-tools" search={{ tool: "merge" }} className={linkClass}>
              Merge PDF
            </Link>
          </li>
          <li>
            <Link to="/pdf-tools" search={{ tool: "split" }} className={linkClass}>
              Split PDF
            </Link>
          </li>
          <li>
            <Link to="/pdf-tools" search={{ tool: "compress" }} className={linkClass}>
              Compress PDF
            </Link>
          </li>
          <li>
            <Link to="/pdf-tools" search={{ tool: "pdf-to-word" }} className={linkClass}>
              PDF to Word
            </Link>
          </li>
          <li>
            <Link to="/pdf-tools" search={{ tool: "pdf-to-jpg" }} className={linkClass}>
              PDF to JPG
            </Link>
          </li>
          <li>
            <Link to="/pdf-tools" search={{ tool: "jpg-to-pdf" }} className={linkClass}>
              JPG to PDF
            </Link>
          </li>
          <li>
            <Link to="/pdf-tools" search={{ tool: "rotate" }} className={linkClass}>
              Rotate PDF
            </Link>
          </li>
          <li>
            <Link to="/pdf-tools" className={linkClass}>
              All tools
            </Link>
          </li>
        </FooterCol>

        <FooterCol title="Documentation">
          <li>
            <Link to="/docs" hash="getting-started" className={linkClass}>
              Getting started
            </Link>
          </li>
          <li>
            <Link to="/docs" hash="merge" className={linkClass}>
              How merging works
            </Link>
          </li>
          <li>
            <Link to="/docs" hash="compression" className={linkClass}>
              How compression works
            </Link>
          </li>
          <li>
            <Link to="/docs" hash="faq" className={linkClass}>
              FAQs
            </Link>
          </li>
        </FooterCol>

        <FooterCol title="Company">
          <li>
            <Link to="/docs" hash="privacy" className={linkClass}>
              Privacy
            </Link>
          </li>
          <li>
            <Link to="/docs" hash="security" className={linkClass}>
              Security
            </Link>
          </li>
          <li>
            <Link to="/docs" hash="terms" className={linkClass}>
              Terms
            </Link>
          </li>
          <li>
            <Link to="/docs" hash="contact" className={linkClass}>
              Contact
            </Link>
          </li>
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
