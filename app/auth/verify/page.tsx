"use client";

import { AuthRightSection } from "@/components/auth/auth-right-section";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

export default function VerifyPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input
    if (value !== "" && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pastedData.forEach((value, index) => {
      if (index < 6 && !isNaN(Number(value))) {
        newOtp[index] = value;
      }
    });
    setOtp(newOtp);
    if (inputRefs.current[pastedData.length - 1 < 6 ? pastedData.length : 5]) {
      inputRefs.current[pastedData.length - 1 < 6 ? pastedData.length : 5]?.focus();
    }
  };


  return (
    <AuthSplitLayout rightContent={<AuthRightSection variant="bounties" />}>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold font-inter tracking-tight text-white lg:text-4xl">
          Enter verification code
        </h1>
        <p className="text-muted-foreground">
          We sent a 6-digit code to your email
        </p>
      </div>

      <div className="space-y-8 pt-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {otp.slice(0, 3).map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="h-14 w-12 rounded-lg border-[1.79px] bg-transparent text-center text-2xl text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            ))}
          </div>
          <div className="text-gray-500">-</div>
          <div className="flex gap-2">
            {otp.slice(3, 6).map((digit, i) => (
              <input
                key={i + 3}
                ref={(el) => { inputRefs.current[i + 3] = el }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i + 3, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i + 3, e)}
                onPaste={handlePaste}
                className="h-14 w-12 rounded-lg border-[1.79px] bg-transparent text-center text-2xl text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-400">
          Didn&apos;t receive the code? {" "}
          <button className="text-gray-300 underline hover:text-white">Resend</button>
        </div>

        <Button className="h-12 w-full rounded-lg bg-blue text-white hover:bg-[#0066CC]">
          Submit
        </Button>
      </div>
    </AuthSplitLayout>
  );
}
