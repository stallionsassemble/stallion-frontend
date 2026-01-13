import {
  ApplyProjectPayload,
  CreateProjectPayload,
  GetProjectsPayload,
  ProjectApplications,
  ProjectReviewPayload,
  Projects,
  ReviewMilestonePayload,
  SubmitMilestonePayload,
  UpdateProjectPayload,
} from '@/lib/types/project'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectService } from './index'

// --- Queries ---

export function useGetProjects(params?: GetProjectsPayload, options?: any) {
  return useQuery<Projects>({
    queryKey: ['projects', params],
    queryFn: () => projectService.getProjects(params),
    ...options,
  })
}

export function useGetProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectService.getProject(id),
    enabled: !!id,
  })
}

export function useGetProjectApplications(id: string) {
  return useQuery({
    queryKey: ['projects', id, 'applications'],
    queryFn: () => projectService.getProjectApplications(id),
    enabled: !!id,
  })
}

export function useGetMyApplications(options?: any) {
  return useQuery<ProjectApplications>({
    queryKey: ['projects', 'applications', 'me'],
    queryFn: () => projectService.getMyApplications(),
    enabled: !!options?.enabled, // To respect enabled if passed, though usually default true
    ...options,
  })
}

export function useGetProjectMilestones(id: string) {
  return useQuery({
    queryKey: ['projects', id, 'milestones'],
    queryFn: () => projectService.getProjectMilestones(id),
    enabled: !!id,
  })
}

// For fetching milestones associated with a specific application (Used by Owner to see Talkent's progress)
export function useGetApplicationMilestones(applicationId: string) {
  return useQuery({
    queryKey: ['projects', 'applications', applicationId, 'milestones'],
    queryFn: () => projectService.getMyApplicationMilestone(applicationId),
    enabled: !!applicationId,
  })
}

export function useGetMyMilestones(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'milestones', 'my'],
    queryFn: () => projectService.getMyMilestones(projectId),
    enabled: !!projectId,
  })
}

export function useGetProjectActivity(id: string) {
  return useQuery({
    queryKey: ['projects', id, 'activity'],
    queryFn: () => projectService.getProjectActivity(id),
    enabled: !!id,
  })
}

// --- Mutations ---

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      projectService.createProject(payload),
    onSuccess: () => {
      toast.success('Project created successfully')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create project')
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateProjectPayload
    }) => projectService.updateProject(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Project updated successfully')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', id] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update project')
    },
  })
}

export function useCancelProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectService.cancelProject(id),
    onSuccess: (_, id) => {
      // Invalidate the specific project and the list
      queryClient.invalidateQueries({ queryKey: ['projects', id] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useApplyProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: ApplyProjectPayload
    }) => projectService.applyProject(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', id, 'applications'],
      })
      queryClient.invalidateQueries({
        queryKey: ['projects', 'applications', 'my'],
      })
      // Also invalidate project details as application count might strictly strictly change
      queryClient.invalidateQueries({ queryKey: ['projects', id] })
    },
  })
}

export function useUpdateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: ApplyProjectPayload
    }) => projectService.updateApplication(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', 'applications', 'my'],
      })
      if (data?.projectId) {
        queryClient.invalidateQueries({
          queryKey: ['projects', data.projectId, 'applications'],
        })
        // Invalidate project details to reflect updated application data
        queryClient.invalidateQueries({
          queryKey: ['projects', data.projectId],
        })
      }
    },
  })
}

export function useReviewApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: ProjectReviewPayload
    }) => projectService.reviewApplication(id, payload),
    onSuccess: (data) => {
      // data is ApplyProjectResponse which likely has projectId
      if (data?.projectId) {
        queryClient.invalidateQueries({
          queryKey: ['projects', data.projectId, 'applications'],
        })
      }
      queryClient.invalidateQueries({
        queryKey: ['projects', 'applications', 'my'],
      })
    },
  })
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectService.withdrawApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects', 'applications', 'my'],
      })
      // We essentially invalidate 'projects' generally if we don't know the ID,
      // but typically UI relies on 'my applications' list for withdrawal.
    },
  })
}

export function useSubmitMilestone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: SubmitMilestonePayload
    }) => projectService.submitMilestone(id, payload),
    onSuccess: (data) => {
      if ((data as any)?.projectId) {
        queryClient.invalidateQueries({
          queryKey: ['projects', (data as any).projectId, 'milestones'],
        })
      }
      queryClient.invalidateQueries({
        queryKey: ['projects', 'milestones', 'my'],
      })
    },
  })
}

export function useReviewMilestone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: ReviewMilestonePayload
    }) => projectService.reviewMilestone(id, payload),
    onSuccess: (data) => {
      if ((data as any)?.projectId) {
        queryClient.invalidateQueries({
          queryKey: ['projects', (data as any).projectId, 'milestones'],
        })
      }
    },
  })
}
