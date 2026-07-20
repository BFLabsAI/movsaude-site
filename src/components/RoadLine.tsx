interface RoadLineProps {
  className?: string
  opacity?: number
  animate?: boolean
}

export function RoadLine({ className = '', opacity = 0.55, animate = true }: RoadLineProps) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={className}
      style={{ opacity }}
      aria-hidden
    >
      <defs>
        <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2D9CDB" stopOpacity="0" />
          <stop offset="0.4" stopColor="#2D9CDB" stopOpacity="0.85" />
          <stop offset="0.75" stopColor="#6BBF3A" stopOpacity="0.7" />
          <stop offset="1" stopColor="#6BBF3A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M-40 80 C 280 20, 480 110, 760 55 S 1180 10, 1480 70"
        fill="none"
        stroke="url(#roadGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={animate ? 'road-stroke' : undefined}
      />
    </svg>
  )
}
