"use client";

import { AuthRightSection } from "@/components/auth/auth-right-section";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AppleIcon, GoogleIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { registerSchema, RegisterValues } from "@/lib/schemas/auth";
import { useAuth } from "@/lib/store/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { GoogleLogin } from '@react-oauth/google';
import { appleAuthHelpers } from 'react-apple-signin-auth';
import { Loader2 } from "lucide-react";
import { RoleSelectionModal } from "@/components/auth/role-selection-modal";

export function RegisterClient(props: { searchParamsPromise: Promise<{ role?: string }> }) {
  const router = useRouter();
  const searchParams = use(props.searchParamsPromise);
  const initialRole = (searchParams.role === "owner" ? "owner" : "talent") as "talent" | "owner";
  const [role, setRole] = useState<"talent" | "owner">(initialRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [socialPendingData, setSocialPendingData] = useState<{ provider: 'GOOGLE' | 'APPLE'; idToken: string } | null>(null)
  
  const { requestVerification, socialAuth } = useAuth();

  // Google login functionality is handled via the <GoogleLogin /> component's onSuccess prop.

  const handleAppleLogin = async () => {
    try {
      const response = await appleAuthHelpers.signIn({
        authOptions: {
          clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || 'com.stallion.web',
          scope: 'email name',
          redirectURI: typeof window !== 'undefined' ? `${window.location.origin}/auth/login` : 'https://stallion.so/auth/login',
          usePopup: true,
        },
        onError: (error: any) => {
          console.error(error);
          toast.error('Failed to sign up with Apple');
        }
      });
      if (response && response.authorization && response.authorization.id_token) {
        await processSocialAuth('APPLE', response.authorization.id_token);
      }
    } catch (error) {
       toast.error('Apple signup encountered an error');
    }
  };

  async function processSocialAuth(provider: 'GOOGLE' | 'APPLE', idToken: string, selectedRole?: 'CONTRIBUTOR' | 'PROJECT_OWNER') {
    setIsSubmitting(true)
    const toastId = toast.loading(`Connecting to ${provider}...`)
    
    try {
      const response = await socialAuth({
        provider,
        idToken,
        role: selectedRole || (role === 'talent' ? 'CONTRIBUTOR' : 'PROJECT_OWNER')
      })

      if (response.isNewUser && !response.user.profileCompleted) {
        toast.success("Welcome! Please complete your profile.", { id: toastId })
        router.push("/auth/onboarding")
      } else {
        toast.success("Joined successfully!", { id: toastId })
        if (response.user.role === 'PROJECT_OWNER' || response.user.role === 'OWNER') {
          router.push("/dashboard/owner")
        } else {
          router.push("/dashboard")
        }
      }

      setSocialPendingData(null)
      setShowRoleModal(false)
    } catch (error: any) {
      if (error.response?.status === 400 && (error.response?.data?.message?.toLowerCase().includes("role is required") || error.response?.data?.message?.toLowerCase().includes("role selection required"))) {
        setSocialPendingData({ provider, idToken })
        setShowRoleModal(true)
        toast.dismiss(toastId)
      } else {
        toast.error(error.response?.data?.message || `Failed to sign up with ${provider}`, { id: toastId })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRoleSelection = (selectedRole: 'CONTRIBUTOR' | 'PROJECT_OWNER') => {
    if (socialPendingData) {
      processSocialAuth(socialPendingData.provider, socialPendingData.idToken, selectedRole)
    }
  }

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: RegisterValues) {
    setIsSubmitting(true)
    const toastId = toast.loading("Creating your account...")
    try {
      await requestVerification({
        email: data.email,
        role: role === 'talent' ? 'CONTRIBUTOR' : 'PROJECT_OWNER',
      })
      toast.success("Verification code sent to your email!", { id: toastId })

      router.push(`/auth/verify?type=register&role=${role}&email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthSplitLayout rightContent={<AuthRightSection variant={role === "talent" ? "bounties" : "companies"} />}>
      <RoleSelectionModal 
        open={showRoleModal} 
        onOpenChange={setShowRoleModal} 
        onSelect={handleRoleSelection}
        isLoading={isSubmitting}
      />
      <div className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight text-white lg:text-4xl">
          {role === "talent" ? "Sign up to win Bounties" : "Sign up to place Bounties"}
        </h1>
        <p className="text-muted-foreground">
          {role === "talent"
            ? "List a bounty or freelance gig for your project and find your next contributor"
            : "List a bounty or freelance gig for your project and find your next contributor"}
        </p>
      </div>

      <div className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <Button 
            type="button"
            variant="default" 
            className="h-10 md:h-12 w-full rounded-full dark:bg-white dark:text-black hover:bg-gray-200 gap-2 border-none"
            onClick={handleAppleLogin}
            disabled={isSubmitting}
          >
            <AppleIcon className="h-5 w-5" />
            Continue with Apple
          </Button>
          <div className="w-full h-[40px] md:h-[48px] overflow-hidden rounded-full">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  await processSocialAuth('GOOGLE', credentialResponse.credential);
                }
              }}
              onError={() => {
                toast.error('Failed to sign in with Google');
              }}
              theme="outline"
              size="large"
              shape="pill"
              width="100%"
              use_fedcm_for_prompt={true}
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-[#090715] px-4 text-gray-500">OR CONTINUE WITH</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="h-12 w-full rounded-lg bg-blue text-white hover:bg-[#0066CC]"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue with Email"}
            </Button>

            <p className="text-sm text-gray-400">
              Here to {role === "owner" ? "win bounties" : "hire talent"}? <button type="button" onClick={() => setRole(role === "owner" ? "talent" : "owner")} className="text-white hover:underline underline font-medium">Join as {role === "owner" ? "Talent" : "Owner"}</button>
            </p>
          </form>
        </Form>
      </div>

    </AuthSplitLayout>
  );
}
