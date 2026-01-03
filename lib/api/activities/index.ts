import { api } from '@/lib/api'
import { ActivityResponse } from '@/lib/types/activity'

class ActivitiesService {
  async getActivities(page: string, limit: string, type: string) {
    const response = await api.get<ActivityResponse>('/activities', {
      params: {
        page,
        limit,
        type,
      },
    })
    return response.data
  }
}

export const activitiesService = new ActivitiesService()
