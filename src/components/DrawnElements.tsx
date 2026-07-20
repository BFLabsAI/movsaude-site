/** Elementos gráficos reutilizáveis */

export function RoadCurve({ className = '', id = 'road' }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2D9CDB" stopOpacity="0" />
          <stop offset="0.35" stopColor="#2D9CDB" stopOpacity="0.75" />
          <stop offset="0.7" stopColor="#6BBF3A" stopOpacity="0.65" />
          <stop offset="1" stopColor="#6BBF3A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M-20 78 C 260 18, 480 110, 760 52 S 1180 8, 1460 70"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        className="road-stroke"
      />
    </svg>
  )
}

export function ProjectMark({
  children,
  from,
  to,
  size = 64,
}: {
  children: React.ReactNode
  from: string
  to: string
  size?: number
}) {
  return (
    <span
      className="relative inline-flex items-center justify-center rounded-[18px] text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(145deg, ${from}, ${to})`,
        boxShadow: `0 12px 28px ${from}40`,
      }}
    >
      <span className="absolute inset-[3px] rounded-[15px] border border-white/25 pointer-events-none" />
      {children}
    </span>
  )
}
