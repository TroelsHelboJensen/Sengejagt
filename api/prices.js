// Vercel serverless-funktion: GET /api/prices
// Live-hentning af aktuelle priser (logikken bor i lib/prices.js). Bruges af
// "Slå priser op"-knappen på forsiden, som VISER priserne — der gemmes intet.

import { beds } from '../src/data/beds.node.mjs'
import { resolveAllPrices } from '../lib/prices.js'

export default async function handler(req, res) {
  const results = await resolveAllPrices(beds)
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({
    updatedAt: new Date().toISOString(),
    results,
  })
}
