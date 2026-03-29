import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from './index'

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.getDashboardStats(),
  })
}

export const useAdminUsersStats = () => {
  return useQuery({
    queryKey: ['admin', 'users', 'stats'],
    queryFn: () => adminService.getUsersStats(),
  })
}

export const useAdminUsers = (params: any) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminService.getUsers(params),
  })
}

export const useAdminBountiesStats = () => {
  return useQuery({
    queryKey: ['admin', 'bounties', 'stats'],
    queryFn: () => adminService.getBountiesStats(),
  })
}

export const useAdminBounties = (params: any) => {
  return useQuery({
    queryKey: ['admin', 'bounties', params],
    queryFn: () => adminService.getBounties(params),
  })
}

export const useAdminProjectsStats = () => {
  return useQuery({
    queryKey: ['admin', 'projects', 'stats'],
    queryFn: () => adminService.getProjectsStats(),
  })
}

export const useAdminProjects = (params: any) => {
  return useQuery({
    queryKey: ['admin', 'projects', params],
    queryFn: () => adminService.getProjects(params),
  })
}

export const useAdminPayoutsStats = () => {
  return useQuery({
    queryKey: ['admin', 'payouts', 'stats'],
    queryFn: () => adminService.getPayoutsStats(),
  })
}

export const useAdminPayouts = (params: any) => {
  return useQuery({
    queryKey: ['admin', 'payouts', params],
    queryFn: () => adminService.getPayouts(params),
  })
}

export const useAdminHackathonsStats = () => {
  return useQuery({
    queryKey: ['admin', 'hackathons', 'stats'],
    queryFn: () => adminService.getHackathonsStats(),
  })
}

export const useAdminHackathons = (params: any) => {
  return useQuery({
    queryKey: ['admin', 'hackathons', params],
    queryFn: () => adminService.getHackathons(params),
  })
}

export const useAdminFundingWallet = () => {
  return useQuery({
    queryKey: ['admin', 'funding-wallet'],
    queryFn: () => adminService.getFundingWallet(),
  })
}
