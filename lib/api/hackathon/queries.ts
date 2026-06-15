import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { hackathonService } from './index'
import { Hackathon } from '@/lib/types/hackathon'
import { PagedResponse } from '@/lib/types'
import { useAuth } from '@/lib/store/use-auth'
import { useAdminStore } from '@/lib/store/use-admin-store'

export const useGetHackathons = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['hackathons', params],
    queryFn: async () => {
      const response = await hackathonService.getHackathons(params)
      return response as unknown as PagedResponse<Hackathon>
    },
  })
}

export const useGetMyHackathons = () => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['hackathons', 'my', user?.id],
    queryFn: async () => {
      // If the backend doesn't have a direct /me endpoint, we fetch all and filter or use companyId
      const response = await hackathonService.getHackathons({ limit: 100 })
      // Some endpoints might return data directly or wrapped in { data: ... }
      const rawData = (response as any).data || response
      const items = Array.isArray(rawData) ? rawData : []
      
      if (!user) return { data: [], total: 0 } as unknown as PagedResponse<Hackathon>
      
      const myHackathons = items.filter(h => {
        const isMatch = h.ownerId === user.id || 
          (h as any).createdBy === user.id || 
          (h as any).creatorId === user.id ||
          (h as any).companyId === user.id ||
          ((h as any).owner as any)?.id === user.id ||
          ((h as any).creator as any)?.id === user.id
          
        return isMatch
      })
      
      return {
        data: myHackathons,
        total: myHackathons.length
      } as unknown as PagedResponse<Hackathon>
    },
    enabled: !!user
  })
}

export const useGetHackathon = (identifier: string) => {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['hackathons', identifier, user?.id],
    queryFn: async () => {
      const response = await hackathonService.getHackathon(identifier)
      // Handle potential data wrapper
      const data = (response as any).data || response
      return data as unknown as Hackathon
    },
    enabled: !!identifier,
  })
}

export const useGetHackathonSubmissions = (hackathonId: string) => {
  return useQuery({
    queryKey: ['hackathons', hackathonId, 'submissions'],
    queryFn: async () => {
      const response = await hackathonService.getSubmissions(hackathonId)
      return (response as any).data || response
    },
    enabled: !!hackathonId,
  })
}

export const useGetHackathonWinners = (hackathonId: string) => {
  return useQuery({
    queryKey: ['hackathons', hackathonId, 'winners'],
    queryFn: async () => {
      const response = await hackathonService.getWinners(hackathonId)
      return (response as any).data || response
    },
    enabled: !!hackathonId,
  })
}

export const useParticipateHackathon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => hackathonService.participate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathons'] })
      toast.success('Successfully registered for hackathon!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '';
      if (message.toLowerCase().includes('already in a team') || message.toLowerCase().includes('already registered')) {
        queryClient.invalidateQueries({ queryKey: ['hackathons'] });
        toast.success('Successfully registered for hackathon!');
        return;
      }
      toast.error(message || 'Failed to register for hackathon')
    }
  })
}

export const useSubmitProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: any }) => 
      hackathonService.createSubmission(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['hackathons', id, 'submissions'] })
      toast.success('Project submitted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit project')
    }
  })
}

export const useReviewSubmission = () => {
  const queryClient = useQueryClient()
  const { stepUpToken } = useAdminStore()
  return useMutation({
    mutationFn: ({ id, sid }: { id: string; sid: string }) => {
      const options = stepUpToken ? { headers: { 'x-admin-step-up-token': stepUpToken } } : undefined
      return hackathonService.reviewSubmission(id, sid, options)
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['hackathons', id, 'submissions'] })
    },
  })
}

export const useSelectWinner = () => {
  const queryClient = useQueryClient()
  const { stepUpToken } = useAdminStore()
  return useMutation({
    mutationFn: ({ id, sid, payload }: { id: string; sid: string; payload: any }) => {
      const options = stepUpToken ? { headers: { 'x-admin-step-up-token': stepUpToken } } : undefined
      return hackathonService.selectWinner(id, sid, payload, options)
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['hackathons', id, 'submissions'] })
      queryClient.invalidateQueries({ queryKey: ['hackathons', id, 'winners'] })
    },
  })
}

export const useRemoveWinner = () => {
  const queryClient = useQueryClient()
  const { stepUpToken } = useAdminStore()
  return useMutation({
    mutationFn: ({ id, sid }: { id: string; sid: string }) => {
      const options = stepUpToken ? { headers: { 'x-admin-step-up-token': stepUpToken } } : undefined
      return hackathonService.removeWinner(id, sid, options)
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['hackathons', id, 'submissions'] })
      queryClient.invalidateQueries({ queryKey: ['hackathons', id, 'winners'] })
    },
  })
}

export const usePublishHackathon = () => {
  const queryClient = useQueryClient()
  const { stepUpToken } = useAdminStore()
  return useMutation({
    mutationFn: (id: string) => {
      const options = stepUpToken ? { headers: { 'x-admin-step-up-token': stepUpToken } } : undefined
      return hackathonService.publishResults(id, options)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['hackathons', id] })
    },
  })
}

export const useCreateTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      hackathonService.createTeam(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathons'] })
      toast.success('Team created successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '';
      if (message.toLowerCase().includes('already in a team') || message.toLowerCase().includes('already registered')) {
        queryClient.invalidateQueries({ queryKey: ['hackathons'] });
        toast.success('You are already in a team!');
        return;
      }
      toast.error(message || 'Failed to create team')
    }
  })
}

export const useJoinTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, teamId }: { id: string; teamId: string }) =>
      hackathonService.joinTeam(id, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathons'] })
      toast.success('Successfully joined team!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || '';
      if (message.toLowerCase().includes('already in a team') || message.toLowerCase().includes('already registered')) {
        queryClient.invalidateQueries({ queryKey: ['hackathons'] });
        toast.success('Successfully joined team!');
        return;
      }
      toast.error(message || 'Failed to join team')
    }
  })
}

export const useLeaveTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => hackathonService.leaveTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hackathons'] })
      toast.success('Left team successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to leave team')
    }
  })
}
