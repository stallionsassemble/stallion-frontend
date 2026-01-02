"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateThread, useGetCategories } from "@/lib/api/forum/queries";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MarkdownEditor } from "../shared/markdown-editor";

const createThreadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  tags: z.string().optional(), // Comma separated string for input
});

type CreateThreadFormValues = z.infer<typeof createThreadSchema>;

interface CreateThreadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateThreadDialog({ open, onOpenChange }: CreateThreadDialogProps) {
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategories();
  const { mutate: createThread, isPending } = useCreateThread();
  const [openCombobox, setOpenCombobox] = useState(false);

  const form = useForm<CreateThreadFormValues>({
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      content: "",
      tags: "",
    },
  });

  const onSubmit = (values: CreateThreadFormValues) => {
    // Generate slug from title
    const slug = values.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

    const tagsArray = values.tags
      ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    createThread(
      {
        title: values.title,
        slug,
        categoryId: values.categoryId,
        content: values.content,
        tags: tagsArray,
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
          toast.success("Discussion created successfully");
        },
      }
    );
  };

  // Reset form when dialog closes/opens
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts, ask questions, or propose ideas to the community.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What's on your mind?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox} modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={isCategoriesLoading}
                            className={cn(
                              "w-full justify-between pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? categories.find(
                                (category) => category.id === field.value
                              )?.name
                              : isCategoriesLoading ? "Loading categories..." : "Select category"}
                            {isCategoriesLoading ? (
                              <Loader2 className="ml-2 h-4 w-4 animate-spin shrink-0 opacity-50" />
                            ) : (
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[250px] p-0 z-[200]" align="start">
                        <Command>
                          <CommandInput placeholder="Search category..." />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  value={category.name}
                                  key={category.id}
                                  onSelect={() => {
                                    form.setValue("categoryId", category.id, {
                                      shouldValidate: true,
                                    });
                                    setOpenCombobox(false);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      category.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {category.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="security, defi, tutorial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <MarkdownEditor
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      className="w-full"
                      minHeight="min-h-[200px]"
                      placeholder="Write your discussion content here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" variant="stallion" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Discussion
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
