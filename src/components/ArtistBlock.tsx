'use client'

import { useState } from 'react'
import { Artist } from '@/lib/artists-data'
import { formatTime } from '@/lib/utils'

interface Props {
  artist: Artist
  top: number
  height: number
  stageColor: string
  isFavorite: boolean
  isLive: boolean
  isPast: boolean
  onToggle: () => void
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
}: Props) {
  const [hovered, setHovered] = useState(false)
  const [toggling, setToggling] = useState(false)

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    setToggling(true)
    setTimeout(() => setToggling(false), 250)
    onToggle()
  }

  const showTime = height >= 40
  const showGenre = height >= 68

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top,
        left: 2,
        right: 2,
        height: height - 2,
        overflow: 'hidden',
        borderRadius: 6,
        border: isLive
          ? `1px solid ${stageColor}`
          : `1px solid var(--border)`,
        boxShadow: isLive
          ? `0 0 12px ${stageColor}60, inset 0 0 20px ${stageColor}10`
          : hovered
          ? `0 0 8px ${stageColor}30`
          : 'none',
        opacity: isPast ? 0.45 : 1,
        filter: isPast ? 'grayscale(0.6)' : 'none',
        transition: 'box-shadow 0.2s, opacity 0.3s, filter 0.3s',
        cursor: 'default',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${artist.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: hovered ? 0.35 : 0.18,
          transition: 'opacity 0.2s',
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLive
            ? `linear-gradient(135deg, ${stageColor}18 0%, rgba(10,10,15,0.7) 100%)`
            : 'rgba(10,10,15,0.65)',
        }}
      />

      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: stageColor,
          opacity: isLive ? 1 : 0.5,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '5px 8px 5px 10px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          {/* Live badge */}
          {isLive && (
            <span
              className="animate-pulse-glow"
              style={{
                display: 'inline-block',
                fontSize: 8,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: stageColor,
                background: `${stageColor}20`,
                border: `1px solid ${stageColor}80`,
                borderRadius: 3,
                padding: '1px 4px',
                marginBottom: 2,
              }}
            >
              LIVE
            </span>
          )}

          <p
            style={{
              color: '#fff',
              fontWeight: 800,
              fontSize: 10,
              textTransform: 'uppercase',
              lineHeight: 1.2,
              letterSpacing: '0.03em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: height < 50 ? 'nowrap' : 'normal',
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
                letterSpacing: '0.02em',
              }}
            >
              {formatTime(artist.startTime)} – {formatTime(artist.endTime)}
            </p>
          )}

          {showGenre && artist.genre !== '—' && (
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: 9,
                marginTop: 1,
              }}
            >
              {artist.genre}
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button
            onClick={handleToggle}
            title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            style={{
              fontSize: 12,
              lineHeight: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transform: toggling ? 'scale(1.5)' : 'scale(1)',
              transition: 'transform 0.15s',
            }}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>

          {artist.spotifyUrl && (
            <a
              href={artist.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Abrir en Spotify"
              style={{
                fontSize: 10,
                color: '#1DB954',
                lineHeight: 1,
                textDecoration: 'none',
              }}
            >
              ♫
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
