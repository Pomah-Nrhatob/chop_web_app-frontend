export function readCachedData(key, cachTime) {
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed || !parsed.updatedAt || !parsed.data) return null

    const isExpired = Date.now() - parsed.updatedAt > cachTime
    if (isExpired) return null

    return parsed.data
  } catch {
    return null
  }
}
