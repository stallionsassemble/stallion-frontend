"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/api/auth";
import { uploadService } from "@/lib/api/upload";
import { talentOnboardingSchema, TalentOnboardingValues } from "@/lib/schemas/auth";
import { useAuth } from "@/lib/store/use-auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { countries as countriesData } from "countries-list";
import { Check, ChevronsUpDown, Github, Globe, Instagram, Linkedin, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const countries = Object.values(countriesData)
  .map((country) => ({
    label: country.name,
    value: country.name,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export default function TalentOnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [skillsList] = useState(["Frontend", "Backend", "UI/UX Design", "Writing", "Digital Marketing"]);
  const [avatarPreview, setAvatarPreview] = useState<string>("/jane-avatar.png");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<TalentOnboardingValues>({
    resolver: zodResolver(talentOnboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      location: "",
      skills: [],
      twitter: "",
      website: "",
      github: "",
      discord: "",
      linkedin: "",
      instagram: "",
      emailNotifications: false,
      termsAccepted: true,
    },
  });

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const checkUsername = async (username: string) => {
    if (username.length < 3) return;

    setIsCheckingUsername(true);
    try {
      const { available } = await authService.checkUsername(username);
      if (!available) {
        form.setError("username", {
          type: "manual",
          message: "Username is already taken",
        });
      } else {
        form.clearErrors("username");
      }
    } catch (error) {
      console.error("Failed to check username", error);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  async function onSubmit(data: TalentOnboardingValues) {
    const toastId = toast.loading("Completing your profile...")

    // Final validation before submit
    if (form.getFieldState("username").invalid) {
      toast.error("Please fix username errors", { id: toastId });
      return;
    }

    // Transform data to backend format
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      location: data.location,
      skills: data.skills,
      profilePicture: profilePictureUrl || "https://github.com/shadcn.png",
      socials: {
        "twitter": data.twitter ? (data.twitter.startsWith('http') ? data.twitter : `https://twitter.com/${data.twitter}`) : "",
        "website": data.website || "",
        "github": data.github ? (data.github.startsWith('http') ? data.github : `https://github.com/${data.github}`) : "",
        "discord": data.discord || "",
        "linkedin": data.linkedin ? (data.linkedin.startsWith('http') ? data.linkedin : `https://linkedin.com/in/${data.linkedin}`) : "",
        "instagram": data.instagram ? (data.instagram.startsWith('http') ? data.instagram : `https://instagram.com/${data.instagram}`) : "",
      },
      emailNotifications: data.emailNotifications
    }

    try {
      const response = await authService.completeProfileContributor(payload)

      // Update local user state
      if (user) {
        setUser({ ...response.user, profileCompleted: true })
      }

      toast.success("Profile completed successfully!", { id: toastId })
      router.push("/auth/onboarding/success?role=talent")
    } catch (error) {
      toast.error("Failed to complete profile. Please try again.", { id: toastId })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);

      const toastId = toast.loading("Uploading avatar...");
      try {
        const response = await uploadService.uploadImage(file);
        setProfilePictureUrl(response.url);
        toast.success("Avatar uploaded", { id: toastId });
      } catch (error) {
        toast.error("Failed to upload avatar", { id: toastId });
      }
    }
  };



  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-medium text-white">Finish Your Profile</h1>
        <p className="text-gray-400 text-sm md:text-base">It takes less than a minute to start earning in global standards.</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Helper Upload Visuals */}
        <div className="relative flex items-center">
          {/* Connecting Line */}
          <div className="absolute left-20 top-1/2 h-px w-12 -translate-y-1/2 bg-blue-500/50"></div>

          {/* Upload Circle */}
          <div className="relative z-10 mr-12">
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="avatar-upload"
              className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border border-blue-500 bg-[#090715] text-white hover:bg-blue-500/10 transition-colors"
            >
              <Upload className="h-8 w-8 stroke-[1px]" />
            </label>
          </div>

          {/* Avatar Preview Circle */}
          <div className="relative z-10 h-24 w-24 overflow-hidden rounded-full border-4 border-[#090715] ring-1 ring-white/10">
            <Image
              src={avatarPreview}
              width={96}
              height={96}
              alt="Avatar Preview"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-400">First Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" className="h-10 md:h-12 w-full rounded-lg border border-white/10 bg-[#0E0C1D] px-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-400">Last Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" className="h-10 md:h-12 w-full rounded-lg border border-white/10 bg-[#0E0C1D] px-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-gray-400">Username <span className="text-red-500">*</span></FormLabel>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                    <FormControl>
                      <Input
                        placeholder="username"
                        className="pl-8 pr-10 bg-[#0E0C1D]"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur();
                          checkUsername(e.target.value);
                        }}
                      />
                    </FormControl>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                      {isCheckingUsername ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-white" />
                      ) : !form.formState.errors.username && field.value && field.value.length >= 3 ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      ) : null}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs font-semibold text-gray-400">Location <span className="text-red-500">*</span></FormLabel>
                  <Popover open={locationOpen} onOpenChange={setLocationOpen} modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "h-10 md:h-12 w-full justify-between rounded-lg border border-white/10 bg-[#0E0C1D] px-4 text-sm text-white hover:bg-[#0E0C1D] hover:text-white font-normal",
                            !field.value && "text-gray-400"
                          )}
                        >
                          {field.value
                            ? countries.find(
                              (country) => country.value === field.value
                            )?.label || field.value
                            : "Select Location"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-[#1a1b1e] border-white/10 text-white" onOpenAutoFocus={(e) => e.preventDefault()}>
                      <div className="p-2 border-b border-white/10">
                        <Input
                          placeholder="Search country..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-transparent border-white/10 h-9 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[300px] overflow-y-auto p-1">
                        {countries
                          .filter((country) =>
                            country.label.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((country) => (
                            <div
                              key={country.value}
                              onClick={() => {
                                form.setValue("location", country.value);
                                setLocationOpen(false);
                                setSearchQuery("");
                              }}
                              className={cn(
                                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-white/10 text-gray-300",
                                country.value === field.value && "bg-white/10 text-white"
                              )}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  country.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {country.label}
                            </div>
                          ))}
                        {countries.filter((country) =>
                          country.label.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length === 0 && (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                              No country found.
                            </div>
                          )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-semibold text-gray-400">Your Skills <span className="text-red-500">*</span></FormLabel>
                <p className="text-[10px] text-gray-500">Get notified of new listings based on your skills</p>
                <div className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#0E0C1D] px-4 py-3 text-sm text-gray-400 flex items-center">
                  {field.value.length === 0 ? "Select Skills" : `${field.value.length} selected`}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skillsList.map((skill) => {
                    const isSelected = field.value.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => {
                          const currentSkills = field.value;
                          if (currentSkills.includes(skill)) {
                            field.onChange(currentSkills.filter((s) => s !== skill));
                          } else {
                            field.onChange([...currentSkills, skill]);
                          }
                        }}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors cursor-pointer ${isSelected
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                          }`}
                      >
                        {skill}
                      </button>
                    )
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">Socials</label>
              <p className="text-[10px] text-gray-500">Fill at least one, but more the merrier</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center rounded-lg border border-white/10 bg-[#0E0C1D] overflow-hidden">
                      <div className="flex h-12 w-12 items-center justify-center border-r border-white/10 bg-blue-500 text-white">
                        <X className="h-5 w-5 fill-current" />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter your X Username" className="border-none bg-transparent focus:ring-0" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center rounded-lg border border-white/10 bg-[#0E0C1D] overflow-hidden">
                      <div className="flex h-12 w-12 items-center justify-center border-r border-white/10 bg-blue-500 text-white">
                        <Globe className="h-5 w-5" />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter your website URL" className="border-none bg-transparent focus:ring-0" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center rounded-lg border border-white/10 bg-[#0E0C1D] overflow-hidden">
                      <div className="flex h-12 w-12 items-center justify-center border-r border-white/10 bg-blue-500 text-white">
                        <Github className="h-5 w-5" />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter your Github Username" className="border-none bg-transparent focus:ring-0" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discord"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center rounded-lg border border-white/10 bg-[#0E0C1D] overflow-hidden">
                      <div className="flex h-12 w-12 items-center justify-center border-r border-white/10 bg-blue-500 text-white">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" /></svg>

                      </div>
                      <FormControl>
                        <Input placeholder="Enter your Discord Username" className="border-none bg-transparent focus:ring-0" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center rounded-lg border border-white/10 bg-[#0E0C1D] overflow-hidden">
                      <div className="flex h-12 w-12 items-center justify-center border-r border-white/10 bg-blue-500 text-white">
                        <Linkedin className="h-5 w-5" />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter your LinkedIn Username" className="border-none bg-transparent focus:ring-0" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center rounded-lg border border-white/10 bg-[#0E0C1D] overflow-hidden">
                      <div className="flex h-12 w-12 items-center justify-center border-r border-white/10 bg-blue-500 text-white">
                        <Instagram className="h-5 w-5" />
                      </div>
                      <FormControl>
                        <Input placeholder="Enter your Instagram Username" className="border-none bg-transparent focus:ring-0" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-white/10 bg-white/5 checked:bg-blue-500"
                    />
                  </FormControl>
                  <FormLabel className="flex-1 text-sm text-gray-400 font-normal">
                    Send me helpful emails to find rewarding Bounties for win
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 checked:bg-blue-500"
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="font-semibold text-white">Accept terms and conditions</FormLabel>
                    <p className="text-xs text-gray-500">By clicking this checkbox, you agree to the terms and conditions.</p>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="h-12 w-full rounded-lg bg-blue text-white hover:bg-[#0066CC]">
            Create Profile
          </Button>

        </form>
      </Form>
    </div>
  );
}
