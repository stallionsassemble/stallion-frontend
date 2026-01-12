import { cn } from "@/lib/utils";

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content) return null;

  return (
    <div
      className={cn(
        "prose prose-invert max-w-none",
        "prose-headings:font-bold prose-headings:text-foreground",
        "prose-p:text-muted-foreground prose-p:leading-relaxed",
        "prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80",
        "prose-ul:list-disc prose-ul:pl-4 prose-ul:text-muted-foreground",
        "prose-ol:list-decimal prose-ol:pl-4 prose-ol:text-muted-foreground",
        "prose-blockquote:border-l-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground",
        "prose-strong:text-foreground prose-strong:font-bold",
        "prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:text-foreground",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
