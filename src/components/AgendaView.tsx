'use client'

import { Artist, getStageColor } from '@/lib/artists-data'
import { formatTime, getTimelineY } from '@/lib/utils'
import { FavoriteRecord } from './ConflictModal'

interface AgendaItem {
  artist: Artist
  record: FavoriteRecord
  effectiveStart: string
  effectiveEnd: string
  stageColor: string
}

interface Props {
  items: AgendaItem[]
  nowMs: number
}

export default function AgendaView({ items, nowMs }: Props) {
  const timelineY = getTimelineY(new Date(nowMs))

  // Sort by effective start time
  const sorted = [...items].sort(
    (a, b) => new Date(a.effectiveStart).getTime() - new Date(b.effectiveStart).getTime()
  )

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <span style={{ fontSize: 40 }}>⭐</span>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 }}>
          Agrega artistas desde el Set Times
        </p>
      </div>
    )
  }

  // Find where "now" falls in the list (index before which we insert the marker)
  let nowInsertIndex = -1
  if (timelineY !== null) {
    for (let i = 0; i < sorted.length; i++) {
      const endMs = new Date(sorted[i].effectiveEnd).getTime()
      if (nowMs < endMs) {
        nowInsertIndex = i
        break
      }
    }
    if (nowInsertIndex === -1) nowInsertIndex = sorted.length // all past
  }

  return (
    <div className="flex flex-col gap-0 px-3 py-3 max-w-2xl mx-auto w-full">
      {sorted.map((item, idx) => {
        const startMs = new Date(item.effectiveStart).getTime()
        const endMs = new Date(item.effectiveEnd).getTime()
        const isLive = nowMs >= startMs && nowMs < endMs
        const isPast = nowMs >= endMs
        const hasCustom = item.record.custom_start || item.record.custom_end

        return (
          <div key={item.artist.id}>
            {/* NOW marker inserted before the first non-past item */}
            {nowInsertIndex === idx && (
              <div className="flex items-center gap-2 my-2">
                <div
                  className="animate-pulse-glow flex-1 h-[2px]"
                  style={{
                    background: 'var(--cyan)',
                    boxShadow: '0 0 8px rgba(0,212,255,0.6)',
                  }}
                />
                <span
                  className="text-[9px] font-black uppercase tracking-widest shrink-0"
                  style={{ color: 'var(--cyan)' }}
                >
                  AHORA
                </span>
                <div
                  className="animate-pulse-glow flex-1 h-[2px]"
                  style={{
                    background: 'var(--cyan)',
                    boxShadow: '0 0 8px rgba(0,212,255,0.6)',
                  }}
                />
              </div>
            )}

            {/* Artist card */}
            <div
              className="flex gap-3 items-start py-3 border-b"
              style={{
                borderColor: 'var(--border)',
                opacity: isPast ? 0.4 : 1,
                filter: isPast ? 'grayscale(0.5)' : 'none',
                transition: 'opacity 0.3s',
              }}
            >
              {/* Stage color dot */}
              <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: item.stageColor,
                    boxShadow: isLive ? `0 0 8px ${item.stageColor}` : 'none',
                  }}
                />
                {/* Vertical line connecting to next item */}
                {idx < sorted.length - 1 && (
                  <div
                    className="w-px flex-1"
                    style={{
                      minHeight: 24,
                      background: `${item.stageColor}30`,
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {isLive && (
                      <span
                        className="animate-pulse-glow inline-block text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded mr-1"
                        style={{
                          color: item.stageColor,
                          background: `${item.stageColor}20`,
                          border: `1px solid ${item.stageColor}60`,
                        }}
                      >
                        LIVE
                      </span>
                    )}
                    <p
                      className="inline text-sm font-black uppercase"
                      style={{ color: isLive ? '#fff' : 'rgba(255,255,255,0.85)' }}
                    >
                      {item.artist.name}
                    </p>
                  </div>
                  {hasCustom && (
                    <span
                      title="Horario personalizado"
                      style={{ fontSize: 12, flexShrink: 0 }}
                    >
                      ✂️
                    </span>
                  )}
                </div>

                <p
                  className="text-xs mt-0.5"
                  style={{ color: item.stageColor, fontWeight: 700 }}
                >
                  {formatTime(item.effectiveStart)} → {formatTime(item.effectiveEnd)}
                  {hasCustom && (
                    <span
                      className="ml-1"
                      style={{ color: 'var(--text-secondary)', fontWeight: 400 }}
                    >
                      (original {formatTime(item.artist.startTime)}–{formatTime(item.artist.endTime)})
                    </span>
                  )}
                </p>

                <p
                  className="text-xs mt-0.5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.artist.stage}
                  {item.artist.genre !== '—' && (
                    <span> · {item.artist.genre}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )
      })}

      {/* NOW marker at the end if all are past */}
      {nowInsertIndex === sorted.length && sorted.length > 0 && (
        <div className="flex items-center gap-2 mt-2">
          <div
            className="animate-pulse-glow flex-1 h-[2px]"
            style={{ background: 'var(--cyan)', boxShadow: '0 0 8px rgba(0,212,255,0.6)' }}
          />
          <span
            className="text-[9px] font-black uppercase tracking-widest"
            style={{ color: 'var(--cyan)' }}
          >
            AHORA
          </span>
          <div
            className="animate-pulse-glow flex-1 h-[2px]"
            style={{ background: 'var(--cyan)', boxShadow: '0 0 8px rgba(0,212,255,0.6)' }}
          />
        </div>
      )}
    </div>
  )
}
