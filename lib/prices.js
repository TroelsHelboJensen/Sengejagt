// Delt pris-hentningslogik. Bruges af både:
//   - api/prices.js          (Vercel serverless, live-kald fra appen)
//   - scripts/snapshot-prices.mjs (GitHub Action, gemmer historik)
//
// Strategi pr. side:
//   1) JSON-LD (<script type="application/ld+json">) med Product/offers.
//   2) Fallback: regex efter danske pris-mønstre ("12.345 kr", "12.345,-").
// Vælger den laveste fornuftige pris (>= MIN_PRICE) som heuristik.
//
// ADVARSEL: Skrøbeligt. Når PriceRunner/Prisjagt ændrer layout, kan
// udtrækket holde op med at virke. Fejler pænt pr. seng (ok: false).

// En kontinentalseng 180×210 koster typisk titusinder af kroner. Lavere tal
// på siden er oftest tilbehør, levering e.l. — dem ignorerer vi.
const MIN_PRICE = 2000
const MAX_PRICE = 200000

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  'Accept-Language': 'da-DK,da;q=0.9,en;q=0.8',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: BROWSER_HEADERS,
      redirect: 'follow',
    })
    if (!res.ok) {
      return null
    }
    return await res.text()
  } catch {
    return null
  }
}

// Gør "12.345,67" / "12.345" / "12345" til et tal (DKK, øre droppes).
function toNumber(raw) {
  if (raw == null) {
    return null
  }
  const cleaned = String(raw)
    .replace(/\s|kr\.?|dkk/gi, '')
    .replace(/\.(?=\d{3}\b)/g, '') // tusind-separator
    .replace(',', '.')
  const value = Math.round(parseFloat(cleaned))
  return Number.isFinite(value) ? value : null
}

function inRange(value) {
  return value != null && value >= MIN_PRICE && value <= MAX_PRICE
}

// Træk priser ud af JSON-LD offers-blokke.
function pricesFromJsonLd(html) {
  const prices = []
  const blocks = html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )
  for (const match of blocks) {
    let data
    try {
      data = JSON.parse(match[1].trim())
    } catch {
      continue
    }
    const stack = Array.isArray(data) ? [...data] : [data]
    while (stack.length) {
      const node = stack.pop()
      if (node == null || typeof node !== 'object') {
        continue
      }
      const offers = node.offers
      if (offers) {
        for (const offer of [].concat(offers)) {
          const p = toNumber(offer?.price ?? offer?.lowPrice)
          if (inRange(p)) {
            prices.push(p)
          }
        }
      }
      for (const value of Object.values(node)) {
        if (value && typeof value === 'object') {
          stack.push(value)
        }
      }
    }
  }
  return prices
}

// Fallback: find pris-lignende tal i ren tekst.
function pricesFromText(html) {
  const prices = []
  const patterns = [
    /(\d{1,3}(?:\.\d{3})+(?:,\d{2})?)\s*(?:kr|,-)/gi,
    /(?:kr\.?\s*)(\d{1,3}(?:\.\d{3})+(?:,\d{2})?)/gi,
  ]
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const p = toNumber(match[1])
      if (inRange(p)) {
        prices.push(p)
      }
    }
  }
  return prices
}

async function priceForUrl(url) {
  const html = await fetchPage(url)
  if (!html) {
    return null
  }
  const candidates = [...pricesFromJsonLd(html), ...pricesFromText(html)]
  if (!candidates.length) {
    return null
  }
  return Math.min(...candidates)
}

async function resolveBed(bed) {
  // Prøv hvert link i rækkefølge (produkt-/forhandlersider først er bedst).
  // NB: pålidelig auto-scraping er ikke opnået — se note i src/data/beds.js.
  const sources = (bed.links ?? []).map((l) => ({
    source: l.label,
    url: l.url,
  }))

  for (const { source, url } of sources) {
    const price = await priceForUrl(url)
    if (price != null) {
      return { id: bed.id, price, source, ok: true }
    }
  }
  return {
    id: bed.id,
    price: null,
    source: null,
    ok: false,
    note: 'Ingen pris fundet — udfyld evt. productUrl i src/data/beds.js',
  }
}

export async function resolveAllPrices(beds) {
  return Promise.all(beds.map(resolveBed))
}
