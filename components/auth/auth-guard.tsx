"use client"

import { useAuth } from "@/lib/store/use-auth"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuth()
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Wait for Zustand persist to hydrate state from localStorage
    setHydrated(true)
  }, [])

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
        // Redirect to appropriate onboarding based on role
        if (user.role === 'OWNER') { // "PROJECT_OWNER" is usually mapped to "OWNER" in frontend types, checking definition
          router.push("/auth/onboarding/owner")
        } else {
          router.push("/auth/onboarding/talent")
        }
      }
    }
  }, [hydrated, isLoading, isAuthenticated, user, router])

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

  return <>{children}</>
}
