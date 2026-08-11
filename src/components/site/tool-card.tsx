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
      ? "bg-[color:var(--gold)]/15 text-[color:var(--emerald-deep)]"
      : "bg-[color:var(--emerald-mid)]/10 text-[color:var(--emerald-mid)]";

  const body = (
    <>
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl transition-colors ${iconClass}`}>{icon}</div>
        {comingSoon && (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[color:var(--muted)] text-muted-foreground">
            Coming soon
          </span>
        )}
      </div>
      <h3 className="font-display mt-5 text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{description}</p>
      {!comingSoon && (
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--emerald-deep)]">
          Open tool
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      )}
    </>
  );

  const base =
    "group flex flex-col rounded-3xl border border-border bg-card p-6 sm:p-7 text-left shadow-sm h-full";

  if (comingSoon || !tool) {
    return <div className={`${base} opacity-70`}>{body}</div>;
  }

  return (
    <Link
      to="/pdf-tools"
      search={{ tool }}
      className={`${base} transition-all hover:-translate-y-0.5 hover:border-[color:var(--gold)]/60 hover:shadow-md`}
    >
      {body}
    </Link>
  );
}
