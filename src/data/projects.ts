export type ProjectId =
  | 'medmovel'
  | 'cuidamulher'
  | 'oftalmovel'
  | 'sorrisomais'
  | 'vetmovel'

export interface Project {
  id: ProjectId
  slug: string
  name: string
  tag: string
  short: string
  signature: string
  heroSubtitle: string
  aboutTitle: string
  aboutBody: string[]
  structureTitle: string
  structure: { title: string; desc: string }[]
  servicesTitle: string
  services: string[]
  teamTitle: string
  team: string[]
  ctaTitle: string
  ctaBody: string
  image: string
  colors: {
    from: string
    to: string
    accent: string
    soft: string
    textOn: string
  }
  lightHero?: boolean
}

export const projects: Project[] = [
  {
    id: 'medmovel',
    slug: 'medmovel',
    name: 'MedMovel',
    tag: 'Saúde Móvel',
    short:
      'Consultas, exames, triagens e acompanhamento — com estrutura moderna e equipe multidisciplinar.',
    signature: 'Saúde mais perto, vida com mais qualidade.',
    heroSubtitle:
      'Atendimento médico completo e humanizado, levado até a população — com estrutura moderna, tecnologia e equipe multidisciplinar.',
    aboutTitle: 'Medicina que vai até quem precisa',
    aboutBody: [
      'O MedMovel leva atendimento médico completo e humanizado até a população, promovendo saúde, prevenção e qualidade de vida. Realizamos consultas, exames, triagens e acompanhamentos com agilidade, acessibilidade e eficiência — aproximando a saúde de quem mais precisa por meio da mobilidade e da inovação.',
      'Para a gestão municipal, o MedMovel representa cobertura ampliada da atenção básica, redução de filas e presença ativa da saúde pública em comunidades distantes das unidades fixas.',
    ],
    structureTitle: 'Estrutura completa',
    structure: [
      { title: 'Consultório médico', desc: 'Ambiente privativo para consultas.' },
      { title: 'Sala de exames', desc: 'Equipada para avaliações e diagnósticos.' },
      { title: 'Sala de coleta', desc: 'Estrutura para coleta de materiais laboratoriais.' },
      { title: 'Recepção e acolhimento', desc: 'Porta de entrada humanizada do atendimento.' },
    ],
    servicesTitle: 'O que o MedMovel realiza',
    services: [
      'Clínico geral',
      'Atendimentos preventivos',
      'Acompanhamento de doenças crônicas',
      'Encaminhamentos e orientações',
    ],
    teamTitle: 'Equipe base do projeto',
    team: [
      'Telemedicina',
      'Enfermeiro (triagem)',
      'Técnicos de enfermagem',
      'Supervisor',
      'Cadastro',
      'Serviços gerais',
      'Condutor',
    ],
    ctaTitle: 'Leve o MedMovel para o seu município',
    ctaBody: 'Solicite mais informações e receba a apresentação completa do projeto.',
    image: '/projects/medmovel.png',
    colors: {
      from: '#1B4DA1',
      to: '#2563B8',
      accent: '#4FB6E8',
      soft: '#E8F1FB',
      textOn: '#fff',
    },
  },
  {
    id: 'cuidamulher',
    slug: 'cuidamulher',
    name: 'CuidaMulher',
    tag: 'Saúde Feminina',
    short:
      'Cuidado integral para todas as fases da vida da mulher, com equipe multidisciplinar em uma única estrutura.',
    signature: 'Saúde, respeito e acolhimento para cada mulher.',
    heroSubtitle:
      'Cuidado completo para todas as fases da vida da mulher — com atendimento especializado, acolhedor e humanizado.',
    aboutTitle: 'Cuidado integral, em todas as fases da vida',
    aboutBody: [
      'O CuidaMulher é um projeto especializado em saúde feminina, desenvolvido para oferecer cuidado integral, acolhimento e prevenção em todas as fases da vida da mulher. Contamos com uma equipe multidisciplinar nas áreas de ginecologia, psicologia e nutrição, promovendo atendimento humanizado, orientação especializada e mais qualidade de vida.',
      'Para o município, o CuidaMulher fortalece as políticas de saúde da mulher: amplia o acesso a exames preventivos, ao planejamento familiar e ao acompanhamento contínuo — especialmente onde a rede fixa não alcança.',
    ],
    structureTitle: 'Atendimento multidisciplinar',
    structure: [
      { title: 'Ginecologista', desc: 'Consultas e exames especializados.' },
      { title: 'Psicóloga', desc: 'Escuta e cuidado com a saúde emocional.' },
      { title: 'Nutricionista', desc: 'Orientação alimentar em cada fase da vida.' },
      { title: 'Assistente social', desc: 'Apoio, encaminhamento e acesso a direitos.' },
    ],
    servicesTitle: 'Serviços oferecidos',
    services: [
      'Exames preventivos',
      'Acompanhamento da saúde da mulher',
      'Planejamento familiar',
      'Orientações e educação em saúde',
    ],
    teamTitle: 'Equipe base do projeto',
    team: [
      'Ginecologista/Clínico',
      'Enfermeiro',
      'Nutricionista',
      'Assistente social',
      'Psicólogo',
      'Supervisor',
      'Cadastro',
      'Serviços gerais',
      'Condutor',
    ],
    ctaTitle: 'Leve o CuidaMulher para o seu município',
    ctaBody: 'Fortaleça a saúde da mulher na sua cidade. Solicite a apresentação completa do projeto.',
    image: '/projects/cuidamulher.png',
    colors: {
      from: '#C2187E',
      to: '#E255A5',
      accent: '#F5A3D0',
      soft: '#FCE8F3',
      textOn: '#fff',
    },
  },
  {
    id: 'oftalmovel',
    slug: 'oftalmovel',
    name: 'OftalMovel',
    tag: 'Saúde Ocular',
    short:
      'Consultas, exames de vista e detecção de doenças oculares, com distribuição de óculos.',
    signature: 'Enxergar bem é viver melhor.',
    heroSubtitle:
      'Atendimento oftalmológico especializado até a população — cuidando da saúde dos olhos e prevenindo doenças.',
    aboutTitle: 'Visão que muda vidas',
    aboutBody: [
      'O OftalMovel é um projeto voltado à promoção da saúde visual, oferecendo atendimento oftalmológico acessível, prevenção e cuidado especializado para a população. Contamos com estrutura moderna e profissionais qualificados para a realização de consultas, triagens e avaliações completas da visão.',
      'E vamos além do diagnóstico: o projeto contempla a distribuição de óculos para pacientes que necessitam de correção visual — proporcionando mais qualidade de vida, inclusão e bem-estar.',
    ],
    structureTitle: 'Estrutura especializada',
    structure: [
      { title: 'Consultório oftalmológico', desc: 'Ambiente completo para consultas.' },
      { title: 'Sala de exames', desc: 'Equipamentos modernos de avaliação da visão.' },
      { title: 'Sala de procedimentos', desc: 'Estrutura para intervenções e cuidados.' },
      { title: 'Recepção e acolhimento', desc: 'Atendimento organizado e humanizado.' },
    ],
    servicesTitle: 'Serviços oferecidos',
    services: [
      'Consulta oftalmológica',
      'Exames de vista',
      'Detecção de doenças oculares',
      'Orientações e tratamentos',
      'Distribuição de óculos para correção visual',
    ],
    teamTitle: 'Equipe base do projeto',
    team: ['Oftalmologista', 'Supervisor', 'Cadastro', 'Serviços gerais', 'Condutor'],
    ctaTitle: 'Cuidar da visão é cuidar do futuro',
    ctaBody: 'Leve o OftalMovel para o seu município. Solicite a apresentação completa do projeto.',
    image: '/projects/oftalmovel.png',
    colors: {
      from: '#137A96',
      to: '#1B9AB8',
      accent: '#7ED4E8',
      soft: '#E6F6FA',
      textOn: '#fff',
    },
  },
  {
    id: 'sorrisomais',
    slug: 'sorrisomais',
    name: 'Sorriso+',
    tag: 'Reabilitação Oral Digital',
    short:
      'Tecnologia 3D e próteses digitais devolvendo sorrisos, autoestima e dignidade — com mais rapidez e precisão.',
    signature: 'Devolvendo sorrisos, autoestima e dignidade.',
    heroSubtitle:
      'Tecnologia que transforma sorrisos e vidas — reabilitação oral digital com escaneamento 3D e próteses digitais.',
    aboutTitle: 'Muito mais que um sorriso',
    aboutBody: [
      'O Sorriso+ é o projeto de reabilitação oral digital da MovSaúde. Utilizamos escaneamento intraoral 3D e confecção de próteses digitais para devolver, com rapidez e precisão, aquilo que a perda dentária tira das pessoas: a capacidade de sorrir, de se alimentar bem e de viver com dignidade.',
      'A tecnologia digital reduz drasticamente o tempo de tratamento em comparação ao processo convencional — menos deslocamentos para o paciente, mais atendimentos concluídos para a gestão pública, e um resultado com qualidade e precisão superiores.',
    ],
    structureTitle: 'Tecnologia a serviço da dignidade',
    structure: [
      { title: 'Escaneamento intraoral 3D', desc: 'Precisão digital desde o diagnóstico.' },
      { title: 'Próteses digitais', desc: 'Confecção moderna, confortável e durável.' },
      { title: 'Mais rapidez no tratamento', desc: 'Menos etapas, menos espera.' },
      { title: 'Qualidade e precisão', desc: 'Resultado superior ao processo convencional.' },
    ],
    servicesTitle: 'Pilares do projeto',
    services: [
      'Tecnologia 3D — fluxo digital completo de reabilitação',
      'Agilidade e eficiência — tratamento em menos tempo',
      'Autoestima e dignidade — impacto direto na vida do paciente',
      'Saúde bucal para todos — acesso onde antes não existia',
    ],
    teamTitle: 'Equipe base do projeto',
    team: [
      'Dentista/Protesista',
      'Auxiliar de saúde bucal',
      'Supervisor',
      'Cadastro',
      'Serviços gerais',
      'Condutor',
    ],
    ctaTitle: 'Leve o Sorriso+ para o seu município',
    ctaBody: 'Solicite mais informações e conheça o projeto de reabilitação oral digital da MovSaúde.',
    image: '/projects/sorrisomais.jpg',
    lightHero: true,
    colors: {
      from: '#1E3A5F',
      to: '#2A4A72',
      accent: '#3EC6C0',
      soft: '#E8F8F7',
      textOn: '#fff',
    },
  },
  {
    id: 'vetmovel',
    slug: 'vetmovel',
    name: 'VetMovel',
    tag: 'Atendimento Veterinário',
    short:
      'Cuidado veterinário itinerante para cães e gatos: consultas, vacinação, exames e cirurgias.',
    signature: 'Cuidado e amor que acompanham.',
    heroSubtitle:
      'Atendimento veterinário completo e humanizado para cães e gatos — promovendo saúde e bem-estar animal.',
    aboutTitle: 'Saúde animal, bem-estar para todos',
    aboutBody: [
      'O VetMovel leva cuidado veterinário itinerante para diferentes comunidades, promovendo saúde, prevenção e bem-estar animal de forma acessível e humanizada. Com estrutura preparada para consultas e procedimentos, o projeto contribui para a proteção dos animais e fortalece o impacto social.',
      'Para a gestão municipal, o VetMovel é também uma ferramenta de saúde pública: vacinação, controle populacional e prevenção de zoonoses protegem os animais — e as pessoas.',
    ],
    structureTitle: 'Estrutura móvel',
    structure: [
      { title: 'Consultório veterinário', desc: 'Atendimento clínico completo.' },
      { title: 'Sala de procedimentos', desc: 'Estrutura para intervenções e exames.' },
      { title: 'Sala de cirurgia', desc: 'Ambiente preparado para procedimentos cirúrgicos.' },
      { title: 'Espaço de recuperação', desc: 'Cuidado pós-procedimento com segurança.' },
    ],
    servicesTitle: 'Serviços veterinários',
    services: [
      'Consultas',
      'Vacinação',
      'Exames laboratoriais',
      'Cirurgias e procedimentos',
      'Orientações de cuidados',
    ],
    teamTitle: 'Equipe base do projeto',
    team: [
      'Clínico veterinário',
      'Cirurgião/Anestesiologista',
      'Supervisor',
      'Cadastro',
      'Serviços gerais',
      'Condutor',
    ],
    ctaTitle: 'Leve o VetMovel para o seu município',
    ctaBody: 'Promova saúde animal e bem-estar na sua cidade. Solicite a apresentação completa do projeto.',
    image: '/projects/vetmovel.png',
    colors: {
      from: '#2F7D32',
      to: '#5CA345',
      accent: '#A5D6A7',
      soft: '#EAF6EA',
      textOn: '#fff',
    },
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}

// metrics e cidades: ver src/data/locations.ts

export const ufs = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]
