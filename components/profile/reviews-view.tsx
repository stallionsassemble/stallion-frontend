"use client";

import { cn } from "@/lib/utils";
import { Briefcase, Calendar as CalendarIcon, Gift, Star } from "lucide-react";

const reviews = [
  {
    orgName: "CryptoDAO",
    review: "Excellent work on the security audit. Very thorough and professional.",
    date: "Dec 2024",
    hiringOrg: "Stallion Foundation",
    type: "Projects",
    rating: 4,
  },
  {
    orgName: "CryptoDAO",
    review: "Excellent work on the security audit. Very thorough and professional.",
    date: "Dec 2024",
    hiringOrg: "Stallion Foundation",
    type: "Projects",
    rating: 4,
  },
  {
    orgName: "CryptoDAO",
    review: "Excellent work on the security audit. Very thorough and professional.",
    date: "Dec 2024",
    hiringOrg: "Stallion Foundation",
    type: "Projects",
    rating: 4,
  },
  {
    orgName: "CryptoDAO",
    review: "Excellent work on the security audit. Very thorough and professional.",
    date: "Dec 2024",
    hiringOrg: "Stallion Foundation",
    type: "Projects",
    rating: 5,
  },
  {
    orgName: "CryptoDAO",
    review: "Excellent work on the security audit. Very thorough and professional.",
    date: "Dec 2024",
    hiringOrg: "Stallion Foundation",
    type: "Projects",
    rating: 3,
  },
];

export function ReviewsView() {
  return (
    <div className="border-[0.68px] border-primary/20 rounded-xl p-4 md:p-6 bg-background">
      <h3 className="text-lg font-bold font-inter mb-6">Reviews</h3>
      <div>
        {reviews.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 py-4 border-b border-primary bg-primary/14 p-3"
          >
            {/* Logo */}
            <div className="w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center shrink-0">
              {/* Placeholder for Stallion Logo - simple S shape or just standard icon if image not available */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 5C16.5 5 18 6 18 8C18 10 16 11 15 11C14 11 13 10.5 13 10C13 9.5 14 9 14 9C14 9 12 8 11 9C10 10 11 12 11 12C11 12 9 12 8 13C7 14 8 16 8 16C8 16 6 16 5 17C4 18 5 20 6 20C7 20 8 19 8 19H12C13 19 14 18 15 17C16 16 17 15 17 13C17 13 19 13 20 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h4 className="text-base font-bold font-inter text-foreground">
                    {item.orgName}
                  </h4>
                  <p className="text-sm font-normal font-inter text-muted-foreground/80">
                    {item.review}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground/60">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3 text-primary" /> {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-primary" /> {item.hiringOrg}
                    </span>
                    <span className="flex items-center gap-1">
                      <Gift className="w-3 h-3 text-primary" /> {item.type}
                    </span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-5 h-5",
                        star <= item.rating
                          ? "fill-[#3B82F6] text-[#3B82F6]"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
