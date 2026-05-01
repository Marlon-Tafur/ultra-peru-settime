import TabNav from '@/components/TabNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.04) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(255,140,0,0.03) 0%, transparent 50%), var(--bg-primary)',
      }}
    >
      <TabNav />
      {/* pb-16 en mobile para dejar espacio al tab bar inferior */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>
    </div>
  )
}
