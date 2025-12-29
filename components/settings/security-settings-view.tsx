import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { authService } from "@/lib/api/auth";
import { useAuth } from "@/lib/store/use-auth";
import { startRegistration } from "@simplewebauthn/browser";
import { CheckCircle2, Copy, Download, Key, Loader2, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SecuritySettingsView() {
  const { user, setUser, mfaEnabled, setMfaEnabled } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);

  const handleSwitchChange = async (checked: boolean) => {
    if (checked) {
      if (!user?.id) {
        toast.error("User ID not found");
        return;
      }
      setIsLoading(true);
      const toastId = toast.loading("Initializing 2FA setup...");
      try {
        const response = await authService.setupMfa(user.id);
        setQrCodeData(response.qrCode);
        setTotpSecret(response.totpSecret);
        setIsModalOpen(true);
        toast.dismiss(toastId);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to setup MFA", { id: toastId });
        //setTwoFactorEnabled(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      //setTwoFactorEnabled(false);
      // Ideally call API to disable MFA here if needed
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow 1 char
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to focus previous
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const enableTwoFactor = async () => {
    if (!user?.id) return;
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter a complete 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyTotp(user.id, code);
      toast.success("Two-Factor Authentication enabled successfully!");

      // Update global user state
      setUser({ ...user, mfaEnabled: true });
      setMfaEnabled(true);

      if (response.backupCodes && response.backupCodes.length > 0) {
        setBackupCodes(response.backupCodes);
        setShowBackupCodes(true);
      } else {
        // If no backup codes returned, just close
        setIsModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCodes = () => {
    const text = `Stallion Backup Codes\n\n${backupCodes.join("\n")}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stallion-backup-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Backup codes downloaded");
  };

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    toast.success("Backup codes copied to clipboard");
  };

  const handleCompleteSetup = () => {
    setMfaEnabled(true);
    setIsModalOpen(false);
    setShowBackupCodes(false);
    setOtp(["", "", "", "", "", ""]);
  };

  const handleAddPasskey = async () => {
    setIsPasskeyLoading(true);
    const toastId = toast.loading("Initializing passkey setup...");
    try {
      // 1. Get options from backend
      const options = await authService.passkeyRegisterOptions();

      // 2. Start registration with browser
      const attResp = await startRegistration({ optionsJSON: options });

      // 3. Verify registration with backend
      await authService.passkeyRegisterVerify(attResp);

      toast.success("Passkey registered successfully!", { id: toastId });
    } catch (error: any) {
      console.error(error);
      // Handle simplewebauthn errors specifically or generic errors
      if (error.name === 'InvalidStateError') {
        toast.error("This passkey is already registered.", { id: toastId });
      } else {
        toast.error(error.response?.data?.message || error.message || "Failed to register passkey", { id: toastId });
      }
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold font-inter text-foreground">Authentication</h2>
        <p className="text-muted-foreground font-inter">Add an extra layer of security to your account by enabling two-factor authentication.</p>
      </div>

      <div className="space-y-6">
        {/* 2FA Item */}
        <div className="border border-primary rounded-xl p-4 md:p-6 bg-primary/14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-[50px] h-[50px] rounded-full bg-primary/48 flex items-center justify-center">
              <Smartphone className="w-[35px] h-[35px] text-white" />
            </div>
            <div>
              <h4 className="text-[20px] font-bold font-inter text-foreground">Two-Factor Authentication</h4>
              <p className="text-sm font-medium font-inter text-muted-foreground">Add extra security with 2FA</p>
            </div>
          </div>
          <Switch checked={mfaEnabled} onCheckedChange={handleSwitchChange} disabled={isLoading} />
        </div>

        {/* Passkeys Item */}
        <div className="border border-primary rounded-xl p-4 md:p-6 bg-primary/14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-[50px] h-[50px] rounded-full bg-primary/48 flex items-center justify-center">
              <Key className="w-[35px] h-[35px] text-white" />
            </div>
            <div>
              <h4 className="text-[20px] font-bold font-inter text-foreground">Passkeys</h4>
              <p className="text-sm font-medium font-inter text-muted-foreground">Sign in with biometrics</p>
            </div>
          </div>
          <Button
            onClick={handleAddPasskey}
            disabled={isPasskeyLoading}
            className="bg-[#0066FF] hover:bg-blue-700 text-white font-medium text-[13px] h-7"
          >
            {isPasskeyLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Add a Passkey
          </Button>
        </div>
      </div>

      {/* 2FA Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open && !showBackupCodes && !mfaEnabled) {
          setMfaEnabled(false); // Reset switch if closed without verifying
        }
        if (!open) {
          // Reset state on close
          setShowBackupCodes(false);
        }
        setIsModalOpen(open);
      }}>
        <DialogContent className="bg-background w-[95%] max-w-md p-0 rounded-xl max-h-[85vh] flex flex-col">
          <DialogHeader className="p-6 pb-2 flex-col items-start justify-between">
            <DialogTitle className="text-2xl text-start font-bold font-inter text-white">
              {showBackupCodes ? "Save Backup Codes" : "Enable Two-Factor Authentication"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400 font-inter">
              {showBackupCodes
                ? "Store these recovery codes in a safe place. They can be used to recover access to your account if you lose your mobile device."
                : "Add an extra layer of security to your account by enabling two-factor authentication."
              }
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6 pt-0">
            <div className="space-y-6 pb-2">
              <div className="w-full h-px bg-primary/23" />

              {!showBackupCodes ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="text-gray-400 select-none text-xs">1.</span>
                    <p className="text-xs text-gray-300 font-inter font-normal leading-tight">
                      To enable 2FA, you need to install an authenticator app like Authy, or Google Authenticator.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-400 select-none text-xs">2.</span>
                    <div className="space-y-2 w-full">
                      <p className="text-xs text-gray-300 font-inter font-normal leading-tight">
                        Scan the QR Code below with your authenticator app. If you can't scan this barcode, enter the text code ({totpSecret}) on the authenticator app instead.
                      </p>
                      <div className="bg-white p-4 w-fit mx-auto rounded-lg">
                        {qrCodeData && (
                          <div className="w-[236px] h-[236px] flex items-center justify-center relative">
                            <img src={qrCodeData} alt="QR Code" width={236} height={236} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-gray-400 select-none text-xs">3.</span>
                    <div className="space-y-4 w-full">
                      <p className="text-xs text-gray-300 font-inter font-normal leading-tight">
                        Enter the TOTP generated by the app and click enable.
                      </p>

                      <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
                        {otp.map((digit, index) => (
                          <div key={index} className="flex items-center">
                            <Input
                              id={`otp-${index}`}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(index, e)}
                              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-center text-lg bg-transparent border-white/20 rounded-md focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]"
                              maxLength={1}
                              disabled={isLoading}
                            />
                            {/* Add dash after 3rd digit */}
                            {index === 2 && <span className="text-white/20 mx-1 md:mx-2">-</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-2">
                    <Button
                      onClick={enableTwoFactor}
                      disabled={isLoading}
                      className="w-fit px-6 h-10 bg-primary hover:bg-primary/90 text-white font-medium"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-muted/20 rounded-lg border border-primary/20">
                    <div className="grid grid-cols-2 gap-3">
                      {backupCodes.map((code, i) => (
                        <div key={i} className="font-mono text-center text-sm p-1 rounded bg-background/50 text-foreground">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={handleCopyCodes}
                      className="bg-transparent border-primary/30 text-white hover:bg-primary/10"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDownloadCodes}
                      className="bg-transparent border-primary/30 text-white hover:bg-primary/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={handleCompleteSetup}
                      className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      I&apos;ve saved my backup codes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
