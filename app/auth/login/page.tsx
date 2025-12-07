"use client";

import { AuthRightSection } from "@/components/auth/auth-right-section";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <AuthSplitLayout rightContent={<AuthRightSection variant="bounties" />}>
      <div className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight text-white lg:text-4xl">
          Sign In
        </h1>
        <p className="text-muted-foreground">Enter your details to access your account</p>
      </div>

      <div className="space-y-6 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-12 w-full rounded-full bg-white text-black hover:bg-gray-200 gap-2 border-none">
            {/* Apple Icon */}
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.56-2.09-.48-3.08.35-1.44 1.17-2.65.65-3.66-.9-2.31-3.56-1.07-7.9 2.58-8.24 1.14-.11 2.05.61 2.89.61.84 0 2.19-.85 3.38-.6 1.41.27 2.45 1.05 3.06 2.06-2.65 1.6-2.19 5.56.55 6.64-.56 1.76-1.57 3.34-2.64 4.73zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Continue with Apple
          </Button>
          <Button variant="outline" className="h-12 w-full rounded-full bg-white text-black hover:bg-gray-200 gap-2 border-none">
            {/* Google Icon */}
            <svg className="h-5 w-5" viewBox="0 0 488 512" fill="currentColor">
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Continue with Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-[#090715] px-4 text-gray-500">OR CONTINUE WITH</span>
          </div>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@email.com"
              className="flex h-12 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <Button className="h-12 w-full rounded-lg bg-blue text-white hover:bg-[#0066CC]">
            Continue with Email
          </Button>
        </form>
      </div>

      <div className="text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-white hover:underline">
          Sign up now
        </Link>
      </div>
    </AuthSplitLayout>
  );
}
