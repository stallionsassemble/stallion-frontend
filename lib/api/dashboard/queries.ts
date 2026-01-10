import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '.'

export const useTalentStatsQuery = () => {
  return useQuery({
    queryKey: ['talent-stats'],
    queryFn: () => dashboardService.getTalentStats(),
  })
}

export const useProjectOwnerStatsQuery = () => {
  return useQuery({
    queryKey: ['project-owner-stats'],
    queryFn: () => dashboardService.getProjectOwnerStats(),
  })
}

export const useProjectContributors = () => {
  return useQuery({
    queryKey: ['project-contributors'],
    queryFn: () => dashboardService.getProjectContributors(),
  })
}
