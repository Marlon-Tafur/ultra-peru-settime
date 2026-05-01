'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
          if (error.message.includes('already registered') || error.message.includes('already been registered')) {
            throw new Error('Este email ya tiene una cuenta. Usá "Ingresar" en su lugar.')
          }
          throw error
        }
        if (!data.session) {
          setError('Revisá tu email para confirmar tu cuenta antes de ingresar. Si no querés confirmación, desactivá "Confirm email" en el dashboard de Supabase.')
          setLoading(false)
          return
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
            throw new Error('Email o contraseña incorrectos. Verificá tus datos.')
          }
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Debés confirmar tu email antes de ingresar. Revisá tu bandeja de entrada.')
          }
          throw error
        }
      }
      router.push('/app/settime')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
      {/* Fondo con gradiente radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(0,212,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(255,140,0,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Logo / Título */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl font-black uppercase tracking-widest text-white"
            style={{ textShadow: '0 0 30px rgba(0,212,255,0.5)' }}
          >
            ULTRA PERU
          </h1>
          <p className="text-[#00D4FF] text-sm font-bold tracking-[0.3em] mt-1">
            2026 · SET TIMES
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(26,26,36,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Toggle Login / Registro */}
          <div className="flex rounded-lg overflow-hidden mb-8" style={{ background: '#111118' }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null) }}
              className="flex-1 py-2.5 text-sm font-bold uppercase tracking-wider transition-all"
              style={
                mode === 'login'
                  ? { background: '#00D4FF', color: '#0a0a0f' }
                  : { color: '#8888AA' }
              }
            >
              Ingresar
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null) }}
              className="flex-1 py-2.5 text-sm font-bold uppercase tracking-wider transition-all"
              style={
                mode === 'register'
                  ? { background: '#00D4FF', color: '#0a0a0f' }
                  : { color: '#8888AA' }
              }
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8888AA] mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all"
                style={{
                  background: '#111118',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#00D4FF')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8888AA] mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all"
                style={{
                  background: '#111118',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#00D4FF')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 py-3.5 rounded-lg font-black uppercase tracking-widest text-sm transition-all disabled:opacity-50"
              style={{
                background: loading ? '#00a8cc' : '#00D4FF',
                color: '#0a0a0f',
                boxShadow: loading ? 'none' : '0 0 20px rgba(0,212,255,0.4)',
              }}
            >
              {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
