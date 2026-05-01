const KEY = 'ultra-peru-favorites'

export interface FavoriteRecord {
  artist_id: number
  custom_start: string | null
  custom_end: string | null
}

export function loadFavorites(): FavoriteRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as FavoriteRecord[]) : []
  } catch {
    return []
  }
}

export function saveFavorites(records: FavoriteRecord[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(records))
}

export function toggleFavoriteLocal(records: FavoriteRecord[], artistId: number): FavoriteRecord[] {
  const exists = records.some((r) => r.artist_id === artistId)
  const updated = exists
    ? records.filter((r) => r.artist_id !== artistId)
    : [...records, { artist_id: artistId, custom_start: null, custom_end: null }]
  saveFavorites(updated)
  return updated
}

export function updateCustomTimes(
  records: FavoriteRecord[],
  aId: number,
  customEndA: string | null,
  bId: number,
  customStartB: string | null
): FavoriteRecord[] {
  const updated = records.map((r) => {
    if (r.artist_id === aId) return { ...r, custom_end: customEndA }
    if (r.artist_id === bId) return { ...r, custom_start: customStartB }
    return r
  })
  saveFavorites(updated)
  return updated
}
