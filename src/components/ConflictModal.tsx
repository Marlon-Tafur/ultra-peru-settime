'use client'

import { useState } from 'react'
import { Artist, getStageColor } from '@/lib/artists-data'
import { formatTime } from '@/lib/utils'

export interface FavoriteRecord {
  artist_id: number
  custom_start: string | null
  custom_end: string | null
}

export interface ConflictArtist {
  record: FavoriteRecord
  artist: Artist
  effectiveStart: string
  effectiveEnd: string
}

interface Props {
  artistA: ConflictArtist
  artistB: ConflictArtist
  overlapStartMs: number
  overlapEndMs: number
  onSave: (
    aId: number, customEndA: string | null,
    bId: number, customStartB: string | null
  ) => Promise<void>
  onClose: () => void
}

function msToISO(ms: number): string {
  return new Date(ms).toISOString()
}

// Display Lima time (UTC-5) from any ISO string (UTC or offset-aware)
function displayTime(iso: string): string {
  const ms = new Date(iso).getTime()
  const limaDate = new Date(ms - 5 * 60 * 60 * 1000)
  const h = limaDate.getUTCHours().toString().padStart(2, '0')
  const m = limaDate.getUTCMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

function generateOptions(fromMs: number, toMs: number): { ms: number; label: string }[] {
  const STEP = 5 * 60 * 1000
  const opts: { ms: number; label: string }[] = []
  for (let t = fromMs; t <= toMs; t += STEP) {
    opts.push({ ms: t, label: displayTime(new Date(t).toISOString()) })
  }
  return opts
}

function overlapMinutes(startMs: number, endMs: number): number {
  return Math.round((endMs - startMs) / 60000)
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export default function ConflictModal({
  artistA,
  artistB,
  overlapStartMs,
  overlapEndMs,
  onSave,
  onClose,
}: Props) {
  // Default: split the overlap in half
  const halfwayMs = Math.round((overlapStartMs + overlapEndMs) / 2)

  const [customEndAMs, setCustomEndAMs] = useState(
    artistA.record.custom_end
      ? new Date(artistA.record.custom_end).getTime()
      : halfwayMs
  )
  const [customStartBMs, setCustomStartBMs] = useState(
    artistB.record.custom_start
      ? new Date(artistB.record.custom_start).getTime()
      : halfwayMs
  )
  const [saving, setSaving] = useState(false)

  const endAOptions = generateOptions(
    overlapStartMs,
    new Date(artistA.effectiveEnd).getTime()
  )
  const startBOptions = generateOptions(
    new Date(artistB.effectiveStart).getTime(),
    overlapEndMs
  )

  const colorA = getStageColor(artistA.artist.stage)
  const colorB = getStageColor(artistB.artist.stage)
  const overlapMins = overlapMinutes(overlapStartMs, overlapEndMs)

  async function handleSave() {
    setSaving(true)
    await onSave(
      artistA.artist.id,
      msToISO(customEndAMs),
      artistB.artist.id,
      msToISO(customStartBMs)
    )
    setSaving(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(255,140,0,0.3)',
          boxShadow: '0 0 40px rgba(255,140,0,0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Conflicto de Horario
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
              Solapamiento de {formatMinutes(overlapMins)}
            </p>
          </div>
        </div>

        {/* Artists comparison */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { ca: artistA, color: colorA },
            { ca: artistB, color: colorB },
          ].map(({ ca, color }) => (
            <div
              key={ca.artist.id}
              className="rounded-xl p-3"
              style={{
                background: `${color}10`,
                border: `1px solid ${color}40`,
              }}
            >
              <p
                className="text-xs font-black uppercase truncate"
                style={{ color }}
              >
                {ca.artist.stage}
              </p>
              <p className="text-xs font-bold text-white mt-1 leading-tight">
                {ca.artist.name}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 10, marginTop: 2 }}>
                {formatTime(ca.artist.startTime)} – {formatTime(ca.artist.endTime)}
              </p>
            </div>
          ))}
        </div>

        {/* Custom time selectors */}
        <div className="space-y-4 mb-6">
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Establecé tu horario
          </p>

          {/* Artist A — custom end */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: colorA }}
            />
            <span className="text-xs text-white font-semibold truncate flex-1">
              {artistA.artist.name}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: 10 }}>hasta</span>
            <select
              value={customEndAMs}
              onChange={(e) => setCustomEndAMs(Number(e.target.value))}
              className="rounded-lg px-2 py-1 text-xs font-bold"
              style={{
                background: 'var(--bg-secondary)',
                color: colorA,
                border: `1px solid ${colorA}40`,
                outline: 'none',
              }}
            >
              {endAOptions.map((o) => (
                <option key={o.ms} value={o.ms}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Artist B — custom start */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: colorB }}
            />
            <span className="text-xs text-white font-semibold truncate flex-1">
              {artistB.artist.name}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: 10 }}>desde</span>
            <select
              value={customStartBMs}
              onChange={(e) => setCustomStartBMs(Number(e.target.value))}
              className="rounded-lg px-2 py-1 text-xs font-bold"
              style={{
                background: 'var(--bg-secondary)',
                color: colorB,
                border: `1px solid ${colorB}40`,
                outline: 'none',
              }}
            >
              {startBOptions.map((o) => (
                <option key={o.ms} value={o.ms}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
            style={{
              background: 'var(--cyan)',
              color: '#0a0a0f',
              boxShadow: '0 0 15px rgba(0,212,255,0.3)',
            }}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
