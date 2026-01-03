import { api } from '@/lib/api'
import {
  ApplyToBountyDto,
  ApplyToBountyResponseDto,
  Bounty,
  BountySubmission,
  BountyWinnersResponseDto,
  CloseBountyResponseDto,
  ContractStatsResponseDto,
  CreateBountyDto,
  CreateBountyResponseDto,
  Currencies,
  EmergencyWithdrawDto,
  GetAllBountiesPayload,
  PaginatedBountiesResponseDto,
  SelectWinnersDto,
  SelectWinnersResponseDto,
  TransactionHashResponseDto,
  UpdateAdminDto,
  UpdateBountyDto,
  UpdateBountyResponseDto,
  UpdateFeeAccountDto,
  UpdateSubmissionDto,
  UpdateSubmissionResponseDto,
} from '@/lib/types/bounties'

class BountyService {
  async getSupportedCurrencies() {
    const response = await api.get<Currencies>('/bounties/supported-currencies')
    return response.data
  }

  async getAllBounties(params?: GetAllBountiesPayload) {
    const response = await api.get<PaginatedBountiesResponseDto>(
      '/bounties/all',
      { params }
    )
    return response.data
  }

  async getMyBounties() {
    const response = await api.get<Bounty[]>('/bounties')
    return response.data
  }

  async createBounty(payload: CreateBountyDto) {
    const response = await api.post<CreateBountyResponseDto>(
      '/bounties',
      payload
    )
    return response.data
  }

  async getActiveBounties() {
    const response = await api.get<Bounty[]>('/bounties/active')
    return response.data
  }

  async getBounty(id: string) {
    const response = await api.get<Bounty>(`/bounties/id/${id}`)
    return response.data
  }

  async updateBounty(id: string, payload: UpdateBountyDto) {
    const response = await api.patch<UpdateBountyResponseDto>(
      `/bounties/${id}`,
      payload
    )
    return response.data
  }

  async deleteBounty(id: string) {
    const response = await api.delete<{ message: string }>(`/bounties/${id}`)
    return response.data
  }

  async closeBounty(id: string) {
    const response = await api.post<CloseBountyResponseDto>(
      `/bounties/${id}/close`
    )
    return response.data
  }

  async applyToBounty(id: string, payload: ApplyToBountyDto) {
    const response = await api.post<ApplyToBountyResponseDto>(
      `/bounties/${id}/apply`,
      payload
    )
    return response.data
  }

  async updateSubmission(id: string, payload: UpdateSubmissionDto) {
    const response = await api.patch<UpdateSubmissionResponseDto>(
      `/bounties/${id}/submission`,
      payload
    )
    return response.data
  }

  async selectWinners(id: string, payload: SelectWinnersDto) {
    const response = await api.post<SelectWinnersResponseDto>(
      `/bounties/${id}/winners`,
      payload
    )
    return response.data
  }

  async getWinners(id: string) {
    const response = await api.get<BountyWinnersResponseDto>(
      `/bounties/${id}/winners`
    )
    return response.data
  }

  async getSubmissions(id: string) {
    const response = await api.get<BountySubmission[]>(
      `/bounties/${id}/submissions`
    )
    return response.data
  }

  async getDetailedSubmissions(id: string) {
    const response = await api.get<BountySubmission[]>(
      `/bounties/${id}/submissions/detailed`
    )
    return response.data
  }

  async getApplicants(id: string) {
    // Keeping generic or updating if needed, but keeping as existing for now
    const response = await api.get(`/bounties/${id}/applicants`)
    return response.data
  }

  async getBountiesByUser(userId: string) {
    const response = await api.get<Bounty[]>(`/bounties/user/${userId}`)
    return response.data
  }

  async getMySubmissions() {
    const response = await api.get<BountySubmission[]>(
      '/bounties/submissions/my'
    )
    return response.data
  }

  async getBountyStatus(id: string) {
    const response = await api.get<{ status: string }>(`/bounties/${id}/status`)
    return response.data
  }

  // Admin endpoints
  async updateContractAdmin(payload: UpdateAdminDto) {
    const response = await api.post<TransactionHashResponseDto>(
      '/bounties/admin/update-admin',
      payload
    )
    return response.data
  }

  async updateFeeAccount(payload: UpdateFeeAccountDto) {
    const response = await api.post<TransactionHashResponseDto>(
      '/bounties/admin/update-fee-account',
      payload
    )
    return response.data
  }

  async getContractStats() {
    const response = await api.get<ContractStatsResponseDto>(
      '/bounties/admin/stats'
    )
    return response.data
  }

  async emergencyWithdraw(payload: EmergencyWithdrawDto) {
    const response = await api.post<TransactionHashResponseDto>(
      '/bounties/admin/emergency-withdraw',
      payload
    )
    return response.data
  }

  async checkJudgingDeadline(id: string) {
    const response = await api.post<TransactionHashResponseDto>(
      `/bounties/admin/check-judging/${id}`
    )
    return response.data
  }
}

export const bountyService = new BountyService()
