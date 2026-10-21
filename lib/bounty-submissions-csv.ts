import { exportToCSV } from '@/lib/csv'
import type { BountySubmissionField } from '@/lib/types/bounties'

/* eslint-disable @typescript-eslint/no-explicit-any */

const formatValue = (value: unknown) =>
  value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value)

/**
 * Downloads every submission for one bounty as a CSV, with a column per
 * owner-defined submission field.
 */
export function exportBountySubmissionsCSV(
  bounty: { title?: string; submissionFields?: BountySubmissionField[] } | null | undefined,
  submissions: any[]
) {
  const fields = bounty?.submissionFields || []

  exportToCSV(
    submissions,
    [
      { header: 'Name', key: (s: any) => [s.user?.firstName, s.user?.lastName].filter(Boolean).join(' ') },
      { header: 'Username', key: (s: any) => s.user?.username },
      { header: 'Email', key: (s: any) => s.user?.email },
      { header: 'Wallet', key: (s: any) => s.user?.wallet?.publicKey },
      { header: 'Submission Link', key: (s: any) => s.submissionLink },
      ...fields.map((field) => ({
        header: field.label || field.name,
        key: (s: any) => formatValue(s.submissionData?.[field.name]),
      })),
      { header: 'Status', key: (s: any) => s.status },
      { header: 'Submitted At', key: (s: any) => s.createdAt },
    ],
    `${(bounty?.title || 'bounty').replace(/[^a-z0-9]+/gi, '_')}_submissions`
  )
}
