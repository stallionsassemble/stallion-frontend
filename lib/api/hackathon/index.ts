import { getStallionBackendAPI } from '@/lib/api/generated/hackathons/hackathons-sdk'
import type {
  CreateHackathonDto,
  CreateSubmissionDto,
  SelectWinnersDto,
  SelectWinnerDto,
  UpdateHackathonDto,
} from '@/lib/api/generated/hackathons/model'

const hackathonsSdk = getStallionBackendAPI()

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

  async participate(id: string) {
    return hackathonsSdk.hackathonsControllerParticipate(id)
  }

  async getSubmissions(
    hackathonId: string,
    params?: Record<string, unknown>
  ) {
    return hackathonsSdk.hackathonsControllerGetSubmissions(hackathonId, params)
  }

  async reviewSubmission(id: string, sid: string) {
    return hackathonsSdk.hackathonsControllerReviewSubmission(id, sid)
  }

  async selectWinner(id: string, sid: string, payload: SelectWinnerDto) {
    return hackathonsSdk.hackathonsControllerSelectWinner(id, sid, payload)
  }

  async getWinners(hackathonId: string) {
    return this.getSubmissions(hackathonId, { status: 'WINNER' as any })
  }
}

export const hackathonService = new HackathonService()
