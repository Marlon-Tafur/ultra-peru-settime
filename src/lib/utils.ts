import { EVENT_START } from './artists-data'

export const PX_PER_MIN = 1.8
export const TOTAL_HEIGHT = 720 * PX_PER_MIN // 1296px (12h)
export const STAGE_HEADER_H = 56 // px

export function minutesFromEventStart(isoTime: string): number {
  return (new Date(isoTime).getTime() - EVENT_START.getTime()) / 60000
}

// Extract "15:00" directly from "2026-05-02T15:00:00-05:00"
export function formatTime(iso: string): string {
  return iso.substring(11, 16)
}

export function getTimelineY(now: Date): number | null {
  const start = EVENT_START
  const end = new Date('2026-05-03T03:00:00-05:00')
  if (now < start || now > end) return null
  const elapsed = (now.getTime() - start.getTime()) / 60000
  return elapsed * PX_PER_MIN
}

// ["15:00", "16:00", ..., "03:00"] — 13 labels
export const HOUR_LABELS = Array.from({ length: 13 }, (_, i) => {
  const h = (15 + i) % 24
  return `${h.toString().padStart(2, '0')}:00`
})
