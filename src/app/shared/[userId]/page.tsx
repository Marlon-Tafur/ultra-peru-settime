import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ARTISTS, STAGES, getArtistsByStage, getStageColor } from '@/lib/artists-data'
import AgendaView from '@/components/AgendaView'
import { FavoriteRecord } from '@/components/ConflictModal'

export default async function SharedPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .schema('ultra')
    .from('user_favorites')
    .select('artist_id, custom_start, custom_end')
    .eq('user_id', userId)

  const favorites: FavoriteRecord[] = (data ?? []).map(
    (r: { artist_id: number; custom_start: string | null; custom_end: string | null }) => ({
      artist_id: r.artist_id,
      custom_start: r.custom_start,
      custom_end: r.custom_end,
    })
  )

  type AgendaItemData = {
    artist: (typeof ARTISTS)[number]
    record: FavoriteRecord
    effectiveStart: string
    effectiveEnd: string
    stageColor: string
  }

  const items: AgendaItemData[] = favorites
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

  const nowMs = Date.now()

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg-primary)', fontFamily: 'var(--font-sans)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-4 border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div>
          <h1
            className="text-sm font-black uppercase tracking-widest text-white"
          >
            ULTRA <span style={{ color: 'var(--cyan)' }}>PERU</span>{' '}
            <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>2026</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 10, marginTop: 2 }}>
            Set Times compartidos · solo lectura
          </p>
        </div>
        <a
          href="/login"
          className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all"
          style={{
            background: 'var(--cyan)',
            color: '#0a0a0f',
          }}
        >
          Crear el mío
        </a>
      </div>

      {/* Agenda */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span style={{ fontSize: 40 }}>⭐</span>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Este settime está vacío
          </p>
        </div>
      ) : (
        <AgendaView items={items} nowMs={nowMs} />
      )}
    </div>
  )
}
