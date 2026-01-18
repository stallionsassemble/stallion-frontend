'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type BookmarkType = 'bounty' | 'project'

interface BookmarkItem {
  id: string
  type: BookmarkType
  savedAt: string
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('stallion_bookmarks')
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse bookmarks', e)
      }
    }
    setIsLoaded(true)
  }, [])

  const saveBookmarks = (newBookmarks: BookmarkItem[]) => {
    setBookmarks(newBookmarks)
    localStorage.setItem('stallion_bookmarks', JSON.stringify(newBookmarks))
    // Dispatch event for other components to update if needed (simple observer)
    window.dispatchEvent(new Event('bookmarks-updated'))
  }

  const toggleBookmark = (id: string, type: BookmarkType) => {
    const exists = bookmarks.find((b) => b.id === id && b.type === type)

    if (exists) {
      const filtered = bookmarks.filter(
        (b) => !(b.id === id && b.type === type)
      )
      saveBookmarks(filtered)
      toast.success('Removed from bookmarks')
    } else {
      const newItem: BookmarkItem = {
        id,
        type,
        savedAt: new Date().toISOString(),
      }
      saveBookmarks([...bookmarks, newItem])
      toast.success('Added to bookmarks')
    }
  }

  const isBookmarked = (id: string, type: BookmarkType) => {
    return bookmarks.some((b) => b.id === id && b.type === type)
  }

  return { bookmarks, toggleBookmark, isBookmarked, isLoaded }
}
