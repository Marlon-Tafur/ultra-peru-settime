'use client'

import Image from 'next/image'
import { Artist, Stage } from '@/lib/artists-data'
import {
  PX_PER_MIN,
  TOTAL_HEIGHT,
  STAGE_HEADER_H,
  HOUR_LABELS,
  minutesFromEventStart,
} from '@/lib/utils'
import ArtistBlock from './ArtistBlock'
import TimelineIndicator from './TimelineIndicator'

interface Props {
  stage: Stage
  artists: Artist[]
  favorites: Set<number>
  onToggle: (id: number) => void
  timelineY: number | null
  now: Date
}

export default function StageColumn({
  stage,
  artists,
  favorites,
  onToggle,
  timelineY,
  now,
}: Props) {
  return (
    <div className="flex flex-col min-w-0" style={{ flex: 1 }}>
      {/* ── Stage header (sticky) ── */}
      <div
        className="sticky top-0 flex flex-col items-center justify-center gap-1 shrink-0 border-b border-r"
        style={{
          height: STAGE_HEADER_H,
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border)',
          zIndex: 20,
        }}
      >
        <Image
          src={stage.logo}
          alt={stage.name}
          width={80}
          height={20}
          style={{ objectFit: 'contain', maxHeight: 20 }}
          unoptimized
        />
        <span
          style={{
            fontSize: 8,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: stage.color,
          }}
        >
          {stage.name}
        </span>
      </div>

      {/* ── Column body ── */}
      <div
        className="border-r"
        style={{
          position: 'relative',
          height: TOTAL_HEIGHT,
          borderColor: 'var(--border)',
        }}
      >
        {/* Hour grid lines */}
        {HOUR_LABELS.map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: i * 108,
              left: 0,
              right: 0,
              height: 1,
              background: 'rgba(255,255,255,0.04)',
              zIndex: 0,
            }}
          />
        ))}

        {/* Artist blocks */}
        {artists.map((artist) => {
          const top = minutesFromEventStart(artist.startTime) * PX_PER_MIN
          const endMin = minutesFromEventStart(artist.endTime)
          const startMin = minutesFromEventStart(artist.startTime)
          const height = (endMin - startMin) * PX_PER_MIN
          const nowMs = now.getTime()
          const startMs = new Date(artist.startTime).getTime()
          const endMs = new Date(artist.endTime).getTime()
          const isLive = nowMs >= startMs && nowMs < endMs
          const isPast = nowMs >= endMs

          return (
            <ArtistBlock
              key={artist.id}
              artist={artist}
              top={top}
              height={height}
              stageColor={stage.color}
              isFavorite={favorites.has(artist.id)}
              isLive={isLive}
              isPast={isPast}
              onToggle={() => onToggle(artist.id)}
            />
          )
        })}

        {/* Timeline indicator */}
        {timelineY !== null && <TimelineIndicator top={timelineY} />}
      </div>
    </div>
  )
}
