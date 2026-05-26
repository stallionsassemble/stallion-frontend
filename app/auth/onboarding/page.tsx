"use client";

import { useAuth } from "@/lib/store/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function OnboardingFallbackPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (user.role === 'PROJECT_OWNER' || user.role === 'OWNER') {
          router.replace("/auth/onboarding/owner");
        } else {
          router.replace("/auth/onboarding/talent");
        }
      } else {
        router.replace("/auth/login");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
