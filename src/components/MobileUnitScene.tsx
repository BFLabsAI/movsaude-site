import { motion, useReducedMotion } from 'framer-motion'

/** Unidade móvel animada — roda na estrada com parallax sutil. */
export function MobileUnitScene({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion()

  return (
    <div className={`relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#EAF3FA] via-[#F7F9FC] to-[#E8F5E9] ${className}`}>
      {/* céu / ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-6 right-10 w-24 h-24 rounded-full bg-[#2D9CDB]/10 blur-2xl" />
        <div className="absolute bottom-16 left-8 w-32 h-32 rounded-full bg-[#6BBF3A]/10 blur-2xl" />
      </div>

      <svg viewBox="0 0 560 300" className="w-full h-auto relative z-[1]" aria-hidden>
        <defs>
          <linearGradient id="bodyG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1B4DA1" />
            <stop offset="1" stopColor="#152347" />
          </linearGradient>
          <linearGradient id="roofG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2D9CDB" />
            <stop offset="1" stopColor="#6BBF3A" />
          </linearGradient>
          <linearGradient id="roadG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#C5D3E4" stopOpacity="0" />
            <stop offset="0.2" stopColor="#C5D3E4" />
            <stop offset="0.8" stopColor="#C5D3E4" />
            <stop offset="1" stopColor="#C5D3E4" stopOpacity="0" />
          </linearGradient>
          <filter id="uSh" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#152347" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* hills */}
        <path d="M0 200 Q 140 160 280 190 T 560 175 L 560 300 L 0 300 Z" fill="#DDE8F4" opacity="0.7" />
        <path d="M0 220 Q 180 185 320 215 T 560 200 L 560 300 L 0 300 Z" fill="#D0DFEF" opacity="0.55" />

        {/* road bed */}
        <path d="M-20 248 Q 140 228 280 248 T 580 240 L 580 270 L -20 275 Z" fill="url(#roadG)" />
        <motion.g
          animate={reduce ? undefined : { x: [0, -48] }}
          transition={reduce ? undefined : { duration: 1.2, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={i}
              x={-10 + i * 48}
              y={252}
              width={22}
              height={3.5}
              rx={1.5}
              fill="#fff"
              opacity={0.7}
            />
          ))}
        </motion.g>

        {/* moving unit */}
        <motion.g
          filter="url(#uSh)"
          animate={reduce ? undefined : { x: [0, 18, 0], y: [0, -2, 0] }}
          transition={
            reduce
              ? undefined
              : { duration: 3.2, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }
          }
        >
          {/* cabin/trailer */}
          <rect x="120" y="128" width="280" height="100" rx="16" fill="url(#bodyG)" />
          <rect x="120" y="128" width="280" height="16" rx="16" fill="url(#roofG)" opacity="0.85" />
          <path d="M120 152 H400" stroke="#fff" strokeOpacity="0.1" />

          {/* windows */}
          <rect x="142" y="165" width="52" height="38" rx="7" fill="#7EC8E8" opacity="0.45" />
          <rect x="208" y="165" width="52" height="38" rx="7" fill="#7EC8E8" opacity="0.38" />
          <rect x="274" y="165" width="52" height="38" rx="7" fill="#7EC8E8" opacity="0.38" />

          {/* door */}
          <rect x="348" y="158" width="38" height="70" rx="7" fill="#0F1A38" />
          <circle cx="376" cy="196" r="3.5" fill="#6BBF3A" />

          {/* brand cross */}
          <circle cx="168" cy="140" r="12" fill="#fff" opacity="0.15" />
          <path d="M168 133 V147 M161 140 H175" stroke="#6BBF3A" strokeWidth="2.4" strokeLinecap="round" />

          {/* stairs */}
          <path d="M400 220 L442 220 L442 188 L400 205 Z" fill="#2563B8" />
          <path d="M410 212 H432 M410 204 H432" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.4" />

          {/* wheels with spin mark */}
          <g>
            <circle cx="180" cy="235" r="20" fill="#0F1A38" stroke="#2D9CDB" strokeWidth="3" />
            <motion.g
              style={{ transformOrigin: '180px 235px' }}
              animate={reduce ? undefined : { rotate: 360 }}
              transition={reduce ? undefined : { duration: 1.1, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="180" cy="235" r="7" fill="#2D9CDB" opacity="0.45" />
              <path d="M180 222 V248 M167 235 H193" stroke="#4FB6E8" strokeWidth="1.5" opacity="0.5" />
            </motion.g>
          </g>
          <g>
            <circle cx="340" cy="235" r="20" fill="#0F1A38" stroke="#2D9CDB" strokeWidth="3" />
            <motion.g
              style={{ transformOrigin: '340px 235px' }}
              animate={reduce ? undefined : { rotate: 360 }}
              transition={reduce ? undefined : { duration: 1.1, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="340" cy="235" r="7" fill="#2D9CDB" opacity="0.45" />
              <path d="M340 222 V248 M327 235 H353" stroke="#4FB6E8" strokeWidth="1.5" opacity="0.5" />
            </motion.g>
          </g>

          {/* hitch */}
          <rect x="100" y="200" width="24" height="10" rx="3" fill="#1B4DA1" />
        </motion.g>

        {/* people marks waiting */}
        <g opacity="0.9">
          <circle cx="470" cy="200" r="9" fill="#6BBF3A" />
          <path d="M470 212 C 460 218, 458 232, 458 232 H482 C482 232 480 218 470 212 Z" fill="#6BBF3A" opacity="0.85" />
          <circle cx="498" cy="204" r="8" fill="#2D9CDB" />
          <path d="M498 215 C 490 220, 488 232, 488 232 H508 C508 232 506 220 498 215 Z" fill="#2D9CDB" opacity="0.85" />
        </g>

        {/* pin pulse */}
        <circle cx="70" cy="170" r="18" fill="#2D9CDB" opacity="0.12">
          {!reduce && (
            <animate attributeName="r" values="12;22;12" dur="2.4s" repeatCount="indefinite" />
          )}
        </circle>
        <circle cx="70" cy="170" r="6" fill="#2D9CDB" />
        <circle cx="70" cy="170" r="2.5" fill="#fff" />
      </svg>

      {/* chips */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-navy text-white text-[11.5px] font-bold px-3 py-1.5 shadow-md">
          Unidades climatizadas
        </span>
        <span className="rounded-full bg-brand-green text-white text-[11.5px] font-bold px-3 py-1.5 shadow-md">
          Equipes completas
        </span>
      </div>
    </div>
  )
}
