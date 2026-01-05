import { api } from '@/lib/api'
import {
  CreateDiscussionPayload,
  CreateReplyPayload,
  Discussion,
  DiscussionReply,
  ToggleReactionPayload,
} from '@/lib/types/discussions'

export const DiscussionsService = {
  createDiscussion: async (
    payload: CreateDiscussionPayload
  ): Promise<Discussion> => {
    const { data } = await api.post('/discussions', payload)
    return data
  },

  getBountyDiscussions: async (bountyId: string): Promise<Discussion[]> => {
    const { data } = await api.get(`/discussions/bounty/${bountyId}`)
    return data
  },

  getProjectDiscussions: async (projectId: string): Promise<Discussion[]> => {
    const { data } = await api.get(`/discussions/project/${projectId}`)
    return data
  },

  replyToBountyDiscussion: async (
    discussionId: string,
    payload: CreateReplyPayload
  ): Promise<DiscussionReply> => {
    const { data } = await api.post(
      `/discussions/bounty/${discussionId}/reply`,
      payload
    )
    return data
  },

  replyToProjectDiscussion: async (
    discussionId: string,
    payload: CreateReplyPayload
  ): Promise<DiscussionReply> => {
    const { data } = await api.post(
      `/discussions/project/${discussionId}/reply`,
      payload
    )
    return data
  },

  toggleBountyDiscussionReaction: async (
    discussionId: string,
    payload: ToggleReactionPayload
  ): Promise<void> => {
    await api.post(`/discussions/bounty/${discussionId}/react`, payload)
  },

  toggleProjectDiscussionReaction: async (
    discussionId: string,
    payload: ToggleReactionPayload
  ): Promise<void> => {
    await api.post(`/discussions/project/${discussionId}/react`, payload)
  },

  toggleReplyReaction: async (
    replyId: string,
    payload: ToggleReactionPayload
  ): Promise<void> => {
    await api.post(`/discussions/reply/${replyId}/react`, payload)
  },
}
