"use client";

import { AuthRightSection } from "@/components/auth/auth-right-section";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/store/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";


function VerifyContent() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [totp, setTotp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const totpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyCode, requestVerification, isLoading, login } = useAuth();

  const email = searchParams.get("email");
  const role = searchParams.get("role") as "talent" | "owner" | null;
  const type = searchParams.get("type") as "login" | "register" | "";
  const mfaRequired = searchParams.get("mfa") === "true";

  useEffect(() => {
    if (!email) {
      toast.error("Email missing. Please register first.");
      router.push("/auth/register");
    }
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email, router]);

  const handleChange = (index: number, value: string, isTotp = false) => {
    if (isNaN(Number(value))) return;
    const currentOtp = isTotp ? [...totp] : [...otp];
    currentOtp[index] = value;
    if (isTotp) setTotp(currentOtp);
    else setOtp(currentOtp);

    // Focus next input
    const refs = isTotp ? totpInputRefs : inputRefs;
    if (value !== "" && index < 5 && refs.current[index + 1]) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, isTotp = false) => {
    const currentOtp = isTotp ? totp : otp;
    const refs = isTotp ? totpInputRefs : inputRefs;
    if (e.key === "Backspace" && !currentOtp[index] && index > 0 && refs.current[index - 1]) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, isTotp = false) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = isTotp ? [...totp] : [...otp];
    pastedData.forEach((value, index) => {
      if (index < 6 && !isNaN(Number(value))) {
        newOtp[index] = value;
      }
    });
    if (isTotp) setTotp(newOtp);
    else setOtp(newOtp);

    const refs = isTotp ? totpInputRefs : inputRefs;
    const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
    if (refs.current[focusIndex]) {
      refs.current[focusIndex]?.focus();
    }
  };

  const handleStepNext = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter a complete 6-digit verification code");
      return;
    }
    setStep(2);
    // Focus first TOTP input after render
    setTimeout(() => {
      if (totpInputRefs.current[0]) {
        totpInputRefs.current[0].focus();
      }
    }, 0);
  };

  const handleVerify = async () => {
    const code = otp.join("");
    const totpCode = totp.join("");

    if (code.length !== 6) {
      toast.error("Please enter a complete 6-digit verification code");
      return;
    }

    if (mfaRequired && totpCode.length !== 6) {
      toast.error("Please enter a complete 6-digit authenticator code");
      return;
    }

    if (!email) return;

    setIsVerifying(true);
    const toastId = toast.loading("Verifying...");
    try {
      const apiRole = role ? (role === "owner" ? "PROJECT_OWNER" : "CONTRIBUTOR") : undefined;

      const user = await verifyCode({
        email,
        code,
        type,
        role: apiRole,
        totpCode: mfaRequired ? totpCode : undefined,
      });

      toast.success("Verified successfully!", { id: toastId });

      // Smart redirection based on profile status
      if (user?.profileCompleted) {
        if (user.role === 'PROJECT_OWNER' || user.role === 'OWNER') {
          router.push("/dashboard/owner");
        } else {
          router.push("/dashboard");
        }
      } else {
        // Use returned user role or fallback to URL param.
        // Priority: If URL param says "owner", redirect to owner onboarding to match user intent.
        const intendedRole = role === "owner" ? "OWNER" : "CONTRIBUTOR";
        // Only rely on user.role if it's explicitly OWNER, otherwise default to intended role from URL
        const userRole = user?.role === "OWNER" ? "OWNER" : intendedRole;

        const onboardingPath = userRole === "OWNER" ? "owner" : "talent";
        router.push(`/auth/onboarding/${onboardingPath}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed. Please check the code.", { id: toastId });
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    const toastId = toast.loading("Resending code...");
    try {
      if (type === 'register') {
        await requestVerification({
          email,
          role: role === "owner" ? "PROJECT_OWNER" : "CONTRIBUTOR"
        });
      } else {
        await login({
          email,
        });
      }
      toast.success("Code resent successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend code.", { id: toastId });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthSplitLayout rightContent={<AuthRightSection variant="bounties" />}>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold font-inter tracking-tight text-white lg:text-4xl">
          {step === 1 ? "Enter verification code" : "Enter authenticator code"}
        </h1>
        <p className="text-muted-foreground">
          {step === 1
            ? `We sent a 6-digit code to ${email}`
            : "Enter the code from your authenticator app"
          }
        </p>

        <div className="space-y-8 pt-4">
          <div className="space-y-6">
            {/* Step 1: Email OTP */}
            {step === 1 && (
              <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-4">
                <div className="flex gap-1.5 sm:gap-2">
                  {otp.slice(0, 3).map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el }}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      onPaste={(e) => handlePaste(e)}
                      disabled={isLoading}
                      className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-[1.79px] bg-transparent text-center text-xl sm:text-2xl text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                    />
                  ))}
                </div>
                <div className="text-gray-500">-</div>
                <div className="flex gap-1.5 sm:gap-2">
                  {otp.slice(3, 6).map((digit, i) => (
                    <input
                      key={i + 3}
                      ref={(el) => { inputRefs.current[i + 3] = el }}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleChange(i + 3, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, i + 3)}
                      onPaste={(e) => handlePaste(e)}
                      disabled={isLoading}
                      className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-[1.79px] bg-transparent text-center text-xl sm:text-2xl text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: TOTP Input (MFA) */}
            {step === 2 && mfaRequired && (
              <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-4">
                  <div className="flex gap-1.5 sm:gap-2">
                    {totp.slice(0, 3).map((digit, i) => (
                      <input
                        key={`totp-${i}`}
                        ref={(el) => { totpInputRefs.current[i] = el }}
                        type="text"
                        maxLength={1}
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value, true)}
                        onKeyDown={(e) => handleKeyDown(e, i, true)}
                        onPaste={(e) => handlePaste(e, true)}
                        disabled={isLoading}
                        className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-[1.79px] bg-transparent text-center text-xl sm:text-2xl text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                      />
                    ))}
                  </div>
                  <div className="text-gray-500">-</div>
                  <div className="flex gap-1.5 sm:gap-2">
                    {totp.slice(3, 6).map((digit, i) => (
                      <input
                        key={`totp-${i + 3}`}
                        ref={(el) => { totpInputRefs.current[i + 3] = el }}
                        type="text"
                        maxLength={1}
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleChange(i + 3, e.target.value, true)}
                        onKeyDown={(e) => handleKeyDown(e, i + 3, true)}
                        onPaste={(e) => handlePaste(e, true)}
                        disabled={isLoading}
                        className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border-[1.79px] bg-transparent text-center text-xl sm:text-2xl text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {/* Resend Link (Only Step 1) */}
            {step === 1 && (
              <div className="text-sm text-gray-400">
                Didn&apos;t receive the code? {" "}
                <button
                  onClick={handleResend}
                  disabled={isResending || isLoading}
                  className="text-gray-300 underline hover:text-white disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </div>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isVerifying || isLoading}
                  className="h-12 flex-1 rounded-lg border-white/10 hover:bg-white/5 text-white"
                >
                  Back
                </Button>
              )}

              <Button
                onClick={step === 1 && mfaRequired ? handleStepNext : handleVerify}
                disabled={isVerifying || isLoading}
                className={`h-12 ${step === 2 ? 'flex-1' : 'w-full'} rounded-lg bg-blue text-white hover:bg-[#0066CC]`}
              >
                {isVerifying ? "Verifying..." : (step === 1 && mfaRequired ? "Next" : "Submit")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthSplitLayout>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="flex bg-black min-h-screen items-center justify-center text-white">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
