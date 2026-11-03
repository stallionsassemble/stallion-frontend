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
  FundingWalletResponse,
} from "@/lib/types/admin";
import { getStallionBackendAPI } from "@/lib/api/generated/admin/admin-sdk";
import { api } from "@/lib/api";
import { useAdminStore } from "@/lib/store/use-admin-store";
import type {
  AdminCreateHackathonDto,
  AdminCreateUserDto,
  AdminCreateUserDtoRole,
  StepUpPasskeyVerifyDtoResponse,
} from "@/lib/api/generated/admin/model";
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";

type AdminListParams = Record<string, unknown>;
type AdminEntityPayload = Record<string, unknown>;
type PasskeyAuthenticationOptions = {
  optionsJSON: PublicKeyCredentialRequestOptionsJSON;
  useBrowserAutofill?: boolean;
  verifyBrowserAutofillInput?: boolean;
};
type PasskeyAuthenticationResponse =
  AuthenticationResponseJSON | StepUpPasskeyVerifyDtoResponse;
type AdminStepUpHeader = {
  headers: {
    "x-admin-step-up-token": string;
  };
};

const adminSdk = getStallionBackendAPI();

const resolveStepUpToken = (stepUpToken?: string) =>
  stepUpToken || useAdminStore.getState().getValidStepUpToken?.() || "";

const withStepUp = (stepUpToken?: string): AdminStepUpHeader | undefined => {
  const token = resolveStepUpToken(stepUpToken);
  if (!token) return undefined;
  return { headers: { "x-admin-step-up-token": token } };
};

export interface AdminApplication {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  appliedAt: string;
  lookingForTeam: boolean;
  teamId: string | null;
  team: { id: string; name: string } | null;
  applicationData: Record<string, string | string[]> | null;
  reviewNote?: string | null;
  user: {
    id: string;
    email: string;
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    profilePicture?: string | null;
  };
}

export interface AdminHackathonWinner {
  id: string;
  position: number;
  prizeAmount: string;
  isPaid: boolean;
  paidAt: string | null;
  txHash: string | null;
  submission: { id: string; track: string | null };
  payout: {
    id: string;
    status:
      "PENDING_APPROVAL" | "PROCESSING" | "COMPLETED" | "FAILED" | "DISPUTED";
    txHash: string | null;
    metadata: { paymentNote?: string } | null;
  } | null;
  user: {
    id: string;
    username: string | null;
    email: string;
    wallet: { publicKey: string } | null;
    payoutMethods: { name: string; publicKey: string; isDefault: boolean }[];
  };
}

export interface AdminHackathonWinnersResponse {
  hackathon: {
    id: string;
    payoutMode: "CONTRACT" | "MANUAL";
    currency: string;
    resultsPublished: boolean;
  };
  winners: AdminHackathonWinner[];
}

export interface AdminReport {
  range: { from: string; to: string };
  summary: {
    newUsers: number;
    newContributors: number;
    newProjectOwners: number;
    bountiesCreated: number;
    projectsCreated: number;
    hackathonsCreated: number;
    payoutsCompleted: number;
    payoutsCompletedUsd: number;
    payoutsPending: number;
  };
  truncated: Record<
    "users" | "bounties" | "projects" | "hackathons" | "payouts",
    boolean
  >;
  users: Array<{
    id: string;
    name: string;
    username: string | null;
    email: string;
    companyName: string | null;
    role: string;
    status: string;
    country: string | null;
    joinedAt: string;
  }>;
  bounties: Array<{
    id: string;
    title: string;
    owner: string;
    reward: string;
    currency: string;
    status: string;
    submissions: number;
    winners: number;
    submissionDeadline: string;
    createdAt: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    owner: string;
    reward: string;
    status: string;
    peopleNeeded: number;
    accepted: number;
    applications: number;
    createdAt: string;
  }>;
  hackathons: Array<{
    id: string;
    title: string;
    host: string;
    budget: number | null;
    currency: string;
    payoutMode: string;
    status: string;
    participants: number;
    submissions: number;
    deadline: string;
    createdAt: string;
  }>;
  payouts: Array<{
    id: string;
    source: string;
    sourceTitle: string;
    contributor: string;
    amount: number | null;
    token: string;
    usdAmount: number | null;
    status: string;
    requestedAt: string;
    completedAt: string | null;
    txHash: string | null;
  }>;
}

export interface HackathonApplicationsResponse {
  data: AdminApplication[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  counts: {
    PENDING: number;
    ACCEPTED: number;
    REJECTED: number;
    WITHDRAWN: number;
    lookingForTeam: number;
    inTeam?: number;
  };
}

class AdminService {
  // --- Dashboard ---
  // Platform activity between two dates (`to` is exclusive), for the dashboard report export.
  async getReport(from: string, to: string) {
    const response = await api.get<AdminReport>("/admin/reports", {
      params: { from, to },
    });
    return response.data;
  }

  async getReportSummary(from: string, to: string) {
    const response = await api.get<Pick<AdminReport, "range" | "summary">>(
      "/admin/reports/summary",
      {
        params: { from, to },
      },
    );
    return response.data;
  }

  async getDashboardStats() {
    return adminSdk.adminControllerGetDashboard() as unknown as Promise<AdminDashboardStats>;
  }

  // --- Users ---
  async getUsersStats() {
    return adminSdk.adminControllerGetUserStats() as unknown as Promise<UserAdminStats>;
  }

  async getUsers(params: AdminListParams) {
    return adminSdk.adminControllerListUsers(params) as unknown as Promise<
      AdminPaginatedResponse<AdminUser>
    >;
  }

  async createUser(
    data: {
      email: string;
      role: string;
      firstName?: string;
      lastName?: string;
      username?: string;
    },
    stepUpToken?: string,
  ) {
    const payload: AdminCreateUserDto = {
      email: data.email,
      role: data.role as AdminCreateUserDtoRole,
    };

    return adminSdk.adminControllerCreateUser(payload, withStepUp(stepUpToken));
  }

  async reset2fa(userId: string, stepUpToken?: string) {
    return adminSdk.adminControllerResetUser2FA(
      userId,
      withStepUp(stepUpToken),
    );
  }

  async makeAdmin(userId: string, stepUpToken?: string) {
    return adminSdk.adminControllerMakeAdmin(userId, withStepUp(stepUpToken));
  }

  async suspendUser(
    userId: string,
    data: { indefinite?: boolean; durationHours?: number; reason: string },
    stepUpToken?: string,
  ) {
    return adminSdk.adminControllerSuspendUser(
      userId,
      data,
      withStepUp(stepUpToken),
    );
  }

  async banUser(
    userId: string,
    data: { reason: string },
    stepUpToken?: string,
  ) {
    return adminSdk.adminControllerBanUser(
      userId,
      data,
      withStepUp(stepUpToken),
    );
  }

  // --- Bounties ---
  async getBountiesStats() {
    return adminSdk.adminControllerGetBountyStats() as unknown as Promise<BountyAdminStats>;
  }

  async getBounties(params: AdminListParams) {
    return adminSdk.adminControllerListBounties(params) as unknown as Promise<
      AdminPaginatedResponse<AdminBounty>
    >;
  }

  async featureBounty(
    bountyId: string,
    isFeatured: boolean,
    stepUpToken?: string,
  ) {
    return adminSdk.adminControllerToggleBountyFeature(
      bountyId,
      { isFeatured },
      withStepUp(stepUpToken),
    );
  }

  async updateBounty(
    bountyId: string,
    data: AdminEntityPayload,
    stepUpToken?: string,
  ) {
    return adminSdk.adminControllerUpdateBounty(
      bountyId,
      data,
      withStepUp(stepUpToken),
    );
  }

  async deleteBounty(bountyId: string, stepUpToken?: string) {
    return adminSdk.adminControllerDeleteBounty(
      bountyId,
      withStepUp(stepUpToken),
    );
  }

  // --- Projects ---
  async getProjectsStats() {
    return adminSdk.adminControllerGetProjectStats() as unknown as Promise<BountyAdminStats>;
  }

  async getProjects(params: AdminListParams) {
    return adminSdk.adminControllerListProjects(params) as unknown as Promise<
      AdminPaginatedResponse<unknown>
    >;
  }

  async featureProject(
    projectId: string,
    isFeatured: boolean,
    stepUpToken?: string,
  ) {
    return adminSdk.adminControllerToggleProjectFeature(
      projectId,
      { isFeatured },
      withStepUp(stepUpToken),
    );
  }

  async updateProject(
    projectId: string,
    data: AdminEntityPayload,
    stepUpToken?: string,
  ) {
    return adminSdk.adminControllerUpdateProject(
      projectId,
      data,
      withStepUp(stepUpToken),
    );
  }

  async deleteProject(projectId: string, stepUpToken?: string) {
    return adminSdk.adminControllerDeleteProject(
      projectId,
      withStepUp(stepUpToken),
    );
  }

  // --- Payouts ---
  async getPayoutsStats() {
    return adminSdk.adminControllerGetPayoutStats() as unknown as Promise<PayoutAdminStats>;
  }

  async getPayouts(params: AdminListParams) {
    return adminSdk.adminControllerListPayouts(params) as unknown as Promise<
      AdminPaginatedResponse<unknown>
    >;
  }

  async retryPayout(payoutId: string, stepUpToken?: string) {
    return adminSdk.adminControllerRetryPayout(
      payoutId,
      withStepUp(stepUpToken),
    );
  }

  // --- Hackathons ---
  async getHackathonsStats() {
    return adminSdk.adminControllerGetHackathonStats() as unknown as Promise<HackathonAdminStats>;
  }

  async getHackathons(params: AdminListParams) {
    return adminSdk.adminControllerListHackathons(params) as unknown as Promise<
      AdminPaginatedResponse<AdminHackathon>
    >;
  }

  async createHackathon(data: AdminCreateHackathonDto, stepUpToken?: string) {
    return adminSdk.adminControllerCreateHackathon(
      data,
      withStepUp(stepUpToken),
    );
  }

  async updateHackathon(
    hackathonId: string,
    data: AdminEntityPayload,
    stepUpToken?: string,
  ) {
    return adminSdk.adminControllerUpdateHackathon(
      hackathonId,
      data,
      withStepUp(stepUpToken),
    );
  }

  async deleteHackathon(hackathonId: string, stepUpToken?: string) {
    return adminSdk.adminControllerDeleteHackathon(
      hackathonId,
      withStepUp(stepUpToken),
    );
  }

  // Cancels an on-chain hackathon that has no database record and refunds its escrow.
  async recoverHackathonEscrow(
    contractHackathonId: string,
    stepUpToken?: string,
  ) {
    const response = await api.post<{ refundedAmount: string; txHash: string }>(
      "/admin/hackathons/recover-escrow",
      { contractHackathonId },
      withStepUp(stepUpToken),
    );
    return response.data;
  }

  // --- Hackathon payouts (MANUAL hackathons) ---
  async getHackathonWinners(hackathonId: string) {
    const response = await api.get<AdminHackathonWinnersResponse>(
      `/admin/hackathons/${hackathonId}/winners`,
    );
    return response.data;
  }

  async markHackathonWinnerPaid(
    hackathonId: string,
    winnerId: string,
    payload: { txHash?: string; note?: string },
    stepUpToken?: string,
  ) {
    const response = await api.post(
      `/admin/hackathons/${hackathonId}/winners/${winnerId}/mark-paid`,
      payload,
      withStepUp(stepUpToken),
    );
    return response.data;
  }

  // --- Hackathon applications ---
  async getHackathonApplications(
    hackathonId: string,
    params: Record<string, unknown> = {},
  ) {
    const response = await api.get<HackathonApplicationsResponse>(
      `/admin/hackathons/${hackathonId}/applications`,
      { params },
    );
    return response.data;
  }

  async reviewHackathonApplication(
    hackathonId: string,
    participantId: string,
    payload: { decision: "ACCEPTED" | "REJECTED"; note?: string },
    stepUpToken?: string,
  ) {
    const response = await api.post(
      `/admin/hackathons/${hackathonId}/applications/${participantId}/review`,
      payload,
      withStepUp(stepUpToken),
    );
    return response.data;
  }

  async groupHackathonApplicants(
    hackathonId: string,
    payload: { teamName: string; participantIds: string[] },
    stepUpToken?: string,
  ) {
    const response = await api.post(
      `/admin/hackathons/${hackathonId}/teams`,
      payload,
      withStepUp(stepUpToken),
    );
    return response.data;
  }

  // --- Funding Wallet ---
  async getFundingWallet() {
    return adminSdk.adminControllerGetFundingWallet() as unknown as Promise<FundingWalletResponse>;
  }

  async updateFundingWallet(
    data: { fundingWalletId: string },
    stepUpToken?: string,
  ) {
    return adminSdk.adminControllerSetFundingWallet(
      data,
      withStepUp(stepUpToken),
    );
  }

  async deleteFundingWallet(stepUpToken?: string) {
    return adminSdk.adminControllerClearFundingWallet(withStepUp(stepUpToken));
  }

  // --- Step-Up ---
  async stepUpTotp(code: string) {
    return adminSdk.adminControllerVerifyTotpStepUp({
      code,
    }) as Promise<StepUpResponse>;
  }

  async stepUpPasskeyOptions() {
    return adminSdk.adminControllerGetPasskeyStepUpOptions() as unknown as Promise<PasskeyAuthenticationOptions>;
  }

  async stepUpPasskeyVerify(response_data: PasskeyAuthenticationResponse) {
    return adminSdk.adminControllerVerifyPasskeyStepUp(
      { response: response_data as StepUpPasskeyVerifyDtoResponse },
      undefined,
    ) as Promise<StepUpResponse>;
  }
}

export const adminService = new AdminService();
