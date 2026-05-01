'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ARTISTS, STAGES, getArtistsByStage, getStageColor } from '@/lib/artists-data'
import {
  HOUR_LABELS,
  STAGE_HEADER_H,
  TOTAL_HEIGHT,
  getTimelineY,
} from '@/lib/utils'
import StageColumn from '@/components/StageColumn'
import AgendaView from '@/components/AgendaView'
import ConflictModal, {
  FavoriteRecord,
  ConflictArtist,
} from '@/components/ConflictModal'
import ShareButton from '@/components/ShareButton'
import { createClient } from '@/lib/supabase'

type ViewMode = 'grid' | 'agenda'

interface ConflictPair {
  a: ConflictArtist
  b: ConflictArtist
  overlapStartMs: number
  overlapEndMs: number
}

function detectConflicts(favs: FavoriteRecord[]): ConflictPair[] {
  const pairs: ConflictPair[] = []

  const items: ConflictArtist[] = favs
    .map((fav) => {
      const artist = ARTISTS.find((a) => a.id === fav.artist_id)
      if (!artist) return null
      return {
        record: fav,
        artist,
        effectiveStart: fav.custom_start ?? artist.startTime,
        effectiveEnd: fav.custom_end ?? artist.endTime,
      }
    })
    .filter(Boolean) as ConflictArtist[]

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i]
      const b = items[j]
      if (a.artist.stage === b.artist.stage) continue

      const aStart = new Date(a.effectiveStart).getTime()
      const aEnd = new Date(a.effectiveEnd).getTime()
      const bStart = new Date(b.effectiveStart).getTime()
      const bEnd = new Date(b.effectiveEnd).getTime()

      if (aStart < bEnd && aEnd > bStart) {
        pairs.push({
          a,
          b,
          overlapStartMs: Math.max(aStart, bStart),
          overlapEndMs: Math.min(aEnd, bEnd),
        })
      }
    }
  }
  return pairs
}

export default function MySetTimePage() {
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([])
  const [view, setView] = useState<ViewMode>('agenda')
  const [activeStage, setActiveStage] = useState(STAGES[0].name)
  const [now, setNow] = useState(() => new Date())
  const [loading, setLoading] = useState(true)
  const [conflicts, setConflicts] = useState<ConflictPair[]>([])
  const [openConflict, setOpenConflict] = useState<ConflictPair | null>(null)
  const agendaRef = useRef<HTMLDivElement>(null)

  // Update time every minute
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  // Fetch favorites on mount
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase
          .schema('ultra')
          .from('user_favorites')
          .select('artist_id, custom_start, custom_end')
          .eq('user_id', user.id)
        if (data) {
          const recs: FavoriteRecord[] = data.map(
            (r: { artist_id: number; custom_start: string | null; custom_end: string | null }) => ({
              artist_id: r.artist_id,
              custom_start: r.custom_start,
              custom_end: r.custom_end,
            })
          )
          setFavorites(recs)
          setConflicts(detectConflicts(recs))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  // Save custom times after conflict resolution
  const handleConflictSave = useCallback(
    async (
      aId: number, customEndA: string | null,
      bId: number, customStartB: string | null
    ) => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      await Promise.all([
        supabase
          .schema('ultra')
          .from('user_favorites')
          .update({ custom_end: customEndA })
          .eq('user_id', user.id)
          .eq('artist_id', aId),
        supabase
          .schema('ultra')
          .from('user_favorites')
          .update({ custom_start: customStartB })
          .eq('user_id', user.id)
          .eq('artist_id', bId),
      ])

      // Update local state
      setFavorites((prev) => {
        const updated = prev.map((fav) => {
          if (fav.artist_id === aId) return { ...fav, custom_end: customEndA }
          if (fav.artist_id === bId) return { ...fav, custom_start: customStartB }
          return fav
        })
        setConflicts(detectConflicts(updated))
        return updated
      })
    },
    []
  )

  const timelineY = getTimelineY(now)
  const favSet = new Set(favorites.map((f) => f.artist_id))

  type AgendaItemData = {
    artist: (typeof ARTISTS)[number]
    record: FavoriteRecord
    effectiveStart: string
    effectiveEnd: string
    stageColor: string
  }

  // Build agenda items
  const agendaItems: AgendaItemData[] = favorites
    .map((fav) => {
      const artist = ARTISTS.find((a) => a.id === fav.artist_id)
      if (!artist) return null
      return {
        artist,
        record: fav,
        effectiveStart: fav.custom_start ?? artist.startTime,
        effectiveEnd: fav.custom_end ?? artist.endTime,
        stageColor: getStageColor(artist.stage),
      }
    })
    .filter(Boolean) as AgendaItemData[]

  const isEmpty = favorites.length === 0

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Top bar: view toggle + conflicts badge ── */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b shrink-0 gap-3"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* View toggle */}
        <div
          className="flex rounded-lg overflow-hidden"
          style={{ background: 'var(--bg-secondary)' }}
        >
          {(['agenda', 'grid'] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all"
              style={{
                background: view === v ? 'var(--cyan)' : 'transparent',
                color: view === v ? '#0a0a0f' : 'var(--text-secondary)',
              }}
            >
              {v === 'agenda' ? '📋 Agenda' : '🎛️ Grilla'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Conflicts badge */}
          {conflicts.length > 0 && (
            <button
              onClick={() => setOpenConflict(conflicts[0])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              style={{
                background: 'rgba(255,140,0,0.15)',
                border: '1px solid rgba(255,140,0,0.4)',
                color: 'var(--orange)',
              }}
            >
              ⚠️ {conflicts.length} conflicto{conflicts.length > 1 ? 's' : ''}
            </button>
          )}
          {/* Share button — solo si hay favoritos */}
          {!isEmpty && <ShareButton agendaRef={agendaRef} />}
        </div>
      </div>

      {/* ── Empty state ── */}
      {isEmpty && !loading && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3">
          <span style={{ fontSize: 48 }}>⭐</span>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
            Agrega artistas desde el Set Times
          </p>
        </div>
      )}

      {/* ── Agenda view ── */}
      {!isEmpty && view === 'agenda' && (
        <div className="flex-1 overflow-y-auto" ref={agendaRef}>
          <AgendaView items={agendaItems} nowMs={now.getTime()} />
        </div>
      )}

      {/* ── Grid view ── */}
      {!isEmpty && view === 'grid' && (
        <>
          {/* Mobile stage selector */}
          <div
            className="md:hidden flex border-b shrink-0 overflow-x-auto"
            style={{ borderColor: 'var(--border)' }}
          >
            {STAGES.map((stage) => {
              const active = activeStage === stage.name
              const hasFav = getArtistsByStage(stage.name).some((a) => favSet.has(a.id))
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.name)}
                  className="flex-1 min-w-[70px] py-2.5 text-[10px] font-black uppercase tracking-wider transition-all shrink-0"
                  style={{
                    color: active ? stage.color : hasFav ? 'rgba(255,255,255,0.5)' : 'var(--text-secondary)',
                    borderBottom: active ? `2px solid ${stage.color}` : '2px solid transparent',
                    opacity: hasFav ? 1 : 0.4,
                  }}
                >
                  {stage.name === 'RESISTANCE 2' ? 'RES.2' : stage.name === 'MAIN STAGE' ? 'MAIN' : stage.name === 'UMF RADIO' ? 'UMF' : stage.name}
                </button>
              )
            })}
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div className="flex" style={{ minWidth: 'max-content' }}>
              {/* Time labels */}
              <div
                className="sticky left-0 shrink-0"
                style={{ width: 44, background: 'var(--bg-primary)', zIndex: 15 }}
              >
                <div style={{ height: STAGE_HEADER_H }} />
                <div style={{ position: 'relative', height: TOTAL_HEIGHT }}>
                  {HOUR_LABELS.map((label, i) => (
                    <span
                      key={label}
                      style={{
                        position: 'absolute',
                        top: i * 108 - 7,
                        right: 6,
                        fontSize: 9,
                        fontWeight: 700,
                        color: 'var(--text-secondary)',
                        letterSpacing: '0.02em',
                        lineHeight: 1,
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Desktop: 4 columns with only favorited artists */}
              <div className="hidden md:flex" style={{ flex: 1, minWidth: 900 }}>
                {STAGES.map((stage) => (
                  <StageColumn
                    key={stage.id}
                    stage={stage}
                    artists={getArtistsByStage(stage.name).filter((a) => favSet.has(a.id))}
                    favorites={new Set(favorites.map((f) => f.artist_id))}
                    onToggle={() => {}}
                    timelineY={timelineY}
                    now={now}
                  />
                ))}
              </div>

              {/* Mobile: active stage only */}
              <div className="flex md:hidden" style={{ flex: 1, minWidth: 200 }}>
                {STAGES.filter((s) => s.name === activeStage).map((stage) => (
                  <StageColumn
                    key={stage.id}
                    stage={stage}
                    artists={getArtistsByStage(stage.name).filter((a) => favSet.has(a.id))}
                    favorites={new Set(favorites.map((f) => f.artist_id))}
                    onToggle={() => {}}
                    timelineY={timelineY}
                    now={now}
                  />
                ))}
              </div>
            </div>
            </div>
          </div>
        </>
      )}

      {/* Loading overlay */}
      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(10,10,15,0.7)', zIndex: 50 }}
        >
          <span style={{ color: 'var(--cyan)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>
            CARGANDO...
          </span>
        </div>
      )}

      {/* Conflict modal */}
      {openConflict && (
        <ConflictModal
          artistA={openConflict.a}
          artistB={openConflict.b}
          overlapStartMs={openConflict.overlapStartMs}
          overlapEndMs={openConflict.overlapEndMs}
          onSave={handleConflictSave}
          onClose={() => setOpenConflict(null)}
        />
      )}
    </div>
  )
}
