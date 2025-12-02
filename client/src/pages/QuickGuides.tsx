import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

function simpleMdToHtml(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const html: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  for (let raw of lines) {
    const line = raw.trimEnd();
    // horizontal rule
    if (/^---+$/.test(line)) {
      closeList();
      html.push("<hr />");
      continue;
    }
    // headings
    if (/^######\s+/.test(line)) { closeList(); html.push(`<h6>${line.replace(/^######\s+/, "")}</h6>`); continue; }
    if (/^#####\s+/.test(line)) { closeList(); html.push(`<h5>${line.replace(/^#####\s+/, "")}</h5>`); continue; }
    if (/^####\s+/.test(line)) { closeList(); html.push(`<h4>${line.replace(/^####\s+/, "")}</h4>`); continue; }
    if (/^###\s+/.test(line)) { closeList(); html.push(`<h3>${line.replace(/^###\s+/, "")}</h3>`); continue; }
    if (/^##\s+/.test(line)) { closeList(); html.push(`<h2>${line.replace(/^##\s+/, "")}</h2>`); continue; }
    if (/^#\s+/.test(line)) { closeList(); html.push(`<h1>${line.replace(/^#\s+/, "")}</h1>`); continue; }

    // list items
    if (/^\-\s+/.test(line)) {
      const item = line.replace(/^\-\s+/, "");
      if (!inList) { html.push("<ul>"); inList = true; }
      html.push(`<li>${item}</li>`);
      continue;
    }

    // allow inline HTML passthrough lines (e.g., <div> badges)
    if (/^<\/?[a-zA-Z]/.test(line)) {
      closeList();
      html.push(line);
      continue;
    }

    // blank line => paragraph break
    if (line.trim() === "") {
      closeList();
      html.push("<br />");
      continue;
    }

    // paragraph
    closeList();
    html.push(`<p>${line}</p>`);
  }
  closeList();
  return html.join("\n");
}

export default function QuickGuides() {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("/docs/quick-safety-guides.md")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load guides (${res.status})`);
        const text = await res.text();
        setContent(text);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-4">Quick Safety Guides</h1>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Spinner className="w-5 h-5" />
          <span>Loading guides…</span>
        </div>
      </div>
    );
  }

  const rendered = simpleMdToHtml(content);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold mb-6">Quick Safety Guides</h1>
      <article className="prose prose-invert max-w-none guides-content">
        <div dangerouslySetInnerHTML={{ __html: rendered }} />
      </article>
    </div>
  );
}
