"use client";

import { SubmissionCard } from "@/components/submissions/submission-card";
import { SubmissionDetailsModal } from "@/components/submissions/submission-details-modal";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Mock Data
const submissions = [
  {
    id: 1,
    project: "Stallion Foundation",
    title: "React Dashboard UI Design",
    description: "Submitted complete 3-part video series. The high-performance blockchain for mass adoption...",
    logo: "/assets/icons/sdollar.png",
    amount: "$3,500",
    type: "USDC" as const,
    status: "Pending Review" as const,
    submittedAt: "Jan 15, 2024",
    lastUpdated: "2 hours ago",
  },
  {
    id: 2,
    project: "Solana Foundation",
    title: "Smart Contract Security Audit",
    description: "Comprehensive audit report with severity classification for each finding...",
    logo: "/assets/icons/sdollar.png",
    amount: "$5,000",
    type: "USDC" as const,
    status: "Approved" as const,
    submittedAt: "Jan 10, 2024",
    lastUpdated: "5 days ago",
  },
  {
    id: 3,
    project: "Metaplex",
    title: "NFT Marketplace Frontend",
    description: "Implemented the NFT marketplace frontend using Next.js and Tailwind CSS...",
    logo: "/assets/icons/sdollar.png",
    amount: "$2,000",
    type: "SOL" as const,
    status: "Rejected" as const,
    submittedAt: "Dec 20, 2023",
    lastUpdated: "1 month ago",
  }
];

export default function SubmissionsPage() {
  const [selectedSubmission, setSelectedSubmission] = useState<typeof submissions[0] | null>(null);
  const searchParams = useSearchParams();

  // Check for 'id' param to auto-open modal (optional enhancement)
  useEffect(() => {
    // logic to open modal if URL has ?id=...
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Submissions</h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {submissions.map((submission) => (
          <div key={submission.id} onClick={() => setSelectedSubmission(submission)} className="cursor-pointer">
            <SubmissionCard {...submission} />
          </div>
        ))}
      </div>

      {selectedSubmission && (
        <SubmissionDetailsModal
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          submission={selectedSubmission}
        />
      )}
    </div>
  );
}
