'use client'

import { useAuth } from '@/lib/store/use-auth';
import { cn } from '@/lib/utils';

interface WelcomeBannerProps {
  description?: string;
  className?: string;
}

export function WelcomeBanner({ description, className }: WelcomeBannerProps) {
  const { user } = useAuth()

  const defaultDescription = "Ready to build something amazing today?"

  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-primary p-6 md:p-10 text-primary-foreground', className)}>
      {/* Grid Pattern Overlay */}
      <div
        className='absolute inset-0 z-0 opacity-20'
        style={{
          backgroundImage:
            'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      ></div>

      <div className='relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6'>
        <div className='h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-primary-foreground/20'>
          <img
            src={user?.profilePicture || `https://avatar.vercel.sh/${user?.firstName || 'User'}`}
            width={80}
            height={80}
            alt={`${user?.firstName || 'User'}`}
            className='h-full w-full object-cover'
          />
        </div>
        <div className='text-center md:text-left'>
          <h1 className='text-3xl font-bold mb-2'>Welcome back, {user?.firstName ? user.firstName : 'there'}!</h1>
          <p className='text-primary-foreground/90 text-sm md:text-base font-medium'>
            {description || defaultDescription}
          </p>
        </div>
      </div>
    </div>
  )
}
