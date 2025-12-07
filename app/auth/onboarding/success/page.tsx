"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") as "talent" | "owner" | null;
  const isOwner = role === "owner";

  return (
    <div className="flex flex-col items-center justify-center space-y-12 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-syne font-extrabold tracking-[-0.73px] text-white">
          You&apos;re now a
        </h2>
        {/* Dynamic Badge */}
        <div className={`relative mx-auto flex ${isOwner ? 'h-28 w-90' : 'h-20 w-80'} items-center justify-center rounded-full bg-blue shadow-[0px 9.67px 19.35px -4.64px #007AFF45]`}>
          <div className="absolute inset-0 rounded-full bg-blue-500 blur-xl opacity-20"></div>
          <span className="relative font-syne font-extrabold text-5xl tracking-[-1.8px] text-white drop-shadow-lg">
            {isOwner ? "Stallite Sponsor" : "Stallite"}
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="h-64 w-64 overflow-hidden rounded-3xl shadow-2xl">
          <Image
            src="/jane-avatar.png" // Placeholder, in real app usage specific generated avatar
            width={256}
            height={256}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="max-w-md space-y-6">
        <p className="text-sm font-inter font-light text-gray-400">
          Your profile is complete, you are now officially a <span className="text-blue-500 font-bold">Stallite</span> and you have successfully created your Stallion wallet
        </p>

        <Button className="h-10 w-full rounded-lg bg-blue text-white hover:bg-[#0066CC]">
          Continue
        </Button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
