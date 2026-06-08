// Ønskelisten over senge under overvejelse.
//
// Krav til alle modeller:
//   - Bredde min. 180 cm
//   - Længde min. 210 cm
//   - Type: kontinentalseng
//   - Ingen elevation
//
// Priser vedligeholdes MANUELT i src/data/price-history.json (ét snapshot
// pr. måling). Tallene her er "normal/list"-priser for 180×210 pr.
// 2026-06-08; aktuelle tilbud står i `note`. Automatisk scraping er opgivet
// (Jysk blokerer bots, seng.dk/time2sleep er SPA'er).
//
// NB: Jensen J5 = Prestige og J6 = Supreme (samme seng, to navne) — derfor
// kun én post pr. model.
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

const link = (label, icon, url) => ({ label, icon, url })

export const beds = [
  {
    id: 'lya',
    model: 'LYA',
    brand: 'Temprakon',
    retailer: 'Jysk',
    spring: 'Pocketfjedre 225/m², Cooltex Breeze (temperaturregulerende)',
    note: 'pt. udsalg (~14–15.000)',
    links: [
      priceRunner('Temprakon LYA'),
      prisjagt('Temprakon LYA'),
      link(
        'Jysk',
        '🏬',
        'https://jysk.dk/sovevaerelse/kontinentalsenge/kontinentalseng-180x210cm-temprakon-lya-graa-42',
      ),
    ],
  },
  {
    id: 'c300',
    model: 'C300',
    brand: 'Dunlopillo',
    retailer: 'Jysk',
    spring: 'Latex/skum, 7 komfortzoner + 8 cm latex-topmadras',
    note: 'pt. udsalg (~23.000)',
    links: [
      priceRunner('Dunlopillo C300'),
      prisjagt('Dunlopillo C300'),
      link(
        'Jysk',
        '🏬',
        'https://jysk.dk/sovevaerelse/kontinentalsenge/kontinentalseng-180x210-dunlopillo-c300-graa-32',
      ),
    ],
  },
  {
    id: 'prestige',
    model: 'Prestige (J5)',
    brand: 'Jensen',
    retailer: 'time2sleep / seng.dk',
    spring: 'Jensen Pocket (3 separate pocketsystemer), blød skulderzone',
    note: 'pt. tilbud ~38.059',
    links: [
      priceRunner('Jensen Prestige'),
      prisjagt('Jensen Prestige'),
      link('time2sleep', '🛌', 'https://time2sleep.dk/collections/jensen'),
      link(
        'seng.dk',
        '🛏️',
        'https://www.seng.dk/product/xn_01_020_020_003_180x210_02/jensen-j5-kontinentalseng-180x210-cm-med-3-delt-betraek',
      ),
      link(
        'Jensen',
        '⭐',
        'https://jensen-beds.com/dk/senge/prestige-sc21/kontinental/',
      ),
    ],
  },
  {
    id: 'supreme',
    model: 'Supreme (J6)',
    brand: 'Jensen',
    retailer: 'time2sleep / seng.dk',
    spring: 'Aloy® 3.0 Pocket (14 cm) — Jensens nyeste, bedre hoftezone',
    note: 'pt. tilbud ~46.929',
    links: [
      priceRunner('Jensen Supreme'),
      prisjagt('Jensen Supreme'),
      link(
        'time2sleep',
        '🛌',
        'https://time2sleep.dk/products/jensen-supreme-kontinental-180x210',
      ),
      link(
        'seng.dk',
        '🛏️',
        'https://www.seng.dk/product/xn_01_020_020_004_180x210_02/jensen-j6-kontinentalseng-180x210-cm-med-3-delt-betraek',
      ),
      link('Jensen', '⭐', 'https://jensen-beds.com/dk/'),
    ],
  },
]
