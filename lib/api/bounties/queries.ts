import {
  ApplyToBountyDto,
  CreateBountyDto,
  EmergencyWithdrawDto,
  GetAllBountiesPayload,
  SelectWinnersDto,
  UpdateAdminDto,
  UpdateBountyDto,
  UpdateFeeAccountDto,
  UpdateSubmissionDto,
} from '@/lib/types/bounties'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { bountyService } from './index'

export function useGetSupportedCurrencies() {
  return useQuery({
    queryKey: ['supported-currencies'],
    queryFn: () => bountyService.getSupportedCurrencies(),
  })
}

export function useGetAllBounties(params?: GetAllBountiesPayload) {
  return useQuery({
    queryKey: ['bounties', 'all', params],
    queryFn: () => bountyService.getAllBounties(params),
  })
}

export function useGetMyBounties() {
  return useQuery({
    queryKey: ['bounties', 'my'],
    queryFn: () => bountyService.getMyBounties(),
  })
}

export function useCreateBounty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBountyDto) =>
      bountyService.createBounty(payload),
    onSuccess: () => {
      toast.success('Bounty created successfully')
      queryClient.invalidateQueries({ queryKey: ['bounties'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create bounty')
    },
  })
}

export function useUpdateBounty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBountyDto }) =>
      bountyService.updateBounty(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Bounty updated successfully')
      queryClient.invalidateQueries({ queryKey: ['bounty', id] })
      queryClient.invalidateQueries({ queryKey: ['bounties'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update bounty')
    },
  })
}

export function useApplyToBounty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApplyToBountyDto }) =>
      bountyService.applyToBounty(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Application submitted successfully')
      queryClient.invalidateQueries({ queryKey: ['bounty', id] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to apply')
    },
  })
}

export function useUpdateSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateSubmissionDto
    }) => bountyService.updateSubmission(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Submission updated successfully')
      queryClient.invalidateQueries({ queryKey: ['bounty', id] })
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to update submission'
      )
    },
  })
}

export function useGetBounty(id: string) {
  return useQuery({
    queryKey: ['bounty', id],
    queryFn: () => bountyService.getBounty(id),
    enabled: !!id,
  })
}

export function useGetBountyWinners(id: string) {
  return useQuery({
    queryKey: ['bounty', id, 'winners'],
    queryFn: () => bountyService.getWinners(id),
    enabled: !!id,
  })
}

export function useGetBountiesByUser(userId: string) {
  return useQuery({
    queryKey: ['bounties', 'user', userId],
    queryFn: () => bountyService.getBountiesByUser(userId),
    enabled: !!userId,
  })
}

export function useGetMyBountySubmissions() {
  return useQuery({
    queryKey: ['bounties', 'submissions', 'my'],
    queryFn: () => bountyService.getMySubmissions(),
  })
}

export function useGetSubmissions(id: string) {
  return useQuery({
    queryKey: ['bounty', id, 'submissions'],
    queryFn: () => bountyService.getDetailedSubmissions(id),
    enabled: !!id,
  })
}

export function useSelectWinners() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SelectWinnersDto }) =>
      bountyService.selectWinners(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Winners selected successfully')
      queryClient.invalidateQueries({ queryKey: ['bounty', id] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to select winners')
    },
  })
}

// Admin Hooks
export function useUpdateContractAdmin() {
  return useMutation({
    mutationFn: (payload: UpdateAdminDto) =>
      bountyService.updateContractAdmin(payload),
    onSuccess: () => toast.success('Admin updated successfully'),
    onError: (error: any) =>
      toast.error(error.response?.data?.message || 'Failed to update admin'),
  })
}

export function useUpdateFeeAccount() {
  return useMutation({
    mutationFn: (payload: UpdateFeeAccountDto) =>
      bountyService.updateFeeAccount(payload),
    onSuccess: () => toast.success('Fee account updated successfully'),
    onError: (error: any) =>
      toast.error(
        error.response?.data?.message || 'Failed to update fee account'
      ),
  })
}

export function useEmergencyWithdraw() {
  return useMutation({
    mutationFn: (payload: EmergencyWithdrawDto) =>
      bountyService.emergencyWithdraw(payload),
    onSuccess: () => toast.success('Emergency withdraw initiated'),
    onError: (error: any) =>
      toast.error(error.response?.data?.message || 'Failed to withdraw'),
  })
}

export function useCheckJudgingDeadline() {
  return useMutation({
    mutationFn: (id: string) => bountyService.checkJudgingDeadline(id),
    onSuccess: () => toast.success('Judging deadline checked'),
    onError: (error: any) =>
      toast.error(error.response?.data?.message || 'Check failed'),
  })
}
