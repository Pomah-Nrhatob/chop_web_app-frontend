// src/hooks/useClickOutside.ts
import { RefObject, useEffect } from 'react'

export function useClickOutside(ref, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (event) => {
      const target = event.target
      if (ref.current && !ref.current.contains(target)) {
        handler(event)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [ref, handler, enabled])
}
