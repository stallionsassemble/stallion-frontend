"use client";

import { Badge } from "@/components/ui/badge";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { authService } from "@/lib/api/auth";
import { profileSchema, ProfileValues } from "@/lib/schemas/profile";
import { useAuth } from "@/lib/store/use-auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Check,
  ChevronsUpDown,
  Gamepad2,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  Twitter,
  Upload,
  UserCheck,
  X as XIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { countries as countriesData } from "countries-list";

const countries = Object.values(countriesData)
  .map((country) => ({
    label: country.name,
    value: country.name,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const socialConfigs = [
  { name: "twitter", label: "X(Formerly Twitter)", icon: Twitter, placeholder: "Enter your X Username" },
  { name: "website", label: "Website", icon: Globe, placeholder: "Enter your website URL" },
  { name: "github", label: "Github", icon: Github, placeholder: "Enter your Github Username" },
  { name: "discord", label: "Discord", icon: Gamepad2, placeholder: "Enter your Discord Username" },
  { name: "linkedin", label: "Linkedin", icon: Linkedin, placeholder: "Enter your Linkedin Username" },
  { name: "instagram", label: "Instagram", icon: Instagram, placeholder: "Enter your Instagram Username" },
] as const;

const suggestedSkills = ["Frontend", "Backend", "UI/UX Design", "Writing", "Digital Marketing"];

interface ProfileSettingsFormProps {
  onAfterSave?: () => void;
}

export function ProfileSettingsForm({ onAfterSave }: ProfileSettingsFormProps) {
  const { user } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string>("https://avatar.vercel.sh/johndoe");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      location: "",
      bio: "",
      skills: [],
      twitter: "",
      website: "",
      github: "",
      discord: "",
      linkedin: "",
      instagram: "",
    },
  });

  // Effect to populate form with user data
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        location: user.location || "",
        bio: user.companyBio || "",
        skills: user.skills ? (Array.isArray(user.skills) ? user.skills : []) : [],
        twitter: user.socials?.twitter || "",
        website: user.socials?.website || "",
        github: user.socials?.github || "",
        discord: user.socials?.discord || "",
        linkedin: user.socials?.linkedin || "",
        instagram: user.socials?.instagram || "",
      });
      if (user.profilePicture) {
        setAvatarPreview(user.profilePicture);
      }
    }
  }, [user, form]);

  const onSubmit = (data: ProfileValues) => {
    console.log("Form Submitted:", data);
    toast.warning("Update endpoint is not yet available.");
    onAfterSave?.();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleAddSkill = (skill: string) => {
    const currentSkills = form.getValues("skills");
    if (!currentSkills.includes(skill)) {
      form.setValue("skills", [...currentSkills, skill]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues("skills");
    form.setValue(
      "skills",
      currentSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();
      if (value) {
        handleAddSkill(value);
        input.value = "";
      }
    }
  };

  const checkUsername = async (username: string) => {
    if (!username || username === user?.username) {
      setIsCheckingUsername(false);
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    setUsernameAvailable(null);

    try {
      const response = await authService.checkUsername(username);
      setUsernameAvailable(response.available);
    } catch (error) {
      console.error("Failed to check username availability", error);
      setUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("username", value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Reset status while typing
    if (!value) {
      setUsernameAvailable(null);
      setIsCheckingUsername(false);
      return;
    }

    // Debounce check
    debounceTimerRef.current = setTimeout(() => {
      checkUsername(value);
    }, 500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl animate-in fade-in duration-500">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative flex items-center">
            {/* Upload Placeholder */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full border border-primary flex items-center justify-center bg-transparent cursor-pointer hover:bg-primary/10 transition-colors"
            >
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {/* Connector Line */}
            <div className="w-8 h-px bg-primary" />

            {/* Current Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-background relative border border-border">
              <Image
                src={avatarPreview}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-200">
                    First Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John" className="bg-transparent border-foreground h-12 text-[14px] font-light" {...field} />
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
                  <FormLabel className="text-sm font-medium text-gray-200">
                    Last Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" className="bg-transparent border-foreground h-12 text-[14px] font-light" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Username & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-200">
                    Username <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative group flex">
                      <div className="w-12 flex items-center justify-center bg-[#0066FF] rounded-l-lg border border-foreground">
                        <span className="text-white font-medium text-lg">@</span>
                      </div>
                      <Input
                        placeholder="johndoe"
                        className={`pl-4 bg-transparent border-foreground rounded-l-none h-12 flex-1 text-[14px] font-light ${usernameAvailable === true ? "border-green-500 focus-visible:ring-green-500" :
                          usernameAvailable === false ? "border-red-500 focus-visible:ring-red-500" : ""
                          }`}
                        {...field}
                        onChange={handleUsernameChange}
                      />
                      <div className="absolute right-3 top-3.5 flex items-center pointer-events-none">
                        {isCheckingUsername ? (
                          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                        ) : usernameAvailable === true ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : usernameAvailable === false ? (
                          <XIcon className="w-5 h-5 text-red-500" />
                        ) : (
                          <UserCheck className="w-5 h-5 text-muted-foreground opacity-50" />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage>
                    {usernameAvailable === false && (
                      <span className="text-red-500 flex items-center gap-1 mt-1 text-xs">
                        <AlertCircle className="w-3 h-3" /> Username is taken
                      </span>
                    )}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-medium text-gray-200">
                    Location <span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover open={locationOpen} onOpenChange={setLocationOpen} modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full h-12 justify-between bg-transparent border-foreground text-[14px] font-light hover:bg-transparent hover:text-white",
                            !field.value && "text-muted-foreground"
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

          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-200">Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a short bio"
                    className="min-h-[100px] bg-transparent border-foreground resize-none rounded-lg text-[14px] font-light"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Skills */}
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-200">
                  Your Skills <span className="text-red-500">*</span>
                </FormLabel>
                <p className="text-xs text-muted-foreground mb-2">Get notified of new listings based on your skills</p>
                <FormControl>
                  <div className="space-y-3">
                    <Input
                      placeholder="Type a skill and press Enter"
                      className="bg-transparent border-foreground h-12 text-[14px] font-light"
                      onKeyDown={handleSkillInputKeyDown}
                    />

                    {/* Selected Skills */}
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((skill) => (
                        <Badge key={skill} variant="secondary" className="py-1 px-2 font-normal text-[13px] font-inter gap-2 rounded-md bg-primary/20 text-primary hover:bg-primary/30 flex items-center transition-colors">
                          {skill}
                          <button
                            type="button"
                            className="hover:text-red-500 focus:outline-none"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveSkill(skill);
                            }}
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    {/* Suggestions */}
                    <div className="flex flex-wrap gap-3">
                      {suggestedSkills
                        .filter(skill => !field.value.includes(skill))
                        .map(skill => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="bg-transparent border-foreground hover:bg-white/5 cursor-pointer py-1 px-2 font-normal text-[13px] font-inter gap-2 rounded-md transition-colors"
                            onClick={() => handleAddSkill(skill)}
                          >
                            {skill} <span className="text-muted-foreground">+</span>
                          </Badge>
                        ))}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Socials */}
          <div className="space-y-6 pt-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">Socials</h3>
              <p className="text-xs text-muted-foreground">Fill at least one, but more the merrier</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {socialConfigs.map((social) => (
                <FormField
                  key={social.name}
                  control={form.control}
                  name={social.name as keyof ProfileValues}
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-xs font-medium text-muted-foreground">
                        {social.label} {social.label.includes("Twitter") && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <div className="relative group flex">
                          <div className="w-12 flex items-center justify-center bg-primary rounded-l-lg border border-foreground">
                            <social.icon className="w-5 h-5 text-white" />
                          </div>
                          <Input
                            placeholder={social.placeholder}
                            className="pl-4 font-inter font-light text-[14px] bg-transparent border-foreground border-l-0 rounded-l-none h-12 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-foreground"
                            {...field}
                            value={field.value?.toString() || ""}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 text-xs" />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="pt-6">
            <Button type="submit" variant={'stallion'} className="w-full h-[43px] font-medium text-[16px] leading-[24px] rounded-[10px]">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
