'use client'

import { useState } from 'react'
import { Artist } from '@/lib/artists-data'
import { formatTime, minutesFromEventStart, PX_PER_MIN } from '@/lib/utils'

interface Props {
  artist: Artist
  top: number
  height: number
  stageColor: string
  isFavorite: boolean
  isLive: boolean
  isPast: boolean
  onToggle: () => void
  customStart?: string | null
  customEnd?: string | null
}

export default function ArtistBlock({
  artist,
  top,
  height,
  stageColor,
  isFavorite,
  isLive,
  isPast,
  onToggle,
  customStart,
  customEnd,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const [toggling, setToggling] = useState(false)

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    setToggling(true)
    setTimeout(() => setToggling(false), 250)
    onToggle()
  }

  const showTime = height >= 44
  const showGenre = height >= 84

  // Cut overlays: dims the part of the set that was trimmed via conflict resolution
  const startMin = minutesFromEventStart(artist.startTime)
  const endMin = minutesFromEventStart(artist.endTime)
  const topCutPx = customStart
    ? Math.max(0, (minutesFromEventStart(customStart) - startMin) * PX_PER_MIN)
    : 0
  const bottomCutPx = customEnd
    ? Math.max(0, (endMin - minutesFromEventStart(customEnd)) * PX_PER_MIN)
    : 0

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={isLive ? 'animate-live-border' : ''}
      style={{
        position: 'absolute',
        top,
        left: 4,
        right: 4,
        height: height - 4,
        overflow: 'hidden',
        borderRadius: 8,
        border: isLive
          ? `1.5px solid ${stageColor}`
          : isFavorite
          ? `1px solid ${stageColor}55`
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: isLive
          ? `0 0 18px ${stageColor}60`
          : hovered
          ? `0 0 12px ${stageColor}35`
          : 'none',
        opacity: isPast ? 0.38 : 1,
        filter: isPast ? 'grayscale(0.7)' : 'none',
        transition: 'box-shadow 0.25s, opacity 0.3s',
        cursor: 'default',
      }}
    >
      {/* Background image — visible, not hidden */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${artist.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: hovered ? 0.68 : 0.52,
          transition: 'opacity 0.2s',
        }}
      />

      {/* Gradient overlay — only bottom, so image stays visible at top */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.0) 100%)',
        }}
      />

      {/* Top cut overlay — part trimmed from start */}
      {topCutPx > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: topCutPx,
            background: 'rgba(0,0,0,0.68)',
            borderBottom: '1px dashed rgba(255,255,255,0.18)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Bottom cut overlay — part trimmed from end */}
      {bottomCutPx > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: bottomCutPx,
            background: 'rgba(0,0,0,0.68)',
            borderTop: '1px dashed rgba(255,255,255,0.18)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Heart button — top right */}
      <button
        onClick={handleToggle}
        title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        style={{
          position: 'absolute',
          top: 7,
          right: 7,
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: isFavorite ? `${stageColor}22` : 'rgba(0,0,0,0.45)',
          border: isFavorite ? `1px solid ${stageColor}80` : '1px solid rgba(255,255,255,0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: toggling ? 'scale(1.4)' : 'scale(1)',
          transition: 'transform 0.15s, background 0.2s',
          zIndex: 3,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          flexShrink: 0,
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={isFavorite ? stageColor : 'none'}
          stroke={isFavorite ? stageColor : 'rgba(255,255,255,0.85)'}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Content — pinned to bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '6px 9px 7px 9px',
          zIndex: 2,
        }}
      >
        {/* Live badge */}
        {isLive && (
          <span
            className="animate-pulse-glow"
            style={{
              display: 'inline-block',
              fontSize: 7,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: stageColor,
              background: `${stageColor}22`,
              border: `1px solid ${stageColor}80`,
              borderRadius: 3,
              padding: '1px 5px',
              marginBottom: 3,
            }}
          >
            LIVE
          </span>
        )}

        <p
          style={{
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 11,
            textTransform: 'uppercase',
            lineHeight: 1.2,
            letterSpacing: '0.04em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: height < 64 ? 'nowrap' : 'normal',
            margin: 0,
          }}
        >
          {artist.name}
        </p>

        {showTime && (
          <p
            style={{
              color: stageColor,
              fontSize: 9,
              fontWeight: 700,
              marginTop: 2,
              letterSpacing: '0.03em',
            }}
          >
            {formatTime(artist.startTime)} – {formatTime(artist.endTime)}
          </p>
        )}

        {showGenre && artist.genre !== '—' && (
          <p
            style={{
              color: 'rgba(255,255,255,0.42)',
              fontSize: 8,
              marginTop: 1,
              letterSpacing: '0.02em',
            }}
          >
            {artist.genre}
          </p>
        )}
      </div>
    </div>
  )
}
