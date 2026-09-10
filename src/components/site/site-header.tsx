import { Link } from "@tanstack/react-router";
import { FileStack, ShieldCheck } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="rounded-lg border border-primary/30 bg-primary/10 p-2.5 text-primary">
            <FileStack className="h-5 w-5" />
          </span>
          <span className="font-display truncate text-base font-bold sm:text-lg">
            Nesake <span className="text-primary">PDF</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link
            to="/pdf-tools"
            activeProps={{ className: "text-foreground font-semibold" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="rounded-md px-2.5 py-2 transition-colors hover:bg-accent hover:text-foreground sm:px-3"
          >
            Tools
          </Link>
          <Link
            to="/docs"
            activeProps={{ className: "text-foreground font-semibold" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="rounded-md px-2.5 py-2 transition-colors hover:bg-accent hover:text-foreground sm:px-3"
          >
            Docs
          </Link>
          <Link
            to="/"
            hash="about"
            inactiveProps={{ className: "text-muted-foreground" }}
            className="hidden rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-foreground sm:inline-flex"
          >
            About
          </Link>
          <Link
            to="/"
            hash="contact"
            inactiveProps={{ className: "text-muted-foreground" }}
            className="hidden rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-foreground sm:inline-flex"
          >
            Contact
          </Link>
          <Link
            to="/pdf-tools"
            className="ml-1 hidden items-center rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            <ShieldCheck className="mr-2 h-4 w-4" /> Open tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
