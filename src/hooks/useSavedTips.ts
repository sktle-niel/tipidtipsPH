import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'tipidtips_saved'

function getStored(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useSavedTips() {
  const [savedIds, setSavedIds] = useState<string[]>(getStored)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds))
  }, [savedIds])

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds])

  const toggle = useCallback((id: string) => {
    setSavedIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }, [])

  const clearAll = useCallback(() => setSavedIds([]), [])

  return { savedIds, isSaved, toggle, clearAll }
}
