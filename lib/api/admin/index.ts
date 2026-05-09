import { 
  AdminBounty,
  AdminDashboardStats, 
  AdminHackathon,
  AdminPaginatedResponse, 
  AdminUser, 
  BountyAdminStats, 
  PayoutAdminStats, 
  UserAdminStats,
  HackathonAdminStats,
  StepUpResponse,
  FundingWalletResponse
} from '@/lib/types/admin'
import { getStallionBackendAPI } from '@/lib/api/generated/admin/admin-sdk'
import { useAdminStore } from '@/lib/store/use-admin-store'
import type {
  AdminCreateHackathonDto,
  AdminCreateUserDto,
  AdminCreateUserDtoRole,
  StepUpPasskeyVerifyDtoResponse,
} from '@/lib/api/generated/admin/model'
import type { AuthenticationResponseJSON, PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/browser'

type AdminListParams = Record<string, unknown>
type AdminEntityPayload = Record<string, unknown>
type PasskeyAuthenticationOptions = {
  optionsJSON: PublicKeyCredentialRequestOptionsJSON
  useBrowserAutofill?: boolean
  verifyBrowserAutofillInput?: boolean
}
type PasskeyAuthenticationResponse = AuthenticationResponseJSON | StepUpPasskeyVerifyDtoResponse
type AdminStepUpHeader = {
  headers: {
    'x-admin-step-up-token': string
  }
}

const adminSdk = getStallionBackendAPI()

const withStepUp = (stepUpToken: string): AdminStepUpHeader => ({
  headers: { 'x-admin-step-up-token': stepUpToken }
})

class AdminService {
  // --- Dashboard ---
  async getDashboardStats() {
    return adminSdk.adminControllerGetDashboard() as unknown as Promise<AdminDashboardStats>
  }

  // --- Users ---
  async getUsersStats() {
    return adminSdk.adminControllerGetUserStats() as unknown as Promise<UserAdminStats>
  }

  async getUsers(params: AdminListParams) {
    return adminSdk.adminControllerListUsers(params) as unknown as Promise<AdminPaginatedResponse<AdminUser>>
  }

  async createUser(data: { email: string; role: string; firstName?: string; lastName?: string; username?: string }, stepUpToken?: string) {
    const payload: AdminCreateUserDto = {
      email: data.email,
      role: data.role as AdminCreateUserDtoRole,
    }

    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerCreateUser(payload, withStepUp(token))
  }

  async reset2fa(userId: string, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerResetUser2FA(userId, withStepUp(token))
  }

  async makeAdmin(userId: string, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerMakeAdmin(userId, withStepUp(token))
  }

  async suspendUser(userId: string, data: { indefinite?: boolean; durationHours?: number; reason: string }, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerSuspendUser(userId, data, withStepUp(token))
  }

  async banUser(userId: string, data: { reason: string }, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerBanUser(userId, data, withStepUp(token))
  }

  // --- Bounties ---
  async getBountiesStats() {
    return adminSdk.adminControllerGetBountyStats() as unknown as Promise<BountyAdminStats>
  }

  async getBounties(params: AdminListParams) {
    return adminSdk.adminControllerListBounties(params) as unknown as Promise<AdminPaginatedResponse<AdminBounty>>
  }

  async featureBounty(bountyId: string, isFeatured: boolean, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerToggleBountyFeature(
      bountyId,
      { isFeatured },
      withStepUp(token)
    )
  }

  async updateBounty(bountyId: string, data: AdminEntityPayload, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerUpdateBounty(bountyId, data, withStepUp(token))
  }

  async deleteBounty(bountyId: string, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerDeleteBounty(bountyId, withStepUp(token))
  }

  // --- Projects ---
  async getProjectsStats() {
    return adminSdk.adminControllerGetProjectStats() as unknown as Promise<BountyAdminStats>
  }

  async getProjects(params: AdminListParams) {
    return adminSdk.adminControllerListProjects(params) as unknown as Promise<AdminPaginatedResponse<unknown>>
  }

  async featureProject(projectId: string, isFeatured: boolean, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerToggleProjectFeature(
      projectId,
      { isFeatured },
      withStepUp(token)
    )
  }

  async updateProject(projectId: string, data: AdminEntityPayload, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerUpdateProject(projectId, data, withStepUp(token))
  }

  async deleteProject(projectId: string, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerDeleteProject(projectId, withStepUp(token))
  }

  // --- Payouts ---
  async getPayoutsStats() {
    return adminSdk.adminControllerGetPayoutStats() as unknown as Promise<PayoutAdminStats>
  }

  async getPayouts(params: AdminListParams) {
    return adminSdk.adminControllerListPayouts(params) as unknown as Promise<AdminPaginatedResponse<unknown>>
  }

  async retryPayout(payoutId: string, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerRetryPayout(payoutId, withStepUp(token))
  }

  // --- Hackathons ---
  async getHackathonsStats() {
    return adminSdk.adminControllerGetHackathonStats() as unknown as Promise<HackathonAdminStats>
  }

  async getHackathons(params: AdminListParams) {
    return adminSdk.adminControllerListHackathons(params) as unknown as Promise<AdminPaginatedResponse<AdminHackathon>>
  }

  async createHackathon(data: AdminCreateHackathonDto, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerCreateHackathon(data, withStepUp(token))
  }

  async updateHackathon(hackathonId: string, data: AdminEntityPayload, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerUpdateHackathon(hackathonId, data, withStepUp(token))
  }

  async deleteHackathon(hackathonId: string, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerDeleteHackathon(hackathonId, withStepUp(token))
  }

  // --- Funding Wallet ---
  async getFundingWallet() {
    return adminSdk.adminControllerGetFundingWallet() as unknown as Promise<FundingWalletResponse>
  }

  async updateFundingWallet(data: { fundingWalletId: string }, stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerSetFundingWallet(data, withStepUp(token))
  }

  async deleteFundingWallet(stepUpToken?: string) {
    const token = stepUpToken || useAdminStore.getState().stepUpToken || ''
    return adminSdk.adminControllerClearFundingWallet(withStepUp(token))
  }

  // --- Step-Up ---
  async stepUpTotp(code: string) {
    return adminSdk.adminControllerVerifyTotpStepUp({ code }) as Promise<StepUpResponse>
  }

  async stepUpPasskeyOptions() {
    return adminSdk.adminControllerGetPasskeyStepUpOptions() as unknown as Promise<PasskeyAuthenticationOptions>
  }

  async stepUpPasskeyVerify(response_data: PasskeyAuthenticationResponse) {
    return adminSdk.adminControllerVerifyPasskeyStepUp(
      { response: response_data as StepUpPasskeyVerifyDtoResponse },
      undefined
    ) as Promise<StepUpResponse>
  }
}

export const adminService = new AdminService()
