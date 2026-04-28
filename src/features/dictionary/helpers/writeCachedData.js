export function writeCachedData(data, key) {
  if (typeof window === 'undefined') return

  localStorage.setItem(
    key,
    JSON.stringify({
      data,
      updatedAt: Date.now(),
    })
  )
}
