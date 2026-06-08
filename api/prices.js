// Vercel serverless-funktion: GET /api/prices
// Live-kald af pris-hentningen. Selve logikken bor i lib/prices.js, så den
// deles med GitHub Action'en der gemmer historik (scripts/snapshot-prices.mjs).

import { beds } from '../src/data/beds.js'
import { resolveAllPrices } from '../lib/prices.js'

export default async function handler(req, res) {
  const results = await resolveAllPrices(beds)
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({
    updatedAt: new Date().toISOString(),
    results,
  })
}
