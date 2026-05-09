import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { hackathonService } from './index'
import { Hackathon } from '@/lib/types/hackathon'
import { PagedResponse } from '@/lib/types'

export const useGetHackathons = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['hackathons', params],
    queryFn: async () => {
      const response = await hackathonService.getHackathons(params)
      return response as unknown as PagedResponse<Hackathon>
    },
  })
}

export const useGetHackathon = (identifier: string) => {
  return useQuery({
    queryKey: ['hackathons', identifier],
    queryFn: async () => {
      const response = await hackathonService.getHackathon(identifier)
      return response as unknown as Hackathon
    },
    enabled: !!identifier,
  })
}

export const useGetHackathonSubmissions = (hackathonId: string) => {
  return useQuery({
    queryKey: ['hackathons', hackathonId, 'submissions'],
    queryFn: async () => {
      const response = await hackathonService.getSubmissions(hackathonId)
      return response
    },
    enabled: !!hackathonId,
  })
}

export const useGetHackathonWinners = (hackathonId: string) => {
  return useQuery({
    queryKey: ['hackathons', hackathonId, 'winners'],
    queryFn: async () => {
      const response = await hackathonService.getWinners(hackathonId)
      return response
    },
    enabled: !!hackathonId,
  })
}

export const useParticipateHackathon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => hackathonService.participate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['hackathons', id] })
      toast.success('Successfully registered for hackathon!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register for hackathon')
    }
  })
}
