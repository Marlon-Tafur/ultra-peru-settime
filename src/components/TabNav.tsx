'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const TABS = [
  { href: '/app/sitemap',   label: 'SITEMAP',    icon: '🗺️' },
  { href: '/app/settime',   label: 'SET TIMES',  icon: '🎵' },
  { href: '/app/my-settime',label: 'MI SETTIME', icon: '⭐' },
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
        className="hidden md:flex items-center justify-between px-6 h-14 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        {/* Logo */}
        <span className="text-white font-black uppercase tracking-widest text-sm">
          ULTRA <span style={{ color: 'var(--cyan)' }}>PERU</span>{' '}
          <span className="text-[#8888AA] font-normal">2026</span>
        </span>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {TABS.map((tab) => {
            const active = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                style={{
                  color: active ? 'var(--cyan)' : 'var(--text-secondary)',
                  background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                  boxShadow: active ? '0 0 15px rgba(0,212,255,0.15)' : 'none',
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
          className="text-xs font-bold uppercase tracking-wider transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          Salir
        </button>
      </nav>

      {/* ── MOBILE: header superior ───────────────────────────────────── */}
      <div
        className="md:hidden flex items-center justify-between px-4 h-12 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <span className="text-white font-black uppercase tracking-widest text-xs">
          ULTRA <span style={{ color: 'var(--cyan)' }}>PERU</span>{' '}
          <span className="text-[#8888AA] font-normal">2026</span>
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
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        {TABS.map((tab) => {
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all"
              style={{
                color: active ? 'var(--cyan)' : 'var(--text-secondary)',
                borderTop: active ? '2px solid var(--cyan)' : '2px solid transparent',
                boxShadow: active ? '0 -4px 15px rgba(0,212,255,0.15)' : 'none',
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
