"use client"

import { useAuth } from "@/lib/store/use-auth"
import { Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useSyncExternalStore } from "react"

// Returns false on the server (pre-hydration) and true on the client.
// useSyncExternalStore is the recommended React API for this pattern —
// it avoids calling setState inside an effect body, which causes cascading renders.
function useIsHydrated() {
  return useSyncExternalStore(
    () => () => {}, // no-op subscribe — state never changes after initial render
    () => true,     // client snapshot: we are hydrated
    () => false,    // server snapshot: not yet hydrated
  )
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const hydrated = useIsHydrated()

  // Refresh user data on mount/hydration
  useEffect(() => {
    if (hydrated) {
      checkAuth()
    }
  }, [hydrated, checkAuth])

  useEffect(() => {
    if (hydrated && !isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login")
      } else if (user && !user.profileCompleted) {
        const path = pathname;
        const isOwnerOnboarding = path.includes("/auth/onboarding/owner");
        const isTalentOnboarding = path.includes("/auth/onboarding/talent");

        // Only redirect if NOT already on an onboarding page
        if (!isOwnerOnboarding && !isTalentOnboarding) {
          if (user.role === 'PROJECT_OWNER' || user.role === 'OWNER') {
            router.push("/auth/onboarding/owner")
          } else {
            router.push("/auth/onboarding/talent")
          }
        }
      } else if (user && user.profileCompleted) {
        // Role-based route protection
        if (pathname.startsWith('/dashboard/admin') && user.role !== 'ADMIN') {
          router.replace(user.role === 'PROJECT_OWNER' || user.role === 'OWNER' ? '/dashboard/owner' : '/dashboard');
        } else if ((user.role === 'PROJECT_OWNER' || user.role === 'OWNER') && pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/owner') && !pathname.startsWith('/dashboard/admin')) {
          router.replace('/dashboard/owner');
        } else if (user.role !== 'PROJECT_OWNER' && user.role !== 'OWNER' && pathname.startsWith('/dashboard/owner')) {
          router.replace('/dashboard');
        }
      }
    }
  }, [hydrated, isLoading, isAuthenticated, user, router, pathname])

  // Show nothing or a loader while hydrating or checking auth
  if (!hydrated || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If hydrated and not authenticated (and not loading), we are redirecting, so return null
  if (!isAuthenticated) return null

  // Prevent rendering while redirecting based on role/profile status
  if (user && !user.profileCompleted) {
    const isOwnerOnboarding = pathname.includes("/auth/onboarding/owner")
    const isTalentOnboarding = pathname.includes("/auth/onboarding/talent")
    if (!isOwnerOnboarding && !isTalentOnboarding) {
      return null
    }
  }

  if (user && user.profileCompleted) {
    if (pathname.startsWith('/dashboard/admin') && user.role !== 'ADMIN') {
      return null
    }
    if ((user.role === 'PROJECT_OWNER' || user.role === 'OWNER') && pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/owner') && !pathname.startsWith('/dashboard/admin')) {
      return null
    }
    if (user.role !== 'PROJECT_OWNER' && user.role !== 'OWNER' && pathname.startsWith('/dashboard/owner')) {
      return null
    }
  }

  return <>{children}</>
}
