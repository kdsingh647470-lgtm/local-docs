import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, ShieldCheck, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { PdfMerge } from "@/components/pdf-tools/pdf-merge";
import { PdfSplit } from "@/components/pdf-tools/pdf-split";
import { PdfCompress } from "@/components/pdf-tools/pdf-compress";

export const Route = createFileRoute("/pdf-tools")({
  head: () => ({
    meta: [
      { title: "PDF Tools — Merge, split, and compress PDFs locally" },
      {
        name: "description",
        content:
          "Merge, split, and compress PDF files right in your browser. Files never leave your device.",
      },
      { property: "og:title", content: "PDF Tools — Merge, split, and compress PDFs locally" },
      {
        property: "og:description",
        content:
          "Merge, split, and compress PDF files right in your browser. Files never leave your device.",
      },
    ],
  }),
  component: PdfToolsPage,
});

function PdfToolsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <header className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">PDF Tools</h1>
          </div>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
            Merge, split, and compress PDFs — processed locally on your device, never uploaded.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-accent/40 px-3 py-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Files never leave your device
          </div>
        </header>

        <Card className="p-4 sm:p-6">
          <Tabs defaultValue="merge" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="merge" className="min-h-10">Merge</TabsTrigger>
              <TabsTrigger value="split" className="min-h-10">Split</TabsTrigger>
              <TabsTrigger value="compress" className="min-h-10">Compress</TabsTrigger>
            </TabsList>
            <TabsContent value="merge"><PdfMerge /></TabsContent>
            <TabsContent value="split"><PdfSplit /></TabsContent>
            <TabsContent value="compress"><PdfCompress /></TabsContent>
          </Tabs>
        </Card>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
}
