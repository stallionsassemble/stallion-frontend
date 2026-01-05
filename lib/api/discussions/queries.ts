import {
  CreateDiscussionPayload,
  CreateReplyPayload,
  ToggleReactionPayload,
} from '@/lib/types/discussions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DiscussionsService } from './index'

export const DISCUSSION_KEYS = {
  all: ['discussions'] as const,
  bounty: (bountyId: string) =>
    [...DISCUSSION_KEYS.all, 'bounty', bountyId] as const,
  project: (projectId: string) =>
    [...DISCUSSION_KEYS.all, 'project', projectId] as const,
}

export function useBountyDiscussions(bountyId: string) {
  return useQuery({
    queryKey: DISCUSSION_KEYS.bounty(bountyId),
    queryFn: () => DiscussionsService.getBountyDiscussions(bountyId),
    enabled: !!bountyId,
  })
}

export function useProjectDiscussions(projectId: string) {
  return useQuery({
    queryKey: DISCUSSION_KEYS.project(projectId),
    queryFn: () => DiscussionsService.getProjectDiscussions(projectId),
    enabled: !!projectId,
  })
}

export function useCreateDiscussion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateDiscussionPayload) =>
      DiscussionsService.createDiscussion(payload),
    onSuccess: (_, variables) => {
      if (variables.bountyId) {
        queryClient.invalidateQueries({
          queryKey: DISCUSSION_KEYS.bounty(variables.bountyId),
        })
      }
      if (variables.projectId) {
        queryClient.invalidateQueries({
          queryKey: DISCUSSION_KEYS.project(variables.projectId),
        })
      }
    },
  })
}

export function useReplyToBountyDiscussion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      discussionId,
      payload,
    }: {
      discussionId: string
      payload: CreateReplyPayload
    }) => DiscussionsService.replyToBountyDiscussion(discussionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISCUSSION_KEYS.all }) // Ideally more specific
    },
  })
}

export function useReplyToProjectDiscussion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      discussionId,
      payload,
    }: {
      discussionId: string
      payload: CreateReplyPayload
    }) => DiscussionsService.replyToProjectDiscussion(discussionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISCUSSION_KEYS.all })
    },
  })
}

export function useToggleBountyReaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      discussionId,
      payload,
    }: {
      discussionId: string
      payload: ToggleReactionPayload
    }) =>
      DiscussionsService.toggleBountyDiscussionReaction(discussionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISCUSSION_KEYS.all })
    },
  })
}

export function useToggleProjectReaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      discussionId,
      payload,
    }: {
      discussionId: string
      payload: ToggleReactionPayload
    }) =>
      DiscussionsService.toggleProjectDiscussionReaction(discussionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISCUSSION_KEYS.all })
    },
  })
}

export function useToggleReplyReaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      replyId,
      payload,
    }: {
      replyId: string
      payload: ToggleReactionPayload
    }) => DiscussionsService.toggleReplyReaction(replyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISCUSSION_KEYS.all })
    },
  })
}
