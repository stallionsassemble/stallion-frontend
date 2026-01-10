import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/store/use-auth";
import { User } from "@/lib/types";
import { Edit, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface OwnerProfileHeaderProps {
  userData?: User;
}

export function OwnerProfileHeader({ userData }: OwnerProfileHeaderProps) {
  const { user: authUser } = useAuth();
  const router = useRouter();

  const user = userData || authUser;
  const isOwnProfile = !userData || (authUser && userData.id === authUser.id);

  // Fallback to company name or full name, then "User"
  const displayName = user?.companyName || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "User");
  const username = user?.username ? `@${user.username}` : "";
  const bio = user?.companyBio || user?.bio || "No bio added yet.";

  // Use company logo if available, else profile picture, else default
  const avatarUrl = user?.companyLogo || user?.profilePicture || "https://avatar.vercel.sh/johndoe";

  const handleMessage = async () => {
    // Message logic (can be shared or mocked for now)
    toast.message("Message feature coming soon");
  };

  const handleEditProfile = () => {
    router.push("/dashboard/owner/settings?tab=profile");
  };

  return (
    <div className="relative w-full mb-8">
      {/* Cover Image - Standard Blue for now */}
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
              onClick={handleEditProfile}
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
          {/* Avatar / Logo */}
          <div className="relative h-32 w-32 md:h-[200px] md:w-[200px] rounded-full bg-background shrink-0 border-4 border-background flex items-center justify-center overflow-hidden">
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 pt-2 md:pt-[110px] mb-2 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold font-inter text-foreground">{displayName}</h1>
                </div>
                <p className="text-muted-foreground font-inter mb-4">{username}</p>
                <p className="text-sm text-foreground/80 max-w-2xl font-inter leading-relaxed">
                  {bio}
                </p>
              </div>

              {/* Desktop Actions */}
              <div className="flex md:flex-col md:items-end justify-start md:justify-start mt-4 md:mt-0">
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    onClick={handleEditProfile}
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
      </div>
    </div>
  );
}
