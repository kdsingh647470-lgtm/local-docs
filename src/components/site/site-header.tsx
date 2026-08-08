import { Link } from "@tanstack/react-router";
import { Layers } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-[color:var(--background)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16">
        <Link to="/" className="flex items-center gap-2.5 min-w-0">
          <span className="p-2 rounded-xl bg-primary text-primary-foreground">
            <Layers className="h-4 w-4" />
          </span>
          <span className="font-display text-base font-bold tracking-tight truncate">
            Nesake <span className="text-[color:var(--emerald-mid)]">PDF</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link
            to="/pdf-tools"
            activeProps={{ className: "text-foreground font-semibold" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="rounded-lg px-2.5 sm:px-3 py-2 transition-colors hover:text-foreground"
          >
            Tools
          </Link>
          <Link
            to="/docs"
            activeProps={{ className: "text-foreground font-semibold" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="rounded-lg px-2.5 sm:px-3 py-2 transition-colors hover:text-foreground"
          >
            Docs
          </Link>
          <Link
            to="/"
            hash="about"
            inactiveProps={{ className: "text-muted-foreground" }}
            className="hidden sm:inline-flex rounded-lg px-2.5 sm:px-3 py-2 transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            to="/"
            hash="contact"
            inactiveProps={{ className: "text-muted-foreground" }}
            className="hidden sm:inline-flex rounded-lg px-2.5 sm:px-3 py-2 transition-colors hover:text-foreground"
          >
            Contact
          </Link>
          <Link
            to="/pdf-tools"
            className="ml-1 hidden sm:inline-flex items-center rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground transition-colors hover:bg-[color:var(--emerald-mid)]"
          >
            Open tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
