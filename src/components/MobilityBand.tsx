import { useEffect, useRef } from 'react'
import unidadeMovel from '@/assets/unidade-movel.png'

/**
 * Unidade móvel real (PNG transparente) andando L→R na estrada.
 * Versão estável — sem mapa no fundo (teste revertido).
 */
export function MobilityBand() {
  const trackRef = useRef<HTMLDivElement>(null)
  const busRef = useRef<HTMLDivElement>(null)
  const dashesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const bus = busRef.current
    const dashes = dashesRef.current
    if (!track || !bus) return

    const DURATION = 17000
    let raf = 0
    const t0 = performance.now()

    bus.style.position = 'absolute'
    bus.style.left = '0'
    bus.style.willChange = 'transform'

    const frame = (now: number) => {
      const t = ((now - t0) % DURATION) / DURATION
      const trackW = track.clientWidth || 600
      const busW = bus.getBoundingClientRect().width || 300

      const x = -busW + t * (trackW + busW)
      const bounce = Math.sin(t * Math.PI * 22) * 4
      bus.style.transform = `translate3d(${x.toFixed(1)}px, ${bounce.toFixed(1)}px, 0)`

      if (dashes) {
        const dx = -((now - t0) * 0.04) % 88
        dashes.style.transform = `translate3d(${dx.toFixed(1)}px, 0, 0)`
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={trackRef}
      className="relative w-full overflow-hidden rounded-[28px] h-[300px] sm:h-[340px] md:h-[380px] select-none"
      style={{ background: '#0c162c', isolation: 'isolate' }}
    >
      {/* céu */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 85% 65% at 75% -5%, rgba(40,110,190,0.35) 0%, transparent 55%)',
        }}
      />

      {/* colinas */}
      <svg
        className="absolute bottom-[38%] left-0 w-full h-[30%] opacity-30 pointer-events-none"
        viewBox="0 0 800 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path fill="#1a3560" d="M0 100 L0 50 Q200 15 400 48 T800 35 L800 100 Z" />
        <path fill="#122848" d="M0 100 L0 68 Q250 38 500 62 T800 50 L800 100 Z" />
      </svg>

      {/* pista */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[42%] z-[1]"
        style={{
          background: 'linear-gradient(180deg, #16233c 0%, #0f182c 45%, #0a101c 100%)',
        }}
      >
        <div className="absolute top-0 inset-x-0 h-px bg-white/12" />
        <div
          ref={dashesRef}
          className="absolute top-[38%] left-0 h-[4px] w-[200%]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #5cb83a 0 22px, transparent 22px 44px)',
            opacity: 0.95,
          }}
          aria-hidden
        />
        <div className="absolute bottom-0 inset-x-0 h-[28%] bg-black/30" />
      </div>

      {/* veículo */}
      <div
        ref={busRef}
        className="z-[3]"
        style={{
          position: 'absolute',
          bottom: '13%',
          left: 0,
          width: 'min(420px, 72%)',
          transform: 'translate3d(-440px, 0, 0)',
          lineHeight: 0,
          filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.55))',
        }}
      >
        <img
          src={unidadeMovel}
          alt="Unidade móvel MovSaúde em deslocamento"
          draggable={false}
          className="w-full h-auto block"
          decoding="async"
        />
      </div>

      <div className="absolute right-[7%] bottom-[48%] z-[2] flex flex-col items-center pointer-events-none">
        <span
          className="block w-3.5 h-3.5 rounded-full bg-[#5cb83a]"
          style={{ boxShadow: '0 0 0 7px rgba(92,184,58,0.22), 0 0 18px #5cb83a' }}
        />
        <span className="mt-1.5 text-[9px] font-semibold tracking-wider uppercase text-white/40">
          destino
        </span>
      </div>

      <div className="absolute top-5 left-5 sm:top-6 sm:left-7 z-[2] max-w-[220px] pointer-events-none">
        <p className="font-display font-bold text-[12px] sm:text-[13px] text-white/90 m-0 leading-snug">
          Saúde em trânsito —{' '}
          <span className="text-[#5eb8e8]">município a município</span>
        </p>
      </div>
    </div>
  )
}
