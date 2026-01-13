import { useAuth } from '@/lib/store/use-auth'
import { User } from '@/lib/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userService } from './index'

export function useGetUser(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(id),
    enabled: !!id && enabled,
  })
}

export function useGetUserByUsername(username: string) {
  return useQuery({
    queryKey: ['user', 'username', username],
    queryFn: () => userService.getUserByUsername(username),
    enabled: !!username,
  })
}

export function useUpdateContributorProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<User>) =>
      userService.updateContributorProfile(data),
    onSuccess: async () => {
      toast.success('Profile updated successfully')
      // Invalidate user queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      await queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
      // Sync with auth store
      await useAuth.getState().checkAuth()
    },
    onError: (error: any) => {
      console.error('Failed to update profile:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    },
  })
}

export function useUpdateOwnerProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<User>) => userService.updateOwnerProfile(data),
    onSuccess: async () => {
      toast.success('Profile updated successfully')
      // Invalidate user queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      await queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
      // Sync with auth store
      await useAuth.getState().checkAuth()
    },
    onError: (error: any) => {
      console.error('Failed to update profile:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    },
  })
}

export function useGetUserSubmissions() {
  return useQuery({
    queryKey: ['user-submissions'],
    queryFn: () => userService.getUserSubmissions(),
  })
}
