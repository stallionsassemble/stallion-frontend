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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useCreatePayoutMethod } from "@/lib/api/wallet/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  walletName: z.string().min(1, "Wallet name is required"),
  walletAddress: z.string().min(1, "Wallet address is required"),
  isDefault: z.boolean(),
});

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPaymentMethodModal({ isOpen, onClose }: AddPaymentMethodModalProps) {
  const { mutate: createMethod, isPending } = useCreatePayoutMethod();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletName: "",
      walletAddress: "",
      isDefault: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMethod({
      name: values.walletName,
      publicKey: values.walletAddress,
      isDefault: values.isDefault,
    }, {
      onSuccess: () => {
        form.reset();
        onClose();
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-popover border-border sm:max-w-xl p-0 gap-0" >
        <DialogHeader className="p-4 sm:p-6 border-b border-border flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-[24px] sm:text-[32px] font-inter font-bold text-foreground tracking-tight">Add Payout Method</DialogTitle>
            <p className="text-muted-foreground font-inter font-medium text-[12px] mt-1">Add a new bank account or crypto wallet for withdrawals</p>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 sm:space-y-6 font-inter text-foreground font-medium text-[16px]">
            {/* Wallet Name */}
            <FormField
              control={form.control}
              name="walletName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Wallet Name"
                      className="bg-background border-input h-12 text-foreground placeholder:text-muted-foreground "
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
                  <FormLabel>Wallet Address <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Wallet Address"
                      className="bg-background border-input h-12 text-foreground placeholder:text-muted-foreground "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Default Switch */}
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Set as Default</FormLabel>
                    <FormDescription>
                      Use this method automatically for future withdrawals.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm rounded-lg mt-2 font-inter"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>+</span>}
              <span className="ml-2">Add Payout Method</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
