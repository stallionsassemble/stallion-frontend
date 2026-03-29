import { useQuery } from '@tanstack/react-query'
import { hackathonService } from './index'
import { Hackathon } from '@/lib/types/hackathon'
import { PagedResponse } from '@/lib/types'

export const useGetHackathons = (params?: any) => {
  return useQuery({
    queryKey: ['hackathons', params],
    queryFn: async () => {
      const response = await hackathonService.getHackathons()
      // Usually getHackathons would take params, but I'll stick to what's defined in service
      return response as PagedResponse<Hackathon>
    },
  })
}

export const useGetHackathon = (identifier: string) => {
  return useQuery({
    queryKey: ['hackathons', identifier],
    queryFn: async () => {
      const response = await hackathonService.getHackathon(identifier)
      return response as Hackathon
    },
    enabled: !!identifier,
  })
}

export const useGetHackathonSubmissions = (hackathonId: string) => {
  return useQuery({
    queryKey: ['hackathons', hackathonId, 'submissions'],
    queryFn: async () => {
      const response = await hackathonService.getSubmissions(hackathonId)
      return response.data
    },
    enabled: !!hackathonId,
  })
}

export const useGetHackathonWinners = (hackathonId: string) => {
  return useQuery({
    queryKey: ['hackathons', hackathonId, 'winners'],
    queryFn: async () => {
      const response = await hackathonService.getWinners(hackathonId)
      return response.data
    },
    enabled: !!hackathonId,
  })
}
