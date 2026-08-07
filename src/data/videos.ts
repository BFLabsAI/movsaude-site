/** Lista manual de vídeos do carrossel da Home — troque src/poster/title conforme o conteúdo. */
export type SiteVideo = {
  id: string
  title: string
  src: string
  poster?: string
}

/**
 * Lista manual dos vídeos do slider da Home.
 * Para incluir um novo: coloque o MP4 em /public/videos/, gere a thumb em
 * /public/videos/thumbs/ e adicione um item aqui.
 */
export const homeVideos: SiteVideo[] = [
  {
    id: 'mov-saude',
    title: 'MovSaúde em operação',
    src: '/videos/mov-saude.mp4',
    poster: '/videos/thumbs/mov-saude.jpg',
  },
  {
    id: 'santa-quiteria',
    title: 'Santa Quitéria',
    src: '/videos/mov-santa-quiteria.mp4',
    poster: '/videos/thumbs/mov-santa-quiteria.jpg',
  },
  {
    id: 'frank-carro',
    title: 'Nos bastidores',
    src: '/videos/frank-no-carro.mp4',
    poster: '/videos/thumbs/frank-no-carro.jpg',
  },
  {
    id: 'prov-social-vet-movel',
    title: 'VetMóvel em campo',
    src: '/videos/prov-social-vet-movel.mp4',
    poster: '/videos/thumbs/prov-social-vet-movel.jpg',
  },
]

/** Intervalo do carrossel quando o usuário não está assistindo (ms). */
export const VIDEO_CAROUSEL_INTERVAL_MS = 30_000
