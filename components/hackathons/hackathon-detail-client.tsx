/* eslint-disable */
"use client";

import { useGetHackathon, useGetHackathonSubmissions, useGetHackathonWinners, useMyApplication } from "@/lib/api/hackathon/queries";
import { ApplyHackathonModal } from "./apply-hackathon-modal";
import { describePrizeSlot } from "@/lib/hackathon-prizes";
import { rememberPostAuthRedirect } from "@/lib/post-auth-redirect";
import { useRouter } from "next/navigation";
import { DEFAULT_SUBMISSION_QUESTIONS, LEGACY_SUBMISSION_FIELDS, submissionImages, type ApplicationQuestion } from "@/lib/hackathon-form";
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
  ShieldCheck,
  Check
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SubmitHackathonModal } from "./submit-hackathon-modal";
import { HackathonTeamManagement } from "./hackathon-team-management";
import { useEffect, useState } from "react";

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
  const { data: submissionsData } = useGetHackathonSubmissions(id);
  const { user } = useAuth();
  const router = useRouter();
  const { data: myApplication } = useMyApplication(hackathon?.id);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const application = myApplication?.application ?? null;
  const applicationStatus = application?.status;
  const hasApplied = !!myApplication?.applied;
  const isAccepted = applicationStatus === "ACCEPTED";
  const submissionQuestions: ApplicationQuestion[] = Array.isArray((hackathon as any)?.submissionForm)
    ? ((hackathon as any).submissionForm as ApplicationQuestion[])
    : [];
  const submissionFields = submissionQuestions.length > 0 ? submissionQuestions : DEFAULT_SUBMISSION_QUESTIONS;
  const applicationQuestions: ApplicationQuestion[] = Array.isArray((hackathon as any)?.applicationForm)
    ? ((hackathon as any).applicationForm as ApplicationQuestion[])
    : [];

  const handleRegister = () => {
    if (!hackathon) return;
    if (!user) {
      // Send them to log in, then bring them back here with the form open.
      rememberPostAuthRedirect(`/hackathons/${id}?apply=1`);
      toast.info("Log in or create an account to apply", {
        description: "We'll bring you back to this hackathon afterwards.",
      });
      router.push("/auth/login");
      return;
    }
    setIsApplyOpen(true);
  };

  const handleSubmitClick = () => {
    if (!user) {
      handleRegister();
      return;
    }
    if (!isAccepted) {
      if (applicationStatus === "REJECTED") {
        toast.error("Your application wasn't accepted", {
          description: "Only accepted applicants can submit a project to this hackathon.",
        });
      } else {
        toast.info(
          hasApplied
            ? "Your application is still being reviewed. You can submit once it is accepted."
            : "Apply to this hackathon first, then you can submit your project."
        );
      }
      return;
    }
    if (hasSubmitted) {
      toast.info(
        team
          ? "Your team has already submitted its project."
          : "You have already submitted a project for this hackathon."
      );
      return;
    }
    if (!isTeamLeader) {
      toast.info("Only your team leader submits for the team", {
        description: `${leaderName} will submit the project. You will see it here once it is in.`,
      });
      return;
    }
    setIsSubmitModalOpen(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = (hackathon as any)?.title ?? "Stallion hackathon";
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, text: `Check out ${title} on Stallion`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied", { description: "Share it with anyone you like." });
    } catch (error) {
      // Closing the share sheet is not an error.
      if ((error as Error)?.name === "AbortError") return;
      toast.error("Could not share automatically", { description: url });
    }
  };

  // Coming back from login with ?apply=1: open the form once, then tidy the URL.
  useEffect(() => {
    if (!hackathon || !user || myApplication === undefined) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("apply") !== "1") return;
    params.delete("apply");
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
    if (!myApplication.applied) setIsApplyOpen(true);
  }, [hackathon, user, myApplication]);

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

  const isExpired =
    (hackathon.registrationDeadline ? new Date(hackathon.registrationDeadline) < new Date() : false) ||
    (hackathon.status !== "PUBLISHED" && hackathon.status !== undefined);
  const submitDeadline = (hackathon as any).deadline ? new Date((hackathon as any).deadline) : null;
  const submissionsClosed =
    hackathon.status !== "PUBLISHED" ||
    (submitDeadline !== null && !isNaN(submitDeadline.getTime()) && submitDeadline < new Date());
  const prizes = hackathon.prizePool || hackathon.prizeDistribution || [];
  const currency = hackathon.currency || hackathon.asset || "USDC";
  const team = application?.team ?? null;
  // In a team, one person submits for everyone: the team leader. Solo applicants submit for themselves.
  const isTeamLeader = !team || team.leaderId === user?.id;
  const leaderName =
    [team?.leader?.firstName, team?.leader?.lastName].filter(Boolean).join(" ") || team?.leader?.username || "your team leader";
  const hasSubmitted = !!(myApplication?.submission || hackathon.userSubmission || hackathon.participation?.submission);

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
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-white tracking-tight leading-tight font-syne break-words">
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

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {(() => {
                try {
                  const raw = (hackathon as any).deadline ?? (hackathon as any).submissionDeadline ?? hackathon.endDate;
                  const date = raw ? new Date(raw) : null;
                  return date && !isNaN(date.getTime()) ? `Submissions close ${format(date, "MMMM d, yyyy")}` : "Deadline to be announced";
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
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">{(() => {
              const count = (hackathon as any)._count?.participants || hackathon.participantCount || 0;
              return `${count} ${count === 1 ? "participant" : "participants"} signed up`;
            })()}</span>
          </div>
        </div>

        <div className="space-y-2 py-4">
          <p className="text-4xl sm:text-5xl md:text-7xl font-bold text-blue-500 font-inter tracking-tighter break-words">
            {(
              Number((hackathon as any).totalPrizePool || 0) || 
              Number((hackathon as any).totalBudget || 0) || 
              Number((hackathon as any).totalReward || 0)
            ).toLocaleString()} <span className="text-2xl text-blue-500/50">{currency}</span>
          </p>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold font-inter">In Total Prizes</p>
        </div>

        <div className="flex w-full flex-col items-center gap-3 pt-4">
          <div className="flex w-full flex-col sm:w-auto sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 sm:px-12 h-12 sm:h-14 text-base sm:text-lg font-bold shadow-2xl shadow-primary/20"
              disabled={isExpired || hasApplied}
              onClick={handleRegister}
            >
              {isExpired && !hasApplied
                ? "Registration Closed"
                : applicationStatus === "PENDING"
                  ? "Application Pending"
                  : applicationStatus === "REJECTED"
                    ? "Not Accepted"
                    : hasApplied
                      ? "Applied"
                      : "Apply Now"}
            </Button>
            <Button
              variant="outline"
              className={cn(
                "rounded-full px-8 sm:px-12 h-12 sm:h-14 text-base sm:text-lg font-bold transition-all",
                hasSubmitted
                  ? "bg-green-500/10 border-green-500/50 text-green-500 hover:bg-green-500/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
              )}
              onClick={handleSubmitClick}
              disabled={hasSubmitted || (submissionsClosed && !hasSubmitted)}
            >
              {hasSubmitted ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Submitted
                </>
              ) : submissionsClosed ? (
                "Submissions Closed"
              ) : (
                "Submit Project"
              )}
            </Button>
          </div>
          {applicationStatus === "PENDING" && (
            <p className="text-sm text-amber-400">Your application is being reviewed. We will email you the decision.</p>
          )}
          {applicationStatus === "REJECTED" && (
            <p className="text-sm text-red-400">Your application was not accepted this time.</p>
          )}
          {isAccepted && !hasSubmitted && isTeamLeader && (
            <p className="text-sm text-green-400">
              {team
                ? "You are in. As team leader, submit one project for your team before the deadline."
                : "You are in. Submit your project before the deadline."}
            </p>
          )}
          {isAccepted && !hasSubmitted && !isTeamLeader && (
            <p className="text-sm text-amber-400">
              You are in. {leaderName} is your team leader and submits the project for the team. It will show here once it is in.
            </p>
          )}
          {hasSubmitted && (
            <p className="text-sm text-green-400">
              {team ? "Your team’s project" : "Your project"}{myApplication?.submission?.title ? ` “${myApplication.submission.title}”` : ""} has been
              submitted. {(hackathon as any).announcementDate
                ? `Results will be announced on ${format(new Date((hackathon as any).announcementDate), "MMMM d, yyyy")}.`
                : "We will announce the results soon."}
            </p>
          )}
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
          {/* Participation & Team Section */}
          {(hackathon.teamBased || (hackathon as any).teamBasedParticipation) ? (
            user && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white font-syne">Team Formation</h2>
                  {hasApplied && !application?.team && (
                    <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">Required</Badge>
                  )}
                </div>
                <HackathonTeamManagement 
                  hackathonId={hackathon.id} 
                  userTeam={application?.team ?? hackathon.userTeam ?? hackathon.myTeam ?? hackathon.participation?.team} 
                />
              </section>
            )
          ) : (
            hasApplied && (
              <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold">
                    {applicationStatus === "PENDING" ? "Application received" : "You're Registered"}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {applicationStatus === "PENDING"
                      ? "We'll email you once it has been reviewed"
                      : "Individual participation confirmed"}
                  </p>
                </div>
              </section>
            )
          )}

          {/* About Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              About Hackathon
            </h2>
            <div className="text-gray-400 text-lg leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
              {hackathon.description}
            </div>
          </section>

          {/* Submitted projects, shown once submissions have closed */}
          {(() => {
            const deadline = (hackathon as any).deadline ? new Date((hackathon as any).deadline) : null;
            const closed =
              hackathon.status === "JUDGING" ||
              hackathon.status === "COMPLETED" ||
              (deadline && !isNaN(deadline.getTime()) && deadline < new Date());
            const list: any[] = Array.isArray(submissionsData)
              ? submissionsData
              : ((submissionsData as any)?.data ?? []);
            if (!closed || list.length === 0) return null;
            return (
              <section className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Submitted Projects</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {list.map((sub: any) => (
                    <div key={sub.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold text-white break-words">{sub.projectName || sub.title}</h3>
                        {sub.track && (
                          <Badge variant="outline" className="shrink-0 border-primary/30 bg-primary/10 text-primary">
                            {sub.track}
                          </Badge>
                        )}
                      </div>
                      {sub.description && <p className="text-sm text-gray-400 line-clamp-3">{sub.description}</p>}
                      {submissionImages(sub.submissionData, submissionFields).length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {submissionImages(sub.submissionData, submissionFields).slice(0, 5).map((url) => (
                            <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt="" className="h-20 w-28 rounded-lg border border-white/10 object-cover" />
                            </a>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        By {sub.team?.name ? `Team ${sub.team.name}` : [sub.user?.firstName, sub.user?.lastName].filter(Boolean).join(" ") || "a participant"}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        {sub.submissionLink && (
                          <a href={sub.submissionLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Demo</a>
                        )}
                        {sub.repositoryUrl && (
                          <a href={sub.repositoryUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Code</a>
                        )}
                        {sub.videoUrl && (
                          <a href={sub.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Video</a>
                        )}
                        {submissionFields
                          .filter((q) => q.type === "URL" && !(q.id in LEGACY_SUBMISSION_FIELDS) && typeof sub.submissionData?.answers?.[q.id] === "string")
                          .map((q) => (
                            <a key={q.id} href={sub.submissionData.answers[q.id]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {q.label}
                            </a>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })()}

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
                {(winners as unknown as any[]).map((winner: any, i: number) => (
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
                        <span className="text-xl font-bold text-primary">{winner.prizeAmount?.toLocaleString()} {currency}</span>
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
                              {award.label || ((award as any).track ? describePrizeSlot(award as any, prizes as any) : getAwardLabel(rank))}
                            </p>
                            <p className="text-3xl font-bold text-white">{award.amount.toLocaleString()} <span className="text-sm font-medium text-gray-400">{currency}</span></p>
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
                  <span className="text-lg font-bold text-white">{(hackathon as any)._count?.participants || hackathon.participantCount || 0}</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm text-gray-400">Submissions</span>
                  </div>
                  <span className="text-lg font-bold text-white">{(hackathon as any)._count?.submissions || hackathon.submissionCount || 0}</span>
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
                  <span className="text-2xl font-bold text-white">
                    {(
                      Number((hackathon as any).totalPrizePool || 0) || 
                      Number((hackathon as any).totalBudget || 0) || 
                      Number((hackathon as any).totalReward || 0)
                    ).toLocaleString()} {currency}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20" 
                  disabled={isExpired || hasApplied}
                  onClick={handleRegister}
                >
                  {applicationStatus === "PENDING" ? "Application Pending" : hasApplied ? "Applied" : isExpired ? "Registration Closed" : "Apply Now"}
                </Button>
                <Button 
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white h-14 rounded-2xl text-lg font-bold border-dashed"
                  disabled={hasSubmitted}
                  onClick={handleSubmitClick}
                >
                  {hasSubmitted ? "Submitted" : "Submit Project"}
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

          <Button variant="outline" onClick={handleShare} className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white h-14 rounded-2xl text-md gap-2 border-dashed">
            <Share2 className="h-4 w-4" />
            Share Hackathon
          </Button>
        </div>
      </div>

      <ApplyHackathonModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        hackathonId={hackathon.id}
        hackathonTitle={hackathon.title}
        questions={applicationQuestions}
        requiresApproval={Boolean((hackathon as any).requiresApproval)}
        defaultEmail={(user as any)?.email}
        defaultName={[(user as any)?.firstName, (user as any)?.lastName].filter(Boolean).join(" ") || undefined}
      />

      <SubmitHackathonModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        hackathonId={hackathon.id}
        hackathonTitle={hackathon.title}
        isTeamBased={!!(hackathon.teamBased || (hackathon as any).teamBasedParticipation)}
        tracks={Array.isArray((hackathon as any).tracks) ? ((hackathon as any).tracks as string[]) : []}
        submissionQuestions={submissionQuestions}
        initialTeamId={application?.teamId || hackathon.userTeam?.id || hackathon.myTeam?.id || hackathon.team?.id || hackathon.participation?.team?.id || hackathon.participation?.teamId}
      />
    </div>
  );
}
