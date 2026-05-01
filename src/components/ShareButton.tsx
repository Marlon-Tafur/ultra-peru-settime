'use client'

import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { createClient } from '@/lib/supabase'

interface Props {
  agendaRef: React.RefObject<HTMLDivElement | null>
}

export default function ShareButton({ agendaRef }: Props) {
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    if (!agendaRef.current) return
    setGenerating(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const url = `${window.location.origin}/shared/${user?.id ?? 'unknown'}`
      setShareUrl(url)

      const dataUrl = await toPng(agendaRef.current, {
        backgroundColor: '#0a0a0f',
        quality: 0.95,
        pixelRatio: 2,
      })
      setImgUrl(dataUrl)
    } catch (err) {
      console.error('Share error:', err)
    } finally {
      setGenerating(false)
    }
  }

  function handleDownload() {
    if (!imgUrl) return
    const a = document.createElement('a')
    a.href = imgUrl
    a.download = 'mi-settime-ultra-peru-2026.png'
    a.click()
  }

  async function handleCopyLink() {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={handleShare}
        disabled={generating}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
        style={{
          background: 'var(--cyan)',
          color: '#0a0a0f',
          boxShadow: generating ? 'none' : '0 0 12px rgba(0,212,255,0.3)',
        }}
      >
        {generating ? '...' : '↑ Compartir'}
      </button>

      {/* ── Share modal ── */}
      {imgUrl && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: 'rgba(0,0,0,0.9)' }}
          onClick={(e) => e.target === e.currentTarget && setImgUrl(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <h2
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: 'var(--cyan)' }}
              >
                Mi Settime · Ultra Peru 2026
              </h2>
              <button
                onClick={() => setImgUrl(null)}
                style={{ color: 'var(--text-secondary)', fontSize: 18, lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {/* PNG preview */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt="Mi settime"
              className="w-full"
              style={{ maxHeight: 300, objectFit: 'contain', background: '#0a0a0f' }}
            />

            {/* Actions */}
            <div className="flex flex-col gap-2 p-4">
              <button
                onClick={handleDownload}
                className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                style={{
                  background: 'var(--cyan)',
                  color: '#0a0a0f',
                  boxShadow: '0 0 15px rgba(0,212,255,0.3)',
                }}
              >
                Descargar PNG
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                style={{
                  background: copied ? 'rgba(0,212,255,0.15)' : 'var(--bg-secondary)',
                  color: copied ? 'var(--cyan)' : 'var(--text-secondary)',
                  border: `1px solid ${copied ? 'var(--cyan)' : 'var(--border)'}`,
                }}
              >
                {copied ? '✓ Link copiado' : 'Copiar link'}
              </button>

              {shareUrl && (
                <p
                  className="text-center text-[9px] break-all"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {shareUrl}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
