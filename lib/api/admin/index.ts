import { api } from '@/lib/api'
import { 
  AdminDashboardStats, 
  AdminPaginatedResponse, 
  AdminUser, 
  BountyAdminStats, 
  PayoutAdminStats, 
  UserAdminStats,
  HackathonAdminStats,
  StepUpResponse,
  FundingWalletResponse
} from '@/lib/types/admin'

class AdminService {
  // --- Dashboard ---
  async getDashboardStats() {
    const response = await api.get<AdminDashboardStats>('/admin/dashboard')
    return response.data
  }

  // --- Users ---
  async getUsersStats() {
    const response = await api.get<UserAdminStats>('/admin/users/stats')
    return response.data
  }

  async getUsers(params: any) {
    const response = await api.get<AdminPaginatedResponse<AdminUser>>('/admin/users', { params })
    return response.data
  }

  async createUser(data: { email: string; role: string; firstName?: string; lastName?: string; username?: string }, stepUpToken: string) {
    const response = await api.post('/admin/users', data, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  async reset2fa(userId: string, stepUpToken: string) {
    const response = await api.post(`/admin/users/${userId}/reset-2fa`, {}, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  async makeAdmin(userId: string, stepUpToken: string) {
    const response = await api.post(`/admin/users/${userId}/make-admin`, {}, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  async suspendUser(userId: string, data: { indefinite?: boolean; durationHours?: number; reason: string }, stepUpToken: string) {
    const response = await api.post(`/admin/users/${userId}/suspend`, data, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  async banUser(userId: string, data: { reason: string }, stepUpToken: string) {
    const response = await api.post(`/admin/users/${userId}/ban`, data, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  // --- Bounties ---
  async getBountiesStats() {
    const response = await api.get<BountyAdminStats>('/admin/bounties/stats')
    return response.data
  }

  async getBounties(params: any) {
    const response = await api.get<AdminPaginatedResponse<any>>('/admin/bounties', { params })
    return response.data
  }

  async featureBounty(bountyId: string, isFeatured: boolean, stepUpToken: string) {
    const response = await api.patch(`/admin/bounties/${bountyId}/feature`, { isFeatured }, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  async updateBounty(bountyId: string, data: any, stepUpToken: string) {
    const response = await api.patch(`/admin/bounties/${bountyId}`, data, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  async deleteBounty(bountyId: string, stepUpToken: string) {
    const response = await api.delete(`/admin/bounties/${bountyId}`, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  // --- Projects ---
  async getProjectsStats() {
    const response = await api.get<BountyAdminStats>('/admin/projects/stats') // Reuses BountyAdminStats shape
    return response.data
  }

  async getProjects(params: any) {
    const response = await api.get<AdminPaginatedResponse<any>>('/admin/projects', { params })
    return response.data
  }

  async featureProject(projectId: string, isFeatured: boolean, stepUpToken: string) {
    const response = await api.patch(`/admin/projects/${projectId}/feature`, { isFeatured }, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  async updateProject(projectId: string, data: any, stepUpToken: string) {
    const response = await api.patch(`/admin/projects/${projectId}`, data, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  async deleteProject(projectId: string, stepUpToken: string) {
    const response = await api.delete(`/admin/projects/${projectId}`, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  // --- Payouts ---
  async getPayoutsStats() {
    const response = await api.get<PayoutAdminStats>('/admin/payouts/stats')
    return response.data
  }

  async getPayouts(params: any) {
    const response = await api.get<AdminPaginatedResponse<any>>('/admin/payouts', { params })
    return response.data
  }

  async retryPayout(payoutId: string, stepUpToken: string) {
    const response = await api.post(`/admin/payouts/${payoutId}/retry`, {}, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  // --- Hackathons ---
  async getHackathonsStats() {
    const response = await api.get<HackathonAdminStats>('/admin/hackathons/stats')
    return response.data
  }

  async getHackathons(params: any) {
    const response = await api.get<AdminPaginatedResponse<any>>('/admin/hackathons', { params })
    return response.data
  }

  async createHackathon(data: any, stepUpToken: string) {
    const response = await api.post('/admin/hackathons', data, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  async updateHackathon(hackathonId: string, data: any, stepUpToken: string) {
    const response = await api.patch(`/admin/hackathons/${hackathonId}`, data, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  async deleteHackathon(hackathonId: string, stepUpToken: string) {
    const response = await api.delete(`/admin/hackathons/${hackathonId}`, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  // --- Funding Wallet ---
  async getFundingWallet() {
    const response = await api.get<FundingWalletResponse>('/admin/funding-wallet')
    return response.data
  }

  async updateFundingWallet(data: { fundingWalletId: string }, stepUpToken: string) {
    const response = await api.put('/admin/funding-wallet', data, {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  async deleteFundingWallet(stepUpToken: string) {
    const response = await api.delete('/admin/funding-wallet', {
      headers: { 'x-admin-step-up-token': stepUpToken }
    })
    return response.data
  }

  // --- Step-Up ---
  async stepUpTotp(code: string) {
    const response = await api.post<StepUpResponse>('/admin/security/step-up/totp', { code })
    return response.data
  }

  async stepUpPasskeyOptions() {
    const response = await api.post('/admin/security/step-up/passkey/options')
    return response.data
  }

  async stepUpPasskeyVerify(response_data: any) {
    const response = await api.post<StepUpResponse>('/admin/security/step-up/passkey/verify', { response: response_data })
    return response.data
  }
}

export const adminService = new AdminService()
