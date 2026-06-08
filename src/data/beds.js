// Ønskelisten over senge under overvejelse.
//
// Krav til alle modeller:
//   - Bredde min. 180 cm
//   - Længde min. 210 cm
//   - Type: kontinentalseng
//   - Ingen elevation
//
// Priser vedligeholdes MANUELT i src/data/price-history.json (ét snapshot
// pr. måling). Automatisk scraping viste sig upålidelig: Jysk blokerer bots,
// og seng.dk renderer priser client-side (SPA). Derfor er priserne her
// researchede "fra/list"-priser pr. 2026-06-08 og bruges som basis.
//
// `links` er en liste af pris-/forhandler-links der vises som ikon-knapper.

export const requirements = {
  minWidth: 180,
  minLength: 210,
  type: 'Kontinentalseng',
  elevation: false,
}

const priceRunner = (query) => ({
  label: 'PriceRunner',
  icon: '🏷️',
  url: `https://www.pricerunner.dk/search?q=${encodeURIComponent(query)}`,
})

const prisjagt = (query) => ({
  label: 'Prisjagt',
  icon: '🔍',
  url: `https://www.prisjagt.dk/search?search=${encodeURIComponent(query)}`,
})

const forhandler = (label, url) => ({ label, icon: '🏬', url })

// Browse-links til de to forhandlere brugeren foretrækker (fører Jensen).
const sengDkJensen = {
  label: 'seng.dk',
  icon: '🛌',
  url: 'https://www.seng.dk/brands/jensen/jensen-kontinentalseng',
}
const erlingJensen = {
  label: 'Erling C.',
  icon: '🪑',
  url: 'https://erling-christensen.dk/shop/jensen-senge-458c1.html',
}

export const beds = [
  {
    id: 'lya',
    model: 'LYA',
    brand: 'Temprakon',
    retailer: 'Jysk',
    note: 'pt. udsalg (normalpris 29.999)',
    links: [
      priceRunner('Temprakon LYA'),
      prisjagt('Temprakon LYA'),
      forhandler(
        'Jysk',
        'https://jysk.dk/sovevaerelse/kontinentalsenge/kontinentalseng-180x210cm-temprakon-lya-graa-42',
      ),
    ],
  },
  {
    id: 'c300',
    model: 'C300',
    brand: 'Dunlopillo',
    retailer: 'Jysk',
    note: 'pt. udsalg (normalpris 45.999)',
    links: [
      priceRunner('Dunlopillo C300'),
      prisjagt('Dunlopillo C300'),
      forhandler(
        'Jysk',
        'https://jysk.dk/sovevaerelse/kontinentalsenge/kontinentalseng-180x210-dunlopillo-c300-graa-32',
      ),
    ],
  },
  {
    id: 'prestige',
    model: 'Prestige',
    brand: 'Jensen',
    retailer: 'Delfin Sengecenter',
    note: 'fra-pris; varierer med konfiguration',
    links: [
      priceRunner('Jensen Prestige'),
      prisjagt('Jensen Prestige'),
      forhandler(
        'Delfin',
        'https://www.delfinsengecenter.dk/jensen-prestige-kontinental180x210',
      ),
      sengDkJensen,
      erlingJensen,
    ],
  },
  {
    id: 'supreme',
    model: 'Supreme',
    brand: 'Jensen',
    retailer: 'Delfin Sengecenter',
    note: 'fra-pris (normal 72.198)',
    links: [
      priceRunner('Jensen Supreme'),
      prisjagt('Jensen Supreme'),
      forhandler(
        'Delfin',
        'https://www.delfinsengecenter.dk/jensen-supreme-kontinental-180x210',
      ),
      sengDkJensen,
      erlingJensen,
    ],
  },
  {
    id: 'j5',
    model: 'J5',
    brand: 'Jensen',
    retailer: 'seng.dk',
    note: 'fra-pris, 3-delt betræk',
    links: [
      priceRunner('Jensen J5 kontinental'),
      prisjagt('Jensen J5'),
      forhandler(
        'seng.dk',
        'https://www.seng.dk/product/xn_01_020_020_003_180x210_02/jensen-j5-kontinentalseng-180x210-cm-med-3-delt-betraek',
      ),
      erlingJensen,
    ],
  },
  {
    id: 'j6',
    model: 'J6',
    brand: 'Jensen',
    retailer: 'seng.dk',
    note: 'fra-pris, 3-delt betræk',
    links: [
      priceRunner('Jensen J6 kontinental'),
      prisjagt('Jensen J6'),
      forhandler(
        'seng.dk',
        'https://www.seng.dk/product/xn_01_020_020_004_180x210_02/jensen-j6-kontinentalseng-180x210-cm-med-3-delt-betraek',
      ),
      erlingJensen,
    ],
  },
]
