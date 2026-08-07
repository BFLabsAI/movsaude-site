/** Canais oficiais da MovSaúde — fonte única para Footer, Contato, etc. */

export const siteContact = {
  instagram: {
    handle: 'movsaudeoficial_',
    label: '@movsaudeoficial_',
    url: 'https://www.instagram.com/movsaudeoficial_/',
  },
  tiktok: {
    handle: 'movsaudeoficial',
    label: '@movsaudeoficial',
    url: 'https://www.tiktok.com/@movsaudeoficial',
  },
  email: {
    address: 'contato@movsaude.com',
    url: 'mailto:contato@movsaude.com',
  },
  phone: {
    /** Exibição legível */
    display: '+55 85 98788-9550',
    /** E.164 / digits for tel: and wa.me */
    e164: '+5585987889550',
    digits: '5585987889550',
    url: 'tel:+5585987889550',
    whatsappUrl: 'https://wa.me/5585987889550',
  },
} as const
