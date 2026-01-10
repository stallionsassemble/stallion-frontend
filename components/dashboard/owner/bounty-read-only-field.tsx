import { Label } from "@/components/ui/label";
import Link from "next/link";

export const ReadOnlyField = ({
  label,
  subLabel,
  value,
  prefix = "https://",
  actionLink,
  isTextArea = false,
  required = false
}: {
  label: string,
  subLabel?: string,
  value?: string,
  prefix?: string,
  actionLink?: string,
  isTextArea?: boolean,
  required?: boolean
}) => {
  // Auto-detect if value should be displayed as textarea (plain string, not a URL)
  const isUrl = value && (value.startsWith('http') || value.startsWith('www') || value.startsWith('https://'));
  const shouldShowAsTextArea = isTextArea || (!isUrl && value && value.length > 0);

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-0.5">
        <Label className="text-sm font-medium text-slate-200">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {subLabel && <p className="text-[11px] text-slate-500 font-inter">{subLabel}</p>}
      </div>

      {shouldShowAsTextArea && !isUrl ? (
        <div className="bg-[#0B0E14] border border-white/5 rounded-lg p-3 text-sm text-slate-400 min-h-[60px] whitespace-pre-wrap leading-relaxed font-inter">
          {value || "No content provided."}
        </div>
      ) : (
        <div className="flex items-center h-11 bg-[#0B0E14] border border-white/5 rounded-lg overflow-hidden transition-colors hover:border-white/10 group">
          {prefix && (
            <div className="h-full px-3 flex items-center justify-center border-r border-white/5 bg-[#12151C] text-slate-500 text-xs font-mono select-none">
              {prefix}
            </div>
          )}
          <div className="flex-1 px-3 text-sm text-slate-300 truncate font-inter">
            {value ? value.replace(prefix, "") : "Not provided"}
          </div>
        </div>
      )}

      {actionLink && value && (
        <Link
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          className="inline-flex items-center text-[#3B82F6] text-[11px] font-medium hover:underline mt-1"
        >
          View Submission
        </Link>
      )}
    </div>
  );
};