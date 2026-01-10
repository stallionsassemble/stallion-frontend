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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { authService } from "@/lib/api/auth";
import { uploadService } from "@/lib/api/upload";
import { useUpdateOwnerProfile } from "@/lib/api/users/queries";
import { ownerOnboardingSchema, OwnerOnboardingValues } from "@/lib/schemas/auth";
import { useAuth } from "@/lib/store/use-auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { countries as countriesData } from "countries-list";
import { Check, ChevronsUpDown, Globe, Instagram, Linkedin, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const countries = Object.values(countriesData)
  .map((country) => ({
    label: country.name,
    value: country.name,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export function OwnerProfileSettingsForm() {
  const { user, setUser } = useAuth();
  const updateOwner = useUpdateOwnerProfile();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const form = useForm<OwnerOnboardingValues>({
    resolver: zodResolver(ownerOnboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      location: "",
      profilePicture: "",
      companyName: "",
      entityName: "",
      phoneNumber: "",
      industry: "",
      companyLogo: "",
      companyBio: "",
      twitter: "",
      website: "",
      linkedin: "",
      instagram: "",
      emailNotifications: false,
      termsAccepted: true, // Auto-accept for existing users or keep as is? Schema requires true.
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        location: user.location || "",
        profilePicture: user.profilePicture || "",
        companyName: user.companyName || "",
        entityName: user.entityName || "",
        phoneNumber: user.phoneNumber || "",
        industry: user.industry || "",
        companyLogo: user.companyLogo || "",
        companyBio: user.companyBio || "",
        twitter: user.socials?.twitter || "",
        website: user.socials?.website || "",
        linkedin: user.socials?.linkedin || "",
        instagram: user.socials?.instagram || "",
        emailNotifications: user.emailNotifications ?? false,
        termsAccepted: true,
      });
      if (user.profilePicture) setProfilePreview(user.profilePicture);
      if (user.companyLogo) setLogoPreview(user.companyLogo);
    }
  }, [user, form]);


  const checkUsername = async (username: string) => {
    if (username === user?.username) {
      form.clearErrors("username");
      return;
    }
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

  async function onSubmit(data: OwnerOnboardingValues) {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      location: data.location,
      skills: [], // Owner doesn't strictly need skills in this context, but API might expect it.
      profilePicture: data.profilePicture,
      socials: {
        "linkedin": data.linkedin ? (data.linkedin.startsWith('http') ? data.linkedin : `https://linkedin.com/in/${data.linkedin}`) : "",
        "twitter": data.twitter ? (data.twitter.startsWith('http') ? data.twitter : `https://twitter.com/${data.twitter}`) : "",
        "website": data.website || "",
        "instagram": data.instagram ? (data.instagram.startsWith('http') ? data.instagram : `https://instagram.com/${data.instagram}`) : "",
      },
      companyName: data.companyName,
      entityName: data.entityName,
      phoneNumber: data.phoneNumber,
      industry: data.industry,
      companyBio: data.companyBio,
      companyLogo: data.companyLogo,
    }

    try {
      await updateOwner.mutateAsync(payload);
      // user state update handled by mutation onSuccess in query typically, but we can optimistically update or rely on re-fetch
      // The useUpdateOwnerProfile hook should invalidate queries.
    } catch (error) {
      console.error(error);
      // Toast handled by mutation
    }
  }

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));

      const toastId = toast.loading("Uploading profile picture...");
      try {
        const response = await uploadService.uploadImage(file);
        form.setValue("profilePicture", response.url);
        toast.success("Profile picture uploaded", { id: toastId });
      } catch (error) {
        toast.error("Failed to upload profile picture", { id: toastId });
      }
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));

      const toastId = toast.loading("Uploading company logo...");
      try {
        const response = await uploadService.uploadImage(file);
        form.setValue("companyLogo", response.url);
        toast.success("Company logo uploaded", { id: toastId });
      } catch (error) {
        toast.error("Failed to upload company logo", { id: toastId });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log("Form Errors:", errors))} className="space-y-6 md:space-y-10 max-w-4xl animate-in fade-in duration-500">

        {/* ABOUT YOU SECTION */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white">About You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-white text-sm">First Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" className="h-10 md:h-12 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none" {...field} />
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
                  <FormLabel className="font-medium text-white text-sm">Last Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" className="h-10 md:h-12 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none" {...field} />
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
                  <FormLabel className="font-medium text-white text-sm">Username <span className="text-red-500">*</span></FormLabel>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                    <FormControl>
                      <Input
                        placeholder="Ex: surname"
                        className="pl-8 pr-10 bg-transparent rounded-lg border-[1.19px] border-[#E5E5E5] focus:border-blue-500 disabled:opacity-50"
                        {...field}
                        disabled={!!user?.username}
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
                        <Check className="h-4 w-4 text-green-500" />
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
                  <FormLabel className="font-medium text-white text-sm">Location <span className="text-red-500">*</span></FormLabel>
                  <Popover open={locationOpen} onOpenChange={setLocationOpen} modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "h-10 md:h-12 w-full justify-between rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-white hover:bg-transparent hover:text-white font-normal",
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
                    <Image src={profilePreview!} fill alt="Profile Preview" className="object-cover" />
                  ) : (
                    <div className="h-full w-full bg-blue-500/10" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* ABOUT YOUR COMPANY SECTION */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white">About Your Company</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-white text-sm">Company Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Stallion" className="h-10 md:h-12 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="entityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-white text-sm">Entity Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Full Entity Name" className="h-10 md:h-12 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-white text-sm">Phone Number <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" className="h-10 md:h-12 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-white text-sm">Industry <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <select className="h-10 md:h-12 w-full appearance-none rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent px-4 text-sm text-gray-400 focus:border-blue-500 focus:outline-none" {...field}>
                      <option value="">Select an Industry</option>
                      <option value="Crypto">Crypto</option>
                      <option value="Fintech">Fintech</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="companyBio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-white text-sm">Company Short Bio <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Company short bio"
                    className="h-24 w-full rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent p-4 text-sm text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                    {...field}
                  />
                </FormControl>
                <div className="text-right text-[10px] text-gray-500">
                  {500 - (field.value?.length || 0)} characters left
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <label className="font-medium text-white text-sm">Company Logo <span className="text-red-500">*</span></label>
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
                  <Image src={logoPreview!} fill alt="Logo Preview" className="object-cover" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent overflow-hidden">
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
                  <div className="flex items-center rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent overflow-hidden">
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
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent overflow-hidden">
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
                  <div className="flex items-center rounded-lg border-[1.19px] border-[#E5E5E5] bg-transparent overflow-hidden">
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

        <Button
          type="submit"
          disabled={updateOwner.isPending}
          className="h-12 w-full rounded-lg bg-blue text-white hover:bg-[#0066CC]"
        >
          {updateOwner.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>

      </form>
    </Form >
  );
}
