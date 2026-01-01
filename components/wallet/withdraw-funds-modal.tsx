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
import { useGetPayoutMethods, useWithdrawFunds } from "@/lib/api/wallet/queries";
import { useAuth } from "@/lib/store/use-auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Loader2, Send, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const withdrawSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  methodId: z.string().min(1, "Please select a payment method"),
});

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance?: number;
  currency?: string;
}

export function WithdrawFundsModal({ isOpen, onClose, availableBalance = 0, currency = "USDC" }: WithdrawFundsModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [withdrawnAmount, setWithdrawnAmount] = useState<string>("0");
  const { user } = useAuth();

  const { data: payoutMethods = [], isLoading: isLoadingMethods } = useGetPayoutMethods();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawFunds();

  const form = useForm<z.infer<typeof withdrawSchema>>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: "",
      methodId: "",
    },
  });

  useEffect(() => {
    if (payoutMethods.length > 0 && !form.getValues("methodId")) {
      const defaultMethod = payoutMethods.find((m: any) => m.isDefault);
      if (defaultMethod) {
        form.setValue("methodId", defaultMethod.id);
      }
    }
  }, [payoutMethods, form]);

  if (isOpen && user && !user.mfaEnabled) {
    return (
      <MfaRequiredDialog
        open={isOpen}
        onOpenChange={(open) => !open && onClose()}
      />
    );
  }

  function onSubmit(values: z.infer<typeof withdrawSchema>) {
    withdraw({
      amount: Number(values.amount),
      currency: currency,
      payoutMethodId: values.methodId
    }, {
      onSuccess: () => {
        setWithdrawnAmount(values.amount);
        setStep("success");
      }
    });
  }

  const handleClose = () => {
    setStep("form");
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "bg-background p-0 gap-0 border-none",
        step === "success" && "flex flex-col sm:h-[500px]" // Fixed height only on desktop
      )}>
        {/* Header is always visible based on design */}
        <DialogHeader className="p-4 sm:p-6 flex flex-row items-center justify-between w-full shrink-0">
          <div>
            <DialogTitle className="text-[24px] sm:text-[32px] font-inter font-bold text-foreground tracking-[4%]">Withdraw Funds</DialogTitle>
            <p className="text-muted-foreground font-inter font-medium text-[12px] mt-1">Transfer funds to your preferred payout method</p>
          </div>
        </DialogHeader>

        {step === "form" ? (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 sm:space-y-6">

                {/* Amount Input */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <FormLabel className="text-foreground font-bold text-base">Amount USD<span className="text-destructive">*</span></FormLabel>
                        <span className="text-muted-foreground font-inter text-[14px] font-medium">Available: <span className="text-foreground font-bold">${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></span>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                            <DollarSign className="bg-secondary px-2 py-1 rounded-full text-secondary-foreground" />
                          </div>
                          <Input
                            placeholder="0.00"
                            type="number"
                            className="bg-background border border-border h-12 pl-10 text-foreground placeholder:text-muted-foreground rounded-lg focus-visible:ring-primary font-inter font-medium text-base"
                            {...field}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {/* Chevrons usually for number inputs but standard input handles it. Custom styling requested? 
                                 The screenshot shows simple up/down arrows or just placeholder. 
                                 I'll skip specific custom spinners for now unless requested.
                             */}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="methodId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormMessage />
                      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                        {isLoadingMethods ? (
                          <div className="flex flex-col gap-2">
                            <div className="h-16 w-full bg-muted animate-pulse rounded-xl" />
                            <div className="h-16 w-full bg-muted animate-pulse rounded-xl" />
                          </div>
                        ) : payoutMethods.length === 0 ? (
                          <div className="text-center p-4 border border-dashed rounded-xl text-muted-foreground text-sm">
                            No payout methods found. Add one in the Payout tab.
                          </div>
                        ) : (
                          payoutMethods.map((method) => {
                            const isSelected = field.value === method.id;
                            return (
                              <div
                                key={method.id}
                                onClick={() => field.onChange(method.id)}
                                className={cn(
                                  "flex items-center justify-between p-3 sm:p-4 rounded-xl cursor-pointer transition-all",
                                  isSelected
                                    ? "bg-primary/10 border border-primary"
                                    : "bg-primary/5"
                                )}
                              >
                                <div className="flex items-center gap-4 min-w-0">
                                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                                    <Wallet className="w-5 h-5 text-primary" />
                                  </div>
                                  <div className="text-left overflow-hidden min-w-0">
                                    <h4 className="text-foreground font-bold font-inter text-base truncate">{method.name}</h4>
                                    <p className="text-sm font-inter text-muted-foreground truncate max-w-[150px] sm:max-w-xs">{method.publicKey}</p>
                                  </div>
                                </div>
                                <div className={cn(
                                  "w-5 h-5 rounded-full border-4 flex items-center justify-center bg-background shrink-0",
                                  isSelected ? "border-foreground bg-transparent" : "border-muted-foreground bg-background"
                                )}>
                                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                </div>
                              </div>
                            );
                          }))}
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isWithdrawing || payoutMethods.length === 0}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold text-medium rounded-lg mt-4 gap-2 font-inter"
                >
                  {isWithdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Withdraw</span>
                </Button>
              </form>
            </Form>
          </>
        ) : (
          // SUCCESS STATE
          <div className="flex-1 flex flex-col bg-background items-center justify-center w-full relative p-4 sm:p-0">
            {/* Close button is handled by Dialog */}

            <div className="text-center">
              {/* Custom styling for "Withdrawal Successful" - matches font-space-grotesk usage */}
              <h2 className="text-[30px] font-syne font-extrabold text-foreground tracking-[-0.73px] leading-tight">
                Withdrawal
              </h2>
              <h2 className="text-[30px] -mt-2 font-syne font-extrabold text-foreground tracking-[-0.73px] leading-tight">
                Successful
              </h2>
            </div>

            <div className="relative mb-6 w-full flex justify-center mt-2">
              {/* Blue Pill for Amount */}
              <div className="rounded-[1666px] bg-primary shadow-[0_0_30px_rgba(var(--primary),0.4)] relative z-10 flex items-center justify-center mx-auto w-full max-w-[333px] h-[72px] px-4 md:px-9">
                <span className="text-[32px] sm:text-[36px] font-extrabold font-syne text-primary-foreground tracking-widest block text-center leading-none">
                  ${parseFloat(withdrawnAmount).toLocaleString('en-US')}
                </span>
              </div>
              {/* Glow effect behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[60px] bg-primary blur-[20px] rounded-full -z-10" />
            </div>

            <p className="text-muted-foreground text-center font-light font-inter text-[12px] max-w-[280px] mx-auto leading-relaxed -mt-6">
              Your funds have been transferred. Check your wallet for confirmation.
            </p>

            <div className="w-full max-w-[320px] mt-8 flex justify-center mx-auto">
              <Button
                onClick={handleClose}
                className="w-[278px] h-[54px] bg-primary hover:bg-primary/90 text-primary-foreground font-medium font-inter text-base rounded-lg"
              >
                Browse Bounties
              </Button>
            </div>

          </div>
        )}
      </DialogContent>
    </Dialog >
  );
}
