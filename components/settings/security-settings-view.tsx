"use client";

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
import { Key, Smartphone } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function SecuritySettingsView() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleSwitchChange = (checked: boolean) => {
    if (checked) {
      setIsModalOpen(true);
    } else {
      setTwoFactorEnabled(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow 1 char
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

  const enableTwoFactor = () => {
    // Verify OTP logic here
    setTwoFactorEnabled(true);
    setIsModalOpen(false);
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
          <Switch checked={twoFactorEnabled} onCheckedChange={handleSwitchChange} />
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
          <Button className="bg-[#0066FF] hover:bg-blue-700 text-white font-medium text-[13px] h-7">
            Add a Passkey
          </Button>
        </div>
      </div>

      {/* 2FA Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-background w-[95%] max-w-md p-0 rounded-xl max-h-[85vh] flex flex-col">
          <DialogHeader className="p-6 pb-2 flex-col items-start justify-between">
            <DialogTitle className="text-2xl text-start font-bold font-inter text-white">Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription className="text-sm text-gray-400 font-inter">Add an extra layer of security to your account by enabling two-factor authentication.</DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6 pt-0">
            <div className="space-y-6 pb-2">
              <div className="w-full h-px bg-primary/23" />

              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="text-gray-400 select-none text-xs">1.</span>
                  <p className="text-xs text-gray-300 font-inter font-normal leading-tight">
                    To enable 2FA, you need to install an authenticator app like Authy, or Google Authenticator.
                  </p>
                </div>

                <div className="flex gap-2">
                  <span className="text-gray-400 select-none text-xs">2.</span>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-300 font-inter font-normal leading-tight">
                      Scan the QR Code below with your authenticator app. If you can't scan this barcode, enter the text code (CYDDW7ZNDZIFKZRL) on the authenticator app instead.
                    </p>
                    <div className="bg-white p-4 w-fit mx-auto rounded-lg">
                      {/* Placeholder QR - usually an image or generated Canvas */}
                      <div className="w-[236px] h-[236px] bg-white flex items-center justify-center relative">
                        <Image
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=236x236&data=example-otp-auth-url`}
                          alt="QR Code"
                          width={236}
                          height={236}
                        />
                      </div>
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
                    className="w-fit px-6 h-10 bg-primary hover:bg-primary/90 text-white font-medium"
                  >
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
