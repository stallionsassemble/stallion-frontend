"use client";

import { AuthRightSection } from "@/components/auth/auth-right-section";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const [role, setRole] = useState<"talent" | "owner">("talent");
  const router = useRouter();

  const handleRoleSelect = (selectedRole: "talent" | "owner") => {
    setRole(selectedRole);
    // Optional: Add a small delay or immediate navigation
    // router.push(`/auth/register?role=${selectedRole}`); 
    // Usually selecting a role might just highlight it, and then user clicks "Continue"?
    // But the design had 2 buttons "Talent" and "Owner". 
    // User complaint "the auth page should show that page with the two buttons".
    // I will keep the state selection for now, maybe add a continue button or make them links.
    // The previous implementation was just state selection.
    // I'll make clicking them navigate for better UX if there's no "Continue".
    // But looking at the design again, there was no "Continue". The buttons might be the action.
    // "Sign up as... Talent / Owner".
  };

  return (
    <AuthSplitLayout rightContent={<AuthRightSection variant="testimonial" />}>
      <div className="space-y-2">
        <h1 className="text-5xl font-semibold font-inter tracking-tight text-white lg:text-4xl">
          Create an account
        </h1>
        <p className="text-[#737373] font-inter font-normal">Sign up to get started</p>
      </div>

      <div className="space-y-4">
        <p className="text-lg font-medium text-white">Sign up as...</p>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => router.push("/auth/welcome/talent")}
            variant="outline"
            className="h-12 w-full rounded-lg border border-[#000000] bg-blue text-sm font-medium text-white hover:bg-blue/90 hover:text-white transition-all"
            style={{ boxShadow: '0px 1px 2px 0px #0000001A' }}
          >
            Talent
          </Button>
          <Button
            onClick={() => router.push("/auth/welcome/owner")}
            variant="outline"
            className="h-12 w-full rounded-lg border border-[#000000] bg-blue text-sm font-medium text-white hover:bg-blue/90 hover:text-white transition-all"
            style={{ boxShadow: '0px 1px 2px 0px #0000001A' }}
          >
            Owner
          </Button>
        </div>
      </div>

      <div className="text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-white hover:underline">
          Sign in now
        </Link>
      </div>

    </AuthSplitLayout>
  );
}
