"use client";

import { useGetHackathon, useGetHackathonWinners } from "@/lib/api/hackathon/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  Trophy, 
  Clock, 
  Share2, 
  Globe, 
  CheckCircle2, 
  FileText,
  Loader2,
  ChevronLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface HackathonDetailClientProps {
  id: string;
}

export function HackathonDetailClient({ id }: HackathonDetailClientProps) {
  const { data: hackathon, isLoading } = useGetHackathon(id);
  const { data: winners } = useGetHackathonWinners(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Hackathon not found</h2>
        <Button asChild variant="outline">
          <Link href="/hackathons">Back to Hackathons</Link>
        </Button>
      </div>
    );
  }

  const isExpired = new Date(hackathon.registrationDeadline) < new Date();

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Back Button */}
      <Link 
        href="/hackathons"
        className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm w-fit"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Hackathons
      </Link>

      {/* Hero Header */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
        <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-center overflow-hidden">
          <Image
            src={hackathon.logo || "/assets/icons/sdollar.png"}
            alt="Logo"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight font-syne">
            {hackathon.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-2">
            {hackathon.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(new Date(hackathon.startDate), "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span>Region: Online/Global</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-4xl md:text-5xl font-bold text-blue-500 font-inter">
            ${hackathon.totalPrizePool?.toLocaleString()} {hackathon.currency || "USD"}
          </p>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold font-inter">In Total Prizes</p>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 h-14 text-lg font-bold shadow-2xl shadow-primary/20"
            disabled={isExpired}
          >
            {isExpired ? "Registration Closed" : "Register"}
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-full px-12 h-14 text-lg font-bold"
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Main Image Section */}
      <div className="relative aspect-21/9 w-full max-w-6xl mx-auto rounded-3xl overflow-hidden border border-white/10">
        <Image
          src={hackathon.heroImage || "/assets/dashboardMobile.png"}
          alt={hackathon.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-12 max-w-6xl mx-auto">
        <div className="space-y-12">
          {/* About Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              About Hackathon
            </h2>
            <div className="text-gray-400 text-lg leading-relaxed whitespace-pre-line prose prose-invert">
              {hackathon.description}
            </div>
          </section>

          {/* Partners Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Partners</h2>
            <p className="text-gray-500 text-sm">Industry leaders supporting the hackathon</p>
            <div className="flex flex-wrap gap-12 items-center">
              {hackathon.partners?.length ? hackathon.partners.map((partner, i) => (
                <div key={i} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                  <Image src={partner.logo} alt={partner.name} width={40} height={40} className="grayscale invert" />
                  <span className="text-xl font-bold text-white font-syne">{partner.name}</span>
                </div>
              )) : (
                <>
                  <div className="flex items-center gap-3 opacity-60">
                    <Image src="/assets/icons/sdollar.png" alt="Stellar" width={40} height={40} className="grayscale" />
                    <span className="text-xl font-bold text-white font-syne tracking-tighter">Stellar</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-60">
                    <Image src="/assets/icons/sdollar.png" alt="Ethereum" width={40} height={40} />
                    <span className="text-xl font-bold text-white font-syne tracking-tighter">Ethereum Nigeria</span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Requirements Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Requirements</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: "Project built with our amazing partners technology...", icon: CheckCircle2 },
                { title: "Developers excited about pursuing their projects longer-term beyond the hackathon...", icon: CheckCircle2 },
                { title: "Developers excited about pursuing their projects longer-term beyond the hackathon...", icon: CheckCircle2 },
                { title: "Projects built with our amazing partners technology...", icon: CheckCircle2 },
                { title: "Developers excited about pursuing their projects longer-term beyond the hackathon...", icon: CheckCircle2 },
                { title: "Link to your public GitHub repo", icon: CheckCircle2 },
              ].map((req, i) => (
                <div key={i} className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                  <req.icon className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm leading-relaxed">{req.title}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Awards Section */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white uppercase tracking-widest">Awards</h2>
              <p className="text-gray-500 text-sm font-medium">Rewards for teams leading the next frontiers of Web3. Recognition and funding to accelerate your journey to success.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Winner", amount: "$5,000", icon: "🥇", color: "text-amber-400" },
                { label: "First Runner-up", amount: "$3,000", icon: "🥈", color: "text-gray-300" },
                { label: "Second Runner-up", amount: "$1,000", icon: "🥉", color: "text-amber-700" },
                { label: "Third Runner-up", amount: "$500", icon: "🏅", color: "text-blue-400" },
                { label: "Fourth Runner-up", amount: "$250", icon: "🏅", color: "text-blue-400" },
                { label: "Fifth Runner-up", amount: "$100", icon: "🏅", color: "text-blue-400" },
              ].map((award, i) => (
                <Card key={i} className="bg-white/5 border-white/10 group hover:border-primary/50 transition-all">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{award.icon}</span>
                      <div className="space-y-0.5">
                        <p className={cn("text-xs font-bold uppercase tracking-wider opacity-60", award.color)}>{award.label}</p>
                        <p className="text-2xl font-bold text-white">{award.amount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          <Card className="bg-[#09090B] border-white/10 shadow-2xl">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-sm text-gray-400">Participants</span>
                  </div>
                  <span className="text-lg font-bold text-white">{hackathon.participantCount || 0}</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm text-gray-400">Submissions</span>
                  </div>
                  <span className="text-lg font-bold text-white">{hackathon.submissionCount || 0}</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm text-gray-400">Deadline</span>
                  </div>
                  <span className="text-lg font-bold text-white">{format(new Date(hackathon.registrationDeadline), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="text-sm text-gray-400">Prize Pool</span>
                  </div>
                  <span className="text-lg font-bold text-white">${hackathon.totalPrizePool?.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl text-md font-bold" disabled={isExpired}>
                  Apply Now
                </Button>
                <div className="flex items-center gap-4 text-xs text-gray-500 justify-center">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Project
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Secure Payouts
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white h-12 rounded-xl text-md gap-2">
            <Share2 className="h-4 w-4" />
            Share Hackathon
          </Button>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
