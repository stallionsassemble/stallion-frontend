'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, UserPlus } from 'lucide-react'
import { adminService } from '@/lib/api/admin'
import { toast } from 'sonner'

interface InviteUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  stepUpToken: string | null
}

export function InviteUserModal({
  open,
  onOpenChange,
  onSuccess,
  stepUpToken,
}: InviteUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    role: 'CONTRIBUTOR',
    firstName: '',
    lastName: '',
    username: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stepUpToken) {
      toast.error('Step-up verification required')
      return
    }

    if (!formData.email || !formData.role) {
      toast.error('Email and Role are required')
      return
    }

    setIsLoading(true)
    const toastId = toast.loading('Creating user...')

    try {
      await adminService.createUser(formData, stepUpToken)
      toast.success('User invited successfully', { id: toastId })
      onSuccess()
      onOpenChange(false)
      // Reset form
      setFormData({
        email: '',
        role: 'CONTRIBUTOR',
        firstName: '',
        lastName: '',
        username: '',
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to invite user', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#090715] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-5 w-5 text-primary" />
            Invite New User
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Send an invitation to a new user. They will receive an email to set up their account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                className="bg-white/5 border-white/10 text-white"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="bg-white/5 border-white/10 text-white"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="johndoe"
              className="bg-white/5 border-white/10 text-white"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              required
              className="bg-white/5 border-white/10 text-white"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Platform Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(val) => setFormData({ ...formData, role: val })}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-[#0D0B1F] border-white/10 text-white">
                <SelectItem value="CONTRIBUTOR">Contributor (Talent)</SelectItem>
                <SelectItem value="PROJECT_OWNER">Project Owner</SelectItem>
                <SelectItem value="ADMIN">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.email}
              className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Inviting...</>
              ) : (
                'Invite User'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
