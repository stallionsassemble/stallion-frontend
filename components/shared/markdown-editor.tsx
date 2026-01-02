"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useId, useState } from "react";
import { MarkdownRenderer } from "./markdown-renderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  disabled?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write something...",
  className,
  minHeight = "min-h-[200px]",
  disabled = false,
}: MarkdownEditorProps) {
  const id = useId();
  const [activeTab, setActiveTab] = useState("write");

  return (

    <div className={cn("flex flex-col gap-2", className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-2">
          <TabsList className="h-8 bg-transparent p-0 gap-2">
            <TabsTrigger
              value="write"
              className="h-7 px-3 text-xs bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-transparent rounded-md"
            >
              Write
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="h-7 px-3 text-xs bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-transparent rounded-md"
            >
              Preview
            </TabsTrigger>
          </TabsList>
          <span className="text-[10px] text-muted-foreground hidden sm:inline-block">
            Markdown supported
          </span>
        </div>

        <TabsContent value="write" className="mt-0">
          <Textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "font-mono text-sm resize-none overflow-y-auto block", // enforce block and resize-none
              minHeight,
              // Override field-sizing-content using arbitrary property syntax if supported, or rely on height + overflow
              "[field-sizing:fixed]"
            )}
            style={{ fieldSizing: "fixed" } as any} // Direct style override to be safe against utility conflicts
            disabled={disabled}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className={cn(
            "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background overflow-y-auto",
            minHeight // ensure preview also respects the height
          )}>
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <span className="text-muted-foreground italic">Nothing to preview</span>
            )}
          </div>
        </TabsContent>
      </Tabs>
      <div className="text-[10px] text-muted-foreground sm:hidden">
        Markdown supported
      </div>
    </div>
  );
}
