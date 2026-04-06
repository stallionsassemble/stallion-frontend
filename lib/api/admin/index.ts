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

  async createUser(data: { email: string; role: string; firstName?: string; lastName?: string; username?: string }, stepUpToken: string) {
    const payload: AdminCreateUserDto = {
      email: data.email,
      role: data.role as AdminCreateUserDtoRole,
    }

    return adminSdk.adminControllerCreateUser(payload, withStepUp(stepUpToken))
  }

  async reset2fa(userId: string, stepUpToken: string) {
    return adminSdk.adminControllerResetUser2FA(userId, withStepUp(stepUpToken))
  }

  async makeAdmin(userId: string, stepUpToken: string) {
    return adminSdk.adminControllerMakeAdmin(userId, withStepUp(stepUpToken))
  }

  async suspendUser(userId: string, data: { indefinite?: boolean; durationHours?: number; reason: string }, stepUpToken: string) {
    return adminSdk.adminControllerSuspendUser(userId, data, withStepUp(stepUpToken))
  }

  async banUser(userId: string, data: { reason: string }, stepUpToken: string) {
    return adminSdk.adminControllerBanUser(userId, data, withStepUp(stepUpToken))
  }

  // --- Bounties ---
  async getBountiesStats() {
    return adminSdk.adminControllerGetBountyStats() as unknown as Promise<BountyAdminStats>
  }

  async getBounties(params: AdminListParams) {
    return adminSdk.adminControllerListBounties(params) as unknown as Promise<AdminPaginatedResponse<AdminBounty>>
  }

  async featureBounty(bountyId: string, isFeatured: boolean, stepUpToken: string) {
    return adminSdk.adminControllerToggleBountyFeature(
      bountyId,
      { isFeatured },
      withStepUp(stepUpToken)
    )
  }

  async updateBounty(bountyId: string, data: AdminEntityPayload, stepUpToken: string) {
    return adminSdk.adminControllerUpdateBounty(bountyId, data, withStepUp(stepUpToken))
  }

  async deleteBounty(bountyId: string, stepUpToken: string) {
    return adminSdk.adminControllerDeleteBounty(bountyId, withStepUp(stepUpToken))
  }

  // --- Projects ---
  async getProjectsStats() {
    return adminSdk.adminControllerGetProjectStats() as unknown as Promise<BountyAdminStats>
  }

  async getProjects(params: AdminListParams) {
    return adminSdk.adminControllerListProjects(params) as unknown as Promise<AdminPaginatedResponse<unknown>>
  }

  async featureProject(projectId: string, isFeatured: boolean, stepUpToken: string) {
    return adminSdk.adminControllerToggleProjectFeature(
      projectId,
      { isFeatured },
      withStepUp(stepUpToken)
    )
  }

  async updateProject(projectId: string, data: AdminEntityPayload, stepUpToken: string) {
    return adminSdk.adminControllerUpdateProject(projectId, data, withStepUp(stepUpToken))
  }

  async deleteProject(projectId: string, stepUpToken: string) {
    return adminSdk.adminControllerDeleteProject(projectId, withStepUp(stepUpToken))
  }

  // --- Payouts ---
  async getPayoutsStats() {
    return adminSdk.adminControllerGetPayoutStats() as unknown as Promise<PayoutAdminStats>
  }

  async getPayouts(params: AdminListParams) {
    return adminSdk.adminControllerListPayouts(params) as unknown as Promise<AdminPaginatedResponse<unknown>>
  }

  async retryPayout(payoutId: string, stepUpToken: string) {
    return adminSdk.adminControllerRetryPayout(payoutId, withStepUp(stepUpToken))
  }

  // --- Hackathons ---
  async getHackathonsStats() {
    return adminSdk.adminControllerGetHackathonStats() as unknown as Promise<HackathonAdminStats>
  }

  async getHackathons(params: AdminListParams) {
    return adminSdk.adminControllerListHackathons(params) as unknown as Promise<AdminPaginatedResponse<AdminHackathon>>
  }

  async createHackathon(data: AdminCreateHackathonDto, stepUpToken: string) {
    return adminSdk.adminControllerCreateHackathon(data, withStepUp(stepUpToken))
  }

  async updateHackathon(hackathonId: string, data: AdminEntityPayload, stepUpToken: string) {
    return adminSdk.adminControllerUpdateHackathon(hackathonId, data, withStepUp(stepUpToken))
  }

  async deleteHackathon(hackathonId: string, stepUpToken: string) {
    return adminSdk.adminControllerDeleteHackathon(hackathonId, withStepUp(stepUpToken))
  }

  // --- Funding Wallet ---
  async getFundingWallet() {
    return adminSdk.adminControllerGetFundingWallet() as unknown as Promise<FundingWalletResponse>
  }

  async updateFundingWallet(data: { fundingWalletId: string }, stepUpToken: string) {
    return adminSdk.adminControllerSetFundingWallet(data, withStepUp(stepUpToken))
  }

  async deleteFundingWallet(stepUpToken: string) {
    return adminSdk.adminControllerClearFundingWallet(withStepUp(stepUpToken))
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
