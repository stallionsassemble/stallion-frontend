import { api } from '@/lib/api'
import {
  ApplyProjectPayload,
  ApplyProjectResponse,
  CreateProjectPayload,
  GetProjectsPayload,
  Project,
  ProjectActivity,
  ProjectApplications,
  ProjectMilestone,
  ProjectMilestones,
  ProjectReviewPayload,
  ProjectReviewResponse,
  Projects,
  ReviewMilestonePayload,
  SubmitMilestonePayload,
} from '@/lib/types/project'

export class ProjectService {
  /**
   * Get all projects
   * @param payload Filter payload
   * @returns
   */
  async getProjects(payload: GetProjectsPayload) {
    const response = await api.get<Projects>('/projects', { params: payload })
    return response.data
  }

  /**
   * Create a new project
   * @param payload Project creation payload
   * @returns
   */
  async createProject(payload: CreateProjectPayload) {
    const response = await api.post<Project>('/projects', payload)
    return response.data
  }

  /**
   * Get project by id
   * @param id Project id
   * @returns
   */
  async getProject(id: string) {
    const response = await api.get<Project>(`/projects/${id}`)
    return response.data
  }

  /**
   * Cancel a project
   * @param id Project id
   * @returns
   */
  async cancelProject(id: string) {
    const response = await api.delete<{ message: string }>(`/projects/${id}`)
    return response.data
  }

  /**
   * Apply to a project
   * @param id Project id
   * @param payload Application payload
   * @returns
   */
  async applyProject(id: string, payload: ApplyProjectPayload) {
    const response = await api.post<ApplyProjectResponse>(
      `/projects/${id}/apply`,
      payload
    )
    return response.data
  }

  /**
   * Get project applications
   * @param id Project id
   * @returns
   */
  async getProjectApplications(id: string) {
    const response = await api.get<ProjectApplications>(
      `/projects/${id}/applications`
    )
    return response.data
  }

  /**
   * Get my applications
   * @returns
   */
  async getMyApplications() {
    const response = await api.get<ProjectApplications>(
      `/projects/applications/my`
    )
    return response.data
  }

  /**
   * Review an application
   * @param id Application id
   * @param payload Review payload
   * @returns
   */
  async reviewApplication(id: string, payload: ProjectReviewPayload) {
    const response = await api.post<ProjectReviewResponse>(
      `/projects/applications/${id}/review`,
      payload
    )
    return response.data
  }

  /**
   * Update an application
   * @param id Application id
   * @param payload Update payload
   * @returns
   */
  async updateApplication(id: string, payload: ApplyProjectPayload) {
    const response = await api.patch<ApplyProjectResponse>(
      `/projects/applications/${id}`,
      payload
    )
    return response.data
  }

  /**
   * Withdraw application
   * @param id application id
   * @returns
   */
  async withdrawApplication(id: string) {
    const response = await api.delete<{ message: string }>(
      `/projects/applications/${id}`
    )
    return response.data
  }

  /**
   * Get project milestones (GIG Only)
   * @param id project id
   * @returns
   */
  async getProjectMilestones(id: string) {
    const response = await api.get<ProjectMilestones>(
      `/projects/${id}/milestones`
    )
    return response.data
  }

  /**
   * Get my milestones (GIG Only)
   * @returns
   */
  async getMyMilestones() {
    const response = await api.get<ProjectMilestones>(`/projects/milestones/my`)
    return response.data
  }

  /**
   * Submit a milestone
   * @param id Milestone id
   * @param payload Submission payload
   * @returns
   */
  async submitMilestone(id: string, payload: SubmitMilestonePayload) {
    const response = await api.post<ProjectMilestone>(
      `/projects/milestones/${id}/submit`,
      payload
    )
    return response.data
  }

  /**
   * Review a milestone
   * @param id Milestone id
   * @param payload Review payload
   * @returns
   */
  async reviewMilestone(id: string, payload: ReviewMilestonePayload) {
    const response = await api.post<ProjectMilestone>(
      `/projects/milestones/${id}/review`,
      payload
    )
    return response.data
  }

  /**
   * Get project activity
   * @param id Project id
   * @returns
   */
  async getProjectActivity(id: string) {
    const response = await api.get<ProjectActivity>(`/projects/${id}/activity`)
    return response.data
  }
}

export const projectService = new ProjectService()
