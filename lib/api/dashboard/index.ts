import { api } from '@/lib/api'
import {
  ProjectContributorsResponse,
  ProjectOwnerStats,
  TalentDashboardStats,
} from '@/lib/types/dashboard'

class DashboardService {
  async getTalentStats() {
    const response = await api.get<TalentDashboardStats>(
      '/dashboard/stats/contributor'
    )
    return response.data
  }

  async getProjectOwnerStats() {
    const response = await api.get<ProjectOwnerStats>(
      '/dashboard/stats/project-owner'
    )
    return response.data
  }

  async getProjectContributors() {
    const response = await api.get<ProjectContributorsResponse>(
      '/dashboard/contributors'
    )
    return response.data
  }
}

export const dashboardService = new DashboardService()
