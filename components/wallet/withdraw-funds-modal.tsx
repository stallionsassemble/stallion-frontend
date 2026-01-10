import { MfaRequiredDialog } from "@/components/common/mfa-required-dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetSupportedCurrencies } from "@/lib/api/bounties/queries";
import { useGetPayoutMethods, useWithdrawFunds } from "@/lib/api/wallet/queries";
import { useAuth } from "@/lib/store/use-auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const withdrawSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().min(1, "Currency is required"),
  methodId: z.string().optional(),
  address: z.string().optional(),
  totpCode: z.string().min(6, "2FA code must be at least 6 digits"),
}).superRefine((data, ctx) => {
  if (!data.methodId && !data.address) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select a withdrawal method or enter an address",
      path: ["methodId"],
    });
  }
});

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance?: number;
  currency?: string;
  balances?: any; // Pass full balances if available to show max amount?
}

export function WithdrawFundsModal({ isOpen, onClose, availableBalance = 0, currency = "USDC", balances }: WithdrawFundsModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [withdrawnAmount, setWithdrawnAmount] = useState<string>("0");
  const [withdrawType, setWithdrawType] = useState<"method" | "address">("address"); // Default to address as per screenshot implied priority? Or method? Screenshot shows address. Tab state.

  const { user } = useAuth();
  const { data: payoutMethods = [], isLoading: isLoadingMethods } = useGetPayoutMethods();
  const { data: currencies = [], isLoading: isLoadingCurrencies } = useGetSupportedCurrencies();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawFunds();

  const form = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: "",
      currency: currency, // Pre-fill if passed, but mutable
      methodId: "",
      address: "",
      totpCode: "",
    },
  });

  const selectedCurrency = form.watch("currency");
  const displayBalance = balances?.balances?.find((b: any) => b.currency === selectedCurrency)?.availableBalance ?? 0;

  useEffect(() => {
    if (isOpen) {
      // logic to set default currency if needed
      if (!form.getValues("currency") && balances?.balances?.length > 0) {
        form.setValue("currency", balances.balances[0].currency);
      }
    }
  }, [isOpen, balances, form]);

  const onSubmit = (values: z.infer<typeof withdrawSchema>) => {
    // Determine payload based on active tab/filled data
    // If withdrawType is 'address', ignore methodId. And vice versa.
    const payload: any = {
      amount: Number(values.amount),
      currency: values.currency,
      totpCode: values.totpCode,
    };

    if (withdrawType === "method") {
      if (!values.methodId) {
        form.setError("methodId", { message: "Please select a method" });
        return;
      }
      payload.payoutMethodId = values.methodId;
    } else {
      if (!values.address) {
        form.setError("address", { message: "Please enter an address" });
        return;
      }
      payload.address = values.address;
    }

    withdraw(payload, {
      onSuccess: () => {
        setWithdrawnAmount(values.amount);
        setStep("success");
      }
    });
  };

  const handleClose = () => {
    setStep("form");
    form.reset();
    onClose();
  };

  if (isOpen && user && !user.mfaEnabled) {
    return (
      <MfaRequiredDialog
        open={isOpen}
        onOpenChange={(open) => !open && onClose()}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "bg-background p-0 gap-0 border-none sm:max-w-[500px]",
        step === "success" && "flex flex-col sm:h-[500px]"
      )}>
        <DialogHeader className="p-4 sm:p-6 flex flex-row items-center justify-between w-full shrink-0">
          <div>
            <DialogTitle className="text-[24px] sm:text-[32px] font-inter font-bold text-foreground tracking-[4%]">Withdraw Funds</DialogTitle>
            <p className="text-muted-foreground font-inter font-medium text-[12px] mt-1">Transfer funds to your preferred destination</p>
          </div>
        </DialogHeader>

        {step === "form" ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 sm:space-y-6 pt-0">

              {/* Currency & Amount Row? Or stacked. Stacked is better for mobile */}
              <div className="grid grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-bold text-sm">Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background border border-border">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((c: any) => (
                            <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-bold text-sm">Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="0.00"
                            type="number"
                            className="h-12 pl-8 bg-background border border-border"
                            {...field}
                          />
                          <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <div className="flex justify-end mt-1.5">
                        <span className="text-muted-foreground font-inter text-[10px] sm:text-xs font-medium">
                          Available: <span className="text-foreground font-bold">
                            {new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(displayBalance)} {selectedCurrency || 'USD'}
                          </span>
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tabs for Method */}
              <Tabs value={withdrawType} onValueChange={(v) => setWithdrawType(v as "method" | "address")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted-foreground/20 h-11 p-1 rounded-lg">
                  <TabsTrigger
                    value="address"
                    className="text-xs font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                  >
                    Direct Address
                  </TabsTrigger>
                  <TabsTrigger
                    value="method"
                    className="text-xs font-medium rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
                  >
                    Saved Method
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="address" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-bold text-sm">Wallet Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="G..."
                            {...field}
                            className="bg-background border border-border h-12 font-mono text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="method" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="methodId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-12 bg-background border border-border">
                              <SelectValue placeholder="Select saved method" />
                            </SelectTrigger>
                            <SelectContent>
                              {payoutMethods.map((m: any) => (
                                <SelectItem key={m.id} value={m.id}>{m.name} ({m.publicKey.slice(0, 4)}...)</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-[10px] text-muted-foreground text-center">
                    Manage payout methods in the Payouts tab.
                  </div>
                </TabsContent>
              </Tabs>

              {/* 2FA Code */}
              <FormField
                control={form.control}
                name="totpCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-bold text-sm">2FA Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit code"
                        {...field}
                        className="bg-background border border-border h-12 tracking-widest text-center text-lg font-mono placeholder:tracking-normal placeholder:font-sans placeholder:text-base placeholder:text-left sm:placeholder:text-center"
                        maxLength={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isWithdrawing}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg font-inter mt-2"
              >
                {isWithdrawing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Withdraw Funds
              </Button>

            </form>
          </Form>
        ) : (
          // Success View
          <div className="flex-1 flex flex-col bg-background items-center justify-center w-full relative p-6 text-center">
            <h2 className="text-[30px] font-syne font-extrabold text-foreground leading-tight mb-6">
              Withdrawal<br />Successful
            </h2>
            <div className="rounded-full bg-primary/10 p-6 mb-6">
              <span className="text-3xl font-bold text-primary">${withdrawnAmount}</span>
            </div>
            <p className="text-muted-foreground text-sm mb-8">
              Your transaction has been processed successfully.
            </p>
            <Button onClick={handleClose} className="w-full h-12 font-bold">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
