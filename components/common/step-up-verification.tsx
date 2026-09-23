"use client";

import { useState } from "react";
import { startAuthentication } from "@simplewebauthn/browser";
import { Key, Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface StepUpVerificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasTotp: boolean;
  hasPasskeys: boolean;
  onSuccess: (stepUpToken: string) => void;
  title?: string;
  description?: string;
}

export function StepUpVerification({
  open,
  onOpenChange,
  hasTotp,
  hasPasskeys,
  onSuccess,
  title = "Security Verification",
  description = "Please confirm your identity to complete this sensitive operation.",
}: StepUpVerificationProps) {
  // Method selection: default to passkey if available, otherwise totp
  const [method, setMethod] = useState<"passkey" | "totp">(
    hasPasskeys ? "passkey" : "totp"
  );
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`step-up-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`step-up-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyTotp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter a complete 6-digit code");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Verifying code...");
    try {
      const res = await authService.stepUpTotp(code);
      toast.success("Identity verified successfully", { id: toastId });
      onOpenChange(false);
      onSuccess(res.stepUpToken);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Invalid verification code",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPasskey = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Requesting passkey authentication...");
    try {
      // 1. Get step-up options from server
      const options = await authService.stepUpPasskeyOptions();

      // 2. Start biometric / security key flow via browser WebAuthn API
      const authResp = await startAuthentication({ optionsJSON: options });

      // 3. Verify on server and receive step-up token
      const res = await authService.stepUpPasskeyVerify(authResp);
      toast.success("Identity verified with passkey", { id: toastId });
      onOpenChange(false);
      onSuccess(res.stepUpToken);
    } catch (error: any) {
      console.error(error);
      if (error.name === "NotAllowedError") {
        toast.error("Passkey authentication was cancelled", { id: toastId });
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Passkey verification failed",
          { id: toastId }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] bg-background border border-border">
        <DialogHeader>
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-lg font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Method switcher if user has both methods */}
        {hasTotp && hasPasskeys && (
          <div className="flex rounded-lg bg-muted/30 p-1 mb-4 border border-border">
            <button
              type="button"
              onClick={() => setMethod("passkey")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-colors ${
                method === "passkey"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Key className="w-4 h-4" />
              Passkey
            </button>
            <button
              type="button"
              onClick={() => setMethod("totp")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-colors ${
                method === "totp"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Authenticator
            </button>
          </div>
        )}

        {/* Passkey verification view */}
        {method === "passkey" && hasPasskeys && (
          <div className="space-y-4 py-2 text-center">
            <p className="text-xs text-muted-foreground">
              Use your device's biometric sensor, PIN, or hardware security key
              to verify this action.
            </p>
            <Button
              onClick={handleVerifyPasskey}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying Passkey...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Verify with Passkey
                </>
              )}
            </Button>
          </div>
        )}

        {/* TOTP verification view */}
        {method === "totp" && hasTotp && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-center text-muted-foreground">
              Enter the 6-digit code from your authenticator app (or a backup
              code).
            </p>
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <Input
                  key={idx}
                  id={`step-up-otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-12 text-center text-lg font-bold bg-muted/20 border-border"
                />
              ))}
            </div>
            <Button
              onClick={handleVerifyTotp}
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
