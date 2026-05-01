'use client'

import { useState } from 'react'

const MIN_SCALE = 1
const MAX_SCALE = 4
const STEP = 0.5

export default function SitemapPage() {
  const [scale, setScale] = useState(1)

  function zoomIn() {
    setScale((s) => Math.min(s + STEP, MAX_SCALE))
  }
  function zoomOut() {
    setScale((s) => Math.max(s - STEP, MIN_SCALE))
  }
  function reset() {
    setScale(1)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <h1
          className="text-sm font-black uppercase tracking-widest"
          style={{ color: 'var(--cyan)' }}
        >
          SITE MAP
        </h1>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={scale <= MIN_SCALE}
            className="w-8 h-8 rounded-lg text-sm font-bold transition-all disabled:opacity-30 flex items-center justify-center"
            style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}
          >
            −
          </button>
          <span
            className="text-xs font-bold w-12 text-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={scale >= MAX_SCALE}
            className="w-8 h-8 rounded-lg text-sm font-bold transition-all disabled:opacity-30 flex items-center justify-center"
            style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}
          >
            +
          </button>
          {scale !== 1 && (
            <button
              onClick={reset}
              className="px-3 h-8 rounded-lg text-xs font-bold uppercase tracking-wide transition-all"
              style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Imagen con zoom ── */}
      {/*
        Outer: overflow-auto para scroll cuando la imagen supera el viewport.
        touch-action: pinch-zoom activa el zoom nativo del browser en mobile.
        Inner: ancho = scale * 100% → cuando scale=1 ambas imágenes caben en pantalla;
               cuando scale>1 el contenedor crece y el usuario puede scrollear.
      */}
      <div
        className="flex-1 overflow-auto"
        style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
      >
        <div
          className="flex"
          style={{
            width: `${scale * 100}%`,
            minHeight: '100%',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sitemap-left.jpg"
            alt="Site map — izquierda"
            className="w-1/2 object-contain select-none"
            draggable={false}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sitemap-right.jpg"
            alt="Site map — derecha"
            className="w-1/2 object-contain select-none"
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
}
