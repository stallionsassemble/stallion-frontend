import { useAuth } from "@/lib/store/use-auth";
import {
  Briefcase,
  LayoutDashboard,
  Settings,
  Trophy,
  User,
  Wallet
} from "lucide-react";
import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchPalette({ open, onOpenChange }: SearchPaletteProps) {
  const router = useRouter();
  const { user } = useAuth();

  const isOwner = user?.role === 'PROJECT_OWNER';

  const runCommand = React.useCallback((command: () => unknown) => {
    onOpenChange(false);
    command();
  }, [onOpenChange]);

  // Base paths
  const dashboardPath = isOwner ? '/dashboard/owner' : '/dashboard';
  const bountiesPath = isOwner ? '/dashboard/owner/bounties' : '/dashboard/bounties';
  const projectsPath = isOwner ? '/dashboard/owner/projects' : '/dashboard/projects';
  const profilePath = isOwner ? '/dashboard/owner/profile' : '/dashboard/profile';
  const walletPath = isOwner ? '/dashboard/owner/wallet' : '/dashboard/wallet';
  const settingsPath = isOwner ? '/dashboard/owner/settings' : '/dashboard/settings';

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="dashboard" onSelect={() => runCommand(() => router.push(dashboardPath))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem value="bounties" onSelect={() => runCommand(() => router.push(bountiesPath))}>
            <Trophy className="mr-2 h-4 w-4" />
            <span>{isOwner ? 'Manage Bounties' : 'Browse Bounties'}</span>
          </CommandItem>
          <CommandItem value="projects" onSelect={() => runCommand(() => router.push(projectsPath))}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>{isOwner ? 'Manage Projects' : 'Browse Projects'}</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="My Account">
          <CommandItem value="profile" onSelect={() => runCommand(() => router.push(profilePath))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem value="wallet" onSelect={() => runCommand(() => router.push(walletPath))}>
            <Wallet className="mr-2 h-4 w-4" />
            <span>Wallet</span>
            <CommandShortcut>⌘W</CommandShortcut>
          </CommandItem>
          <CommandItem value="settings" onSelect={() => runCommand(() => router.push(settingsPath))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
