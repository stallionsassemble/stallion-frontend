"use client";

import { useGetHackathon, useGetHackathonWinners, useParticipateHackathon } from "@/lib/api/hackathon/queries";
import { useAuth } from "@/lib/store/use-auth";
import { toast } from "sonner";
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
  ChevronLeft,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SubmitHackathonModal } from "./submit-hackathon-modal";
import { useState } from "react";

const getAwardIcon = (rank: number) => {
  switch (rank) {
    case 1: return "🥇";
    case 2: return "🥈";
    case 3: return "🥉";
    default: return "🏅";
  }
}

const getAwardLabel = (rank: number) => {
  switch (rank) {
    case 1: return "Winner";
    case 2: return "1st Runner-up";
    case 3: return "2nd Runner-up";
    default: return `${rank - 1}th Runner-up`;
  }
}

const getAwardColor = (rank: number) => {
  switch (rank) {
    case 1: return "text-amber-400";
    case 2: return "text-gray-300";
    case 3: return "text-amber-700";
    default: return "text-blue-400";
  }
}

interface HackathonDetailClientProps {
  id: string;
}

export function HackathonDetailClient({ id }: HackathonDetailClientProps) {
  const { data: hackathon, isLoading } = useGetHackathon(id);
  const { data: winners } = useGetHackathonWinners(id);
  const { user } = useAuth();
  const participateMutation = useParticipateHackathon();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const handleRegister = () => {
    if (!user) {
      toast.error("Please login to register for hackathons");
      return;
    }
    participateMutation.mutate(id);
  };

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

  const isExpired = hackathon.registrationDeadline ? new Date(hackathon.registrationDeadline) < new Date() : false;
  const prizes = hackathon.prizePool || hackathon.prizeDistribution || [];
  const currency = hackathon.currency || hackathon.asset || "USDC";

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
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-3 items-center">
            <Badge 
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border-0",
                hackathon.status === 'PUBLISHED' ? "bg-green-500/20 text-green-400" :
                hackathon.status === 'JUDGING' ? "bg-blue-500/20 text-blue-400" :
                hackathon.status === 'COMPLETED' ? "bg-purple-500/20 text-purple-400" :
                hackathon.status === 'CANCELLED' ? "bg-red-500/20 text-red-400" :
                "bg-gray-500/20 text-gray-400"
              )}
            >
              {hackathon.status || 'DRAFT'}
            </Badge>
            <Badge 
              variant="outline"
              className="bg-black/50 backdrop-blur-md border-white/10 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white"
            >
              {hackathon.type?.replace('_', ' ') || 'VIRTUAL'}
            </Badge>
          </div>
        {/* Logo container removed as per request */}
        {/* <div className="h-24 w-24 rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-center overflow-hidden shadow-2xl">
          <Image
            src={hackathon.logo || "/assets/icons/sdollar.png"}
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div> */}
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight leading-tight font-syne">
            {hackathon.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-2">
            {hackathon.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 py-1 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {(() => {
                try {
                  const date = hackathon.startDate ? new Date(hackathon.startDate) : null;
                  return date && !isNaN(date.getTime()) ? format(date, "MMMM d, yyyy") : "TBA";
                } catch (e) {
                  return "TBA";
                }
              })()}
            </span>
          </div>
          {(hackathon as any).location && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span className="font-medium">Region: {(hackathon as any).location}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 py-4">
          <p className="text-5xl md:text-7xl font-bold text-blue-500 font-inter tracking-tighter">
            ${((hackathon as any).totalPrizePool || (hackathon as any).totalBudget || (hackathon as any).totalReward || 0).toLocaleString()} <span className="text-2xl text-blue-500/50">{currency}</span>
          </p>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold font-inter">In Total Prizes</p>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 h-14 text-lg font-bold shadow-2xl shadow-primary/20"
            disabled={isExpired || participateMutation.isPending}
            onClick={handleRegister}
          >
            {participateMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isExpired ? "Registration Closed" : "Register Now"}
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-full px-12 h-14 text-lg font-bold"
            onClick={() => {
              if (!user) {
                toast.error("Please login to submit a project");
                return;
              }
              setIsSubmitModalOpen(true);
            }}
          >
            Submit Project
          </Button>
        </div>
      </div>

      {/* Main Image Section */}
      {/* Hero image removed as per request */}
      {/* <div className="relative aspect-[21/9] w-full max-w-6xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <Image
          src={hackathon.heroImage || "/assets/dashboardMobile.png"}
          alt={hackathon.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#09090B]/80 via-transparent to-transparent" />
      </div> */}

      {/* Content Grid */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-12 max-w-6xl mx-auto">
        <div className="space-y-12">
          {/* About Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              About Hackathon
            </h2>
            <div className="text-gray-400 text-lg leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
              {hackathon.description}
            </div>
          </section>

          {/* Partners section removed as per request */}
          {/* <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Partners</h2>
              <p className="text-gray-500 text-sm">Industry leaders supporting the hackathon</p>
            </div>
            <div className="flex flex-wrap gap-12 items-center">
              {hackathon.partners?.length ? hackathon.partners.map((partner, i) => (
                <div key={i} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                  <Image src={partner.logo} alt={partner.name} width={40} height={40} className="grayscale invert" />
                  <span className="text-xl font-bold text-white font-syne tracking-tighter">{partner.name}</span>
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
          </section> */}

          {/* Requirements Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Requirements</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {hackathon.requirements?.length ? (
                hackathon.requirements.map((req, i) => (
                  <div key={i} className="flex gap-4 items-start bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/[0.07] transition-colors">
                    <CheckCircle2 className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm leading-relaxed">{req}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic col-span-2 bg-white/5 p-6 rounded-2xl text-center border border-dashed border-white/10">No specific requirements listed for this hackathon.</p>
              )}
            </div>
          </section>

          {/* Winners Section (Visible if winners exist) */}
          {(winners as any)?.length > 0 && (
            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy className="h-8 w-8 text-amber-400" />
                Winners
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(winners as any[]).map((winner: any, i: number) => (
                  <Card key={i} className="bg-primary/5 border-primary/20 group hover:border-primary/50 transition-all overflow-hidden rounded-2xl shadow-xl">
                    <div className="bg-primary/10 p-4 border-b border-primary/20 flex items-center justify-between">
                      <span className="text-2xl">{getAwardIcon(winner.rank)}</span>
                      <Badge className="bg-primary text-primary-foreground font-bold rounded-full">
                        {getAwardLabel(winner.rank)}
                      </Badge>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10">
                          {winner.user?.profilePicture ? (
                            <Image src={winner.user.profilePicture} alt={winner.user.username} width={48} height={48} />
                          ) : (
                            <Users className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-bold">{winner.teamName || winner.user?.username || "Anonymous"}</p>
                          <p className="text-xs text-gray-500">Project: {winner.projectTitle || "Submitted Project"}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-sm text-gray-400">Prize Won</span>
                        <span className="text-xl font-bold text-primary">${winner.prizeAmount?.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Awards Section */}
          <section className="space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-white uppercase tracking-[0.2em]">Awards</h2>
              <p className="text-gray-500 text-sm font-medium max-w-2xl mx-auto">Rewards for teams leading the next frontiers of Web3. Recognition and funding to accelerate your journey to success.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {prizes.length > 0 ? (
                prizes
                  .sort((a, b) => (a.rank || a.position || 0) - (b.rank || b.position || 0))
                  .map((award, i) => {
                    const rank = award.rank || award.position || (i + 1);
                    return (
                      <Card key={i} className="bg-white/5 border-white/10 group hover:border-primary/50 transition-all rounded-2xl">
                        <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                          <span className="text-5xl">{getAwardIcon(rank)}</span>
                          <div className="space-y-1">
                            <p className={cn("text-xs font-bold uppercase tracking-widest opacity-60", getAwardColor(rank))}>
                              {award.label || getAwardLabel(rank)}
                            </p>
                            <p className="text-3xl font-bold text-white">${award.amount.toLocaleString()}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
              ) : (
                <p className="text-gray-500 text-sm italic col-span-3 text-center bg-white/5 p-12 rounded-3xl border border-dashed border-white/10">Prize distribution details coming soon.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          <Card className="bg-[#09090B] border-white/10 shadow-2xl rounded-3xl overflow-hidden">
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
                  <span className="text-lg font-bold text-white">
                    {(() => {
                      try {
                        const date = ((hackathon as any).deadline || (hackathon as any).submissionDeadline || (hackathon as any).registrationDeadline || (hackathon as any).endDate) ? new Date((hackathon as any).deadline || (hackathon as any).submissionDeadline || (hackathon as any).registrationDeadline || (hackathon as any).endDate) : null;
                        return date && !isNaN(date.getTime()) ? format(date, "MMM d, yyyy") : "TBA";
                      } catch (e) {
                        return "TBA";
                      }
                    })()}
                  </span>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Pool</span>
                  <span className="text-2xl font-bold text-white">${((hackathon as any).totalPrizePool || (hackathon as any).totalBudget || (hackathon as any).totalReward || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20" 
                  disabled={isExpired || participateMutation.isPending}
                  onClick={handleRegister}
                >
                  {participateMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Apply Now"}
                </Button>
                <Button 
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white h-14 rounded-2xl text-lg font-bold border-dashed"
                  onClick={() => {
                    if (!user) {
                      toast.error("Please login to submit a project");
                      return;
                    }
                    setIsSubmitModalOpen(true);
                  }}
                >
                  Submit Project
                </Button>
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span>Verified Project & Smart Contracts</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                    <ShieldCheck className="h-3 w-3 text-blue-500" />
                    <span>Secure Payouts via Soroban</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white h-14 rounded-2xl text-md gap-2 border-dashed">
            <Share2 className="h-4 w-4" />
            Share Hackathon
          </Button>
        </div>
      </div>

      <SubmitHackathonModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        hackathonId={id}
        hackathonTitle={hackathon.title}
      />
    </div>
  );
}
