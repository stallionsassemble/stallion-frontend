"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  addDays,
  format,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminService, type AdminReport } from "@/lib/api/admin";
import { exportRowsToCSV, type CSVCell } from "@/lib/csv";

type Preset =
  | "this-month"
  | "last-month"
  | "last-3-months"
  | "this-year"
  | "last-year"
  | "custom";

const PRESETS: { value: Preset; label: string }[] = [
  { value: "this-month", label: "This month" },
  { value: "last-month", label: "Last month" },
  { value: "last-3-months", label: "Last 3 months" },
  { value: "this-year", label: "This year" },
  { value: "last-year", label: "Last year" },
  { value: "custom", label: "Custom range" },
];

/** Start (inclusive) and end (exclusive) of a range, in the admin's local time. */
const presetRange = (preset: Exclude<Preset, "custom">, now = new Date()) => {
  const thisMonth = startOfMonth(now);
  switch (preset) {
    case "this-month":
      return {
        from: thisMonth,
        to: addDays(
          new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          1,
        ),
      };
    case "last-month":
      return { from: subMonths(thisMonth, 1), to: thisMonth };
    case "last-3-months":
      return { from: subMonths(thisMonth, 3), to: thisMonth };
    case "this-year":
      return {
        from: startOfYear(now),
        to: addDays(
          new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          1,
        ),
      };
    case "last-year":
      return {
        from: new Date(now.getFullYear() - 1, 0, 1),
        to: startOfYear(now),
      };
  }
};

const day = (value: string | null | undefined) =>
  value ? format(new Date(value), "yyyy-MM-dd") : "";

const errorMessage = (error: unknown, fallback: string) => {
  const message = (error as { response?: { data?: { message?: unknown } } })
    ?.response?.data?.message;
  if (Array.isArray(message)) return message.join(". ");
  return typeof message === "string" && message ? message : fallback;
};

/** One CSV: a summary, then a titled table per section, separated by blank rows. */
const reportRows = (report: AdminReport, label: string): CSVCell[][] => {
  const { summary, truncated } = report;
  const section = (
    title: string,
    cut: boolean,
    header: string[],
    rows: CSVCell[][],
  ): CSVCell[][] => [
    [],
    [`${title} (${rows.length})${cut ? " (first 5,000 rows only)" : ""}`],
    ...(rows.length ? [header, ...rows] : [["None in this period"]]),
  ];

  return [
    ["Stallion activity report"],
    ["Period", label],
    ["Generated", format(new Date(), "yyyy-MM-dd HH:mm")],
    [],
    ["Summary"],
    ["New users", summary.newUsers],
    ["New contributors", summary.newContributors],
    ["New project owners", summary.newProjectOwners],
    ["Bounties created", summary.bountiesCreated],
    ["Projects created", summary.projectsCreated],
    ["Hackathons created", summary.hackathonsCreated],
    ["Payouts completed", summary.payoutsCompleted],
    ["Payouts completed (USD)", summary.payoutsCompletedUsd.toFixed(2)],
    ["Payouts pending", summary.payoutsPending],
    ...section(
      "New users",
      truncated.users,
      [
        "Name",
        "Username",
        "Email",
        "Company",
        "Role",
        "Status",
        "Country",
        "Joined",
      ],
      report.users.map((u) => [
        u.name,
        u.username,
        u.email,
        u.companyName,
        u.role,
        u.status,
        u.country,
        day(u.joinedAt),
      ]),
    ),
    ...section(
      "Bounties",
      truncated.bounties,
      [
        "Title",
        "Owner",
        "Reward",
        "Currency",
        "Status",
        "Submissions",
        "Winners",
        "Submission deadline",
        "Created",
      ],
      report.bounties.map((b) => [
        b.title,
        b.owner,
        b.reward,
        b.currency,
        b.status,
        b.submissions,
        b.winners,
        day(b.submissionDeadline),
        day(b.createdAt),
      ]),
    ),
    ...section(
      "Projects",
      truncated.projects,
      [
        "Title",
        "Owner",
        "Reward",
        "Status",
        "People needed",
        "Accepted",
        "Applications",
        "Created",
      ],
      report.projects.map((p) => [
        p.title,
        p.owner,
        p.reward,
        p.status,
        p.peopleNeeded,
        p.accepted,
        p.applications,
        day(p.createdAt),
      ]),
    ),
    ...section(
      "Hackathons",
      truncated.hackathons,
      [
        "Title",
        "Host",
        "Budget",
        "Currency",
        "Payouts",
        "Status",
        "Participants",
        "Submissions",
        "Deadline",
        "Created",
      ],
      report.hackathons.map((h) => [
        h.title,
        h.host,
        h.budget,
        h.currency,
        h.payoutMode === "MANUAL" ? "Manual" : "Smart contract",
        h.status,
        h.participants,
        h.submissions,
        day(h.deadline),
        day(h.createdAt),
      ]),
    ),
    ...section(
      "Payouts",
      truncated.payouts,
      [
        "Source",
        "For",
        "Contributor",
        "Amount",
        "Token",
        "USD",
        "Status",
        "Requested",
        "Completed",
        "Transaction",
      ],
      report.payouts.map((p) => [
        p.source,
        p.sourceTitle,
        p.contributor,
        p.amount,
        p.token,
        p.usdAmount,
        p.status,
        day(p.requestedAt),
        day(p.completedAt),
        p.txHash,
      ]),
    ),
  ];
};

export function ReportExportCard() {
  const [preset, setPreset] = useState<Preset>("last-month");
  const [custom, setCustom] = useState<DateRange | undefined>();
  const [isExporting, setIsExporting] = useState(false);

  // Custom ranges include the whole last day, so the exclusive end is the day after it.
  const range =
    preset === "custom"
      ? custom?.from
        ? { from: custom.from, to: addDays(custom.to ?? custom.from, 1) }
        : null
      : presetRange(preset);

  const rangeLabel = range
    ? `${format(range.from, "MMM d, yyyy")} – ${format(addDays(range.to, -1), "MMM d, yyyy")}`
    : "";

  const fromIso = range?.from.toISOString();
  const toIso = range?.to.toISOString();
  const {
    data: summaryData,
    isFetching: isLoadingSummary,
    isError: summaryFailed,
  } = useQuery({
    queryKey: ["admin-report-summary", fromIso, toIso],
    queryFn: () => adminService.getReportSummary(fromIso!, toIso!),
    enabled: !!fromIso && !!toIso,
    staleTime: 60_000,
  });
  const summary = summaryData?.summary;

  const stats: { label: string; value: string }[] = [
    {
      label: "New users",
      value: summary ? summary.newUsers.toLocaleString() : "—",
    },
    {
      label: "Contributors",
      value: summary ? summary.newContributors.toLocaleString() : "—",
    },
    {
      label: "Project owners",
      value: summary ? summary.newProjectOwners.toLocaleString() : "—",
    },
    {
      label: "Bounties",
      value: summary ? summary.bountiesCreated.toLocaleString() : "—",
    },
    {
      label: "Projects",
      value: summary ? summary.projectsCreated.toLocaleString() : "—",
    },
    {
      label: "Hackathons",
      value: summary ? summary.hackathonsCreated.toLocaleString() : "—",
    },
    {
      label: "Paid out",
      value: summary
        ? `$${summary.payoutsCompletedUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
        : "—",
    },
    {
      label: "Pending payouts",
      value: summary ? summary.payoutsPending.toLocaleString() : "—",
    },
  ];

  const handleExport = async () => {
    if (!range) {
      toast.error("Pick a date range first");
      return;
    }
    setIsExporting(true);
    try {
      const report = await adminService.getReport(
        range.from.toISOString(),
        range.to.toISOString(),
      );
      exportRowsToCSV(
        reportRows(report, rangeLabel),
        `stallion_report_${format(range.from, "yyyy-MM-dd")}_to_${format(addDays(range.to, -1), "yyyy-MM-dd")}`,
      );
      toast.success("Report downloaded", { description: rangeLabel });
    } catch (error) {
      toast.error("Could not export the report", {
        description: errorMessage(error, "Please try again."),
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-foreground">
          Activity by period
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Pick a period to see what happened in it, or download it as a CSV. The
          cards further down are all-time totals and do not change with the
          period.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={preset} onValueChange={(v) => setPreset(v as Preset)}>
            <SelectTrigger className="h-9 w-full text-xs sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRESETS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {preset === "custom" ? (
            <DatePickerWithRange date={custom} setDate={setCustom} />
          ) : (
            <span className="text-xs text-muted-foreground">{rangeLabel}</span>
          )}
          <Button
            onClick={() => void handleExport()}
            disabled={isExporting || !range}
            className="gap-2 sm:ml-auto"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download CSV
          </Button>
        </div>
        {range && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border px-3 py-2"
              >
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
                  {isLoadingSummary && !summary ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
        {summaryFailed && (
          <p className="text-xs text-destructive">
            Could not load the numbers for this period.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
