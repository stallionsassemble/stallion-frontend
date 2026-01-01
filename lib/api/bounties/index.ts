import { api } from '@/lib/api'
import { Currencies } from '@/lib/types/bounties'

class BountyService {
  async getSupportedCurrencies() {
    const response = await api.get('/bounties/supported-currencies')
    return response.data
  }

  async getAllBounties() {
    const response = await api.get('/bounties/all')
    return response.data
  }

  async getMyBounties() {
    const response = await api.get('/bounties')
    return response.data
  }

  async createBounty(payload: any) {
    const response = await api.post('/bounties', payload)
    return response.data
  }

  async getActiveBounties() {
    const response = await api.get('/bounties/active')
    return response.data
  }

  async getBounty(id: string) {
    const response = await api.get(`/bounties/id/${id}`)
    return response.data
  }

  async updateBounty(id: string, payload: any) {
    const response = await api.patch(`/bounties/${id}`, payload)
    return response.data
  }

  async deleteBounty(id: string) {
    const response = await api.delete(`/bounties/${id}`)
    return response.data
  }

  async closeBounty(id: string) {
    const response = await api.post(`/bounties/${id}/close`)
    return response.data
  }

  async applyToBounty(id: string, payload: any) {
    const response = await api.post(`/bounties/${id}/apply`, payload)
    return response.data
  }

  async updateSubmission(id: string, payload: any) {
    const response = await api.patch(`/bounties/${id}/submission`, payload)
    return response.data
  }

  async selectWinners(id: string, payload: any) {
    const response = await api.post(`/bounties/${id}/winners`, payload)
    return response.data
  }

  async getWinners(id: string) {
    const response = await api.get(`/bounties/${id}/winners`)
    return response.data
  }

  async getSubmissions(id: string) {
    const response = await api.get(`/bounties/${id}/submissions`)
    return response.data
  }

  async getDetailedSubmissions(id: string) {
    const response = await api.get(`/bounties/${id}/submissions/detailed`)
    return response.data
  }

  async getApplicants(id: string) {
    const response = await api.get(`/bounties/${id}/applicants`)
    return response.data
  }

  async getBountyStatus(id: string) {
    const response = await api.get(`/bounties/${id}/status`)
    return response.data
  }

  // Admin endpoints
  async updateContractAdmin(payload: any) {
    const response = await api.post('/bounties/admin/update-admin', payload)
    return response.data
  }

  async updateFeeAccount(payload: any) {
    const response = await api.post(
      '/bounties/admin/update-fee-account',
      payload
    )
    return response.data
  }

  async getContractStats() {
    const response = await api.get('/bounties/admin/stats')
    return response.data
  }

  async emergencyWithdraw(payload: any) {
    const response = await api.post(
      '/bounties/admin/emergency-withdraw',
      payload
    )
    return response.data
  }

  async checkJudgingDeadline(id: string) {
    const response = await api.post(`/bounties/admin/check-judging/${id}`)
    return response.data
  }
}

export const bountyService = new BountyService()
