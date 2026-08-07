import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Briefcase, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react'
import { useAdminAuth } from '@/contexts/AdminAuth'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/Logo'

const links = [
  { to: '/painel', end: true, label: 'Dashboard', short: 'Home', icon: LayoutDashboard },
  { to: '/painel/contatos', label: 'Contatos', short: 'Contatos', icon: Users },
  { to: '/painel/candidatos', label: 'Candidatos', short: 'RH', icon: Briefcase },
]

export function AdminShell() {
  const { username, logout } = useAdminAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  const pageTitle =
    links.find((l) =>
      l.end ? location.pathname === l.to : location.pathname.startsWith(l.to),
    )?.label ?? 'Painel'

  return (
    <div className="h-dvh max-h-dvh flex flex-col md:flex-row bg-[#F4F6F9] overflow-hidden">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-[240px] shrink-0 bg-[#0B1429] text-white flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <Logo variant="light" height={32} className="max-w-[140px]" />
          <p className="mt-3 text-[11px] font-bold tracking-[0.14em] uppercase text-white/40">
            Painel interno
          </p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5',
                )
              }
            >
              <l.icon className="w-4 h-4 shrink-0" />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-[12px] text-white/45 m-0 mb-2 truncate">@{username}</p>
          <button
            type="button"
            onClick={() => void logout()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[13px] font-semibold text-white/80 hover:bg-white/10 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Coluna principal (mobile: header + scroll + bottom nav fixa no flex, não por scroll da página) */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col">
        {/* ── Mobile top bar ── */}
        <header
          className="md:hidden shrink-0 z-40 bg-[#0B1429] text-white border-b border-white/10"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="h-14 px-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="w-11 h-11 rounded-xl inline-flex items-center justify-center border-0 bg-transparent text-white cursor-pointer"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1 text-center">
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/45 m-0">
                MovSaúde
              </p>
              <p className="text-[15px] font-semibold truncate m-0">{pageTitle}</p>
            </div>
            <Logo variant="light" height={26} className="max-w-[96px] shrink-0" />
          </div>
        </header>

        {/* ── Mobile drawer ── */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <button
              type="button"
              className="absolute inset-0 bg-navy/50 border-0 cursor-pointer"
              aria-label="Fechar menu"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[min(86vw,300px)] bg-[#0B1429] text-white flex flex-col shadow-2xl pt-[env(safe-area-inset-top)]">
              <div className="h-14 px-5 flex items-center justify-between border-b border-white/10">
                <Logo variant="light" height={28} className="max-w-[120px]" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="w-11 h-11 rounded-xl inline-flex items-center justify-center border-0 bg-white/5 text-white cursor-pointer"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3 py-3.5 text-[15px] font-semibold transition-colors min-h-[48px]',
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/65 active:bg-white/5',
                      )
                    }
                  >
                    <l.icon className="w-5 h-5 shrink-0" />
                    {l.label}
                  </NavLink>
                ))}
              </nav>
              <div
                className="px-5 py-4 border-t border-white/10"
                style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
              >
                <p className="text-[12px] text-white/45 m-0 mb-2 truncate">@{username}</p>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-[14px] font-semibold text-white/80 cursor-pointer min-h-[48px]"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Main scroll area ── */}
        <main className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8">
            <Outlet />
          </div>
        </main>

        {/* ── Mobile bottom tabs (flex footer — sempre visível, sem fixed) ── */}
        <nav
          className="md:hidden shrink-0 z-40 bg-white border-t border-line shadow-[0_-4px_24px_rgba(14,26,51,0.06)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="grid grid-cols-3 h-[3.75rem]">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors no-underline',
                    isActive ? 'text-navy' : 'text-muted',
                  )
                }
              >
                <l.icon className="w-5 h-5" />
                <span>{l.short}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
