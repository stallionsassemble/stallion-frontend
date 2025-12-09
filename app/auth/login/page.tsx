"use client";

import { AuthRightSection } from "@/components/auth/auth-right-section";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
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
import { loginSchema, LoginValues } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: LoginValues) {
    console.log(data);
    // Add login logic here
  }

  return (
    <AuthSplitLayout rightContent={<AuthRightSection variant="bounties" />}>
      <div className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight text-white lg:text-4xl">
          Sign In
        </h1>
        <p className="text-muted-foreground">Enter your details to access your account</p>
      </div>

      <div className="space-y-6 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-12 w-full rounded-full bg-white text-black hover:bg-gray-200 gap-2 border-none">
            {/* Apple Icon */}
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.403-2.363-2.006-.117-3.694 1.079-4.597 1.079zm-2.948-4.3s1.532.13 2.506 1.35c.818 1.026 1.117 2.494.948 3.598-1.545.104-3.116-.948-3.935-2.065-.896-1.208-1.078-2.61-1.078-2.61.948-.156 1.558-.273 1.558-.273z" />
            </svg>
            Continue with Apple
          </Button>
          <Button variant="outline" className="h-12 w-full rounded-full bg-white text-black hover:bg-gray-200 gap-2 border-none">
            {/* Google Icon */}
            <svg className="h-5 w-5" viewBox="0 0 488 512" fill="currentColor">
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Continue with Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-[#090715] px-4 text-gray-500">OR CONTINUE WITH</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="h-12 w-full rounded-lg bg-blue text-white hover:bg-[#0066CC]">
              Continue with Email
            </Button>
          </form>
        </Form>
      </div>

      <div className="text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-white hover:underline">
          Sign up now
        </Link>
      </div>
    </AuthSplitLayout>
  );
}
