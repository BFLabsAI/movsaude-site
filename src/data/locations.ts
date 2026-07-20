/** Dados reais de operação / implantação MovSaúde */

export type UnitStatus = 'op' | 'im'

export interface CityUnit {
  nome: string
  uf: string
  /** total de unidades no município */
  unidades: number
  /** frentes e quantidades, ex: "VetMovel ×3 + CuidaMulher ×1" */
  projetos: string
  status: UnitStatus
  /** [lon, lat] para o mapa */
  coords: [number, number]
}

/**
 * Fortaleza (CE) = em operação.
 * Demais municípios = em implantação.
 */
export const cityUnits: CityUnit[] = [
  {
    nome: 'Fortaleza',
    uf: 'CE',
    unidades: 4,
    projetos: 'VetMovel ×3 + CuidaMulher ×1',
    status: 'op',
    coords: [-38.54, -3.73],
  },
  {
    nome: 'São Luís',
    uf: 'MA',
    unidades: 2,
    projetos: 'VetMovel ×2',
    status: 'im',
    coords: [-44.3, -2.53],
  },
  {
    nome: 'Santa Quitéria',
    uf: 'MA',
    unidades: 2,
    projetos: 'MedMovel ×2',
    status: 'im',
    coords: [-42.7, -4.32],
  },
  {
    nome: 'Parnaíba',
    uf: 'PI',
    unidades: 3,
    projetos: 'MedMovel ×1 + Sorriso+ ×1 + CuidaMulher ×1',
    status: 'im',
    coords: [-41.78, -2.9],
  },
  {
    nome: 'Itararé',
    uf: 'SP',
    unidades: 4,
    projetos: 'CuidaMulher ×1 + Sorriso+ ×1 + MedMovel ×1 + OftalMovel ×1',
    status: 'im',
    coords: [-49.14, -24.11],
  },
  {
    nome: 'Boa Vista',
    uf: 'RR',
    unidades: 3,
    projetos: 'Sorriso+ ×1 + CuidaMulher ×1 + MedMovel ×1',
    status: 'im',
    coords: [-60.67, 2.82],
  },
]

export const metrics = {
  /** unidades em operação (Fortaleza: 3 Vet + 1 CuidaMulher) */
  operating: 4,
  /** unidades em implantação (total contratado em processo) */
  expanding: 21,
  municipalities: cityUnits.length,
  /** estudos de viabilidade em andamento no país */
  feasibility: 12,
  citiesOperating: cityUnits.filter((c) => c.status === 'op').length,
  citiesExpanding: cityUnits.filter((c) => c.status === 'im').length,
}
