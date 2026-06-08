// Ønskelisten over senge under overvejelse.
//
// Krav til alle modeller:
//   - Bredde min. 180 cm
//   - Længde min. 210 cm
//   - Type: kontinentalseng
//   - Ingen elevation
//
// Priser vedligeholdes MANUELT i src/data/price-history.json (ét snapshot
// pr. måling). Tallene der er "normal/list"-priser for 180×210 pr.
// 2026-06-08; aktuelle tilbud står i `note`. Automatisk scraping er opgivet
// (Jysk blokerer bots, seng.dk/time2sleep er SPA'er).
//
// NB: Jensen J5 = Prestige og J6 = Supreme (samme seng, to navne).
//
// `links` = pris-/forhandler-links (ikon-knapper).
// `reviews` = kort vurdering + kilder med rating hvor den findes.

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
    spring: 'Pocketfjedre 225/m² + 10 cm latex-top, Cooltex Breeze (køle-betræk)',
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
    reviews: {
      rating: null,
      count: null,
      verdict:
        'Blandet: ros for køle-komfort, men gentagne klager over samlekvalitet og holdbarhed.',
      sources: [
        link(
          'Trustpilot',
          '⭐',
          'https://dk.trustpilot.com/review/www.temprakon.com',
        ),
      ],
    },
  },
  {
    id: 'c300',
    model: 'C300',
    brand: 'Dunlopillo',
    retailer: 'Jysk',
    spring: 'Latex/skum, 7 komfortzoner + 8 cm latex-topmadras (allergivenlig)',
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
    reviews: {
      rating: null,
      count: null,
      verdict:
        'Positiv: komfortabel latex, god holdbarhed og allergivenlig (OEKO-TEX). Dunlopillo har lang historik.',
      sources: [
        link('Trustpilot', '⭐', 'https://www.trustpilot.com/review/dunlopillo.dk'),
        link('sove.nu', '📝', 'https://sove.nu/brand/dunlopillo/'),
      ],
    },
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
    reviews: {
      rating: 4.9,
      count: 5500,
      verdict:
        'Fremragende: Jensen Beds 4,9/5 på Trustpilot. 25 års garanti mod fjeder-/rammebrud, Svanemærket, 3 fasthedsgrader (medium/fast/ekstra fast).',
      sources: [
        link(
          'Trustpilot',
          '⭐',
          'https://www.trustpilot.com/review/www.jensen-beds.com',
        ),
      ],
    },
  },
  {
    id: 'supreme',
    model: 'Supreme (J6)',
    brand: 'Jensen',
    retailer: 'time2sleep / seng.dk',
    spring: 'Aloy® 3.0 Pocket (14 cm) — Jensens nyeste, dybere hoftezone',
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
    reviews: {
      rating: 4.9,
      count: 5500,
      verdict:
        'Fremragende: som Prestige + Aloy 3.0 og eksklusive uldtekstiler. Topvurderet; bedst til tungere side-sovere pga. dybere hoftezone.',
      sources: [
        link(
          'Trustpilot',
          '⭐',
          'https://www.trustpilot.com/review/www.jensen-beds.com',
        ),
        link(
          'Ameldo',
          '📝',
          'https://www.ameldo.dk/anmeldelse-test/jensen-supreme-kontinentalseng',
        ),
      ],
    },
  },
]
