'use client'

import { useState, useEffect, useCallback } from 'react'
import { STAGES, getArtistsByStage } from '@/lib/artists-data'
import { HOUR_LABELS, STAGE_HEADER_H, TOTAL_HEIGHT, getTimelineY } from '@/lib/utils'
import StageColumn from '@/components/StageColumn'
import { createClient } from '@/lib/supabase'

export default function SetTimePage() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [activeStage, setActiveStage] = useState(STAGES[0].name)
  const [now, setNow] = useState(() => new Date())
  const [loading, setLoading] = useState(true)

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
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }
        const { data, error } = await supabase
          .schema('ultra')
          .from('user_favorites')
          .select('artist_id')
          .eq('user_id', user.id)
        if (error) console.error('[settime] fetch favorites error:', error)
        if (data) setFavorites(new Set(data.map((r: { artist_id: number }) => r.artist_id)))
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  const toggleFavorite = useCallback(async (artistId: number) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { console.warn('[settime] no user — not saving favorite'); return }

    if (favorites.has(artistId)) {
      setFavorites((prev) => { const s = new Set(prev); s.delete(artistId); return s })
      const { error } = await supabase
        .schema('ultra')
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('artist_id', artistId)
      if (error) console.error('[settime] delete favorite error:', error)
    } else {
      setFavorites((prev) => new Set([...prev, artistId]))
      const { error } = await supabase
        .schema('ultra')
        .from('user_favorites')
        .insert({ user_id: user.id, artist_id: artistId })
      if (error) console.error('[settime] insert favorite error:', error)
    }
  }, [favorites])

  const timelineY = getTimelineY(now)

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Mobile: stage selector ── */}
      <div
        className="md:hidden flex border-b shrink-0 overflow-x-auto"
        style={{ borderColor: 'var(--border)' }}
      >
        {STAGES.map((stage) => {
          const active = activeStage === stage.name
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.name)}
              className="flex-1 min-w-[80px] py-2.5 text-[10px] font-black uppercase tracking-wider transition-all shrink-0"
              style={{
                color: active ? stage.color : 'var(--text-secondary)',
                borderBottom: active ? `2px solid ${stage.color}` : '2px solid transparent',
                background: active ? `${stage.color}10` : 'transparent',
              }}
            >
              {stage.name === 'RESISTANCE 2' ? 'RES. 2' : stage.name === 'MAIN STAGE' ? 'MAIN' : stage.name === 'UMF RADIO' ? 'UMF' : stage.name}
            </button>
          )
        })}
      </div>

      {/* ── Grid: time labels + columns ── */}
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

            {/* Desktop: 4 columns */}
            <div className="hidden md:flex" style={{ flex: 1, minWidth: 900 }}>
              {STAGES.map((stage) => (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  artists={getArtistsByStage(stage.name)}
                  favorites={favorites}
                  onToggle={toggleFavorite}
                  timelineY={timelineY}
                  now={now}
                />
              ))}
            </div>

            {/* Mobile: 1 column */}
            <div className="flex md:hidden" style={{ flex: 1, minWidth: 200 }}>
              {STAGES.filter((s) => s.name === activeStage).map((stage) => (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  artists={getArtistsByStage(stage.name)}
                  favorites={favorites}
                  onToggle={toggleFavorite}
                  timelineY={timelineY}
                  now={now}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

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
    </div>
  )
}
