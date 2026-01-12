import { useQuery } from '@tanstack/react-query'
import { activitiesService } from '.'

export function useGetActivities({
  page,
  limit,
  type,
}: {
  page: string
  limit: string
  type?: string
}) {
  return useQuery({
    queryKey: ['activities', page, limit, type],
    queryFn: () => activitiesService.getActivities(page, limit, type),
  })
}

export function useGetMyActivities(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['my-activities', page, limit],
    queryFn: () => activitiesService.getMyActivities(page, limit),
  })
}
