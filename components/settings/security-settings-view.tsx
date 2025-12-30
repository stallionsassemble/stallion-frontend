import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { authService } from "@/lib/api/auth";
import { settingsService } from "@/lib/api/settings";
import { useAuth } from "@/lib/store/use-auth";
import { startRegistration } from "@simplewebauthn/browser";
import { CheckCircle2, Copy, Download, Key, Loader2, MoreVertical, Pencil, Smartphone, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Passkey {
  id: string;
  name: string;
  createdAt: string;
  lastUsedAt?: string;
}

export function SecuritySettingsView() {
  const { user, setUser, mfaEnabled, setMfaEnabled } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [isLoadingPasskeys, setIsLoadingPasskeys] = useState(false);
  const [editingPasskey, setEditingPasskey] = useState<Passkey | null>(null);
  const [deletingPasskeyId, setDeletingPasskeyId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const fetchPasskeys = async () => {
    setIsLoadingPasskeys(true);
    try {
      const data = await settingsService.getPasskeys();
      // Ensure data is array, or extract from response structure if needed
      setPasskeys(Array.isArray(data) ? data : data.passkeys || []);
    } catch (error) {
      console.error("Failed to fetch passkeys", error);
    } finally {
      setIsLoadingPasskeys(false);
    }
  };

  useEffect(() => {
    fetchPasskeys();
  }, []);

  const handleUpdatePasskey = async () => {
    if (!editingPasskey || !newName.trim()) return;

    const toastId = toast.loading("Updating passkey...");
    try {
      await settingsService.updatePasskey(editingPasskey.id, newName);
      toast.success("Passkey renamed successfully", { id: toastId });
      setEditingPasskey(null);
      fetchPasskeys();
    } catch (error: any) {
      toast.error(error.message || "Failed to update passkey", { id: toastId });
    }
  };

  const handleDeletePasskey = async () => {
    if (!deletingPasskeyId) return;

    const toastId = toast.loading("Deleting passkey...");
    try {
      await settingsService.deletePasskey(deletingPasskeyId);
      toast.success("Passkey deleted successfully", { id: toastId });
      setDeletingPasskeyId(null);
      fetchPasskeys();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete passkey", { id: toastId });
    }
  };

  // Update handleConfirmPasskeyName to refresh list
  // ... inside handleConfirmPasskeyName success block:
  // fetchPasskeys();

  // ... rest of component

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

  // Passkey State
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [passkeyName, setPasskeyName] = useState("");
  const [tempAttestationResponse, setTempAttestationResponse] = useState<any>(null);

  // ... (existing code for MFA ...)

  const handleAddPasskey = async () => {
    setIsPasskeyLoading(true);
    const toastId = toast.loading("Initializing passkey setup...");
    try {
      // 1. Get options from backend
      const options = await authService.passkeyRegisterOptions();

      // 2. Start registration with browser
      const attResp = await startRegistration({ optionsJSON: options });

      // 3. Store response and open name dialog
      setTempAttestationResponse(attResp);
      setIsNameDialogOpen(true);
      toast.dismiss(toastId);
    } catch (error: any) {
      console.error(error);
      if (error.name === 'InvalidStateError') {
        toast.error("This passkey is already registered.", { id: toastId });
      } else {
        toast.error(error.response?.data?.message || error.message || "Failed to register passkey", { id: toastId });
      }
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  const handleConfirmPasskeyName = async () => {
    if (!passkeyName.trim()) {
      toast.error("Please enter a name for your passkey");
      return;
    }

    setIsPasskeyLoading(true);
    const toastId = toast.loading("Verifying passkey...");

    try {
      // 4. Verify registration with backend including name
      await authService.passkeyRegisterVerify({
        response: tempAttestationResponse,
        name: passkeyName
      });

      toast.success("Passkey registered successfully!", { id: toastId });

      // Reset state
      setIsNameDialogOpen(false);
      setPasskeyName("");
      setTempAttestationResponse(null);

      // Refresh list
      fetchPasskeys();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verified passkey", { id: toastId });
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
        {/* Passkeys List */}
        {passkeys.length > 0 && (
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-muted-foreground">Your Passkeys</h5>
            <div className="grid gap-3">
              {passkeys.map((passkey) => (
                <div key={passkey.id} className="flex items-center justify-between p-4 bg-muted/20 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Key className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{passkey.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Added on {new Date(passkey.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setEditingPasskey(passkey);
                        setNewName(passkey.name);
                      }}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeletingPasskeyId(passkey.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rename Passkey Modal */}
      <Dialog open={!!editingPasskey} onOpenChange={(open) => !open && setEditingPasskey(null)}>
        <DialogContent className="bg-background w-[95%] max-w-sm rounded-xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold font-inter text-foreground">Rename Passkey</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Passkey Name"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditingPasskey(null)}>Cancel</Button>
              <Button onClick={handleUpdatePasskey} disabled={!newName.trim()}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Passkey Confirmation */}
      <Dialog open={!!deletingPasskeyId} onOpenChange={(open) => !open && setDeletingPasskeyId(null)}>
        <DialogContent className="bg-background w-[95%] max-w-sm rounded-xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold font-inter text-foreground">Delete Passkey?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this passkey? You will no longer be able to use it to sign in.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeletingPasskeyId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePasskey}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Passkey Name Modal */}
      <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
        <DialogContent className="bg-background w-[95%] max-w-sm rounded-xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold font-inter text-foreground">Name your Passkey</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground font-inter">
              Give this passkey a name so you can identify it later (e.g., "My iPhone", "MacBook Pro").
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="e.g. MacBook Pro"
              value={passkeyName}
              onChange={(e) => setPasskeyName(e.target.value)}
              className="bg-transparent border-input"
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsNameDialogOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPasskeyName}
                disabled={isPasskeyLoading || !passkeyName.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isPasskeyLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save Passkey
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
