import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/lib/types";

interface EditProfileDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ user, open, onOpenChange }: EditProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-background border-white/10 text-white p-6">
        <DialogHeader className="pb-4">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription className="text-gray-400">
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ProfileSettingsForm onAfterSave={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
