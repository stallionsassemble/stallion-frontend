"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  walletName: z.string().optional(),
  walletAddress: z.string().min(1, "Wallet address is required"),
  network: z.string().min(1, { message: "Please select a network" }),
});

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPaymentMethodModal({ isOpen, onClose }: AddPaymentMethodModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletName: "",
      walletAddress: "",
      // network is undefined by default to show placeholder
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real app, you would make an API call here.
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#02010A] border-white/10 sm:max-w-xl p-0 gap-0" >
        <DialogHeader className="p-6 border-b border-primary/23 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-[32px] font-inter font-bold text-white tracking-tight">Add Payment Method</DialogTitle>
            <p className="text-white/90 font-inter font-medium text-[12px] mt-1">Add a new bank account or crypto wallet for withdrawals</p>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6 font-inter text-white font-medium text-[16px]">
            {/* Wallet Name */}
            <FormField
              control={form.control}
              name="walletName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Name (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Wallet Name"
                      className="bg-background border-[1.19px] border-white/90 h-12 text-white placeholder:text-muted-foreground "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Wallet Address */}
            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Wallet Address"
                      className="bg-background border-[1.19px] border-white/90 h-12 text-white placeholder:text-muted-foreground "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Network */}
            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-background border-white/90 h-12 text-gray-500">
                        <SelectValue placeholder="Select Network" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border-white/10 text-white">
                      <SelectItem value="ethereum">Ethereum (ERC20)</SelectItem>
                      <SelectItem value="solana">Solana (SPL)</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="stellar">Stellar</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[12px] font-medium font-inter text-muted-foreground">Enter your EVM-compatible wallet address (XLM, Polygon, etc.)</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Add Method Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-[#0066CC] text-white font-medium text-sm rounded-lg mt-2"
            >
              <span>+</span> Add Method
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
