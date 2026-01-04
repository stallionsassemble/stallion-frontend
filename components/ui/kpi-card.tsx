import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number | React.ReactNode;
  valuePrefix?: React.ReactNode;
  valueSuffix?: React.ReactNode;
  icon?: LucideIcon;
  status?: string;
  statusColor?: string; // Text color class for status
  borderColor?: string; // Hover border color class
  activeColor?: string; // Color for accent elements like suffix
  valueClassName?: string;
  className?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
}

export function KpiCard({
  label,
  value,
  valuePrefix,
  valueSuffix,
  icon: Icon,
  status,
  statusColor = "text-muted-foreground",
  borderColor = "hover:border-border",
  activeColor = "text-muted-foreground",
  valueClassName,
  className,
  layout = "column",
  iconAlignment = "center",
  iconStyle, // "standard" | "boxed" - defaults depend on layout
  iconClassName, // allow passing classes to the icon itself
  iconContainerClassName,
}: KpiCardProps & {
  layout?: "column" | "row";
  iconAlignment?: "top" | "center";
  iconStyle?: "standard" | "boxed";
}) {
  const finalIconStyle = iconStyle || (layout === "row" ? "boxed" : "standard");
  const finalIconAlignment = layout === "row" && iconAlignment === "top" ? "items-start" : "items-center";

  // Helper to render the icon based on style
  const renderIcon = () => {
    if (!Icon) return null;

    if (finalIconStyle === "boxed") {
      return (
        <div className={cn(
          "rounded-[16.3px] bg-card p-3 text-foreground shadow-[0px_6.52px_6.52px_0px_rgba(0,0,0,0.25)] border border-border shrink-0",
          iconContainerClassName
        )}>
          <Icon className={cn("h-6 w-6", iconClassName)} />
        </div>
      );
    }

    return <Icon className={cn("h-5 w-5 text-muted-foreground", iconClassName)} />;
  };

  if (layout === "row") {
    return (
      <div
        className={cn(
          "rounded-[14px] border-[1.19px] border-border border-t-[1.62px] bg-card p-5 relative overflow-hidden group transition-colors flex justify-between shadow-sm",
          finalIconAlignment,
          borderColor,
          className
        )}
      >
        <div className="space-y-1">
          <span className="text-sm font-inter text-muted-foreground block font-normal">{label}</span>
          <div className="flex items-center gap-2">
            <span className={cn("font-extrabold font-inter text-[24px] text-card-foreground flex items-center gap-1", valueClassName || "text-3xl")}>
              {valuePrefix}
              {value}
            </span>
            {valueSuffix && (
              <span className={cn("text-lg", activeColor)}>{valueSuffix}</span>
            )}
          </div>
          {status && (
            <span className={cn("text-xs font-bold font-inter block", statusColor)}>
              {status}
            </span>
          )}
        </div>
        {renderIcon()}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[14px] border border-border border-t-[1.62px] bg-background p-5 relative overflow-hidden group transition-colors shadow-sm",
        borderColor,
        className
      )}
    >
      <div className={cn("flex justify-between mb-2", iconAlignment === "center" ? "items-center" : "items-start")}>
        <span className="text-sm font-inter text-muted-foreground font-normal">{label}</span>
        {renderIcon()}
      </div>
      <div className="flex items-center justify-between">
        <span className={cn("font-extrabold font-inter text-[24px] text-card-foreground flex items-center gap-1", valueClassName || "text-3xl")}>
          {valuePrefix}
          {value}
        </span>
        {valueSuffix && (
          <span className={cn("text-lg", activeColor)}>{valueSuffix}</span>
        )}
      </div>
      {status && (
        <span className={cn("text-xs font-bold font-inter mt-1 block", statusColor)}>
          {status}
        </span>
      )}
    </div>
  );
}
