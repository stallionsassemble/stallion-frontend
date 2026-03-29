'use client'

import { AlertTriangle, Ban, LifeBuoy, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/store/use-auth'

interface AccountRestrictedProps {
  status: 'SUSPENDED' | 'BANNED'
}

export function AccountRestricted({ status }: AccountRestrictedProps) {
  const { logout } = useAuth()

  const isBanned = status === 'BANNED'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#090715] p-4 text-white">
      <div className="relative max-w-md w-full bg-card border border-white/10 rounded-2xl p-8 text-center space-y-6 overflow-hidden">
        {/* Background Glow */}
        <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[100px] opacity-20 ${isBanned ? 'bg-red-500' : 'bg-amber-500'}`} />
        
        <div className="relative flex justify-center">
          <div className={`p-4 rounded-2xl ${isBanned ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
            {isBanned ? <Ban className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {isBanned ? 'Account Permanently Banned' : 'Account Temporarily Suspended'}
          </h1>
          <p className="text-gray-400">
            {isBanned 
              ? 'Your account has been permanently disabled for violating our terms of service. You no longer have access to Stallion features.'
              : 'Your account has been temporarily restricted. This typically happens during security reviews or policy violations.'
            }
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Button 
            variant="outline" 
            className="w-full gap-2 border-white/10 hover:bg-white/5"
            asChild
          >
            <a href="mailto:support@stallion.so">
              <LifeBuoy className="w-4 h-4" />
              Contact Support
            </a>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full gap-2 text-gray-400 hover:text-white"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          Ref ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </p>
      </div>
    </div>
  )
}
