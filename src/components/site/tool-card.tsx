import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tool?:
    | "merge"
    | "split"
    | "compress"
    | "pdf-to-word"
    | "pdf-to-jpg"
    | "jpg-to-pdf"
    | "rotate"
    | "protect"
    | "unlock"
    | "delete-pages"
    | "extract-pages"
    | "sign";
  comingSoon?: boolean;
  accent?: "emerald" | "gold";
}

/** Premium tool card shared by the home page and the tools hub. */
export function ToolCard({
  icon,
  title,
  description,
  tool,
  comingSoon,
  accent = "emerald",
}: ToolCardProps) {
  const iconClass =
    accent === "gold"
      ? "border-primary/20 bg-primary/10 text-primary"
      : "border-secondary bg-secondary/70 text-secondary-foreground";

  const body = (
    <>
      <div className="flex items-start justify-between">
        <div className={`rounded-lg border p-3 transition-colors group-hover:border-primary/40 ${iconClass}`}>{icon}</div>
        {comingSoon && (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[color:var(--muted)] text-muted-foreground">
            Coming soon
          </span>
        )}
      </div>
      <h3 className="font-display mt-5 text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
      {!comingSoon && (
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">
          Open tool
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      )}
    </>
  );

  const base =
    "group flex h-full flex-col rounded-lg border border-border bg-card/80 p-6 text-left shadow-sm sm:p-7";

  if (comingSoon || !tool) {
    return <div className={`${base} opacity-70`}>{body}</div>;
  }

  return (
    <Link
      to="/pdf-tools"
      search={{ tool }}
      aria-label={`${title} — ${description}`}
      className={`${base} min-h-[12rem] transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-accent/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
    >
      {body}
    </Link>
  );
}
