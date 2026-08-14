import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export function LegalLayout({
  title,
  subtitle,
  updated,
  children,
}: {
  title: string;
  subtitle: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">{title}</span>
          </nav>

          <h1 className="font-display mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">{subtitle}</p>
          <p className="mt-4 text-xs text-muted-foreground">Last updated: {updated}</p>

          <div className="mt-10 space-y-10">{children}</div>

          <aside className="mt-14 rounded-3xl border border-border bg-[color:var(--cream-warm)] p-6 sm:p-7">
            <p className="font-display text-base font-bold">Keep reading</p>
            <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <li>
                <Link to="/pdf-tools" className="text-[color:var(--emerald-deep)] hover:underline">
                  All PDF tools
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-[color:var(--emerald-deep)] hover:underline">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[color:var(--emerald-deep)] hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[color:var(--emerald-deep)] hover:underline">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-[color:var(--emerald-deep)] hover:underline">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[color:var(--emerald-deep)] hover:underline">
                  Contact us
                </Link>
              </li>
            </ul>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalSection({
  id,
  heading,
  children,
}: {
  id?: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display text-xl font-bold tracking-tight">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm text-muted-foreground leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
