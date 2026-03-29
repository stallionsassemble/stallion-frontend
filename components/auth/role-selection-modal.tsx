'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Briefcase, User } from 'lucide-react'
import { useState } from 'react'

interface RoleSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (role: 'CONTRIBUTOR' | 'PROJECT_OWNER') => void
  isLoading?: boolean
}

export function RoleSelectionModal({
  open,
  onOpenChange,
  onSelect,
  isLoading = false,
}: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<'CONTRIBUTOR' | 'PROJECT_OWNER' | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#090715] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Choose your role</DialogTitle>
          <DialogDescription className="text-gray-400">
            It looks like this is your first time signing in with this account. Please select how you want to use Stallion.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          <button
            onClick={() => setSelectedRole('CONTRIBUTOR')}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
              selectedRole === 'CONTRIBUTOR'
                ? 'bg-blue/10 border-blue'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className={`p-2 rounded-lg ${selectedRole === 'CONTRIBUTOR' ? 'bg-blue text-white' : 'bg-white/10 text-gray-400'}`}>
              <User className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Contributor</div>
              <div className="text-sm text-gray-400">Find bounties, complete tasks, and earn on-chain rewards.</div>
            </div>
          </button>

          <button
            onClick={() => setSelectedRole('PROJECT_OWNER')}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
              selectedRole === 'PROJECT_OWNER'
                ? 'bg-blue/10 border-blue'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className={`p-2 rounded-lg ${selectedRole === 'PROJECT_OWNER' ? 'bg-blue text-white' : 'bg-white/10 text-gray-400'}`}>
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Project Owner</div>
              <div className="text-sm text-gray-400">Post bounties, manage projects, and hire top Stellar talent.</div>
            </div>
          </button>
        </div>

        <div className="flex gap-3 justify-end mt-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => selectedRole && onSelect(selectedRole)}
            disabled={!selectedRole || isLoading}
            className="bg-blue hover:bg-blue/90 text-white min-w-[100px]"
          >
            {isLoading ? 'Setting up...' : 'Confirm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
