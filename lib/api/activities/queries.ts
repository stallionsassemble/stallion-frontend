import { useQuery } from '@tanstack/react-query'
import { activitiesService } from '.'

export function useGetActivities({
  page,
  limit,
  type,
}: {
  page: string
  limit: string
  type: string
}) {
  return useQuery({
    queryKey: ['activities', page, limit, type],
    queryFn: () => activitiesService.getActivities(page, limit, type),
  })
}
