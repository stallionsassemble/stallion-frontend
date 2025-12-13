"use client";

import { SubmissionCard } from "@/components/submissions/submission-card";
import { SubmissionDetailsModal } from "@/components/submissions/submission-details-modal";
import { SubmissionStats } from "@/components/submissions/submission-stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

// Mock Data
const submissions = [
  {
    id: 1,
    project: "Stallion Foundation",
    title: "React Dashboard UI Design",
    description: "The high-performance blockchain for mass adoption. Building the fastest layer-1 network. The high-performance blockchain for mass adoption...",
    logo: "/assets/icons/sdollar.png",
    amount: "$3,500",
    type: "USDC",
    status: "Approved",
    submittedAt: "2024-01-15",
    lastUpdated: "2024-01-18",
  },
  {
    id: 2,
    project: "Stallion Foundation",
    title: "React Dashboard UI Design",
    description: "The high-performance blockchain for mass adoption. Building the fastest layer-1 network. The high-performance blockchain for mass adoption...",
    logo: "/assets/icons/sdollar.png",
    amount: "$3,500",
    type: "USDC",
    status: "Pending Review",
    submittedAt: "2024-01-15",
    lastUpdated: "2024-01-18",
  },
  {
    id: 3,
    project: "Stallion Foundation",
    title: "React Dashboard UI Design",
    description: "The high-performance blockchain for mass adoption. Building the fastest layer-1 network. The high-performance blockchain for mass adoption...",
    logo: "/assets/icons/sdollar.png",
    amount: "$3,500",
    type: "USDC",
    status: "Revision Requested",
    submittedAt: "2024-01-15",
    lastUpdated: "2024-01-18",
  },
  {
    id: 4,
    project: "Stallion Foundation",
    title: "React Dashboard UI Design",
    description: "The high-performance blockchain for mass adoption. Building the fastest layer-1 network. The high-performance blockchain for mass adoption...",
    logo: "/assets/icons/sdollar.png",
    amount: "$3,500",
    type: "USDC",
    status: "Rejected",
    submittedAt: "2024-01-15",
    lastUpdated: "2024-01-18",
  },
  {
    id: 5,
    project: "Stallion Foundation",
    title: "React Dashboard UI Design",
    description: "The high-performance blockchain for mass adoption. Building the fastest layer-1 network. The high-performance blockchain for mass adoption...",
    logo: "/assets/icons/sdollar.png",
    amount: "$3,500",
    type: "USDC",
    status: "Approved",
    submittedAt: "2024-01-15",
    lastUpdated: "2024-01-18",
  },
] as const;

export default function MySubmissionsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const categories = ["All", "Design", "Development", "Content", "Marketing", "Research", "Other"];

  const filteredSubmissions = activeTab === "All"
    ? submissions
    : submissions.filter(s => s.title.includes(activeTab) || s.description.includes(activeTab)); // Mock filtering

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Submission</h1>

        <div className="w-full max-w-xs relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search..."
            className="pl-9 h-9 bg-transparent border-white/10 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <SubmissionStats />

      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar mask-linear-fade w-full sm:w-auto">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={activeTab === cat ? "default" : "outline"}
                onClick={() => setActiveTab(cat)}
                className={`h-8 text-xs whitespace-nowrap px-4 ${activeTab === cat
                  ? "bg-[#007AFF] hover:bg-[#007AFF]/90 text-white border-0"
                  : "bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
            <select className="bg-transparent text-white font-medium focus:outline-none border border-white/10 rounded-md h-8 px-2">
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredSubmissions.map((sub) => (
            <div key={sub.id} onClick={() => setSelectedSubmission(sub)} className="cursor-pointer">
              <SubmissionCard
                {...sub}
                type={sub.type as any} // Cast strictly typed mock data
              />
            </div>
          ))}
        </div>

        <SubmissionDetailsModal
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          submission={selectedSubmission}
        />

        {/* Footer info */}
        <div className="flex items-center gap-2 text-[10px] text-gray-600">
          <Button variant="ghost" size="sm" className="h-6 px-0 text-gray-500 hover:text-white gap-1">
            Get Help
          </Button>
        </div>
      </div>
    </div>
  );
}
