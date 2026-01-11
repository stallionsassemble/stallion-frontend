"use client";

import { useGetSubmissions } from "@/lib/api/bounties/queries";

interface SubmissionCountProps {
  bountyId: string;
  className?: string;
}

/**
 * A small component that fetches and displays the submission count for a bounty.
 * Uses the existing useGetSubmissions hook to get the real count.
 */
export function SubmissionCount({ bountyId, className }: SubmissionCountProps) {
  const { data: submissions = [], isLoading } = useGetSubmissions(bountyId);

  if (isLoading) {
    return <span className={className}>...</span>;
  }

  return <span className={className}>{submissions.length}</span>;
}
