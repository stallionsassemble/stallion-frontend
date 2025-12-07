"use client";

import Image from "next/image";
import Link from "next/link";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  rightContent?: React.ReactNode;
}

export function AuthSplitLayout({ children, rightContent }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Form/Actions */}
      <div className="flex w-full flex-col justify-between bg-[#090715] p-8 lg:w-[40%] lg:border-r lg:border-[#007AFF66] lg:px-12 lg:py-10">
        {/* Header / Logo */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={140}
              height={50}
              alt="Stallion Logo"
              className="h-auto w-32 object-contain"
              priority
            />
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-8">
          {children}
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-gray-400 underline hover:text-white">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-gray-400 underline hover:text-white">
            privacy policy
          </Link>
          .
        </div>
      </div>

      {/* Right Side - Dynamic Content (Hidden on mobile) */}
      <div className="relative hidden w-[60%] flex-col justify-center px-16 lg:flex xl:px-24">
        {rightContent}
      </div>
    </div>
  );
}
