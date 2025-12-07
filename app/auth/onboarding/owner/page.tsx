"use client";

import { Button } from "@/components/ui/button";
import { Globe, Instagram, Linkedin, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useState } from "react";

export default function OwnerOnboardingPage() {
  const router = useRouter();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl md:text-5xl font-semibold font-inter tracking-[-0.95px] text-white">Welcome to Stallion</h1>
        <p className="text-gray-400 font-light md:text-2xl tracking-[-0.95px]">Let&apos;s start with some basic information about your team</p>
      </div>


      <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); router.push("/auth/onboarding/success?role=owner"); }}>

        {/* ABOUT US SECTION */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white">About You</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-medium text-white text-sm">First Name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="First Name" className="h-12 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-white text-sm">Last Name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Last Name" className="h-12 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-medium text-white text-sm">Username <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className=" border-r border-white/10 bg-blue-500 text-white left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                <input type="text" placeholder="Ex: surname" className="h-12 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent pl-8 pr-10 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-medium text-white text-sm">Location <span className="text-red-500">*</span></label>
              <select className="h-12 w-full appearance-none rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-gray-400 focus:border-blue-500 focus:outline-none">
                <option>Select a Region</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="space-y-2">
              <div className="space-y-2">
                <label className="font-medium text-white text-sm">Profile Picture <span className="text-red-500">*</span></label>
                <div className="relative flex items-center">
                  {/* Connecting Line */}
                  <div className="absolute left-16 top-1/2 h-px w-8 -translate-y-1/2 bg-blue-500/50"></div>

                  {/* Upload Circle */}
                  <div className="relative z-10 mr-8">
                    <input
                      type="file"
                      id="profile-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfileUpload}
                    />
                    <label
                      htmlFor="profile-upload"
                      className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-blue-500 bg-[#090715] text-white hover:bg-blue-500/10 transition-colors"
                    >
                      <Upload className="h-6 w-6 stroke-[1px]" />
                    </label>
                  </div>

                  {/* Profile Preview Circle */}
                  <div className="relative z-10 h-20 w-20 overflow-hidden rounded-full border-4 border-[#090715] ring-1 ring-white/10">
                    {profilePreview ? (
                      <Image src={profilePreview} fill alt="Profile Preview" className="object-cover" />
                    ) : (
                      <div className="h-full w-full bg-blue-500/10" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* ABOUT YOUR COMPANY SECTION */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white">About Your Company</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-medium text-white text-sm">Company Name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Stallion" className="h-12 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-white text-sm">Entity Name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Full Entity Name" className="h-12 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-medium text-white text-sm">Phone Number <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Phone Number" className="h-12 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-white text-sm">Industry <span className="text-red-500">*</span></label>
              <select className="h-12 w-full appearance-none rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-gray-400 focus:border-blue-500 focus:outline-none">
                <option>Select a Region</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-medium text-white text-sm">Company Short Bio <span className="text-red-500">*</span></label>
            <textarea placeholder="Company short bio" className="h-24 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent p-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none resize-none" />
            <div className="text-right text-[10px] text-gray-500">500 characters left</div>
          </div>

          <div className="space-y-2">
            <label className="font-medium text-white text-sm">Company Logo <span className="text-red-500">*</span></label>
            <input
              type="file"
              id="logo-upload"
              className="hidden"
              accept="image/*"
              onChange={handleLogoUpload}
            />
            <div className="relative flex items-center">
              {/* Connecting Line */}
              <div className="absolute left-16 top-1/2 h-px w-8 -translate-y-1/2 bg-blue-500/50"></div>

              {/* Upload Circle */}
              <div className="relative z-10 mr-8">
                <input
                  type="file"
                  id="logo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <label
                  htmlFor="logo-upload"
                  className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-blue-500 bg-[#090715] text-white hover:bg-blue-500/10 transition-colors"
                >
                  <Upload className="h-6 w-6 stroke-[1px]" />
                </label>
              </div>

              {/* Logo Preview Circle */}
              <div className="relative z-10 h-20 w-20 overflow-hidden rounded-full border-4 border-[#090715] ring-1 ring-white/10">
                {logoPreview ? (
                  <Image src={logoPreview} fill alt="Logo Preview" className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-blue-500/10" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* SOCIALS */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="font-medium text-white text-sm">Socials</label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent overflow-hidden">
              <div className="flex h-12 w-12 items-center justify-center border-r border-white/10 bg-blue-500 text-white">
                <X className="h-5 w-5 fill-current" />
              </div>
              <input type="text" placeholder="Enter your X Username" className="h-12 w-full bg-transparent px-4 text-xs text-white placeholder:text-gray-600 focus:outline-none" />
            </div>
            <div className="flex items-center rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent overflow-hidden">
              <div className="flex h-12 w-12 items-center justify-center border-r border-white/10 bg-blue-500 text-white">
                <Globe className="h-5 w-5" />
              </div>
              <input type="text" placeholder="Enter your website URL" className="h-12 w-full bg-transparent px-4 text-xs text-white placeholder:text-gray-600 focus:outline-none" />
            </div>
            <div className="flex items-center rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent overflow-hidden">
              <div className="flex h-12 w-12 items-center justify-center border-r border-white/10 bg-blue-500 text-white">
                <Linkedin className="h-5 w-5" />
              </div>
              <input type="text" placeholder="Enter your LinkedIn Username" className="h-12 w-full bg-transparent px-4 text-xs text-white placeholder:text-gray-600 focus:outline-none" />
            </div>
            <div className="flex items-center rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent overflow-hidden">
              <div className="flex h-12 w-12 items-center justify-center border-r border-white/10 bg-blue-500 text-white">
                <Instagram className="h-5 w-5" />
              </div>
              <input type="text" placeholder="Enter your Instagram Username" className="h-12 w-full bg-transparent px-4 text-xs text-white placeholder:text-gray-600 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <label className="flex items-center gap-3 text-sm text-gray-400">
            <input type="checkbox" className="h-4 w-4 rounded border-white/10 bg-white/5 checked:bg-blue-500" />
            Send me helpful emails to find rewarding Bounties for win
          </label>
          <label className="flex items-start gap-3 text-sm text-gray-400">
            <input type="checkbox" className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 checked:bg-blue-500" defaultChecked />
            <div>
              <span className="font-semibold text-white">Accept terms and conditions</span>
              <p className="text-xs text-gray-500">I understand and acknowledge that this project is built on, or supports, the blockchain, and that Stallion Parties perform exclusively for teams and projects within this ecosystem.</p>
            </div>
          </label>
        </div>

        <Button className="h-12 w-full rounded-lg bg-blue text-white hover:bg-[#0066CC]">
          Create Profile
        </Button>

      </form>
    </div >
  );
}
