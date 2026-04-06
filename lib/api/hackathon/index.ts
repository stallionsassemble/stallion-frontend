import { getStallionBackendAPI } from '@/lib/api/generated/hackathons/hackathons-sdk'
import type {
  CreateHackathonDto,
  CreateSubmissionDto,
  HackathonSelectWinnersDto,
  JudgeSubmissionDto,
  UpdateHackathonDto,
  UpdateSubmissionDto,
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
    return hackathonsSdk.hackathonsControllerDeleteHackathon(id)
  }

  async publishHackathon(id: string) {
    return hackathonsSdk.hackathonsControllerPublishHackathon(id)
  }

  async createSubmission(payload: CreateSubmissionDto) {
    return hackathonsSdk.hackathonsControllerCreateSubmission(payload)
  }

  async getSubmissions(
    hackathonId: string,
    params?: Record<string, unknown>
  ) {
    return hackathonsSdk.hackathonsControllerGetSubmissions(hackathonId, params)
  }

  async getMySubmissions(params?: Record<string, unknown>) {
    return hackathonsSdk.hackathonsControllerGetMySubmissions(params)
  }

  async updateSubmission(id: string, payload: UpdateSubmissionDto) {
    return hackathonsSdk.hackathonsControllerUpdateSubmission(id, payload)
  }

  async deleteSubmission(id: string) {
    return hackathonsSdk.hackathonsControllerDeleteSubmission(id)
  }

  async judgeSubmission(id: string, payload: JudgeSubmissionDto) {
    return hackathonsSdk.hackathonsControllerJudgeSubmission(id, payload)
  }

  async selectWinners(id: string, payload: HackathonSelectWinnersDto) {
    return hackathonsSdk.hackathonsControllerSelectWinners(id, payload)
  }

  async getWinners(hackathonId: string, params?: Record<string, unknown>) {
    return hackathonsSdk.hackathonsControllerGetWinners(hackathonId, params)
  }
}

export const hackathonService = new HackathonService()
