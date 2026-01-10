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

  async getBountyActivities(
    id: string,
    bountyId: string,
    limit: number = 10,
    page: number
  ) {
    const response = await api.get(`/activities/bounty/${bountyId}/`)
    return response.data
  }

  async getProjectActivities(
    id: string,
    projectId: string,
    limit: number = 10,
    page: number
  ) {
    const response = await api.get(`/activities/project/${projectId}`)
    return response.data
  }

  async getHackathonActivities(
    id: string,
    hackathonId: string,
    limit: number = 10,
    page: number
  ) {
    const response = await api.get(`/activities/hackathon/${hackathonId}`)
    return response.data
  }
}

export const activitiesService = new ActivitiesService()
