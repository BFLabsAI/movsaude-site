/** Caminhão-baú médico (cabine + baú) — SVG inline, fundo transparente */
export function MedTruckSvg({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="mtCab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1B4DA1" />
        </linearGradient>
        <linearGradient id="mtBox" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="45%" stopColor="#1B4DA1" />
          <stop offset="100%" stopColor="#143A7A" />
        </linearGradient>
        <linearGradient id="mtGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="mtStripe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2D9CDB" />
          <stop offset="100%" stopColor="#6BBF3A" />
        </linearGradient>
      </defs>

      <ellipse cx="210" cy="148" rx="175" ry="8" fill="#000" opacity="0.35" />

      {/* Baú */}
      <rect x="48" y="38" width="220" height="78" rx="6" fill="url(#mtBox)" />
      <rect x="48" y="38" width="220" height="12" rx="6" fill="url(#mtStripe)" />
      <rect x="48" y="46" width="220" height="5" fill="url(#mtStripe)" opacity="0.45" />
      <rect x="62" y="58" width="160" height="42" rx="4" fill="#F0F7FC" opacity="0.92" />
      <rect x="72" y="64" width="36" height="22" rx="3" fill="url(#mtGlass)" />
      <rect x="118" y="64" width="36" height="22" rx="3" fill="url(#mtGlass)" />
      <rect x="164" y="64" width="36" height="22" rx="3" fill="url(#mtGlass)" />
      <circle cx="230" cy="78" r="14" fill="#fff" opacity="0.15" />
      <path d="M230 70 V86 M222 78 H238" stroke="#6BBF3A" strokeWidth="3.2" strokeLinecap="round" />
      <rect x="52" y="58" width="14" height="48" rx="2" fill="#0F1A38" opacity="0.35" />
      <rect x="50" y="100" width="8" height="6" rx="1" fill="#EF4444" opacity="0.9" />
      <rect x="50" y="108" width="8" height="6" rx="1" fill="#FBBF24" opacity="0.85" />

      {/* Cabine (frente, à direita) */}
      <path
        d="M268 52 H318 Q338 52 348 72 V116 H268 Z"
        fill="url(#mtCab)"
      />
      <path d="M270 52 H316 Q332 52 340 66 H270 Z" fill="#2D9CDB" opacity="0.5" />
      <path d="M292 62 H328 Q336 62 340 74 V92 H292 Z" fill="url(#mtGlass)" />
      <rect x="274" y="64" width="16" height="26" rx="2" fill="url(#mtGlass)" opacity="0.85" />
      <rect x="342" y="88" width="8" height="14" rx="1" fill="#0F1A38" opacity="0.4" />
      <ellipse cx="348" cy="100" rx="5" ry="4" fill="#FEF08A">
        <animate attributeName="opacity" values="0.65;1;0.65" dur="1.1s" repeatCount="indefinite" />
      </ellipse>
      <rect x="346" y="108" width="10" height="8" rx="1" fill="#1E293B" />
      <rect x="280" y="92" width="4" height="8" rx="1" fill="#94A3B8" />
      <rect x="266" y="68" width="5" height="14" rx="1" fill="#334155" />
      <rect x="264" y="70" width="3" height="8" rx="0.5" fill="url(#mtGlass)" />

      <rect x="52" y="114" width="298" height="6" rx="2" fill="#0F172A" />

      <Wheel cx={100} cy={124} />
      <Wheel cx={175} cy={124} />
      <Wheel cx={310} cy={124} />

      <text
        x="100"
        y="108"
        fill="#FFFFFF"
        fillOpacity="0.35"
        fontFamily="system-ui,sans-serif"
        fontSize="9"
        fontWeight="700"
        letterSpacing="1"
      >
        MOVSAÚDE
      </text>
    </svg>
  )
}

function Wheel({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={16} fill="#0A0F18" stroke="#2D9CDB" strokeWidth="3" />
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${cx} ${cy}`}
          to={`360 ${cx} ${cy}`}
          dur="0.55s"
          repeatCount="indefinite"
        />
        <circle cx={cx} cy={cy} r={6} fill="#2D9CDB" opacity="0.55" />
        <path
          d={`M${cx} ${cy - 12} V${cy + 12} M${cx - 12} ${cy} H${cx + 12}`}
          stroke="#7DD3FC"
          strokeWidth="1.5"
          opacity="0.45"
        />
      </g>
    </g>
  )
}
