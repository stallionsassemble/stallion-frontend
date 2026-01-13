'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface Winner {
  submissionId: string
  userId: string
  name: string
  avatar?: string
  position: number // 1 = 1st place, 2 = 2nd place, etc.
  amount: number
  feedback?: string
  rating?: number
}

interface UseBountyWinnersReturn {
  winners: Winner[]
  addWinner: (winner: Winner) => void
  removeWinner: (position: number) => void
  updateWinner: (position: number, updates: Partial<Winner>) => void
  clearWinners: () => void
  getAvailablePositions: (totalPositions: number) => number[]
  isPositionTaken: (position: number) => boolean
}

const STORAGE_KEY_PREFIX = 'bounty-winners-'

export function useBountyWinners(bountyId: string): UseBountyWinnersReturn {
  const storageKey = `${STORAGE_KEY_PREFIX}${bountyId}`

  // Initialize from localStorage
  const [winners, setWinners] = useState<Winner[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('Failed to load winners from localStorage', e)
      return []
    }
  })

  // Handle bountyId changes (sync with new storage key)
  // Skip initial load as it's handled by useState
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setWinners(JSON.parse(stored))
      } else {
        setWinners([])
      }
    } catch (e) {
      console.error('Failed to load winners from localStorage', e)
    }
  }, [storageKey])

  // Persist to localStorage on change
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(storageKey, JSON.stringify(winners))
    } catch (e) {
      console.error('Failed to save winners to localStorage', e)
    }
  }, [winners, storageKey])

  const addWinner = useCallback((winner: Winner) => {
    setWinners((prev) => {
      // Remove any existing winner at this position
      const filtered = prev.filter((w) => w.position !== winner.position)
      // Also prevent same user from winning multiple positions
      const withoutDuplicate = filtered.filter(
        (w) => w.userId !== winner.userId
      )
      return [...withoutDuplicate, winner].sort(
        (a, b) => a.position - b.position
      )
    })
  }, [])

  const removeWinner = useCallback((position: number) => {
    setWinners((prev) => prev.filter((w) => w.position !== position))
  }, [])

  const updateWinner = useCallback(
    (position: number, updates: Partial<Winner>) => {
      setWinners((prev) =>
        prev.map((w) => (w.position === position ? { ...w, ...updates } : w))
      )
    },
    []
  )

  const clearWinners = useCallback(() => {
    setWinners([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey)
    }
  }, [storageKey])

  const getAvailablePositions = useCallback(
    (totalPositions: number): number[] => {
      const taken = new Set(winners.map((w) => w.position))
      return Array.from({ length: totalPositions }, (_, i) => i + 1).filter(
        (pos) => !taken.has(pos)
      )
    },
    [winners]
  )

  const isPositionTaken = useCallback(
    (position: number): boolean => {
      return winners.some((w) => w.position === position)
    },
    [winners]
  )

  return {
    winners,
    addWinner,
    removeWinner,
    updateWinner,
    clearWinners,
    getAvailablePositions,
    isPositionTaken,
  }
}
