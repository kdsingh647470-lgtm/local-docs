import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

const linkClass = "text-muted-foreground transition-colors hover:text-primary";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-base font-bold">Nesake PDF</p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
            Browser-based PDF tools. Your documents are processed on your device and never uploaded
            to a server.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
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
              PDF to Image
            </Link>
          </li>
          <li>
            <Link to="/pdf-tools" search={{ tool: "jpg-to-pdf" }} className={linkClass}>
              Image to PDF
            </Link>
          </li>
          <li>
            <Link to="/pdf-tools" search={{ tool: "delete-pages" }} className={linkClass}>
              Delete Pages
            </Link>
          </li>
          <li>
            <Link to="/pdf-tools" search={{ tool: "extract-pages" }} className={linkClass}>
              Extract Pages
            </Link>
          </li>
          <li>
            <Link to="/pdf-tools" search={{ tool: "rotate" }} className={linkClass}>
              Rotate PDF
            </Link>
          </li>
          <li>
            <Link to="/pdf-tools" search={{ tool: "sign" }} className={linkClass}>
              Sign PDF
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
            <Link to="/docs" hash="troubleshooting" className={linkClass}>
              Troubleshooting
            </Link>
          </li>
          <li>
            <Link to="/docs" hash="faq" className={linkClass}>
              FAQs
            </Link>
          </li>
        </FooterCol>

        <FooterCol title="Company & legal">
          <li>
            <Link to="/contact" className={linkClass}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className={linkClass}>
              Contact
            </Link>
          </li>
          <li>
            <Link to="/privacy" className={linkClass}>
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms" className={linkClass}>
              Terms of Use
            </Link>
          </li>
          <li>
            <Link to="/cookies" className={linkClass}>
              Cookie Policy
            </Link>
          </li>
        </FooterCol>
      </div>

      <div className="border-t border-border/70 bg-background/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <p className="font-display text-sm font-bold">Why trust Nesake PDF?</p>
          <div className="mt-4 grid gap-5 text-xs text-muted-foreground leading-relaxed sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-foreground font-semibold">Local processing</p>
              <p className="mt-1">
                Files are read, edited and saved inside your browser tab. Nothing is uploaded, so
                there is no server copy to leak or delete.
              </p>
            </div>
            <div>
              <p className="text-foreground font-semibold">No accounts, no watermarks</p>
              <p className="mt-1">
                No sign-up, no email, no trial limits. Output files carry no watermark and are not
                capped in number.
              </p>
            </div>
            <div>
              <p className="text-foreground font-semibold">Browser compatibility</p>
              <p className="mt-1">
                Works in current Chrome, Edge, Firefox and Safari. Once the page has loaded, the
                tools keep working offline.
              </p>
            </div>
            <div>
              <p className="text-foreground font-semibold">Phones and tablets</p>
              <p className="mt-1">
                Touch-friendly drop zones and thumbnail grids. Very large documents run slower on
                mobile hardware than on a desktop.
              </p>
            </div>
          </div>
        </div>
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
