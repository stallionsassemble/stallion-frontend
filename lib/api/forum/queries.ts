import {
  CreateCategoryPayload,
  CreateComment,
  CreatePost,
  CreateThreadPayload,
  UpdateThread,
} from '@/lib/types/forum'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DateRange } from 'react-day-picker'
import { toast } from 'sonner'
import { forumService } from './index'

// Categories
export function useGetCategories() {
  return useQuery({
    queryKey: ['forum', 'categories'],
    queryFn: () => forumService.getCategories(),
  })
}

export function useGetCategory(slug: string) {
  return useQuery({
    queryKey: ['forum', 'category', slug],
    queryFn: () => forumService.getCategory(slug),
    enabled: !!slug,
  })
}

export function useGetForumStats() {
  return useQuery({
    queryKey: ['forum', 'stats'],
    queryFn: () => forumService.getStats(),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      forumService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'categories'] })
      toast.success('Category created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category')
    },
  })
}

// Threads
export function useSearchThreads(
  q: string,
  categoryId?: string,
  orderBy?: string,
  dateRange?: DateRange
) {
  const from = dateRange?.from?.toISOString()
  const to = dateRange?.to?.toISOString()
  return useQuery({
    queryKey: ['forum', 'threads', 'search', q, categoryId, orderBy, from, to],
    queryFn: () => forumService.searchThreads(q, categoryId, orderBy, from, to),
  })
}

export function useGetThread(slug: string) {
  return useQuery({
    queryKey: ['forum', 'thread', slug],
    queryFn: () => forumService.getThread(slug),
    enabled: !!slug,
  })
}

export function useCreateThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateThreadPayload) =>
      forumService.createThread(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'threads'] })
      queryClient.invalidateQueries({ queryKey: ['forum', 'category'] })
      toast.success('Thread created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create thread')
    },
  })
}

export function useUpdateThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateThread }) =>
      forumService.updateThread(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['forum', 'thread', data.slug],
      })
      queryClient.invalidateQueries({ queryKey: ['forum', 'threads'] })
      toast.success('Thread updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update thread')
    },
  })
}

export function useDeleteThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => forumService.deleteThread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'threads'] })
      toast.success('Thread deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete thread')
    },
  })
}

// Posts
export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePost) => forumService.createPost(payload),
    onSuccess: (data) => {
      // Invalidate the thread to fetch new posts
      // We need the thread slug or id, but ideally we invalidate the specific thread query
      // Since createPost response includes threadId, we might need a way to look up slug or just invalidate broadly
      // For now, let's assume we refetch the thread we are on
      queryClient.invalidateQueries({ queryKey: ['forum', 'thread'] })
      toast.success('Post created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create post')
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      forumService.updatePost(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'thread'] })
      toast.success('Post updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update post')
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => forumService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'thread'] })
      toast.success('Post deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete post')
    },
  })
}

// Comments
export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateComment) => forumService.createComment(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['forum', 'post', variables.postId, 'comments'],
      })
      queryClient.invalidateQueries({ queryKey: ['forum', 'thread'] })
      toast.success('Comment added successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add comment')
    },
  })
}

export function useGetPostComments(postId: string) {
  return useQuery({
    queryKey: ['forum', 'post', postId, 'comments'],
    queryFn: () => forumService.getPostComments(postId),
    enabled: !!postId,
  })
}

export function useUpdateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      forumService.updateComment(id, content),
    onSuccess: () => {
      // Currently we don't have easy access to postId here to invalidate specific post comments
      // But usually `comments` query key includes postId.
      // We might need to invalidate all 'comments' or rely on parent component refetch
      queryClient.invalidateQueries({ queryKey: ['forum', 'post'] })
      toast.success('Comment updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update comment')
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => forumService.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'post'] })
      toast.success('Comment deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete comment')
    },
  })
}

// Reactions
export function useAddOrRemoveReaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, emoji }: { postId: string; emoji: string }) =>
      forumService.addOrRemoveReaction({ postId, emoji }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum', 'thread'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update reaction')
    },
  })
}

// Tags
export function useGetTags() {
  return useQuery({
    queryKey: ['forum', 'tags'],
    queryFn: () => forumService.getTags(),
  })
}

export function useGetTagThreads(slug: string) {
  return useQuery({
    queryKey: ['forum', 'tag', slug],
    queryFn: () => forumService.getThreadsByTag(slug),
    enabled: !!slug,
  })
}
