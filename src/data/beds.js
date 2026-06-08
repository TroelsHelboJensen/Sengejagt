// Ønskelisten over senge under overvejelse.
//
// Krav til alle modeller:
//   - Bredde min. 180 cm
//   - Længde min. 210 cm
//   - Type: kontinentalseng
//   - Ingen elevation
//
// Priser hentes automatisk via /api/prices (Vercel serverless-funktion).
// For mere præcis hentning kan du udfylde `productUrl` med et direkte
// produkt-link på PriceRunner/Prisjagt — så bruger API'et det frem for
// søgesiden.

export const requirements = {
  minWidth: 180,
  minLength: 210,
  type: 'Kontinentalseng',
  elevation: false,
}

// Hjælpere til at bygge søgelinks ud fra model + mærke.
const search = (base, query) => `${base}${encodeURIComponent(query)}`

const priceRunner = (query) =>
  search('https://www.pricerunner.dk/search?q=', query)

const prisjagt = (query) =>
  search('https://www.prisjagt.dk/search?search=', query)

export const beds = [
  {
    id: 'lya',
    model: 'LYA',
    brand: 'Temprakon',
    retailer: 'Jysk',
    retailerUrl: 'https://www.jysk.dk',
    query: 'Temprakon LYA',
    productUrl: null,
    price: null,
    links: {
      priceRunner: priceRunner('Temprakon LYA'),
      prisjagt: prisjagt('Temprakon LYA'),
    },
  },
  {
    id: 'c300',
    model: 'C300',
    brand: 'Dunlopillo',
    retailer: 'Jysk',
    retailerUrl: 'https://www.jysk.dk',
    query: 'Dunlopillo C300',
    productUrl: null,
    price: null,
    links: {
      priceRunner: priceRunner('Dunlopillo C300'),
      prisjagt: prisjagt('Dunlopillo C300'),
    },
  },
  {
    id: 'prestige',
    model: 'Prestige',
    brand: 'Jensen',
    retailer: 'Jensen Beds',
    retailerUrl: 'https://www.jensenbeds.com',
    query: 'Jensen Prestige',
    productUrl: null,
    price: null,
    links: {
      priceRunner: priceRunner('Jensen Prestige'),
      prisjagt: prisjagt('Jensen Prestige'),
    },
  },
  {
    id: 'supreme',
    model: 'Supreme',
    brand: 'Jensen',
    retailer: 'Jensen Beds',
    retailerUrl: 'https://www.jensenbeds.com',
    query: 'Jensen Supreme',
    productUrl: null,
    price: null,
    links: {
      priceRunner: priceRunner('Jensen Supreme'),
      prisjagt: prisjagt('Jensen Supreme'),
    },
  },
]
