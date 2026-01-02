import { PayoutMethodPayload } from '@/lib/types/wallet'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { walletService } from './index'

export function useGetWalletBalances() {
  return useQuery({
    queryKey: ['wallet-balances'],
    queryFn: async () => {
      try {
        return await walletService.getWalletBalances()
      } catch (error: any) {
        if (error.response?.status === 404) {
          return {
            balance: 0,
            availableBalance: 0,
            currency: 'USD',
          }
        }
        throw error
      }
    },
  })
}

export function useGetTransactions() {
  return useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: () => walletService.getTransactions(),
  })
}

export function useGetPayoutMethods() {
  return useQuery({
    queryKey: ['payout-methods'],
    queryFn: () => walletService.getPayoutMethods(),
  })
}

export function useCreatePayoutMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PayoutMethodPayload) =>
      walletService.createPayoutMethod(payload),
    onSuccess: () => {
      toast.success('Payout method added successfully')
      queryClient.invalidateQueries({ queryKey: ['payout-methods'] })
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to add payout method'
      )
    },
  })
}

export function useDeletePayoutMethod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => walletService.deletePayoutMethod(id),
    onSuccess: () => {
      toast.success('Payout method removed successfully')
      queryClient.invalidateQueries({ queryKey: ['payout-methods'] })
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to remove payout method'
      )
    },
  })
}

export function useSyncWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => walletService.syncWallet(),
    onSuccess: () => {
      toast.success('Wallet synced successfully')
      queryClient.invalidateQueries({ queryKey: ['wallet-balances'] })
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] })
    },
    onError: (error: any) => {
      toast.error('Failed to sync wallet')
    },
  })
}

export function useWithdrawFunds() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: any) => walletService.withdrawFund(payload),
    onSuccess: () => {
      toast.success('Withdrawal initiated successfully')
      queryClient.invalidateQueries({ queryKey: ['wallet-balances'] })
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to withdraw funds')
    },
  })
}
export function useSetTrustline() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (currencyCode: string) =>
      walletService.setTrustline(currencyCode),
    onSuccess: () => {
      toast.success('Trustline set successfully')
      queryClient.invalidateQueries({ queryKey: ['wallet-balances'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to set trustline')
    },
  })
}

export function useGetDepositAddress() {
  return useQuery({
    queryKey: ['wallet-deposit-address'],
    queryFn: () => walletService.getDepositAddress(),
  })
}
