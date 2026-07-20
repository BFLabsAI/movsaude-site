import { Link } from 'react-router-dom'
import { projects } from '@/data/projects'
import { Logo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-[radial-gradient(circle,#2D9CDB22,transparent_65%)] blur-2xl pointer-events-none" />
      <div className="max-w-[1240px] mx-auto px-5 md:px-6 pt-16 pb-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div>
            <div className="mb-4">
              <Logo variant="light" height={44} className="max-w-[200px]" />
            </div>
            <p className="text-white/65 text-[15px] leading-relaxed max-w-xs">
              Saúde que alcança. Cuidado que transforma.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm tracking-wide uppercase text-white/45 mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-[15px]">
              <li><Link className="text-white/75 hover:text-white transition-colors" to="/">Início</Link></li>
              <li><Link className="text-white/75 hover:text-white transition-colors" to="/quem-somos">Quem Somos</Link></li>
              <li><Link className="text-white/75 hover:text-white transition-colors" to="/projetos">Projetos</Link></li>
              <li><Link className="text-white/75 hover:text-white transition-colors" to="/contato">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm tracking-wide uppercase text-white/45 mb-4">
              Projetos
            </h4>
            <ul className="space-y-2.5 text-[15px]">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link className="text-white/75 hover:text-white transition-colors" to={`/projetos/${p.slug}`}>
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm tracking-wide uppercase text-white/45 mb-4">
              Contato
            </h4>
            <ul className="space-y-3 text-[15px] text-white/75">
              <li>
                <a
                  href="https://instagram.com/movsaudeoficial"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  @movsaudeoficial
                </a>
              </li>
              <li>
                <Link to="/contato" className="hover:text-white transition-colors">
                  Solicitar informações
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm text-white/45">
          <p>© {new Date().getFullYear()} MovSaúde. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span>Política de Privacidade</span>
            <span>LGPD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
