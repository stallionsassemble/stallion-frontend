import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  action
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in duration-500", className)}>
      <div className="bg-primary/5 p-4 rounded-full mb-4 ring-1 ring-primary/10 transition-transform group-hover:scale-110">
        {Icon && <Icon className="h-8 w-8 text-primary/60" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2 font-inter">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs mb-6 font-inter leading-relaxed">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
