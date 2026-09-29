"use client";

import { useEffect, useState } from 'react'

interface PersistedStateOptions<T> {
  // When false, behaves like plain useState (no localStorage read/write)
  enabled?: boolean
  // Coerces stored values from older formats; return undefined to discard
  parse?: (value: unknown) => T | undefined
}

export function usePersistedState<T>(
  key: string,
  initialValue: T,
  { enabled = true, parse }: PersistedStateOptions<T> = {}
): [T, (value: T | ((val: T) => T)) => void] {
  // Use a function for initial state to avoid reading localStorage on server
  const [state, setState] = useState<T>(() => {
    if (!enabled || typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue
      const value = JSON.parse(item)
      return parse ? parse(value) ?? initialValue : value
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  useEffect(() => {
    if (enabled && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(state))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    }
  }, [enabled, key, state])

  return [state, setState]
}
