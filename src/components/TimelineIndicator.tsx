interface Props {
  top: number
}

export default function TimelineIndicator({ top }: Props) {
  return (
    <div
      className="animate-pulse-glow pointer-events-none"
      style={{
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        height: 2,
        background: 'var(--cyan)',
        boxShadow: '0 0 8px 2px rgba(0,212,255,0.6)',
        zIndex: 10,
      }}
    >
      {/* Dot indicator */}
      <div
        style={{
          position: 'absolute',
          left: -5,
          top: -4,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'var(--cyan)',
          boxShadow: '0 0 6px 2px rgba(0,212,255,0.8)',
        }}
      />
    </div>
  )
}
