/* eslint-disable */
import { api } from '@/lib/api'
import type { ApplicationAnswers } from '@/lib/hackathon-form'
import { getStallionBackendAPI } from '@/lib/api/generated/hackathons/hackathons-sdk'
import type {
  CreateHackathonDto,
  CreateSubmissionDto,
  SelectWinnersDto,
  SelectWinnerDto,
  UpdateHackathonDto,
  CreateTeamDto,
} from '@/lib/api/generated/hackathons/model'

const hackathonsSdk = getStallionBackendAPI()

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'

export interface HackathonApplication {
  id: string
  status: ApplicationStatus
  teamId: string | null
  lookingForTeam: boolean
  applicationData: ApplicationAnswers | null
  appliedAt: string
  reviewNote?: string | null
  team?: { id: string; name: string; leaderId: string; _count?: { participants: number } } | null
}

export interface MyApplicationResponse {
  applied: boolean
  application: HackathonApplication | null
  submission?: { id: string; title: string; createdAt: string; track?: string | null } | null
}

class HackathonService {
  async createHackathon(payload: CreateHackathonDto) {
    return hackathonsSdk.hackathonsControllerCreateHackathon(payload)
  }

  async getHackathons(params?: Record<string, unknown>) {
    return hackathonsSdk.hackathonsControllerGetHackathons(params)
  }

  async getHackathon(identifier: string) {
    return hackathonsSdk.hackathonsControllerGetHackathon(identifier)
  }

  async updateHackathon(id: string, payload: UpdateHackathonDto) {
    return hackathonsSdk.hackathonsControllerUpdateHackathon(id, payload)
  }

  async deleteHackathon(id: string) {
    return hackathonsSdk.hackathonsControllerCancelHackathon(id)
  }

  async publishHackathon(id: string) {
    return hackathonsSdk.hackathonsControllerPublishResults(id)
  }

  async createSubmission(id: string, payload: CreateSubmissionDto) {
    return hackathonsSdk.hackathonsControllerSubmitProject(id, payload)
  }

  async apply(id: string, answers: ApplicationAnswers) {
    const response = await api.post<HackathonApplication>(`/hackathons/${id}/apply`, { answers })
    return response.data
  }

  async getMyApplication(id: string) {
    const response = await api.get<MyApplicationResponse>(`/hackathons/${id}/my-application`)
    return response.data
  }

  async participate(id: string) {
    return hackathonsSdk.hackathonsControllerParticipate(id)
  }

  async getSubmissions(
    hackathonId: string,
    params?: Record<string, unknown>
  ) {
    return hackathonsSdk.hackathonsControllerGetSubmissions(hackathonId, params)
  }

  async reviewSubmission(id: string, sid: string, options?: any) {
    return hackathonsSdk.hackathonsControllerReviewSubmission(id, sid, options)
  }

  async selectWinner(id: string, sid: string, payload: SelectWinnerDto, options?: any) {
    return hackathonsSdk.hackathonsControllerSelectWinner(id, sid, payload, options)
  }

  async removeWinner(id: string, sid: string, options?: any) {
    return hackathonsSdk.hackathonsControllerRemoveWinner(id, sid, options)
  }

  async getWinners(hackathonId: string) {
    return this.getSubmissions(hackathonId, { status: 'WINNER' as any })
  }

  async publishResults(id: string, options?: any) {
    return hackathonsSdk.hackathonsControllerPublishResults(id, options)
  }

  async createTeam(id: string, payload: CreateTeamDto) {
    return hackathonsSdk.hackathonsControllerCreateTeam(id, payload)
  }

  async joinTeam(id: string, teamId: string) {
    return hackathonsSdk.hackathonsControllerJoinTeam(id, teamId)
  }

  async leaveTeam(id: string) {
    return hackathonsSdk.hackathonsControllerLeaveTeam(id)
  }
}

export const hackathonService = new HackathonService()
