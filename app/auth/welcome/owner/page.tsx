"use client";

import { AuthRightSection } from "@/components/auth/auth-right-section";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Button } from "@/components/ui/button";
import { Sparkles, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OwnerWelcomePage() {
  const router = useRouter();

  return (
    <AuthSplitLayout rightContent={<AuthRightSection variant="companies" />}>
      <div className="space-y-4">
        <h1 className="text-3xl font-medium tracking-tight text-white lg:text-4xl leading-tight max-w-md">
          Hey Stallion. Ready to activate top creators for your brand?
        </h1>
      </div>

      <div className="space-y-8 py-8">
        {/* Benefit 1 */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <User className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-sm font-medium text-gray-200">
            Answer a few questions and start building your profile
          </p>
        </div>

        {/* Benefit 2 */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <Sparkles className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-sm font-medium text-gray-200">
            Place open bounties and challenges
          </p>
        </div>

        {/* Benefit 3 */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-blue-500 text-blue-500 font-bold text-xs">
              $
            </div>
          </div>
          <p className="text-sm font-medium text-gray-200">
            Choose your best and reward seamlessly
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button
          className="h-12 w-40 rounded-lg bg-blue text-white hover:bg-[#0066CC]"
          onClick={() => router.push("/auth/register?role=owner")}
        >
          Get Started
        </Button>
        <p className="max-w-[200px] text-xs text-gray-400 leading-tight">
          It only takes 5-10 minutes and you can edit it later. We&apos;ll save as you go.
        </p>
      </div>
    </AuthSplitLayout>
  );
}
