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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { profileSchema, ProfileValues } from "@/lib/schemas/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Gamepad2,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Upload,
  UserCheck,
  X as XIcon,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const socialConfigs = [
  { name: "twitter", label: "X(Formerly Twitter)", icon: Twitter, placeholder: "Enter your X Username" },
  { name: "website", label: "Website", icon: Globe, placeholder: "Enter your website URL" },
  { name: "github", label: "Github", icon: Github, placeholder: "Enter your Github Username" },
  { name: "discord", label: "Discord", icon: Gamepad2, placeholder: "Enter your Discord Username" },
  { name: "linkedin", label: "Linkedin", icon: Linkedin, placeholder: "Enter your Linkedin Username" },
  { name: "instagram", label: "Instagram", icon: Instagram, placeholder: "Enter your Instagram Username" },
] as const;

const suggestedSkills = ["Frontend", "Backend", "UI/UX Design", "Writing", "Digital Marketing"];

export function ProfileSettingsForm() {
  const [avatarPreview, setAvatarPreview] = useState<string>("https://avatar.vercel.sh/johndoe");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const onSubmit = (data: ProfileValues) => {
    console.log("Form Submitted:", data);
    // In a real app, you'd upload the image file here if changed
    toast.success("Profile updated successfully!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      // You would also typically set a form field for the file here if handling file upload directly in form data
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
                    <Input placeholder="John" className="bg-transparent border-foreground h-12" {...field} />
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
                    <Input placeholder="Doe" className="bg-transparent border-foreground h-12" {...field} />
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
                      <Input placeholder="johndoe" className="pl-4 bg-transparent border-foreground rounded-l-none h-12 flex-1" {...field} />
                      <UserCheck className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-200">
                    Location <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-transparent border-foreground h-12">
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="nigeria">Nigeria</SelectItem>
                      <SelectItem value="ghana">Ghana</SelectItem>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                    </SelectContent>
                  </Select>
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
                    className="min-h-[100px] bg-transparent border-foreground resize-none rounded-lg"
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
                      className="bg-transparent border-foreground h-12"
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
                            className="pl-3 font-inter font-normal text-[16px] bg-transparent border-foreground rounded-l-none h-12 flex-1"
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
