import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { homeVideos, VIDEO_CAROUSEL_INTERVAL_MS } from '@/data/videos'
import { cn } from '@/lib/utils'

function wrap(i: number, n: number) {
  return ((i % n) + n) % n
}

export function VideoCarousel() {
  const videos = homeVideos
  const count = videos.length
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [playError, setPlayError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startedAtRef = useRef(Date.now())
  /** Evita que o timer/efeito trate pause de troca de slide como “usuário pausou” */
  const ignorePauseRef = useRef(false)

  const left = videos[wrap(index - 1, count)]
  const center = videos[wrap(index, count)]
  const right = videos[wrap(index + 1, count)]

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (progressRef.current) {
      clearInterval(progressRef.current)
      progressRef.current = null
    }
  }, [])

  const stopCenter = useCallback(() => {
    const el = videoRef.current
    ignorePauseRef.current = true
    if (el) {
      el.pause()
      try {
        el.currentTime = 0
      } catch {
        /* ignore */
      }
    }
    setPlaying(false)
    // libera o flag no próximo tick
    requestAnimationFrame(() => {
      ignorePauseRef.current = false
    })
  }, [])

  const goTo = useCallback(
    (next: number) => {
      stopCenter()
      setPlayError(null)
      setIndex(wrap(next, count))
    },
    [count, stopCenter],
  )

  // Auto-advance ~30s enquanto NÃO está assistindo
  useEffect(() => {
    clearTimers()
    setProgress(0)
    if (playing || count <= 1) return

    startedAtRef.current = Date.now()
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current
      setProgress(Math.min(1, elapsed / VIDEO_CAROUSEL_INTERVAL_MS))
    }, 80)

    timerRef.current = setInterval(() => {
      stopCenter()
      setIndex((i) => wrap(i + 1, count))
      startedAtRef.current = Date.now()
      setProgress(0)
    }, VIDEO_CAROUSEL_INTERVAL_MS)

    return clearTimers
  }, [playing, index, count, clearTimers, stopCenter])

  // Ao trocar o vídeo central, recarrega a source
  useEffect(() => {
    const el = videoRef.current
    if (!el || !center) return
    ignorePauseRef.current = true
    el.pause()
    el.src = center.src
    el.poster = center.poster ?? ''
    el.load()
    setPlaying(false)
    setPlayError(null)
    requestAnimationFrame(() => {
      ignorePauseRef.current = false
    })
  }, [center?.id, center?.src, center?.poster])

  async function handlePlayClick() {
    const el = videoRef.current
    if (!el) {
      setPlayError('Player não encontrado. Recarregue a página.')
      return
    }

    setPlayError(null)
    clearTimers()

    try {
      // Garante que há dados suficientes para iniciar
      if (el.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        el.load()
        await new Promise<void>((resolve, reject) => {
          const onReady = () => {
            cleanup()
            resolve()
          }
          const onErr = () => {
            cleanup()
            reject(new Error('Falha ao carregar o vídeo'))
          }
          const cleanup = () => {
            el.removeEventListener('canplay', onReady)
            el.removeEventListener('error', onErr)
          }
          el.addEventListener('canplay', onReady, { once: true })
          el.addEventListener('error', onErr, { once: true })
          // timeout de segurança
          window.setTimeout(() => {
            cleanup()
            // tenta play mesmo assim
            resolve()
          }, 4000)
        })
      }

      await el.play()
      setPlaying(true)
    } catch (err) {
      console.error('[VideoCarousel] play failed', err)
      setPlaying(false)
      setPlayError('Não foi possível iniciar o vídeo. Tente de novo.')
    }
  }

  function onPlay() {
    setPlaying(true)
    setProgress(0)
    clearTimers()
    setPlayError(null)
  }

  function onPause() {
    if (ignorePauseRef.current) return
    const el = videoRef.current
    if (!el || el.ended) return
    // usuário pausou nos controls nativos
    setPlaying(false)
  }

  function onEnded() {
    setPlaying(false)
    setIndex((i) => wrap(i + 1, count))
  }

  if (!center || !left || !right) return null

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-center px-10 sm:px-12 md:px-14">
        {/* Setas fora da área dos cards */}
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          className="absolute left-0 z-40 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer flex items-center justify-center backdrop-blur-md transition-colors"
          aria-label="Vídeo anterior"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          className="absolute right-0 z-40 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer flex items-center justify-center backdrop-blur-md transition-colors"
          aria-label="Próximo vídeo"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* 3 cards: esq · centro · dir — sem overlap de clique no centro */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-full py-2">
          {/* Esquerda */}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label={`Ir para: ${left.title}`}
            className={cn(
              'relative shrink-0 rounded-[20px] overflow-hidden border-0 cursor-pointer p-0',
              'bg-navy-deep ring-1 ring-white/10 shadow-lg',
              'w-[110px] sm:w-[150px] md:w-[180px] lg:w-[200px] aspect-[9/16]',
              'opacity-60 hover:opacity-90 transition-opacity scale-90 sm:scale-95 origin-center',
            )}
          >
            <img
              src={left.poster}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            <span className="absolute inset-0 bg-black/35" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-white/90 text-navy flex items-center justify-center">
                <Play className="w-4 h-4 fill-navy ml-0.5" />
              </span>
            </span>
            <span className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <span className="block text-[10px] sm:text-[12px] font-semibold text-white truncate text-center">
                {left.title}
              </span>
            </span>
          </button>

          {/* Centro — principal (z alto, isolado) */}
          <div className="relative z-30 shrink-0 w-[200px] sm:w-[250px] md:w-[290px] lg:w-[310px]">
            <div className="relative rounded-[28px] bg-navy-deep p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/15">
              <div className="relative w-full rounded-[22px] overflow-hidden bg-black aspect-[9/16]">
                <video
                  ref={videoRef}
                  className="absolute inset-0 z-0 w-full h-full object-cover"
                  playsInline
                  preload="auto"
                  controls={playing}
                  controlsList="nodownload"
                  poster={center.poster}
                  src={center.src}
                  onPlay={onPlay}
                  onPause={onPause}
                  onEnded={onEnded}
                />

                {/* Overlay de play — some quando está tocando */}
                {!playing && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      void handlePlayClick()
                    }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-black/55 via-black/15 to-black/25 border-0 cursor-pointer group"
                    aria-label={`Assistir: ${center.title}`}
                  >
                    <span className="w-16 h-16 rounded-full bg-white text-navy flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                      <Play className="w-7 h-7 fill-navy ml-0.5" />
                    </span>
                    <span className="px-3 text-center text-white text-[13px] font-semibold drop-shadow">
                      Assistir
                    </span>
                  </button>
                )}

                {!playing && (
                  <div className="absolute left-3 right-3 bottom-3 z-30 h-0.5 rounded-full bg-white/15 overflow-hidden pointer-events-none">
                    <div
                      className="h-full bg-brand-green rounded-full"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Direita */}
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label={`Ir para: ${right.title}`}
            className={cn(
              'relative shrink-0 rounded-[20px] overflow-hidden border-0 cursor-pointer p-0',
              'bg-navy-deep ring-1 ring-white/10 shadow-lg',
              'w-[110px] sm:w-[150px] md:w-[180px] lg:w-[200px] aspect-[9/16]',
              'opacity-60 hover:opacity-90 transition-opacity scale-90 sm:scale-95 origin-center',
            )}
          >
            <img
              src={right.poster}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            <span className="absolute inset-0 bg-black/35" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-white/90 text-navy flex items-center justify-center">
                <Play className="w-4 h-4 fill-navy ml-0.5" />
              </span>
            </span>
            <span className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <span className="block text-[10px] sm:text-[12px] font-semibold text-white truncate text-center">
                {right.title}
              </span>
            </span>
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="m-0 text-[15px] md:text-[16px] font-semibold text-white text-center">
          {center.title}
        </p>
        {playError && (
          <p className="m-0 text-sm text-red-300 text-center" role="alert">
            {playError}
          </p>
        )}
        <div className="flex items-center gap-2" role="tablist" aria-label="Vídeos">
          {videos.map((v, i) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={v.title}
              onClick={() => goTo(i)}
              className={cn(
                'h-2 rounded-full border-0 cursor-pointer transition-all',
                i === index ? 'w-7 bg-brand-green' : 'w-2 bg-white/30 hover:bg-white/50',
              )}
            />
          ))}
        </div>
        <p className="m-0 text-[12px] text-white/40 text-center">
          {playing
            ? 'Assistindo — o slider retoma quando o vídeo terminar'
            : 'Troca automática a cada ~30s · setas ou clique nas laterais'}
        </p>
      </div>
    </div>
  )
}
