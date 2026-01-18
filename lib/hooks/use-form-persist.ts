'use client'

import { useCallback, useEffect, useRef } from 'react'

/**
 * Hook to persist a state object to localStorage.
 * @param key The localStorage key to use.
 * @param values The current state object to save.
 * @param onLoad Callback function that receives the loaded data on mount. Use this to set your states.
 */
export function useFormPersist<T>(
  key: string,
  values: T,
  onLoad: (data: T) => void
) {
  const isLoaded = useRef(false)

  // Load saved data on mount
  useEffect(() => {
    if (isLoaded.current) return

    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        onLoad(parsed)
      } catch (e) {
        console.error('Failed to parse saved draft', e)
      }
    }
    isLoaded.current = true
  }, [key, onLoad]) // eslint-disable-line react-hooks/exhaustive-deps

  // Save data on change
  useEffect(() => {
    if (!isLoaded.current) return // Don't save before loading

    // Debounce write could be added, but relying on React's batching for now
    const handler = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(values))
    }, 500)

    return () => clearTimeout(handler)
  }, [key, values])

  // Expose a clear function
  const clearDraft = useCallback(() => {
    localStorage.removeItem(key)
  }, [key])

  return { clearDraft }
}
