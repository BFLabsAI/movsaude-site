import { NavLink, Outlet } from 'react-router-dom'
import { Briefcase, LayoutDashboard, LogOut, Users } from 'lucide-react'
import { useAdminAuth } from '@/contexts/AdminAuth'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/Logo'

const links = [
  { to: '/painel', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/painel/contatos', label: 'Contatos', icon: Users },
  { to: '/painel/candidatos', label: 'Candidatos', icon: Briefcase },
]

export function AdminShell() {
  const { username, logout } = useAdminAuth()

  return (
    <div className="min-h-dvh flex bg-[#F4F6F9]">
      <aside className="w-[240px] shrink-0 bg-[#0B1429] text-white flex flex-col">
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
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
