import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '@/data/projects'

/** Carrossel editorial: arte completa, zero chrome, zero badge em cima da imagem. */
export function HeroSlider() {
  const [i, setI] = useState(0)
  const p = projects[i]

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % projects.length), 4800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="w-full max-w-[440px] mx-auto">
      {/* glow colorido por projeto — sem moldura extra */}
      <div
        className="relative rounded-[20px] overflow-hidden bg-white"
        style={{
          boxShadow: `0 40px 100px -20px ${p.colors.from}66, 0 20px 40px rgba(0,0,0,0.25)`,
        }}
      >
        <div className="relative aspect-[1/1] bg-[#eef2f7]">
          <AnimatePresence mode="wait">
            <motion.img
              key={p.id}
              src={p.image}
              alt={p.name}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </AnimatePresence>
        </div>
      </div>

      {/* meta + progress FORA da arte */}
      <div className="mt-5 flex items-center justify-between gap-4 px-1">
        <div>
          <p className="font-display font-bold text-[15px] text-white m-0">{p.name}</p>
          <p className="text-[12px] text-white/50 m-0 mt-0.5">{p.tag}</p>
        </div>
        <div className="flex gap-1.5">
          {projects.map((proj, idx) => (
            <button
              key={proj.id}
              type="button"
              aria-label={proj.name}
              onClick={() => setI(idx)}
              className="h-1 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: idx === i ? 28 : 8,
                background: idx === i ? '#fff' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
