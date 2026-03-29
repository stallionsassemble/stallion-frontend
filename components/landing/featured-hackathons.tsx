"use client";

import { useGetHackathons } from "@/lib/api/hackathon/queries";
import { HackathonCard } from "../hackathons/hackathon-card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function FeaturedHackathons() {
  const { data, isLoading } = useGetHackathons({ limit: 4 });
  
  const hackathons = data?.data || [];

  if (!isLoading && hackathons.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-24 space-y-12">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-syne">
            Featured Hackathons
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Build the future of decentralized finance on Stellar. Join global competitions and win big.
          </p>
        </div>
        <Button variant="ghost" className="text-primary hover:text-primary/80 gap-2 p-0 h-auto" asChild>
          <Link href="/hackathons">
            View All Hackathons
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hackathons.map((h) => (
            <HackathonCard key={h.id} hackathon={h} />
          ))}
        </div>
      )}
      
      <div className="flex justify-center pt-8">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 h-14 text-lg font-bold" asChild>
          <Link href="/hackathons">Explore All Hackathons</Link>
        </Button>
      </div>
    </section>
  );
}
