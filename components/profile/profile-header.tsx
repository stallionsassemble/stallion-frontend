import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMyReputation } from "@/lib/api/reputation/queries";
import { useChatSocket } from "@/lib/hooks/use-chat-socket";
import { useAuth } from "@/lib/store/use-auth";
import { User } from "@/lib/types";
import { Reputation } from "@/lib/types/reputation";
import { Edit, MessageSquare, UserStar } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { EditProfileDialog } from "./edit-profile-dialog";

interface ProfileHeaderProps {
  userData?: User;
  reputationData?: Reputation;
}

export function ProfileHeader({ userData, reputationData }: ProfileHeaderProps) {
  const { user: authUser } = useAuth();
  const { data: myReputation } = useMyReputation();
  const { sendMessage } = useChatSocket(); // No conversationId needed
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const user = userData || authUser;
  const reputation = reputationData || myReputation;
  const isOwnProfile = !userData || (authUser && userData.id === authUser.id);

  const fullName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "User";
  const username = user?.username ? `@${user.username}` : "";

  const handleMessage = async () => {
    if (!user || !authUser) return;
    try {
      // Create or get conversation via Socket
      await sendMessage({
        recipientId: user.id,
        content: 'Hello',
      });
      router.push(`/dashboard/messages`);
    } catch (error) {
      console.error("Failed to start conversation", error);
      toast.error("Failed to start conversation");
    }
  };

  return (
    <div className="relative w-full mb-8">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full rounded-xl overflow-hidden relative bg-[#0066FF]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 2px, transparent 2px)",
            backgroundSize: "24px 24px"
          }}
        />
      </div>

      <div className="px-6 relative">
        {/* Mobile Actions */}
        <div className="md:hidden absolute right-6 top-20 flex gap-2 z-10">
          {isOwnProfile ? (
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(true)}
              className="flex gap-2 border-white/20 hover:bg-white/10 text-white hover:text-white bg-transparent h-9 px-4 text-xs font-medium transition-colors"
            >
              <Edit className="w-3 h-3" />
              Edit Profile
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleMessage}
              className="flex gap-2 border-white/20 hover:bg-white/10 text-white hover:text-white bg-transparent h-9 px-4 text-xs font-medium transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              Message
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start -mt-16 md:-mt-[100px] mb-4 gap-6">
          {/* Avatar */}
          <div className="relative h-32 w-32 md:h-[200px] md:w-[200px] rounded-full bg-background shrink-0 border-4 border-background">
            <Image
              src={user?.profilePicture || "https://avatar.vercel.sh/johndoe"}
              alt={fullName}
              fill
              className="rounded-full object-cover"
            />
          </div>

          {/* User Details */}
          <div className="flex-1 pt-2 md:pt-[110px] mb-2 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold font-inter text-foreground">{fullName}</h1>
                  <Badge className="bg-[#FFE500] text-black hover:bg-[#FFE500]/90 border-none px-2 py-0.5 h-6 text-xs gap-1 font-inter font-medium rounded-full">
                    <UserStar className="w-3 h-3 fill-current" />
                    {user?.role === 'OWNER' ? 'Project Owner' : 'Verified Builder'}
                  </Badge>
                </div>
                <p className="text-muted-foreground font-inter mb-4">{username}</p>
                <p className="text-sm text-foreground/80 max-w-2xl font-inter leading-relaxed">
                  {user?.bio || user?.companyBio || "No bio added yet."}
                </p>
              </div>

              {/* Desktop Actions */}
              <div className="flex md:flex-col md:items-end justify-start md:justify-start mt-4 md:mt-0">
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(true)}
                    className="hidden md:flex gap-2 border-white/20 hover:bg-white/10 text-white hover:text-white bg-transparent h-9 px-4 text-xs font-medium transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={handleMessage}
                    className="hidden md:flex gap-2 h-9 px-6 text-xs font-medium transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    Message
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-between md:justify-start gap-4 md:gap-12 mt-4 md:pl-[224px]">
          {/* Total Earned */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold font-inter text-foreground leading-none tracking-[-0.57px] text-center">
              {user?.totalEarned ? `$${user.totalEarned}` : '$0'}
            </span>
            <span className="text-[12px] font-normal text-muted-foreground font-inter leading-none tracking-[-0.57px] text-center">Earned</span>
          </div>

          {/* Total Submissions */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold font-inter text-foreground leading-none tracking-[-0.57px] text-center">
              {user?.totalSubmissions || 0}
            </span>
            <span className="text-[12px] font-normal text-muted-foreground font-inter leading-none tracking-[-0.57px] text-center">Submissions</span>
          </div>

          {/* Rating */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold font-inter text-foreground leading-none tracking-[-0.57px] text-center">
                {(reputation?.rating || user?.rating || 0).toFixed(1)}
              </span>
              {/* <UserStar className="w-3 h-3 fill-current text-[#FFE500]" /> */}
            </div>
            <span className="text-[12px] font-normal text-muted-foreground font-inter leading-none tracking-[-0.57px] text-center">Rating</span>
          </div>

          {/* Reputation */}
          {/* <div className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold font-inter text-[#0066FF] leading-none tracking-[-0.57px] text-center">
              {reputation?.score || 0}
            </span>
            <span className="text-[12px] font-normal text-muted-foreground font-inter leading-none tracking-[-0.57px] text-center">Reputation</span>
          </div> */}

        </div>
      </div>

      {isOwnProfile && user && (
        <EditProfileDialog
          user={user}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </div>
  );
}
