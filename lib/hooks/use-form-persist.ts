'use client'

import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'

export function useFormPersist(
  key: string,
  form: UseFormReturn<any>,
  dependencies: any[] = []
) {
  // Load saved data on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedData = localStorage.getItem(key)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        // Reset form with saved data
        // We use reset instead of manually setting values to ensure form state is clean
        // but we verify if fields match current form schema implicitly by passing it
        // Merging might be safer if schema changed, but for now simple restore

        // Optionally only restore valid keys?
        // For now, let's just restore.

        // We might want to wait for initial default values if they are async?
        // But usually this runs after mount.

        // Check if we have data to restore
        if (Object.keys(parsed).length > 0) {
          // We can loop and set value, or reset. Reset is better for initializing content.
          // However, if defaultValues are present, we should merge?
          // The form might be empty initially.

          const currentValues = form.getValues()
          form.reset({ ...currentValues, ...parsed })
        }
      } catch (e) {
        console.error('Failed to parse saved form data', e)
      }
    }
  }, [key]) // Only run on mount (or key change)

  // Save data on changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const subscription = form.watch((value) => {
      localStorage.setItem(key, JSON.stringify(value))
    })

    return () => subscription.unsubscribe()
  }, [key, form, ...dependencies])

  const clearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  }

  return { clearStorage }
}
