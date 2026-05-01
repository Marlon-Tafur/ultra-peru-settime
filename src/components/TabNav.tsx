'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const TABS = [
  { href: '/app/sitemap',    label: 'SITEMAP',    icon: '🗺️' },
  { href: '/app/settime',    label: 'SET TIMES',  icon: '🎵' },
  { href: '/app/my-settime', label: 'MI SETTIME', icon: '⭐' },
]

export default function TabNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* ── DESKTOP: barra superior ───────────────────────────────────── */}
      <nav
        className="hidden md:flex items-center justify-between px-6 h-14 shrink-0 border-b"
        style={{
          borderColor: 'var(--border)',
          background: 'rgba(17,17,24,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo */}
        <span
          className="font-black uppercase tracking-widest text-sm select-none"
          style={{ textShadow: '0 0 20px rgba(0,212,255,0.25)' }}
        >
          ULTRA <span style={{ color: 'var(--cyan)' }}>PERU</span>{' '}
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>2026</span>
        </span>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {TABS.map((tab) => {
            const active = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  color: active ? 'var(--cyan)' : 'var(--text-secondary)',
                  background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                  borderBottom: active ? '2px solid var(--cyan)' : '2px solid transparent',
                  boxShadow: active ? '0 0 15px rgba(0,212,255,0.2), 0 2px 8px rgba(0,212,255,0.15)' : 'none',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-xs font-bold uppercase tracking-wider transition-colors px-3 py-1.5 rounded-lg"
          style={{ color: 'var(--text-secondary)', border: '1px solid transparent' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)'
            e.currentTarget.style.borderColor = 'transparent'
          }}
        >
          Salir
        </button>
      </nav>

      {/* ── MOBILE: header superior ───────────────────────────────────── */}
      <div
        className="md:hidden flex items-center justify-between px-4 h-12 border-b shrink-0"
        style={{
          borderColor: 'var(--border)',
          background: 'rgba(17,17,24,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <span
          className="font-black uppercase tracking-widest text-xs select-none"
          style={{ textShadow: '0 0 15px rgba(0,212,255,0.2)' }}
        >
          ULTRA <span style={{ color: 'var(--cyan)' }}>PERU</span>{' '}
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>2026</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          Salir
        </button>
      </div>

      {/* ── MOBILE: tab bar inferior ──────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 flex border-t z-50"
        style={{
          borderColor: 'var(--border)',
          background: 'rgba(17,17,24,0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {TABS.map((tab) => {
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all duration-200"
              style={{
                color: active ? 'var(--cyan)' : 'var(--text-secondary)',
                borderTop: active ? '2px solid var(--cyan)' : '2px solid transparent',
                boxShadow: active ? '0 -6px 20px rgba(0,212,255,0.2)' : 'none',
                background: active ? 'rgba(0,212,255,0.04)' : 'transparent',
              }}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
