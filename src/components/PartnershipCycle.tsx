/**
 * Ciclo de parceria — 4 etapas sempre visíveis.
 * Desktop: linha horizontal. Mobile: timeline vertical limpa (sem setas soltas).
 */
const steps = [
  {
    n: '01',
    title: 'Diagnóstico',
    body: 'Entendemos a demanda de saúde do município e o público a ser atendido.',
  },
  {
    n: '02',
    title: 'Planejamento',
    body: 'Definimos projeto, cronograma, roteiro das unidades e equipe adequada.',
  },
  {
    n: '03',
    title: 'Execução',
    body: 'Unidades móveis em operação, com atendimento humanizado e gestão completa.',
  },
  {
    n: '04',
    title: 'Resultados',
    body: 'Relatórios de atendimento e indicadores para a gestão municipal.',
  },
]

export function PartnershipCycle() {
  return (
    <div className="w-full">
      {/* ── Desktop ── */}
      <div className="hidden lg:block">
        <div className="flex items-center px-[4%]">
          {steps.map((s, i) => (
            <div key={s.n} className="contents">
              <div className="flex flex-col items-center shrink-0 w-[72px]">
                <span className="w-[72px] h-[72px] rounded-full bg-navy text-white font-display font-extrabold text-xl flex items-center justify-center shadow-[0_10px_30px_rgba(14,26,51,0.18)] ring-[6px] ring-soft">
                  {s.n}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 flex items-center min-w-0 px-1" aria-hidden>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-navy/30 via-brand-blue/50 to-brand-green/40 rounded-full" />
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    className="shrink-0 -ml-0.5 text-brand-blue"
                    aria-hidden
                  >
                    <path
                      d="M3 2 L11 7 L3 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="h-[2px] w-1 bg-brand-blue/30 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3 mt-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-[20px] bg-white border border-line p-5 md:p-6 shadow-[0_2px_16px_rgba(14,26,51,0.04)] text-center"
            >
              <h3 className="font-display font-extrabold text-[18px] text-navy m-0 mb-2">{s.title}</h3>
              <p className="text-[14px] leading-[1.55] text-muted m-0">{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile: timeline vertical com linha contínua ── */}
      <div className="lg:hidden relative pl-2">
        <div
          className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-navy via-brand-blue to-brand-green opacity-25"
          aria-hidden
        />
        <ol className="relative m-0 p-0 list-none space-y-5">
          {steps.map((s) => (
            <li key={s.n} className="relative flex gap-4 items-start">
              <span className="relative z-[1] w-14 h-14 rounded-full bg-navy text-white font-display font-extrabold text-base flex items-center justify-center shadow-md ring-4 ring-soft shrink-0">
                {s.n}
              </span>
              <div className="flex-1 rounded-[18px] bg-white border border-line p-4 shadow-sm min-w-0">
                <h3 className="font-display font-extrabold text-[17px] text-navy m-0 mb-1.5">
                  {s.title}
                </h3>
                <p className="text-[14px] leading-[1.55] text-muted m-0">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-center text-[13px] font-semibold text-muted mt-8 m-0">
        Ciclo contínuo de parceria com a gestão pública
      </p>
    </div>
  )
}
