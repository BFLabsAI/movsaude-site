import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { projects } from '@/data/projects'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ProjectIcon } from '@/components/icons/ProjectIcons'
import { Logo } from '@/components/Logo'

const links = [
  { to: '/', label: 'Início' },
  { to: '/quem-somos', label: 'Quem Somos' },
  { to: '/projetos', label: 'Projetos', hasDropdown: true },
  { to: '/trabalhe-conosco', label: 'Trabalhe Conosco' },
  { to: '/contato', label: 'Contato' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [projOpen, setProjOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setProjOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-line shadow-[0_4px_24px_rgba(21,35,71,0.06)]'
          : 'bg-white/70 backdrop-blur-md border-b border-transparent',
      )}
    >
      <div className="max-w-[1240px] mx-auto px-5 md:px-6 h-[72px] flex items-center justify-between gap-4">
        <Logo variant="dark" height={38} className="max-w-[160px] sm:max-w-[190px]" />

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) =>
            l.hasDropdown ? (
              <div
                key={l.to}
                className="relative"
                onMouseEnter={() => setProjOpen(true)}
                onMouseLeave={() => setProjOpen(false)}
              >
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-[15px] font-semibold transition-colors',
                      isActive || location.pathname.startsWith('/projetos')
                        ? 'text-navy bg-navy/5'
                        : 'text-muted hover:text-navy hover:bg-navy/[0.03]',
                    )
                  }
                >
                  {l.label}
                  <ChevronDown className={cn('w-4 h-4 transition-transform', projOpen && 'rotate-180')} />
                </NavLink>
                <div
                  className={cn(
                    'absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200',
                    projOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1',
                  )}
                >
                  <div className="w-[300px] rounded-2xl bg-white border border-line shadow-card p-2">
                    {projects.map((p) => (
                      <Link
                        key={p.id}
                        to={`/projetos/${p.slug}`}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-soft transition-colors"
                      >
                        <span
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white"
                          style={{
                            background: `linear-gradient(145deg, ${p.colors.from}, ${p.colors.to})`,
                          }}
                        >
                          <ProjectIcon id={p.id} size={18} />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display font-bold text-sm text-navy">{p.name}</span>
                          <span className="block text-xs text-muted mt-0.5">{p.tag}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'px-3.5 py-2 rounded-full text-[15px] font-semibold transition-colors',
                    isActive ? 'text-navy bg-navy/5' : 'text-muted hover:text-navy hover:bg-navy/[0.03]',
                  )
                }
              >
                {l.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to="/contato">Fale Conosco</Link>
          </Button>
          <button
            type="button"
            className="lg:hidden w-11 h-11 inline-flex items-center justify-center rounded-xl border border-line bg-white text-navy cursor-pointer"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'lg:hidden border-t border-line bg-white transition-all duration-300 overflow-hidden',
          open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="px-5 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <div key={l.to}>
              <Link
                to={l.to}
                className="block px-3 py-3 rounded-xl font-semibold text-navy hover:bg-soft"
              >
                {l.label}
              </Link>
              {l.hasDropdown && (
                <div className="pl-3 pb-2 flex flex-col gap-0.5">
                  {projects.map((p) => (
                    <Link
                      key={p.id}
                      to={`/projetos/${p.slug}`}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted hover:text-navy rounded-lg"
                    >
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white"
                        style={{
                          background: `linear-gradient(145deg, ${p.colors.from}, ${p.colors.to})`,
                        }}
                      >
                        <ProjectIcon id={p.id} size={14} />
                      </span>
                      {p.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Button asChild className="mt-2 w-full">
            <Link to="/contato">Fale Conosco</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
